const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // USERS
  const hashedAdmin = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@apotekcare.com' },
    update: {},
    create: { name: 'Admin ApotekCare', email: 'admin@apotekcare.com', password: hashedAdmin, role: 'admin' }
  });

  const hashedCustomer = await bcrypt.hash('customer123', 10);
  await prisma.user.upsert({
    where: { email: 'customer@apotekcare.com' },
    update: {},
    create: {
      name: 'Fatim Customer', email: 'customer@apotekcare.com',
      password: hashedCustomer, role: 'customer',
      phone: '081234567890', address: 'Jl. Merdeka No. 12, Jakarta Selatan'
    }
  });

  // CATEGORIES
  const categories = [
    { name: 'Obat', icon: '💊' },
    { name: 'Vitamin & Supplemen', icon: '🧴' },
    { name: 'Perawatan Pribadi', icon: '🧼' },
    { name: 'Alat Kesehatan', icon: '🩺' },
    { name: 'P3K', icon: '🩹' },
    { name: 'Ibu & Anak', icon: '👶' }
  ];
  for (let i = 0; i < categories.length; i++) {
    await prisma.category.upsert({ where: { id: i + 1 }, update: {}, create: categories[i] });
  }

  // PRODUCTS
      const products = [
    // ===== IBU & ANAK (cat 6) =====
    { name: 'Diaper Cream', price: 38000, stock: 60, categoryId: 6, unit: 'Tube • 50g', description: 'Krim ruam popok', image: '/images/Diaper Cream.png' },
    { name: 'Termometer Bayi', price: 65000, stock: 30, categoryId: 6, unit: 'Alat • 1 pcs', description: 'Termometer khusus bayi', image: '/images/Termometer Bayi.png' },
    { name: 'Vitamin Bayi Drop', price: 45000, stock: 50, categoryId: 6, unit: 'Botol • 30ml', description: 'Vitamin tetes bayi', image: '/images/Vitamin Bayi Drop.png' },
    { name: 'Bedak Bayi', price: 18000, stock: 90, categoryId: 6, unit: 'Botol • 100g', description: 'Bedak bayi', image: '/images/Bedak Bayi.png' },
    { name: 'Sampo Bayi', price: 32000, stock: 70, categoryId: 6, unit: 'Botol • 200ml', description: 'Sampo bayi no tears', image: '/images/Sampo Bayi.png' },
    { name: 'Sabun Bayi', price: 28000, stock: 80, categoryId: 6, unit: 'Botol • 200ml', description: 'Sabun bayi lembut', image: '/images/Sabun Bayi.png' },
    { name: 'Botol Susu Bayi', price: 55000, stock: 45, categoryId: 6, unit: 'Botol • 250ml', description: 'Botol susu anti kolik', image: '/images/Botol Susu Bayi.png' },
    { name: 'Susu Formula Bayi', price: 125000, stock: 30, categoryId: 6, unit: 'Kaleng • 400g', description: 'Susu formula 0-6 bulan', image: '/images/Susu Formula Bayi.png' },
    { name: 'Diapers Pampers M', price: 65000, stock: 40, categoryId: 6, unit: 'Pack • 20 pcs', description: 'Popok bayi ukuran M', image: '/images/Diapers Pampers M.png' },
    { name: 'Minyak Telon Bayi', price: 22000, stock: 60, categoryId: 6, unit: 'Botol • 60ml', description: 'Minyak telon hangat', image: '/images/Minyak Telon Bayi.png' },

    // ===== PSK (cat 5) =====
    { name: 'Gunting Perban', price: 30000, stock: 35, categoryId: 5, unit: 'Alat • 1 pcs', description: 'Gunting medis', image: '/images/Gunting Perban.png' },
    { name: 'Pinset Medis', price: 25000, stock: 40, categoryId: 5, unit: 'Alat • 1 pcs', description: 'Pinset stainless', image: '/images/Pinset Medis.png' },
    { name: 'Masker N95', price: 45000, stock: 50, categoryId: 5, unit: 'Masker • 10 pcs', description: 'Masker N95', image: '/images/Masker N95.png' },
    { name: 'Sarung Tangan Latex', price: 35000, stock: 60, categoryId: 5, unit: 'Box • 100 pcs', description: 'Sarung tangan medis', image: '/images/Sarung Tangan Latex.png' },
    { name: 'Alkohol Swab', price: 6000, stock: 200, categoryId: 5, unit: 'Box • 100 pcs', description: 'Kapas alkohol', image: '/images/Alkohol Swab.png' },
    { name: 'Kasa Steril', price: 8000, stock: 120, categoryId: 5, unit: 'Pack • 10 pcs', description: 'Kasa luka steril', image: '/images/Kasa Steril.png' },
    { name: 'Perban Elastis', price: 15000, stock: 80, categoryId: 5, unit: 'Perban • 1 roll', description: 'Perban elastis', image: '/images/Perban Elastis.png' },
    { name: 'Plester Hansaplast', price: 12000, stock: 150, categoryId: 5, unit: 'Plester • 20 pcs', description: 'Plester luka', image: '/images/Plester Hansaplast.png' },
    { name: 'Kotak P3K Lengkap', price: 75000, stock: 25, categoryId: 5, unit: 'P3K • 1 set', description: 'Paket pertolongan pertama', image: '/images/Kotak P3K Lengkap.png' },
    { name: 'Masker Medis 3 Ply', price: 25000, stock: 200, categoryId: 5, unit: 'Masker • 50 pcs', description: 'Masker medis 3 lapis', image: '/images/Masker Medis 3 Ply.png' },
    { name: 'Tongkat Bantu Jalan', price: 175000, stock: 15, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Tongkat penyangga', image: '/images/Tongkat Bantu Jalan.png' },
    { name: 'Tabung Oksigen Portable', price: 550000, stock: 6, categoryId: 4, unit: 'Alat • 1 set', description: 'Tabung oksigen kecil', image: '/images/Tabung Oksigen Portable.png' },

    // ===== ALAT KESEHATAN (cat 4) =====
    { name: 'Kursi Roda Lipat', price: 850000, stock: 5, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Kursi roda pasien', image: '/images/Kursi Roda Lipat.png' },
    { name: 'Glucometer', price: 320000, stock: 10, categoryId: 4, unit: 'Alat • 1 set', description: 'Alat cek gula darah', image: '/images/Glucometer.png' },
    { name: 'Timbangan Digital', price: 180000, stock: 18, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Timbangan berat badan', image: '/images/Timbangan Digital.png' },
    { name: 'Stetoskop', price: 150000, stock: 12, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Stetoskop dokter', image: '/images/Stetoskop.png' },
    { name: 'Nebulizer Portable', price: 350000, stock: 8, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Alat terapi uap', image: '/images/Nebulizer Portable.png' },
    { name: 'Oxymeter Fingertip', price: 120000, stock: 20, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Alat ukur saturasi oksigen', image: '/images/Oxymeter Fingertip.png' },
    { name: 'Tensimeter Digital', price: 250000, stock: 15, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Alat ukur tekanan darah', image: '/images/Tensimeter Digital.png' },
    { name: 'Termometer Digital', price: 45000, stock: 30, categoryId: 4, unit: 'Alat • 1 pcs', description: 'Termometer digital akurat', image: '/images/Termometer Digital.png' },

    // ===== PERAWATAN PRIBADI (cat 3) =====
    { name: 'Kapas Kecantikan', price: 8000, stock: 150, categoryId: 3, unit: 'Pack • 100 pcs', description: 'Kapas pembersih', image: '/images/Kapas Kecantikan.png' },
    { name: 'Tisu Basah Antiseptik', price: 15000, stock: 100, categoryId: 3, unit: 'Pack • 50 lembar', description: 'Tisu basah antibakteri', image: '/images/Tisu Basah Antiseptik.png' },
    { name: 'Sunscreen SPF 50', price: 65000, stock: 50, categoryId: 3, unit: 'Botol • 50ml', description: 'Tabir surya', image: '/images/Sunscreen SPF 50.png' },
    { name: 'Pembersih Wajah Cetaphil', price: 85000, stock: 35, categoryId: 3, unit: 'Botol • 125ml', description: 'Pembersih wajah sensitif', image: '/images/Pembersih Wajah Cetaphil.png' },
    { name: 'Deodorant Rexona', price: 22000, stock: 80, categoryId: 3, unit: 'Roll-on • 50ml', description: 'Deodoran anti keringat', image: '/images/Deodorant Rexona.png' },
    { name: 'Sabun Mandi Lifebuoy', price: 5000, stock: 200, categoryId: 3, unit: 'Batang • 85g', description: 'Sabun antibakteri', image: '/images/Sabun Mandi Lifebuoy.png' },
    { name: 'Shampo Head & Shoulders', price: 32000, stock: 60, categoryId: 3, unit: 'Cairan • 170ml', description: 'Shampo anti ketombe', image: '/images/Shampo Head & Shoulders.png' },
    { name: 'Pasta Gigi Sensodyne', price: 25000, stock: 70, categoryId: 3, unit: 'Pasta • 100g', description: 'Pasta gigi sensitif', image: '/images/Pasta Gigi Sensodyne.png' },
    { name: 'Sabun Cuci Tangan', price: 8000, stock: 120, categoryId: 3, unit: 'Cairan • 250ml', description: 'Sabun antibakteri', image: '/images/Sabun Cuci Tangan.png' },
    { name: 'Hand Sanitizer 100ml', price: 10000, stock: 100, categoryId: 3, unit: 'Cairan • 100ml', description: 'Pembersih tangan antibakteri', image: '/images/Hand Sanitizer 100ml.png' },

    // ===== VITAMIN & SUPPLEMEN (cat 2) =====
    { name: 'Habbatussauda Oil', price: 55000, stock: 40, categoryId: 2, unit: 'Botol • 60ml', description: 'Minyak jintan hitam', image: '/images/Habbatussauda Oil.png' },
    { name: 'Spirulina Tablet', price: 65000, stock: 35, categoryId: 2, unit: 'Tablet • 60 tablet', description: 'Suplemen alga', image: '/images/Spirulina Tablet.png' },
    { name: 'Propolis Liquid', price: 75000, stock: 30, categoryId: 2, unit: 'Botol • 30ml', description: 'Suplemen propolis', image: '/images/Propolis Liquid.png' },
    { name: 'Multivitamin Anak', price: 38000, stock: 45, categoryId: 2, unit: 'Sirup • 100ml', description: 'Vitamin anak', image: '/images/Multivitamin Anak.png' },
    { name: 'Collagen Drink', price: 85000, stock: 25, categoryId: 2, unit: 'Botol • 500ml', description: 'Minuman kolagen kulit', image: '/images/Collagen Drink.png' },
    { name: 'Zinc 20mg', price: 25000, stock: 50, categoryId: 2, unit: 'Tablet • 30 tablet', description: 'Suplemen imun tubuh', image: '/images/Zinc 20mg.png' },
    { name: 'Kalsium + Vitamin D', price: 40000, stock: 40, categoryId: 2, unit: 'Tablet • 30 tablet', description: 'Suplemen tulang', image: '/images/Kalsium + Vitamin D.png' },
    { name: 'Vitamin A 5000 IU', price: 20000, stock: 60, categoryId: 2, unit: 'Kapsul • 30 kapsul', description: 'Vitamin kesehatan mata', image: '/images/Vitamin A 5000 IU.png' },
    { name: 'Vitamin E 400 IU', price: 35000, stock: 55, categoryId: 2, unit: 'Softgel • 30 softgel', description: 'Vitamin antioksidan', image: '/images/Vitamin E 400 IU.png' },
    { name: 'B-Complex Tablet', price: 30000, stock: 50, categoryId: 2, unit: 'Tablet • 30 tablet', description: 'Vitamin B kompleks', image: '/images/B-Complex Tablet.png' },
    { name: 'Omega-3 Fish Oil', price: 55000, stock: 30, categoryId: 2, unit: 'Softgel • 60 softgel', description: 'Suplemen kesehatan jantung', image: '/images/Omega-3 Fish Oil.png' },
    { name: 'Sangobion Kapsul', price: 35000, stock: 40, categoryId: 2, unit: 'Kapsul • 30 kapsul', description: 'Suplemen penambah darah', image: '/images/Sangobion Kapsul.png' },
    { name: 'Vitamin D3 1000 IU', price: 25000, stock: 60, categoryId: 2, unit: 'Softgel • 30 softgel', description: 'Vitamin tulang & imun', image: '/images/Vitamin D3 1000 IU.png' },
    { name: 'Enervon-C Tablet', price: 45000, stock: 45, categoryId: 2, unit: 'Tablet • 30 tablet', description: 'Multivitamin penambah energi', image: '/images/Enervon-C Tablet.png' },
    { name: 'Vitamin C 1000mg', price: 12000, stock: 80, categoryId: 2, unit: 'Tablet • 10 tablet', description: 'Vitamin daya tahan tubuh', image: '/images/Vitamin C 1000mg.png' },

    // ===== OBAT (cat 1) =====
    { name: 'Diazepam 5mg', price: 15000, stock: 25, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat penenang (resep)', image: '/images/Diazepam 5mg.png' },
    { name: 'Loratadine 10mg', price: 8000, stock: 45, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat alergi non-drowsy', image: '/images/Loratadine 10mg.png' },
    { name: 'Salbutamol Inhaler', price: 55000, stock: 20, categoryId: 1, unit: 'Inhaler • 1 pcs', description: 'Obat asma', image: '/images/Salbutamol Inhaler.png' },
    { name: 'Simvastatin 20mg', price: 11000, stock: 40, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat kolesterol', image: '/images/Simvastatin 20mg.png' },
    { name: 'Amlodipine 5mg', price: 9000, stock: 50, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat hipertensi', image: '/images/Amlodipine 5mg.png' },
    { name: 'Metformin 500mg', price: 7000, stock: 55, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat diabetes', image: '/images/Metformin 500mg.png' },
    { name: 'Omeprazole 20mg', price: 12000, stock: 45, categoryId: 1, unit: 'Kapsul • 10 kapsul', description: 'Obat tukak lambung', image: '/images/Omeprazole 20mg.png' },
    { name: 'Ranitidine 150mg', price: 6500, stock: 50, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat asam lambung', image: '/images/Ranitidine 150mg.png' },
    { name: 'Dextromethorphan Sirup', price: 22000, stock: 40, categoryId: 1, unit: 'Sirup • 60ml', description: 'Obat batuk kering', image: '/images/Dextromethorphan Sirup.png' },
    { name: 'Ambroxol 30mg', price: 5500, stock: 70, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat batuk berdahak', image: '/images/Ambroxol 30mg.png' },
    { name: 'Tolak Angin Cair', price: 3500, stock: 120, categoryId: 1, unit: 'Sachet • 15ml', description: 'Obat masuk angin', image: '/images/Tolak Angin Cair.png' },
    { name: 'Promag Tablet', price: 7000, stock: 90, categoryId: 1, unit: 'Tablet • 12 tablet', description: 'Obat maag', image: '/images/Promag Tablet.png' },
    { name: 'Cetirizine 10mg', price: 6000, stock: 55, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat alergi', image: '/images/Cetirizine 10mg.png' },
    { name: 'Dexamethasone 0.5mg', price: 4000, stock: 60, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Anti inflamasi', image: '/images/Dexamethasone 0.5mg.png' },
    { name: 'Betadine Solution', price: 18000, stock: 40, categoryId: 1, unit: 'Cairan • 60ml', description: 'Antiseptik luka', image: '/images/Betadine Solution.png' },
    { name: 'OBH Combi Batuk Flu', price: 15000, stock: 50, categoryId: 1, unit: 'Sirup • 100ml', description: 'Obat batuk & flu', image: '/images/OBH Combi Batuk Flu.png' },
    { name: 'Antasida DOEN', price: 3500, stock: 70, categoryId: 1, unit: 'Tablet • 12 tablet', description: 'Obat sakit maag & lambung', image: '/images/Antasida DOEN.png' },
    { name: 'Ibuprofen 400mg', price: 5000, stock: 80, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Pereda nyeri & anti radang', image: '/images/Ibuprofen 400mg.png' },
    { name: 'Amoxicillin 500mg', price: 8000, stock: 60, categoryId: 1, unit: 'Kapsul • 10 kapsul', description: 'Antibiotik resep dokter', image: '/images/Amoxicillin 500mg.png' },
    { name: 'Paracetamol 500mg', price: 2500, stock: 100, categoryId: 1, unit: 'Tablet • 10 tablet', description: 'Obat penurun demam & pereda nyeri', image: '/images/Paracetamol 500mg.png' }
  ];

  for (const p of products) {
    const exists = await prisma.product.findFirst({ where: { name: p.name } });
    if (!exists) await prisma.product.create({ data: p });
  }

  console.log('✅ Seed berhasil! Total ' + products.length + ' produk.');
}

main().catch(console.error).finally(() => prisma.$disconnect());