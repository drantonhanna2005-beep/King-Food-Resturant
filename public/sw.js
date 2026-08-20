const CACHE_NAME = 'king-food-app-v1';
const ASSETS = [
  '/home.html',
  '/about.html',
  '/menu.html',
  '/contact.html',
  '/profile.html',
  '/orders.html',
  '/wishlist.html',
  '/notifications.html',
  '/cart.html',
  '/support.html',
  '/chat.html',
  '/admin.html',
  '/login.html',
  '/register.html',
  '/admin.css',
  '/admin.js',
  '/site.css',
  '/site.js',
  '/i18n.js',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('✅ Service Worker: Caching assets');
      return cache.addAll(ASSETS).catch(err => {
        console.warn('⚠️ Some assets failed to cache:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log('🗑️ Deleting old cache:', k);
            return caches.delete(k);
          })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // إذا كان الطلب للـ API، استخدم الشبكة مع fallback للـ cache
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(async (err) => {
        console.warn('⚠️ Service Worker: API request failed:', event.request.url, err);
        const cached = await caches.match(event.request);
        // respondWith(undefined) would surface as an unreadable network error
        return cached || new Response(
          JSON.stringify({ message: 'You appear to be offline. Please check your connection.' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // للملفات الثابتة، استخدم الـ cache مع fallback للشبكة
  event.respondWith(
    caches.match(event.request)
      .then((cached) => cached || fetch(event.request))
      .catch((err) => {
        console.warn('⚠️ Service Worker: asset request failed:', event.request.url, err);
        return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      })
  );
});