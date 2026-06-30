const STORAGE_KEY = "compras-geek-catalogo-v1";
const GOOGLE_CONFIG_KEY = "compras-geek-google-config-v1";

const typeLabels = {
  comic: "Comic",
  manga: "Manga",
  figure: "Figura",
};

const statusLabels = {
  wishlist: "Pendiente",
  owned: "Conseguido",
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
};

const els = {
  form: document.querySelector("#itemForm"),
  formTitle: document.querySelector("#formTitle"),
  itemId: document.querySelector("#itemId"),
  title: document.querySelector("#title"),
  type: document.querySelector("#type"),
  status: document.querySelector("#status"),
  priority: document.querySelector("#priority"),
  format: document.querySelector("#format"),
  formatPicker: document.querySelector("#formatPicker"),
  price: document.querySelector("#price"),
  series: document.querySelector("#series"),
  store: document.querySelector("#store"),
  acquiredDate: document.querySelector("#acquiredDate"),
  imageUrl: document.querySelector("#imageUrl"),
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
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

function sanitizeImageUrl(url) {
  const value = String(url || "").trim();
  if (!value || value.startsWith("assets/") || value.startsWith("data:") || value.startsWith("blob:") || value.startsWith("file:")) {
    return "";
  }

  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "";
  } catch {
    return "";
  }
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
  return {
    id: item.id || createId(),
    title: String(item.title || "").trim(),
    type: ["comic", "manga", "figure"].includes(item.type) ? item.type : "comic",
    status: ["wishlist", "owned"].includes(item.status) ? item.status : "wishlist",
    priority: ["", "high", "medium", "low"].includes(item.priority) ? item.priority : "",
    format: formatLabels[item.format] ? item.format : getDefaultFormat(item.type),
    price: Number(item.price || 0),
    series: String(item.series || "").trim(),
    store: String(item.store || "").trim(),
    acquiredDate: String(item.acquiredDate || "").trim(),
    image: sanitizeImageUrl(item.image),
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
    const title = card.querySelector("h3");
    const meta = card.querySelector(".meta-line");
    const price = card.querySelector(".price-line");
    const note = card.querySelector(".note-line");
    const toggleButton = card.querySelector(".toggle-status");
    const editButton = card.querySelector(".edit-item");
    const deleteButton = card.querySelector(".delete-item");

    const coverImage = sanitizeImageUrl(item.image);
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
    title.textContent = item.title;
    meta.textContent = [item.series, item.store, item.acquiredDate ? `Conseguido: ${item.acquiredDate}` : ""]
      .filter(Boolean)
      .join(" | ");
    price.textContent = `Valor item: ${formatMoney(item.price)}`;
    note.textContent = item.notes || "Sin notas.";

    toggleButton.textContent = item.status === "owned" ? "Volver a pendiente" : "Marcar conseguido";
    toggleButton.addEventListener("click", () => toggleStatus(item.id));
    editButton.addEventListener("click", () => editItem(item.id));
    deleteButton.addEventListener("click", () => deleteItem(item.id));

    els.catalogGrid.append(card);
  });
}

function render() {
  renderStats();
  renderFilters();
  renderCatalog();
}

function resetForm() {
  els.form.reset();
  els.itemId.value = "";
  els.formTitle.textContent = "Nuevo item";
  els.cancelEditBtn.hidden = true;
  els.status.value = "wishlist";
  els.priority.value = "";
  setFormat(getDefaultFormat(els.type.value));
  applyGoogleConfig();
  clearExternalPhotos();
}

async function handleSubmit(event) {
  event.preventDefault();

  const id = els.itemId.value;
  const existing = state.items.find((item) => item.id === id);
  const image = sanitizeImageUrl(els.imageUrl.value) || sanitizeImageUrl(existing?.image);

  const item = normalizeItem({
    id: id || createId(),
    title: els.title.value,
    type: els.type.value,
    status: els.status.value,
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

  if (id) {
    state.items = state.items.map((current) => (current.id === id ? item : current));
  } else {
    state.items.unshift(item);
  }

  saveItems();
  resetForm();
  render();
}

function editItem(id) {
  const item = state.items.find((current) => current.id === id);
  if (!item) return;

  els.itemId.value = item.id;
  els.title.value = item.title;
  els.type.value = item.type;
  els.status.value = item.status;
  els.priority.value = item.priority;
  setFormat(item.format);
  els.price.value = item.price || "";
  els.series.value = item.series;
  els.store.value = item.store;
  els.acquiredDate.value = item.acquiredDate;
  els.imageUrl.value = sanitizeImageUrl(item.image);
  els.notes.value = item.notes;
  clearExternalPhotos();
  els.formTitle.textContent = "Editar item";
  els.cancelEditBtn.hidden = false;
  els.form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function toggleStatus(id) {
  state.items = state.items.map((item) => {
    if (item.id !== id) return item;

    const nextStatus = item.status === "owned" ? "wishlist" : "owned";
    return {
      ...item,
      status: nextStatus,
      acquiredDate: nextStatus === "owned" && !item.acquiredDate
        ? new Date().toISOString().slice(0, 10)
        : item.acquiredDate,
    };
  });

  saveItems();
  render();
}

function deleteItem(id) {
  const item = state.items.find((current) => current.id === id);
  if (!item) return;

  const ok = confirm(`Eliminar "${item.title}" del catalogo?`);
  if (!ok) return;

  state.items = state.items.filter((current) => current.id !== id);
  saveItems();
  render();
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
      saveItems();
      render();
    } catch (error) {
      alert("No se pudo importar ese archivo JSON.");
    } finally {
      els.importFile.value = "";
    }
  };
  reader.readAsText(file);
}

els.form.addEventListener("submit", handleSubmit);
els.clearFormBtn.addEventListener("click", resetForm);
els.cancelEditBtn.addEventListener("click", resetForm);
els.exportBtn.addEventListener("click", exportData);
els.importFile.addEventListener("change", (event) => importData(event.target.files[0]));
els.type.addEventListener("change", () => setFormat(getDefaultFormat(els.type.value)));
els.formatPicker.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-format]");
  if (!button) return;
  setFormat(button.dataset.format);
});
els.externalPhotoBtn.addEventListener("click", searchExternalPhotos);
els.openGoogleImagesBtn.addEventListener("click", openGoogleImages);
els.externalPhotoSearch.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  searchExternalPhotos();
});
els.imageUrl.addEventListener("input", () => {
  els.externalPhotoResults.querySelectorAll(".external-photo-option").forEach((button) => {
    button.classList.remove("selected");
  });
  setExternalPhotoStatus(els.imageUrl.value.trim() ? "URL de imagen lista." : "");
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

applyGoogleConfig();
render();
