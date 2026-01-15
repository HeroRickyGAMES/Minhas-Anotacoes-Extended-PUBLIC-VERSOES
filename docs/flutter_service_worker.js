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
"assets/AssetManifest.bin": "2d1aa900f6557fc7ada59a99d7e814ae",
"assets/AssetManifest.bin.json": "496f85ec3fe348866dc3897235b9d111",
"assets/FontManifest.json": "bfa62ff8a1487c97a4b5fc233998f72b",
"assets/fonts/MaterialIcons-Regular.otf": "1da3aaeac8d8cf22b8c60627d18b7d14",
"assets/NOTICES": "ee929c9c6e7e62a6042c50cd072f8f9e",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/shaders/stretch_effect.frag": "40d68efbbf360632f614c731219e95f0",
"canvaskit/canvaskit.js": "8331fe38e66b3a898c4f37648aaf7ee2",
"canvaskit/canvaskit.js.symbols": "a3c9f77715b642d0437d9c275caba91e",
"canvaskit/canvaskit.wasm": "9b6a7830bf26959b200594729d73538e",
"canvaskit/chromium/canvaskit.js": "a80c765aaa8af8645c9fb1aae53f9abf",
"canvaskit/chromium/canvaskit.js.symbols": "e2d09f0e434bc118bf67dae526737d07",
"canvaskit/chromium/canvaskit.wasm": "a726e3f75a84fcdf495a15817c63a35d",
"canvaskit/skwasm.js": "8060d46e9a4901ca9991edd3a26be4f0",
"canvaskit/skwasm.js.symbols": "3a4aadf4e8141f284bd524976b1d6bdc",
"canvaskit/skwasm.wasm": "7e5f3afdd3b0747a1fd4517cea239898",
"canvaskit/skwasm_heavy.js": "740d43a6b8240ef9e23eed8c48840da4",
"canvaskit/skwasm_heavy.js.symbols": "0755b4fb399918388d71b59ad390b055",
"canvaskit/skwasm_heavy.wasm": "b0be7910760d205ea4e011458df6ee01",
"favicon.png": "245e62837559211a3ca654a4cec0c139",
"flutter.js": "24bc71911b75b5f8135c949e27a2984e",
"flutter_bootstrap.js": "c7c7da42a6f6bf065a7002a188a244e8",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "99e163ec67db72b00189d83c584360e3",
"/": "99e163ec67db72b00189d83c584360e3",
"main.dart.js": "319227031b70b688d11fff7cdddbeab3",
"manifest.json": "479af71d7eee81706d777365fe2c8d31",
"version.json": "efa2bfb679a9089f2380d623c90632ad"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
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
