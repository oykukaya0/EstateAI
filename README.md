# 🏠 EstateAI

### İstanbul Konut Fiyat Tahmin Sistemi

EstateAI, İstanbul'daki konutların satış fiyatlarını makine öğrenmesi kullanarak tahmin eden, kullanıcı dostu bir web uygulamasıdır.

Kullanıcı; konum ve konut özelliklerini girerek tahmini satış fiyatını saniyeler içerisinde görüntüleyebilir.

---

## 🚀 Canlı Demo

🌐 **Web Uygulaması**

https://estate-ai-lake.vercel.app

---

## 🎯 Projenin Amacı

EstateAI'nin temel amacı, İstanbul konut piyasasındaki farklı değişkenleri kullanarak bir konutun tahmini satış fiyatını hesaplamaktır.

Sistem;

- 📍 İlçe
- 🏘️ Mahalle
- 📐 Brüt / Net m²
- 🛏️ Oda sayısı
- 🛋️ Salon sayısı
- 🛁 Banyo sayısı
- 🏢 Kat bilgileri
- 🏗️ Bina yaşı
- 🔥 Isıtma tipi
- 🏡 Site bilgisi
- 📄 Tapu durumu
- ve diğer konut özelliklerini

modelin girdileri olarak kullanır.

---

## 🤖 Makine Öğrenmesi

Projede regresyon problemi için **XGBoost** tabanlı bir makine öğrenmesi modeli kullanılmıştır.

Model performansı:

| Metrik | Değer |
|---|---:|
| R² | **75.46%** |
| MAE | **2.76 M TL** |
| RMSE | **7.95 M TL** |

> Model çıktısı gerçek satış fiyatı yerine referans niteliğinde bir tahmin olarak değerlendirilmelidir.

---

## 🧠 Açıklanabilir Yapay Zekâ

EstateAI yalnızca tahmin üretmekle kalmaz.

Modelin tahmin üzerindeki etkisini açıklamak için **SHAP (SHapley Additive exPlanations)** yaklaşımından yararlanılmıştır.

Bu sayede kullanıcılara:

- Hangi özelliklerin fiyatı artırdığı
- Hangi özelliklerin fiyatı düşürdüğü
- Özelliklerin tahmin üzerindeki göreceli etkileri

gibi bilgiler sunulabilir.

---

## 🏗️ Sistem Mimarisi

```text
                    ┌─────────────────────┐
                    │      Kullanıcı      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Vercel         │
                    └──────────┬──────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │       FastAPI       │
                    │       Render        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   XGBoost Model     │
                    │    + Feature Eng.   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Tahmini Konut     │
                    │      Fiyatı         │
                    └─────────────────────┘
