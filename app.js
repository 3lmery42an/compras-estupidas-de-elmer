const STORAGE_KEY = "compras-geek-catalogo-v1";
const GOOGLE_CONFIG_KEY = "compras-geek-google-config-v1";
const TITLE_STORAGE_KEY = "compras-geek-title-v1";
const CLOUD_CONFIG_KEY = "compras-geek-cloud-config-v1";
const CLOUD_TABLE = "catalog_items";
const SUPABASE_MODULE_URL = "https://esm.sh/@supabase/supabase-js@2";
const DEFAULT_APP_TITLE = "Compras Estupidas de Elmer.";

const typeLabels = {
  comic: "Comic",
  manga: "Manga",
  figure: "Figura",
};

const statusLabels = {
  wishlist: "Pendiente",
  owned: "Conseguido",
};

const readingLabels = {
  unread: "No leido",
  queued: "Por leer",
  read: "Leido",
};

const priorityLabels = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

const formatLabels = {
  paperback: "Paperback",
  hardcover: "Hardcover",
  omnibus: "Omnibus",
  deluxe: "Deluxe",
  single: "Grapa",
  variant: "Variante",
  boxset: "Box set",
  digital: "Digital",
  tankobon: "Tankobon",
  scale112: "1/12",
  statue: "Estatua",
};

const defaultFormatByType = {
  comic: "paperback",
  manga: "tankobon",
  figure: "scale112",
};

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
  "": 3,
};

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return crypto.randomUUID();
  }

  return `item-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const seedItems = [
  {
    id: createId(),
    title: "Batman: Year One",
    type: "comic",
    status: "wishlist",
    readingStatus: "queued",
    priority: "high",
    format: "paperback",
    price: 18.99,
    series: "DC Black Label",
    store: "Comic shop",
    acquiredDate: "",
    image: "",
    notes: "Edicion tapa blanda o deluxe si aparece a buen precio.",
    createdAt: Date.now() - 3000,
  },
  {
    id: createId(),
    title: "One Piece Vol. 1",
    type: "manga",
    status: "wishlist",
    readingStatus: "unread",
    priority: "medium",
    format: "tankobon",
    price: 11.99,
    series: "Shonen Jump",
    store: "Libreria",
    acquiredDate: "",
    image: "",
    notes: "Empezar coleccion desde el primer volumen.",
    createdAt: Date.now() - 2000,
  },
  {
    id: createId(),
    title: "Spider-Man 1/12",
    type: "figure",
    status: "owned",
    readingStatus: "",
    priority: "low",
    format: "scale112",
    price: 34.99,
    series: "Figura articulada",
    store: "Online",
    acquiredDate: new Date().toISOString().slice(0, 10),
    image: "",
    notes: "Posable, con manos alternas y base sencilla.",
    createdAt: Date.now() - 1000,
  },
];

const state = {
  items: loadItems(),
  filters: {
    status: "all",
    type: "all",
    search: "",
    sort: "created-desc",
  },
  cloud: {
    client: null,
    configSignature: "",
    authListener: null,
    session: null,
    user: null,
    loading: false,
  },
};

const els = {
  appTitle: document.querySelector("#appTitle"),
  titleEditor: document.querySelector("#titleEditor"),
  saveTitleBtn: document.querySelector("#saveTitleBtn"),
  resetTitleBtn: document.querySelector("#resetTitleBtn"),
  cloudPanel: document.querySelector(".cloud-panel"),
  cloudStatus: document.querySelector("#cloudStatus"),
  supabaseUrl: document.querySelector("#supabaseUrl"),
  supabaseKey: document.querySelector("#supabaseKey"),
  cloudEmail: document.querySelector("#cloudEmail"),
  cloudPassword: document.querySelector("#cloudPassword"),
  saveCloudConfigBtn: document.querySelector("#saveCloudConfigBtn"),
  cloudSignupBtn: document.querySelector("#cloudSignupBtn"),
  cloudLoginBtn: document.querySelector("#cloudLoginBtn"),
  cloudLogoutBtn: document.querySelector("#cloudLogoutBtn"),
  cloudPullBtn: document.querySelector("#cloudPullBtn"),
  cloudPushBtn: document.querySelector("#cloudPushBtn"),
  form: document.querySelector("#itemForm"),
  formTitle: document.querySelector("#formTitle"),
  itemId: document.querySelector("#itemId"),
  title: document.querySelector("#title"),
  type: document.querySelector("#type"),
  status: document.querySelector("#status"),
  priority: document.querySelector("#priority"),
  format: document.querySelector("#format"),
  formatPicker: document.querySelector("#formatPicker"),
  readingStatus: document.querySelector("#readingStatus"),
  readingPicker: document.querySelector("#readingPicker"),
  readingGroup: document.querySelector("#readingGroup"),
  price: document.querySelector("#price"),
  series: document.querySelector("#series"),
  store: document.querySelector("#store"),
  acquiredDate: document.querySelector("#acquiredDate"),
  imageUrl: document.querySelector("#imageUrl"),
  imageData: document.querySelector("#imageData"),
  imageFile: document.querySelector("#imageFile"),
  imageDropZone: document.querySelector("#imageDropZone"),
  imageSourceBadge: document.querySelector("#imageSourceBadge"),
  imagePreview: document.querySelector("#imagePreview"),
  localPhotoPreview: document.querySelector("#localPhotoPreview"),
  localPhotoStatus: document.querySelector("#localPhotoStatus"),
  pasteImageBtn: document.querySelector("#pasteImageBtn"),
  clearPhotoBtn: document.querySelector("#clearPhotoBtn"),
  externalPhotoSearch: document.querySelector("#externalPhotoSearch"),
  googleApiKey: document.querySelector("#googleApiKey"),
  googleSearchEngineId: document.querySelector("#googleSearchEngineId"),
  externalPhotoBtn: document.querySelector("#externalPhotoBtn"),
  openGoogleImagesBtn: document.querySelector("#openGoogleImagesBtn"),
  externalPhotoStatus: document.querySelector("#externalPhotoStatus"),
  externalPhotoResults: document.querySelector("#externalPhotoResults"),
  notes: document.querySelector("#notes"),
  clearFormBtn: document.querySelector("#clearFormBtn"),
  cancelEditBtn: document.querySelector("#cancelEditBtn"),
  exportBtn: document.querySelector("#exportBtn"),
  importFile: document.querySelector("#importFile"),
  wishlistCount: document.querySelector("#wishlistCount"),
  ownedCount: document.querySelector("#ownedCount"),
  wishlistValue: document.querySelector("#wishlistValue"),
  catalogValue: document.querySelector("#catalogValue"),
  totalCount: document.querySelector("#totalCount"),
  readingBoardCount: document.querySelector("#readingBoardCount"),
  readList: document.querySelector("#readList"),
  unreadList: document.querySelector("#unreadList"),
  queuedList: document.querySelector("#queuedList"),
  readListCount: document.querySelector("#readListCount"),
  unreadListCount: document.querySelector("#unreadListCount"),
  queuedListCount: document.querySelector("#queuedListCount"),
  resultCount: document.querySelector("#resultCount"),
  searchInput: document.querySelector("#searchInput"),
  statusFilters: document.querySelector("#statusFilters"),
  typeFilters: document.querySelector("#typeFilters"),
  sortSelect: document.querySelector("#sortSelect"),
  catalogGrid: document.querySelector("#catalogGrid"),
  emptyState: document.querySelector("#emptyState"),
  cardTemplate: document.querySelector("#cardTemplate"),
};

function loadItems() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedItems));
    return seedItems;
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeItem) : seedItems;
  } catch {
    return seedItems;
  }
}

function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    return true;
  } catch {
    alert("No se pudo guardar. La foto puede ser demasiado grande; intenta con una imagen mas pequena.");
    return false;
  }
}

function cleanAppTitle(value) {
  return String(value || "").trim().slice(0, 60) || DEFAULT_APP_TITLE;
}

function setAppTitle(value, shouldSave = true) {
  const title = cleanAppTitle(value);
  els.appTitle.textContent = title;
  els.titleEditor.value = title;
  document.title = title;

  if (shouldSave) {
    localStorage.setItem(TITLE_STORAGE_KEY, title);
  }
}

function loadAppTitle() {
  setAppTitle(localStorage.getItem(TITLE_STORAGE_KEY) || DEFAULT_APP_TITLE, false);
}

function resetAppTitle() {
  localStorage.removeItem(TITLE_STORAGE_KEY);
  setAppTitle(DEFAULT_APP_TITLE, false);
}

function loadGoogleConfig() {
  try {
    return JSON.parse(localStorage.getItem(GOOGLE_CONFIG_KEY)) || {};
  } catch {
    return {};
  }
}

function saveGoogleConfig() {
  const config = {
    apiKey: els.googleApiKey.value.trim(),
    searchEngineId: els.googleSearchEngineId.value.trim(),
  };
  localStorage.setItem(GOOGLE_CONFIG_KEY, JSON.stringify(config));
  return config;
}

function applyGoogleConfig() {
  const config = loadGoogleConfig();
  els.googleApiKey.value = config.apiKey || "";
  els.googleSearchEngineId.value = config.searchEngineId || "";
}

function loadCloudConfig() {
  try {
    return JSON.parse(localStorage.getItem(CLOUD_CONFIG_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCloudConfig() {
  const config = {
    url: els.supabaseUrl.value.trim().replace(/\/$/, ""),
    key: els.supabaseKey.value.trim(),
  };
  localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
  return config;
}

function applyCloudConfig() {
  const config = loadCloudConfig();
  els.supabaseUrl.value = config.url || "";
  els.supabaseKey.value = config.key || "";
}

function getCloudConfigSignature(config) {
  return `${config.url || ""}|${config.key || ""}`;
}

function setCloudStatus(message, mode = "idle") {
  els.cloudStatus.textContent = message;
  els.cloudPanel.classList.toggle("sync-online", mode === "online");
  els.cloudPanel.classList.toggle("sync-error", mode === "error");
}

function renderCloudControls() {
  const hasConfig = Boolean(els.supabaseUrl.value.trim() && els.supabaseKey.value.trim());
  const isOnline = Boolean(state.cloud.session);
  const disabled = state.cloud.loading;

  els.cloudLoginBtn.disabled = disabled || !hasConfig;
  els.cloudSignupBtn.disabled = disabled || !hasConfig;
  els.cloudLogoutBtn.hidden = !isOnline;
  els.cloudLogoutBtn.disabled = disabled;
  els.cloudPullBtn.disabled = disabled || !isOnline;
  els.cloudPushBtn.disabled = disabled || !isOnline;
}

function formatMoney(value) {
  return new Intl.NumberFormat("es-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value || 0));
}

function escapeSearch(value) {
  return String(value || "").trim().toLowerCase();
}

function getDefaultFormat(type = "comic") {
  return defaultFormatByType[type] || "paperback";
}

function renderFormatPicker() {
  els.formatPicker.querySelectorAll("button[data-format]").forEach((button) => {
    button.classList.toggle("active", button.dataset.format === els.format.value);
  });
}

function setFormat(value) {
  els.format.value = formatLabels[value] ? value : getDefaultFormat(els.type.value);
  renderFormatPicker();
}

function isReadableType(type) {
  return ["comic", "manga"].includes(type);
}

function normalizeReadingStatus(value, type) {
  if (!isReadableType(type)) return "";
  return readingLabels[value] ? value : "unread";
}

function renderReadingPicker() {
  const canTrackReading = isReadableType(els.type.value);
  els.readingGroup.hidden = !canTrackReading;

  if (!canTrackReading) {
    els.readingStatus.value = "";
    return;
  }

  if (!readingLabels[els.readingStatus.value]) {
    els.readingStatus.value = "unread";
  }

  els.readingPicker.querySelectorAll("button[data-reading]").forEach((button) => {
    button.classList.toggle("active", button.dataset.reading === els.readingStatus.value);
  });
}

function setReadingStatus(value) {
  els.readingStatus.value = normalizeReadingStatus(value, els.type.value);
  renderReadingPicker();
}

function setExternalPhotoStatus(message) {
  els.externalPhotoStatus.textContent = message;
}

function clearExternalPhotos() {
  els.externalPhotoSearch.value = "";
  els.externalPhotoResults.replaceChildren();
  setExternalPhotoStatus("");
}

function buildExternalPhotoQuery() {
  const typedQuery = els.externalPhotoSearch.value.trim();
  if (typedQuery) return typedQuery;

  return [els.title.value.trim(), els.series.value.trim(), formatLabels[els.format.value], typeLabels[els.type.value]]
    .filter(Boolean)
    .join(" ");
}

function cleanPhotoTitle(title) {
  return String(title || "")
    .replace(/^File:/, "")
    .replace(/_/g, " ")
    .replace(/\.[a-z0-9]+$/i, "");
}

function sanitizeImageSource(url) {
  const value = String(url || "").trim();
  if (!value || value.startsWith("assets/") || value.startsWith("blob:") || value.startsWith("file:")) {
    return "";
  }

  if (/^data:image\/(png|jpe?g|webp);base64,/i.test(value)) {
    return value;
  }

  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

async function compressImageFile(file) {
  if (!file?.type?.startsWith("image/")) {
    throw new Error("Archivo invalido");
  }

  const dataUrl = await fileToDataUrl(file);
  const image = await loadImage(dataUrl);
  const maxSide = 900;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  canvas.width = width;
  canvas.height = height;
  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", 0.76);
}

function updateImagePreview(imageSource, message = "") {
  const source = sanitizeImageSource(imageSource);
  els.localPhotoPreview.hidden = !source;
  els.imagePreview.src = source || "";
  els.localPhotoStatus.textContent = message;
  els.imageSourceBadge.textContent = source
    ? source.startsWith("data:image/")
      ? "Archivo listo"
      : "URL lista"
    : "Sin foto";
}

function showLocalPreview(imageSource, message = "") {
  const source = sanitizeImageSource(imageSource);
  els.imageData.value = source;
  updateImagePreview(source, message);
}

function showRemotePreview(imageSource, message = "") {
  const source = sanitizeImageSource(imageSource);
  updateImagePreview(source, message);
}

function clearLocalPhoto(message = "") {
  els.imageData.value = "";
  els.imageFile.value = "";
  updateImagePreview(sanitizeImageSource(els.imageUrl.value), message);
}

function clearAllPhoto(message = "") {
  els.imageUrl.value = "";
  clearLocalPhoto(message);
}

async function processImageFile(file, message = "Foto local lista.") {
  if (!file) return;

  els.localPhotoStatus.textContent = "Preparando foto...";

  try {
    const imageData = await compressImageFile(file);
    els.imageUrl.value = "";
    els.externalPhotoResults.querySelectorAll(".external-photo-option").forEach((button) => {
      button.classList.remove("selected");
    });
    showLocalPreview(imageData, message);
    setExternalPhotoStatus("");
  } catch {
    clearLocalPhoto("No se pudo cargar esa foto.");
  }
}

async function pasteImageFromClipboard() {
  if (!navigator.clipboard?.read) {
    els.localPhotoStatus.textContent = "Pegar imagen no esta disponible en este navegador.";
    return;
  }

  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const clipboardItem of clipboardItems) {
      const imageType = clipboardItem.types.find((type) => type.startsWith("image/"));
      if (!imageType) continue;

      const blob = await clipboardItem.getType(imageType);
      await processImageFile(blob, "Imagen pegada lista.");
      return;
    }

    els.localPhotoStatus.textContent = "No encontre una imagen en el portapapeles.";
  } catch {
    els.localPhotoStatus.textContent = "No se pudo leer el portapapeles.";
  }
}

function handleImageDrop(event) {
  event.preventDefault();
  els.imageDropZone.classList.remove("drag-over");
  processImageFile(event.dataTransfer.files[0]);
}

function renderExternalPhotos(photos) {
  els.externalPhotoResults.replaceChildren();

  photos.forEach((photo) => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    const caption = document.createElement("span");

    button.className = "external-photo-option";
    button.type = "button";
    button.title = `Elegir ${photo.title}`;
    button.dataset.photoUrl = photo.url;
    button.classList.toggle("selected", els.imageUrl.value === photo.url);

    image.src = photo.thumbUrl;
    image.alt = photo.title;
    image.loading = "lazy";
    caption.textContent = photo.source ? `${photo.title} - ${photo.source}` : photo.title;

    button.append(image, caption);
    button.addEventListener("click", () => selectExternalPhoto(photo.url, button));
    els.externalPhotoResults.append(button);
  });
}

function selectExternalPhoto(url, selectedButton) {
  els.imageUrl.value = url;
  clearLocalPhoto();
  showRemotePreview(url, "Foto de Google seleccionada.");
  els.externalPhotoResults.querySelectorAll(".external-photo-option").forEach((button) => {
    button.classList.toggle("selected", button === selectedButton);
  });
  setExternalPhotoStatus("Foto seleccionada.");
}

async function searchExternalPhotos() {
  const query = buildExternalPhotoQuery();
  const config = saveGoogleConfig();

  if (!query) {
    setExternalPhotoStatus("Escribe un titulo o busqueda.");
    return;
  }

  if (!config.apiKey || !config.searchEngineId) {
    setExternalPhotoStatus("Agrega tu Google API key y Search engine ID.");
    return;
  }

  const params = new URLSearchParams({
    key: config.apiKey,
    cx: config.searchEngineId,
    q: query,
    searchType: "image",
    num: "10",
    safe: "active",
    imgType: "photo",
  });

  els.externalPhotoBtn.disabled = true;
  setExternalPhotoStatus("Buscando...");
  els.externalPhotoResults.replaceChildren();

  try {
    const response = await fetch(`https://customsearch.googleapis.com/customsearch/v1?${params}`);
    const data = await response.json();
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || "No se pudo consultar Google");
    }

    const photos = (data.items || [])
      .map((item) => {
        return {
          title: cleanPhotoTitle(item.title),
          url: item.link || "",
          thumbUrl: item.image?.thumbnailLink || item.link || "",
          source: item.displayLink || "",
          mime: item.mime || "",
        };
      })
      .filter((photo) => photo.url && photo.thumbUrl && (!photo.mime || photo.mime.startsWith("image/")))
      .filter((photo, index, list) => list.findIndex((item) => item.url === photo.url) === index)
      .slice(0, 12);

    if (!photos.length) {
      setExternalPhotoStatus("No se encontraron fotos.");
      return;
    }

    renderExternalPhotos(photos);
    setExternalPhotoStatus(`${photos.length} fotos de Google encontradas.`);
  } catch (error) {
    setExternalPhotoStatus("No se pudo cargar Google.");
  } finally {
    els.externalPhotoBtn.disabled = false;
  }
}

function openGoogleImages() {
  const query = buildExternalPhotoQuery() || "comics manga figures";
  const url = new URL("https://www.google.com/search");
  url.searchParams.set("tbm", "isch");
  url.searchParams.set("q", query);
  window.open(url.toString(), "_blank", "noopener,noreferrer");
}

function normalizeItem(item) {
  const type = ["comic", "manga", "figure"].includes(item.type) ? item.type : "comic";

  return {
    id: item.id || createId(),
    title: String(item.title || "").trim(),
    type,
    status: ["wishlist", "owned"].includes(item.status) ? item.status : "wishlist",
    readingStatus: normalizeReadingStatus(item.readingStatus, type),
    priority: ["", "high", "medium", "low"].includes(item.priority) ? item.priority : "",
    format: formatLabels[item.format] ? item.format : getDefaultFormat(type),
    price: Number(item.price || 0),
    series: String(item.series || "").trim(),
    store: String(item.store || "").trim(),
    acquiredDate: String(item.acquiredDate || "").trim(),
    image: sanitizeImageSource(item.image),
    notes: String(item.notes || "").trim(),
    createdAt: Number(item.createdAt || Date.now()),
  };
}

function getVisibleItems() {
  const term = escapeSearch(state.filters.search);

  return state.items
    .filter((item) => {
      const matchesStatus = state.filters.status === "all" || item.status === state.filters.status;
      const matchesType = state.filters.type === "all" || item.type === state.filters.type;
      const haystack = [
        item.title,
        item.series,
        item.store,
        item.notes,
        typeLabels[item.type],
        statusLabels[item.status],
        readingLabels[item.readingStatus],
        formatLabels[item.format],
      ]
        .join(" ")
        .toLowerCase();
      return matchesStatus && matchesType && haystack.includes(term);
    })
    .sort((a, b) => {
      if (state.filters.sort === "priority") {
        return (priorityOrder[a.priority] ?? 3) - (priorityOrder[b.priority] ?? 3) || b.createdAt - a.createdAt;
      }

      if (state.filters.sort === "price-desc") {
        return Number(b.price || 0) - Number(a.price || 0);
      }

      if (state.filters.sort === "price-asc") {
        return Number(a.price || 0) - Number(b.price || 0);
      }

      if (state.filters.sort === "title") {
        return a.title.localeCompare(b.title);
      }

      return b.createdAt - a.createdAt;
    });
}

function renderStats() {
  const wishlist = state.items.filter((item) => item.status === "wishlist");
  const owned = state.items.filter((item) => item.status === "owned");
  const wishlistValue = wishlist.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const catalogValue = state.items.reduce((sum, item) => sum + Number(item.price || 0), 0);

  els.wishlistCount.textContent = wishlist.length;
  els.ownedCount.textContent = owned.length;
  els.wishlistValue.textContent = formatMoney(wishlistValue);
  els.catalogValue.textContent = formatMoney(catalogValue);
  els.totalCount.textContent = state.items.length;
}

function getReadableItems() {
  return state.items
    .filter((item) => isReadableType(item.type))
    .sort((a, b) => a.title.localeCompare(b.title));
}

function createReadingListItem(item) {
  const listItem = document.createElement("li");
  const title = document.createElement("span");
  const meta = document.createElement("span");

  title.className = "reading-list-title";
  title.textContent = item.title;
  meta.className = "reading-list-meta";
  meta.textContent = [typeLabels[item.type], formatLabels[item.format], item.series].filter(Boolean).join(" | ");

  listItem.append(title, meta);
  return listItem;
}

function renderReadingColumn(listElement, countElement, items, emptyText) {
  listElement.replaceChildren();
  countElement.textContent = items.length;

  if (!items.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "reading-list-empty";
    emptyItem.textContent = emptyText;
    listElement.append(emptyItem);
    return;
  }

  items.forEach((item) => {
    listElement.append(createReadingListItem(item));
  });
}

function renderReadingLists() {
  const readableItems = getReadableItems();
  const readItems = readableItems.filter((item) => item.readingStatus === "read");
  const unreadItems = readableItems.filter((item) => item.readingStatus === "unread");
  const queuedItems = readableItems.filter((item) => item.readingStatus === "queued");

  els.readingBoardCount.textContent = `${readableItems.length} ${readableItems.length === 1 ? "comic o manga" : "comics y mangas"}`;
  renderReadingColumn(els.readList, els.readListCount, readItems, "Nada leido todavia.");
  renderReadingColumn(els.unreadList, els.unreadListCount, unreadItems, "Nada sin leer.");
  renderReadingColumn(els.queuedList, els.queuedListCount, queuedItems, "Nada por leer.");
}

function renderFilters() {
  els.statusFilters.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.status === state.filters.status);
  });

  els.typeFilters.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.type === state.filters.type);
  });
}

function renderCatalog() {
  const visibleItems = getVisibleItems();
  els.catalogGrid.replaceChildren();
  els.resultCount.textContent = `${visibleItems.length} ${visibleItems.length === 1 ? "item" : "items"}`;
  els.emptyState.hidden = visibleItems.length > 0;

  visibleItems.forEach((item) => {
    const card = els.cardTemplate.content.firstElementChild.cloneNode(true);
    const cover = card.querySelector(".cover");
    const typeBadge = card.querySelector(".type-badge");
    const statusPill = card.querySelector(".status-pill");
    const priorityPill = card.querySelector(".priority-pill");
    const formatPill = card.querySelector(".format-pill");
    const readingPill = card.querySelector(".reading-pill");
    const title = card.querySelector("h3");
    const meta = card.querySelector(".meta-line");
    const price = card.querySelector(".price-line");
    const note = card.querySelector(".note-line");
    const toggleButton = card.querySelector(".toggle-status");
    const toggleReadingButton = card.querySelector(".toggle-reading");
    const editButton = card.querySelector(".edit-item");
    const deleteButton = card.querySelector(".delete-item");

    const coverImage = sanitizeImageSource(item.image);
    cover.hidden = !coverImage;
    cover.closest(".cover-wrap").classList.toggle("no-image", !coverImage);
    cover.src = coverImage;
    cover.alt = item.title;
    cover.addEventListener("error", () => {
      cover.hidden = true;
      cover.closest(".cover-wrap").classList.add("no-image");
    }, { once: true });

    typeBadge.textContent = typeLabels[item.type];
    statusPill.textContent = statusLabels[item.status];
    statusPill.classList.add(item.status);
    priorityPill.textContent = priorityLabels[item.priority] || "";
    priorityPill.hidden = !item.priority;
    if (item.priority) priorityPill.classList.add(item.priority);
    formatPill.textContent = formatLabels[item.format] || "";
    formatPill.hidden = !formatLabels[item.format];
    if (item.format) formatPill.classList.add(item.format);
    readingPill.textContent = readingLabels[item.readingStatus] || "";
    readingPill.hidden = !isReadableType(item.type);
    if (item.readingStatus) readingPill.classList.add(item.readingStatus);
    title.textContent = item.title;
    meta.textContent = [item.series, item.store, item.acquiredDate ? `Conseguido: ${item.acquiredDate}` : ""]
      .filter(Boolean)
      .join(" | ");
    price.textContent = `Valor item: ${formatMoney(item.price)}`;
    note.textContent = item.notes || "Sin notas.";

    toggleButton.textContent = item.status === "owned" ? "Volver a pendiente" : "Marcar conseguido";
    toggleButton.addEventListener("click", () => toggleStatus(item.id));
    toggleReadingButton.hidden = !isReadableType(item.type);
    toggleReadingButton.textContent = getReadingButtonLabel(item.readingStatus);
    toggleReadingButton.addEventListener("click", () => toggleReadingStatus(item.id));
    editButton.addEventListener("click", () => editItem(item.id));
    deleteButton.addEventListener("click", () => deleteItem(item.id));

    els.catalogGrid.append(card);
  });
}

function render() {
  renderStats();
  renderReadingLists();
  renderFilters();
  renderCatalog();
}

function resetForm() {
  els.form.reset();
  els.itemId.value = "";
  els.formTitle.textContent = "Nuevo item";
  els.cancelEditBtn.hidden = true;
  els.status.value = "wishlist";
  setReadingStatus("unread");
  els.priority.value = "";
  setFormat(getDefaultFormat(els.type.value));
  applyGoogleConfig();
  clearExternalPhotos();
  clearLocalPhoto();
}

async function handleSubmit(event) {
  event.preventDefault();

  const id = els.itemId.value;
  const existing = state.items.find((item) => item.id === id);
  const image = sanitizeImageSource(els.imageData.value) || sanitizeImageSource(els.imageUrl.value) || sanitizeImageSource(existing?.image);

  const item = normalizeItem({
    id: id || createId(),
    title: els.title.value,
    type: els.type.value,
    status: els.status.value,
    readingStatus: els.readingStatus.value,
    priority: els.priority.value,
    format: els.format.value,
    price: els.price.value,
    series: els.series.value,
    store: els.store.value,
    acquiredDate: els.acquiredDate.value,
    image,
    notes: els.notes.value,
    createdAt: existing?.createdAt || Date.now(),
  });

  if (!item.title) return;

  const previousItems = state.items;
  state.items = id
    ? state.items.map((current) => (current.id === id ? item : current))
    : [item, ...state.items];

  if (!saveItems()) {
    state.items = previousItems;
    render();
    return;
  }

  resetForm();
  render();
  upsertCloudItem(item);
}

function editItem(id) {
  const item = state.items.find((current) => current.id === id);
  if (!item) return;

  els.itemId.value = item.id;
  els.title.value = item.title;
  els.type.value = item.type;
  els.status.value = item.status;
  setReadingStatus(item.readingStatus);
  els.priority.value = item.priority;
  setFormat(item.format);
  els.price.value = item.price || "";
  els.series.value = item.series;
  els.store.value = item.store;
  els.acquiredDate.value = item.acquiredDate;
  const existingImage = sanitizeImageSource(item.image);
  els.imageUrl.value = existingImage.startsWith("data:image/") ? "" : existingImage;
  if (existingImage.startsWith("data:image/")) {
    showLocalPreview(existingImage, "Foto local cargada.");
  } else {
    showRemotePreview(existingImage, existingImage ? "URL de imagen cargada." : "");
  }
  els.notes.value = item.notes;
  clearExternalPhotos();
  els.formTitle.textContent = "Editar item";
  els.cancelEditBtn.hidden = false;
  els.form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getNextReadingStatus(currentStatus) {
  if (currentStatus === "unread") return "queued";
  if (currentStatus === "queued") return "read";
  return "unread";
}

function getReadingButtonLabel(currentStatus) {
  if (currentStatus === "unread") return "Poner por leer";
  if (currentStatus === "queued") return "Marcar leido";
  return "Marcar no leido";
}

function toggleStatus(id) {
  let updatedItem = null;

  state.items = state.items.map((item) => {
    if (item.id !== id) return item;

    const nextStatus = item.status === "owned" ? "wishlist" : "owned";
    updatedItem = {
      ...item,
      status: nextStatus,
      acquiredDate: nextStatus === "owned" && !item.acquiredDate
        ? new Date().toISOString().slice(0, 10)
        : item.acquiredDate,
    };
    return updatedItem;
  });

  if (saveItems()) {
    render();
    upsertCloudItem(updatedItem);
  }
}

function toggleReadingStatus(id) {
  let updatedItem = null;

  state.items = state.items.map((item) => {
    if (item.id !== id || !isReadableType(item.type)) return item;

    updatedItem = {
      ...item,
      readingStatus: getNextReadingStatus(item.readingStatus),
    };
    return updatedItem;
  });

  if (saveItems()) {
    render();
    upsertCloudItem(updatedItem);
  }
}

function deleteItem(id) {
  const item = state.items.find((current) => current.id === id);
  if (!item) return;

  const ok = confirm(`Eliminar "${item.title}" del catalogo?`);
  if (!ok) return;

  state.items = state.items.filter((current) => current.id !== id);
  if (saveItems()) {
    render();
    deleteCloudItem(id);
  }
}

function exportData() {
  const blob = new Blob([JSON.stringify(state.items, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "catalogo-compras-estupidas-de-elmer.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const list = Array.isArray(parsed) ? parsed : parsed.items;
      if (!Array.isArray(list)) throw new Error("Formato invalido");

      const imported = list
        .map(normalizeItem)
        .filter((item) => item.title);

      if (!imported.length) throw new Error("Sin items");

      const replace = confirm("Importar reemplazando el catalogo actual?");
      state.items = replace ? imported : [...imported, ...state.items];
      if (!Array.isArray(parsed) && parsed.title) {
        setAppTitle(parsed.title);
      }
      if (saveItems()) {
        render();
        if (state.cloud.session) {
          runCloudAction(pushLocalToCloud);
        }
      }
    } catch (error) {
      alert("No se pudo importar ese archivo JSON.");
    } finally {
      els.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

async function getCloudClient() {
  const config = saveCloudConfig();
  const signature = getCloudConfigSignature(config);

  if (!config.url || !config.key) {
    throw new Error("Configura Supabase URL y anon key.");
  }

  if (state.cloud.client && state.cloud.configSignature === signature) {
    return state.cloud.client;
  }

  const { createClient } = await import(SUPABASE_MODULE_URL);
  const client = createClient(config.url, config.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: "collector-purchase-tracker-auth",
    },
  });

  if (state.cloud.authListener) {
    state.cloud.authListener.unsubscribe();
  }

  const { data } = await client.auth.getSession();
  state.cloud.client = client;
  state.cloud.configSignature = signature;
  state.cloud.session = data.session || null;
  state.cloud.user = data.session?.user || null;
  state.cloud.authListener = client.auth.onAuthStateChange((_event, session) => {
    state.cloud.session = session || null;
    state.cloud.user = session?.user || null;
    renderCloudControls();
    setCloudStatus(state.cloud.session ? `Conectado: ${state.cloud.user.email}` : "Local solamente", state.cloud.session ? "online" : "idle");
  }).data.subscription;

  return client;
}

function toCloudRow(item) {
  return {
    user_id: state.cloud.session.user.id,
    item_id: item.id,
    data: item,
    updated_at: new Date().toISOString(),
  };
}

async function fetchCloudItems() {
  const client = await getCloudClient();
  const { data, error } = await client
    .from(CLOUD_TABLE)
    .select("item_id,data,updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return (data || [])
    .map((row) => normalizeItem(row.data || {}))
    .filter((item) => item.title);
}

async function upsertCloudItem(item) {
  if (!item || !state.cloud.session || !state.cloud.client) return;

  try {
    const { error } = await state.cloud.client
      .from(CLOUD_TABLE)
      .upsert(toCloudRow(item), { onConflict: "user_id,item_id" });

    if (error) throw error;
    setCloudStatus(`Sincronizado: ${item.title}`, "online");
  } catch (error) {
    setCloudStatus(`No se sincronizo: ${error.message}`, "error");
  }
}

async function deleteCloudItem(id) {
  if (!state.cloud.session || !state.cloud.client) return;

  try {
    const { error } = await state.cloud.client
      .from(CLOUD_TABLE)
      .delete()
      .eq("user_id", state.cloud.session.user.id)
      .eq("item_id", id);

    if (error) throw error;
    setCloudStatus("Item eliminado de la nube.", "online");
  } catch (error) {
    setCloudStatus(`No se elimino en nube: ${error.message}`, "error");
  }
}

async function pushLocalToCloud() {
  const client = await getCloudClient();

  if (!state.cloud.session) {
    throw new Error("Inicia sesion primero. Si acabas de crear la cuenta, confirma tu email y vuelve a iniciar sesion.");
  }

  const rows = state.items.map(toCloudRow);
  const remoteItems = await fetchCloudItems();
  const localIds = new Set(state.items.map((item) => item.id));
  const staleRemoteIds = remoteItems
    .filter((item) => !localIds.has(item.id))
    .map((item) => item.id);

  if (staleRemoteIds.length) {
    const { error: deleteError } = await client
      .from(CLOUD_TABLE)
      .delete()
      .eq("user_id", state.cloud.session.user.id)
      .in("item_id", staleRemoteIds);

    if (deleteError) throw deleteError;
  }

  if (rows.length) {
    const { error } = await client
      .from(CLOUD_TABLE)
      .upsert(rows, { onConflict: "user_id,item_id" });

    if (error) throw error;
  }

  setCloudStatus(`${state.items.length} items subidos a la nube.`, "online");
}

async function pullCloudToLocal(shouldAsk = true) {
  const cloudItems = await fetchCloudItems();

  if (!cloudItems.length) {
    setCloudStatus("La nube no tiene items todavia.", "online");
    return;
  }

  if (shouldAsk && state.items.length) {
    const ok = confirm("Cargar el catalogo de la nube y reemplazar el catalogo local?");
    if (!ok) return;
  }

  state.items = cloudItems;
  if (saveItems()) {
    render();
    setCloudStatus(`${cloudItems.length} items cargados desde la nube.`, "online");
  }
}

async function reconcileCloudAfterLogin() {
  const cloudItems = await fetchCloudItems();

  if (!cloudItems.length) {
    await pushLocalToCloud();
    return;
  }

  const shouldLoad = confirm(`Encontre ${cloudItems.length} items en la nube. Cargarlos en este dispositivo?`);
  if (shouldLoad) {
    state.items = cloudItems;
    saveItems();
    render();
    setCloudStatus(`${cloudItems.length} items cargados desde la nube.`, "online");
    return;
  }

  setCloudStatus("Conectado. Puedes subir local o cargar nube cuando quieras.", "online");
}

async function runCloudAction(action) {
  state.cloud.loading = true;
  renderCloudControls();

  try {
    await action();
  } catch (error) {
    setCloudStatus(error.message || "No se pudo conectar con Supabase.", "error");
  } finally {
    state.cloud.loading = false;
    renderCloudControls();
  }
}

async function handleCloudSignup() {
  await runCloudAction(async () => {
    const client = await getCloudClient();
    const email = els.cloudEmail.value.trim();
    const password = els.cloudPassword.value;

    if (!email || !password) {
      throw new Error("Escribe email y password para crear la cuenta.");
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: location.href,
      },
    });

    if (error) throw error;

    if (data.session) {
      state.cloud.session = data.session;
      state.cloud.user = data.session.user;
      await reconcileCloudAfterLogin();
      return;
    }

    state.cloud.session = null;
    state.cloud.user = null;
    setCloudStatus("Cuenta creada, pero falta confirmar el email. Confirma el correo y luego usa Iniciar sesion.", "idle");
  });
}

async function handleCloudLogin() {
  await runCloudAction(async () => {
    const client = await getCloudClient();
    const email = els.cloudEmail.value.trim();
    const password = els.cloudPassword.value;

    if (!email || !password) {
      throw new Error("Escribe email y password para iniciar sesion.");
    }

    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) throw error;
    if (!data.session) {
      throw new Error("Supabase no devolvio una sesion. Confirma tu email y vuelve a iniciar sesion.");
    }

    state.cloud.session = data.session;
    state.cloud.user = data.session.user;
    await reconcileCloudAfterLogin();
  });
}

async function handleCloudLogout() {
  await runCloudAction(async () => {
    const client = await getCloudClient();
    const { error } = await client.auth.signOut();
    if (error) throw error;
    state.cloud.session = null;
    state.cloud.user = null;
    setCloudStatus("Local solamente", "idle");
  });
}

function saveCloudConfigFromForm() {
  saveCloudConfig();
  if (state.cloud.authListener) {
    state.cloud.authListener.unsubscribe();
    state.cloud.authListener = null;
  }
  state.cloud.client = null;
  state.cloud.session = null;
  state.cloud.user = null;
  state.cloud.configSignature = "";
  setCloudStatus("Conexion guardada.", "idle");
  renderCloudControls();
}

async function initializeCloud() {
  applyCloudConfig();
  renderCloudControls();

  const config = loadCloudConfig();
  if (!config.url || !config.key) {
    setCloudStatus("Local solamente", "idle");
    return;
  }

  await runCloudAction(async () => {
    await getCloudClient();
    if (state.cloud.session) {
      setCloudStatus(`Conectado: ${state.cloud.user.email}`, "online");
    } else {
      setCloudStatus("Conexion lista. Inicia sesion.", "idle");
    }
  });
}

els.form.addEventListener("submit", handleSubmit);
els.saveCloudConfigBtn.addEventListener("click", saveCloudConfigFromForm);
els.cloudSignupBtn.addEventListener("click", handleCloudSignup);
els.cloudLoginBtn.addEventListener("click", handleCloudLogin);
els.cloudLogoutBtn.addEventListener("click", handleCloudLogout);
els.cloudPullBtn.addEventListener("click", () => runCloudAction(() => pullCloudToLocal(true)));
els.cloudPushBtn.addEventListener("click", () => runCloudAction(pushLocalToCloud));
els.saveTitleBtn.addEventListener("click", () => setAppTitle(els.titleEditor.value));
els.resetTitleBtn.addEventListener("click", resetAppTitle);
els.titleEditor.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  setAppTitle(els.titleEditor.value);
});
els.clearFormBtn.addEventListener("click", resetForm);
els.cancelEditBtn.addEventListener("click", resetForm);
els.exportBtn.addEventListener("click", exportData);
els.importFile.addEventListener("change", (event) => importData(event.target.files[0]));
els.type.addEventListener("change", () => {
  setFormat(getDefaultFormat(els.type.value));
  setReadingStatus(els.readingStatus.value);
});
els.formatPicker.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-format]");
  if (!button) return;
  setFormat(button.dataset.format);
});
els.readingPicker.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-reading]");
  if (!button) return;
  setReadingStatus(button.dataset.reading);
});
els.externalPhotoBtn.addEventListener("click", searchExternalPhotos);
els.openGoogleImagesBtn.addEventListener("click", openGoogleImages);
els.externalPhotoSearch.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  searchExternalPhotos();
});
els.imageUrl.addEventListener("input", () => {
  clearLocalPhoto();
  els.externalPhotoResults.querySelectorAll(".external-photo-option").forEach((button) => {
    button.classList.remove("selected");
  });
  showRemotePreview(els.imageUrl.value, els.imageUrl.value.trim() ? "URL de imagen lista." : "");
  setExternalPhotoStatus("");
});
els.imageFile.addEventListener("change", async () => {
  processImageFile(els.imageFile.files[0]);
});
els.imageDropZone.addEventListener("click", () => els.imageFile.click());
els.imageDropZone.addEventListener("dragover", (event) => {
  event.preventDefault();
  els.imageDropZone.classList.add("drag-over");
});
els.imageDropZone.addEventListener("dragleave", () => els.imageDropZone.classList.remove("drag-over"));
els.imageDropZone.addEventListener("drop", handleImageDrop);
els.pasteImageBtn.addEventListener("click", pasteImageFromClipboard);
els.clearPhotoBtn.addEventListener("click", () => {
  clearAllPhoto("Foto quitada.");
  els.externalPhotoResults.querySelectorAll(".external-photo-option").forEach((button) => {
    button.classList.remove("selected");
  });
  setExternalPhotoStatus("");
});
els.googleApiKey.addEventListener("change", saveGoogleConfig);
els.googleSearchEngineId.addEventListener("change", saveGoogleConfig);

els.searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  renderCatalog();
});

els.sortSelect.addEventListener("change", (event) => {
  state.filters.sort = event.target.value;
  renderCatalog();
});

els.statusFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-status]");
  if (!button) return;
  state.filters.status = button.dataset.status;
  render();
});

els.typeFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-type]");
  if (!button) return;
  state.filters.type = button.dataset.type;
  render();
});

loadAppTitle();
applyGoogleConfig();
initializeCloud();
renderReadingPicker();
render();
