// 🎯 DROPDOWN_DATA - Scentralizowana baza materiałów (Czysta wersja)
// Źródło: Twoje pliki CSV + struktura logiczna (Płyty + MDF/Fornir/HPL)

// 1. BAZA PŁYT LAMINOWANYCH (Pełna lista dekorów - bez zbędnych opisów)
const PLYTY_LAMINOWANE = [
    // --- BIELE I UNI ---
    { "nazwa": "W1000 Biały Premium", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "W1100 Biały Alpejski", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "W980 Biały Platynowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "101 Biała / Biały Frontowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "110 Biały Korpusowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "514 Kość Słoniowa / Ivory", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "8100 Perłowa Biel", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "8681 Biały / Biały Brylantowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "8685 Biel Alpejska / Snow White", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "HB0090 Śnieżna Biel", "cena": 0, "opis": "", "kategoria": "laminowane" },

    // --- SZAROŚCI I CZERŃ ---
    { "nazwa": "U201 Szary Kamyk", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U702 Szary Kaszmirowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U705 Szary Angora", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U708 Szary Jasny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U732 Szary Przykurzony", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U750 Szary Taupe", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U763 Szary Perłowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U767 Szary Cubanit", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U960 Szary Onyks", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U961 Szary Grafitowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U968 Szary Karbon", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U999 Czarny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "112 Jasny Szary / Stone Grey", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "162 Grafit Szary", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "164 Antracyt", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "171 Jasny Grafit / Slate Grey", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "191 Szary / Cool Grey", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "197 Szary Chinchilla", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "540 Szary / Manhattan Grey", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "1700 Stalowo-szary", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "6299 Kobalt Szary", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "7045 Satynowy / Satin", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "5981 Kaszmir", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K096 Glina Szara / Clay Grey", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U540 Szary Kamienny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U190 Czarny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU1002 Głęboka Czerń", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU1220 Szary Neutralny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU1213 Szary Pallad", "cena": 0, "opis": "", "kategoria": "laminowane" },

    // --- KOLORY ---
    { "nazwa": "U565 Błękit Oceaniczny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U599 Błękit Indygo", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U636 Zieleń Fiord", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U608 Zieleń Pistacjowa", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U638 Zieleń Szałwiowa", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U604 Zieleń Trzcinowa", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U665 Zieleń Kamienna", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U640 Zieleń Oliwkowa", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U645 Zieleń Agawy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U699 Zieleń Jodłowa", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U399 Czerwień Granatu", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U114 Żółty Brylantowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U131 Żółty Cytrusowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U163 Żółty Curry", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U332 Pomarańczowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U350 Siena Brązowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "125 Niebieska", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "132 Pomarańczowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "134 Żółty / Sunshine", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "244 Petrol", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "7113 Czerwień Chilli", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "7190 Zieleń Mamba", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "8984 Granatowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K097 Błękitny Zmierzch / Dusk Blue", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K512 Róż Naturalny / Native Pink", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K515 Pikantna Czerwień / Spice Red", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K518 Surf Blue", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K513 Marshmallow", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K514 Deep Sahara", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K516 Toffee", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K517 Azure Blue", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K519 Mouse Grey", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K520 Dark Emerald", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K521 Smoke Green", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2200 Zieleń Zen", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2203 Mięta", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2003 Błękit Krystaliczny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2007 Błękit Nieba", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2802 Śliwka", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2603 Rose", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2602 Mimosa", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU1505 Cuba Libre", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU1511 Piaskowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU2601 Puder", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU1502 Beż", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PU1506 Kaszmirowy Beż", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U10030 Aloesowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U10040 Atramentowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U10020 Ceglana Czerwień", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U4446 Pudrowy Róż", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "U6933 Kaszmirowy", "cena": 0, "opis": "", "kategoria": "laminowane" },

    // --- DREWNOPODOBNE ---
    { "nazwa": "H3041 Eukaliptus Naturalny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1228 Jesion Abano Antracytowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1227 Jesion Abano Brązowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1176 Dąb Halifax Bielony", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1180 Dąb Halifax Naturalny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1367 Dąb Casella Jasny Naturalny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1181 Dąb Halifax Tabak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1385 Dąb Casella Naturalny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H3409 Modrzew Górski Naturalny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H3408 Modrzew Górski Termo Brązowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1384 Dąb Casella Biały", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1386 Dąb Casella Brązowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H3359 Dąb Davenport Jasny Naturalny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H3326 Dąb Gladstone Szarobeżowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H3311 Dąb Cuneo Bielony", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H3309 Dąb Gladstone Piaskowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H3317 Dąb Cuneo Brązowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "H1344 Dąb Sherman Koniakowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K527 Biscotti Hudson Oak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K528 Cashmere Hudson Oak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K529 Gold Hudson Oak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K530 Amaretto Hudson Oak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K531 Stone Arvadonna Chestnut", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K532 Flamed Arvadonna Chestnut", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K533 Mink Arvadonna Chestnut", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K534 Charcoal Arvadonna Chestnut", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K554 Chocolate Hudson Oak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K085 Dąb White", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K350 Dąb Castello Coffee", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K358 Dąb Castello Miodowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K544 Hazel Silverjack Oak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K545 Vintage Silverjack Oak", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K546 Caramel Franklin Walnut", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K547 Tobacco Franklin Walnut", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K553 Galaxus", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20571 Cherry Gold", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20734 Dąb Zimowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20551 Dąb Letni Złoty", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D60654 Dąb Fornir", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20754 Dąb Nastrojowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20764 Orzech Kameralny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20140 Dąb Liryczny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20150 Orzech Klasyczny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20130 Kasztan Spokojny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D20230 Dąb Letni", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D4225 Dąb Artisan", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D3025 Dąb Sonoma", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3101 Dąb Carpenter Whisky", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3102 Dąb Baltic Dune", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3103 Dąb Baltic Ice", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3104 Dąb Baltic Storm", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3100 Dąb Carpenter Coffee", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3097 Dąb Lumberjack Smoke", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3098 Dąb Lumberjack Sand", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3099 Dąb Lumberjack Frost", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3095 Dąb Windmill Dark", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3094 Dąb Windmill Gold", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3096 Dąb Windmill Pale", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3000 Dąb Sonoma", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3023 Dąb Lancelot", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3033 Dąb Wotan II", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD3016 Dąb Artisan II", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD7003 Buk Scandi", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PD7085 Jodełka Scandi", "cena": 0, "opis": "", "kategoria": "laminowane" },

    // --- KAMIENIE I MATERIAŁY ---
    { "nazwa": "K522 Aluminium", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "K523 Platinium Disk", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "AL01 Brushed Aluminium", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "AL04 Brushed Gold", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "AL08 Brushed Titan", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D1038 Beton Millenium", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D30090 Beton Szary", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D30220 Kwarcyt Szary", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D4448 Marmur Crema", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D70060 Terrazzo Fresco", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D30080 Filc Szary", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D30100 Len Kremowy", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D70070 Tkane Kwiaty", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "D4452 Tytan Srebrny", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "PK9050 Metropolis", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "HK9002 Beton", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "HF8012 Rdzawa Stal", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "HF8026 Dark Canvas", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "HF8968 Textil Szary", "cena": 0, "opis": "", "kategoria": "laminowane" },
    { "nazwa": "HF8970 Textil Beżowy", "cena": 0, "opis": "", "kategoria": "laminowane" }
];

// 2. BAZA DODATKOWYCH MATERIAŁÓW (MDF, Forniry, HPL)
const PLYTY_SPECJALNE = [
    { "nazwa": "MDF 18mm 2x B", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "MDF 18mm Surowy", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "MDF 10mm 2x B", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "MDF 10mm Surowy", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "MDF 6mm Surowy", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "MDF 18mm Frezowany", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "MDF 18mm Ryflowany", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "MDF 18mm Zaoblony", "cena": 0, "opis": "MDF", "kategoria": "mdf" },
    { "nazwa": "Fornir Dębowy Prosty", "cena": 0, "opis": "FORNIR", "kategoria": "fornir" },
    { "nazwa": "Fornir Dębowy Zaoblony", "cena": 0, "opis": "FORNIR", "kategoria": "fornir" },
    { "nazwa": "Fornir Orzech Prosty", "cena": 0, "opis": "FORNIR", "kategoria": "fornir" },
    { "nazwa": "Fornir Orzech Zaoblony", "cena": 0, "opis": "FORNIR", "kategoria": "fornir" },
    { "nazwa": "Laminat HPL 0,8mm", "cena": 0, "opis": "HPL", "kategoria": "hpl" },
    { "nazwa": "Laminat HPL Zaoblony", "cena": 0, "opis": "HPL", "kategoria": "hpl" }
];

// ŁĄCZYMY LISTY - To kluczowy krok
const WSZYSTKIE_PLYTY = [...PLYTY_LAMINOWANE, ...PLYTY_SPECJALNE];

export const DROPDOWN_DATA = {
  // 📦 PŁYTY MEBLOWE - KORPUSY (Laminaty + MDF/Fornir/HPL)
  plytyMeblowe: WSZYSTKIE_PLYTY,

  // 🚪 FRONTY (To samo co w płytach + Opcje Specjalne)
  fronty: [
    ...WSZYSTKIE_PLYTY,
    { "nazwa": "-- BRAK FRONTU --", "cena": 0.00, "parametr": "brak", "opis": "BEZ FRONTU", "kategoria": "brak" },
    { "nazwa": "<< JAK PŁYTA KORPUS", "cena": 0.00, "parametr": "korpus", "opis": "IDENTYCZNY", "kategoria": "korpus" }
  ],

  // 🎨 OKLEINA
  okleina: [
    { "nazwa": "-- BRAK OKLEINY --", "cena": 0.00, "kategoria": "material" },
    { "nazwa": "CIENKA 0.8mm", "cena": 1.09, "kategoria": "material", "opis": "Okleina cienka" },
    { "nazwa": "GRUBA 2.0mm", "cena": 6.01, "kategoria": "material", "opis": "Okleina gruba" },
    { "nazwa": "KOSZT CIĘCIA", "cena": 1.70, "kategoria": "usluga" },
    { "nazwa": "KOSZT OKLEJANIA", "cena": 2.80, "kategoria": "usluga" }
  ],

  // 🏷️ TYŁ HDF
  tylHdf: [
    { "nazwa": "HDF", "cena": 6.96, "opis": "Standardowy tył HDF" }
  ],

  // 🚪 DRZWI PRZESUWNE
  drzwiPrzesuwne: [
    { "nazwa": "SEVROLL Alfa", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "SEVROLL Beta", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "SEVROLL Micra", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "LAGUNA Multiomega", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "LAGUNA Fast", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "LAGUNA Rama", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "GTV Aero", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "GTV Overline", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "HETTICH TopLine L", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "HETTICH TopLine XL", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "HETTICH SysLine S", "cena": 0, "opis": "", "kategoria": "drzwiPrzesuwne" }
  ],

  // 🔧 UCHWYTY
  uchwyty: [
    { "nazwa": "Uchwyty frezowane typ J", "cena": 0, "opis": "", "kategoria": "uchwyty" },
    { "nazwa": "Uchwyty frezowane typ U", "cena": 0, "opis": "", "kategoria": "uchwyty" },
    { "nazwa": "Uchwyty frezowane typ 45 stopni", "cena": 0, "opis": "", "kategoria": "uchwyty" },
    { "nazwa": "Uchwyt krawędziowy nabijany", "cena": 0, "opis": "", "kategoria": "uchwyty" },
    { "nazwa": "Uchwyt korytkowy pionowy", "cena": 0, "opis": "", "kategoria": "uchwyty" },
    { "nazwa": "Uchwyt korytkowy poziomy", "cena": 0, "opis": "", "kategoria": "uchwyty" },
    { "nazwa": "Uchwyt standardowy", "cena": 0, "opis": "", "kategoria": "uchwyty" }
  ],

  // 🔗 ZAWIASY
  zawiasy: [
    { "nazwa": "CLIP top BLUMOTION 110°", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "CLIP top BLUMOTION 155°", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "CLIP top BLUMOTION 170°", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "CLIP top BLUMOTION 95°", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "CLIP top BLUMOTION 60°", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "CLIP top BLUMOTION CRISTALLO", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "GTV Zawias hydrauliczny nakładany", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "GTV Zawias hydrauliczny wpuszczany", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "GTV Zawias hydrauliczny bliźniaczy", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "GTV Zawias równoległy", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "HETTICH Sensys 8645i", "cena": 0, "opis": "", "kategoria": "zawiasy" },
    { "nazwa": "HETTICH Intermat 9943", "cena": 0, "opis": "", "kategoria": "zawiasy" }
  ],

  // ⬆️ PODNOŚNIKI
  podnosniki: [
    { "nazwa": "AVENTOS HF", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "AVENTOS HS", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "AVENTOS HL", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "AVENTOS HK", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "AVENTOS HK-S", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "AVENTOS HK-XS", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "GTV Podnośnik gazowy 60N", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "GTV Podnośnik gazowy 80N", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "GTV Podnośnik olejowy", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "HETTICH Lift Advanced HF", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "HETTICH Lift Advanced HK", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "HETTICH Lift Advanced HL", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "HETTICH Lift Advanced HS", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "REJS Podnośnik mechaniczny", "cena": 0, "opis": "", "kategoria": "podnosniki" },
    { "nazwa": "REJS Podnośnik gazowy", "cena": 0, "opis": "", "kategoria": "podnosniki" }
  ],

  // 📦 SZUFLADY
  szuflady: [
    { "nazwa": "LEGRABOX Szuflada zewnętrzna niska", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "LEGRABOX Szuflada zewnętrzna wysoka", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "LEGRABOX Szuflada wewnętrzna", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "LEGRABOX System Tip-On", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX Szuflada zewnętrzna niska", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX Szuflada zewnętrzna wysoka", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX Szuflada wewnętrzna", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX System Tip-On", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Antaro zewnętrzna niska", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Antaro zewnętrzna wysoka", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Antaro wewnętrzna", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Tip-On Blumotion", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "MOVENTO Prowadnica z pełnym wysuwem", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "MOVENTO Prowadnica z Tip-On", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "TANDEM Prowadnica częściowy wysuw", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "TANDEM Prowadnica pełny wysuw", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "GTV Modern Box niska", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "GTV Modern Box średnia", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "GTV Modern Box wysoka", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "GTV Axis Pro niska", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "GTV Axis Pro średnia", "cena": 0, "opis": "", "kategoria": "szuflady" },
    { "nazwa": "GTV Axis Pro wysoka", "cena": 0, "opis": "", "kategoria": "szuflady" }
  ],

  // 🏔️ BLATY
  blaty: [
    { "nazwa": "Montaż Blat 38mm", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Montaż Blat HPL 12mm", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Montaż Splashbak", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Szlifowanie krawędzi Metr Bieżący", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Łączenie blatu Frezowanie łyżwa i śruba", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Otwór Płyta indukcyjna", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Otwór Zlewozmywak", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Otwór Zlew podiweszany", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Otwór Mediaport", "cena": 0, "opis": "", "kategoria": "uslugi", "typ": "usługa" },
    { "nazwa": "Splashback Panel fartuch kuchenny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "HPL Wąski 600mm", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "HPL Szeroki 1300mm", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F011 Granit Magma Szary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F012 Granit Magma Czerwony", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F021 Terrazzo Triestino Szary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F030 Trawertyn Margalida", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F031 Granit Cascia Jasnoszary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F032 Granit Cascia Szary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F052 Trawertyn Calais", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F093 Marmur Cipollino Szary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F095 Marmur Siena Szary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F108 Marmur San Luca", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F117 Kamień Ventura Czarny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F121 Metal Rock Antracytowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F141 Marmur Eramosa Jade", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F186 Beton Chicago Jasnoszary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F187 Beton Chicago Ciemnoszary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F205 Grigia Pietra Antracytowa", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F206 Grigia Pietra Czarna", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F208 Pietra Fanano Szara", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F226 Tytanit Beżowo-piaskowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F227 Tytanit Szary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F228 Tytanit Antracytowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F229 Marmur Cremona", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F230 Pietra Fanano Jasnoszara", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F234 Łupek Scivaro Jasnoszary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F235 Łupek Scivaro", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F237 Łupek Cupria", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F243 Marmur Candela Jasnoszary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F251 Kamień Gavi Taupe", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F275 Beton Ciemny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F302 Ferro Brązowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F333 Beton Zdobiony Szary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F352 Basaltino Terra", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F371 Granit Galizia Szarobeżowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F486 Granit Lśniący Biały", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F502 Szczotkowane Aluminium Premium", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F620 Stal Szara Antracytowa", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F638 Chromix Srebrny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F675 Kamień Calvia Jasnoszary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F676 Kamień Calvia Piaskowoszary", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F800 Marmur Crystal", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "F812 Marmur Levanto Biały", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H011 Świerk Nebrodi Rustykalny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H050 Woodblocks Naturalny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H193 Dąb Butcherblock", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H195 Dąb Zamkowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H197 Drewno Vintage Naturalne", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H305 Dąb Tonsberg Naturalny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H1145 Dąb Bardolino Naturalny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H1303 Dąb Belmont Brązowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H1313 Dąb Whiteriver Szarobrązowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H1318 Dąb Dziki Naturalny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H1357 Dąb Spree Szarobeżowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H1401 Sosna Cascina", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H2031 Dąb Halford Czarny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H2032 Dąb Hunton Jasny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H2033 Dąb Hunton Ciemny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H2409 Dąb Cardiff Brązowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H3133 Dąb Davos Truflowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H3157 Dąb Vicenza", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H3176 Dąb Halifax Cynowany", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H3303 Dąb Hamilton Naturalny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H3331 Dąb Nebraska Naturalny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "H3730 Hikora Naturalna", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K535 Dąb Barokowy Złoty", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K536 Dąb Barokowy Bursztynowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K537 Dąb Barokowy Ristretto", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K538 Dovetail Arosa", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K539 Łupek Arosa Ciemny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K540 Albus Szary / Grey Albus", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K551 Carrara / Calacatta Olympus", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K552 Biały Marmur Lodowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K553 Galaxus", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K105 Raw Endgrain Oak", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K365 Coast Evoke Oak", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K366 Fossil Evoke Oak", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K352 Pharsalia", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K349 Silk Flow", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K350 Concrete Flow", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K351 Rusty Flow", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K353 Charcoal Flow", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K550 Dove Venera", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K549 Sand Venera", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K542 Mocha Tessea", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "K541 Greige Tessea", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9022 Terrazzo Beige", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9054 Marmur Botticino", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9039 Milky Way", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9044 Marmur Fiamma", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9038 Marmur Havana", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9036 Piombo", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9057 Marmur Lux", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9051 Terrazzo Umbra", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PU1000 Czerń Lawa", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9017 Moon Concrete", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9011 Ipanema Rio", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9008 Piaskowiec", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9007 Nubian Jasny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9005 Marmur Piaskowy", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9019 Carrara Klasyczna", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9016 Piaskowiec Antyczny", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9013 Trawertyn Tosca", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9050 Metropolis", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9024 Marmur Calacatta", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9025 Marmur Venezia", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9049 Scirocco", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9018 Kalcyt", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" },
    { "nazwa": "PK9006 Marmur Nero", "cena": 0, "opis": "BLAT", "kategoria": "blaty", "typ": "produkt" }
  ],

  // 🔧 AKCESORIA
  akcesoria: [
    { "nazwa": "Nóżka meblowa Axilio", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "Nóżka meblowa Volpato", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "Oświetlenie LED", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA cargo podblatowe Snello", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV cargo podblatowe Movix", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "REJS cargo podblatowe Variant", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA Le Mans II", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV Corner Magic", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "REJS Corner Comfort", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA Magic Corner", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV Kosz na śmieci", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "BLUM Servo-Drive", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "HETTICH Easys", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV Ociekarka", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "REJS Ociekarka", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA Wyposażenie szuflad", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "BLUM Orga-Line", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "BLUM Ambia-Line", "cena": 0, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "HETTICH OrgaTray", "cena": 0, "opis": "", "kategoria": "akcesoria" }
  ]
};

// 🎯 HELPER FUNCTIONS - Funkcje pomocnicze dla dropdownów

export const getDropdownOptions = (category) => {
  return DROPDOWN_DATA[category] || [];
};

export const getItemByName = (category, name) => {
  const items = DROPDOWN_DATA[category] || [];
  return items.find(item => item.nazwa === name);
};

export const getItemPrice = (category, name) => {
  const item = getItemByName(category, name);
  return item ? item.cena : 0;
};

export const getItemDescription = (category, name) => {
  const item = getItemByName(category, name);
  return item ? item.opis : '';
};

// 🔍 SEARCH FUNCTIONS - Wyszukiwanie w dropdown'ach
export const searchInDropdown = (category, searchTerm) => {
  const items = DROPDOWN_DATA[category] || [];
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.nazwa.toLowerCase().includes(term) ||
    (item.opis && item.opis.toLowerCase().includes(term))
  );
};

// 📊 CATEGORY HELPERS - Pomocniki dla kategorii
export const getByCategory = (mainCategory, subCategory) => {
  const items = DROPDOWN_DATA[mainCategory] || [];
  return items.filter(item => item.kategoria === subCategory);
};

// 💰 PRICE RANGES - Zakresy cenowe
export const getPriceRanges = (category) => {
  const items = DROPDOWN_DATA[category] || [];
  const prices = items.map(item => item.cena).filter(price => price > 0);
  
  if (prices.length === 0) return { min: 0, max: 0, avg: 0 };
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    avg: prices.reduce((sum, price) => sum + price, 0) / prices.length
  };
};

// 🏷️ UNITS - Jednostki dla akcesoriów
export const getUnits = () => {
  return ['szt', 'mb', 'kpl', 'm²', 'kg'];
};

export default DROPDOWN_DATA;