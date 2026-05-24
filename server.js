
// ابحث عن قسم الـ app.get('/api/upload') واضف هذا الكود بعده مباشرة:

// Endpoint لعرض الصور المخزنة
app.get('/api/image/:id', async (req, res) => {
  try {
    const image = await Chat.findById(req.params.id);
    if (!image || !image.fileUrl) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // إذا كانت صورة Base64
    if (image.fileUrl.startsWith('data:image')) {
      const base64Data = image.fileUrl.split(',')[1];
      const mimeType = image.fileUrl.match(/data:([^;]+)/)[1];
      res.setHeader('Content-Type', mimeType);
      res.send(Buffer.from(base64Data, 'base64'));
    } 
    // إذا كانت مسار محلي
    else if (image.fileUrl.startsWith('/uploads/')) {
      res.sendFile(path.join(__dirname, 'public', image.fileUrl));
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Endpoint لحل مشكلة CORS في الصور
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
});
