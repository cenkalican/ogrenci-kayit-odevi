// Gerekli paketleri alıyoruz.
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

// .env dosyasındaki ayarları okuyoruz.
require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const app = express();
const port = Number(process.env.PORT || 3000);

// Sayfadan gönderilen JSON verilerini okumamızı sağlar.
app.use(express.json({ limit: "10kb" }));

// Daha sonra hazırlayacağımız sayfayı bu klasörden sunar.
app.use(express.static(path.join(__dirname, "public")));

let ogrenciler;

// Gelen öğrenci bilgilerinin doğruluğunu kontrol eder.
function bilgileriKontrolEt(req, res, next) {
  const alanlar = ["ad", "soyad", "numara", "bolum"];
  const bilgi = {};

  for (const alan of alanlar) {
    const deger = req.body?.[alan];

    if (
      typeof deger !== "string" ||
      deger.trim().length === 0 ||
      deger.trim().length > 100
    ) {
      return res.status(400).json({
        hata: "Tüm alanları doldurun. Her alan en fazla 100 karakter olabilir.",
      });
    }

    bilgi[alan] = deger.trim();
  }

  req.ogrenciBilgisi = bilgi;
  next();
}

// Güncelleme ve silmede kullanılan kayıt kimliğini kontrol eder.
function kimligiKontrolEt(req, res, next) {
  if (!/^[a-fA-F0-9]{24}$/.test(req.params.id)) {
    return res.status(400).json({
      hata: "Geçersiz öğrenci kimliği.",
    });
  }

  req.ogrenciId = new ObjectId(req.params.id);
  next();
}

// 1. ÖĞRENCİLERİ LİSTELE
app.get("/api/ogrenciler", async (req, res, next) => {
  try {
    const liste = await ogrenciler
      .find({})
      .sort({ _id: -1 })
      .toArray();

    res.json(liste);
  } catch (hata) {
    next(hata);
  }
});

// 2. ÖĞRENCİ EKLE
app.post(
  "/api/ogrenciler",
  bilgileriKontrolEt,
  async (req, res, next) => {
    try {
      const sonuc = await ogrenciler.insertOne(req.ogrenciBilgisi);

      res.status(201).json({
        mesaj: "Öğrenci eklendi.",
        id: sonuc.insertedId,
      });
    } catch (hata) {
      next(hata);
    }
  }
);

// 3. ÖĞRENCİ GÜNCELLE
app.put(
  "/api/ogrenciler/:id",
  kimligiKontrolEt,
  bilgileriKontrolEt,
  async (req, res, next) => {
    try {
      const sonuc = await ogrenciler.updateOne(
        { _id: req.ogrenciId },
        { $set: req.ogrenciBilgisi }
      );

      if (sonuc.matchedCount === 0) {
        return res.status(404).json({
          hata: "Öğrenci bulunamadı.",
        });
      }

      res.json({ mesaj: "Öğrenci güncellendi." });
    } catch (hata) {
      next(hata);
    }
  }
);

// 4. ÖĞRENCİ SİL
app.delete(
  "/api/ogrenciler/:id",
  kimligiKontrolEt,
  async (req, res, next) => {
    try {
      const sonuc = await ogrenciler.deleteOne({
        _id: req.ogrenciId,
      });

      if (sonuc.deletedCount === 0) {
        return res.status(404).json({
          hata: "Öğrenci bulunamadı.",
        });
      }

      res.json({ mesaj: "Öğrenci silindi." });
    } catch (hata) {
      next(hata);
    }
  }
);

// Henüz arayüzü hazırlamadığımız için başlangıç mesajı gösterir.
app.get("/", (req, res) => {
  res.send("Öğrenci kayıt sunucusu çalışıyor.");
});

// İşlemlerde oluşabilecek hataları karşılar.
app.use((hata, req, res, next) => {
  console.error(hata.message);

  if (hata.code === 11000) {
    return res.status(409).json({
      hata: "Bu öğrenci numarası zaten kayıtlı.",
    });
  }

  if (hata.type === "entity.parse.failed") {
    return res.status(400).json({
      hata: "Gönderilen veri geçerli JSON değil.",
    });
  }

  if (hata.type === "entity.too.large") {
    return res.status(413).json({
      hata: "Gönderilen veri çok büyük.",
    });
  }

  res.status(500).json({
    hata: "İşlem sırasında sunucu hatası oluştu.",
  });
});

// Önce MongoDB'ye bağlanır, sonra sunucuyu başlatır.
async function baslat() {
  if (!process.env.MONGODB_URI) {
    throw new Error(".env dosyasında MONGODB_URI bulunamadı.");
  }

  const istemci = new MongoClient(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await istemci.connect();

    const veritabani = istemci.db("ogrenci_kayit_db");
    ogrenciler = veritabani.collection("ogrenciler");

    // Aynı öğrenci numarasının iki kez kaydedilmesini engeller.
    await ogrenciler.createIndex(
      { numara: 1 },
      { unique: true }
    );

    console.log("MongoDB bağlantısı başarılı.");

    const sunucu = app.listen(port, "127.0.0.1", () => {
      console.log(`Uygulama hazır: http://localhost:${port}`);
    });

    sunucu.on("error", async (hata) => {
      console.error("Sunucu başlatılamadı:", hata.message);
      await istemci.close();
      process.exitCode = 1;
    });
  } catch (hata) {
    await istemci.close();
    throw hata;
  }
}

baslat().catch((hata) => {
  console.error("Başlatma hatası:", hata.message);
  process.exitCode = 1;
});