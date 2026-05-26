self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  // Просто пропускает запросы, активируя функцию PWA установки
});
