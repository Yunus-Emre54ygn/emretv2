/* =======================
   GLOBAL STATE & ELEMENTS
======================= */
document.addEventListener("DOMContentLoaded", () => {

let isFavoritesView = false;

const showList = document.getElementById("showList");
const searchInput = document.getElementById("searchInput");
const offlineWarning = document.getElementById("offlineWarning");
const statusMessage = document.getElementById("statusMessage");
const toggleBtn = document.getElementById("toggleFavs");

/* =======================
   FAVORİ BUTONU (TEK YER)
======================= */
toggleBtn.addEventListener("click", () => {

  // 🔁 FAVORİLERDEN ANA LİSTEYE DÖN
  if (isFavoritesView) {
    isFavoritesView = false;
    toggleBtn.textContent = "⭐ Favoriler";
    statusMessage.textContent = "Tüm içerikler gösteriliyor 🍿";
    fetchShows();
    return;
  }

  // ⭐ FAVORİLERE GEÇ
  const favs = getFavorites();

  if (favs.length === 0) {
    statusMessage.textContent = "Henüz favori yok ⭐";
    return; // ❗ state DEĞİŞMİYOR
  }

  isFavoritesView = true;
  toggleBtn.textContent = "⬅️ Keşfet";
  statusMessage.textContent = "Favoriler gösteriliyor ⭐";
  displayShows(favs, true);
});

/* =======================
   FAVORİ YARDIMCILARI
======================= */
function getFavorites() {
  return JSON.parse(localStorage.getItem("emretv_favorites")) || [];
}

function saveFavorites(favs) {
  localStorage.setItem("emretv_favorites", JSON.stringify(favs));
}

function showMessage(text) {
  statusMessage.textContent = text;
}

/* =======================
   DİZİLERİ ÇEK
======================= */
async function fetchShows() {
  isFavoritesView = false;
  toggleBtn.textContent = "⭐ Favoriler";

  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    const shows = await response.json();
    displayShows(shows.slice(0, 30), false);
  } catch {
    showList.innerHTML = "<p>Veriler alınamadı.</p>";
  }
}

/* =======================
   KARTLARI BAS
======================= */
function displayShows(shows, isFavorites = false) {
  showList.innerHTML = "";

  shows.forEach(show => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${show.image?.medium || ""}">
      <h3>${show.name}</h3>
      <p>Puan: ${show.rating?.average ?? "N/A"}</p>
      <button class="fav-btn">
        ${isFavorites ? "❌" : "⭐"}
      </button>
    `;

    const favBtn = card.querySelector(".fav-btn");

    favBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      let favs = getFavorites();

      if (isFavorites) {
        favs = favs.filter(f => f.id !== show.id);
        saveFavorites(favs);

        if (favs.length === 0) {
          isFavoritesView = false;
          toggleBtn.textContent = "⭐ Favoriler";
          showMessage("Favoriler boş ⭐");
          fetchShows();
        } else {
          displayShows(favs, true);
          showMessage("Favorilerden çıkarıldı ❌");
        }
        return;
      }

      if (favs.some(f => f.id === show.id)) {
        showMessage("Bu içerik zaten favorilerde ⭐");
        return;
      }

      favs.push({
        id: show.id,
        name: show.name,
        image: show.image?.medium,
        rating: show.rating?.average
      });

      saveFavorites(favs);
      showMessage("Favorilere eklendi ⭐");
    });

    card.addEventListener("click", () => openDetail(show));
    showList.appendChild(card);
  });
}

/* =======================
   ARAMA
======================= */
searchInput.addEventListener("input", async () => {
  isFavoritesView = false;
  toggleBtn.textContent = "⭐ Favoriler";

  const query = searchInput.value.trim();

  if (query.length < 2) {
    fetchShows();
    return;
  }

  try {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${query}`
    );
    const results = await response.json();
    const shows = results.map(item => item.show);

    displayShows(shows, false);
    localStorage.setItem("emretv_last_results", JSON.stringify(shows));
  } catch {
    loadCachedResults();
  }
});

/* =======================
   OFFLINE CACHE
======================= */
function loadCachedResults() {
  const cached = localStorage.getItem("emretv_last_results");

  if (!cached) {
    showMessage("Offline moddasınız ve kayıtlı veri yok.");
    return;
  }

  displayShows(JSON.parse(cached), false);
  showMessage("Offline mod: Son sonuçlar gösteriliyor.");
}

/* =======================
   ONLINE / OFFLINE
======================= */
function updateOnlineStatus() {
  if (!navigator.onLine) {
    searchInput.disabled = true;
    searchInput.placeholder = "Offline modda arama yapılamaz";
    offlineWarning.style.display = "block";
    loadCachedResults();
  } else {
    searchInput.disabled = false;
    searchInput.placeholder = "Dizi / Film / Çizgi Film ara...";
    offlineWarning.style.display = "none";
  }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

/* =======================
   MODAL
======================= */
const modal = document.getElementById("detailModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => modal.classList.add("hidden"));
window.addEventListener("click", e => e.target === modal && modal.classList.add("hidden"));
document.addEventListener("keydown", e => e.key === "Escape" && modal.classList.add("hidden"));

function openDetail(show) {
  if (!navigator.onLine && !show.summary) {
    showMessage("Offline modda detay gösterilemiyor.");
    return;
  }

  modalBody.innerHTML = `
    <img src="${show.image?.original || show.image?.medium || ""}">
    <h2>${show.name}</h2>
    <p><strong>Puan:</strong> ${show.rating?.average ?? "N/A"}</p>
    <p><strong>Türler:</strong> ${show.genres?.join(", ") || "-"}</p>
    <p><strong>Dil:</strong> ${show.language || "-"}</p>
    <div>${show.summary || "Özet bulunamadı."}</div>
  `;

  modal.classList.remove("hidden");
}

/* =======================
   BAŞLAT
======================= */
updateOnlineStatus();
fetchShows();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .then(() => {
        console.log("Service Worker kayıtlı");
      })
      .catch((err) => {
        console.error("SW hata:", err);
      });
  });
}
