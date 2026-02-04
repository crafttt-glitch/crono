const NOME_CACHE = 'med8-offline-v1';
const ARQUIVOS_PARA_SALVAR = [
  './',
  './index.html',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 1. Instala e salva os arquivos
self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(NOME_CACHE).then((cache) => {
      console.log('Salvando arquivos para uso offline...');
      return cache.addAll(ARQUIVOS_PARA_SALVAR);
    })
  );
});

// 2. Quando você tentar abrir o site...
self.addEventListener('fetch', (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respostaSalva) => {
      // Se tiver salvo, entrega o salvo. Se não, tenta a internet.
      return respostaSalva || fetch(evento.request);
    })
  );
});