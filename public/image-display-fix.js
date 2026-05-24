// ✅ إصلاح عرض الصور في المحادثة
// أضف هذا الملف في support.html و admin.html

function displayImageInChat(fileUrl, fileName) {
  // إذا كانت صورة محلية
  if (fileUrl.startsWith('/uploads/')) {
    return `<img src="${fileUrl}" style="max-width:200px;border-radius:8px;margin-top:4px;cursor:pointer" onclick="openImageFullscreen('${fileUrl}')" alt="${fileName}">`;
  }
  
  // إذا كانت صورة Base64
  if (fileUrl.startsWith('data:image')) {
    return `<img src="${fileUrl}" style="max-width:200px;border-radius:8px;margin-top:4px;cursor:pointer" onclick="openImageFullscreen('${fileUrl}')" alt="${fileName}">`;
  }
  
  // إذا كانت صورة من URL خارجي
  if (fileUrl.startsWith('http')) {
    return `<img src="${fileUrl}" style="max-width:200px;border-radius:8px;margin-top:4px;cursor:pointer" onclick="openImageFullscreen('${fileUrl}')" alt="${fileName}">`;
  }
  
  return '';
}

function openImageFullscreen(imageUrl) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    cursor: pointer;
  `;
  
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(255,255,255,0.2);
  `;
  
  modal.appendChild(img);
  modal.onclick = () => modal.remove();
  document.body.appendChild(modal);
}

// دالة محسّنة لإضافة الصور إلى الرسائل
function appendImageToMessage(messageElement, fileUrl, fileName, fileType) {
  if (!fileType?.startsWith('image/')) return;
  
  const imgContainer = document.createElement('div');
  imgContainer.className = 'msg-image-container';
  imgContainer.style.cssText = `
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  `;
  
  const img = document.createElement('img');
  img.src = fileUrl;
  img.style.cssText = `
    max-width: 200px;
    border-radius: 8px;
    cursor: pointer;
    transition: transform 0.2s;
  `;
  img.onmouseover = () => img.style.transform = 'scale(1.05)';
  img.onmouseout = () => img.style.transform = 'scale(1)';
  img.onclick = () => openImageFullscreen(fileUrl);
  
  imgContainer.appendChild(img);
  messageElement.appendChild(imgContainer);
}