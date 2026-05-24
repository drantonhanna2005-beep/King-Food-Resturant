// ✅ إصلاح Socket.IO Real-Time للمحادثات
// أضف هذا الملف في support.html و admin.html

let supportSocket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;

function initializeSocket() {
  if (supportSocket && supportSocket.connected) return;
  
  supportSocket = io(undefined, {
    reconnection: true,
    reconnectionDelay: RECONNECT_DELAY,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    transports: ['websocket', 'polling']
  });

  supportSocket.on('connect', () => {
    console.log('✅ Socket connected:', supportSocket.id);
    reconnectAttempts = 0;
    
    // إذا كان المستخدم موجود، أضفه إلى غرفة الخاص به
    const userId = getCurrentUserId();
    if (userId) {
      supportSocket.emit('join-user-room', userId);
      console.log('👤 User joined room:', userId);
    }
  });

  supportSocket.on('disconnect', () => {
    console.warn('⚠️ Socket disconnected');
  });

  supportSocket.on('support:new-message', (msg) => {
    console.log('📨 New message received:', msg);
    if (window.appendMessage) {
      window.appendMessage(msg);
    }
  });

  supportSocket.on('support:admin-feed', (msg) => {
    console.log('🔔 Admin feed update:', msg);
    if (window.renderConversations) {
      window.renderConversations();
    }
  });

  supportSocket.on('support:error', (err) => {
    console.error('❌ Socket error:', err);
  });
}

function sendMessageRealTime(payload) {
  if (supportSocket && supportSocket.connected) {
    if (payload.type === 'user-message') {
      supportSocket.emit('support:user-message', payload);
    } else if (payload.type === 'admin-reply') {
      supportSocket.emit('support:admin-reply', payload);
    } else if (payload.type === 'reaction') {
      supportSocket.emit('support:reaction', payload);
    }
    return true;
  }
  return false;
}

function getCurrentUserId() {
  // يعود الـ user ID من الـ session أو local storage
  return sessionStorage.getItem('userId') || localStorage.getItem('userId');
}

// تهيئة Socket عند تحميل الصفحة
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSocket);
} else {
  initializeSocket();
}