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
  point: ["Bestämmande sektion", "Knickpoint", "Kulturmiljö", "Damm", "Åtgärdspunkt", "Uppföljning"],
  line: ["Ledarm", "Upprensning", "Sidogren", "Körväg", "Uppföljning"],
  area: ["Översvämningsyta", "Åtgärdsyta", "Uppföljning"],
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
  tool: "pan",
  tempObject: null,
  dragging: null,
  gpsEnabled: false,
  gpsWatchId: null,
  gpsPosition: null,
  hasCenteredOnGps: false,
  mapOffset: [0, 0],
  useSupportLine: false,
};

const map = document.querySelector("#map");
const mapToolbar = document.querySelector("#map-toolbar");
const toolMenuButton = document.querySelector("#tool-menu-button");
const mapZoomInButton = document.querySelector("#map-zoom-in");
const mapZoomOutButton = document.querySelector("#map-zoom-out");
const startScreen = document.querySelector("#start-screen");
const splashCover = document.querySelector("#splash-cover");
const projectList = document.querySelector("#project-list");
const savedProjectSelect = document.querySelector("#saved-project-select");
const openSelectedProjectButton = document.querySelector("#open-selected-project-button");
const startWatercourseInput = document.querySelector("#start-watercourse-input");
const startNewButton = document.querySelector("#start-new-button");
const supportLine = document.querySelector("#support-line");
const mapPhotoInput = document.querySelector("#map-photo-input");
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
const projectMachine = document.querySelector("#project-machine");
const saveStateLabel = document.querySelector("#save-state-label");

state.watercourse = "Bresiljeån";
state.selectedObjectId = null;
state.projectMeta = { inventor: "", machineSize: "", excavator: "Nej" };

function pathFromPoints(points) {
  return points.map((p, index) => `${index === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
}

function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function sectionLength(points) {
  return points.slice(1).reduce((sum, point, index) => sum + distance(points[index], point), 0);
}

function formatLength(points) {
  const meters = sectionLength(points) * 1.8;
  return meters > 1000 ? `${(meters / 1000).toFixed(2)} km` : `${Math.round(meters)} m`;
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
  if (state.backgroundMap) {
    const latLng = state.backgroundMap.containerPointToLatLng(svgPointToContainer(point));
    return [Number(latLng.lng.toFixed(7)), Number(latLng.lat.toFixed(7))];
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
  if (!state.gpsPosition) return;
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
  return { inventor: "", machineSize: "", excavator: "Nej" };
}

function syncProjectMetaFromForm() {
  state.projectMeta = {
    ...defaultProjectMeta(),
    ...(state.projectMeta ?? {}),
    inventor: projectInventor.value,
    machineSize: projectMachine.value,
  };
}

function syncProjectMetaToForm() {
  projectInventor.value = state.projectMeta?.inventor ?? "";
  projectMachine.value = state.projectMeta?.machineSize ?? "";
}

function makeSvg(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
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
  window.L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(background);
  background.on("move zoom", renderGps);
  state.backgroundMap = background;
  map.classList.add("map-dimmed");
  setTool(state.tool);
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
  startScreen.classList.remove("show-projects");
  startScreen.classList.remove("hidden");
}

function hideStartScreen() {
  startScreen.classList.add("hidden");
}

function showProjectPicker() {
  startScreen.classList.add("show-projects");
}

function switchProject() {
  syncFormToProtocol();
  saveProject();
  renderProjectList();
  startScreen.classList.add("show-projects");
  startScreen.classList.remove("hidden");
}

function saveProject() {
  syncProjectMetaFromForm();
  state.nextSectionNumber = nextSectionNumber();
  const payload = {
    watercourse: state.watercourse,
    nextSectionNumber: state.nextSectionNumber,
    activeSection: state.activeSection,
    sections: state.sections,
    objects: state.objects,
    photos: state.photos,
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
    state.objects = payload.objects ?? [];
    state.photos = payload.photos ?? [];
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
  document.querySelectorAll("[data-project-field]").forEach((button) => {
    const value = state.projectMeta?.[button.dataset.projectField] ?? "Nej";
    button.classList.toggle("active", button.dataset.value === value);
  });
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
  return section;
}

function setTool(tool) {
  state.tool = tool;
  state.tempObject = null;
  if (["point", "line", "area"].includes(tool)) updateObjectTypeSelect(tool);
  document.querySelectorAll(".icon-button").forEach((button) => button.classList.remove("active"));
  document.querySelector(`#tool-${tool}`)?.classList.add("active");
  map.classList.toggle("drawing-active", tool !== "pan");
  if (state.backgroundMap) {
    if (tool === "pan") {
      state.backgroundMap.dragging.enable();
      state.backgroundMap.touchZoom.enable();
      state.backgroundMap.doubleClickZoom.enable();
      state.backgroundMap.scrollWheelZoom.enable();
    } else {
      state.backgroundMap.dragging.disable();
      state.backgroundMap.touchZoom.disable();
      state.backgroundMap.doubleClickZoom.disable();
      state.backgroundMap.scrollWheelZoom.disable();
    }
  }
  mapToolbar.classList.add("collapsed");
  toolMenuButton.setAttribute("aria-expanded", "false");
  mapHint.textContent =
    tool === "pan"
      ? "Flytta och zooma kartan."
      : tool === "section"
      ? "Välj grön startpunkt och röd stoppunkt i kartan."
      : tool === "photo"
        ? "Klicka i kartan för att ta foto kopplat till aktiv sträcka."
      : "Klicka i kartan för att lägga till objekt på aktiv sträcka.";
  render();
}

function createSection() {
  clearSelectedObject();
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

function finishSection() {
  if (!state.activeSection || state.activeSection.points.length < 2) return;
  syncFormToProtocol();
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
  object.typeLabel = typeField.value;
  object.comment = commentField.value;
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

function syncFormToProtocol() {
  if (!state.activeSection) return;
  document.querySelectorAll("[data-protocol-input]").forEach((input) => {
    state.activeSection.attributes[input.dataset.protocolInput] = input.value;
  });
  updateCalculatedProtocolFields();
  saveProject();
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
  const allSections = [...state.sections, state.activeSection].filter(Boolean);
  allSections.forEach((section) => {
    if (section.points.length < 2) return;
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

function renderVertices() {
  verticesLayer.innerHTML = "";
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
  state.objects.forEach((object) => {
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
    const geometryLabel =
      object.geometry.type === "Point"
        ? "Punkt"
        : object.geometry.type === "LineString"
          ? "Linje"
          : "Yta";
    li.innerHTML = isSelected
      ? `<strong>${object.typeLabel}</strong><span>${geometryLabel} · Sträcka ${section?.number ?? "-"}</span><div class="inline-editor"><label>Objekttyp</label><select data-inline-object-type="${object.id}">${objectTypeOptions(objectGeometryTool(object), object.typeLabel)}</select><label>Kommentar</label><textarea rows="3" data-inline-object-comment="${object.id}">${object.comment || ""}</textarea></div>${objectPhotoMarkup(object.id)}<div class="list-actions"><button class="secondary-button" data-save-object="${object.id}">Spara</button><button class="quiet-button" data-cancel-object="${object.id}">Avbryt</button><button class="danger-button" data-delete-object="${object.id}">Ta bort</button></div>`
      : `<strong>${object.typeLabel}</strong><span>${geometryLabel} · Sträcka ${section?.number ?? "-"} · ${object.comment || "Ingen kommentar"}</span><div class="list-actions"><button class="quiet-button" data-edit-object="${object.id}">Ändra</button><button class="danger-button" data-delete-object="${object.id}">Ta bort</button></div>`;
    objectList.append(li);
  });
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
  if (!activeOrLast) return;
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
      }
    : state;
  const coordinateSystem = "WGS84 lon/lat (EPSG:4326) från kartans nuvarande position";
  const exportSections = [...(exportState.sections ?? []), exportState.activeSection].filter(
    (section) => section && section.points?.length > 1,
  );
  const sectionFeatures = exportSections.map((section) => ({
    type: "Feature",
    properties: {
      id: section.id,
      lager: "delstrackor",
      vattendrag: exportState.watercourse,
      inventor: exportState.projectMeta?.inventor ?? "",
      maskin: exportState.projectMeta?.machineSize ?? "",
      schaktmaskin: exportState.projectMeta?.excavator ?? "Nej",
      stracka_nr: section.number,
      length: formatLength(section.points),
      koordinater: coordinateSystem,
      ...pointSummary(section.points),
      ...section.attributes,
    },
    geometry: geometryToGeo({ type: "LineString", coordinates: section.points }),
  }));
  const objectFeatures = exportState.objects.map((object) => {
    const section = exportSections.find((item) => item.id === object.sectionId) ?? exportState.activeSection;
    return {
    type: "Feature",
    properties: {
      id: object.id,
      lager: object.geometry.type === "Point" ? "punktobjekt" : object.geometry.type === "LineString" ? "linjeobjekt" : "ytobjekt",
      vattendrag: exportState.watercourse,
      inventor: exportState.projectMeta?.inventor ?? "",
      maskin: exportState.projectMeta?.machineSize ?? "",
      schaktmaskin: exportState.projectMeta?.excavator ?? "Nej",
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
  ];
  const metadata = {
    vattendrag: exportState.watercourse,
    exporterad: new Date().toISOString(),
    inventor: exportState.projectMeta?.inventor ?? "",
    maskin: exportState.projectMeta?.machineSize ?? "",
    schaktmaskin: exportState.projectMeta?.excavator ?? "Nej",
    koordinater: coordinateSystem,
    stodlinje: state.useSupportLine ? "tillfallig" : "ingen",
    delstrackor: sectionFeatures.length,
    punktobjekt: layers[1][1].length,
    linjeobjekt: layers[2][1].length,
    ytobjekt: layers[3][1].length,
    foton: photoMetadata.length,
  };
  if (window.JSZip) {
    await downloadZipPackage(safeName, exportState, layers, metadata, photoMetadata);
    openExportMail(exportState.watercourse, `${safeName}-gis-export.zip`);
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

async function downloadZipPackage(safeName, exportState, layers, metadata, photoMetadata) {
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
  downloadBlob(`${safeName}-gis-export.zip`, blob);
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

function handleMapClick(event) {
  if (state.tool === "pan") return;
  if (event.target.dataset.objectId) {
    selectObject(event.target.dataset.objectId);
    return;
  }
  if (state.dragging) return;
  const point = svgPoint(event);
  if (state.tool === "section") {
    if (!state.activeSection) return;
    const snapped = state.useSupportLine ? snapToSupport(point) : { point };
    if (!state.activeSection.startConfirmed) {
      state.activeSection.points = [snapped.point];
    } else {
      if (state.useSupportLine) {
        const startSnap = snapToSupport(state.activeSection.points[0]);
        state.activeSection.points = supportSlice(startSnap, snapped);
      } else {
        state.activeSection.points = [state.activeSection.points[0], point];
      }
    }
  } else if (state.tool === "point") {
    addObjectPoint(point);
  } else if (state.tool === "photo") {
    triggerMapPhoto();
  } else {
    addObjectVertex(point);
  }
  render();
}

function startDrag(event) {
  if (!event.target.classList.contains("vertex") || !state.activeSection) return;
  state.dragging = Number(event.target.dataset.index);
}

function moveDrag(event) {
  if (state.dragging === null || !state.activeSection) return;
  const point = svgPoint(event);
  state.activeSection.points[state.dragging] =
    state.useSupportLine && !event.shiftKey ? snapToSupport(point).point : point;
  render();
}

function endDrag() {
  if (state.dragging !== null) saveProject();
  state.dragging = null;
}

supportLine.setAttribute("d", pathFromPoints(supportPoints));
supportLine.classList.toggle("hidden", !state.useSupportLine);
initBackgroundMap();
renderProtocolFields();
updateObjectTypeSelect("point", "Bestämmande sektion");
renderProjectList();
showStartScreen();

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab, .panel").forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
    document.querySelector(`#${tab.dataset.tab}-panel`).classList.add("active");
  });
});

document.querySelectorAll(".icon-button").forEach((button) => {
  button.addEventListener("click", () => setTool(button.id.replace("tool-", "")));
});

toolMenuButton.addEventListener("click", () => {
  const collapsed = mapToolbar.classList.toggle("collapsed");
  toolMenuButton.setAttribute("aria-expanded", String(!collapsed));
});
mapZoomInButton.addEventListener("click", () => state.backgroundMap?.zoomIn());
mapZoomOutButton.addEventListener("click", () => state.backgroundMap?.zoomOut());

document.querySelectorAll("[data-object-tool]").forEach((button) => {
  button.addEventListener("click", () => setTool(button.dataset.objectTool));
});

startStopButton.addEventListener("click", () => {
  if (!state.activeSection) createSection();
  else if (!state.activeSection.startConfirmed) confirmSectionStart();
  else finishSection();
});

document.querySelector("#export-button").addEventListener("click", exportGeoJson);
splashCover.addEventListener("click", showProjectPicker);
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
projectMachine.addEventListener("change", saveProject);
document.querySelectorAll("[data-project-field]").forEach((button) => {
  button.addEventListener("click", () => {
    state.projectMeta[button.dataset.projectField] = button.dataset.value;
    syncProjectChoices();
    saveProject();
  });
});
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
map.addEventListener("click", handleMapClick);
map.addEventListener("pointerdown", startDrag);
map.addEventListener("pointermove", moveDrag);
window.addEventListener("pointerup", endDrag);

