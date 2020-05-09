// PWA witch cache-first
const CACHE = 'inemit-cache-v1';
const precacheFiles = ['bundle.js'];

// Install SW
self.addEventListener('install', function(event) {
  console.log('PWA: Installing');
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      console.log('PWA: Caching pages during install');
      return cache.addAll(precacheFiles);
    }),
  );
});

// Allow SW to control current page
self.addEventListener('activate', function(event) {
  console.log('PWA: Claiming clients for current page');
  event.waitUntil(self.clients.claim());
});

// optimise asset fetching (but exclude API calls)
self.addEventListener('fetch', function(event) {
  if (
    event.request.method !== 'GET' ||
    event.request.url.indexOf('https://inem.it') !== 0 ||
    event.request.url.indexOf('http://localhost') !== 0
  ) {
    return;
  }

  event.respondWith(
    checkCache(event.request).then(
      function(response) {
        // found in cache

        // update (for next time)
        event.waitUntil(
          fetch(event.request).then(function(response) {
            return updateCache(event.request, response);
          }),
        );

        return response;
      },
      function() {
        // not in cache
        return fetch(event.request)
          .then(function(response) {
            // success -> add/update in cache
            event.waitUntil(updateCache(event.request, response.clone()));
            return response;
          })
          .catch(function(error) {
            console.log('PWA: Network request failed and no cache.' + error);
          });
      },
    ),
  );
});

function checkCache(request) {
  return caches.open(CACHE).then(function(cache) {
    return cache.match(request).then(function(matching) {
      if (!matching || matching.status === 404) {
        return Promise.reject('no-match');
      }

      return matching;
    });
  });
}

function updateCache(request, response) {
  return caches.open(CACHE).then(function(cache) {
    return cache.put(request, response);
  });
}
