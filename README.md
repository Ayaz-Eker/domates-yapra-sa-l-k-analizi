# 🍅 Domates Yaprak Sagligi Analiz Sistemi

Yapay zeka destekli görüntü isleme teknolojisi ile domates bitkilerinizdeki mantar hastaliklarini saniyeler içinde tespit edin.

## 🚀 Ozellikler

- **Gorsel Yukleme**: Surukle-birak veya tiklayarak gorsel yukleme
- **Saglik Skoru**: Dairesel progress bar ile 0-100 arası skor
- **Renk Analizi**: SVG donut chart ile yesil/kahverengi/sari/siyah dagilimi
- **Hastalik Tespiti**: Kulleme, Gec Yaniklik, Septoria gibi mantar hastaliklari
- **Tedavi Onerileri**: Sirke + Su karisimi, Neem yagi gibi dogal cozumler
- **Mobil Uyumlu**: Tamamen responsive tasarim

## 🛠️ Kurulum

### Gereksinimler
- Node.js 18+
- pnpm (veya npm)

### Mac'te Kurulum

```bash
# 1. Projeyi klonlayin
git clone https://github.com/KULLANICI_ADI/domates-yaprak-analiz.git
cd domates-yaprak-analiz

# 2. pnpm kur (yoksa)
npm install -g pnpm

# 3. Bagimliliklari yukle
pnpm install

# 4. Calistir
pnpm dev
```

### Windows/Linux'ta Kurulum

```bash
git clone https://github.com/KULLANICI_ADI/domates-yaprak-analiz.git
cd domates-yaprak-analiz
npm install
npm run dev
```

Tarayicida `http://localhost:5173` adresini acin.

## 📁 Proje Yapisi

```
├── src/
│   ├── App.tsx          # Ana bileşen
│   ├── App.css          # Stiller
│   ├── main.tsx         # Giris noktasi
│   └── index.css        # Tailwind CSS
├── index.html           # HTML sablonu
├── package.json         # Bagimliliklar
├── vite.config.ts       # Vite konfigurasyonu
└── tsconfig.json        # TypeScript konfigurasyonu
```

## 🎯 Kullanim

1. Domates yapraginin fotoğrafini yukleyin veya ornek gorsellerden birini secin
2. "Analiz Et" butonuna tiklayin
3. Sonuclari ve tedavi oneri lerini inceleyin

## 💻 Teknolojiler

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (Ikonlar)

## 📝 Not

Bu proje simulasyon amacli gelistirilmistir. Gercek gorsel isleme icin ek ML modelleri entegre edilmelidir.

