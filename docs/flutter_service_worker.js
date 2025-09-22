'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/asset/fonts/Arial/arial.ttf": "fa3228aadde0db988e1822c2f736c131",
"assets/asset/fonts/bodoni/BodoniFLF-Italic.ttf": "5ba444943c48a93ee216c47ad2f8f13d",
"assets/asset/fonts/bodoni/BodoniFLF-Roman.ttf": "a5c77dca0bba1293ef0ff6154925a6ca",
"assets/asset/fonts/brexon/Brexon-Italic.ttf": "f9fe67bf47fcc4ff21743e808ef10f49",
"assets/asset/fonts/brexon/Brexon-Regular.ttf": "96fe8a87db2575df9c779e30bcb28e30",
"assets/asset/fonts/ComicSans/comic.ttf": "cb5a21a92d77658df1beee4d51b72777",
"assets/asset/fonts/fonsera-sans/Fonsera.otf": "5397e90ed9da6575486b06ae09461b1d",
"assets/asset/fonts/ImpactRegular/impact.ttf": "f12902024f7b77ee4c34557ee6f3818b",
"assets/asset/fonts/milky-time/MilkyTimeDemoRegular.ttf": "3c3734dd0088429886f6d1795f5588e9",
"assets/asset/fonts/nitro-chargers/Nitro_Chargers.otf": "65e77358ccd3c98e59c10c0963997497",
"assets/asset/fonts/playball/Playball.ttf": "2ad930f1ac108e2693026444e6733996",
"assets/asset/fonts/sweet-carollina/Sweet%2520Carollina.ttf": "f99df64afb701427d5ecfd1776bac79f",
"assets/asset/fonts/theren/THEREN-Trial.otf": "fd6a076ba701eb5ae273edd65351a996",
"assets/asset/icons/backbtn.png": "69f368f0cfa434241c556b38699fa07b",
"assets/asset/icons/calendaric.png": "f346976cfbb97c5c27fa92f0edb61d84",
"assets/asset/icons/cloud.png": "9a30c9671e6f1b8232e1de862c5b5710",
"assets/asset/icons/estrelas.png": "0a24827fc7e86a9a6b62b2edde3ae029",
"assets/asset/icons/extraAmarelo.png": "0d23115415601424d678ee690f9981a8",
"assets/asset/icons/extraLilas.png": "228b26d151e33f5c44cda7dc1ca2fa07",
"assets/asset/icons/gratoapor.png": "d3cbbbfc9a2d01ba2e776870a7baf548",
"assets/asset/icons/hoje%2520nao%2520posso%2520esquecer.png": "c92f9c91efbd0bb2b49252261a1bf687",
"assets/asset/icons/listaEstudos.png": "bf8544b617ab999aad8cbc39f36b0b11",
"assets/asset/icons/metasdoMes.png": "d2ed29d5b7977737a7c28f3c75c4190e",
"assets/asset/icons/meuDiario.png": "db5012380fd187e8bf6f63bcc3a9235b",
"assets/asset/icons/meusPensamentos.png": "48bc3d06eb80465e38df0b512aa74c6f",
"assets/asset/icons/minhasTarefas.png": "9724635784e319263bdd9698a6ae7aff",
"assets/asset/ic_launcher.png": "245e62837559211a3ca654a4cec0c139",
"assets/AssetManifest.bin": "30c6a73c6485ff5e247c0288055feff4",
"assets/AssetManifest.bin.json": "dc4b61322250ccf223dea04280cd3b62",
"assets/AssetManifest.json": "1c341c8700aa99455e233e7623e1563d",
"assets/FontManifest.json": "bfa62ff8a1487c97a4b5fc233998f72b",
"assets/fonts/MaterialIcons-Regular.otf": "3a19583695427e9fd0ad8c65964f9a53",
"assets/NOTICES": "92494cf68194b0f83c3cb8da6c80e4a5",
"assets/packages/media_kit/assets/web/hls1.4.10.js": "bd60e2701c42b6bf2c339dcf5d495865",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "140ccb7d34d0a55065fbd422b843add6",
"canvaskit/canvaskit.js.symbols": "58832fbed59e00d2190aa295c4d70360",
"canvaskit/canvaskit.wasm": "07b9f5853202304d3b0749d9306573cc",
"canvaskit/chromium/canvaskit.js": "5e27aae346eee469027c80af0751d53d",
"canvaskit/chromium/canvaskit.js.symbols": "193deaca1a1424049326d4a91ad1d88d",
"canvaskit/chromium/canvaskit.wasm": "24c77e750a7fa6d474198905249ff506",
"canvaskit/skwasm.js": "1ef3ea3a0fec4569e5d531da25f34095",
"canvaskit/skwasm.js.symbols": "0088242d10d7e7d6d2649d1fe1bda7c1",
"canvaskit/skwasm.wasm": "264db41426307cfc7fa44b95a7772109",
"canvaskit/skwasm_heavy.js": "413f5b2b2d9345f37de148e2544f584f",
"canvaskit/skwasm_heavy.js.symbols": "3c01ec03b5de6d62c34e17014d1decd3",
"canvaskit/skwasm_heavy.wasm": "8034ad26ba2485dab2fd49bdd786837b",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"flutter.js": "888483df48293866f9f41d3d9274a779",
"flutter_bootstrap.js": "cb4bf8b73584d027a8fa23782dcfa8c0",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "99e163ec67db72b00189d83c584360e3",
"/": "99e163ec67db72b00189d83c584360e3",
"main.dart.js": "cce11108425615d9b69973f0609cf4b3",
"main.dart.mjs": "535ca7ed3230a8df188fd0825a0be764",
"main.dart.wasm": "dcf1b515a5eb95bc3e18da37a413701f",
"manifest.json": "479af71d7eee81706d777365fe2c8d31",
"version.json": "1f90de8d92f6035470fe900b5bafd547"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"main.dart.wasm",
"main.dart.mjs",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
