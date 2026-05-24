// ✅ إصلاح تزامن Reactions بين Admin و User
// أضف هذا الملف في support.html و admin.html

let currentAdminId = null;
let currentUserId = null;

// دالة تحديث الـ Reactions بدقة
function updateReactionDisplay(messageElement, reactions, currentId) {
  if (!reactions || reactions.length === 0) {
    const existingReactions = messageElement.querySelector('.msg-reactions');
    if (existingReactions) existingReactions.remove();
    return;
  }

  // حساب عدد كل emoji
  const counts = reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  // إنشاء عنصر الـ reactions
  let reactEl = messageElement.querySelector('.msg-reactions');
  if (!reactEl) {
    reactEl = document.createElement('div');
    reactEl.className = 'msg-reactions';
    reactEl.style.cssText = `
      display: flex;
      gap: 3px;
      margin-top: 6px;
      flex-wrap: wrap;
      position: absolute;
      bottom: -10px;
      right: 8px;
    `;
    messageElement.appendChild(reactEl);
  }

  // تحديث محتوى الـ reactions
  reactEl.innerHTML = Object.entries(counts)
    .map(([emoji, count]) => {
      const isActive = reactions.some(r => r.type === emoji && String(r.by) === String(currentId));
      return `
        <span class="reaction-badge${isActive ? ' active' : ''}" 
              onclick="reactToMessage(this.closest('.amsg, .msg').dataset.msgId, '${emoji}')"
              style="
                background: ${isActive ? 'rgba(255, 107, 53, .15)' : 'var(--panel-bg, #fff)'};
                border: 1px solid ${isActive ? 'var(--accent)' : 'var(--border-color)'};
                border-radius: 12px;
                padding: 1px 6px;
                font-size: .7rem;
                display: flex;
                align-items: center;
                gap: 3px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
                cursor: pointer;
              ">
          ${emoji}${count > 1 ? ' ' + count : ''}
        </span>
      `;
    })
    .join('');
}

// دالة تفاعل محسّنة
async function reactToMessage(messageId, emoji) {
  if (!messageId || !emoji) return;

  const payload = {
    messageId,
    emoji,
    userId: currentUserId || currentAdminId,
    targetUserId: currentUserId ? undefined : null
  };

  // حاول الإرسال عبر Socket أولاً
  if (window.supportSocket && window.supportSocket.connected) {
    window.supportSocket.emit('support:reaction', payload);
    console.log('✅ Reaction sent via Socket:', payload);
    return;
  }

  // إذا فشل Socket، استخدم API
  try {
    const endpoint = currentAdminId 
      ? '/api/admin/conversations/reaction' 
      : '/api/user/conversations/reaction';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ messageId, emoji })
    });

    if (response.ok) {
      const updatedMsg = await response.json();
      const msgElement = document.querySelector(`[data-msg-id="${messageId}"]`);
      if (msgElement && updatedMsg.reactions) {
        updateReactionDisplay(msgElement, updatedMsg.reactions, currentAdminId || currentUserId);
      }
      console.log('✅ Reaction sent via API:', payload);
    }
  } catch (e) {
    console.error('❌ Failed to send reaction:', e);
  }
}

// تهيئة معرفات المستخدم والـ Admin
async function initializeIds() {
  try {
    const profile = await fetch('/api/user/profile', { credentials: 'include' }).then(r => r.json());
    if (profile._id) {
      currentUserId = profile._id;
      sessionStorage.setItem('userId', profile._id);
    }
  } catch (e) {
    console.warn('Not logged in as user');
  }

  try {
    const admin = await fetch('/api/admin/me', { credentials: 'include' }).then(r => r.json());
    if (admin._id) {
      currentAdminId = admin._id;
      sessionStorage.setItem('adminId', admin._id);
    }
  } catch (e) {
    console.warn('Not logged in as admin');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeIds);
} else {
  initializeIds();
}