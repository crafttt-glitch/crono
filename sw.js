const CACHE_NAME = 'med8-dinamico';
const FILES = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. Instalação (Cache inicial)
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES);
    })
  );
});

// 2. A Mágica: REDE PRIMEIRO, CACHE DEPOIS
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    fetch(evt.request)
      .then((networkResponse) => {
        // Se a internet funcionou:
        // 1. Clona a resposta (para salvar uma cópia)
        const responseClone = networkResponse.clone();
        
        // 2. Atualiza o cache automaticamente com a versão nova
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(evt.request, responseClone);
        });

        // 3. Entrega a versão da internet pro usuário
        return networkResponse;
      })
      .catch(() => {
        // Se a internet FALHOU (Offline):
        // Entrega o que tiver salvo no cache
        return caches.match(evt.request);
      })
  );
});
