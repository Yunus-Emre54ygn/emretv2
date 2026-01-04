# 🍑 EmreTv – PWA Final Projesi

EmreTv, dizi, film ve çizgi film içeriklerini listeleyen; favori ekleme, arama ve **offline (çevrimdışı) çalışma** özelliklerine sahip bir web uygulamasıdır.  
Bu proje, **PWA (Progressive Web App)** mantığına uygun şekilde geliştirilmiştir.

---

## 🚀 Canlı Demo

🔗 https://KULLANICIADIN.github.io/emretv/

---

## 🛠 Kullanılan Teknolojiler

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- TVMaze API
- Service Worker
- Web App Manifest (PWA)
- LocalStorage

---

## ✨ Özellikler

### 📺 İçerik Listeleme
- TVMaze API üzerinden içerikler çekilir.
- Kart yapısı ile kullanıcıya sunulur.
- İçerik detayları modal pencere içinde gösterilir.

### 🔍 Arama
- Kullanıcı içerikler arasında arama yapabilir.
- Arama sonuçları cache’e alınır.
- Offline modda son arama sonuçları görüntülenebilir.

### ⭐ Favoriler
- İçerikler favorilere eklenebilir.
- Favoriler LocalStorage üzerinde saklanır.
- Favoriler ekranına geçiş yapılabilir.
- Favorilerden çıkarma işlemi desteklenir.

### 📡 Offline (Çevrimdışı) Çalışma
- Service Worker kullanılarak offline fallback mekanizması kurulmuştur.
- İnternet bağlantısı kesildiğinde:
  - Sayfa yenilendiğinde **offline.html** gösterilir.
  - Cache’te bulunan dosyalar çalışmaya devam eder.

### 📱 PWA Desteği
- Web App Manifest eklenmiştir.
- Uygulama ana ekrana eklenebilir.
- Özel ikonlar ve tema renkleri tanımlanmıştır.

---

## 📂 Proje Yapısı

emretv/
│
├─ index.html
├─ offline.html
├─ manifest.json
├─ service-worker.js
│
├─ css/
│     └─ style.css
│
├─ js/
│     └─ app.js
│
└─ assets/
      └─ icons/
      ├─ icon-192.png
      └─ icon-512.png

      
---

## 🧪 Offline Test Adımları

1. Canlı siteyi açın
2. Tarayıcıda DevTools → Application → Service Workers
3. Network sekmesinde **Offline** seçeneğini aktif edin
4. Sayfayı yenileyin

➡️ `offline.html` sayfası görüntülenir.

---

## 🎓 Proje Amacı

Bu proje ile:
- API kullanımı
- Dinamik DOM işlemleri
- LocalStorage yönetimi
- Service Worker ile offline çalışma
- PWA mimarisi

konularının uygulanması amaçlanmıştır.

---

## 👤 Geliştirici

**Yunus Emre YIĞIN**  
Karabük Üniversitesi – Front-End Software Developer

