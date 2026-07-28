const CACHE_NAME = 'photo-app-v1';
const urlsToCache = [
  './index.html',
  './manifest.json'
];

// تثبيت عامل الخلفية
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// تفعيل عامل الخلفية
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// جلب البيانات (مع تمرير الاتصالات السحابية مباشرة)
self.addEventListener('fetch', event => {
  // عدم تدخل الكاش في طلبات Google Script والمزامنة
  if (event.request.url.includes('script.google.com')) {
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});