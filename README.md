# ApotekCare — UI Modern + Fixed

Customer UI telah dirombak ke tema lavender/pastel modern dengan sidebar kiri tetap. Navbar atas aplikasi dihilangkan; toolbar hanya dipakai untuk pencarian, keranjang, dan profil.

## Jalankan

### 1. XAMPP
Start **MySQL** di XAMPP, lalu buat database kosong bernama `apotekcare` melalui phpMyAdmin.

### 2. Cara otomatis (Windows)
Klik dua kali `JALANKAN-APOTEKCARE.bat`.

Script akan memasang dependency jika belum ada, menjalankan Prisma setup, membuka backend `http://localhost:5000`, frontend `http://localhost:5173`, lalu membuka browser.

### 3. Cara manual
Backend:
```powershell
cd "C:\Users\siti fatimah\Downloads\ApotekCare-UI-Modern-Fixed\backend"
npm install
npm run generate
npm run db:push
npm run seed
npm run dev
```

Frontend, di terminal kedua:
```powershell
cd "C:\Users\siti fatimah\Downloads\ApotekCare-UI-Modern-Fixed\frontend"
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Demo
- Admin: `admin@apotekcare.com` / `admin123`
- Customer: `customer@apotekcare.com` / `customer123`

## Catatan
Jangan menjalankan Docker. Project ini menggunakan MySQL/MariaDB dari XAMPP.
