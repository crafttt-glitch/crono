const CACHE_NAME = 'med8-turbo-v1';
const FILES = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. Instalação
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES);
    })
  );
});

// 2. A Mágica: "Stale-While-Revalidate"
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Tenta pegar do cache imediatamente
      const cachedResponse = await cache.match(evt.request);
      
      // DISPARA A ATUALIZAÇÃO EM BACKGROUND
      // O navegador vai na internet buscar a versão nova
      const fetchPromise = fetch(evt.request).then((networkResponse) => {
        // Se a internet respondeu ok, atualiza o cache para a próxima
        if (networkResponse && networkResponse.status === 200) {
          cache.put(evt.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(() => {
        // Se estiver offline, não faz nada, só segue o baile
      });

      // REGRA DE OURO:
      // Se tem cache, entrega ele NA HORA (Instantâneo).
      // Se não tem (primeira vez), espera a internet.
      return cachedResponse || fetchPromise;
    })
  );
});
