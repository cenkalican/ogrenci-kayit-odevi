\# Öğrenci Kayıt Uygulaması



Node.js, Express ve MongoDB kullanılarak hazırlanmış öğrenci

kayıt uygulamasıdır.



\## Özellikler



\- Öğrenci ekleme

\- Öğrencileri listeleme

\- Öğrenci bilgilerini güncelleme

\- Öğrenci silme

\- Aynı öğrenci numarasıyla tekrar kayıt yapılmasını engelleme

\- Boş alan kontrolü

\- Silmeden önce kullanıcıdan onay alma



\## Kullanılan Teknolojiler



\- Node.js

\- Express

\- MongoDB ve resmi MongoDB Node.js sürücüsü

\- dotenv

\- HTML, CSS ve JavaScript



\## Gereksinimler



\- Node.js ve npm

\- Yerel bilgisayarda çalışan MongoDB Community Server



\## Kurulum ve Çalıştırma



1\. Projeyi indirin ve ZIP dosyasıysa klasöre çıkarın.

2\. Proje klasöründe terminal açın.

3\. Gerekli paketleri kurun:



```bash

npm install

```



4\. `.env.example` dosyasının bir kopyasını oluşturup

&#x20;  kopyanın adını `.env` olarak değiştirin.

5\. `.env` dosyasındaki MongoDB adresini kontrol edin.

&#x20;  Varsayılan adres: `mongodb://127.0.0.1:27017`

6\. MongoDB servisinin çalıştığından emin olun.

7\. Uygulamayı başlatın:



```bash

npm start

```



8\. Tarayıcıda şu adresi açın:



```text

http://localhost:3000

```



\## Veritabanı



\- Veritabanı adı: `ogrenci\_kayit\_db`

\- Koleksiyon adı: `ogrenciler`

\- Alanlar: `ad`, `soyad`, `numara`, `bolum`

\- Her kaydın MongoDB tarafından oluşturulan bir `\_id` değeri vardır.

\- `numara` alanında benzersiz indeks kullanılır.



\## API Adresleri



| Yöntem | Adres | İşlem |

|---|---|---|

| GET | /api/ogrenciler | Öğrencileri listeler |

| POST | /api/ogrenciler | Öğrenci ekler |

| PUT | /api/ogrenciler/:id | Öğrenci günceller |

| DELETE | /api/ogrenciler/:id | Öğrenci siler |



Ekleme ve güncelleme isteklerinde JSON biçiminde

`ad`, `soyad`, `numara` ve `bolum` alanları gönderilir.



\## Dosyalar



\- `server.js`: Sunucu, veritabanı bağlantısı ve API işlemleri.

\- `public/index.html`: Form, tablo, görünüm ve tarayıcı işlemleri.

\- `package.json`: Paket bilgileri ve başlatma komutu.

\- `package-lock.json`: Paket sürümlerinin kilit dosyası.

\- `.env.example`: Örnek bağlantı ayarları.

\- `.gitignore`: Git tarafından takip edilmeyecek dosyalar.



\## Not



Uygulama yerel bilgisayarda çalışacak şekilde hazırlanmıştır.

Kullanıcı girişi ve yetkilendirme içermez.

MongoDB içindeki öğrenci kayıtları GitHub deposuna dahil değildir.

