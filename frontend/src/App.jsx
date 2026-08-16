import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Home,
  MapPin,
  Ruler,
  Building2,
  Flame,
  Wallet,
  Sparkles,
  Loader2,
  Search,
  ChevronDown,
  RotateCcw,
  Info,
  BarChart3,
  Gauge,
  ShieldCheck,
  X,
} from "lucide-react";

import "./App.css";

const API_URL = "https://estateai-u7h1.onrender.com";

// =====================================================
// OPTIONS
// =====================================================

const FLOOR_CATEGORIES = [
  { tr: "21 ve Üzeri", en: "21 and Above" },
  { tr: "Bodrum Kat", en: "Basement" },
  { tr: "Bodrum & Zemin", en: "Basement & Ground" },
  { tr: "Giriş Katı", en: "Entrance Floor" },
  { tr: "Bahçe Katı", en: "Garden Floor" },
  { tr: "Zemin Kat", en: "Ground Floor" },
  { tr: "Ara Kat", en: "Mid Floor" },
  { tr: "Çatı Katı", en: "Penthouse" },
  { tr: "Yüksek Giriş", en: "Raised Ground" },
  { tr: "Yarı Bodrum", en: "Semi-Basement" },
  { tr: "Bodrum -1", en: "Sub-level 1" },
  { tr: "Bodrum -2", en: "Sub-level 2" },
  { tr: "Bodrum -3", en: "Sub-level 3" },
  { tr: "Teras Kat", en: "Terrace Floor" },
  { tr: "En Üst Kat", en: "Top Floor" },
  { tr: "Villa Katı", en: "Villa Floor" },
];

const BUILDING_TYPES = [
  { tr: "Tuğla", en: "Brick" },
  { tr: "Kütük", en: "Log" },
  { tr: "Yığma", en: "Masonry" },
  { tr: "Betonarme", en: "Reinforced Concrete" },
  { tr: "Çelik", en: "Steel" },
  { tr: "Taş", en: "Stone" },
  { tr: "Ahşap", en: "Wooden" },
];

const BUILDING_CONDITIONS = [
  { tr: "Yeni", en: "New" },
  { tr: "İkinci El", en: "Second-hand" },
  { tr: "İnşaat Halinde", en: "Under Construction" },
];

const HEATING_TYPES = [
  { tr: "Klima", en: "Air Conditioning" },
  { tr: "Merkezi Sistem", en: "Central" },
  { tr: "Merkezi Sistem (Sayaçlı)", en: "Central (Metered)" },
  { tr: "Kombi", en: "Combi Boiler" },
  { tr: "Fan Coil Ünitesi", en: "Fan Coil Unit" },
  { tr: "Şömine", en: "Fireplace" },
  { tr: "Yerden Radyatör", en: "Floor Radiator" },
  { tr: "Doğalgaz Sobası", en: "Gas Stove" },
  { tr: "Isı Pompası", en: "Heat Pump" },
  { tr: "Isıtma Yok", en: "No Heating" },
  { tr: "Belirtilmemiş", en: "Not Specified" },
  { tr: "Güneş Enerjisi", en: "Solar" },
  { tr: "Soba", en: "Stove" },
  { tr: "Yerden Isıtma", en: "Underfloor Heating" },
  { tr: "VRV", en: "VRV" },
];

const FUEL_TYPES = [
  { tr: "Kömür-Odun", en: "Coal-Wood" },
  { tr: "Elektrik", en: "Electricity" },
  { tr: "Fuel Oil", en: "Fuel Oil" },
  { tr: "Doğalgaz", en: "Natural Gas" },
];

const USAGE_STATUS = [
  { tr: "Belirtilmemiş", en: "Not Specified" },
  { tr: "Ev Sahibi Oturuyor", en: "Owner-occupied" },
  { tr: "Kiracı Oturuyor", en: "Tenant-occupied" },
  { tr: "Boş", en: "Vacant" },
];

const ORIENTATION_RAW = [
  "East",
  "East, West",
  "Fourplex",
  "North",
  "North, East",
  "North, East, West",
  "North, South",
  "North, South, East",
  "North, South, East, West",
  "North, South, West",
  "North, West",
  "South",
  "South, East",
  "South, East, West",
  "South, West",
  "West",
];

const DIRECTION_TR = {
  North: "Kuzey",
  South: "Güney",
  East: "Doğu",
  West: "Batı",
  Fourplex: "Dört Cephe",
};

const ORIENTATIONS = ORIENTATION_RAW.map((en) => ({
  en,
  tr: en.split(", ").map((x) => DIRECTION_TR[x] || x).join(" - "),
}));

const DEED_STATUS = [
  { tr: "Kat Mülkiyeti", en: "Condominium Title" },
  { tr: "Kat İrtifakı", en: "Construction Easement" },
  { tr: "Kooperatif Hissesi", en: "Cooperative Share" },
  { tr: "Yabancı Sahipli", en: "Foreign Owner" },
  { tr: "Vakıf / Dernek", en: "Foundation/Association" },
  { tr: "Müstakil Tapu", en: "Freehold Title" },
  { tr: "Arsa Tapusu", en: "Land Title" },
  { tr: "Tapusuz", en: "No Title Deed" },
  { tr: "Hisseli Tapu", en: "Shared Title" },
  { tr: "İntifa Hakkı", en: "Usufruct Right" },
];

const DISTRICTS = [
  "Adalar",
  "Arnavutköy",
  "Ataşehir",
  "Avcılar",
  "Bahçelievler",
  "Bakırköy",
  "Bayrampaşa",
  "Bağcılar",
  "Başakşehir",
  "Beykoz",
  "Beylikdüzü",
  "Beyoğlu",
  "Beşiktaş",
  "Büyükçekmece",
  "Esenler",
  "Esenyurt",
  "Eyüpsultan",
  "Fatih",
  "Gaziosmanpaşa",
  "Güngören",
  "Kadıköy",
  "Kartal",
  "Kağıthane",
  "Küçükçekmece",
  "Maltepe",
  "Pendik",
  "Sancaktepe",
  "Sarıyer",
  "Silivri",
  "Sultanbeyli",
  "Sultangazi",
  "Tuzla",
  "Zeytinburnu",
  "Çatalca",
  "Çekmeköy",
  "Ümraniye",
  "Üsküdar",
  "Şişli",
];

// =====================================================
// HELPERS
// =====================================================

function formatPrice(value) {
  return `₺${Math.round(value).toLocaleString("tr-TR")}`;
}

function compactNumber(value) {
  const n = Math.abs(value);

  if (n >= 1_000_000) {
    return `${(value / 1_000_000)
      .toFixed(2)
      .replace(".", ",")}M`;
  }

  if (n >= 1_000) {
    return `${Math.round(value / 1_000)}K`;
  }

  return String(Math.round(value));
}

async function requestPrediction(payload) {
  const response = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let message = "Tahmin alınamadı.";

    try {
      const data = await response.json();

      if (data?.detail) {
        message =
          typeof data.detail === "string"
            ? data.detail
            : "Girilen bilgiler geçersiz.";
      }
    } catch {
      // default error
    }

    throw new Error(message);
  }

  return response.json();
}

// =====================================================
// SECTION CARD
// =====================================================

function SectionCard({
  index,
  title,
  icon,
  accent = "sky",
  children,
}) {
  return (
    <section className={`section-card section-${accent}`}>
      <div className="section-accent-bar" />

      <div className="section-header">
        <div className="section-icon">{icon}</div>

        <div>
          <div className="section-index">{index}</div>
          <h3>{title}</h3>
        </div>
      </div>

      <div className="section-content">{children}</div>
    </section>
  );
}

// =====================================================
// FIELD
// =====================================================

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>

      {children}

      {error && (
        <span className="field-error">
          <Info size={12} />
          {error}
        </span>
      )}
    </label>
  );
}

// =====================================================
// INPUT
// =====================================================

function TextInput({
  value,
  onChange,
  placeholder,
  suffix,
  error,
}) {
  return (
    <div className="input-wrapper">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`form-input ${
          error ? "input-error" : ""
        } ${suffix ? "has-suffix" : ""}`}
      />

      {suffix && (
        <span className="input-suffix">{suffix}</span>
      )}
    </div>
  );
}

// =====================================================
// SELECT
// =====================================================

function Select({
  value,
  onChange,
  options,
  placeholder = "Seçin",
  error,
}) {
  return (
    <div className="select-wrapper">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`form-input select-input ${
          error ? "input-error" : ""
        }`}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option.en} value={option.en}>
            {option.tr}
          </option>
        ))}
      </select>

      <ChevronDown className="select-icon" size={16} />
    </div>
  );
}

// =====================================================
// SEARCH SELECT
// =====================================================

function SearchSelect({
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
}) {
  return (
    <div className="search-select">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`search-select-button ${
          error ? "input-error" : ""
        }`}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={17}
        className="search-select-chevron"
      />
    </div>
  );
}

// =====================================================
// TOGGLE
// =====================================================

function Toggle({
  label,
  hint,
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      className={`toggle-card ${
        checked ? "toggle-active" : ""
      }`}
      onClick={() => onChange(!checked)}
    >
      <span>
        <span className="toggle-label">{label}</span>

        {hint && (
          <span className="toggle-hint">{hint}</span>
        )}
      </span>

      <span
        className={`toggle-switch ${
          checked ? "toggle-switch-active" : ""
        }`}
      >
        <span className="toggle-dot" />
      </span>
    </button>
  );
}

// =====================================================
// SHAP BAR
// =====================================================

function ShapBar({ feature, impact, max }) {
  const positive = impact >= 0;

  const width = Math.max(
    6,
    (Math.abs(impact) / max) * 100
  );

  return (
    <div className="shap-row">
      <span
        className="shap-feature"
        title={feature}
      >
        {feature}
      </span>

      <div className="shap-track">
        <div
          className={`shap-bar ${
            positive ? "shap-positive" : "shap-negative"
          }`}
          style={{
            width: `${width / 2}%`,
            left: positive
              ? "50%"
              : `${50 - width / 2}%`,
          }}
        />

        <div className="shap-center" />
      </div>

      <span
        className={`shap-value ${
          positive ? "positive" : "negative"
        }`}
      >
        {positive ? "+" : "-"}₺
        {compactNumber(Math.abs(impact))}
      </span>
    </div>
  );
}

// =====================================================
// APP
// =====================================================

export default function App() {
  const [form, setForm] = useState({
    district: "",
    neighborhood: "",

    gross_sqm: "",
    net_sqm: "",

    rooms: "",
    halls: "",
    bathroom_count: "",

    floor: "",
    total_floors: "",
    building_age: "",

    floor_category: "",
    building_type: "",
    building_condition: "",

    heating_type: "",
    fuel_type: "",
    orientation: "",
    usage_status: "",

    maintenance_fee: "",

    credit_eligible: false,
    deed_status: "",
    exchange: false,

    furnished: false,
    is_in_complex: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [neighborhoods, setNeighborhoods] =
    useState([]);
  

  const [locationLoading, setLocationLoading] =
    useState(false);

  // ===================================================
  // SET FIELD
  // ===================================================

  function setField(key) {
    return (value) => {
      setForm((prev) => ({
        ...prev,
        [key]: value,

        ...(key === "district"
          ? { neighborhood: "" }
          : {}),
      }));

      setErrors((prev) => ({
        ...prev,
        [key]: undefined,
        submit: undefined,
      }));
    };
  }

  // ===================================================
  // LOAD NEIGHBORHOODS
  // ===================================================

  useEffect(() => {
    if (!form.district) {
      setNeighborhoods([]);
      return;
    }

    async function loadNeighborhoods() {
      try {
        setLocationLoading(true);

        const response = await fetch(
          `${API_URL}/neighborhoods/${encodeURIComponent(
            form.district
          )}`
        );

        if (!response.ok) {
          throw new Error(
            "Mahalleler alınamadı."
          );
        }

        const data = await response.json();

        setNeighborhoods(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(error);
        setNeighborhoods([]);
      } finally {
        setLocationLoading(false);
      }
    }

    loadNeighborhoods();
  }, [form.district]);

  // ===================================================
  // VALIDATION
  // ===================================================

  function validate() {
    const nextErrors = {};

    if (!form.district) {
      nextErrors.district = "Lütfen ilçe seçin.";
    }

    if (!form.neighborhood) {
      nextErrors.neighborhood =
        "Lütfen mahalle seçin.";
    }

    if (
      !form.gross_sqm ||
      Number(form.gross_sqm) <= 0
    ) {
      nextErrors.gross_sqm =
        "Brüt m² pozitif olmalı.";
    }

    if (
      !form.net_sqm ||
      Number(form.net_sqm) <= 0
    ) {
      nextErrors.net_sqm =
        "Net m² pozitif olmalı.";
    }

    if (
      form.gross_sqm &&
      form.net_sqm &&
      Number(form.net_sqm) >
        Number(form.gross_sqm)
    ) {
      nextErrors.net_sqm =
        "Net m², brüt m²'den büyük olamaz.";
    }

    if (
      form.rooms === "" ||
      Number(form.rooms) < 0
    ) {
      nextErrors.rooms =
        "Geçerli bir değer girin.";
    }

    if (
      form.halls === "" ||
      Number(form.halls) < 0
    ) {
      nextErrors.halls =
        "Geçerli bir değer girin.";
    }

    if (
      form.bathroom_count === "" ||
      Number(form.bathroom_count) < 0
    ) {
      nextErrors.bathroom_count =
        "Geçerli bir değer girin.";
    }

    if (
      form.total_floors === "" ||
      Number(form.total_floors) <= 0
    ) {
      nextErrors.total_floors =
        "Toplam kat pozitif olmalı.";
    }

    if (
      form.building_age === "" ||
      Number(form.building_age) < 0
    ) {
      nextErrors.building_age =
        "Geçerli bir bina yaşı girin.";
    }

    if (
      form.maintenance_fee !== "" &&
      Number(form.maintenance_fee) < 0
    ) {
      nextErrors.maintenance_fee =
        "Aidat negatif olamaz.";
    }

    return nextErrors;
  }

  // ===================================================
  // SUBMIT
  // ===================================================

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();

    setErrors(validationErrors);

    if (
      Object.keys(validationErrors).length > 0
    ) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const payload = {
        district: form.district,
        neighborhood: form.neighborhood,

        rooms: Number(form.rooms),
        halls: Number(form.halls),

        gross_sqm: Number(form.gross_sqm),
        net_sqm: Number(form.net_sqm),

        floor: Number(form.floor) || 0,
        floor_category: form.floor_category,
        total_floors: Number(form.total_floors),

        building_age: Number(form.building_age),
        building_type: form.building_type,
        building_condition:
          form.building_condition,

        heating_type: form.heating_type,
        fuel_type: form.fuel_type,

        bathroom_count:
          Number(form.bathroom_count),

        furnished: form.furnished,
        usage_status: form.usage_status,

        is_in_complex: form.is_in_complex,

        orientation: form.orientation,

        maintenance_fee:
          Number(form.maintenance_fee) || 0,

        credit_eligible:
          form.credit_eligible,

        deed_status: form.deed_status,
        exchange: form.exchange,
      };

      const response =
        await requestPrediction(payload);

      setResult(response);
    } catch (error) {
      console.error(
        "Tahmin hatası:",
        error
      );

      setErrors({
        submit:
          error.message ||
          "Tahmin alınamadı. Backend bağlantısını kontrol edin.",
      });
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // RESET
  // ===================================================

  function resetResult() {
    setResult(null);
    setErrors({});
  }

  // ===================================================
  // SHAP MAX
  // ===================================================

  const maxImpact = useMemo(() => {
    if (
      !result?.explanation ||
      result.explanation.length === 0
    ) {
      return 1;
    }

    return Math.max(
      ...result.explanation.map((item) =>
        Math.abs(item.impact)
      )
    );
  }, [result]);

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="app">
      {/* ============================================
          HEADER
      ============================================ */}

      <header className="top-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-logo">
              <Home size={19} />
            </div>

            <div>
              <div className="brand-name">
                EstateAI
              </div>

              <div className="brand-subtitle">
                İstanbul Konut Fiyat Tahmin Sistemi
              </div>
            </div>
          </div>

          <div className="header-badge">
            <Sparkles size={13} />
            XGBoost destekli
          </div>
        </div>
      </header>

      {/* ============================================
          HERO
      ============================================ */}

      <section className="hero">
        <div className="hero-grid" />

        <div className="hero-inner">
          <h1>
            Konut bilgilerini gir,{" "}
            <span>
              yapay zekâ
            </span>{" "}
            tahmini satış fiyatını hesaplasın
          </h1>

          <p>
            Sonuç, tahmini etkileyen faktörlerle
            birlikte açıklamalı olarak sunulur.
          </p>

          <div className="hero-tags">
            <span>R² 75,46%</span>
            <span>33 özellik</span>
            <span>SHAP açıklamalı</span>
          </div>
        </div>
      </section>

      {/* ============================================
          MAIN
      ============================================ */}

      <main className="main-layout">
        {/* ==========================================
            FORM
        ========================================== */}

        <form
          className="form-column"
          onSubmit={handleSubmit}
        >
          {/* KONUM */}

          <SectionCard
            index="01 — KONUM"
            title="Konum"
            accent="sky"
            icon={<MapPin size={17} />}
          >
            <Field
              label="İlçe"
              error={errors.district}
            >
              <SearchSelect
                value={form.district}
                onChange={setField("district")}
                options={DISTRICTS}
                placeholder="İlçe seçin"
                error={errors.district}
              />
            </Field>

            <Field
              label="Mahalle"
              error={errors.neighborhood}
            >
              <SearchSelect
                value={form.neighborhood}
                onChange={setField("neighborhood")}
                options={neighborhoods}
                placeholder={
                  locationLoading
                    ? "Mahalleler yükleniyor..."
                    : form.district
                    ? "Mahalle ara..."
                    : "Önce ilçe seçin"
                }
                error={errors.neighborhood}
                disabled={
                  !form.district ||
                  locationLoading
                }
              />
            </Field>
          </SectionCard>

          {/* KONUT */}

          <SectionCard
            index="02 — KONUT ÖZELLİKLERİ"
            title="Konut Özellikleri"
            accent="teal"
            icon={<Ruler size={17} />}
          >
            <Field
              label="Brüt m²"
              error={errors.gross_sqm}
            >
              <TextInput
                value={form.gross_sqm}
                onChange={setField("gross_sqm")}
                placeholder="120"
                suffix="m²"
                error={errors.gross_sqm}
              />
            </Field>

            <Field
              label="Net m²"
              error={errors.net_sqm}
            >
              <TextInput
                value={form.net_sqm}
                onChange={setField("net_sqm")}
                placeholder="100"
                suffix="m²"
                error={errors.net_sqm}
              />
            </Field>

            <Field
              label="Oda Sayısı"
              error={errors.rooms}
            >
              <TextInput
                value={form.rooms}
                onChange={setField("rooms")}
                placeholder="3"
                error={errors.rooms}
              />
            </Field>

            <Field
              label="Salon Sayısı"
              error={errors.halls}
            >
              <TextInput
                value={form.halls}
                onChange={setField("halls")}
                placeholder="1"
                error={errors.halls}
              />
            </Field>

            <Field
              label="Banyo Sayısı"
              error={errors.bathroom_count}
            >
              <TextInput
                value={form.bathroom_count}
                onChange={setField(
                  "bathroom_count"
                )}
                placeholder="1"
                error={errors.bathroom_count}
              />
            </Field>
          </SectionCard>

          {/* BİNA */}

          <SectionCard
            index="03 — BİNA BİLGİLERİ"
            title="Bina Bilgileri"
            accent="amber"
            icon={<Building2 size={17} />}
          >
            <Field
              label="Bulunduğu Kat"
              error={errors.floor}
            >
              <TextInput
                value={form.floor}
                onChange={setField("floor")}
                placeholder="3"
                error={errors.floor}
              />
            </Field>

            <Field
              label="Toplam Kat"
              error={errors.total_floors}
            >
              <TextInput
                value={form.total_floors}
                onChange={setField(
                  "total_floors"
                )}
                placeholder="10"
                error={errors.total_floors}
              />
            </Field>

            <Field
              label="Bina Yaşı"
              error={errors.building_age}
            >
              <TextInput
                value={form.building_age}
                onChange={setField(
                  "building_age"
                )}
                placeholder="5"
                suffix="yıl"
                error={errors.building_age}
              />
            </Field>

            <Field label="Kat Kategorisi">
              <Select
                value={form.floor_category}
                onChange={setField(
                  "floor_category"
                )}
                options={FLOOR_CATEGORIES}
              />
            </Field>

            <Field label="Bina Tipi">
              <Select
                value={form.building_type}
                onChange={setField(
                  "building_type"
                )}
                options={BUILDING_TYPES}
              />
            </Field>

            <Field label="Bina Durumu">
              <Select
                value={form.building_condition}
                onChange={setField(
                  "building_condition"
                )}
                options={BUILDING_CONDITIONS}
              />
            </Field>
          </SectionCard>

          {/* ISITMA */}

          <SectionCard
            index="04 — ISITMA VE KONFOR"
            title="Isıtma ve Konfor"
            accent="violet"
            icon={<Flame size={17} />}
          >
            <Field label="Isıtma Tipi">
              <Select
                value={form.heating_type}
                onChange={setField(
                  "heating_type"
                )}
                options={HEATING_TYPES}
              />
            </Field>

            <Field label="Yakıt Tipi">
              <Select
                value={form.fuel_type}
                onChange={setField("fuel_type")}
                options={FUEL_TYPES}
              />
            </Field>

            <Field label="Cephe / Yön">
              <Select
                value={form.orientation}
                onChange={setField(
                  "orientation"
                )}
                options={ORIENTATIONS}
              />
            </Field>

            <Field label="Kullanım Durumu">
              <Select
                value={form.usage_status}
                onChange={setField(
                  "usage_status"
                )}
                options={USAGE_STATUS}
              />
            </Field>
          </SectionCard>

          {/* FİNANSAL */}

          <SectionCard
            index="05 — FİNANSAL / HUKUKİ"
            title="Finansal / Hukuki"
            accent="emerald"
            icon={<Wallet size={17} />}
          >
            <Field
              label="Aylık Aidat"
              error={errors.maintenance_fee}
            >
              <TextInput
                value={form.maintenance_fee}
                onChange={setField(
                  "maintenance_fee"
                )}
                placeholder="500"
                suffix="₺"
                error={errors.maintenance_fee}
              />
            </Field>

            <Field label="Tapu Durumu">
              <Select
                value={form.deed_status}
                onChange={setField(
                  "deed_status"
                )}
                options={DEED_STATUS}
              />
            </Field>

            <Toggle
              label="Krediye Uygun"
              checked={form.credit_eligible}
              onChange={setField(
                "credit_eligible"
              )}
            />

            <Toggle
              label="Takas Yapılabilir"
              checked={form.exchange}
              onChange={setField("exchange")}
            />
          </SectionCard>

          {/* EK */}

          <SectionCard
            index="06 — EK ÖZELLİKLER"
            title="Ek Özellikler"
            accent="rose"
            icon={<Sparkles size={17} />}
          >
            <Toggle
              label="Eşyalı"
              checked={form.furnished}
              onChange={setField("furnished")}
            />

            <Toggle
              label="Site İçinde"
              checked={form.is_in_complex}
              onChange={setField(
                "is_in_complex"
              )}
            />
          </SectionCard>

          {/* ERROR */}

          {errors.submit && (
            <div className="submit-error">
              <Info size={16} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="predict-button"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="spin"
                />
                Model analiz ediyor...
              </>
            ) : (
              <>
                <Sparkles size={17} />
                Tahmini Hesapla
              </>
            )}
          </button>
        </form>

        {/* ==========================================
            SIDEBAR
        ========================================== */}

        <aside className="sidebar">
          {/* RESULT */}

          <div className="result-card">
            {!result && !loading && (
              <div className="empty-result">
                <div className="empty-result-icon">
                  <Home size={26} />
                </div>

                <p>Henüz tahmin yapılmadı</p>

                <span>
                  Konut bilgilerini girerek
                  AI tahminini başlatın.
                </span>
              </div>
            )}

            {loading && (
              <div className="loading-result">
                <Loader2
                  size={34}
                  className="loading-icon spin"
                />

                <p>
                  Konut özellikleri
                  analiz ediliyor...
                </p>

                <span>
                  XGBoost modeli çalışıyor
                </span>
              </div>
            )}

            {result && !loading && (
              <div className="prediction-result">
                <div className="result-top">
                  <span>TAHMİN SONUCU</span>

                  <button
                    type="button"
                    onClick={resetResult}
                    className="close-result"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="price-wrapper">
                  <div className="price-glow" />

                  <div className="prediction-price">
                    {formatPrice(
                      result.prediction
                    )}
                  </div>
                </div>

                <div className="result-badges">
                  <span className="badge-indigo">
                    Tahmini
                  </span>

                  <span className="badge-gray">
                    XGBoost
                  </span>

                  <span className="badge-green">
                    Gerçek Model
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* MODEL INFO */}

          <div className="model-card">
            <div className="model-card-title">
              <Gauge size={16} />
              <span>Model Bilgisi</span>
            </div>

            <div className="model-stats">
              <div className="model-stat">
                <strong>75,46%</strong>
                <span>R²</span>
              </div>

              <div className="model-stat">
                <strong>₺2,76M</strong>
                <span>MAE</span>
              </div>

              <div className="model-stat">
                <strong>₺7,95M</strong>
                <span>RMSE</span>
              </div>
            </div>
          </div>

          {/* SHAP */}

          {result?.explanation?.length > 0 && (
            <div className="shap-card">
              <div className="shap-title">
                <BarChart3 size={16} />
                <span>
                  Fiyatı Etkileyen Faktörler
                </span>
              </div>

              <p className="shap-description">
                SHAP değerlerine göre; yeşil
                yukarı, kırmızı aşağı çeker.
              </p>

              <div className="shap-list">
                {result.explanation.map(
                  (item, index) => (
                    <ShapBar
                      key={`${item.feature}-${index}`}
                      feature={item.feature}
                      impact={item.impact}
                      max={maxImpact}
                    />
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  resetResult();

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="new-prediction-button"
              >
                <RotateCcw size={14} />
                Yeni Tahmin
              </button>
            </div>
          )}

          <div className="disclaimer">
            <ShieldCheck size={14} />

            <span>
              Tahminler XGBoost regresyon modeli
              ile üretilir; kesin değer yerine
              referans olarak kullanılmalıdır.
            </span>
          </div>
        </aside>
      </main>
    </div>
  );
}