const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Inicjalizacja Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, '../functions/serviceAccountKey.json');

// Sprawdzenie czy plik istnieje - jeśli nie, użyj environment variable
let serviceAccount;
if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = require(serviceAccountPath);
} else {
  console.log('⚠️  serviceAccountKey.json nie znaleziony.');
  console.log('Upewnij się, że plik istnieje w: functions/serviceAccountKey.json');
  console.log('\nAlbo ustaw zmienną środowiskową FIREBASE_CONFIG_PATH');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://qalqly-prod.firebaseio.com'
});

const db = admin.firestore();

// Wczytanie konfiguracji
const configPath = path.join(__dirname, 'config.json');
const materialsPath = path.join(__dirname, 'materials.json');

if (!fs.existsSync(configPath)) {
  console.error('❌ Plik config.json nie znaleziony!');
  process.exit(1);
}

if (!fs.existsSync(materialsPath)) {
  console.error('❌ Plik materials.json nie znaleziony!');
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
const materials = JSON.parse(fs.readFileSync(materialsPath, 'utf-8'));

console.log('\n🚀 Rozpoczynam import materiałów...\n');
console.log(`📋 Konfiguracja:`);
console.log(`   User ID: ${config.userId}`);
console.log(`   Kategoria: ${config.category}`);
console.log(`   Liczba materiałów: ${materials.length}`);
console.log('\n⏳ Przetwarzanie...\n');

// Walidacja
if (!config.userId || config.userId === 'TUTAJ_WKLEJ_USER_ID') {
  console.error('❌ Błąd: Nie wpisałeś User ID w config.json!');
  process.exit(1);
}

if (!config.category) {
  console.error('❌ Błąd: Brakuje kategorii w config.json!');
  process.exit(1);
}

if (!Array.isArray(materials) || materials.length === 0) {
  console.error('❌ Błąd: Materiały są puste lub to nie jest tablica!');
  process.exit(1);
}

// Transformacja materiałów
const transformedMaterials = materials.map((item, index) => {
  const safeName = item.nazwa
    ?.replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase() || `item${index}`;
  
  return {
    id: `auto_${config.category}_${safeName}`,
    nazwa: item.nazwa || '',
    opis: item.opis || '',
    cena: typeof item.cena === 'number' ? item.cena : parseFloat(item.cena || 0),
    typ: item.typ || 'produkt',
    kategoria: item.kategoria || 'material'  // ← Zachowuje z JSON
  };
});

// Zapis do Firestore
async function importToFirestore() {
  try {
    const userRef = db.collection('users').doc(config.userId);
    const materialsLibraryRef = userRef.collection('materials').doc('library');

    // Sprawdzenie czy user istnieje
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      console.warn(`⚠️  User ${config.userId} nie istnieje w systemie. Kontynuuję import...`);
    }

    // Zapis - ZAMIANIE całą tablicę
    await materialsLibraryRef.update({
      [config.category]: transformedMaterials
    });

    console.log(`✅ Sukces!\n`);
    console.log(`   Zaimportowano: ${transformedMaterials.length} materiałów`);
    console.log(`   Kategoria: ${config.category}`);
    console.log(`   Ścieżka: users/${config.userId}/materials/library → ${config.category}[]`);
    console.log(`\n📍 Możesz teraz edytować materiały w Firebase Console:`);
    console.log(`   https://console.firebase.google.com/project/qalqly-prod/firestore`);
    console.log(`\n✨ Import zakończony!\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Błąd podczas importu:\n', error.message);
    process.exit(1);
  }
}

importToFirestore();
