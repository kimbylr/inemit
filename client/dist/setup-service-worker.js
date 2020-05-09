if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      () => {
        console.log('Service Worker registration completed');
      },
      err => {
        console.log('Service Worker registration failed', err);
      },
    );
  });
} else {
  console.log('Service Workers not supported');
}
