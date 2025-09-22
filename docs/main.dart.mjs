// Compiles a dart2wasm-generated main module from `source` which can then
// instantiatable via the `instantiate` method.
//
// `source` needs to be a `Response` object (or promise thereof) e.g. created
// via the `fetch()` JS API.
export async function compileStreaming(source) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(
      await WebAssembly.compileStreaming(source, builtins), builtins);
}

// Compiles a dart2wasm-generated wasm modules from `bytes` which is then
// instantiatable via the `instantiate` method.
export async function compile(bytes) {
  const builtins = {builtins: ['js-string']};
  return new CompiledApp(await WebAssembly.compile(bytes, builtins), builtins);
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export async function instantiate(modulePromise, importObjectPromise) {
  var moduleOrCompiledApp = await modulePromise;
  if (!(moduleOrCompiledApp instanceof CompiledApp)) {
    moduleOrCompiledApp = new CompiledApp(moduleOrCompiledApp);
  }
  const instantiatedApp = await moduleOrCompiledApp.instantiate(await importObjectPromise);
  return instantiatedApp.instantiatedModule;
}

// DEPRECATED: Please use `compile` or `compileStreaming` to get a compiled app,
// use `instantiate` method to get an instantiated app and then call
// `invokeMain` to invoke the main function.
export const invoke = (moduleInstance, ...args) => {
  moduleInstance.exports.$invokeMain(args);
}

class CompiledApp {
  constructor(module, builtins) {
    this.module = module;
    this.builtins = builtins;
  }

  // The second argument is an options object containing:
  // `loadDeferredWasm` is a JS function that takes a module name matching a
  //   wasm file produced by the dart2wasm compiler and returns the bytes to
  //   load the module. These bytes can be in either a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`.
  // `loadDynamicModule` is a JS function that takes two string names matching,
  //   in order, a wasm file produced by the dart2wasm compiler during dynamic
  //   module compilation and a corresponding js file produced by the same
  //   compilation. It should return a JS Array containing 2 elements. The first
  //   should be the bytes for the wasm module in a format supported by
  //   `WebAssembly.compile` or `WebAssembly.compileStreaming`. The second
  //   should be the result of using the JS 'import' API on the js file path.
  async instantiate(additionalImports, {loadDeferredWasm, loadDynamicModule} = {}) {
    let dartInstance;

    // Prints to the console
    function printToConsole(value) {
      if (typeof dartPrint == "function") {
        dartPrint(value);
        return;
      }
      if (typeof console == "object" && typeof console.log != "undefined") {
        console.log(value);
        return;
      }
      if (typeof print == "function") {
        print(value);
        return;
      }

      throw "Unable to print message: " + value;
    }

    // A special symbol attached to functions that wrap Dart functions.
    const jsWrappedDartFunctionSymbol = Symbol("JSWrappedDartFunction");

    function finalizeWrapper(dartFunction, wrapped) {
      wrapped.dartFunction = dartFunction;
      wrapped[jsWrappedDartFunctionSymbol] = true;
      return wrapped;
    }

    // Imports
    const dart2wasm = {
            _4: (o, c) => o instanceof c,
      _7: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._7(f,arguments.length,x0) }),
      _8: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._8(f,arguments.length,x0,x1) }),
      _37: x0 => new Array(x0),
      _39: x0 => x0.length,
      _41: (x0,x1) => x0[x1],
      _42: (x0,x1,x2) => { x0[x1] = x2 },
      _43: x0 => new Promise(x0),
      _45: (x0,x1,x2) => new DataView(x0,x1,x2),
      _47: x0 => new Int8Array(x0),
      _48: (x0,x1,x2) => new Uint8Array(x0,x1,x2),
      _49: x0 => new Uint8Array(x0),
      _51: x0 => new Uint8ClampedArray(x0),
      _53: x0 => new Int16Array(x0),
      _55: x0 => new Uint16Array(x0),
      _57: x0 => new Int32Array(x0),
      _59: x0 => new Uint32Array(x0),
      _61: x0 => new Float32Array(x0),
      _63: x0 => new Float64Array(x0),
      _65: (x0,x1,x2) => x0.call(x1,x2),
      _70: (decoder, codeUnits) => decoder.decode(codeUnits),
      _71: () => new TextDecoder("utf-8", {fatal: true}),
      _72: () => new TextDecoder("utf-8", {fatal: false}),
      _73: (s) => +s,
      _74: x0 => new Uint8Array(x0),
      _75: (x0,x1,x2) => x0.set(x1,x2),
      _76: (x0,x1) => x0.transferFromImageBitmap(x1),
      _77: x0 => x0.arrayBuffer(),
      _78: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._78(f,arguments.length,x0) }),
      _79: x0 => new window.FinalizationRegistry(x0),
      _80: (x0,x1,x2,x3) => x0.register(x1,x2,x3),
      _81: (x0,x1) => x0.unregister(x1),
      _82: (x0,x1,x2) => x0.slice(x1,x2),
      _83: (x0,x1) => x0.decode(x1),
      _84: (x0,x1) => x0.segment(x1),
      _85: () => new TextDecoder(),
      _87: x0 => x0.click(),
      _88: x0 => x0.buffer,
      _89: x0 => x0.wasmMemory,
      _90: () => globalThis.window._flutter_skwasmInstance,
      _91: x0 => x0.rasterStartMilliseconds,
      _92: x0 => x0.rasterEndMilliseconds,
      _93: x0 => x0.imageBitmaps,
      _120: x0 => x0.remove(),
      _121: (x0,x1) => x0.append(x1),
      _122: (x0,x1,x2) => x0.insertBefore(x1,x2),
      _123: (x0,x1) => x0.querySelector(x1),
      _125: (x0,x1) => x0.removeChild(x1),
      _203: x0 => x0.stopPropagation(),
      _204: x0 => x0.preventDefault(),
      _206: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _251: x0 => x0.unlock(),
      _252: x0 => x0.getReader(),
      _253: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _254: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _255: (x0,x1) => x0.item(x1),
      _256: x0 => x0.next(),
      _257: x0 => x0.now(),
      _258: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._258(f,arguments.length,x0) }),
      _259: (x0,x1) => x0.addListener(x1),
      _260: (x0,x1) => x0.removeListener(x1),
      _261: (x0,x1) => x0.matchMedia(x1),
      _262: (x0,x1) => x0.revokeObjectURL(x1),
      _263: x0 => x0.close(),
      _264: (x0,x1,x2,x3,x4) => ({type: x0,data: x1,premultiplyAlpha: x2,colorSpaceConversion: x3,preferAnimation: x4}),
      _265: x0 => new window.ImageDecoder(x0),
      _266: x0 => ({frameIndex: x0}),
      _267: (x0,x1) => x0.decode(x1),
      _268: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._268(f,arguments.length,x0) }),
      _269: (x0,x1) => x0.getModifierState(x1),
      _270: (x0,x1) => x0.removeProperty(x1),
      _271: (x0,x1) => x0.prepend(x1),
      _272: x0 => x0.disconnect(),
      _273: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._273(f,arguments.length,x0) }),
      _274: (x0,x1) => x0.getAttribute(x1),
      _275: (x0,x1) => x0.contains(x1),
      _276: x0 => x0.blur(),
      _277: x0 => x0.hasFocus(),
      _278: (x0,x1) => x0.hasAttribute(x1),
      _279: (x0,x1) => x0.getModifierState(x1),
      _280: (x0,x1) => x0.appendChild(x1),
      _281: (x0,x1) => x0.createTextNode(x1),
      _282: (x0,x1) => x0.removeAttribute(x1),
      _283: x0 => x0.getBoundingClientRect(),
      _284: (x0,x1) => x0.observe(x1),
      _285: x0 => x0.disconnect(),
      _286: (x0,x1) => x0.closest(x1),
      _696: () => globalThis.window.flutterConfiguration,
      _697: x0 => x0.assetBase,
      _703: x0 => x0.debugShowSemanticsNodes,
      _704: x0 => x0.hostElement,
      _705: x0 => x0.multiViewEnabled,
      _706: x0 => x0.nonce,
      _708: x0 => x0.fontFallbackBaseUrl,
      _712: x0 => x0.console,
      _713: x0 => x0.devicePixelRatio,
      _714: x0 => x0.document,
      _715: x0 => x0.history,
      _716: x0 => x0.innerHeight,
      _717: x0 => x0.innerWidth,
      _718: x0 => x0.location,
      _719: x0 => x0.navigator,
      _720: x0 => x0.visualViewport,
      _721: x0 => x0.performance,
      _723: x0 => x0.URL,
      _725: (x0,x1) => x0.getComputedStyle(x1),
      _726: x0 => x0.screen,
      _727: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._727(f,arguments.length,x0) }),
      _728: (x0,x1) => x0.requestAnimationFrame(x1),
      _733: (x0,x1) => x0.warn(x1),
      _735: (x0,x1) => x0.debug(x1),
      _736: x0 => globalThis.parseFloat(x0),
      _737: () => globalThis.window,
      _738: () => globalThis.Intl,
      _739: () => globalThis.Symbol,
      _740: (x0,x1,x2,x3,x4) => globalThis.createImageBitmap(x0,x1,x2,x3,x4),
      _742: x0 => x0.clipboard,
      _743: x0 => x0.maxTouchPoints,
      _744: x0 => x0.vendor,
      _745: x0 => x0.language,
      _746: x0 => x0.platform,
      _747: x0 => x0.userAgent,
      _748: (x0,x1) => x0.vibrate(x1),
      _749: x0 => x0.languages,
      _750: x0 => x0.documentElement,
      _751: (x0,x1) => x0.querySelector(x1),
      _754: (x0,x1) => x0.createElement(x1),
      _757: (x0,x1) => x0.createEvent(x1),
      _758: x0 => x0.activeElement,
      _761: x0 => x0.head,
      _762: x0 => x0.body,
      _764: (x0,x1) => { x0.title = x1 },
      _767: x0 => x0.visibilityState,
      _768: () => globalThis.document,
      _769: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._769(f,arguments.length,x0) }),
      _770: (x0,x1) => x0.dispatchEvent(x1),
      _778: x0 => x0.target,
      _780: x0 => x0.timeStamp,
      _781: x0 => x0.type,
      _783: (x0,x1,x2,x3) => x0.initEvent(x1,x2,x3),
      _790: x0 => x0.firstChild,
      _794: x0 => x0.parentElement,
      _796: (x0,x1) => { x0.textContent = x1 },
      _797: x0 => x0.parentNode,
      _799: x0 => x0.isConnected,
      _803: x0 => x0.firstElementChild,
      _805: x0 => x0.nextElementSibling,
      _806: x0 => x0.clientHeight,
      _807: x0 => x0.clientWidth,
      _808: x0 => x0.offsetHeight,
      _809: x0 => x0.offsetWidth,
      _810: x0 => x0.id,
      _811: (x0,x1) => { x0.id = x1 },
      _814: (x0,x1) => { x0.spellcheck = x1 },
      _815: x0 => x0.tagName,
      _816: x0 => x0.style,
      _818: (x0,x1) => x0.querySelectorAll(x1),
      _819: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _820: x0 => x0.tabIndex,
      _821: (x0,x1) => { x0.tabIndex = x1 },
      _822: (x0,x1) => x0.focus(x1),
      _823: x0 => x0.scrollTop,
      _824: (x0,x1) => { x0.scrollTop = x1 },
      _825: x0 => x0.scrollLeft,
      _826: (x0,x1) => { x0.scrollLeft = x1 },
      _827: x0 => x0.classList,
      _829: (x0,x1) => { x0.className = x1 },
      _831: (x0,x1) => x0.getElementsByClassName(x1),
      _832: (x0,x1) => x0.attachShadow(x1),
      _835: x0 => x0.computedStyleMap(),
      _836: (x0,x1) => x0.get(x1),
      _842: (x0,x1) => x0.getPropertyValue(x1),
      _843: (x0,x1,x2,x3) => x0.setProperty(x1,x2,x3),
      _844: x0 => x0.offsetLeft,
      _845: x0 => x0.offsetTop,
      _846: x0 => x0.offsetParent,
      _848: (x0,x1) => { x0.name = x1 },
      _849: x0 => x0.content,
      _850: (x0,x1) => { x0.content = x1 },
      _854: (x0,x1) => { x0.src = x1 },
      _855: x0 => x0.naturalWidth,
      _856: x0 => x0.naturalHeight,
      _860: (x0,x1) => { x0.crossOrigin = x1 },
      _862: (x0,x1) => { x0.decoding = x1 },
      _863: x0 => x0.decode(),
      _868: (x0,x1) => { x0.nonce = x1 },
      _873: (x0,x1) => { x0.width = x1 },
      _875: (x0,x1) => { x0.height = x1 },
      _878: (x0,x1) => x0.getContext(x1),
      _937: x0 => x0.width,
      _938: x0 => x0.height,
      _940: (x0,x1) => x0.fetch(x1),
      _941: x0 => x0.status,
      _943: x0 => x0.body,
      _944: x0 => x0.arrayBuffer(),
      _947: x0 => x0.read(),
      _948: x0 => x0.value,
      _949: x0 => x0.done,
      _951: x0 => x0.name,
      _952: x0 => x0.x,
      _953: x0 => x0.y,
      _956: x0 => x0.top,
      _957: x0 => x0.right,
      _958: x0 => x0.bottom,
      _959: x0 => x0.left,
      _971: x0 => x0.height,
      _972: x0 => x0.width,
      _973: x0 => x0.scale,
      _974: (x0,x1) => { x0.value = x1 },
      _977: (x0,x1) => { x0.placeholder = x1 },
      _979: (x0,x1) => { x0.name = x1 },
      _980: x0 => x0.selectionDirection,
      _981: x0 => x0.selectionStart,
      _982: x0 => x0.selectionEnd,
      _985: x0 => x0.value,
      _987: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _988: x0 => x0.readText(),
      _989: (x0,x1) => x0.writeText(x1),
      _991: x0 => x0.altKey,
      _992: x0 => x0.code,
      _993: x0 => x0.ctrlKey,
      _994: x0 => x0.key,
      _995: x0 => x0.keyCode,
      _996: x0 => x0.location,
      _997: x0 => x0.metaKey,
      _998: x0 => x0.repeat,
      _999: x0 => x0.shiftKey,
      _1000: x0 => x0.isComposing,
      _1002: x0 => x0.state,
      _1003: (x0,x1) => x0.go(x1),
      _1005: (x0,x1,x2,x3) => x0.pushState(x1,x2,x3),
      _1006: (x0,x1,x2,x3) => x0.replaceState(x1,x2,x3),
      _1007: x0 => x0.pathname,
      _1008: x0 => x0.search,
      _1009: x0 => x0.hash,
      _1013: x0 => x0.state,
      _1016: (x0,x1) => x0.createObjectURL(x1),
      _1018: x0 => new Blob(x0),
      _1020: x0 => new MutationObserver(x0),
      _1021: (x0,x1,x2) => x0.observe(x1,x2),
      _1022: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1022(f,arguments.length,x0,x1) }),
      _1025: x0 => x0.attributeName,
      _1026: x0 => x0.type,
      _1027: x0 => x0.matches,
      _1028: x0 => x0.matches,
      _1032: x0 => x0.relatedTarget,
      _1034: x0 => x0.clientX,
      _1035: x0 => x0.clientY,
      _1036: x0 => x0.offsetX,
      _1037: x0 => x0.offsetY,
      _1040: x0 => x0.button,
      _1041: x0 => x0.buttons,
      _1042: x0 => x0.ctrlKey,
      _1046: x0 => x0.pointerId,
      _1047: x0 => x0.pointerType,
      _1048: x0 => x0.pressure,
      _1049: x0 => x0.tiltX,
      _1050: x0 => x0.tiltY,
      _1051: x0 => x0.getCoalescedEvents(),
      _1054: x0 => x0.deltaX,
      _1055: x0 => x0.deltaY,
      _1056: x0 => x0.wheelDeltaX,
      _1057: x0 => x0.wheelDeltaY,
      _1058: x0 => x0.deltaMode,
      _1065: x0 => x0.changedTouches,
      _1068: x0 => x0.clientX,
      _1069: x0 => x0.clientY,
      _1072: x0 => x0.data,
      _1075: (x0,x1) => { x0.disabled = x1 },
      _1077: (x0,x1) => { x0.type = x1 },
      _1078: (x0,x1) => { x0.max = x1 },
      _1079: (x0,x1) => { x0.min = x1 },
      _1080: x0 => x0.value,
      _1081: (x0,x1) => { x0.value = x1 },
      _1082: x0 => x0.disabled,
      _1083: (x0,x1) => { x0.disabled = x1 },
      _1085: (x0,x1) => { x0.placeholder = x1 },
      _1087: (x0,x1) => { x0.name = x1 },
      _1089: (x0,x1) => { x0.autocomplete = x1 },
      _1090: x0 => x0.selectionDirection,
      _1092: x0 => x0.selectionStart,
      _1093: x0 => x0.selectionEnd,
      _1096: (x0,x1,x2) => x0.setSelectionRange(x1,x2),
      _1097: (x0,x1) => x0.add(x1),
      _1100: (x0,x1) => { x0.noValidate = x1 },
      _1101: (x0,x1) => { x0.method = x1 },
      _1102: (x0,x1) => { x0.action = x1 },
      _1103: (x0,x1) => new OffscreenCanvas(x0,x1),
      _1109: (x0,x1) => x0.getContext(x1),
      _1111: x0 => x0.convertToBlob(),
      _1128: x0 => x0.orientation,
      _1129: x0 => x0.width,
      _1130: x0 => x0.height,
      _1131: (x0,x1) => x0.lock(x1),
      _1150: x0 => new ResizeObserver(x0),
      _1153: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1153(f,arguments.length,x0,x1) }),
      _1161: x0 => x0.length,
      _1162: x0 => x0.iterator,
      _1163: x0 => x0.Segmenter,
      _1164: x0 => x0.v8BreakIterator,
      _1165: (x0,x1) => new Intl.Segmenter(x0,x1),
      _1166: x0 => x0.done,
      _1167: x0 => x0.value,
      _1168: x0 => x0.index,
      _1172: (x0,x1) => new Intl.v8BreakIterator(x0,x1),
      _1173: (x0,x1) => x0.adoptText(x1),
      _1174: x0 => x0.first(),
      _1175: x0 => x0.next(),
      _1176: x0 => x0.current(),
      _1182: x0 => x0.hostElement,
      _1183: x0 => x0.viewConstraints,
      _1186: x0 => x0.maxHeight,
      _1187: x0 => x0.maxWidth,
      _1188: x0 => x0.minHeight,
      _1189: x0 => x0.minWidth,
      _1190: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1190(f,arguments.length,x0) }),
      _1191: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1191(f,arguments.length,x0) }),
      _1192: (x0,x1) => ({addView: x0,removeView: x1}),
      _1193: x0 => x0.loader,
      _1194: () => globalThis._flutter,
      _1195: (x0,x1) => x0.didCreateEngineInitializer(x1),
      _1196: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1196(f,arguments.length,x0) }),
      _1197: f => finalizeWrapper(f, function() { return dartInstance.exports._1197(f,arguments.length) }),
      _1198: (x0,x1) => ({initializeEngine: x0,autoStart: x1}),
      _1199: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1199(f,arguments.length,x0) }),
      _1200: x0 => ({runApp: x0}),
      _1201: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1201(f,arguments.length,x0,x1) }),
      _1202: x0 => x0.length,
      _1203: () => globalThis.window.ImageDecoder,
      _1204: x0 => x0.tracks,
      _1206: x0 => x0.completed,
      _1208: x0 => x0.image,
      _1214: x0 => x0.displayWidth,
      _1215: x0 => x0.displayHeight,
      _1216: x0 => x0.duration,
      _1219: x0 => x0.ready,
      _1220: x0 => x0.selectedTrack,
      _1221: x0 => x0.repetitionCount,
      _1222: x0 => x0.frameCount,
      _1265: x0 => x0.requestFullscreen(),
      _1266: x0 => x0.exitFullscreen(),
      _1279: (x0,x1) => x0.append(x1),
      _1280: x0 => ({type: x0}),
      _1281: (x0,x1) => new Blob(x0,x1),
      _1282: x0 => globalThis.URL.createObjectURL(x0),
      _1283: (x0,x1) => x0.getElementById(x1),
      _1284: (x0,x1) => x0.createElement(x1),
      _1285: (x0,x1,x2) => x0.setAttribute(x1,x2),
      _1286: (x0,x1,x2) => x0.removeEventListener(x1,x2),
      _1287: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1287(f,arguments.length,x0) }),
      _1288: (x0,x1,x2) => x0.addEventListener(x1,x2),
      _1289: x0 => x0.remove(),
      _1290: x0 => x0.click(),
      _1291: () => ({}),
      _1292: x0 => globalThis.pdfjsLib.getDocument(x0),
      _1293: (x0,x1) => x0.getContext(x1),
      _1294: (x0,x1) => x0.getPage(x1),
      _1295: (x0,x1) => x0.getViewport(x1),
      _1296: (x0,x1) => x0.render(x1),
      _1297: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1297(f,arguments.length,x0) }),
      _1298: (x0,x1) => x0.toBlob(x1),
      _1299: () => new FileReader(),
      _1300: (x0,x1) => x0.readAsArrayBuffer(x1),
      _1301: x0 => x0.cleanup(),
      _1302: x0 => x0.destroy(),
      _1303: (x0,x1) => { x0.module = x1 },
      _1304: (x0,x1) => { x0.exports = x1 },
      _1306: (x0,x1,x2,x3) => x0.addEventListener(x1,x2,x3),
      _1307: (x0,x1,x2,x3) => x0.removeEventListener(x1,x2,x3),
      _1313: (x0,x1,x2,x3) => x0.open(x1,x2,x3),
      _1320: x0 => x0.toArray(),
      _1321: x0 => x0.toUint8Array(),
      _1322: x0 => ({serverTimestamps: x0}),
      _1323: x0 => ({source: x0}),
      _1326: x0 => new firebase_firestore.FieldPath(x0),
      _1327: (x0,x1) => new firebase_firestore.FieldPath(x0,x1),
      _1328: (x0,x1,x2) => new firebase_firestore.FieldPath(x0,x1,x2),
      _1329: (x0,x1,x2,x3) => new firebase_firestore.FieldPath(x0,x1,x2,x3),
      _1330: (x0,x1,x2,x3,x4) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4),
      _1331: (x0,x1,x2,x3,x4,x5) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5),
      _1332: (x0,x1,x2,x3,x4,x5,x6) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6),
      _1333: (x0,x1,x2,x3,x4,x5,x6,x7) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7),
      _1334: (x0,x1,x2,x3,x4,x5,x6,x7,x8) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8),
      _1335: (x0,x1,x2,x3,x4,x5,x6,x7,x8,x9) => new firebase_firestore.FieldPath(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9),
      _1336: () => globalThis.firebase_firestore.documentId(),
      _1337: (x0,x1) => new firebase_firestore.GeoPoint(x0,x1),
      _1338: x0 => globalThis.firebase_firestore.vector(x0),
      _1339: x0 => globalThis.firebase_firestore.Bytes.fromUint8Array(x0),
      _1341: (x0,x1) => globalThis.firebase_firestore.collection(x0,x1),
      _1343: (x0,x1) => globalThis.firebase_firestore.doc(x0,x1),
      _1346: x0 => x0.call(),
      _1375: x0 => globalThis.firebase_firestore.deleteDoc(x0),
      _1376: x0 => globalThis.firebase_firestore.getDoc(x0),
      _1377: x0 => globalThis.firebase_firestore.getDocFromServer(x0),
      _1378: x0 => globalThis.firebase_firestore.getDocFromCache(x0),
      _1379: (x0,x1) => ({includeMetadataChanges: x0,source: x1}),
      _1382: (x0,x1,x2,x3) => globalThis.firebase_firestore.onSnapshot(x0,x1,x2,x3),
      _1385: (x0,x1) => globalThis.firebase_firestore.setDoc(x0,x1),
      _1386: (x0,x1) => globalThis.firebase_firestore.query(x0,x1),
      _1387: x0 => globalThis.firebase_firestore.getDocs(x0),
      _1388: x0 => globalThis.firebase_firestore.getDocsFromServer(x0),
      _1389: x0 => globalThis.firebase_firestore.getDocsFromCache(x0),
      _1390: x0 => globalThis.firebase_firestore.limit(x0),
      _1391: x0 => globalThis.firebase_firestore.limitToLast(x0),
      _1392: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1392(f,arguments.length,x0) }),
      _1393: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1393(f,arguments.length,x0) }),
      _1394: (x0,x1) => globalThis.firebase_firestore.orderBy(x0,x1),
      _1396: (x0,x1,x2) => globalThis.firebase_firestore.where(x0,x1,x2),
      _1399: x0 => globalThis.firebase_firestore.doc(x0),
      _1402: (x0,x1) => x0.data(x1),
      _1406: x0 => x0.docChanges(),
      _1423: (x0,x1) => globalThis.firebase_firestore.getFirestore(x0,x1),
      _1425: x0 => globalThis.firebase_firestore.Timestamp.fromMillis(x0),
      _1426: f => finalizeWrapper(f, function() { return dartInstance.exports._1426(f,arguments.length) }),
      _1443: () => globalThis.firebase_firestore.updateDoc,
      _1444: () => globalThis.firebase_firestore.or,
      _1445: () => globalThis.firebase_firestore.and,
      _1450: x0 => x0.path,
      _1453: () => globalThis.firebase_firestore.GeoPoint,
      _1454: x0 => x0.latitude,
      _1455: x0 => x0.longitude,
      _1457: () => globalThis.firebase_firestore.VectorValue,
      _1458: () => globalThis.firebase_firestore.Bytes,
      _1461: x0 => x0.type,
      _1463: x0 => x0.doc,
      _1465: x0 => x0.oldIndex,
      _1467: x0 => x0.newIndex,
      _1469: () => globalThis.firebase_firestore.DocumentReference,
      _1473: x0 => x0.path,
      _1482: x0 => x0.metadata,
      _1483: x0 => x0.ref,
      _1488: x0 => x0.docs,
      _1490: x0 => x0.metadata,
      _1494: () => globalThis.firebase_firestore.Timestamp,
      _1495: x0 => x0.seconds,
      _1496: x0 => x0.nanoseconds,
      _1532: x0 => x0.hasPendingWrites,
      _1534: x0 => x0.fromCache,
      _1541: x0 => x0.source,
      _1546: () => globalThis.firebase_firestore.startAfter,
      _1547: () => globalThis.firebase_firestore.startAt,
      _1548: () => globalThis.firebase_firestore.endBefore,
      _1549: () => globalThis.firebase_firestore.endAt,
      _1560: x0 => globalThis.Wakelock.toggle(x0),
      _1582: x0 => x0.toJSON(),
      _1583: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1583(f,arguments.length,x0) }),
      _1584: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1584(f,arguments.length,x0) }),
      _1585: (x0,x1,x2) => x0.onAuthStateChanged(x1,x2),
      _1586: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1586(f,arguments.length,x0) }),
      _1587: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1587(f,arguments.length,x0) }),
      _1588: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1588(f,arguments.length,x0) }),
      _1589: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1589(f,arguments.length,x0) }),
      _1590: (x0,x1,x2) => x0.onIdTokenChanged(x1,x2),
      _1594: (x0,x1,x2) => globalThis.firebase_auth.createUserWithEmailAndPassword(x0,x1,x2),
      _1600: (x0,x1,x2) => globalThis.firebase_auth.sendPasswordResetEmail(x0,x1,x2),
      _1604: (x0,x1,x2) => globalThis.firebase_auth.signInWithEmailAndPassword(x0,x1,x2),
      _1609: x0 => x0.signOut(),
      _1610: (x0,x1) => globalThis.firebase_auth.connectAuthEmulator(x0,x1),
      _1633: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromResult(x0),
      _1648: x0 => globalThis.firebase_auth.getAdditionalUserInfo(x0),
      _1649: (x0,x1,x2) => ({errorMap: x0,persistence: x1,popupRedirectResolver: x2}),
      _1650: (x0,x1) => globalThis.firebase_auth.initializeAuth(x0,x1),
      _1656: x0 => globalThis.firebase_auth.OAuthProvider.credentialFromError(x0),
      _1671: () => globalThis.firebase_auth.debugErrorMap,
      _1674: () => globalThis.firebase_auth.browserSessionPersistence,
      _1676: () => globalThis.firebase_auth.browserLocalPersistence,
      _1678: () => globalThis.firebase_auth.indexedDBLocalPersistence,
      _1681: x0 => globalThis.firebase_auth.multiFactor(x0),
      _1682: (x0,x1) => globalThis.firebase_auth.getMultiFactorResolver(x0,x1),
      _1684: x0 => x0.currentUser,
      _1698: x0 => x0.displayName,
      _1699: x0 => x0.email,
      _1700: x0 => x0.phoneNumber,
      _1701: x0 => x0.photoURL,
      _1702: x0 => x0.providerId,
      _1703: x0 => x0.uid,
      _1704: x0 => x0.emailVerified,
      _1705: x0 => x0.isAnonymous,
      _1706: x0 => x0.providerData,
      _1707: x0 => x0.refreshToken,
      _1708: x0 => x0.tenantId,
      _1709: x0 => x0.metadata,
      _1711: x0 => x0.providerId,
      _1712: x0 => x0.signInMethod,
      _1713: x0 => x0.accessToken,
      _1714: x0 => x0.idToken,
      _1715: x0 => x0.secret,
      _1726: x0 => x0.creationTime,
      _1727: x0 => x0.lastSignInTime,
      _1732: x0 => x0.code,
      _1734: x0 => x0.message,
      _1746: x0 => x0.email,
      _1747: x0 => x0.phoneNumber,
      _1748: x0 => x0.tenantId,
      _1771: x0 => x0.user,
      _1774: x0 => x0.providerId,
      _1775: x0 => x0.profile,
      _1776: x0 => x0.username,
      _1777: x0 => x0.isNewUser,
      _1780: () => globalThis.firebase_auth.browserPopupRedirectResolver,
      _1785: x0 => x0.displayName,
      _1786: x0 => x0.enrollmentTime,
      _1787: x0 => x0.factorId,
      _1788: x0 => x0.uid,
      _1790: x0 => x0.hints,
      _1791: x0 => x0.session,
      _1793: x0 => x0.phoneNumber,
      _1805: (x0,x1) => x0.getItem(x1),
      _1809: (x0,x1) => x0.appendChild(x1),
      _1812: (x0,x1,x2) => x0.setItem(x1,x2),
      _1815: (x0,x1,x2,x3,x4,x5,x6,x7) => ({apiKey: x0,authDomain: x1,databaseURL: x2,projectId: x3,storageBucket: x4,messagingSenderId: x5,measurementId: x6,appId: x7}),
      _1816: (x0,x1) => globalThis.firebase_core.initializeApp(x0,x1),
      _1817: x0 => globalThis.firebase_core.getApp(x0),
      _1818: () => globalThis.firebase_core.getApp(),
      _1820: () => globalThis.firebase_core.SDK_VERSION,
      _1826: x0 => x0.apiKey,
      _1828: x0 => x0.authDomain,
      _1830: x0 => x0.databaseURL,
      _1832: x0 => x0.projectId,
      _1834: x0 => x0.storageBucket,
      _1836: x0 => x0.messagingSenderId,
      _1838: x0 => x0.measurementId,
      _1840: x0 => x0.appId,
      _1842: x0 => x0.name,
      _1843: x0 => x0.options,
      _1844: (x0,x1) => x0.debug(x1),
      _1845: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1845(f,arguments.length,x0) }),
      _1846: f => finalizeWrapper(f, function(x0,x1) { return dartInstance.exports._1846(f,arguments.length,x0,x1) }),
      _1847: (x0,x1) => ({createScript: x0,createScriptURL: x1}),
      _1848: (x0,x1,x2) => x0.createPolicy(x1,x2),
      _1849: (x0,x1) => x0.createScriptURL(x1),
      _1850: (x0,x1,x2) => x0.createScript(x1,x2),
      _1851: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1851(f,arguments.length,x0) }),
      _1853: Date.now,
      _1855: s => new Date(s * 1000).getTimezoneOffset() * 60,
      _1856: s => {
        if (!/^\s*[+-]?(?:Infinity|NaN|(?:\.\d+|\d+(?:\.\d*)?)(?:[eE][+-]?\d+)?)\s*$/.test(s)) {
          return NaN;
        }
        return parseFloat(s);
      },
      _1857: () => {
        let stackString = new Error().stack.toString();
        let frames = stackString.split('\n');
        let drop = 2;
        if (frames[0] === 'Error') {
            drop += 1;
        }
        return frames.slice(drop).join('\n');
      },
      _1858: () => typeof dartUseDateNowForTicks !== "undefined",
      _1859: () => 1000 * performance.now(),
      _1860: () => Date.now(),
      _1861: () => {
        // On browsers return `globalThis.location.href`
        if (globalThis.location != null) {
          return globalThis.location.href;
        }
        return null;
      },
      _1862: () => {
        return typeof process != "undefined" &&
               Object.prototype.toString.call(process) == "[object process]" &&
               process.platform == "win32"
      },
      _1863: () => new WeakMap(),
      _1864: (map, o) => map.get(o),
      _1865: (map, o, v) => map.set(o, v),
      _1866: x0 => new WeakRef(x0),
      _1867: x0 => x0.deref(),
      _1868: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._1868(f,arguments.length,x0) }),
      _1869: x0 => new FinalizationRegistry(x0),
      _1871: (x0,x1,x2) => x0.register(x1,x2),
      _1874: () => globalThis.WeakRef,
      _1875: () => globalThis.FinalizationRegistry,
      _1877: s => JSON.stringify(s),
      _1878: s => printToConsole(s),
      _1879: (o, p, r) => o.replaceAll(p, () => r),
      _1880: (o, p, r) => o.replace(p, () => r),
      _1881: Function.prototype.call.bind(String.prototype.toLowerCase),
      _1882: s => s.toUpperCase(),
      _1883: s => s.trim(),
      _1884: s => s.trimLeft(),
      _1885: s => s.trimRight(),
      _1886: (string, times) => string.repeat(times),
      _1887: Function.prototype.call.bind(String.prototype.indexOf),
      _1888: (s, p, i) => s.lastIndexOf(p, i),
      _1889: (string, token) => string.split(token),
      _1890: Object.is,
      _1891: o => o instanceof Array,
      _1892: (a, i) => a.push(i),
      _1896: a => a.pop(),
      _1897: (a, i) => a.splice(i, 1),
      _1898: (a, s) => a.join(s),
      _1899: (a, s, e) => a.slice(s, e),
      _1901: (a, b) => a == b ? 0 : (a > b ? 1 : -1),
      _1902: a => a.length,
      _1904: (a, i) => a[i],
      _1905: (a, i, v) => a[i] = v,
      _1906: (a, t) => a.concat(t),
      _1907: o => {
        if (o instanceof ArrayBuffer) return 0;
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
          return 1;
        }
        return 2;
      },
      _1908: (o, offsetInBytes, lengthInBytes) => {
        var dst = new ArrayBuffer(lengthInBytes);
        new Uint8Array(dst).set(new Uint8Array(o, offsetInBytes, lengthInBytes));
        return new DataView(dst);
      },
      _1910: o => o instanceof Uint8Array,
      _1911: (o, start, length) => new Uint8Array(o.buffer, o.byteOffset + start, length),
      _1912: o => o instanceof Int8Array,
      _1913: (o, start, length) => new Int8Array(o.buffer, o.byteOffset + start, length),
      _1914: o => o instanceof Uint8ClampedArray,
      _1915: (o, start, length) => new Uint8ClampedArray(o.buffer, o.byteOffset + start, length),
      _1916: o => o instanceof Uint16Array,
      _1917: (o, start, length) => new Uint16Array(o.buffer, o.byteOffset + start, length),
      _1918: o => o instanceof Int16Array,
      _1919: (o, start, length) => new Int16Array(o.buffer, o.byteOffset + start, length),
      _1920: o => o instanceof Uint32Array,
      _1921: (o, start, length) => new Uint32Array(o.buffer, o.byteOffset + start, length),
      _1922: o => o instanceof Int32Array,
      _1923: (o, start, length) => new Int32Array(o.buffer, o.byteOffset + start, length),
      _1925: (o, start, length) => new BigInt64Array(o.buffer, o.byteOffset + start, length),
      _1926: o => o instanceof Float32Array,
      _1927: (o, start, length) => new Float32Array(o.buffer, o.byteOffset + start, length),
      _1928: o => o instanceof Float64Array,
      _1929: (o, start, length) => new Float64Array(o.buffer, o.byteOffset + start, length),
      _1930: (t, s) => t.set(s),
      _1931: l => new DataView(new ArrayBuffer(l)),
      _1932: (o) => new DataView(o.buffer, o.byteOffset, o.byteLength),
      _1933: o => o.byteLength,
      _1934: o => o.buffer,
      _1935: o => o.byteOffset,
      _1936: Function.prototype.call.bind(Object.getOwnPropertyDescriptor(DataView.prototype, 'byteLength').get),
      _1937: (b, o) => new DataView(b, o),
      _1938: (b, o, l) => new DataView(b, o, l),
      _1939: Function.prototype.call.bind(DataView.prototype.getUint8),
      _1940: Function.prototype.call.bind(DataView.prototype.setUint8),
      _1941: Function.prototype.call.bind(DataView.prototype.getInt8),
      _1942: Function.prototype.call.bind(DataView.prototype.setInt8),
      _1943: Function.prototype.call.bind(DataView.prototype.getUint16),
      _1944: Function.prototype.call.bind(DataView.prototype.setUint16),
      _1945: Function.prototype.call.bind(DataView.prototype.getInt16),
      _1946: Function.prototype.call.bind(DataView.prototype.setInt16),
      _1947: Function.prototype.call.bind(DataView.prototype.getUint32),
      _1948: Function.prototype.call.bind(DataView.prototype.setUint32),
      _1949: Function.prototype.call.bind(DataView.prototype.getInt32),
      _1950: Function.prototype.call.bind(DataView.prototype.setInt32),
      _1953: Function.prototype.call.bind(DataView.prototype.getBigInt64),
      _1954: Function.prototype.call.bind(DataView.prototype.setBigInt64),
      _1955: Function.prototype.call.bind(DataView.prototype.getFloat32),
      _1956: Function.prototype.call.bind(DataView.prototype.setFloat32),
      _1957: Function.prototype.call.bind(DataView.prototype.getFloat64),
      _1958: Function.prototype.call.bind(DataView.prototype.setFloat64),
      _1971: (ms, c) =>
      setTimeout(() => dartInstance.exports.$invokeCallback(c),ms),
      _1972: (handle) => clearTimeout(handle),
      _1973: (ms, c) =>
      setInterval(() => dartInstance.exports.$invokeCallback(c), ms),
      _1974: (handle) => clearInterval(handle),
      _1975: (c) =>
      queueMicrotask(() => dartInstance.exports.$invokeCallback(c)),
      _1976: () => Date.now(),
      _1981: o => Object.keys(o),
      _1982: (x0,x1) => x0.append(x1),
      _1983: x0 => ({xhrSetup: x0}),
      _1984: x0 => new Hls(x0),
      _1985: () => globalThis.Hls.isSupported(),
      _1987: (x0,x1) => x0.loadSource(x1),
      _1988: (x0,x1) => x0.attachMedia(x1),
      _1989: x0 => x0.pause(),
      _1990: (x0,x1) => x0.end(x1),
      _1991: x0 => x0.load(),
      _1992: x0 => x0.play(),
      _1993: (x0,x1) => x0.item(x1),
      _2001: (x0,x1) => x0.canPlayType(x1),
      _2002: () => new AbortController(),
      _2003: x0 => x0.abort(),
      _2004: (x0,x1,x2,x3,x4,x5) => ({method: x0,headers: x1,body: x2,credentials: x3,redirect: x4,signal: x5}),
      _2005: (x0,x1) => globalThis.fetch(x0,x1),
      _2006: (x0,x1) => x0.get(x1),
      _2007: f => finalizeWrapper(f, function(x0,x1,x2) { return dartInstance.exports._2007(f,arguments.length,x0,x1,x2) }),
      _2008: (x0,x1) => x0.forEach(x1),
      _2009: x0 => x0.getReader(),
      _2010: x0 => x0.read(),
      _2011: x0 => x0.cancel(),
      _2019: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2019(f,arguments.length,x0) }),
      _2020: f => finalizeWrapper(f, function(x0) { return dartInstance.exports._2020(f,arguments.length,x0) }),
      _2025: (x0,x1) => x0.key(x1),
      _2027: (x0,x1) => { x0.data = x1 },
      _2028: (x0,x1) => { x0.scale = x1 },
      _2029: (x0,x1) => { x0.canvasContext = x1 },
      _2030: (x0,x1) => { x0.viewport = x1 },
      _2031: (x0,x1) => { x0.cMapUrl = x1 },
      _2032: (x0,x1) => { x0.cMapPacked = x1 },
      _2033: x0 => x0.promise,
      _2034: x0 => x0.numPages,
      _2035: x0 => x0.width,
      _2036: x0 => x0.height,
      _2037: x0 => x0.promise,
      _2038: x0 => x0.trustedTypes,
      _2039: (x0,x1) => { x0.text = x1 },
      _2047: (s, m) => {
        try {
          return new RegExp(s, m);
        } catch (e) {
          return String(e);
        }
      },
      _2048: (x0,x1) => x0.exec(x1),
      _2049: (x0,x1) => x0.test(x1),
      _2050: x0 => x0.pop(),
      _2052: o => o === undefined,
      _2054: o => typeof o === 'function' && o[jsWrappedDartFunctionSymbol] === true,
      _2056: o => {
        const proto = Object.getPrototypeOf(o);
        return proto === Object.prototype || proto === null;
      },
      _2057: o => o instanceof RegExp,
      _2058: (l, r) => l === r,
      _2059: o => o,
      _2060: o => o,
      _2061: o => o,
      _2062: b => !!b,
      _2063: o => o.length,
      _2065: (o, i) => o[i],
      _2066: f => f.dartFunction,
      _2067: () => ({}),
      _2068: () => [],
      _2070: () => globalThis,
      _2071: (constructor, args) => {
        const factoryFunction = constructor.bind.apply(
            constructor, [null, ...args]);
        return new factoryFunction();
      },
      _2072: (o, p) => p in o,
      _2073: (o, p) => o[p],
      _2074: (o, p, v) => o[p] = v,
      _2075: (o, m, a) => o[m].apply(o, a),
      _2077: o => String(o),
      _2078: (p, s, f) => p.then(s, (e) => f(e, e === undefined)),
      _2079: o => {
        if (o === undefined) return 1;
        var type = typeof o;
        if (type === 'boolean') return 2;
        if (type === 'number') return 3;
        if (type === 'string') return 4;
        if (o instanceof Array) return 5;
        if (ArrayBuffer.isView(o)) {
          if (o instanceof Int8Array) return 6;
          if (o instanceof Uint8Array) return 7;
          if (o instanceof Uint8ClampedArray) return 8;
          if (o instanceof Int16Array) return 9;
          if (o instanceof Uint16Array) return 10;
          if (o instanceof Int32Array) return 11;
          if (o instanceof Uint32Array) return 12;
          if (o instanceof Float32Array) return 13;
          if (o instanceof Float64Array) return 14;
          if (o instanceof DataView) return 15;
        }
        if (o instanceof ArrayBuffer) return 16;
        // Feature check for `SharedArrayBuffer` before doing a type-check.
        if (globalThis.SharedArrayBuffer !== undefined &&
            o instanceof SharedArrayBuffer) {
            return 17;
        }
        return 18;
      },
      _2080: o => [o],
      _2081: (o0, o1) => [o0, o1],
      _2082: (o0, o1, o2) => [o0, o1, o2],
      _2083: (o0, o1, o2, o3) => [o0, o1, o2, o3],
      _2084: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI8ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2085: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI8ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2086: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI16ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2087: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI16ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2088: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmI32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2089: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmI32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2090: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF32ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2091: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF32ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2092: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const getValue = dartInstance.exports.$wasmF64ArrayGet;
        for (let i = 0; i < length; i++) {
          jsArray[jsArrayOffset + i] = getValue(wasmArray, wasmArrayOffset + i);
        }
      },
      _2093: (jsArray, jsArrayOffset, wasmArray, wasmArrayOffset, length) => {
        const setValue = dartInstance.exports.$wasmF64ArraySet;
        for (let i = 0; i < length; i++) {
          setValue(wasmArray, wasmArrayOffset + i, jsArray[jsArrayOffset + i]);
        }
      },
      _2094: x0 => new ArrayBuffer(x0),
      _2095: s => {
        if (/[[\]{}()*+?.\\^$|]/.test(s)) {
            s = s.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
        }
        return s;
      },
      _2097: x0 => x0.index,
      _2098: x0 => x0.groups,
      _2099: x0 => x0.flags,
      _2100: x0 => x0.multiline,
      _2101: x0 => x0.ignoreCase,
      _2102: x0 => x0.unicode,
      _2103: x0 => x0.dotAll,
      _2104: (x0,x1) => { x0.lastIndex = x1 },
      _2105: (o, p) => p in o,
      _2106: (o, p) => o[p],
      _2107: (o, p, v) => o[p] = v,
      _2108: (o, p) => delete o[p],
      _2109: x0 => x0.random(),
      _2110: (x0,x1) => x0.getRandomValues(x1),
      _2111: () => globalThis.crypto,
      _2112: () => globalThis.Math,
      _2113: Function.prototype.call.bind(Number.prototype.toString),
      _2114: Function.prototype.call.bind(BigInt.prototype.toString),
      _2115: Function.prototype.call.bind(Number.prototype.toString),
      _2116: (d, digits) => d.toFixed(digits),
      _2288: x0 => x0.style,
      _2645: (x0,x1) => { x0.target = x1 },
      _2647: (x0,x1) => { x0.download = x1 },
      _2672: (x0,x1) => { x0.href = x1 },
      _2860: x0 => x0.videoWidth,
      _2861: x0 => x0.videoHeight,
      _2890: x0 => x0.error,
      _2892: (x0,x1) => { x0.src = x1 },
      _2901: x0 => x0.buffered,
      _2904: x0 => x0.currentTime,
      _2905: (x0,x1) => { x0.currentTime = x1 },
      _2906: x0 => x0.duration,
      _2907: x0 => x0.paused,
      _2910: x0 => x0.playbackRate,
      _2922: (x0,x1) => { x0.controls = x1 },
      _2923: x0 => x0.volume,
      _2924: (x0,x1) => { x0.volume = x1 },
      _2925: x0 => x0.muted,
      _2926: (x0,x1) => { x0.muted = x1 },
      _2942: x0 => x0.message,
      _3016: x0 => x0.length,
      _3519: x0 => x0.src,
      _3520: (x0,x1) => { x0.src = x1 },
      _3522: (x0,x1) => { x0.type = x1 },
      _3526: (x0,x1) => { x0.async = x1 },
      _3530: (x0,x1) => { x0.crossOrigin = x1 },
      _3532: (x0,x1) => { x0.text = x1 },
      _3540: (x0,x1) => { x0.charset = x1 },
      _3565: x0 => x0.width,
      _3566: (x0,x1) => { x0.width = x1 },
      _3567: x0 => x0.height,
      _3568: (x0,x1) => { x0.height = x1 },
      _3989: () => globalThis.window,
      _4029: x0 => x0.document,
      _4032: x0 => x0.location,
      _4051: x0 => x0.navigator,
      _4313: x0 => x0.trustedTypes,
      _4314: x0 => x0.sessionStorage,
      _4315: x0 => x0.localStorage,
      _4330: x0 => x0.hostname,
      _4440: x0 => x0.userAgent,
      _4648: x0 => x0.length,
      _6593: x0 => x0.signal,
      _6605: x0 => x0.length,
      _6648: x0 => x0.baseURI,
      _6665: () => globalThis.document,
      _6723: x0 => x0.documentElement,
      _6744: x0 => x0.body,
      _6746: x0 => x0.head,
      _7100: (x0,x1) => { x0.innerHTML = x1 },
      _7103: x0 => x0.children,
      _8422: x0 => x0.value,
      _8424: x0 => x0.done,
      _8626: x0 => x0.result,
      _9123: x0 => x0.url,
      _9125: x0 => x0.status,
      _9127: x0 => x0.statusText,
      _9128: x0 => x0.headers,
      _9129: x0 => x0.body,
      _11257: (x0,x1) => { x0.border = x1 },
      _11699: (x0,x1) => { x0.height = x1 },
      _12389: (x0,x1) => { x0.width = x1 },
      _12757: x0 => x0.name,
      _12758: x0 => x0.message,
      _13473: () => globalThis.console,
      _13501: x0 => x0.name,
      _13502: x0 => x0.message,
      _13503: x0 => x0.code,
      _13505: x0 => x0.customData,

    };

    const baseImports = {
      dart2wasm: dart2wasm,
      Math: Math,
      Date: Date,
      Object: Object,
      Array: Array,
      Reflect: Reflect,
      S: new Proxy({}, { get(_, prop) { return prop; } }),

    };

    const jsStringPolyfill = {
      "charCodeAt": (s, i) => s.charCodeAt(i),
      "compare": (s1, s2) => {
        if (s1 < s2) return -1;
        if (s1 > s2) return 1;
        return 0;
      },
      "concat": (s1, s2) => s1 + s2,
      "equals": (s1, s2) => s1 === s2,
      "fromCharCode": (i) => String.fromCharCode(i),
      "length": (s) => s.length,
      "substring": (s, a, b) => s.substring(a, b),
      "fromCharCodeArray": (a, start, end) => {
        if (end <= start) return '';

        const read = dartInstance.exports.$wasmI16ArrayGet;
        let result = '';
        let index = start;
        const chunkLength = Math.min(end - index, 500);
        let array = new Array(chunkLength);
        while (index < end) {
          const newChunkLength = Math.min(end - index, 500);
          for (let i = 0; i < newChunkLength; i++) {
            array[i] = read(a, index++);
          }
          if (newChunkLength < chunkLength) {
            array = array.slice(0, newChunkLength);
          }
          result += String.fromCharCode(...array);
        }
        return result;
      },
      "intoCharCodeArray": (s, a, start) => {
        if (s === '') return 0;

        const write = dartInstance.exports.$wasmI16ArraySet;
        for (var i = 0; i < s.length; ++i) {
          write(a, start++, s.charCodeAt(i));
        }
        return s.length;
      },
      "test": (s) => typeof s == "string",
    };


    

    dartInstance = await WebAssembly.instantiate(this.module, {
      ...baseImports,
      ...additionalImports,
      
      "wasm:js-string": jsStringPolyfill,
    });

    return new InstantiatedApp(this, dartInstance);
  }
}

class InstantiatedApp {
  constructor(compiledApp, instantiatedModule) {
    this.compiledApp = compiledApp;
    this.instantiatedModule = instantiatedModule;
  }

  // Call the main function with the given arguments.
  invokeMain(...args) {
    this.instantiatedModule.exports.$invokeMain(args);
  }
}
