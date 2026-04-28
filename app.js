const supportPoints = [
  [146, 635],
  [205, 595],
  [180, 545],
  [255, 510],
  [342, 500],
  [390, 452],
  [355, 395],
  [442, 360],
  [520, 315],
  [498, 262],
  [570, 220],
  [650, 198],
  [695, 155],
  [782, 146],
  [844, 108],
];

const LANTMATERIET_TOKEN_KEY = "infield:lantmateriet-token";
const BASEMAP_KEY = "infield:basemap";
const THEME_KEY = "infield:theme";
const MAP_VIEW_FETCH_PADDING = 0.3;
const MAP_VIEW_SETTLE_MS = 300;
const DEBUG_LOG_LIMIT = 80;
const LANTMATERIET_WATERCOURSE_PAGE_SIZE = 10000;
const LANTMATERIET_WATERCOURSE_URL =
  "https://api.lantmateriet.se/ogc-features/v1/hydrografi/collections/WatercourseLine/items";
const LANTMATERIET_ATTRIBUTION = "Hydrografi Direkt © Lantmäteriet, bearbetad, CC BY 4.0";
const LANTMATERIET_WMTS_ATTRIBUTION = "Topografisk webbkarta © Lantmäteriet";
const OSM_WATERWAY_PATTERN = "^(river|stream|ditch|drain|canal)$";
const LANTMATERIET_WMTS_OPTIONS = {
  minZoom: 0,
  maxZoom: 14,
  maxNativeZoom: 14,
  tileSize: 256,
  attribution: LANTMATERIET_WMTS_ATTRIBUTION,
};
const baseMaps = {
  "lm-muted": {
    label: "LM nedtonad",
    // WMTS REST order is TileMatrix/TileRow/TileCol, which maps to Leaflet z/y/x.
    url: "https://maps.lantmateriet.se/open/topowebb-ccby/v1/wmts/1.0.0/topowebb_nedtonad/default/3857/{z}/{y}/{x}.png",
    options: LANTMATERIET_WMTS_OPTIONS,
  },
  "lm-topo": {
    label: "LM topo",
    // WMTS REST order is TileMatrix/TileRow/TileCol, which maps to Leaflet z/y/x.
    url: "https://maps.lantmateriet.se/open/topowebb-ccby/v1/wmts/1.0.0/topowebb/default/3857/{z}/{y}/{x}.png",
    options: LANTMATERIET_WMTS_OPTIONS,
  },
  osm: {
    label: "OSM",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: { minZoom: 0, maxZoom: 19, maxNativeZoom: 19, attribution: "&copy; OpenStreetMap contributors" },
  },
};

const protocolOptions = {
  hymotyp: ["Bt", "Bx", "Cx", "Ex", "Tt"],
  vattenforing: ["L", "M"],
  dalgang: ["Dh", "Dl", "Dm"],
  planform: ["A", "B", "C"],
  rensning: ["Ej rensad", "Försiktigt rensad", "Kraftigt rensad"],
  fysiskPaverkan: [
    "Opåverkade förhållanden",
    "Måttlig påverkan",
    "Kraftig påverkan",
    "Mycket kraftig påverkan",
  ],
  kulverterad: ["Nej", "Ja"],
  avstangd: ["Nej", "Ja"],
};

const protocolGroups = [
  {
    title: "A3 Nuvarande HyMoTyp",
    fields: [
      { key: "vattenforing", label: "Vattenföring", type: "buttons", options: ["L", "M"] },
      {
        key: "hymotyp",
        label: "HyMotyp",
        type: "buttons",
        options: ["Bt", "Bx", "Cx", "Ex", "Tt"],
        help: "https://www.hymoinfo.com/hydromorfologiska-typer-foumlrdjupnning.html",
      },
      { key: "tillaggH", label: "Tillägg HyMoTyp", type: "buttons", options: ["K"] },
      {
        key: "dalgang",
        label: "Dalgång",
        type: "buttons",
        options: ["Dh", "Dl", "Dm"],
        help: "https://www.hymoinfo.com/a3-hydromorfologisk-typ-planform.html",
      },
      {
        key: "planform",
        label: "Planform",
        type: "buttons",
        options: ["A", "B", "C"],
        help: "https://www.hymoinfo.com/a3-hydromorfologisk-typ-planform.html",
      },
    ],
  },
  {
    title: "A3 Ursprunglig HyMoTyp",
    fields: [
      { key: "ursprungligHymotyp", label: "Ursprunglig HyMoTyp", type: "buttons", options: ["Ax", "Bp", "Bt", "Bx", "Cx", "Ex", "Tt"] },
      { key: "tillaggUrsprunglig", label: "Tillägg ursprunglig", type: "buttons", options: ["K"] },
      { key: "ursprungligDalgang", label: "Ursprunglig dalgång", type: "buttons", options: ["Dh", "Dl", "Dm"] },
    ],
  },
  {
    title: "Vegetation, skuggning och död ved",
    fields: [
      { key: "skuggning", label: "Beskuggning", type: "buttons", options: ["Saknas eller obetydlig", "<5%", "5-50%"] },
      { key: "grovDodVed", label: "Grov död ved", type: "number" },
    ],
  },
  {
    title: "Fysisk påverkan",
    fields: [
      { key: "rensning", label: "Rensning", type: "buttons", options: ["Ej rensad", "Försiktigt rensad", "Kraftigt rensad"] },
      { key: "kulverterad", label: "Kulverterad", type: "binary" },
      { key: "utfyllnad", label: "Utfyllnad", type: "binary" },
      { key: "oversvamningsytaPaverkad", label: "Översvämningsyta påverkad", type: "binary" },
      { key: "artificiell", label: "Artificiell fåra", type: "binary" },
      { key: "indamt", label: "Indämt", type: "binary" },
      { key: "avstangd", label: "Avstängd sidofåra", type: "binary" },
      { key: "torrfara", label: "Torrfåra", type: "binary" },
      { key: "regleradVattenforing", label: "Reglerad vattenföring", type: "binary" },
      { key: "paverkan", label: "Påverkan", type: "binary" },
      {
        key: "oversvamningsfrekvens",
        label: "Översvämningsfrekvens",
        type: "buttons",
        options: ["Opåverkade förhållanden", "Måttligt minskad", "Kraftigt minskad", "Mycket kraftigt minskad"],
      },
      {
        key: "fysiskPaverkan",
        label: "Fysisk påverkan",
        type: "buttons",
        options: ["Opåverkade förhållanden", "Måttlig påverkan", "Kraftig påverkan", "Mycket kraftig påverkan"],
      },
    ],
  },
  {
    title: "Övriga observationer",
    fields: [
      { key: "meandrande", label: "Meandrande", type: "binary" },
      { key: "baverdam", label: "Bäverdäm", type: "binary" },
    ],
  },
  {
    title: "Basnivå, svämplan och utveckling",
    fields: [
      {
        key: "stabilitet",
        label: "Stabilitet",
        type: "select",
        options: ["Stabila förhållanden", "Svag instabilitet", "Måttlig instabilitet"],
        showIf: (a) => a.paverkan === "Ja" && ["Cx", "Ex", "Tt"].includes(a.hymotyp),
      },
      { key: "sanktBasniva", label: "Sänkt basnivå", type: "binary" },
      {
        key: "forandradBasniva",
        label: "Förändrad basnivå",
        type: "buttons",
        options: ["0,2", "0,3", "0,5"],
        showIf: (a) => a.sanktBasniva === "Ja",
      },
      { key: "mataInskarningskvot", label: "Mät inskärningskvot med RTK RH2000", type: "binary" },
      { key: "hojdNuvarandeBs", label: "RTK RH2000 höjd nuvarande bestämmande sektion", type: "decimal", showIf: (a) => a.mataInskarningskvot === "Ja" },
      { key: "hojdThalweg", label: "RTK RH2000 höjd djupaste del uppströms/thalweg", type: "decimal", showIf: (a) => a.mataInskarningskvot === "Ja" },
      { key: "hojdBankfull", label: "RTK RH2000 höjd bankfullnivå", type: "decimal", showIf: (a) => a.mataInskarningskvot === "Ja" },
      { key: "inskarningskvot", label: "Beräknad inskärningskvot", type: "computed", showIf: (a) => a.mataInskarningskvot === "Ja" },
      { key: "aktivtSvamplan", label: "Aktivt svämplan", type: "binary" },
      { key: "recentTerrass", label: "Recent terrass", type: "binary" },
      { key: "sekundaraSvamplan", label: "Sekundära svämplan", type: "binary" },
      { key: "beraknaInneslutning", label: "Beräkna inneslutning (CI/CD)", type: "binary" },
      { key: "nuvarandeSvamplansbredd", label: "Nuvarande aktiv svämplansbredd inkl. fåra (m)", type: "number", showIf: (a) => a.beraknaInneslutning === "Ja" },
      { key: "ursprungligSvamplansbredd", label: "Ursprunglig svämplansbredd (m)", type: "number", showIf: (a) => a.beraknaInneslutning === "Ja" },
      { key: "farbredd", label: "Fårans bredd (m)", type: "number", showIf: (a) => a.beraknaInneslutning === "Ja" },
      { key: "andelSekundartSvamplan", label: "Andel fåra med sekundärt svämplan (%)", type: "number", showIf: (a) => a.beraknaInneslutning === "Ja" },
      { key: "ursprungligCdBedomning", label: "Ursprunglig CD bedömning (%)", type: "number", showIf: (a) => a.beraknaInneslutning === "Ja" },
      { key: "nuvarandeCi", label: "Nuvarande CI", type: "computed", showIf: (a) => a.beraknaInneslutning === "Ja" },
      { key: "ursprungligCi", label: "Ursprunglig CI", type: "computed", showIf: (a) => a.beraknaInneslutning === "Ja" },
      { key: "nuvarandeCd", label: "Nuvarande CD (%)", type: "computed", showIf: (a) => a.beraknaInneslutning === "Ja" },
      {
        key: "utvecklingsfas",
        label: "A22 Utvecklingsfas",
        type: "select",
        options: ["Bedömning saknas", "1", "2a", "3a"],
        help: "https://www.hymoinfo.com/a22-utvecklingsfas.html",
        showIf: (a) => a.paverkan === "Ja" && ["Cx", "Ex", "Tt"].includes(a.hymotyp),
      },
    ],
  },
  {
    title: "Åtgärder och beskrivning",
    fields: [
      { key: "atgardsbehov", label: "Åtgärdsbehov", type: "binary" },
      { key: "ersattningsmaterialStracka", label: "Behövs ersättningsmaterial på sträckan?", type: "binary", showIf: (a) => String(a.hymotyp ?? "").startsWith("B") },
      { key: "ersattningsmaterialMangd", label: "Mängd ersättningsmaterial", type: "text", showIf: (a) => String(a.hymotyp ?? "").startsWith("B") && a.ersattningsmaterialStracka === "Ja" },
      {
        key: "ersattningsmaterialFraktion",
        label: "Fraktion",
        type: "buttons",
        options: ["0-32", "32-64", "64-128", "128-256", "256-512", "Block", "Metersblock"],
        showIf: (a) => String(a.hymotyp ?? "").startsWith("B") && a.ersattningsmaterialStracka === "Ja",
      },
      {
        key: "maskinStorlek",
        label: "Maskinstorlek",
        type: "buttons",
        options: ["Mindre", "15-17", "17-20", "20-25", "25-30", "30->"],
        showIf: (a) => a.atgardsbehov === "Ja",
      },
      { key: "schaktmaskin", label: "Schaktmaskin", type: "binary", showIf: (a) => a.atgardsbehov === "Ja" },
      { key: "atgarder", label: "Åtgärder", type: "textarea", showIf: (a) => a.atgardsbehov === "Ja" },
      { key: "beskrivning", label: "Beskriv sträckan", type: "textarea" },
    ],
  },
  {
    title: "Efter åtgärd",
    fields: [
      { key: "efterAtgardStatus", label: "Efter åtgärd dokumenterad", type: "binary" },
      { key: "efterAtgardDatum", label: "Datum efter åtgärd", type: "text", showIf: (a) => a.efterAtgardStatus === "Ja" },
      { key: "efterAtgardUtforare", label: "Utförare", type: "text", showIf: (a) => a.efterAtgardStatus === "Ja" },
      { key: "tidigareRestaurering", label: "Tidigare restaurering", type: "binary" },
      { key: "tidigareRestaureringBeskrivning", label: "Beskriv tidigare restaurering", type: "textarea", showIf: (a) => a.tidigareRestaurering === "Ja" },
      { key: "efterAtgardGjort", label: "Vad är gjort?", type: "textarea", showIf: (a) => a.efterAtgardStatus === "Ja" },
      { key: "efterAtgardLamnat", label: "Vad är lämnat/kvar?", type: "textarea", showIf: (a) => a.efterAtgardStatus === "Ja" },
      { key: "efterAtgardKommentar", label: "Kommentar efter åtgärd", type: "textarea", showIf: (a) => a.efterAtgardStatus === "Ja" },
    ],
  },
];

const part2Groups = new Set(["Vegetation, skuggning och död ved"]);
const part3Groups = new Set(["Basnivå, svämplan och utveckling"]);

const objectTypeOptionsByGeometry = {
  point: ["Bestämmande sektion", "Knickpoint", "Kulturmiljö", "Damm", "Åtgärdspunkt", "Ersättningsmaterial", "Lekbotten", "Uppföljning"],
  line: ["Ledarm", "Upprensning", "Sidogren", "Körväg", "Ersättningsmaterial", "Lekbotten", "Uppföljning"],
  area: ["Översvämningsyta", "Åtgärdsyta", "Ersättningsmaterial", "Lekbotten", "Uppföljning"],
};

const fallbackObjectTypes = [
  "Vandringshinder",
  "Trumma",
  "Erosion",
  "Sidofåra",
  "Kvill",
  "Översvämningsyta",
  "Åtgärdspunkt",
];

const defaultMapCenter = [60.965, 16.44];

const state = {
  nextSectionNumber: 1,
  activeSection: null,
  sections: [],
  objects: [],
  photos: [],
  fieldPackages: [],
  draftFieldReach: [],
  referenceLines: [],
  selectedReferenceLineId: null,
  selectedReferenceLineIds: [],
  activeSegmentId: null,
  activeSegmentIds: [],
  activeReachGeometry: [],
  reachWorkflowState: "idle",
  mappingStarted: false,
  tool: "pan",
  lastObjectTool: "point",
  lastExport: null,
  objectEditDraft: null,
  tempObject: null,
  dragging: null,
  gpsEnabled: false,
  gpsWatchId: null,
  gpsPosition: null,
  hasCenteredOnGps: false,
  mapOffset: [0, 0],
  useSupportLine: false,
  baseMapLayer: null,
};

const map = document.querySelector("#map");
const mapToolbar = document.querySelector("#map-toolbar");
const toolMenuButton = document.querySelector("#tool-menu-button");
const mapZoomInButton = document.querySelector("#map-zoom-in");
const mapZoomOutButton = document.querySelector("#map-zoom-out");
const basemapSelect = document.querySelector("#basemap-select");
const themeToggleButton = document.querySelector("#theme-toggle-button");
const startScreen = document.querySelector("#start-screen");
const splashCover = document.querySelector("#splash-cover");
const projectList = document.querySelector("#project-list");
const savedProjectSelect = document.querySelector("#saved-project-select");
const openSelectedProjectButton = document.querySelector("#open-selected-project-button");
const startWatercourseInput = document.querySelector("#start-watercourse-input");
const startNewButton = document.querySelector("#start-new-button");
const supportLine = document.querySelector("#support-line");
const mapPhotoInput = document.querySelector("#map-photo-input");
const fieldLayer = document.querySelector("#field-layer");
const sectionsLayer = document.querySelector("#sections-layer");
const gpsLayer = document.querySelector("#gps-layer");
const verticesLayer = document.querySelector("#vertices-layer");
const previewLayer = document.querySelector("#preview-layer");
const objectsLayer = document.querySelector("#objects-layer");
const sectionNumber = document.querySelector("#section-number");
const activeState = document.querySelector("#active-state");
const startStopButton = document.querySelector("#start-stop-button");
const mapHint = document.querySelector("#map-hint");
const sideMapHint = document.querySelector("#side-map-hint");
const lengthLabel = document.querySelector("#length-label");
const gpsToggleButton = document.querySelector("#gps-toggle-button");
const debugLogButton = document.querySelector("#debug-log-button");
const centerGpsButton = document.querySelector("#center-gps-button");
const switchProjectButton = document.querySelector("#switch-project-button");
const protocolFields = document.querySelector("#protocol-fields");
const addSectionPhotoButton = document.querySelector("#add-section-photo-button");
const sectionPhotoInput = document.querySelector("#section-photo-input");
const sectionPhotoList = document.querySelector("#section-photo-list");
const sectionList = document.querySelector("#section-list");
const objectList = document.querySelector("#object-list");
const objectType = document.querySelector("#object-type");
const objectComment = document.querySelector("#object-comment");
const objectSectionLabel = document.querySelector("#object-section-label");
const undoDrawButton = document.querySelector("#undo-draw-button");
const finishDrawButton = document.querySelector("#finish-draw-button");
const cancelDrawButton = document.querySelector("#cancel-draw-button");
const saveObjectButton = document.querySelector("#save-object-button");
const cancelObjectEditButton = document.querySelector("#cancel-object-edit-button");
const addObjectPhotoButton = document.querySelector("#add-object-photo-button");
const objectPhotoInput = document.querySelector("#object-photo-input");
const watercourseLabel = document.querySelector("#watercourse-label");
const watercourseInput = document.querySelector("#watercourse-input");
const openWatercourseButton = document.querySelector("#open-watercourse-button");
const newWatercourseButton = document.querySelector("#new-watercourse-button");
const projectInventor = document.querySelector("#project-inventor");
const projectDateLabel = document.querySelector("#project-date-label");
const saveStateLabel = document.querySelector("#save-state-label");
const fieldStatusLabel = document.querySelector("#field-status-label");
const fieldPackageName = document.querySelector("#field-package-name");
const fieldBufferSelect = document.querySelector("#field-buffer-select");
const fieldCustomBufferWrap = document.querySelector("#field-custom-buffer-wrap");
const fieldCustomBuffer = document.querySelector("#field-custom-buffer");
const drawFieldReachButton = document.querySelector("#draw-field-reach-button");
const prepareFieldAreaButton = document.querySelector("#prepare-field-area-button");
const clearFieldAreaButton = document.querySelector("#clear-field-area-button");
const fieldPackageList = document.querySelector("#field-package-list");
const fieldStepPanel = document.querySelector("#field-step-panel");
const mappingWorkspace = document.querySelector("#mapping-workspace");
const startMappingButton = document.querySelector("#start-mapping-button");
const fetchLantmaterietWaterwaysButton = document.querySelector("#fetch-lantmateriet-waterways-button");
const importReferenceLineButton = document.querySelector("#import-reference-line-button");
const fetchOsmWaterwaysButton = document.querySelector("#fetch-osm-waterways-button");
const lantmaterietTokenInput = document.querySelector("#lantmateriet-token-input");
const toggleLantmaterietTokenButton = document.querySelector("#toggle-lantmateriet-token-button");
const saveLantmaterietTokenButton = document.querySelector("#save-lantmateriet-token-button");
const testLantmaterietTokenButton = document.querySelector("#test-lantmateriet-token-button");
const clearLantmaterietTokenButton = document.querySelector("#clear-lantmateriet-token-button");
const lantmaterietTokenStatus = document.querySelector("#lantmateriet-token-status");
const referenceLineInput = document.querySelector("#reference-line-input");
const referenceLineStatus = document.querySelector("#reference-line-status");
const referenceLineList = document.querySelector("#reference-line-list");
const exportDialog = document.querySelector("#export-dialog");
const exportStatusText = document.querySelector("#export-status-text");
const exportShareButton = document.querySelector("#export-share-button");
const exportDownloadButton = document.querySelector("#export-download-button");

state.watercourse = "Bresiljeån";
state.selectedObjectId = null;
state.projectMeta = { inventor: "" };

const debugLogEntries = [];
let debugLogCopyTimer = null;
const nativeConsole = {
  info: console.info.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console),
};

function redactDebugText(text) {
  return String(text)
    .replace(/(access_token=)[^&\s]+/gi, "$1[redacted]")
    .replace(/(authorization["':\s]+)(bearer|basic)?\s*[^,\n}\]]+/gi, "$1[redacted]")
    .replace(/(token["':\s]+)[^,\n}\]]+/gi, "$1[redacted]");
}

function debugValueToText(value) {
  if (value instanceof Error) return `${value.name}: ${value.message}${value.stack ? `\n${value.stack}` : ""}`;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return String(value);
  }
}

function renderDebugLogButton() {
  if (!debugLogButton) return;
  const errors = debugLogEntries.filter((entry) => entry.level === "error" || entry.level === "warn").length;
  debugLogButton.classList.toggle("hidden", debugLogEntries.length === 0);
  debugLogButton.classList.toggle("has-errors", errors > 0);
  if (!debugLogButton.classList.contains("copied")) {
    debugLogButton.textContent = errors > 0 ? `Bugglogg ${errors}` : `Bugglogg ${debugLogEntries.length}`;
  }
  debugLogButton.title = "Tryck för att kopiera felsökningsloggen.";
}

function addDebugLog(level, values) {
  const entry = {
    time: new Date().toISOString(),
    level,
    message: redactDebugText(values.map(debugValueToText).join(" ")),
  };
  debugLogEntries.push(entry);
  if (debugLogEntries.length > DEBUG_LOG_LIMIT) debugLogEntries.splice(0, debugLogEntries.length - DEBUG_LOG_LIMIT);
  renderDebugLogButton();
}

function debugLogText() {
  return debugLogEntries
    .map((entry) => `[${entry.time}] [${entry.level.toUpperCase()}]\n${entry.message}`)
    .join("\n\n");
}

async function copyDebugLog() {
  if (!debugLogEntries.length) return;
  const text = debugLogText();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    debugLogButton?.classList.add("copied");
    if (debugLogButton) debugLogButton.textContent = "Kopierad";
    window.clearTimeout(debugLogCopyTimer);
    debugLogCopyTimer = window.setTimeout(() => {
      debugLogButton?.classList.remove("copied");
      renderDebugLogButton();
    }, 1600);
  } catch (error) {
    nativeConsole.warn("[InField debug log] Kunde inte kopiera buggloggen.", error);
    addDebugLog("warn", ["Kunde inte kopiera buggloggen automatiskt.", error]);
  }
}

function installDebugLogCapture() {
  console.warn = (...values) => {
    nativeConsole.warn(...values);
    addDebugLog("warn", values);
  };
  console.error = (...values) => {
    nativeConsole.error(...values);
    addDebugLog("error", values);
  };
  console.info = (...values) => {
    nativeConsole.info(...values);
    const marker = String(values[0] ?? "");
    if (
      marker.includes("[InField OSM") ||
      marker.includes("[InField basemap") ||
      marker.includes("[InField reach]") ||
      marker.includes("[InField map]")
    ) {
      addDebugLog("info", values);
    }
  };
  window.addEventListener("error", (event) => {
    addDebugLog("error", [
      event.message || "JavaScript-fel",
      `${event.filename || "okänd fil"}:${event.lineno || 0}:${event.colno || 0}`,
      event.error,
    ]);
  });
  window.addEventListener("unhandledrejection", (event) => {
    addDebugLog("error", ["Ohanterat fel i bakgrunden", event.reason]);
  });
}

installDebugLogCapture();

function pathFromPoints(points) {
  return points.map((p, index) => `${index === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
}

function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function sectionLength(points) {
  return points.slice(1).reduce((sum, point, index) => sum + mapDistance(points[index], point), 0);
}

function formatLength(points) {
  const meters = sectionLength(points);
  return meters > 1000 ? `${(meters / 1000).toFixed(2)} km` : `${Math.round(meters)} m`;
}

function isGeoPoint(point) {
  return Array.isArray(point) && Math.abs(point[0]) <= 180 && Math.abs(point[1]) <= 90;
}

function staticSvgPointToGeo(point) {
  const baseLat = defaultMapCenter[0];
  const baseLon = defaultMapCenter[1];
  const lon = baseLon + (point[0] - 500) / 12000;
  const lat = baseLat - (point[1] - 390) / 18000;
  return [Number(lon.toFixed(7)), Number(lat.toFixed(7))];
}

function normalizePoint(point) {
  return isGeoPoint(point) ? point : staticSvgPointToGeo(point);
}

function normalizePoints(points = []) {
  return points.map(normalizePoint);
}

function toLatLng(point) {
  const [lon, lat] = normalizePoint(point);
  return [lat, lon];
}

function toLatLngs(points = []) {
  return points.map(toLatLng);
}

function fromLatLng(latlng) {
  return [Number(latlng.lng.toFixed(7)), Number(latlng.lat.toFixed(7))];
}

function mapDistance(a, b) {
  if (window.L) return window.L.latLng(toLatLng(a)).distanceTo(window.L.latLng(toLatLng(b)));
  return distance(a, b);
}

function closestOnSegment(point, a, b) {
  const ax = a[0];
  const ay = a[1];
  const bx = b[0];
  const by = b[1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((point[0] - ax) * dx + (point[1] - ay) * dy) / len));
  return { point: [ax + t * dx, ay + t * dy], t };
}

function snapToSupport(point) {
  let best = { point: supportPoints[0], segment: 0, t: 0, dist: Infinity };
  for (let i = 0; i < supportPoints.length - 1; i += 1) {
    const candidate = closestOnSegment(point, supportPoints[i], supportPoints[i + 1]);
    const candidateDist = distance(point, candidate.point);
    if (candidateDist < best.dist) {
      best = { ...candidate, segment: i, dist: candidateDist };
    }
  }
  return best;
}

function supportSlice(start, stop) {
  const first = start.segment + start.t;
  const last = stop.segment + stop.t;
  const reversed = first > last;
  const from = reversed ? stop : start;
  const to = reversed ? start : stop;
  const points = [from.point];
  for (let i = from.segment + 1; i <= to.segment; i += 1) {
    points.push(supportPoints[i]);
  }
  points.push(to.point);
  return reversed ? points.reverse() : points;
}

function activeSupportLine() {
  if (state.mappingStarted && state.activeReachGeometry?.length > 1) return state.activeReachGeometry;
  const selected = selectedReferenceLines();
  if (selected.length) return combinedReferenceLinePoints(selected);
  if (state.draftFieldReach.length > 1) return state.draftFieldReach;
  return null;
}

function activeReachIds() {
  if (Array.isArray(state.activeSegmentIds) && state.activeSegmentIds.length) return state.activeSegmentIds;
  return state.activeSegmentId ? [state.activeSegmentId] : [];
}

function clearTemporaryDrawingState() {
  state.tempObject = null;
  state.dragging = null;
  previewLayer.innerHTML = "";
}

function snapToLine(point, points) {
  let best = { point: points[0], segment: 0, t: 0, dist: Infinity };
  for (let i = 0; i < points.length - 1; i += 1) {
    const candidate = closestOnGeoSegment(point, points[i], points[i + 1]);
    const candidateDist = mapDistance(point, candidate.point);
    if (candidateDist < best.dist) best = { ...candidate, segment: i, dist: candidateDist };
  }
  return best;
}

function closestOnGeoSegment(point, a, b) {
  const origin = a;
  const p = lonLatToMeters(point, origin);
  const start = lonLatToMeters(a, origin);
  const stop = lonLatToMeters(b, origin);
  const dx = stop[0] - start[0];
  const dy = stop[1] - start[1];
  const len = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p[0] - start[0]) * dx + (p[1] - start[1]) * dy) / len));
  const snappedMeters = [start[0] + t * dx, start[1] + t * dy];
  return { point: metersToLonLat(snappedMeters, origin), t };
}

function lineSlice(points, start, stop) {
  const first = start.segment + start.t;
  const last = stop.segment + stop.t;
  const reversed = first > last;
  const from = reversed ? stop : start;
  const to = reversed ? start : stop;
  const sliced = [from.point];
  for (let i = from.segment + 1; i <= to.segment; i += 1) {
    sliced.push(points[i]);
  }
  sliced.push(to.point);
  return reversed ? sliced.reverse() : sliced;
}

function svgPoint(event) {
  const pt = map.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const transformed = pt.matrixTransform(map.getScreenCTM().inverse());
  return [transformed.x, transformed.y];
}

function projectGpsToMap(position) {
  if (state.backgroundMap) {
    const point = state.backgroundMap.latLngToContainerPoint([position.coords.latitude, position.coords.longitude]);
    return containerPointToSvg([point.x, point.y]);
  }
  const baseLat = defaultMapCenter[0];
  const baseLon = defaultMapCenter[1];
  const x = 500 + (position.coords.longitude - baseLon) * 12000 + state.mapOffset[0];
  const y = 390 - (position.coords.latitude - baseLat) * 18000 + state.mapOffset[1];
  return [Math.max(20, Math.min(980, x)), Math.max(20, Math.min(760, y))];
}

function mapPointToGeo(point) {
  if (isGeoPoint(point)) return point;
  if (state.backgroundMap) {
    return staticSvgPointToGeo(point);
  }
  const baseLat = defaultMapCenter[0];
  const baseLon = defaultMapCenter[1];
  const lon = baseLon + (point[0] - state.mapOffset[0] - 500) / 12000;
  const lat = baseLat - (point[1] - state.mapOffset[1] - 390) / 18000;
  return [Number(lon.toFixed(7)), Number(lat.toFixed(7))];
}

function svgPointToContainer(point) {
  const rect = map.getBoundingClientRect();
  return [(point[0] / 1000) * rect.width, (point[1] / 780) * rect.height];
}

function containerPointToSvg(point) {
  const rect = map.getBoundingClientRect();
  return [(point[0] / rect.width) * 1000, (point[1] / rect.height) * 780];
}

function renderGps() {
  gpsLayer.innerHTML = "";
  gpsToggleButton.classList.toggle("active", state.gpsEnabled);
  gpsToggleButton.setAttribute("aria-pressed", String(state.gpsEnabled));
  state.leafletLayers?.gps?.clearLayers();
  if (!state.gpsPosition) return;
  if (state.leafletLayers?.gps && window.L) {
    const latLng = [state.gpsPosition.coords.latitude, state.gpsPosition.coords.longitude];
    const accuracy = state.gpsPosition.coords.accuracy ?? 20;
    window.L.circle(latLng, {
      radius: accuracy,
      color: "rgba(37, 99, 235, 0.45)",
      weight: 2,
      fillColor: "rgba(37, 99, 235, 0.16)",
      fillOpacity: 1,
    }).addTo(state.leafletLayers.gps);
    window.L.circleMarker(latLng, {
      radius: 8,
      color: "#ffffff",
      weight: 3,
      fillColor: "#2563eb",
      fillOpacity: 1,
    }).addTo(state.leafletLayers.gps);
    return;
  }
  const [x, y] = projectGpsToMap(state.gpsPosition);
  const accuracy = Math.max(16, Math.min(90, (state.gpsPosition.coords.accuracy ?? 20) / 2));
  gpsLayer.append(makeSvg("circle", { cx: x, cy: y, r: accuracy, class: "gps-accuracy" }));
  gpsLayer.append(makeSvg("circle", { cx: x, cy: y, r: 10, class: "gps-dot" }));
}

function toggleGps() {
  if (state.gpsEnabled) {
    if (state.gpsWatchId !== null) navigator.geolocation.clearWatch(state.gpsWatchId);
    state.gpsEnabled = false;
    state.gpsWatchId = null;
    state.hasCenteredOnGps = false;
    render();
    return;
  }
  if (!navigator.geolocation) {
    mapHint.textContent = "GPS stöds inte i den här webbläsaren.";
    return;
  }
  state.gpsEnabled = true;
  state.gpsWatchId = navigator.geolocation.watchPosition(
    (position) => {
      state.gpsPosition = position;
      if (state.backgroundMap && !state.hasCenteredOnGps) {
        state.backgroundMap.setView([position.coords.latitude, position.coords.longitude], Math.max(state.backgroundMap.getZoom(), 16));
        state.hasCenteredOnGps = true;
      }
      render();
    },
    () => {
      state.gpsEnabled = false;
      mapHint.textContent = "Kunde inte hämta GPS-position.";
      render();
    },
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 },
  );
  render();
}

function centerOnGps() {
  if (!state.gpsPosition) {
    mapHint.textContent = "Slå på GPS och vänta på position först.";
    return;
  }
  if (state.backgroundMap) {
    state.backgroundMap.setView([state.gpsPosition.coords.latitude, state.gpsPosition.coords.longitude], Math.max(state.backgroundMap.getZoom(), 16));
    render();
    return;
  }
  const [x, y] = projectGpsToMap(state.gpsPosition);
  state.mapOffset[0] += 500 - x;
  state.mapOffset[1] += 390 - y;
  render();
}

function defaultProjectMeta() {
  return { inventor: "" };
}

function syncProjectMetaFromForm() {
  state.projectMeta = {
    ...defaultProjectMeta(),
    ...(state.projectMeta ?? {}),
    inventor: projectInventor.value,
  };
}

function syncProjectMetaToForm() {
  projectInventor.value = state.projectMeta?.inventor ?? "";
  projectDateLabel.textContent = new Date().toISOString().slice(0, 10);
}

function makeSvg(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function logTileError(baseMapId, event) {
  const coords = event.coords ?? {};
  const tileUrl = event.tile?.src || event.url || "";
  console.warn("[InField basemap tile error]", {
    baseMapId,
    label: baseMaps[baseMapId]?.label ?? baseMapId,
    tilematrixset: baseMapId?.startsWith("lm-") ? "3857" : "xyz",
    z: coords.z,
    x: coords.x,
    y: coords.y,
    url: tileUrl,
    error: event.error?.message ?? event.error ?? null,
  });
}

function attachBaseMapDiagnostics(layer, baseMapId) {
  let errorCount = 0;
  layer.on?.("tileerror", (event) => {
    errorCount += 1;
    logTileError(baseMapId, event);
    if (errorCount === 4 && basemapSelect?.value === baseMapId) {
      const warning = "LM-kartan kunde inte laddas helt. Kontrollera nätverk eller välj annan baskarta.";
      mapHint.textContent = warning;
      sideMapHint.textContent = warning;
    }
  });
  layer.on?.("tileloadstart", (event) => {
    if (!baseMapId?.startsWith("lm-")) return;
    const coords = event.coords ?? {};
    if (coords.z > (baseMaps[baseMapId].options.maxNativeZoom ?? baseMaps[baseMapId].options.maxZoom)) {
      console.warn("[InField basemap zoom warning]", {
        baseMapId,
        z: coords.z,
        maxNativeZoom: baseMaps[baseMapId].options.maxNativeZoom,
      });
    }
  });
}

function setBaseMap(id = basemapSelect?.value ?? "osm", options = {}) {
  if (!state.backgroundMap || !window.L) return;
  const requestedId = baseMaps[id] ? id : "osm";
  const nextId = requestedId;
  if (state.baseMapLayer) state.backgroundMap.removeLayer(state.baseMapLayer);
  const config = baseMaps[nextId];
  state.backgroundMap.setMinZoom(config.options.minZoom ?? 0);
  state.backgroundMap.setMaxZoom(config.options.maxZoom ?? 19);
  if (state.backgroundMap.getZoom() > (config.options.maxZoom ?? 19)) {
    state.backgroundMap.setZoom(config.options.maxZoom ?? 19, { animate: false });
  }
  state.baseMapLayer = window.L.tileLayer(config.url, config.options);
  attachBaseMapDiagnostics(state.baseMapLayer, nextId);
  state.baseMapLayer.addTo(state.backgroundMap);
  state.baseMapLayer.bringToBack();
  if (basemapSelect) basemapSelect.value = nextId;
  if (options.remember !== false) localStorage.setItem(BASEMAP_KEY, nextId);
}

function base64Encode(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

function authorizationHeader(auth) {
  if (!auth) return "";
  return auth.includes(":") ? `Basic ${base64Encode(auth)}` : `Bearer ${auth}`;
}

function setTheme(theme = localStorage.getItem(THEME_KEY) ?? "dark") {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_KEY, nextTheme);
  if (themeToggleButton) {
    themeToggleButton.textContent = nextTheme === "dark" ? "Ljust" : "Mörkt";
    themeToggleButton.setAttribute("aria-pressed", String(nextTheme === "dark"));
  }
  setBaseMap(basemapSelect?.value ?? localStorage.getItem(BASEMAP_KEY) ?? "osm");
}

function initBackgroundMap() {
  if (!window.L) return;
  const background = window.L.map("background-map", {
    center: defaultMapCenter,
    zoom: 14,
    zoomControl: false,
    attributionControl: true,
    dragging: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    keyboard: true,
    tap: true,
    touchZoom: true,
  });
  background.on("move zoom", renderGps);
  state.backgroundMap = background;
  setBaseMap(localStorage.getItem(BASEMAP_KEY) ?? basemapSelect?.value ?? "osm");
  state.leafletLayers = {
    field: window.L.layerGroup().addTo(background),
    references: window.L.layerGroup().addTo(background),
    sections: window.L.layerGroup().addTo(background),
    objects: window.L.layerGroup().addTo(background),
    gps: window.L.layerGroup().addTo(background),
  };
  background.on("click", handleLeafletMapClick);
  map.classList.add("map-dimmed");
  setTool(state.tool);
  setTimeout(() => background.invalidateSize(), 150);
}

function storageKey(name = state.watercourse) {
  return `vattendragskartering:${name.trim().toLowerCase()}`;
}

function savedProjectKeys() {
  return Object.keys(localStorage).filter((key) => key.startsWith("vattendragskartering:"));
}

function readSavedProject(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

function renderProjectList() {
  projectList.innerHTML = "";
  savedProjectSelect.innerHTML = '<option value="">Välj sparat vattendrag</option>';
  const projects = savedProjectKeys()
    .map((key) => ({ key, payload: readSavedProject(key) }))
    .filter((item) => item.payload)
    .sort((a, b) => (b.payload.savedAt ?? "").localeCompare(a.payload.savedAt ?? ""));

  if (!projects.length) {
    const li = document.createElement("li");
    li.innerHTML = "<strong>Inga sparade vattendrag än</strong><span>Starta ett nytt vattendrag ovan.</span>";
    projectList.append(li);
    return;
  }

  projects.forEach(({ key, payload }) => {
    const option = document.createElement("option");
    option.value = payload.watercourse;
    option.textContent = payload.watercourse;
    savedProjectSelect.append(option);
    const sections = payload.sections?.length ?? 0;
    const objects = payload.objects?.length ?? 0;
    const photos = payload.photos?.length ?? 0;
    const li = document.createElement("li");
    li.innerHTML = `<strong>${payload.watercourse}</strong><span>${sections} sträckor · ${objects} objekt · ${photos} foton</span><div class="list-actions"><button class="quiet-button" data-open-project="${payload.watercourse}">Öppna</button><button class="quiet-button" data-export-project="${payload.watercourse}">Exportera</button><button class="danger-button" data-delete-project="${key}">Radera lokalt</button></div>`;
    projectList.append(li);
  });
}

function showStartScreen() {
  renderProjectList();
  splashCover?.removeAttribute("aria-hidden");
  splashCover?.removeAttribute("tabindex");
  startScreen.classList.remove("show-projects");
  startScreen.classList.remove("hidden");
}

function hideStartScreen() {
  startScreen.classList.add("hidden");
}

function showProjectPicker() {
  splashCover?.setAttribute("aria-hidden", "true");
  splashCover?.setAttribute("tabindex", "-1");
  startScreen.classList.add("show-projects");
  console.info("[InField splash] Splashen är dold, startvyn visas.");
}

function persistActiveSectionAsDraft() {
  if (!state.activeSection) return null;
  syncFormToProtocol({ save: false });
  const section = {
    ...state.activeSection,
    attributes: { ...(state.activeSection.attributes ?? {}) },
    points:
      state.activeSection.points?.length > 1
        ? expandedSectionPoints(state.activeSection)
        : normalizePoints(state.activeSection.points ?? []),
    status: state.activeSection.status === "finished" ? "finished" : "draft",
    editingExisting: false,
  };
  const existingIndex = state.sections.findIndex((item) => item.id === section.id);
  const action = existingIndex >= 0 ? "updated" : "created";
  if (existingIndex >= 0) {
    state.sections[existingIndex] = section;
  } else {
    state.sections.push(section);
  }
  state.activeSection = null;
  state.nextSectionNumber = nextSectionNumber();
  console.info("[InField reach] Persisted active section before switching watercourse.", {
    sectionId: section.id,
    status: section.status,
    action,
    points: section.points.length,
  });
  return section;
}

function samePointSequence(firstPoints, secondPoints) {
  if (firstPoints.length !== secondPoints.length) return false;
  return firstPoints.every((point, index) => {
    const other = secondPoints[index];
    return other && Math.abs(point[0] - other[0]) < 0.0000001 && Math.abs(point[1] - other[1]) < 0.0000001;
  });
}

function persistDraftFieldReachAsReferenceLine() {
  const points = normalizePoints(state.draftFieldReach ?? []);
  if (points.length < 2) return null;
  const selectedLines = selectedReferenceLines();
  const selectedGeometry = selectedLines.length ? combinedReferenceLinePoints(selectedLines) : [];
  if (selectedGeometry.length && samePointSequence(points, selectedGeometry)) return null;
  const line = normalizeReferenceLine({
    name: selectedLines.length ? "Utkast vald delsträcka" : "Utkast stödlinje",
    source: selectedLines.length ? "Del av vald stödlinje" : "Egen ritad stödlinje",
    properties: {
      infieldDraft: true,
      savedAt: new Date().toISOString(),
    },
    points,
  });
  state.referenceLines.push(line);
  console.info("[InField reach] Persisted draft support line before switching watercourse.", {
    referenceLineId: line.id,
    points: line.points.length,
  });
  return line;
}

function switchProject() {
  persistActiveSectionAsDraft();
  persistDraftFieldReachAsReferenceLine();
  saveProject();
  clearActiveReachLock({ clearSelection: true });
  state.draftFieldReach = [];
  state.mappingStarted = false;
  clearTemporaryDrawingState();
  console.info("[InField reach] Aktiv sträcka släppt via Byt vattendrag utan att radera sparad kartering.");
  renderProjectList();
  startScreen.classList.add("show-projects");
  startScreen.classList.remove("hidden");
}

function saveProject(options = {}) {
  if (options.syncProtocol !== false) syncFormToProtocol({ save: false });
  syncProjectMetaFromForm();
  state.nextSectionNumber = nextSectionNumber();
  const payload = {
    watercourse: state.watercourse,
    nextSectionNumber: state.nextSectionNumber,
    activeSection: state.activeSection,
    sections: state.sections,
    objects: state.objects,
    photos: state.photos,
    fieldPackages: state.fieldPackages,
    referenceLines: state.referenceLines,
    selectedReferenceLineId: state.selectedReferenceLineId,
    selectedReferenceLineIds: selectedReferenceLineIds(),
    activeSegmentId: state.activeSegmentId,
    activeSegmentIds: activeReachIds(),
    activeReachGeometry: state.activeReachGeometry,
    reachWorkflowState: state.reachWorkflowState,
    mappingStarted: state.mappingStarted,
    projectMeta: state.projectMeta,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(storageKey(), JSON.stringify(payload));
  saveStateLabel.textContent = `Sparat lokalt för ${state.watercourse}`;
}

function nextSectionNumber() {
  const numbers = [
    ...state.sections.map((section) => Number(section.number) || 0),
    state.activeSection ? Number(state.activeSection.number) || 0 : 0,
  ];
  return Math.max(0, ...numbers) + 1;
}

function openWatercourse(name, saveCurrent = true) {
  const cleanName = name.trim() || "Nytt vattendrag";
  if (saveCurrent && state.activeSection) {
    syncFormToProtocol();
    state.activeSection.status = "finished";
    state.sections.push(state.activeSection);
    state.activeSection = null;
  }
  if (saveCurrent) saveProject();
  state.watercourse = cleanName;
  watercourseInput.value = cleanName;
  watercourseLabel.textContent = cleanName;
  const saved = localStorage.getItem(storageKey(cleanName));
  if (saved) {
    const payload = JSON.parse(saved);
    state.activeSection = payload.activeSection ? normalizeSectionAttributes(payload.activeSection) : null;
    state.sections = (payload.sections ?? []).map(normalizeSectionAttributes);
    state.objects = (payload.objects ?? []).map(normalizeObjectGeometry);
    state.photos = payload.photos ?? [];
    state.fieldPackages = (payload.fieldPackages ?? []).map(normalizeFieldPackage);
    state.referenceLines = (payload.referenceLines ?? []).map(normalizeReferenceLine);
    setSelectedReferenceLineIds(payload.selectedReferenceLineIds ?? (payload.selectedReferenceLineId ? [payload.selectedReferenceLineId] : []));
    state.mappingStarted = Boolean(payload.mappingStarted || (payload.sections?.length ?? 0) > 0 || payload.activeSection);
    state.activeSegmentId = payload.activeSegmentId ?? null;
    state.activeSegmentIds = payload.activeSegmentIds ?? (payload.activeSegmentId ? [payload.activeSegmentId] : []);
    state.activeReachGeometry = normalizePoints(payload.activeReachGeometry ?? []);
    if (state.mappingStarted && state.activeReachGeometry.length < 2) {
      state.activeReachGeometry = selectedReferenceLines().length ? combinedReferenceLinePoints(selectedReferenceLines()) : [];
    }
    state.draftFieldReach = state.mappingStarted ? state.activeReachGeometry : [];
    state.reachWorkflowState = payload.reachWorkflowState ?? (state.mappingStarted ? "reach_started" : state.activeReachGeometry.length > 1 ? "watercourse_selected" : "idle");
    state.projectMeta = { ...defaultProjectMeta(), ...(payload.projectMeta ?? {}) };
    syncProjectMetaToForm();
    syncProjectChoices();
    state.nextSectionNumber = Math.max(payload.nextSectionNumber ?? 1, nextSectionNumber());
    saveStateLabel.textContent = `Öppnade sparat arbete för ${cleanName}`;
  } else {
    state.nextSectionNumber = 1;
    state.sections = [];
    state.objects = [];
    state.photos = [];
    state.fieldPackages = [];
    state.referenceLines = [];
    state.selectedReferenceLineId = null;
    state.selectedReferenceLineIds = [];
    clearActiveReachLock();
    state.draftFieldReach = [];
    state.mappingStarted = false;
    state.projectMeta = defaultProjectMeta();
    syncProjectMetaToForm();
    syncProjectChoices();
    saveStateLabel.textContent = `Nytt vattendrag: ${cleanName}`;
  }
  state.tempObject = null;
  syncProtocolToForm();
  render();
  hideStartScreen();
}

function newWatercourse() {
  const name = window.prompt("Namn på nytt vattendrag");
  if (!name) return;
  openWatercourse(name);
}

function startNewWatercourse() {
  const name = startWatercourseInput.value.trim();
  if (!name) return;
  openWatercourse(name);
  startWatercourseInput.value = "";
}

function deleteSavedProject(key) {
  const payload = readSavedProject(key);
  const name = payload?.watercourse ?? key.replace("vattendragskartering:", "");
  if (!window.confirm(`Är du riktigt säker på vad du gör nu?\n\nJa = radera lokal kopia av ${name}\nNej = avbryt`)) return;
  localStorage.removeItem(key);
  renderProjectList();
}

function syncProjectChoices() {
}

function defaultProtocolAttributes() {
  const attributes = {};
  protocolGroups.flatMap((group) => group.fields).forEach((field) => {
    attributes[field.key] = field.type === "binary" ? "Nej" : "";
  });
  attributes.efterAtgardDatum = new Date().toISOString().slice(0, 10);
  attributes.efterAtgardUtforare = state.projectMeta?.inventor ?? "";
  return attributes;
}

function protocolPartForHymotype(hymotype = "") {
  if (hymotype.startsWith("A") || hymotype.startsWith("B")) return "del1";
  if (hymotype === "Tt") return "del2";
  if (hymotype.startsWith("C") || hymotype.startsWith("D") || hymotype.startsWith("E") || hymotype.startsWith("F")) return "del3";
  return "del1";
}

function groupVisibleForPart(group, attrs) {
  const part = protocolPartForHymotype(attrs.hymotyp);
  if (part === "del1" && (part2Groups.has(group.title) || part3Groups.has(group.title))) return false;
  if (part === "del2" && part3Groups.has(group.title)) return false;
  return true;
}

function normalizeSectionAttributes(section) {
  section.attributes = { ...defaultProtocolAttributes(), ...(section.attributes ?? {}) };
  section.points = normalizePoints(section.points ?? []);
  return section;
}

function normalizeObjectGeometry(object) {
  if (!object?.geometry) return object;
  if (object.geometry.type === "Point") {
    object.geometry.coordinates = normalizePoint(object.geometry.coordinates);
  }
  if (object.geometry.type === "LineString") {
    object.geometry.coordinates = normalizePoints(object.geometry.coordinates);
  }
  if (object.geometry.type === "Polygon") {
    object.geometry.coordinates = (object.geometry.coordinates ?? []).map(normalizePoints);
  }
  return object;
}

function normalizeFieldPackage(fieldPackage) {
  fieldPackage.plannedReach = normalizePoints(fieldPackage.plannedReach ?? []);
  fieldPackage.fieldArea = normalizePoints(fieldPackage.fieldArea ?? []);
  return fieldPackage;
}

function firstReadableValue(value) {
  if (value === null || value === undefined) return "";
  if (Array.isArray(value)) {
    for (const item of value) {
      const readable = firstReadableValue(item);
      if (readable) return readable;
    }
    return "";
  }
  if (typeof value === "object") {
    return firstReadableValue(value.text ?? value.name ?? value.namn ?? value.Name ?? value.NAMN ?? value.value ?? value.id ?? value.Id);
  }
  return String(value).trim();
}

function safeReferenceLineName(line, fallback = "Namnlös vattendragslinje") {
  const properties = line?.properties ?? {};
  const readable = firstReadableValue(
    line?.displayName ??
      line?.name ??
      properties.geographicalName ??
      properties["geographicalName.text"] ??
      properties.namn ??
      properties.name ??
      properties.NAMN ??
      properties.Name ??
      properties.Id ??
      properties.id,
  );
  return readable || fallback;
}

function normalizeReferenceLine(line) {
  const properties = line.properties ?? {};
  const displayName = safeReferenceLineName({ ...line, properties });
  return {
    id: line.id ?? crypto.randomUUID(),
    name: displayName,
    displayName,
    source: line.source ?? "",
    license: line.license ?? "",
    properties,
    points: normalizePoints(line.points ?? []),
  };
}

function selectedReferenceLineIds() {
  const ids = Array.isArray(state.selectedReferenceLineIds)
    ? state.selectedReferenceLineIds
    : state.selectedReferenceLineId
      ? [state.selectedReferenceLineId]
      : [];
  const existingIds = new Set(state.referenceLines.map((line) => line.id));
  return ids.filter((id) => existingIds.has(id));
}

function setSelectedReferenceLineIds(ids) {
  const uniqueIds = [...new Set(ids)].filter(Boolean);
  state.selectedReferenceLineIds = uniqueIds;
  state.selectedReferenceLineId = uniqueIds[0] ?? null;
}

function setActiveReachFromSelectedLines() {
  const ids = selectedReferenceLineIds();
  const lines = selectedReferenceLines();
  const geometry = lines.length ? combinedReferenceLinePoints(lines) : [];
  state.activeSegmentIds = ids;
  state.activeSegmentId = ids[0] ?? null;
  state.activeReachGeometry = geometry;
  state.reachWorkflowState = geometry.length > 1 ? "watercourse_selected" : "idle";
  console.info("[InField reach] Aktiv sträcka vald.", {
    activeSegmentId: state.activeSegmentId,
    activeSegmentIds: state.activeSegmentIds,
    points: state.activeReachGeometry.length,
  });
  return geometry;
}

function clearActiveReachLock(options = {}) {
  state.activeSegmentId = null;
  state.activeSegmentIds = [];
  state.activeReachGeometry = [];
  state.reachWorkflowState = "idle";
  if (options.clearSelection) setSelectedReferenceLineIds([]);
}

function selectedReferenceLines() {
  const byId = new Map(state.referenceLines.map((line) => [line.id, line]));
  return selectedReferenceLineIds().map((id) => byId.get(id)).filter(Boolean);
}

function selectedReferenceLine() {
  return selectedReferenceLines()[0] ?? null;
}

function isReferenceLineSelected(line) {
  return selectedReferenceLineIds().includes(line.id);
}

function toggleReferenceLineSelection(id) {
  if (state.mappingStarted) {
    console.warn("[InField reach] Klick på annan stödlinje ignoreras under aktiv kartering.", {
      ignoredSegmentId: id,
      activeSegmentId: state.activeSegmentId,
      activeSegmentIds: activeReachIds(),
    });
    referenceLineStatus.textContent = "Kartering är startad. Byt vattendrag för att välja annan stödlinje.";
    return;
  }
  const ids = selectedReferenceLineIds();
  setSelectedReferenceLineIds(ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]);
  clearTemporaryDrawingState();
  activateSelectedReferenceLines({ fit: true });
}

function activateSelectedReferenceLines(options = {}) {
  const lines = selectedReferenceLines();
  state.draftFieldReach = setActiveReachFromSelectedLines();
  if (!lines.length) {
    clearActiveReachLock();
    fieldStatusLabel.textContent = "Ingen stödlinje vald";
    mapHint.textContent = "Välj en stödlinje i listan eller rita egen linje.";
    sideMapHint.textContent = mapHint.textContent;
    return;
  }
  fieldStatusLabel.textContent = "Stödlinje redo";
  mapHint.textContent = lines.length === 1
    ? "Vald stödlinje är aktiv. Starta kartering eller välj start/stopp längs linjen."
    : `${lines.length} stödlinjer är aktiva och används som en sammanhängande stödlinje.`;
  sideMapHint.textContent = mapHint.textContent;
  if (options.fit && state.draftFieldReach.length > 1) fitMapToPoints(state.draftFieldReach);
}

function referenceLineSortKey(line) {
  return safeReferenceLineName(line).replace(/\s+\d+$/, "").trim().toLocaleLowerCase("sv-SE");
}

function setMapInteractionsEnabled(enabled) {
  if (!state.backgroundMap) return;
  const method = enabled ? "enable" : "disable";
  [
    state.backgroundMap.dragging,
    state.backgroundMap.touchZoom,
    state.backgroundMap.doubleClickZoom,
    state.backgroundMap.scrollWheelZoom,
    state.backgroundMap.boxZoom,
    state.backgroundMap.keyboard,
  ].forEach((handler) => handler?.[method]?.());
}

function mapViewSnapshot() {
  if (!state.backgroundMap) return null;
  return {
    center: state.backgroundMap.getCenter(),
    zoom: state.backgroundMap.getZoom(),
  };
}

function mapInteractionState() {
  if (!state.backgroundMap) return {};
  return {
    dragging: state.backgroundMap.dragging?.enabled?.(),
    scrollWheelZoom: state.backgroundMap.scrollWheelZoom?.enabled?.(),
    touchZoom: state.backgroundMap.touchZoom?.enabled?.(),
    doubleClickZoom: state.backgroundMap.doubleClickZoom?.enabled?.(),
    boxZoom: state.backgroundMap.boxZoom?.enabled?.(),
    keyboard: state.backgroundMap.keyboard?.enabled?.(),
  };
}

function restoreMapView(snapshot) {
  if (!state.backgroundMap || !snapshot) return;
  const center = state.backgroundMap.getCenter();
  const zoom = state.backgroundMap.getZoom();
  if (zoom !== snapshot.zoom || center.distanceTo(snapshot.center) > 0.01) {
    console.info("[InField map] Återställer kartvy efter objektplacering.", {
      before: { center: snapshot.center, zoom: snapshot.zoom },
      after: { center, zoom },
    });
    state.backgroundMap.setView(snapshot.center, snapshot.zoom, { animate: false });
  }
  setMapInteractionsEnabled(true);
  console.info("[InField map] Kartinteraktion efter objektplacering.", mapInteractionState());
}

function setTool(tool) {
  state.tool = tool;
  state.tempObject = null;
  if (["point", "line", "area"].includes(tool)) {
    state.lastObjectTool = tool;
    updateObjectTypeSelect(tool);
  }
  document.querySelectorAll(".icon-button").forEach((button) => button.classList.remove("active"));
  document.querySelector(`#tool-${tool}`)?.classList.add("active");
  map.classList.toggle("drawing-active", !state.backgroundMap && tool !== "pan");
  map.classList.toggle("pan-active", tool === "pan");
  map.style.pointerEvents = state.backgroundMap ? "none" : tool === "pan" ? "none" : "auto";
  if (state.backgroundMap) {
    setMapInteractionsEnabled(tool === "pan");
  }
  mapToolbar.classList.add("collapsed");
  toolMenuButton.setAttribute("aria-expanded", "false");
  mapHint.textContent =
    tool === "pan"
      ? "Flytta och zooma kartan."
      : tool === "field"
      ? "Klicka start och stopp för planerad fältsträcka."
      : tool === "section"
      ? "Välj grön startpunkt och röd stoppunkt i kartan."
      : tool === "photo"
        ? "Klicka i kartan för att ta foto kopplat till aktiv sträcka."
      : "Klicka i kartan för att lägga till objekt på aktiv sträcka.";
  render();
}

function activateTab(tabName) {
  const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
  const panel = document.querySelector(`#${tabName}-panel`);
  if (!tab || !panel) return;
  document.querySelectorAll(".tab, .panel").forEach((item) => item.classList.remove("active"));
  tab.classList.add("active");
  panel.classList.add("active");
}

function toolTab(tool) {
  if (["point", "line", "area"].includes(tool)) return "objects";
  if (tool === "section") return "sections";
  return null;
}

function createSection() {
  clearSelectedObject();
  clearTemporaryDrawingState();
  const startPoint = state.sections.at(-1)?.points.at(-1) ?? null;
  state.activeSection = {
    id: crypto.randomUUID(),
    number: state.nextSectionNumber,
    points: startPoint ? [startPoint] : [],
    status: "drawing",
    editingExisting: false,
    startConfirmed: false,
    attributes: defaultProtocolAttributes(),
  };
  state.nextSectionNumber += 1;
  syncProtocolToForm();
  setTool("section");
  render();
}

function expandedSectionPoints(section) {
  if (!section?.points || section.points.length < 2) return section?.points ?? [];
  if (section.points.length > 2) return section.points;
  const support = activeSupportLine();
  if (!support?.length || support.length < 2) return section.points;
  const startSnap = snapToLine(section.points[0], support);
  const stopSnap = snapToLine(section.points.at(-1), support);
  return lineSlice(support, startSnap, stopSnap);
}

function finishSection() {
  if (!state.activeSection || state.activeSection.points.length < 2) return;
  syncFormToProtocol();
  state.activeSection.points = expandedSectionPoints(state.activeSection);
  console.info("[InField reach] Delsträcka sparas med aktiv geometri.", {
    activeSegmentId: state.activeSegmentId,
    activeSegmentIds: activeReachIds(),
    activeReachPoints: state.activeReachGeometry?.length ?? 0,
    savedSectionPoints: state.activeSection.points.length,
  });
  clearTemporaryDrawingState();
  state.activeSection.status = "finished";
  state.activeSection.editingExisting = false;
  state.activeSection.startConfirmed = true;
  state.sections.push(state.activeSection);
  state.activeSection = null;
  saveProject();
  render();
}

function confirmSectionStart() {
  if (!state.activeSection || state.activeSection.points.length < 1) return;
  state.activeSection.startConfirmed = true;
  saveProject();
  render();
}

function selectSection(id) {
  clearSelectedObject();
  if (state.activeSection) {
    syncFormToProtocol();
    state.activeSection.status = "finished";
    state.sections.push(state.activeSection);
  }
  const section = state.sections.find((item) => item.id === id);
  if (!section) return;
  state.sections = state.sections.filter((item) => item.id !== id);
  section.status = "drawing";
  section.editingExisting = true;
  section.startConfirmed = true;
  state.activeSection = section;
  syncProtocolToForm();
  saveProject();
  setTool("section");
}

function deleteSection(id) {
  const section = state.sections.find((item) => item.id === id);
  if (!section) return;
  const ok = window.confirm(
    `Vill du verkligen ta bort Sträcka ${section.number}? Protokoll och kopplade objekt tas bort.`,
  );
  if (!ok) return;
  state.sections = state.sections.filter((item) => item.id !== id);
  state.objects = state.objects.filter((object) => object.sectionId !== id);
  clearSelectedObject();
  saveProject();
  render();
}

function deleteObject(id) {
  state.objects = state.objects.filter((object) => object.id !== id);
  if (state.selectedObjectId === id) clearSelectedObject();
  saveProject();
  render();
}

function currentSectionForObjects() {
  return state.activeSection ?? state.sections.at(-1) ?? null;
}

function currentSectionForPhotos() {
  return state.activeSection ?? state.sections.at(-1) ?? null;
}

function addPhoto(targetType, targetId, file) {
  const reader = new FileReader();
  reader.onload = () => {
    state.photos.push({
      id: crypto.randomUUID(),
      targetType,
      targetId,
      filename: file.name,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
      gpsLat: state.gpsPosition?.coords?.latitude ?? null,
      gpsLon: state.gpsPosition?.coords?.longitude ?? null,
      gpsAccuracy: state.gpsPosition?.coords?.accuracy ?? null,
      dataUrl: reader.result,
    });
    saveProject();
    render();
  };
  reader.readAsDataURL(file);
}

function objectPhotoMarkup(objectId) {
  const photos = state.photos.filter((photo) => photo.targetType === "object" && photo.targetId === objectId);
  if (!photos.length) return "";
  return `<div class="photo-list">${photos
    .map((photo) => `<img class="photo-thumb" src="${photo.dataUrl}" alt="${photo.filename}" />`)
    .join("")}</div>`;
}

function triggerSectionPhoto() {
  const section = currentSectionForPhotos();
  if (!section) return;
  sectionPhotoInput.click();
}

function triggerObjectPhoto() {
  if (!state.selectedObjectId) return;
  objectPhotoInput.click();
}

function triggerMapPhoto() {
  const section = currentSectionForPhotos();
  if (!section) return;
  mapPhotoInput.click();
}

function selectObject(id) {
  const object = state.objects.find((item) => item.id === id);
  if (!object) return;
  const currentSection = currentSectionForObjects();
  if (currentSection && object.sectionId !== currentSection.id) return;
  state.selectedObjectId = id;
  state.objectEditDraft = { id, typeLabel: object.typeLabel, comment: object.comment ?? "" };
  updateObjectTypeSelect(objectGeometryTool(object), object.typeLabel);
  objectType.value = object.typeLabel;
  objectComment.value = object.comment ?? "";
  saveObjectButton.disabled = false;
  cancelObjectEditButton.disabled = false;
  addObjectPhotoButton.disabled = false;
  render();
}

function clearSelectedObject() {
  state.selectedObjectId = null;
  state.objectEditDraft = null;
  saveObjectButton.disabled = true;
  cancelObjectEditButton.disabled = true;
  addObjectPhotoButton.disabled = true;
}

function saveSelectedObject() {
  const object = state.objects.find((item) => item.id === state.selectedObjectId);
  if (!object) return;
  object.typeLabel = objectType.value;
  object.comment = objectComment.value;
  clearSelectedObject();
  saveProject();
  render();
}

function saveInlineObject(id) {
  const object = state.objects.find((item) => item.id === id);
  if (!object) return;
  const typeField = document.querySelector(`[data-inline-object-type="${id}"]`);
  const commentField = document.querySelector(`[data-inline-object-comment="${id}"]`);
  object.typeLabel = state.objectEditDraft?.id === id ? state.objectEditDraft.typeLabel : typeField.value;
  object.comment = state.objectEditDraft?.id === id ? state.objectEditDraft.comment : commentField.value;
  objectType.value = object.typeLabel;
  objectComment.value = object.comment;
  clearSelectedObject();
  saveProject();
  render();
}

function objectGeometryTool(object) {
  if (object.geometry.type === "Point") return "point";
  if (object.geometry.type === "LineString") return "line";
  return "area";
}

function objectStyleClass(typeLabel) {
  const normalized = typeLabel.toLowerCase();
  if (normalized === "sidogren") return "sidogren";
  if (normalized === "översvämningsyta" || normalized === "oversvamningsyta") return "oversvamningsyta";
  return "";
}

function leafletObjectStyle(typeLabel) {
  const styleClass = objectStyleClass(typeLabel);
  if (styleClass === "sidogren") return { stroke: "#176bad", fill: "#62a8df" };
  if (styleClass === "oversvamningsyta") return { stroke: "#c59112", fill: "#f4c542" };
  return { stroke: "#176b63", fill: "#f4c542" };
}

function orderedObjectTypes(tool, selected = "") {
  const preferred = objectTypeOptionsByGeometry[tool] ?? [];
  const merged = [...preferred, ...fallbackObjectTypes];
  if (selected) merged.unshift(selected);
  return [...new Set(merged)];
}

function updateObjectTypeSelect(tool = state.tool, selected = objectType.value) {
  const normalizedTool = ["point", "line", "area"].includes(tool) ? tool : "point";
  objectType.innerHTML = orderedObjectTypes(normalizedTool, selected)
    .map((value) => `<option${value === selected ? " selected" : ""}>${value}</option>`)
    .join("");
}

function objectTypeOptions(tool, selected) {
  return orderedObjectTypes(tool, selected)
    .map((value) => `<option${value === selected ? " selected" : ""}>${value}</option>`)
    .join("");
}

function syncFormToProtocol(options = {}) {
  if (!state.activeSection) return;
  document.querySelectorAll("[data-protocol-input]").forEach((input) => {
    state.activeSection.attributes[input.dataset.protocolInput] = input.value;
  });
  updateCalculatedProtocolFields();
  if (options.save !== false) saveProject({ syncProtocol: false });
}

function syncProtocolToForm() {
  const attrs = state.activeSection?.attributes;
  document.querySelectorAll(".choice-button").forEach((button) => {
    const active = attrs && attrs[button.dataset.field] === button.dataset.value;
    button.classList.toggle("active", Boolean(active));
  });
  document.querySelectorAll("[data-protocol-input]").forEach((input) => {
    input.value = attrs?.[input.dataset.protocolInput] ?? "";
  });
}

function renderProtocolFields() {
  protocolFields.innerHTML = "";
  const attrs = state.activeSection?.attributes ?? {};
  protocolGroups.forEach((group) => {
    if (!groupVisibleForPart(group, attrs)) return;
    const section = document.createElement("section");
    section.className = "protocol-group";
    const title = document.createElement("h2");
    title.textContent = group.title;
    section.append(title);
    group.fields
      .filter((field) => !field.showIf || field.showIf(attrs))
      .forEach((field) => section.append(renderProtocolField(field)));
    if (section.children.length > 1) protocolFields.append(section);
  });
}

function renderProtocolField(field) {
  const wrapper = document.createElement("div");
  wrapper.className = "field-group";
  const label = document.createElement("label");
  label.textContent = field.label;
  if (field.help) {
    label.className = "help-label";
    const help = document.createElement("a");
    help.href = field.help;
    help.target = "_blank";
    help.rel = "noopener";
    help.title = "Öppna Hymoinfo";
    help.textContent = "?";
    label.append(help);
  }
  wrapper.append(label);

  if (field.type === "buttons" || field.type === "binary") {
    const grid = document.createElement("div");
    const options = field.type === "binary" ? ["Nej", "Ja"] : field.options;
    grid.className = `choice-grid ${options.length <= 3 ? "tiny" : options.length <= 5 ? "compact" : "stack"}`;
    options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.dataset.field = field.key;
      button.dataset.value = option;
      button.textContent = option;
      button.addEventListener("click", () => {
        if (!state.activeSection) createSection();
        state.activeSection.attributes[field.key] =
          state.activeSection.attributes[field.key] === option ? "" : option;
        updateCalculatedProtocolFields();
        renderProtocolFields();
        syncProtocolToForm();
        saveProject();
        render();
      });
      grid.append(button);
    });
    wrapper.append(grid);
    return wrapper;
  }

  const input = document.createElement(field.type === "textarea" ? "textarea" : field.type === "select" ? "select" : "input");
  input.dataset.protocolInput = field.key;
  if (field.type === "computed") {
    input.readOnly = true;
    input.type = "text";
  }
  if (field.type === "textarea") input.rows = 4;
  if (field.type === "number" || field.type === "decimal") input.type = "number";
  if (field.type === "decimal") input.step = "0.01";
  if (field.type === "text") input.type = "text";
  if (field.type === "select") {
    const empty = document.createElement("option");
    empty.value = "";
    empty.textContent = "Välj";
    input.append(empty);
    field.options.forEach((option) => {
      const item = document.createElement("option");
      item.value = option;
      item.textContent = option;
      input.append(item);
    });
  }
  input.addEventListener("input", syncFormToProtocol);
  input.addEventListener("change", () => {
    syncFormToProtocol();
    renderProtocolFields();
    syncProtocolToForm();
  });
  wrapper.append(input);
  return wrapper;
}

function updateCalculatedProtocolFields() {
  if (!state.activeSection) return;
  const attrs = state.activeSection.attributes;
  const numeric = (value) => Number(String(value ?? "").replace(",", "."));
  const bs = Number(String(attrs.hojdNuvarandeBs ?? "").replace(",", "."));
  const thalweg = Number(String(attrs.hojdThalweg ?? "").replace(",", "."));
  const bankfull = Number(String(attrs.hojdBankfull ?? "").replace(",", "."));
  const denominator = bs - thalweg;
  if (attrs.mataInskarningskvot === "Ja" && Number.isFinite(bs) && Number.isFinite(thalweg) && Number.isFinite(bankfull) && denominator !== 0) {
    attrs.inskarningskvot = ((bankfull - thalweg) / denominator).toFixed(2);
  }
  if (attrs.beraknaInneslutning === "Ja") {
    const currentFloodplain = numeric(attrs.nuvarandeSvamplansbredd);
    const originalFloodplain = numeric(attrs.ursprungligSvamplansbredd);
    const channelWidth = numeric(attrs.farbredd);
    const secondaryFloodplainShare = numeric(attrs.andelSekundartSvamplan);
    if (Number.isFinite(currentFloodplain) && Number.isFinite(channelWidth) && channelWidth !== 0) {
      attrs.nuvarandeCi = (currentFloodplain / channelWidth).toFixed(1);
    }
    if (Number.isFinite(originalFloodplain) && Number.isFinite(channelWidth) && channelWidth !== 0) {
      attrs.ursprungligCi = (originalFloodplain / channelWidth).toFixed(1);
    }
    if (Number.isFinite(secondaryFloodplainShare)) {
      attrs.nuvarandeCd = Math.max(0, Math.min(100, 100 - secondaryFloodplainShare)).toFixed(0);
    }
  }
}

function renderSections() {
  sectionsLayer.innerHTML = "";
  state.leafletLayers?.sections?.clearLayers();
  const allSections = [...state.sections, state.activeSection].filter(Boolean);
  allSections.forEach((section) => {
    if (section.points.length < 2) {
      if (section.points.length === 1 && state.leafletLayers?.sections && window.L) {
        window.L.circleMarker(toLatLng(section.points[0]), {
          radius: 8,
          color: "#ffffff",
          weight: 3,
          fillColor: "#1f9d55",
          fillOpacity: 1,
        }).addTo(state.leafletLayers.sections);
      }
      return;
    }
    if (state.leafletLayers?.sections && window.L) {
      window.L.polyline(toLatLngs(section.points), {
        color: section.status === "drawing" ? "#111827" : "#b84a3a",
        weight: section.status === "drawing" ? 7 : 8,
        opacity: 0.95,
      }).addTo(state.leafletLayers.sections);
      window.L.circleMarker(toLatLng(section.points[0]), {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#1f9d55",
        fillOpacity: 1,
      }).addTo(state.leafletLayers.sections);
      window.L.circleMarker(toLatLng(section.points.at(-1)), {
        radius: 8,
        color: "#ffffff",
        weight: 3,
        fillColor: "#d7332f",
        fillOpacity: 1,
      }).addTo(state.leafletLayers.sections);
      return;
    }
    sectionsLayer.append(
      makeSvg("path", {
        d: pathFromPoints(section.points),
        class: `section-line ${section.status === "drawing" ? "active" : ""}`,
      }),
    );
    if (section.status !== "drawing") {
      const start = section.points[0];
      const stop = section.points.at(-1);
      sectionsLayer.append(makeSvg("circle", { cx: start[0], cy: start[1], r: 9, class: "endpoint start" }));
      sectionsLayer.append(makeSvg("circle", { cx: stop[0], cy: stop[1], r: 9, class: "endpoint stop" }));
    }
  });
}

function renderFieldPackages() {
  fieldLayer.innerHTML = "";
  state.leafletLayers?.references?.clearLayers();
  state.leafletLayers?.field?.clearLayers();
  state.referenceLines.forEach((line) => {
    if (line.points.length < 2) return;
    const selected = isReferenceLineSelected(line);
    if (state.leafletLayers?.references && window.L) {
      const layer = window.L.polyline(toLatLngs(line.points), {
        color: selected ? "#0f766e" : "#64748b",
        weight: selected ? 6 : 4,
        opacity: selected ? 0.95 : 0.65,
        dashArray: selected ? null : "8 8",
      }).addTo(state.leafletLayers.references);
      layer.on("click", (event) => {
        window.L.DomEvent.stopPropagation(event);
        if (state.mappingStarted) {
          console.warn("[InField reach] Klick på stödlinje ignoreras under aktiv kartering.", {
            ignoredSegmentId: line.id,
            activeSegmentId: state.activeSegmentId,
            activeSegmentIds: activeReachIds(),
          });
          referenceLineStatus.textContent = "Kartering är startad. Byt vattendrag för att välja annan stödlinje.";
          return;
        }
        toggleReferenceLineSelection(line.id);
        const lineName = safeReferenceLineName(line);
        referenceLineStatus.textContent = isReferenceLineSelected(line) ? `Aktiv stödlinje: ${lineName}` : `Avmarkerad stödlinje: ${lineName}`;
        saveProject();
        render();
      });
    }
  });
  if (!state.mappingStarted && state.draftFieldReach.length) {
    if (state.leafletLayers?.field && window.L) {
      if (state.draftFieldReach.length > 1) {
        window.L.polyline(toLatLngs(state.draftFieldReach), { color: "#2563eb", weight: 5 }).addTo(state.leafletLayers.field);
      }
      state.draftFieldReach.forEach((point) => {
        window.L.circleMarker(toLatLng(point), {
          radius: 7,
          color: "#111827",
          weight: 2,
          fillColor: "#ffffff",
          fillOpacity: 1,
        }).addTo(state.leafletLayers.field);
      });
      return;
    }
    fieldLayer.append(
      makeSvg("path", {
        d: pathFromPoints(state.draftFieldReach),
        class: "field-reach",
      }),
    );
    state.draftFieldReach.forEach((point) => {
      fieldLayer.append(makeSvg("circle", { cx: point[0], cy: point[1], r: 8, class: "vertex" }));
    });
  }
}

function renderVertices() {
  verticesLayer.innerHTML = "";
  if (state.backgroundMap) return;
  if (!state.activeSection) return;
  state.activeSection.points.forEach((point, index) => {
    const isStart = index === 0;
    const isStop = index === state.activeSection.points.length - 1 && state.activeSection.points.length > 1;
    const vertex = makeSvg("circle", {
      cx: point[0],
      cy: point[1],
      r: isStart || isStop ? 12 : 10,
      class: isStart ? "vertex endpoint start" : isStop ? "vertex endpoint stop" : "vertex",
      "data-index": index,
    });
    verticesLayer.append(vertex);
  });
}

function renderObjects() {
  objectsLayer.innerHTML = "";
  state.leafletLayers?.objects?.clearLayers();
  state.objects.forEach((object) => {
    if (state.leafletLayers?.objects && window.L) {
      const style = leafletObjectStyle(object.typeLabel);
      if (object.geometry.type === "Point") {
        window.L.circleMarker(toLatLng(object.geometry.coordinates), {
          radius: 8,
          color: style.stroke,
          weight: 3,
          fillColor: style.fill,
          fillOpacity: 1,
        })
          .on("click", (event) => {
            window.L.DomEvent.stopPropagation(event);
            selectObject(object.id);
          })
          .addTo(state.leafletLayers.objects);
      }
      if (object.geometry.type === "LineString") {
        window.L.polyline(toLatLngs(object.geometry.coordinates), {
          color: style.stroke,
          weight: 5,
        })
          .on("click", (event) => {
            window.L.DomEvent.stopPropagation(event);
            selectObject(object.id);
          })
          .addTo(state.leafletLayers.objects);
      }
      if (object.geometry.type === "Polygon") {
        window.L.polygon(toLatLngs(object.geometry.coordinates[0] ?? []), {
          color: style.stroke,
          weight: 4,
          fillColor: style.fill,
          fillOpacity: 0.3,
        })
          .on("click", (event) => {
            window.L.DomEvent.stopPropagation(event);
            selectObject(object.id);
          })
          .addTo(state.leafletLayers.objects);
      }
      return;
    }
    if (object.geometry.type === "Point") {
      const [x, y] = object.geometry.coordinates;
      objectsLayer.append(
        makeSvg("circle", {
          cx: x,
          cy: y,
          r: 10,
          class: `object-point ${objectStyleClass(object.typeLabel)}`,
          "data-object-id": object.id,
        }),
      );
    }
    if (object.geometry.type === "LineString") {
      objectsLayer.append(
        makeSvg("path", {
          d: pathFromPoints(object.geometry.coordinates),
          class: `object-line ${objectStyleClass(object.typeLabel)}`,
          "data-object-id": object.id,
        }),
      );
    }
    if (object.geometry.type === "Polygon") {
      const points = object.geometry.coordinates[0];
      objectsLayer.append(
        makeSvg("path", {
          d: `${pathFromPoints(points)} Z`,
          class: `object-area ${objectStyleClass(object.typeLabel)}`,
          "data-object-id": object.id,
        }),
      );
    }
  });

  previewLayer.innerHTML = "";
  if (state.tempObject?.points?.length) {
    const points = state.tempObject.points;
    if (state.leafletLayers?.objects && window.L) {
      const style = leafletObjectStyle(objectType.value);
      if (state.tempObject.type === "line" && points.length > 1) {
        window.L.polyline(toLatLngs(points), { color: style.stroke, weight: 5, dashArray: "8 6" }).addTo(state.leafletLayers.objects);
      }
      if (state.tempObject.type === "area" && points.length > 1) {
        window.L.polygon(toLatLngs(points), {
          color: style.stroke,
          weight: 4,
          dashArray: "8 6",
          fillColor: style.fill,
          fillOpacity: 0.2,
        }).addTo(state.leafletLayers.objects);
      }
      points.forEach((point) => {
        window.L.circleMarker(toLatLng(point), {
          radius: 6,
          color: "#111827",
          weight: 2,
          fillColor: "#ffffff",
          fillOpacity: 1,
        }).addTo(state.leafletLayers.objects);
      });
      return;
    }
    const previewClass = objectStyleClass(objectType.value);
    if (state.tempObject.type === "line") {
      previewLayer.append(makeSvg("path", { d: pathFromPoints(points), class: `object-line ${previewClass}` }));
    }
    if (state.tempObject.type === "area") {
      previewLayer.append(makeSvg("path", { d: `${pathFromPoints(points)} Z`, class: `object-area ${previewClass}` }));
    }
    points.forEach((point) => {
      previewLayer.append(makeSvg("circle", { cx: point[0], cy: point[1], r: 7, class: "vertex" }));
    });
  }
}

function renderLists() {
  const activeTag = document.activeElement?.tagName;
  const editingInline = document.activeElement?.closest?.(".inline-editor");
  if (editingInline && ["TEXTAREA", "SELECT", "INPUT"].includes(activeTag)) return;
  renderSectionPhotos();
  sectionList.innerHTML = "";
  [...state.sections]
    .sort((a, b) => Number(b.number) - Number(a.number))
    .forEach((section) => {
    const li = document.createElement("li");
    li.className = state.activeSection?.id === section.id ? "selected" : "";
    const objectCount = state.objects.filter((object) => object.sectionId === section.id).length;
    li.innerHTML = `<strong>Sträcka ${section.number}: ${section.attributes.hymotyp || "HyMotyp saknas"}</strong><span>${formatLength(section.points)} · ${section.attributes.rensning || "Rensning ej ifylld"} · ${objectCount} objekt</span><div class="list-actions"><button class="quiet-button" data-edit-section="${section.id}">Redigera</button><button class="danger-button" data-delete-section="${section.id}">Ta bort</button></div>`;
    sectionList.append(li);
    });

  objectList.innerHTML = "";
  const currentSection = currentSectionForObjects();
  objectSectionLabel.textContent = currentSection
    ? `Objekt för Sträcka ${currentSection.number}`
    : "Ingen aktiv delsträcka";
  state.objects.filter((object) => object.sectionId === currentSection?.id).forEach((object) => {
    const section = state.sections.find((item) => item.id === object.sectionId) ?? state.activeSection;
    const li = document.createElement("li");
    const isSelected = state.selectedObjectId === object.id;
    li.className = isSelected ? "selected" : "";
    const draft = state.objectEditDraft?.id === object.id ? state.objectEditDraft : object;
    const geometryLabel =
      object.geometry.type === "Point"
        ? "Punkt"
        : object.geometry.type === "LineString"
          ? "Linje"
          : "Yta";
    li.innerHTML = isSelected
      ? `<strong>${draft.typeLabel}</strong><span>${geometryLabel} · Sträcka ${section?.number ?? "-"}</span><div class="inline-editor"><label>Objekttyp</label><select data-inline-object-type="${object.id}">${objectTypeOptions(objectGeometryTool(object), draft.typeLabel)}</select><label>Kommentar</label><textarea rows="3" data-inline-object-comment="${object.id}">${draft.comment || ""}</textarea></div>${objectPhotoMarkup(object.id)}<div class="list-actions"><button class="secondary-button" data-save-object="${object.id}">Spara</button><button class="quiet-button" data-cancel-object="${object.id}">Avbryt</button><button class="danger-button" data-delete-object="${object.id}">Ta bort</button></div>`
      : `<strong>${object.typeLabel}</strong><span>${geometryLabel} · Sträcka ${section?.number ?? "-"} · ${object.comment || "Ingen kommentar"}</span><div class="list-actions"><button class="quiet-button" data-edit-object="${object.id}">Ändra</button><button class="danger-button" data-delete-object="${object.id}">Ta bort</button></div>`;
    objectList.append(li);
  });

  referenceLineList.innerHTML = "";
  const selectedLines = selectedReferenceLines();
  startMappingButton.disabled = state.mappingStarted || (state.draftFieldReach.length < 2 && !selectedLines.length);
  referenceLineStatus.textContent = state.referenceLines.length
    ? state.mappingStarted && activeReachIds().length
      ? `Aktiv sträcka låst: ${activeReachIds().join(", ")}`
      : selectedLines.length
      ? `${selectedLines.length} stödlinje${selectedLines.length === 1 ? "" : "r"} aktiv${selectedLines.length === 1 ? "" : "a"}`
      : `${state.referenceLines.length} linje${state.referenceLines.length === 1 ? "" : "r"} hittad${state.referenceLines.length === 1 ? "" : "e"}. Välj en eller flera i listan.`
    : "Ingen stödlinje importerad.";
  state.referenceLines
    .slice()
    .sort((a, b) => {
      const nameSort = referenceLineSortKey(a).localeCompare(referenceLineSortKey(b), "sv-SE", { numeric: true });
      if (nameSort) return nameSort;
      return safeReferenceLineName(a).localeCompare(safeReferenceLineName(b), "sv-SE", { numeric: true });
    })
    .forEach((line) => {
    const li = document.createElement("li");
    const selected = isReferenceLineSelected(line);
    const lineName = safeReferenceLineName(line);
    li.className = selected ? "selected compact" : "compact";
    const locked = state.mappingStarted;
    const selectedText = locked && selected ? "Låst aktiv sträcka" : selected ? "Aktiv stödlinje" : "Tryck Välj för att aktivera";
    li.innerHTML = `<strong>${lineName}</strong><span>${selectedText} · ${formatLength(line.points)} · ${line.points.length} punkter</span><div class="list-actions"><button class="${selected ? "secondary-button" : "quiet-button"}" data-select-reference-line="${line.id}" ${locked ? "disabled" : ""}>${locked && selected ? "Låst" : selected ? "Aktiv" : "Välj"}</button><button class="danger-button" data-delete-reference-line="${line.id}" ${locked ? "disabled" : ""}>Ta bort</button></div>`;
    referenceLineList.append(li);
  });

  fieldStepPanel.classList.toggle("hidden", state.mappingStarted);
  mappingWorkspace.classList.toggle("hidden", !state.mappingStarted);
  fieldStatusLabel.textContent = state.draftFieldReach.length
    ? state.draftFieldReach.length > 1
      ? "Stödlinje redo"
      : "Ritar planerad sträcka"
    : selectedLines.length
      ? "Linje vald"
    : "Ingen stödlinje vald";
}

function renderSectionPhotos() {
  sectionPhotoList.innerHTML = "";
  const section = currentSectionForPhotos();
  addSectionPhotoButton.disabled = !section;
  if (!section) return;
  state.photos
    .filter((photo) => photo.targetType === "section" && photo.targetId === section.id)
    .forEach((photo) => {
      const img = document.createElement("img");
      img.className = "photo-thumb";
      img.src = photo.dataUrl;
      img.alt = photo.filename;
      sectionPhotoList.append(img);
    });
}

function renderStatus() {
  const currentNumber = state.activeSection?.number ?? state.nextSectionNumber;
  sectionNumber.textContent = currentNumber;
  activeState.textContent = state.activeSection
    ? state.activeSection.editingExisting
      ? "Redigerar befintlig sträcka"
      : !state.activeSection.startConfirmed
      ? state.activeSection.points.length ? "Bekräfta grön startpunkt" : "Välj grön startpunkt"
      : state.activeSection.points.length < 2
        ? "Välj röd stoppunkt"
        : "Redo att avsluta"
    : "Ej startad";
  startStopButton.textContent = state.activeSection
    ? state.activeSection.editingExisting
      ? "Spara och avsluta"
      : !state.activeSection.startConfirmed
      ? "Starta sträcka"
      : "Avsluta delsträcka"
    : "Ny delsträcka";
  startStopButton.disabled = Boolean(
    state.activeSection &&
      ((!state.activeSection.startConfirmed && state.activeSection.points.length < 1) ||
        (state.activeSection.startConfirmed && state.activeSection.points.length < 2)),
  );
  lengthLabel.textContent = state.activeSection?.points.length > 1 ? formatLength(state.activeSection.points) : "0 m";
  const drawCount = state.tempObject?.points.length ?? 0;
  undoDrawButton.disabled = drawCount === 0;
  cancelDrawButton.disabled = drawCount === 0;
  finishDrawButton.disabled =
    !state.tempObject ||
    (state.tempObject.type === "line" && drawCount < 2) ||
    (state.tempObject.type === "area" && drawCount < 3);
  if (state.tempObject?.type === "line") {
    mapHint.textContent = `${drawCount} punkter i linjen. Klicka fler punkter eller tryck Klar.`;
  }
  if (state.tempObject?.type === "area") {
    mapHint.textContent = `${drawCount} punkter i ytan. Klicka fler hörn eller tryck Klar.`;
  } else if (state.tool === "section" && state.activeSection) {
    mapHint.textContent = state.activeSection.editingExisting
      ? "Redigera linjen eller protokollet och tryck Spara och avsluta."
      : !state.activeSection.startConfirmed
      ? "Klicka i kartan för grön startpunkt och bekräfta med Starta sträcka."
      : "Klicka i kartan för röd stoppunkt och avsluta delsträckan.";
  }
  const objectIsSelected = Boolean(state.selectedObjectId);
  saveObjectButton.disabled = !objectIsSelected;
  cancelObjectEditButton.disabled = !objectIsSelected;
  sideMapHint.textContent = mapHint.textContent;
}

function render() {
  renderFieldPackages();
  renderSections();
  renderGps();
  renderVertices();
  renderObjects();
  renderLists();
  renderStatus();
  syncProtocolToForm();
}

function addObjectPoint(point) {
  const activeOrLast = state.activeSection ?? state.sections.at(-1);
  if (!activeOrLast) return false;
  state.objects.push({
    id: crypto.randomUUID(),
    sectionId: activeOrLast.id,
    typeLabel: objectType.value,
    comment: objectComment.value,
    geometry: { type: "Point", coordinates: point },
  });
  objectComment.value = "";
  clearSelectedObject();
  saveProject();
  return true;
}

function addObjectVertex(point) {
  const activeOrLast = state.activeSection ?? state.sections.at(-1);
  if (!activeOrLast) return;
  if (!state.tempObject) state.tempObject = { type: state.tool, points: [] };
  state.tempObject.points.push(point);
}

function finishObjectDrawing() {
  const activeOrLast = state.activeSection ?? state.sections.at(-1);
  if (!activeOrLast || !state.tempObject) return;
  const minimum = state.tempObject.type === "line" ? 2 : 3;
  if (state.tempObject.points.length < minimum) return;
  const geometry =
    state.tempObject.type === "line"
      ? { type: "LineString", coordinates: state.tempObject.points }
      : { type: "Polygon", coordinates: [[...state.tempObject.points]] };
  state.objects.push({
    id: crypto.randomUUID(),
    sectionId: activeOrLast.id,
    typeLabel: objectType.value,
    comment: objectComment.value,
    geometry,
  });
  state.tempObject = null;
  objectComment.value = "";
  clearSelectedObject();
  saveProject();
  render();
}

function undoObjectVertex() {
  if (!state.tempObject) return;
  state.tempObject.points.pop();
  if (state.tempObject.points.length === 0) state.tempObject = null;
  render();
}

function cancelObjectDrawing() {
  state.tempObject = null;
  render();
}

function numericOrNull(value) {
  const number = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(number) ? number : null;
}

function pointToGeo(point) {
  return mapPointToGeo(point);
}

function geometryToGeo(geometry) {
  if (geometry.type === "Point") {
    return { ...geometry, coordinates: pointToGeo(geometry.coordinates) };
  }
  if (geometry.type === "LineString") {
    return { ...geometry, coordinates: geometry.coordinates.map((point) => pointToGeo(point)) };
  }
  if (geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((ring) => closeRing(ring).map((point) => pointToGeo(point))),
    };
  }
  return geometry;
}

function closeRing(points) {
  if (!points.length) return points;
  const first = points[0];
  const last = points.at(-1);
  if (first[0] === last[0] && first[1] === last[1]) return points;
  return [...points, first];
}

function bufferReach(points, bufferMeters) {
  if (!points?.length) return [];
  if (points.length === 1) {
    const [x, y] = lonLatToMeters(points[0], points[0]);
    const radius = bufferMeters;
    const origin = points[0];
    return [
      metersToLonLat([x - radius, y - radius], origin),
      metersToLonLat([x + radius, y - radius], origin),
      metersToLonLat([x + radius, y + radius], origin),
      metersToLonLat([x - radius, y + radius], origin),
      metersToLonLat([x - radius, y - radius], origin),
    ];
  }
  const origin = points[0];
  const meterPoints = points.map((point) => lonLatToMeters(point, origin));
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  meterPoints.forEach(([x, y]) => {
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  });
  if (points.length > 2) {
    return [
      metersToLonLat([minX - bufferMeters, minY - bufferMeters], origin),
      metersToLonLat([maxX + bufferMeters, minY - bufferMeters], origin),
      metersToLonLat([maxX + bufferMeters, maxY + bufferMeters], origin),
      metersToLonLat([minX - bufferMeters, maxY + bufferMeters], origin),
      metersToLonLat([minX - bufferMeters, minY - bufferMeters], origin),
    ];
  }
  const start = meterPoints[0];
  const stop = meterPoints.at(-1);
  const dx = stop[0] - start[0];
  const dy = stop[1] - start[1];
  const len = Math.hypot(dx, dy) || 1;
  const offset = bufferMeters;
  const ox = (-dy / len) * offset;
  const oy = (dx / len) * offset;
  return [
    metersToLonLat([start[0] + ox, start[1] + oy], origin),
    metersToLonLat([stop[0] + ox, stop[1] + oy], origin),
    metersToLonLat([stop[0] - ox, stop[1] - oy], origin),
    metersToLonLat([start[0] - ox, start[1] - oy], origin),
    metersToLonLat([start[0] + ox, start[1] + oy], origin),
  ];
}

function lonLatToMeters(point, origin) {
  const [lon, lat] = normalizePoint(point);
  const [originLon, originLat] = normalizePoint(origin);
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon = Math.cos((originLat * Math.PI) / 180) * metersPerDegreeLat || metersPerDegreeLat;
  return [(lon - originLon) * metersPerDegreeLon, (lat - originLat) * metersPerDegreeLat];
}

function metersToLonLat(point, origin) {
  const [originLon, originLat] = normalizePoint(origin);
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon = Math.cos((originLat * Math.PI) / 180) * metersPerDegreeLat || metersPerDegreeLat;
  return [
    Number((originLon + point[0] / metersPerDegreeLon).toFixed(7)),
    Number((originLat + point[1] / metersPerDegreeLat).toFixed(7)),
  ];
}

function fieldBufferMeters() {
  if (fieldBufferSelect.value === "custom") {
    const custom = Number(fieldCustomBuffer.value);
    return Number.isFinite(custom) && custom > 0 ? custom : 100;
  }
  return Number(fieldBufferSelect.value) || 100;
}

function featureName(feature, fallback) {
  const properties = feature?.properties ?? {};
  return (
    firstReadableValue(
      properties.geographicalName ??
        properties["geographicalName.text"] ??
        properties.namn ??
        properties.name ??
        properties.NAMN ??
        properties.Name,
    ) ||
    firstReadableValue(properties.Id ?? properties.id ?? feature?.id) ||
    fallback
  );
}

function addReferenceLines(lines, source = "", options = {}) {
  if (state.mappingStarted) {
    console.warn("[InField reach] Nya stödlinjer ignoreras under aktiv kartering.", {
      activeSegmentId: state.activeSegmentId,
      activeSegmentIds: activeReachIds(),
      source,
    });
    referenceLineStatus.textContent = "Kartering är startad. Byt vattendrag för att hämta eller importera nya stödlinjer.";
    return;
  }
  const cleanLines = lines
    .map((line, index) =>
      normalizeReferenceLine({
        ...line,
        source,
        license: line.license ?? options.license ?? "",
        name: safeReferenceLineName(line, `Stödlinje ${state.referenceLines.length + index + 1}`),
      })
    )
    .filter((line) => line.points.length > 1);
  if (!cleanLines.length) {
    referenceLineStatus.textContent = "Hittade ingen linje i filen.";
    return;
  }
  state.referenceLines.push(...cleanLines);
  state.draftFieldReach = [];
  clearTemporaryDrawingState();
  setSelectedReferenceLineIds(options.autoSelect || cleanLines.length === 1 ? [cleanLines[0].id] : []);
  if (selectedReferenceLines().length) activateSelectedReferenceLines({ fit: false });
  referenceLineStatus.textContent = selectedReferenceLines().length
    ? `${cleanLines.length} stödlinje hämtad och aktiverad.`
    : `${cleanLines.length} stödlinje${cleanLines.length === 1 ? "" : "r"} hämtad${cleanLines.length === 1 ? "" : "e"}. Välj en eller flera i listan.`;
  if (options.fit !== false) fitMapToPoints(cleanLines[0].points);
  setTool("pan");
  saveProject();
  render();
}

function collectGeoJsonLines(data) {
  const features = data.type === "FeatureCollection" ? data.features : data.type === "Feature" ? [data] : [{ geometry: data, properties: {} }];
  const lines = [];
  features.forEach((feature, featureIndex) => {
    const geometry = feature.geometry ?? feature;
    if (!geometry) return;
    if (geometry.type === "LineString") {
      lines.push({
        name: featureName(feature, `Stödlinje ${featureIndex + 1}`),
        properties: feature.properties ?? {},
        points: normalizePoints(geometry.coordinates),
      });
    }
    if (geometry.type === "MultiLineString") {
      geometry.coordinates.forEach((points, lineIndex) => {
        lines.push({
          name: `${featureName(feature, `Stödlinje ${featureIndex + 1}`)} ${lineIndex + 1}`,
          properties: feature.properties ?? {},
          points: normalizePoints(points),
        });
      });
    }
  });
  return lines;
}

function collectKmlLines(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  return [...doc.querySelectorAll("Placemark")].flatMap((placemark, index) => {
    const name = placemark.querySelector("name")?.textContent?.trim() || `Stödlinje ${index + 1}`;
    return [...placemark.querySelectorAll("LineString coordinates")].map((node, lineIndex) => ({
      name: lineIndex ? `${name} ${lineIndex + 1}` : name,
      points: node.textContent
        .trim()
        .split(/\s+/)
        .map((coord) => coord.split(",").map(Number))
        .filter((coord) => Number.isFinite(coord[0]) && Number.isFinite(coord[1]))
        .map((coord) => [Number(coord[0].toFixed(7)), Number(coord[1].toFixed(7))]),
    }));
  });
}

function fitMapToPoints(points) {
  if (!state.backgroundMap || !window.L || points.length < 2) return;
  state.backgroundMap.fitBounds(window.L.latLngBounds(toLatLngs(points)).pad(0.25));
}

async function importReferenceLineFile(file) {
  const text = await file.text();
  try {
    const lines = file.name.toLowerCase().endsWith(".kml")
      ? collectKmlLines(text)
      : collectGeoJsonLines(JSON.parse(text));
    addReferenceLines(lines, file.name);
  } catch (error) {
    referenceLineStatus.textContent = "Kunde inte läsa stödlinjen. Testa GeoJSON eller KML.";
  }
}

function savedLantmaterietToken() {
  return localStorage.getItem(LANTMATERIET_TOKEN_KEY)?.trim() ?? "";
}

function setLantmaterietTokenStatus(message = "", type = "") {
  if (!lantmaterietTokenStatus) return;
  lantmaterietTokenStatus.textContent = message;
  lantmaterietTokenStatus.classList.toggle("success", type === "success");
  lantmaterietTokenStatus.classList.toggle("error", type === "error");
}

function syncLantmaterietTokenInput() {
  if (!lantmaterietTokenInput) return;
  lantmaterietTokenInput.value = savedLantmaterietToken();
  setLantmaterietTokenStatus(lantmaterietTokenInput.value ? "Behörighet finns sparad lokalt." : "");
}

function saveLantmaterietToken() {
  const token = lantmaterietTokenInput?.value.trim() ?? "";
  if (!token) {
    setLantmaterietTokenStatus("Klistra in token, API-nyckel eller användare:lösenord först.", "error");
    return;
  }
  localStorage.setItem(LANTMATERIET_TOKEN_KEY, token);
  setLantmaterietTokenStatus("Sparad lokalt på den här enheten.", "success");
  setBaseMap(basemapSelect?.value ?? localStorage.getItem(BASEMAP_KEY) ?? "osm");
}

function clearLantmaterietToken() {
  localStorage.removeItem(LANTMATERIET_TOKEN_KEY);
  if (lantmaterietTokenInput) lantmaterietTokenInput.value = "";
  setLantmaterietTokenStatus("Rensad från webbläsaren.", "");
  setBaseMap("osm");
}

function toggleLantmaterietTokenVisibility() {
  if (!lantmaterietTokenInput || !toggleLantmaterietTokenButton) return;
  const show = lantmaterietTokenInput.type === "password";
  lantmaterietTokenInput.type = show ? "text" : "password";
  toggleLantmaterietTokenButton.textContent = show ? "Dölj" : "Visa";
  toggleLantmaterietTokenButton.setAttribute("aria-pressed", String(show));
}

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function currentMapViewBounds(padding = MAP_VIEW_FETCH_PADDING) {
  state.backgroundMap.invalidateSize();
  await wait(MAP_VIEW_SETTLE_MS);
  const bounds = state.backgroundMap.getBounds().pad(padding);
  const south = Number(bounds.getSouth().toFixed(7));
  const west = Number(bounds.getWest().toFixed(7));
  const north = Number(bounds.getNorth().toFixed(7));
  const east = Number(bounds.getEast().toFixed(7));
  return {
    bounds,
    south,
    west,
    north,
    east,
    span: Math.max(Math.abs(north - south), Math.abs(east - west)),
  };
}

async function mapBoundsParams(limit = LANTMATERIET_WATERCOURSE_PAGE_SIZE) {
  const { south, west, north, east, span } = await currentMapViewBounds();
  const params = new URLSearchParams({
    bbox: `${west},${south},${east},${north}`,
    limit: String(limit),
    f: "json",
  });
  return { params, span };
}

async function fetchLantmaterietJson(params, token) {
  const url = `${LANTMATERIET_WATERCOURSE_URL}?${params.toString()}`;
  if (!token) {
    const response = await fetch(url, {
      headers: { Accept: "application/geo+json, application/json" },
    });
    if (!response.ok) throw new Error(`Lantmäteriet svarade ${response.status}. Själva linjerna kräver behörighet.`);
    return response.json();
  }
  const authorization = authorizationHeader(token);
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/geo+json, application/json",
        Authorization: authorization,
      },
    });
    if (response.ok) return response.json();
  } catch (error) {
    // Some browsers preflight Authorization requests. The API also supports access_token as a query parameter.
  }
  const tokenParams = new URLSearchParams(params);
  tokenParams.set("access_token", token);
  const fallbackResponse = await fetch(`${LANTMATERIET_WATERCOURSE_URL}?${tokenParams.toString()}`);
  if (!fallbackResponse.ok) throw new Error(`Lantmäteriet svarade ${fallbackResponse.status}. Kontrollera behörigheten.`);
  return fallbackResponse.json();
}

async function testLantmaterietCredentials() {
  const token = (lantmaterietTokenInput?.value.trim() || savedLantmaterietToken()).trim();
  if (!token) {
    setLantmaterietTokenStatus("Skriv in token eller användare:lösenord först.", "error");
    return;
  }

  if (lantmaterietTokenInput?.value.trim()) localStorage.setItem(LANTMATERIET_TOKEN_KEY, token);
  setLantmaterietTokenStatus("Testar Lantmäteriet-behörighet...", "");
  testLantmaterietTokenButton.disabled = true;
  try {
    const params = new URLSearchParams({ limit: "1", f: "json" });
    await fetchLantmaterietJson(params, token);
    setLantmaterietTokenStatus("✓ Behörigheten fungerar.", "success");
  } catch (error) {
    setLantmaterietTokenStatus(error.message || "Kunde inte verifiera behörigheten.", "error");
  } finally {
    testLantmaterietTokenButton.disabled = false;
  }
}

async function fetchAllLantmaterietJson(params, token) {
  const offset = Number(params.get("offset") || 0);
  const firstParams = new URLSearchParams(params);
  firstParams.set("offset", String(offset));
  const firstPage = await fetchLantmaterietJson(firstParams, token);
  if (firstPage.type !== "FeatureCollection") return firstPage;

  const features = [...(firstPage.features ?? [])];
  const matchedValue = Number(firstPage.numberMatched);
  const numberMatched = Number.isFinite(matchedValue) ? matchedValue : null;
  let lastReturned = Number(firstPage.numberReturned ?? firstPage.features?.length ?? 0);
  let nextOffset = offset + lastReturned;

  while (numberMatched !== null && nextOffset < numberMatched && lastReturned > 0) {
    referenceLineStatus.textContent = `Hämtar Lantmäteriet-linjer i kartvyn... ${features.length} av ${numberMatched}`;
    const pageParams = new URLSearchParams(params);
    pageParams.set("offset", String(nextOffset));
    const page = await fetchLantmaterietJson(pageParams, token);
    const pageFeatures = page.features ?? [];
    if (!pageFeatures.length) break;
    features.push(...pageFeatures);
    lastReturned = Number(page.numberReturned ?? pageFeatures.length);
    nextOffset += lastReturned;
  }

  return {
    ...firstPage,
    features,
    numberReturned: features.length,
    numberMatched: numberMatched ?? features.length,
  };
}

async function fetchLantmaterietWaterwaysInView(testOnly = false) {
  if (!state.backgroundMap) return;
  if (!testOnly && state.mappingStarted) {
    referenceLineStatus.textContent = "Kartering är startad. Byt vattendrag för att hämta nya stödlinjer.";
    return;
  }
  const token = (lantmaterietTokenInput?.value.trim() || savedLantmaterietToken()).trim();
  if (lantmaterietTokenInput?.value.trim()) localStorage.setItem(LANTMATERIET_TOKEN_KEY, token);
  if (!token && !testOnly) {
    referenceLineStatus.textContent = "Själva vattendragslinjerna kräver behörighet. Lägg in token eller användare:lösenord under Lantmäteriet-behörighet.";
    return;
  }

  const { params, span } = await mapBoundsParams(testOnly ? 1 : LANTMATERIET_WATERCOURSE_PAGE_SIZE);
  if (!testOnly && span > 0.25 && !window.confirm("Kartvyn är ganska stor. Zooma helst in på din arbetsplats. Vill du hämta ändå?")) return;

  referenceLineStatus.textContent = testOnly ? "Testar åtkomst till Lantmäteriet..." : "Hämtar Lantmäteriet-linjer i kartvyn...";
  try {
    const data = testOnly ? await fetchLantmaterietJson(params, token) : await fetchAllLantmaterietJson(params, token);
    if (testOnly) {
      referenceLineStatus.textContent = "Åtkomst till Lantmäteriet fungerar.";
      return;
    }
    const lines = collectGeoJsonLines(data).map((line) => ({ ...line, license: LANTMATERIET_ATTRIBUTION }));
    addReferenceLines(lines, "Lantmäteriet Hydrografi Direkt", { license: LANTMATERIET_ATTRIBUTION, fit: false });
    if ((data.numberMatched ?? 0) > lines.length) {
      referenceLineStatus.textContent = `${lines.length} Lantmäteriet-linjer hämtade. Zooma in mer om du vill minska urvalet.`;
    }
  } catch (error) {
    referenceLineStatus.textContent = error.message || "Kunde inte hämta från Lantmäteriet. Kontrollera behörigheten och zooma in till en mindre kartvy.";
  }
}

function osmWaterwayTypeLabel(tags = {}) {
  const type = {
    river: "Älv/å",
    stream: "Bäck",
    ditch: "Dike",
    drain: "Dränering",
    canal: "Kanal",
  }[tags.waterway] ?? "Vattendrag";
  return type;
}

function osmWaterwayName(tags = {}, index) {
  const type = osmWaterwayTypeLabel(tags);
  const name = firstReadableValue(tags.name ?? tags["name:sv"] ?? tags.alt_name ?? tags.ref);
  return name ? `${name} (${type})` : `${type} ${index + 1}`;
}

function osmPointFromGeometry(point) {
  return [Number(point.lon.toFixed(7)), Number(point.lat.toFixed(7))];
}

function osmLineProperties(tags = {}, extra = {}) {
  return {
    ...tags,
    osmId: extra.osmId ?? "",
    osmType: extra.osmType ?? "",
    osmRelationId: extra.osmRelationId ?? "",
    osmMemberRole: extra.osmMemberRole ?? "",
    sourceKind: extra.sourceKind ?? "osm-waterway",
  };
}

function osmWayToReferenceLine(element, index) {
  return {
    id: `osm-way-${element.id}`,
    name: osmWaterwayName(element.tags, index),
    properties: osmLineProperties(element.tags ?? {}, {
      osmId: element.id,
      osmType: "way",
      sourceKind: "osm-way",
    }),
    points: element.geometry.map(osmPointFromGeometry),
  };
}

function osmRelationMemberToReferenceLine(relation, member, index, memberIndex) {
  const relationTags = relation.tags ?? {};
  const memberTags = member.tags ?? {};
  const tags = { ...relationTags, ...memberTags };
  return {
    id: `osm-relation-${relation.id}-way-${member.ref ?? memberIndex}`,
    name: osmWaterwayName(tags, index),
    properties: osmLineProperties(tags, {
      osmId: member.ref ?? "",
      osmType: "relation-member-way",
      osmRelationId: relation.id,
      osmMemberRole: member.role ?? "",
      sourceKind: "osm-relation-member",
    }),
    points: member.geometry.map(osmPointFromGeometry),
  };
}

function collectOsmWaterwayLines(data) {
  const lines = [];
  const seenIds = new Set();
  const seenWayRefs = new Set();
  const elements = data.elements ?? [];
  elements.filter((element) => element.type === "relation").forEach((element) => {
    if (element.type === "relation" && Array.isArray(element.members)) {
      element.members.forEach((member, memberIndex) => {
        if (member.type !== "way" || !member.geometry || member.geometry.length < 2) return;
        const line = osmRelationMemberToReferenceLine(element, member, lines.length, memberIndex);
        if (seenIds.has(line.id)) return;
        seenIds.add(line.id);
        if (member.ref !== undefined) seenWayRefs.add(String(member.ref));
        lines.push(line);
      });
    }
  });
  elements.filter((element) => element.type === "way").forEach((element) => {
    if (seenWayRefs.has(String(element.id))) return;
    if (element.geometry?.length > 1) {
      const line = osmWayToReferenceLine(element, lines.length);
      seenIds.add(line.id);
      lines.push(line);
    }
  });
  return lines;
}

function osmDebugSummary(data, lines, bbox, query) {
  const elements = data.elements ?? [];
  const waterwayCounts = {};
  elements.forEach((element) => {
    const value = element.tags?.waterway ?? element.tags?.route ?? element.tags?.type ?? "saknas";
    waterwayCounts[value] = (waterwayCounts[value] ?? 0) + 1;
  });
  const lineTypes = {};
  lines.forEach((line) => {
    const value = line.properties?.waterway ?? line.properties?.route ?? line.properties?.type ?? "saknas";
    lineTypes[value] = (lineTypes[value] ?? 0) + 1;
  });
  const lineNames = lines.slice(0, 40).map((line) => safeReferenceLineName(line));
  console.info("[InField OSM fetch]", {
    bbox,
    totalElements: elements.length,
    wayElements: elements.filter((element) => element.type === "way").length,
    relationElements: elements.filter((element) => element.type === "relation").length,
    waterwayCounts,
    renderedLines: lines.length,
    renderedLineTypes: lineTypes,
    renderedLineNames: lineNames,
    query,
  });
}

async function fetchOsmWaterwaysInView() {
  if (!state.backgroundMap) return;
  if (state.mappingStarted) {
    referenceLineStatus.textContent = "Kartering är startad. Byt vattendrag för att hämta nya stödlinjer.";
    return;
  }
  const { south, west, north, east, span } = await currentMapViewBounds();
  if (span > 0.25 && !window.confirm("Kartvyn är ganska stor. Det kan bli mycket data. Vill du hämta ändå?")) return;

  referenceLineStatus.textContent = "Hämtar vattendragslinjer i kartvyn...";
  const bbox = `${south},${west},${north},${east}`;
  const query = `
    [out:json][timeout:35];
    (
      way["waterway"~"${OSM_WATERWAY_PATTERN}"](${bbox});
      relation["waterway"~"${OSM_WATERWAY_PATTERN}"](${bbox});
      relation["type"="waterway"](${bbox});
      relation["type"="route"]["route"~"^(water|waterway|river)$"](${bbox});
    );
    out tags geom;
  `;

  try {
    console.info("[InField OSM fetch] Startar hämtning.", { bbox, south, west, north, east });
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
    });
    if (!response.ok) throw new Error(`Overpass svarade ${response.status}.`);
    const data = await response.json();
    const lines = collectOsmWaterwayLines(data);
    osmDebugSummary(data, lines, bbox, query);
    if (!lines.length) {
      referenceLineStatus.textContent = "Hittade inga OSM-vattendragslinjer i kartvyn. Zooma/panorera lite eller testa Lantmäteriet.";
      return;
    }
    addReferenceLines(lines, "OpenStreetMap Overpass", { fit: false });
    const types = [...new Set(lines.map((line) => line.properties?.waterway).filter(Boolean))].join(", ");
    if (lines.length) {
      referenceLineStatus.textContent = `${lines.length} OSM-linje${lines.length === 1 ? "" : "r"} hämtade${types ? ` (${types})` : ""}. Välj en eller flera i listan.`;
    }
  } catch (error) {
    console.warn("[InField OSM fetch] Hämtningen misslyckades.", error);
    referenceLineStatus.textContent = "Kunde inte hämta linjer just nu. Testa mindre kartvy eller importera fil.";
  }
}

function combinedReferenceLinePoints(lines) {
  const validLines = lines.map((line) => normalizePoints(line.points ?? [])).filter((points) => points.length > 1);
  if (!validLines.length) return [];
  const remaining = validLines.slice(1);
  const combined = [...validLines[0]];
  while (remaining.length) {
    const last = combined.at(-1);
    let best = { index: 0, reverse: false, distance: Infinity };
    remaining.forEach((points, index) => {
      const forwardDistance = mapDistance(last, points[0]);
      const reverseDistance = mapDistance(last, points.at(-1));
      if (forwardDistance < best.distance) best = { index, reverse: false, distance: forwardDistance };
      if (reverseDistance < best.distance) best = { index, reverse: true, distance: reverseDistance };
    });
    const [next] = remaining.splice(best.index, 1);
    const oriented = best.reverse ? [...next].reverse() : next;
    combined.push(...(best.distance < 1 ? oriented.slice(1) : oriented));
  }
  return combined;
}

function prepareFieldArea() {
  if (state.draftFieldReach.length < 2) {
    fieldStatusLabel.textContent = "Ofullständigt";
    mapHint.textContent = "Rita planerad fältsträcka först.";
    sideMapHint.textContent = mapHint.textContent;
    return;
  }
  const plannedReach = [...state.draftFieldReach];
  fieldStatusLabel.textContent = "Förbereder";
  const bufferMeters = fieldBufferMeters();
  const fieldArea = bufferReach(plannedReach, bufferMeters);
  const name = fieldPackageName.value.trim() || `Fältområde ${state.fieldPackages.length + 1}`;
  state.fieldPackages.push({
    id: crypto.randomUUID(),
    name,
    status: "Ready for offline fieldwork",
    statusLabel: "Sparat lokalt",
    plannedReach,
    bufferMeters,
    fieldArea,
    createdAt: new Date().toISOString(),
    offline: {
      basemapReady: false,
      referenceLayersReady: false,
    },
  });
  state.draftFieldReach = [];
  fieldStatusLabel.textContent = "Sparat lokalt";
  mapHint.textContent = "Fältområdet är sparat. Tryck Starta kartering när du är redo.";
  sideMapHint.textContent = mapHint.textContent;
  saveProject();
  setTool("pan");
  render();
}

function startMapping() {
  if (state.mappingStarted) {
    fieldStatusLabel.textContent = "Kartering är redan startad. Byt vattendrag för att välja annan sträcka.";
    return;
  }
  const selectedLines = selectedReferenceLines();
  if (selectedLines.length) {
    state.draftFieldReach = combinedReferenceLinePoints(selectedLines);
    state.activeReachGeometry = [...state.draftFieldReach];
    state.activeSegmentIds = selectedReferenceLineIds();
    state.activeSegmentId = state.activeSegmentIds[0] ?? null;
  } else {
    state.activeReachGeometry = [...state.draftFieldReach];
    state.activeSegmentIds = [];
    state.activeSegmentId = null;
  }
  if (state.draftFieldReach.length < 2) {
    fieldStatusLabel.textContent = "Välj eller rita en stödlinje först";
    return;
  }
  clearTemporaryDrawingState();
  state.mappingStarted = true;
  state.reachWorkflowState = "reach_started";
  console.info("[InField reach] Kartering startad med låst aktiv sträcka.", {
    activeSegmentId: state.activeSegmentId,
    activeSegmentIds: state.activeSegmentIds,
    points: state.activeReachGeometry.length,
  });
  setTool("pan");
  activateTab("protocol");
  render();
  try {
    saveProject();
  } catch (error) {
    saveStateLabel.textContent = "Karteringen är startad, men webbläsaren kunde inte spara just nu.";
  }
}

function skipFieldArea() {
  clearTemporaryDrawingState();
  state.activeReachGeometry = [...state.draftFieldReach];
  state.mappingStarted = true;
  state.reachWorkflowState = "reach_started";
  saveProject();
  setTool("pan");
  render();
}

function clearFieldAreaDraft() {
  state.draftFieldReach = [];
  clearActiveReachLock({ clearSelection: true });
  clearTemporaryDrawingState();
  setTool("pan");
  fieldStatusLabel.textContent = "Ingen stödlinje vald";
  saveProject();
  render();
}

function pointSummary(points) {
  if (!points?.length) return {};
  const start = pointToGeo(points[0]);
  const stop = pointToGeo(points.at(-1));
  return {
    start_lon: start[0],
    start_lat: start[1],
    stopp_lon: stop[0],
    stopp_lat: stop[1],
  };
}

function objectCoordinateSummary(geometry) {
  if (geometry.type === "Point") {
    const point = pointToGeo(geometry.coordinates);
    return { lon: point[0], lat: point[1] };
  }
  const coords = geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates;
  return pointSummary(coords);
}

async function exportGeoJson(projectPayload = null) {
  syncFormToProtocol();
  const exportState = projectPayload
    ? {
        watercourse: projectPayload.watercourse,
        projectMeta: projectPayload.projectMeta ?? {},
        sections: projectPayload.sections ?? [],
        activeSection: projectPayload.activeSection ?? null,
        objects: projectPayload.objects ?? [],
        photos: projectPayload.photos ?? [],
        fieldPackages: projectPayload.fieldPackages ?? [],
        referenceLines: projectPayload.referenceLines ?? [],
      }
    : state;
  const coordinateSystem = "WGS84 lon/lat (EPSG:4326) från kartans nuvarande position";
  const exportSections = [...(exportState.sections ?? []), exportState.activeSection].filter(
    (section) => section && section.points?.length > 1,
  );
  const sectionFeatures = exportSections.map((section) => {
    const sectionPoints = projectPayload ? section.points : expandedSectionPoints(section);
    return {
      type: "Feature",
      properties: {
        id: section.id,
        lager: "delstrackor",
        vattendrag: exportState.watercourse,
        inventor: exportState.projectMeta?.inventor ?? "",
        stracka_nr: section.number,
        length: formatLength(sectionPoints),
        koordinater: coordinateSystem,
        ...pointSummary(sectionPoints),
        ...section.attributes,
      },
      geometry: geometryToGeo({ type: "LineString", coordinates: sectionPoints }),
    };
  });
  const objectFeatures = exportState.objects.map((object) => {
    const section = exportSections.find((item) => item.id === object.sectionId) ?? exportState.activeSection;
    return {
    type: "Feature",
    properties: {
      id: object.id,
      lager: object.geometry.type === "Point" ? "punktobjekt" : object.geometry.type === "LineString" ? "linjeobjekt" : "ytobjekt",
      vattendrag: exportState.watercourse,
      inventor: exportState.projectMeta?.inventor ?? "",
      section_id: object.sectionId,
      stracka_nr: section?.number ?? null,
      objekttyp: object.typeLabel,
      kommentar: object.comment,
      koordinater: coordinateSystem,
      ...objectCoordinateSummary(object.geometry),
    },
    geometry: geometryToGeo(object.geometry),
    };
  });
  const fieldPackageFeatures = (exportState.fieldPackages ?? []).flatMap((fieldPackage) => [
    {
      type: "Feature",
      properties: {
        id: fieldPackage.id,
        lager: "faltomrade",
        vattendrag: exportState.watercourse,
        namn: fieldPackage.name,
        status: fieldPackage.statusLabel ?? fieldPackage.status,
        buffer_m: fieldPackage.bufferMeters,
        skapad: fieldPackage.createdAt,
      },
      geometry: geometryToGeo({ type: "Polygon", coordinates: [fieldPackage.fieldArea ?? []] }),
    },
    {
      type: "Feature",
      properties: {
        id: `${fieldPackage.id}-reach`,
        lager: "planerad_stracka",
        vattendrag: exportState.watercourse,
        namn: fieldPackage.name,
        buffer_m: fieldPackage.bufferMeters,
      },
      geometry: geometryToGeo({ type: "LineString", coordinates: fieldPackage.plannedReach ?? [] }),
    },
  ]);
  const referenceLineFeatures = (exportState.referenceLines ?? []).map((line) => ({
    type: "Feature",
    properties: {
      id: line.id,
      lager: "stodlinje",
      vattendrag: exportState.watercourse,
      namn: line.name,
      kalla: line.source ?? "",
      licens: line.license ?? "",
      bearbetad: Boolean(line.license),
    },
    geometry: geometryToGeo({ type: "LineString", coordinates: line.points ?? [] }),
  }));
  const photoMetadata = (exportState.photos ?? []).map((photo) => ({
    id: photo.id,
    vattendrag: exportState.watercourse,
    targetType: photo.targetType,
    targetId: photo.targetId,
    filename: photo.filename,
    mimeType: photo.mimeType,
    createdAt: photo.createdAt,
    gpsLat: photo.gpsLat ?? null,
    gpsLon: photo.gpsLon ?? null,
    gpsAccuracy: photo.gpsAccuracy ?? null,
    embedded: true,
  }));
  const safeName = safeFilename(exportState.watercourse);
  const layers = [
    ["delstrackor", sectionFeatures],
    ["punktobjekt", objectFeatures.filter((feature) => feature.geometry.type === "Point")],
    ["linjeobjekt", objectFeatures.filter((feature) => feature.geometry.type === "LineString")],
    ["ytobjekt", objectFeatures.filter((feature) => feature.geometry.type === "Polygon")],
    ["faltomraden", fieldPackageFeatures],
    ["stodlinjer", referenceLineFeatures],
  ];
  const metadata = {
    vattendrag: exportState.watercourse,
    exporterad: new Date().toISOString(),
    inventor: exportState.projectMeta?.inventor ?? "",
    datum: new Date().toISOString().slice(0, 10),
    koordinater: coordinateSystem,
    stodlinje: state.useSupportLine ? "tillfallig" : "ingen",
    delstrackor: sectionFeatures.length,
    punktobjekt: layers[1][1].length,
    linjeobjekt: layers[2][1].length,
    ytobjekt: layers[3][1].length,
    faltomraden: exportState.fieldPackages?.length ?? 0,
    stodlinjer: exportState.referenceLines?.length ?? 0,
    datakallor: [...new Set((exportState.referenceLines ?? []).map((line) => line.source).filter(Boolean))],
    foton: photoMetadata.length,
  };
  if (window.JSZip) {
    await createZipExport(safeName, exportState, layers, metadata, photoMetadata);
    return;
  }
  layers.forEach(([name, features], index) => {
    setTimeout(() => downloadJson(`${safeName}-${name}.geojson`, { type: "FeatureCollection", features }), index * 200);
  });
  setTimeout(() => downloadJson(`${safeName}-metadata.json`, metadata), layers.length * 200);
  setTimeout(() => downloadJson(`${safeName}-foton-metadata.json`, photoMetadata), (layers.length + 1) * 200);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function safeFilename(name) {
  return name
    .toLowerCase()
    .trim()
    .replaceAll("å", "a")
    .replaceAll("ä", "a")
    .replaceAll("ö", "o")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "infield";
}

async function createZipExport(safeName, exportState, layers, metadata, photoMetadata) {
  const zip = new JSZip();
  const gisFolder = zip.folder("gis");
  const photoFolder = zip.folder("foton");
  layers.forEach(([name, features]) => {
    gisFolder.file(`${safeName}-${name}.geojson`, JSON.stringify({ type: "FeatureCollection", features }, null, 2));
  });
  zip.file(`${safeName}-metadata.json`, JSON.stringify(metadata, null, 2));
  zip.file(`${safeName}-foton-metadata.json`, JSON.stringify(photoMetadata, null, 2));
  (exportState.photos ?? []).forEach((photo, index) => {
    if (!photo.dataUrl) return;
    const extension = photoExtension(photo);
    const filename = `${String(index + 1).padStart(3, "0")}-${safeFilename(photo.filename || photo.id)}.${extension}`;
    photoFolder.file(filename, dataUrlBase64(photo.dataUrl), { base64: true });
  });
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
  const filename = `${safeName}-gis-export.zip`;
  state.lastExport = { filename, blob, watercourse: exportState.watercourse };
  await shareOrShowExport(filename, blob, exportState.watercourse);
}

async function shareOrShowExport(filename, blob, watercourse) {
  const file = new File([blob], filename, { type: "application/zip" });
  const canShareFile = Boolean(navigator.canShare?.({ files: [file] }));
  if (canShareFile) {
    try {
      await navigator.share({
        title: `InField export ${watercourse}`,
        text: `GIS-export från InField: ${watercourse}`,
        files: [file],
      });
      showExportDialog(`Exportpaketet är delat: ${filename}`);
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        showExportDialog(`Exportpaketet är klart: ${filename}`);
        return;
      }
    }
  }
  downloadBlob(filename, blob);
  showExportDialog(`Zipfilen är skapad och nedladdad: ${filename}. Om du vill maila den, bifoga filen manuellt från Hämtade filer/Filer.`);
}

function showExportDialog(message) {
  exportStatusText.textContent = message;
  exportShareButton.disabled = !state.lastExport || !navigator.canShare?.({
    files: [new File([state.lastExport.blob], state.lastExport.filename, { type: "application/zip" })],
  });
  exportDialog.showModal();
}

function photoExtension(photo) {
  const fromName = (photo.filename ?? "").split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  if (photo.mimeType === "image/png") return "png";
  if (photo.mimeType === "image/webp") return "webp";
  return "jpg";
}

function dataUrlBase64(dataUrl) {
  return String(dataUrl).split(",")[1] ?? "";
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function openExportMail(watercourse, zipName) {
  const subject = encodeURIComponent(`InField export ${watercourse}`);
  const body = encodeURIComponent(
    `Hej,\n\nJag bifogar InField-exporten för ${watercourse}.\n\nZipfil att bifoga: ${zipName}\n\nZipfilen innehåller GeoJSON-lager, foton och metadata.`,
  );
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function handlePointInMap(point) {
  if (state.tool === "pan") return;
  if (state.tool === "section") {
    if (!state.activeSection) return;
    const support = activeSupportLine();
    if (!state.activeSection.startConfirmed) {
      console.info("[InField reach] Startpunkt sätts.", {
        activeSegmentId: state.activeSegmentId,
        activeSegmentIds: activeReachIds(),
        supportPoints: support?.length ?? 0,
      });
      state.activeSection.points = [support ? snapToLine(point, support).point : point];
      state.reachWorkflowState = "reach_started";
    } else {
      console.info("[InField reach] Slutpunkt sätts.", {
        activeSegmentId: state.activeSegmentId,
        activeSegmentIds: activeReachIds(),
        supportPoints: support?.length ?? 0,
      });
      if (support) {
        const startSnap = snapToLine(state.activeSection.points[0], support);
        const stopSnap = snapToLine(point, support);
        state.activeSection.points = lineSlice(support, startSnap, stopSnap);
      } else {
        state.activeSection.points = [state.activeSection.points[0], point];
      }
      state.reachWorkflowState = "reach_completed";
    }
  } else if (state.tool === "point") {
    const viewBeforePoint = mapViewSnapshot();
    console.info("[InField map] Punkt skapas.", {
      center: viewBeforePoint?.center,
      zoom: viewBeforePoint?.zoom,
      interactions: mapInteractionState(),
    });
    if (addObjectPoint(point)) {
      setTool("pan");
      restoreMapView(viewBeforePoint);
      render();
      return;
    }
  } else if (state.tool === "photo") {
    triggerMapPhoto();
  } else if (state.tool === "field") {
    const reference = activeSupportLine();
    if (reference?.length > 1) {
      const snap = snapToLine(point, reference);
      if (!state.draftFieldReach.length) {
        state.draftFieldReach = [snap.point];
      } else {
        const startSnap = snapToLine(state.draftFieldReach[0], reference);
        state.draftFieldReach = lineSlice(reference, startSnap, snap);
      }
    } else {
      state.draftFieldReach.push(point);
    }
    fieldStatusLabel.textContent =
      state.draftFieldReach.length > 1 ? "Stödlinje redo" : "Ritar egen linje";
    mapHint.textContent =
      state.draftFieldReach.length > 1
        ? `${state.draftFieldReach.length} punkter i stödlinjen. Klicka vidare eller tryck Starta kartering.`
        : reference
          ? "Klicka stoppunkt på stödlinjen."
          : "Lägg nästa punkt längs vattnet.";
    sideMapHint.textContent = mapHint.textContent;
  } else {
    addObjectVertex(point);
  }
  render();
}

function handleLeafletMapClick(event) {
  handlePointInMap(fromLatLng(event.latlng));
}

function handleMapClick(event) {
  if (state.backgroundMap) return;
  if (state.tool === "pan") return;
  if (event.target.dataset.objectId) {
    selectObject(event.target.dataset.objectId);
    return;
  }
  if (state.dragging) return;
  handlePointInMap(svgPoint(event));
}

function startDrag(event) {
  if (!event.target.classList.contains("vertex") || !state.activeSection) return;
  state.dragging = Number(event.target.dataset.index);
}

function moveDrag(event) {
  if (state.dragging === null || !state.activeSection) return;
  const point = svgPoint(event);
  const support = activeSupportLine();
  const geoPoint = mapPointToGeo(point);
  state.activeSection.points[state.dragging] = support ? snapToLine(geoPoint, support).point : geoPoint;
  render();
}

function endDrag() {
  if (state.dragging !== null) saveProject();
  state.dragging = null;
}

supportLine.setAttribute("d", pathFromPoints(supportPoints));
supportLine.classList.toggle("hidden", !state.useSupportLine);
initBackgroundMap();
setTheme(localStorage.getItem(THEME_KEY) ?? "dark");
renderProtocolFields();
updateObjectTypeSelect("point", "Bestämmande sektion");
syncLantmaterietTokenInput();
renderProjectList();
showStartScreen();

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    activateTab(tab.dataset.tab);
    if (tab.dataset.tab === "objects") setTool(state.lastObjectTool || "point");
    if (tab.dataset.tab === "sections") setTool("section");
    if (tab.dataset.tab === "protocol") setTool(state.activeSection ? "section" : "pan");
  });
});

document.querySelectorAll(".icon-button").forEach((button) => {
  button.addEventListener("click", () => {
    const tool = button.id.replace("tool-", "");
    const tabName = toolTab(tool);
    if (tabName) activateTab(tabName);
    setTool(tool);
  });
});

toolMenuButton.addEventListener("click", () => {
  const collapsed = mapToolbar.classList.toggle("collapsed");
  toolMenuButton.setAttribute("aria-expanded", String(!collapsed));
});
mapZoomInButton.addEventListener("click", () => state.backgroundMap?.zoomIn());
mapZoomOutButton.addEventListener("click", () => state.backgroundMap?.zoomOut());
basemapSelect?.addEventListener("change", () => setBaseMap(basemapSelect.value));
debugLogButton?.addEventListener("click", copyDebugLog);
themeToggleButton?.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark";
  setTheme(isDark ? "light" : "dark");
});

document.querySelectorAll("[data-object-tool]").forEach((button) => {
  button.addEventListener("click", () => {
    activateTab("objects");
    setTool(button.dataset.objectTool);
  });
});

drawFieldReachButton.addEventListener("click", () => {
  if (state.mappingStarted) {
    fieldStatusLabel.textContent = "Kartering är startad. Byt vattendrag för att rita ny stödlinje.";
    return;
  }
  state.draftFieldReach = [];
  clearActiveReachLock({ clearSelection: true });
  clearTemporaryDrawingState();
  fieldStatusLabel.textContent = "Ritar planerad sträcka";
  mapHint.textContent = selectedReferenceLine()
    ? "Klicka start och stopp på stödlinjen."
    : "Gör punkter längs vattendraget du tänker kartera.";
  sideMapHint.textContent = mapHint.textContent;
  setTool("field");
});
clearFieldAreaButton.addEventListener("click", () => {
  if (state.mappingStarted) {
    fieldStatusLabel.textContent = "Kartering är startad. Byt vattendrag för att rensa aktiv sträcka.";
    return;
  }
  clearFieldAreaDraft();
});
startMappingButton.addEventListener("click", startMapping);
importReferenceLineButton.addEventListener("click", () => {
  if (state.mappingStarted) {
    referenceLineStatus.textContent = "Kartering är startad. Byt vattendrag för att importera ny stödlinje.";
    return;
  }
  referenceLineInput.click();
});
fetchOsmWaterwaysButton.addEventListener("click", fetchOsmWaterwaysInView);
fetchLantmaterietWaterwaysButton?.addEventListener("click", () => fetchLantmaterietWaterwaysInView(false));
toggleLantmaterietTokenButton?.addEventListener("click", toggleLantmaterietTokenVisibility);
saveLantmaterietTokenButton?.addEventListener("click", saveLantmaterietToken);
testLantmaterietTokenButton?.addEventListener("click", testLantmaterietCredentials);
clearLantmaterietTokenButton?.addEventListener("click", clearLantmaterietToken);
referenceLineInput.addEventListener("change", () => {
  const file = referenceLineInput.files?.[0];
  if (file) importReferenceLineFile(file);
  referenceLineInput.value = "";
});
referenceLineList.addEventListener("click", (event) => {
  const selectId = event.target.dataset.selectReferenceLine;
  const deleteId = event.target.dataset.deleteReferenceLine;
  if (state.mappingStarted && (selectId || deleteId)) {
    console.warn("[InField reach] Ändring av stödlinje ignoreras under aktiv kartering.", {
      requestedSegmentId: selectId || deleteId,
      activeSegmentId: state.activeSegmentId,
      activeSegmentIds: activeReachIds(),
    });
    referenceLineStatus.textContent = "Kartering är startad. Byt vattendrag för att välja eller ta bort stödlinjer.";
    return;
  }
  if (selectId) {
    toggleReferenceLineSelection(selectId);
    const line = state.referenceLines.find((item) => item.id === selectId);
    if (line) {
      const lineName = safeReferenceLineName(line);
      referenceLineStatus.textContent = isReferenceLineSelected(line) ? `Aktiv stödlinje: ${lineName}` : `Avmarkerad stödlinje: ${lineName}`;
    }
    saveProject();
    render();
  }
  if (deleteId) {
    state.referenceLines = state.referenceLines.filter((line) => line.id !== deleteId);
    setSelectedReferenceLineIds(selectedReferenceLineIds().filter((id) => id !== deleteId));
    state.draftFieldReach = [];
    clearTemporaryDrawingState();
    saveProject();
    render();
  }
});
fieldBufferSelect?.addEventListener("change", () => {
  fieldCustomBufferWrap?.classList.toggle("hidden", fieldBufferSelect.value !== "custom");
});

startStopButton.addEventListener("click", () => {
  if (!state.activeSection) createSection();
  else if (!state.activeSection.startConfirmed) confirmSectionStart();
  else finishSection();
});

document.querySelector("#export-button").addEventListener("click", exportGeoJson);
exportShareButton.addEventListener("click", async () => {
  if (!state.lastExport) return;
  await shareOrShowExport(state.lastExport.filename, state.lastExport.blob, state.lastExport.watercourse);
});
exportDownloadButton.addEventListener("click", () => {
  if (!state.lastExport) return;
  downloadBlob(state.lastExport.filename, state.lastExport.blob);
  exportStatusText.textContent = `Zipfilen laddades ner igen: ${state.lastExport.filename}`;
});
splashCover.addEventListener("click", (event) => {
  event.preventDefault();
  showProjectPicker();
});
splashCover.querySelector("img")?.addEventListener(
  "error",
  () => {
    console.warn("[InField splash] Splash_InField.png kunde inte laddas, startvyn visas ändå.");
    showProjectPicker();
  },
  { once: true },
);
gpsToggleButton.addEventListener("click", toggleGps);
centerGpsButton.addEventListener("click", centerOnGps);
switchProjectButton.addEventListener("click", switchProject);
addSectionPhotoButton.addEventListener("click", triggerSectionPhoto);
addObjectPhotoButton.addEventListener("click", triggerObjectPhoto);
sectionPhotoInput.addEventListener("change", () => {
  const section = currentSectionForPhotos();
  const file = sectionPhotoInput.files?.[0];
  if (section && file) addPhoto("section", section.id, file);
  sectionPhotoInput.value = "";
});
objectPhotoInput.addEventListener("change", () => {
  const file = objectPhotoInput.files?.[0];
  if (state.selectedObjectId && file) addPhoto("object", state.selectedObjectId, file);
  objectPhotoInput.value = "";
});
mapPhotoInput.addEventListener("change", () => {
  const section = currentSectionForPhotos();
  const file = mapPhotoInput.files?.[0];
  if (section && file) addPhoto("section", section.id, file);
  mapPhotoInput.value = "";
});
startNewButton.addEventListener("click", startNewWatercourse);
openSelectedProjectButton.addEventListener("click", () => {
  if (savedProjectSelect.value) openWatercourse(savedProjectSelect.value);
});
startWatercourseInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") startNewWatercourse();
});
projectList.addEventListener("click", (event) => {
  const openName = event.target.dataset.openProject;
  const exportName = event.target.dataset.exportProject;
  const deleteKey = event.target.dataset.deleteProject;
  if (openName) openWatercourse(openName);
  if (exportName) {
    const payload = readSavedProject(storageKey(exportName));
    if (payload) exportGeoJson(payload);
  }
  if (deleteKey) deleteSavedProject(deleteKey);
});
undoDrawButton.addEventListener("click", undoObjectVertex);
finishDrawButton.addEventListener("click", finishObjectDrawing);
cancelDrawButton.addEventListener("click", cancelObjectDrawing);
saveObjectButton.addEventListener("click", saveSelectedObject);
cancelObjectEditButton.addEventListener("click", () => {
  clearSelectedObject();
  objectComment.value = "";
  render();
});
openWatercourseButton.addEventListener("click", () => openWatercourse(watercourseInput.value));
newWatercourseButton.addEventListener("click", newWatercourse);
projectInventor.addEventListener("input", saveProject);
watercourseInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") openWatercourse(watercourseInput.value);
});
sectionList.addEventListener("click", (event) => {
  const editId = event.target.dataset.editSection;
  const deleteId = event.target.dataset.deleteSection;
  if (editId) selectSection(editId);
  if (deleteId) deleteSection(deleteId);
});
objectList.addEventListener("click", (event) => {
  if (event.target.closest(".inline-editor")) {
    event.stopPropagation();
    return;
  }
  const editId = event.target.dataset.editObject;
  const saveId = event.target.dataset.saveObject;
  const cancelId = event.target.dataset.cancelObject;
  const deleteId = event.target.dataset.deleteObject;
  if (editId) selectObject(editId);
  if (saveId) saveInlineObject(saveId);
  if (cancelId) {
    clearSelectedObject();
    render();
  }
  if (deleteId) deleteObject(deleteId);
});
["pointerdown", "touchstart", "mousedown"].forEach((eventName) => {
  objectList.addEventListener(eventName, (event) => {
    if (event.target.closest(".inline-editor")) event.stopPropagation();
  });
});
objectList.addEventListener("input", (event) => {
  const commentId = event.target.dataset.inlineObjectComment;
  if (!commentId) return;
  if (!state.objectEditDraft || state.objectEditDraft.id !== commentId) {
    const object = state.objects.find((item) => item.id === commentId);
    state.objectEditDraft = { id: commentId, typeLabel: object?.typeLabel ?? objectType.value, comment: "" };
  }
  state.objectEditDraft.comment = event.target.value;
});
objectList.addEventListener("change", (event) => {
  const typeId = event.target.dataset.inlineObjectType;
  if (!typeId) return;
  if (!state.objectEditDraft || state.objectEditDraft.id !== typeId) {
    const object = state.objects.find((item) => item.id === typeId);
    state.objectEditDraft = { id: typeId, typeLabel: object?.typeLabel ?? event.target.value, comment: object?.comment ?? "" };
  }
  state.objectEditDraft.typeLabel = event.target.value;
});
map.addEventListener("click", handleMapClick);
map.addEventListener("pointerdown", startDrag);
map.addEventListener("pointermove", moveDrag);
window.addEventListener("pointerup", endDrag);
window.addEventListener("beforeunload", () => saveProject());
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveProject();
});

