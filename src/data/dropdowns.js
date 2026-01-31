// 🎯 DROPDOWN_DATA - Scentralizowana baza materiałów (Czysta wersja)
// Źródło: Twoje pliki CSV + struktura logiczna (Płyty + MDF/Fornir/HPL)
const laminaty = [
    // --- EGGER ---
    { nazwa: "Egger W1000", cena: 47.10, opis: "Biały Premium", kategoria: "material" },
    { nazwa: "Egger W1100", cena: 52.30, opis: "Biały Alpejski", kategoria: "material" },
    { nazwa: "Egger W980", cena: 32.70, opis: "Biały Platynowy", kategoria: "material" },
    { nazwa: "Egger U201", cena: 45.90, opis: "Szary", kategoria: "material" },
    { nazwa: "Egger U702", cena: 45.90, opis: "Kaszmir", kategoria: "material" },
    { nazwa: "Egger U705", cena: 56.10, opis: "Angora", kategoria: "material" },
    { nazwa: "Egger U708", cena: 33.70, opis: "Jasny Szary", kategoria: "material" },
    { nazwa: "Egger U732", cena: 45.90, opis: "Szary Proch", kategoria: "material" },
    { nazwa: "Egger U750", cena: 56.10, opis: "Szary Taupe", kategoria: "material" },
    { nazwa: "Egger U763", cena: 52.10, opis: "Szary Perłowy", kategoria: "material" },
    { nazwa: "Egger U767", cena: 45.90, opis: "Szary Kubanit", kategoria: "material" },
    { nazwa: "Egger U960", cena: 30.10, opis: "Onyx", kategoria: "material" },
    { nazwa: "Egger U961", cena: 45.90, opis: "Grafit", kategoria: "material" },
    { nazwa: "Egger U968", cena: 45.90, opis: "Węglowy", kategoria: "material" },
    { nazwa: "Egger U999", cena: 35.10, opis: "Czarny", kategoria: "material" },
    { nazwa: "Egger U565", cena: 54.40, opis: "Zieleń", kategoria: "material" },
    { nazwa: "Egger U599", cena: 54.40, opis: "Indygo", kategoria: "material" },
    { nazwa: "Egger U636", cena: 54.40, opis: "Zieleń Fiord", kategoria: "material" },
    { nazwa: "Egger U608", cena: 54.40, opis: "Zieleń Pistacjowa", kategoria: "material" },
    { nazwa: "Egger U638", cena: 54.40, opis: "Szałwia", kategoria: "material" },
    { nazwa: "Egger U604", cena: 68.70, opis: "Zieleń", kategoria: "material" },
    { nazwa: "Egger U665", cena: 54.40, opis: "Kamienny Szary", kategoria: "material" },
    { nazwa: "Egger U640", cena: 54.40, opis: "Antracyt", kategoria: "material" },
    { nazwa: "Egger U645", cena: 54.40, opis: "Żółty", kategoria: "material" },
    { nazwa: "Egger U699", cena: 54.40, opis: "Jodła", kategoria: "material" },
    { nazwa: "Egger U399", cena: 75.10, opis: "MDF Lakierowany", kategoria: "material" },
    { nazwa: "Egger U114", cena: 52.10, opis: "Żółty", kategoria: "material" },
    { nazwa: "Egger U131", cena: 52.10, opis: "Cytryna", kategoria: "material" },
    { nazwa: "Egger U163", cena: 52.10, opis: "Curry", kategoria: "material" },
    { nazwa: "Egger U332", cena: 52.10, opis: "Pomarańcz", kategoria: "material" },
    { nazwa: "Egger U350", cena: 52.10, opis: "Sienna", kategoria: "material" },
    { nazwa: "Egger H3041", cena: 57.70, opis: "Eukaliptus", kategoria: "material" },
    { nazwa: "Egger H1228", cena: 57.70, opis: "Jesion", kategoria: "material" },
    { nazwa: "Egger H1227", cena: 57.70, opis: "Jesion Abano", kategoria: "material" },
    { nazwa: "Egger H1176", cena: 91.80, opis: "Dąb Halifax (Feelwood)", kategoria: "material" },
    { nazwa: "Egger H1180", cena: 86.30, opis: "Dąb Halifax Naturalny (Feelwood)", kategoria: "material" },
    { nazwa: "Egger H1367", cena: 91.80, opis: "Dąb (Feelwood)", kategoria: "material" },
    { nazwa: "Egger H1181", cena: 93.00, opis: "Dąb (Feelwood)", kategoria: "material" },
    { nazwa: "Egger H1385", cena: 86.30, opis: "Dąb Casella (Feelwood)", kategoria: "material" },
    { nazwa: "Egger H3409", cena: 52.10, opis: "Modrzew", kategoria: "material" },
    { nazwa: "Egger H3408", cena: 52.10, opis: "Modrzew Palony", kategoria: "material" },
    { nazwa: "Egger H1384", cena: 91.80, opis: "Dąb (Feelwood)", kategoria: "material" },
    { nazwa: "Egger H1386", cena: 86.30, opis: "Dąb (Feelwood)", kategoria: "material" },
    { nazwa: "Egger H3359", cena: 52.10, opis: "Dąb Davenport", kategoria: "material" },
    { nazwa: "Egger H3326", cena: 52.10, opis: "Dąb Gladstone", kategoria: "material" },
    { nazwa: "Egger H3311", cena: 52.10, opis: "Dąb Cuneo", kategoria: "material" },
    { nazwa: "Egger H3309", cena: 52.10, opis: "Dąb Gladstone Piaskowy", kategoria: "material" },
    { nazwa: "Egger H3317", cena: 52.10, opis: "Dąb Cuneo Brązowy", kategoria: "material" },
    { nazwa: "Egger H1344", cena: 96.40, opis: "Dąb Sherman (Feelwood)", kategoria: "material" },

    // --- KRONOSPAN ---
    { nazwa: "Krono 101", cena: 28.10, opis: "Biały", kategoria: "material" },
    { nazwa: "Krono 110", cena: 25.70, opis: "Biały", kategoria: "material" },
    { nazwa: "Krono 514", cena: 28.10, opis: "Kość Słoniowa", kategoria: "material" },
    { nazwa: "Krono 8100", cena: 28.10, opis: "Biały Perłowy", kategoria: "material" },
    { nazwa: "Krono 8681", cena: 30.50, opis: "Biały Brylantowy", kategoria: "material" },
    { nazwa: "Krono 8685", cena: 26.30, opis: "Biel Alpejska", kategoria: "material" },
    { nazwa: "Krono 112", cena: 25.70, opis: "Popiel", kategoria: "material" },
    { nazwa: "Krono 162", cena: 30.90, opis: "Grafit", kategoria: "material" },
    { nazwa: "Krono 164", cena: 25.70, opis: "Antracyt", kategoria: "material" },
    { nazwa: "Krono 171", cena: 29.80, opis: "Szary", kategoria: "material" },
    { nazwa: "Krono 191", cena: 29.80, opis: "Szary Kamienny", kategoria: "material" },
    { nazwa: "Krono 197", cena: 29.80, opis: "Chinchilla", kategoria: "material" },
    { nazwa: "Krono 540", cena: 29.80, opis: "Szary Manhattan", kategoria: "material" },
    { nazwa: "Krono 1700", cena: 29.80, opis: "Szary Stalowy", kategoria: "material" },
    { nazwa: "Krono 6299", cena: 29.80, opis: "Kobalt", kategoria: "material" },
    { nazwa: "Krono 7045", cena: 29.80, opis: "Szampański", kategoria: "material" },
    { nazwa: "Krono 5981", cena: 29.80, opis: "Kaszmir", kategoria: "material" },
    { nazwa: "Krono K096", cena: 31.50, opis: "Glinka", kategoria: "material" },
    { nazwa: "Krono K522", cena: 31.50, opis: "Beż", kategoria: "material" },
    { nazwa: "Krono K523", cena: 31.50, opis: "Kawa", kategoria: "material" },
    { nazwa: "Krono 125", cena: 31.50, opis: "Niebieski Królewski", kategoria: "material" },
    { nazwa: "Krono 132", cena: 31.50, opis: "Pomarańcz", kategoria: "material" },
    { nazwa: "Krono 134", cena: 31.50, opis: "Słoneczny Żółty", kategoria: "material" },
    { nazwa: "Krono 244", cena: 31.50, opis: "Petrol", kategoria: "material" },
    { nazwa: "Krono 7113", cena: 31.50, opis: "Czerwień", kategoria: "material" },
    { nazwa: "Krono 7190", cena: 31.50, opis: "Zieleń Mamba", kategoria: "material" },
    { nazwa: "Krono 8984", cena: 31.50, opis: "Granat", kategoria: "material" },
    { nazwa: "Krono K097", cena: 31.50, opis: "Zmierzch", kategoria: "material" },
    { nazwa: "Krono K512", cena: 41.20, opis: "Róż", kategoria: "material" },
    { nazwa: "Krono K515", cena: 41.20, opis: "Karmel", kategoria: "material" },
    { nazwa: "Krono K518", cena: 41.20, opis: "Surf", kategoria: "material" },
    { nazwa: "Krono K513", cena: 41.20, opis: "Krem", kategoria: "material" },
    { nazwa: "Krono K514", cena: 41.20, opis: "Latte", kategoria: "material" },
    { nazwa: "Krono K516", cena: 41.20, opis: "Toffi", kategoria: "material" },
    { nazwa: "Krono K517", cena: 41.20, opis: "Azul", kategoria: "material" },
    { nazwa: "Krono K519", cena: 41.20, opis: "Mysz", kategoria: "material" },
    { nazwa: "Krono K520", cena: 41.20, opis: "Ciemny Szary", kategoria: "material" },
    { nazwa: "Krono K521", cena: 41.20, opis: "Dymny", kategoria: "material" },
    
    // Krono Harmony & Special
    { nazwa: "Krono K527", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K528", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K529", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K530", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K531", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K532", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K533", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K534", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K554", cena: 58.50, opis: "Dąb (Harmony)", kategoria: "material" },
    { nazwa: "Krono K085", cena: 30.90, opis: "Szary Jasny", kategoria: "material" },
    { nazwa: "Krono K350", cena: 44.40, opis: "Beton", kategoria: "material" },
    { nazwa: "Krono K358", cena: 44.40, opis: "Beton Ciemny", kategoria: "material" },
    { nazwa: "Krono K544", cena: 53.50, opis: "Orzech", kategoria: "material" },
    { nazwa: "Krono K545", cena: 53.50, opis: "Orzech Ciemny", kategoria: "material" },
    { nazwa: "Krono K546", cena: 53.50, opis: "Drewno Egzotyczne", kategoria: "material" },
    { nazwa: "Krono K547", cena: 53.50, opis: "Drewno Egzotyczne", kategoria: "material" },
    { nazwa: "Krono K553", cena: 53.50, opis: "Dąb", kategoria: "material" },
    { nazwa: "Krono AL01", cena: 203.00, opis: "Szczotkowane Aluminium (MDF)", kategoria: "material" },
    { nazwa: "Krono AL04", cena: 203.00, opis: "Złoto (MDF)", kategoria: "material" },
    { nazwa: "Krono AL08", cena: 203.00, opis: "Miedź (MDF)", kategoria: "material" },

    // --- SWISS KRONO ---
    { nazwa: "Swiss D20571", cena: 44.60, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D20734", cena: 44.60, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D20551", cena: 44.60, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D60654", cena: 64.40, opis: "Dąb Fornir", kategoria: "material" },
    { nazwa: "Swiss D20754", cena: 65.90, opis: "Dąb Premium", kategoria: "material" },
    { nazwa: "Swiss D20764", cena: 65.90, opis: "Dąb Premium", kategoria: "material" },
    { nazwa: "Swiss D20140", cena: 44.60, opis: "Sosna", kategoria: "material" },
    { nazwa: "Swiss D20150", cena: 65.90, opis: "Dąb Craft Premium", kategoria: "material" },
    { nazwa: "Swiss D20130", cena: 65.90, opis: "Dąb Craft Premium", kategoria: "material" },
    { nazwa: "Swiss D20230", cena: 65.90, opis: "Dąb Craft Premium", kategoria: "material" },
    { nazwa: "Swiss D4225", cena: 44.60, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D3025", cena: 36.20, opis: "Dąb Sonoma", kategoria: "material" },
    { nazwa: "Swiss U10030", cena: 54.80, opis: "Uni", kategoria: "material" },
    { nazwa: "Swiss U10040", cena: 54.80, opis: "Uni", kategoria: "material" },
    { nazwa: "Swiss U10020", cena: 60.80, opis: "Uni", kategoria: "material" },
    { nazwa: "Swiss U4446", cena: 60.80, opis: "Uni", kategoria: "material" },
    { nazwa: "Swiss U190", cena: 40.10, opis: "Czarny", kategoria: "material" },
    { nazwa: "Swiss U164", cena: 40.10, opis: "Antracyt", kategoria: "material" },
    { nazwa: "Swiss U540", cena: 40.10, opis: "Szary", kategoria: "material" },
    { nazwa: "Swiss U6933", cena: 54.80, opis: "Zieleń", kategoria: "material" },
    { nazwa: "Swiss D1038", cena: 50.80, opis: "Orzech", kategoria: "material" },
    { nazwa: "Swiss D30090", cena: 50.80, opis: "Orzech", kategoria: "material" },
    { nazwa: "Swiss D30220", cena: 50.80, opis: "Orzech", kategoria: "material" },
    { nazwa: "Swiss D4448", cena: 50.80, opis: "Orzech", kategoria: "material" },
    { nazwa: "Swiss D70060", cena: 50.80, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D30080", cena: 50.80, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D30100", cena: 50.80, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D70070", cena: 50.80, opis: "Dąb", kategoria: "material" },
    { nazwa: "Swiss D4452", cena: 50.80, opis: "Dąb", kategoria: "material" },

    // --- WOODECO (PFLEIDERER) ---
    { nazwa: "Woodeco PD3101", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3102", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3103", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3104", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3100", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3097", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3098", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3099", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3095", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3094", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3096", cena: 32.90, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PD3000", cena: 28.10, opis: "Biały", kategoria: "material" },
    { nazwa: "Woodeco PD3023", cena: 26.80, opis: "Popiel", kategoria: "material" },
    { nazwa: "Woodeco PD3033", cena: 32.90, opis: "Czarny", kategoria: "material" },
    { nazwa: "Woodeco PD3016", cena: 32.90, opis: "Antracyt", kategoria: "material" },
    { nazwa: "Woodeco PD7003", cena: 32.90, opis: "Szary", kategoria: "material" },
    { nazwa: "Woodeco PD7085", cena: 32.90, opis: "Szary Ciemny", kategoria: "material" },
    { nazwa: "Woodeco PU2200", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU2203", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU2003", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU2007", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU2802", cena: 46.30, opis: "Intensywny", kategoria: "material" },
    { nazwa: "Woodeco PU2603", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU2602", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU1505", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU1511", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU2601", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU1502", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU1506", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU1220", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU1213", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PU1002", cena: 34.10, opis: "Uni", kategoria: "material" },
    { nazwa: "Woodeco PK9050", cena: 50.40, opis: "Drewno", kategoria: "material" },
    { nazwa: "Woodeco HK9002", cena: 50.40, opis: "Drewno", kategoria: "material" },
    { nazwa: "Woodeco HF8012", cena: 50.40, opis: "Drewno", kategoria: "material" },
    { nazwa: "Woodeco HF8026", cena: 50.40, opis: "Drewno", kategoria: "material" },
    { nazwa: "Woodeco HF8968", cena: 50.40, opis: "Drewno", kategoria: "material" },
    { nazwa: "Woodeco HF8970", cena: 50.40, opis: "Drewno", kategoria: "material" },
    { nazwa: "Woodeco HB0090", cena: 94.25, opis: "Deep Matt", kategoria: "material" },

    // --- BAZOWE (MDF) ---
    { nazwa: "MDF 18mm 2xB", cena: 44.70, opis: "Laminowany Biały", kategoria: "material" },
    { nazwa: "MDF 18mm Surowy", cena: 31.60, opis: "Do lakierowania", kategoria: "material" },
];

// 2. MATERIAŁY SPECJALNE NA FRONTY (Drogie/Niestandardowe)
const frontySpecjalne = [
    { nazwa: "Fornir Dębowy Prosty", cena: 147.30, opis: "Płyta wiórowa 19mm", kategoria: "material" },
    { nazwa: "Fornir Dębowy Zaoblony", cena: 406.50, opis: "Front gotowy", kategoria: "material" },
    { nazwa: "Fornir Orzech Prosty", cena: 210.00, opis: "Płyta wiórowa 19mm", kategoria: "material" },
    { nazwa: "Fornir Orzech Zaoblony", cena: 447.10, opis: "Front gotowy", kategoria: "material" },
    { nazwa: "MDF 18mm Frezowany/Ryflowany", cena: 120.70, opis: "Panel surowy", kategoria: "material" },
    { nazwa: "MDF 18mm Zaoblony", cena: 134.10, opis: "Panel gotowy", kategoria: "material" },
    { nazwa: "Laminat HPL 0,8mm", cena: 66.70, opis: "Arkusz (Cena za m2)", kategoria: "material" },
    { nazwa: "Laminat HPL Zaoblony", cena: 186.90, opis: "Element gotowy", kategoria: "material" },
];

// 3. TYŁY / HDF
const tyly = [
    { nazwa: "HDF 3mm Biały", cena: 15.00, opis: "Standard", kategoria: "material" },
    { nazwa: "HDF 3mm Kolor", cena: 20.00, opis: "Dopasowany", kategoria: "material" },
    { nazwa: "MDF 6mm Surowy", cena: 12.60, opis: "Pogrubiony tył", kategoria: "material" },
    { nazwa: "MDF 10mm Surowy", cena: 23.80, opis: "Szablon/Plecy", kategoria: "material" },
    { nazwa: "MDF 10mm 2xB", cena: 28.40, opis: "Laminowany", kategoria: "material" },
];

// ŁĄCZYMY LISTY - To kluczowy krok
const WSZYSTKIE_PLYTY = [...laminaty, ...frontySpecjalne];

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
    { "nazwa": "SEVROLL Alfa", "cena": 428, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "SEVROLL Beta", "cena": 310, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "SEVROLL Micra", "cena": 100, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "LAGUNA Multiomega", "cena": 1130, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "LAGUNA Fast", "cena": 106, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "LAGUNA Rama", "cena": 868, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "GTV Aero", "cena": 86, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "GTV Overline", "cena": 45, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "HETTICH TopLine L", "cena": 585, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "HETTICH TopLine XL", "cena": 1134, "opis": "", "kategoria": "drzwiPrzesuwne" },
    { "nazwa": "HETTICH SysLine S", "cena": 254, "opis": "", "kategoria": "drzwiPrzesuwne" }
  ],

  // 🔧 UCHWYTY
  uchwyty: [
  { "nazwa": "Uchwyty frezowane typ J", "cena": 65, "opis": "Frezowanie krawędziowe + lakierowanie (cena za mb)", "kategoria": "uchwyty" },
  { "nazwa": "Uchwyty frezowane typ U", "cena": 75, "opis": "Głębokie frezowanie + lakierowanie (cena za mb)", "kategoria": "uchwyty" },
  { "nazwa": "Uchwyty frezowane typ 45 stopni", "cena": 40, "opis": "Podcięcie skosu krawędzi (cena za mb)", "kategoria": "uchwyty" },

  { "nazwa": "Uchwyt krawędziowy nabijany", "cena": 35, "opis": "Profil Aluminiowy (np. L-200mm) z montażem (szt.)", "kategoria": "uchwyty" },
  { "nazwa": "Uchwyt korytkowy poziomy (Gola)", "cena": 110, "opis": "Profil C lub L montowany w korpusie (cena za mb)", "kategoria": "uchwyty" },
  { "nazwa": "Uchwyt korytkowy pionowy", "cena": 140, "opis": "Profil montowany pionowo w szafkach wysokich (mb)", "kategoria": "uchwyty" },

  { "nazwa": "Uchwyt standardowy", "cena": 25, "opis": "Uchwyt punktowy/relingowy (średnia cena za szt.)", "kategoria": "uchwyty" },
  { "nazwa": "System TIP-ON (Bezuchwytowy)", "cena": 18, "opis": "Odbojnik do otwierania na dotyk (szt.)", "kategoria": "uchwyty" }
],

  // 🔗 ZAWIASY
  zawiasy: [
  { "nazwa": "CLIP top BLUMOTION 110°", "cena": 11.50, "opis": "Standardowy zawias z hamulcem (z prowadnikiem)", "kategoria": "zawiasy" },
  { "nazwa": "CLIP top BLUMOTION 155°", "cena": 28.50, "opis": "Zawias z szerokim kątem otwarcia (zerowy uskok)", "kategoria": "zawiasy" },
  { "nazwa": "CLIP top BLUMOTION 170°", "cena": 42.00, "opis": "Zawias o bardzo szerokim kącie (np. do cargo)", "kategoria": "zawiasy" },
  { "nazwa": "CLIP top BLUMOTION 95°", "cena": 18.50, "opis": "Zawias do grubych frontów lub ramek aluminiowych", "kategoria": "zawiasy" },
  { "nazwa": "CLIP top BLUMOTION 60°", "cena": 34.00, "opis": "Zawias do szafek narożnych (bi-fold)", "kategoria": "zawiasy" },
  { "nazwa": "CLIP top BLUMOTION CRISTALLO", "cena": 52.00, "opis": "Zawias do frontów szklanych lub lustrzanych", "kategoria": "zawiasy" },

  { "nazwa": "HETTICH Sensys 8645i", "cena": 10.80, "opis": "Zawias zintegrowany z cichym domykiem (z prowadnikiem)", "kategoria": "zawiasy" },
  { "nazwa": "HETTICH Intermat 9943", "cena": 6.50, "opis": "Zawias bez dociągu (wymaga opcjonalnego hamulca)", "kategoria": "zawiasy" },

  { "nazwa": "GTV Zawias hydrauliczny nakładany", "cena": 3.80, "opis": "Zawias z hamulcem i prowadnikiem clip-on", "kategoria": "zawiasy" },
  { "nazwa": "GTV Zawias hydrauliczny wpuszczany", "cena": 3.95, "opis": "Zawias z hamulcem (do szafek wpuszczanych)", "kategoria": "zawiasy" },
  { "nazwa": "GTV Zawias hydrauliczny bliźniaczy", "cena": 4.10, "opis": "Zawias do przegrody środkowej (pół-nakładany)", "kategoria": "zawiasy" },
  { "nazwa": "GTV Zawias równoległy", "cena": 6.50, "opis": "Zawias do szafek narożnych prostych", "kategoria": "zawiasy" }
],

  // ⬆️ PODNOŚNIKI
  podnosniki: [
  { "nazwa": "AVENTOS HF", "cena": 485, "opis": "Zestaw do frontów łamanych (siłowniki + podnośniki)", "kategoria": "podnosniki" },
  { "nazwa": "AVENTOS HS", "cena": 520, "opis": "Zestaw do frontu nachylanego nad korpus", "kategoria": "podnosniki" },
  { "nazwa": "AVENTOS HL", "cena": 545, "opis": "Zestaw do frontu nad podnoszonego równolegle", "kategoria": "podnosniki" },
  { "nazwa": "AVENTOS HK top", "cena": 215, "opis": "Zestaw do frontu uchylnego (najnowsza wersja)", "kategoria": "podnosniki" },
  { "nazwa": "AVENTOS HK-S", "cena": 115, "opis": "Zestaw do małych frontów uchylnych", "kategoria": "podnosniki" },
  { "nazwa": "AVENTOS HK-XS", "cena": 65, "opis": "Podnośnik mechaniczny (wymaga zawiasów)", "kategoria": "podnosniki" },

  { "nazwa": "HETTICH Lift Advanced HF", "cena": 430, "opis": "System do frontów łamanych dwuczęściowych", "kategoria": "podnosniki" },
  { "nazwa": "HETTICH Lift Advanced HK", "cena": 195, "opis": "System do frontów uchylnych", "kategoria": "podnosniki" },
  { "nazwa": "HETTICH Lift Advanced HL", "cena": 490, "opis": "System do frontów podnoszonych pionowo", "kategoria": "podnosniki" },
  { "nazwa": "HETTICH Lift Advanced HS", "cena": 470, "opis": "System do frontów nachylanych", "kategoria": "podnosniki" },

  { "nazwa": "GTV Podnośnik gazowy 60N", "cena": 8, "opis": "Standardowy siłownik gazowy", "kategoria": "podnosniki" },
  { "nazwa": "GTV Podnośnik gazowy 80N", "cena": 8, "opis": "Standardowy siłownik gazowy", "kategoria": "podnosniki" },
  { "nazwa": "GTV Podnośnik olejowy", "cena": 28, "opis": "Podnośnik z miękkim dociągiem", "kategoria": "podnosniki" },
  { "nazwa": "REJS Podnośnik mechaniczny", "cena": 35, "opis": "Uniwersalny podnośnik mechaniczny", "kategoria": "podnosniki" },
  { "nazwa": "REJS Podnośnik gazowy", "cena": 9, "opis": "Siłownik gazowy wzmocniony", "kategoria": "podnosniki" }
  ],

  // 📦 SZUFLADY
  szuflady:
    [
    { "nazwa": "LEGRABOX Szuflada zewnętrzna niska", "cena": 245.00, "opis": "System premium, cienki bok", "kategoria": "szuflady" },
    { "nazwa": "LEGRABOX Szuflada zewnętrzna wysoka", "cena": 310.00, "opis": "System premium, cienki bok", "kategoria": "szuflady" },
    { "nazwa": "LEGRABOX Szuflada wewnętrzna", "cena": 340.00, "opis": "Z frontem przednim i uchwytem", "kategoria": "szuflady" },
    { "nazwa": "LEGRABOX System Tip-On", "cena": 115.00, "opis": "Mechanizm otwierania dotykowego", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX Szuflada zewnętrzna niska", "cena": 165.00, "opis": "Platforma modułowa Blum", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX Szuflada zewnętrzna wysoka", "cena": 195.00, "opis": "Platforma modułowa Blum", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX Szuflada wewnętrzna", "cena": 220.00, "opis": "Wersja wewnętrzna M", "kategoria": "szuflady" },
    { "nazwa": "MERIVOBOX System Tip-On", "cena": 105.00, "opis": "Mechanizm otwierania dotykowego", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Antaro zewnętrzna niska", "cena": 135.00, "opis": "Klasyczny system Blum", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Antaro zewnętrzna wysoka", "cena": 165.00, "opis": "Bok z relingiem", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Antaro wewnętrzna", "cena": 185.00, "opis": "Z frontem przednim", "kategoria": "szuflady" },
    { "nazwa": "TANDEMBOX Tip-On Blumotion", "cena": 95.00, "opis": "Dotyk + dociąg", "kategoria": "szuflady" },
    { "nazwa": "MOVENTO Prowadnica z pełnym wysuwem", "cena": 110.00, "opis": "Do szuflad drewnianych", "kategoria": "szuflady" },
    { "nazwa": "MOVENTO Prowadnica z Tip-On", "cena": 145.00, "opis": "Pełny wysuw + Tip-on", "kategoria": "szuflady" },
    { "nazwa": "TANDEM Prowadnica częściowy wysuw", "cena": 55.00, "opis": "Blumatic, 30kg", "kategoria": "szuflady" },
    { "nazwa": "TANDEM Prowadnica pełny wysuw", "cena": 85.00, "opis": "Blumotion, 30kg", "kategoria": "szuflady" },
    { "nazwa": "GTV Modern Box niska", "cena": 65.00, "opis": "Ekonomiczny system szuflad", "kategoria": "szuflady" },
    { "nazwa": "GTV Modern Box średnia", "cena": 78.00, "opis": "Ekonomiczny system szuflad", "kategoria": "szuflady" },
    { "nazwa": "GTV Modern Box wysoka", "cena": 88.00, "opis": "Ekonomiczny system szuflad", "kategoria": "szuflady" },
    { "nazwa": "GTV Axis Pro niska", "cena": 85.00, "opis": "Cienki bok GTV", "kategoria": "szuflady" },
    { "nazwa": "GTV Axis Pro średnia", "cena": 98.00, "opis": "Cienki bok GTV", "kategoria": "szuflady" },
    { "nazwa": "GTV Axis Pro wysoka", "cena": 115.00, "opis": "Cienki bok GTV", "kategoria": "szuflady" }
],

  // 🏔️ BLATY
  blaty: 
   [
  { "nazwa": "Montaż Blat 38mm", "cena": 120, "kategoria": "blaty", "opis": "Cena za mb montażu standardowego" },
  { "nazwa": "Montaż Blat HPL 12mm", "cena": 250, "kategoria": "blaty", "opis": "Cena za mb montażu kompaktu" },
  { "nazwa": "Montaż Splashback", "cena": 80, "kategoria": "blaty", "opis": "Cena za mb montażu panelu" },
  { "nazwa": "Szlifowanie krawędzi (mb)", "cena": 45, "kategoria": "blaty", "opis": "Wykończenie krawędzi widocznej" },
  { "nazwa": "Łączenie blatu (Frez/Śruba)", "cena": 150, "kategoria": "blaty", "opis": "Cena za jedno złącze" },
  { "nazwa": "Otwór: Płyta indukcyjna", "cena": 80, "kategoria": "blaty", "opis": "Wycięcie pod płytę" },
  { "nazwa": "Otwór: Zlewozmywak wpuszczany", "cena": 100, "kategoria": "blaty", "opis": "Wycięcie pod zlew" },
  { "nazwa": "Otwór: Zlew podwieszany", "cena": 240, "kategoria": "blaty", "opis": "Precyzyjne szlifowanie otworu" },
  { "nazwa": "Otwór: Mediaport", "cena": 50, "kategoria": "blaty", "opis": "Wycięcie pod gniazdo" },

  { "nazwa": "Splashback Panel (4100x600)", "cena": 450, "kategoria": "blaty", "opis": "Fartuch kuchenny - arkusz" },
  { "nazwa": "HPL Wąski 600mm (Arkusz)", "cena": 1850, "kategoria": "blaty", "opis": "Kompakt 4100x600mm" },
  { "nazwa": "HPL Szeroki 1300mm (Arkusz)", "cena": 4015, "kategoria": "blaty", "opis": "Kompakt 4100x1300mm" },

  { "nazwa": "F011 Granit Magma Szary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F012 Granit Magma Czerwony", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F021 Terrazzo Triestino Szary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F030 Trawertyn Margalida", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F031 Granit Cascia Jasnoszary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F032 Granit Cascia Szary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F052 Trawertyn Calais", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F093 Marmur Cipollino Szary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F095 Marmur Siena Szary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F108 Marmur San Luca", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F117 Kamień Ventura Czarny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F121 Metal Rock Antracytowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F141 Marmur Eramosa Jade", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F186 Beton Chicago Jasnoszary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F187 Beton Chicago Ciemnoszary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F205 Grigia Pietra Antracytowa", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F206 Grigia Pietra Czarna", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F208 Pietra Fanano Szara", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F226 Tytanit Beżowo-piaskowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F227 Tytanit Szary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F228 Tytanit Antracytowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F229 Marmur Cremona", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F230 Pietra Fanano Jasnoszara", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F234 Łupek Scivaro Jasnoszary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F235 Łupek Scivaro", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F237 Łupek Cupria", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F243 Marmur Candela Jasnoszary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F251 Kamień Gavi Taupe", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F275 Beton Ciemny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F302 Ferro Brązowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F333 Beton Zdobiony Szary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F352 Basaltino Terra", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F371 Granit Galizia Szarobeżowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F486 Granit Lśniący Biały", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F502 Szczotkowane Aluminium Premium", "cena": 635, "kategoria": "blaty" },
  { "nazwa": "F620 Stal Szara Antracytowa", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F638 Chromix Srebrny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F675 Kamień Calvia Jasnoszary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F676 Kamień Calvia Piaskowoszary", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F800 Marmur Crystal", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "F812 Marmur Levanto Biały", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H011 Świerk Nebrodi Rustykalny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H050 Woodblocks Naturalny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H193 Dąb Butcherblock", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H195 Dąb Zamkowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H197 Drewno Vintage Naturalne", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H305 Dąb Tonsberg Naturalny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H1145 Dąb Bardolino Naturalny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H1303 Dąb Belmont Brązowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H1313 Dąb Whiteriver Szarobrązowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H1318 Dąb Dziki Naturalny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H1357 Dąb Spree Szarobeżowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H1401 Sosna Cascina", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H2031 Dąb Halford Czarny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H2032 Dąb Hunton Jasny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H2033 Dąb Hunton Ciemny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H2409 Dąb Cardiff Brązowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H3133 Dąb Davos Truflowy", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H3157 Dąb Vicenza", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H3176 Dąb Halifax Cynowany", "cena": 1125, "kategoria": "blaty", "opis": "Premium ST37" },
  { "nazwa": "H3303 Dąb Hamilton Naturalny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H3331 Dąb Nebraska Naturalny", "cena": 550, "kategoria": "blaty" },
  { "nazwa": "H3730 Hikora Naturalna", "cena": 550, "kategoria": "blaty" },

  { "nazwa": "K535 Dąb Barokowy Złoty", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K536 Dąb Barokowy Bursztynowy", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K537 Dąb Barokowy Ristretto", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K538 Dovetail Arosa", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K539 Łupek Arosa Ciemny", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K540 Albus Szary", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K551 Carrara / Calacatta Olympus", "cena": 520, "kategoria": "blaty" },
  { "nazwa": "K552 Biały Marmur Lodowy", "cena": 520, "kategoria": "blaty" },
  { "nazwa": "K553 Galaxus", "cena": 520, "kategoria": "blaty" },
  { "nazwa": "K105 Raw Endgrain Oak", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K365 Coast Evoke Oak", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K366 Fossil Evoke Oak", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K352 Pharsalia", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K349 Silk Flow", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K350 Concrete Flow", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K351 Rusty Flow", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K353 Charcoal Flow", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K550 Dove Venera", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K549 Sand Venera", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K542 Mocha Tessea", "cena": 480, "kategoria": "blaty" },
  { "nazwa": "K541 Greige Tessea", "cena": 480, "kategoria": "blaty" },

  { "nazwa": "PK9022 Terrazzo Beige", "cena": 1747, "kategoria": "blaty" },
  { "nazwa": "PK9054 Marmur Botticino", "cena": 1801, "kategoria": "blaty" },
  { "nazwa": "PK9039 Milky Way", "cena": 1856, "kategoria": "blaty" },
  { "nazwa": "PK9044 Marmur Fiamma", "cena": 1829, "kategoria": "blaty" },
  { "nazwa": "PK9038 Marmur Havana", "cena": 1801, "kategoria": "blaty" },
  { "nazwa": "PK9036 Piombo", "cena": 1747, "kategoria": "blaty" },
  { "nazwa": "PK9057 Marmur Lux", "cena": 1883, "kategoria": "blaty" },
  { "nazwa": "PK9051 Terrazzo Umbra", "cena": 1774, "kategoria": "blaty" },
  { "nazwa": "PU1000 Czerń Lawa", "cena": 1801, "kategoria": "blaty" },
  { "nazwa": "PK9017 Moon Concrete", "cena": 1747, "kategoria": "blaty" },
  { "nazwa": "PK9011 Ipanema Rio", "cena": 1774, "kategoria": "blaty" },
  { "nazwa": "PK9008 Piaskowiec", "cena": 1720, "kategoria": "blaty" },
  { "nazwa": "PK9007 Nubian Jasny", "cena": 1747, "kategoria": "blaty" },
  { "nazwa": "PK9005 Marmur Piaskowy", "cena": 1774, "kategoria": "blaty" },
  { "nazwa": "PK9019 Carrara Klasyczna", "cena": 1856, "kategoria": "blaty" },
  { "nazwa": "PK9016 Piaskowiec Antyczny", "cena": 1720, "kategoria": "blaty" },
  { "nazwa": "PK9013 Trawertyn Tosca", "cena": 1747, "kategoria": "blaty" },
  { "nazwa": "PK9050 Metropolis", "cena": 1829, "kategoria": "blaty" },
  { "nazwa": "PK9024 Marmur Calacatta", "cena": 1856, "kategoria": "blaty" },
  { "nazwa": "PK9025 Marmur Venezia", "cena": 1829, "kategoria": "blaty" },
  { "nazwa": "PK9049 Scirocco", "cena": 1801, "kategoria": "blaty" },
  { "nazwa": "PK9018 Kalcyt", "cena": 1774, "kategoria": "blaty" },
  { "nazwa": "PK9006 Marmur Nero", "cena": 1774, "kategoria": "blaty" }
],

  // 🔧 AKCESORIA
  akcesoria: [
    { "nazwa": "Nóżka meblowa Axilio", "cena": 4.10, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "Nóżka meblowa Volpato", "cena": 0.90, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "Oświetlenie LED", "cena": 95, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA cargo podblatowe Snello", "cena": 455, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV cargo podblatowe Movix", "cena": 185, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "REJS cargo podblatowe Variant", "cena": 190, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA Le Mans II", "cena": 1280, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV Corner Magic", "cena": 950, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "REJS Corner Comfort", "cena": 850, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA Magic Corner", "cena": 2750, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV Kosz na śmieci", "cena": 125, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "BLUM Servo-Drive", "cena": 585, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "HETTICH Easys", "cena": 1550, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "GTV Ociekarka", "cena": 65, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "REJS Ociekarka", "cena": 95, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "PEKA Wyposażenie szuflad", "cena": 55, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "BLUM Orga-Line", "cena": 380, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "BLUM Ambia-Line", "cena": 240, "opis": "", "kategoria": "akcesoria" },
    { "nazwa": "HETTICH OrgaTray", "cena": 115, "opis": "", "kategoria": "akcesoria" },
     { nazwa: "Drążek meblowy", cena: 35.00, jednostka: "szt", opis: "Aluminium + PVC, ochrona od wibracji, udźwig 40kg/m" },
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