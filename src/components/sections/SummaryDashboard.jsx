import React from 'react';
import { Download, Save, TrendingUp, Package, DollarSign, Calculator, Sparkles } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import { getDropdownOptions } from '../../data/dropdowns';
import OfferButtons from '../ui/OfferButtons';

const SummaryDashboard = () => {
  const { settings: globalSettings } = useAuth();
  const { projectData, calculations, settings: projectSettings, totals, saveProjectToArchive, exportToJson } = useProject();

  const formatPrice = (price = 0) => `${price.toFixed(2).replace('.', ',')} zł`;
  const formatSurface = (surface = 0) => `${surface.toFixed(2).replace('.', ',')} m²`;
  
  const getOfferData = () => {
    const szafki = calculations?.szafki || [];
    const blaty = calculations?.blaty || [];
    const widoczneBoki = calculations?.widocznyBok || [];
    const blatyOptions = getDropdownOptions('blaty');
    
    // ✅ ZMIANA: Definiujemy stałą, niezmienną kolejność sekcji
    const sectionOrder = [
      'szafki', 'szuflady', 'widocznyBok', 'drzwiPrzesuwne', 
      'uchwyty', 'zawiasy', 'podnosniki', 'blaty', 'akcesoria'
    ];

    const szafkiMaterialSummaryObject = szafki.reduce((summary, szafka) => {
      const korpusMaterial = szafka.plytyKorpus;
      const korpusSurface = (szafka.powierzchniaKorpus || 0) + (szafka.powierzchniaPółek || 0);
      if (korpusMaterial && korpusSurface > 0) {
        summary[korpusMaterial] = (summary[korpusMaterial] || 0) + korpusSurface;
      }
      const frontMaterial = szafka.plytyFront;
      const frontSurface = szafka.powierzchniaFront || 0;
      if (frontMaterial && frontMaterial !== '-- BRAK FRONTU --' && frontMaterial !== '<< JAK PŁYTA KORPUS' && frontSurface > 0) {
        summary[frontMaterial] = (summary[frontMaterial] || 0) + frontSurface;
      } else if (frontMaterial === '<< JAK PŁYTA KORPUS' && korpusMaterial && frontSurface > 0) {
        summary[korpusMaterial] = (summary[korpusMaterial] || 0) + frontSurface;
      }
      return summary;
    }, {});

    // ✅ ZMIANA: Sortujemy alfabetycznie, aby zapewnić stabilną kolejność na wydruku
    const sortedSzafkiMaterialSummary = Object.entries(szafkiMaterialSummaryObject)
      .sort((a, b) => a[0].localeCompare(b[0]));

       const widocznyBokMaterialSummaryObject = widoczneBoki.reduce((summary, bok) => {
        const material = bok.rodzaj;
        const surface = bok.powierzchnia || 0;
        if (material && surface > 0) {
            summary[material] = (summary[material] || 0) + surface;
        }
        return summary;
    }, {});
    const sortedWidocznyBokMaterialSummary = Object.entries(widocznyBokMaterialSummaryObject).sort((a, b) => a[0].localeCompare(b[0]));


    const summaryMetrics = {
      iloscSzafek: szafki.reduce((sum, szafka) => sum + (parseInt(szafka.ilośćSztuk) || 1), 0),
        powierzchniaKorpusyPolki: szafki.reduce((sum, szafka) => sum + (szafka.powierzchniaKorpus || 0) + (szafka.powierzchniaPółek || 0), 0),
        powierzchniaFronty: szafki.reduce((sum, szafka) => sum + (szafka.powierzchniaFront || 0), 0),
        powierzchniaBokowWidocznych: widoczneBoki.reduce((sum, bok) => sum + (bok.powierzchnia || 0), 0), // Nowa metryka
        iloscBlatowProduktow: blaty.reduce((sum, b) => {
            const itemInfo = blatyOptions.find(opt => opt.nazwa === b.rodzaj);
            if (itemInfo && itemInfo.typ === 'produkt') { return sum + (parseFloat(b.ilość) || 0); }
            return sum;
        }, 0)
    };

    return {
        companyData: { 
            name: globalSettings?.companyName, 
            address: globalSettings?.companyAddress, 
            city: globalSettings?.companyCity, 
            nip: globalSettings?.companyNip, 
            website: globalSettings?.companyWebsite, 
            email: globalSettings?.companyEmail, 
            phone: globalSettings?.companyPhone, 
            logo: globalSettings?.logo, 
            backgroundImage: globalSettings?.backgroundImage, 
            warranty: globalSettings?.gwarancja, 
            deliveryTime: globalSettings?.czasRealizacji, 
            // Konwertujemy obiekty {id, text} na listę samych tekstów dla PDF
            terms: (globalSettings?.warunki || []).map(item => item.text), 
            exclusions: (globalSettings?.wykluczenia || []).map(item => item.text), 
        },
        clientData: projectData || {},
        totals: totals,
        summaryMetrics: summaryMetrics,
        szafkiMaterialSummary: sortedSzafkiMaterialSummary,
        widocznyBokMaterialSummary: sortedWidocznyBokMaterialSummary,
        activeSections: sectionOrder.map(key => {
        const data = calculations[key];
        if (!data || !Array.isArray(data) || data.length === 0) return null;
        
        const total = data.reduce((sum, item) => sum + (item.cenaCałość || 0), 0);
        if (total <= 0) return null;
        
        return {
          key,
          name: key.charAt(0).toUpperCase() + key.slice(1),
          data,
          items: data.reduce((sum, item) => sum + (parseInt(item.ilośćSztuk ?? item.ilość) || 1), 0),
          total,
        };
      }).filter(Boolean), // Usuwamy puste sekcje
    };
  };

  const offerData = getOfferData();
  const itemCount = Object.values(calculations).flat().length;

  const stats = [
    { title: 'Wartość materiałów', value: formatPrice(totals.materialsTotal), icon: Package, color: 'brand' },
    { title: 'Pozostałe koszty', value: formatPrice(totals.additionalTotal), icon: DollarSign, color: 'amber' },
    { title: 'Wartość całkowita', value: formatPrice(totals.grossTotal), icon: TrendingUp, color: 'green' },
    { title: 'Liczba pozycji', value: itemCount, icon: Calculator, color: 'purple' }
  ];

  const sectionLabels = {
    szafki: '📦 Szafki', szuflady: '🗃️ Szuflady', widocznyBok: '📐 Widoczny Bok',
    drzwiPrzesuwne: '🚪 Drzwi Przesuwne', uchwyty: '🔘 Uchwyty', zawiasy: '🔗 Zawiasy',
    podnosniki: '⬆️ Podnośniki', blaty: '🏠 Blaty', akcesoria: '⚙️ Akcesoria'
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 Podsumowanie Projektu</h1>
            <p className="text-gray-600">{projectData?.projectName || 'Nowy Projekt'}</p>
          </div>
          <div className="text-left md:text-right mt-4 md:mt-0">
            <div className="text-3xl font-bold text-brand-600">{formatPrice(totals.grossTotal)}</div>
            <div className="text-sm text-gray-500">Wartość całkowita (brutto)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => <StatCard key={index} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Podsumowanie sekcji</h3>
          <div className="space-y-3">
            {(Object.entries(totals.sectionTotals || {})).map(([key, value]) => {
              if (value > 0) {
                return (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{sectionLabels[key] || key}</span>
                    <span className="font-semibold">{formatPrice(value)}</span>
                  </div>
                );
              }
              return null;
            })}
            <div className="flex justify-between items-center py-3 border-t-2 border-brand-200 font-bold text-brand-600">
              <span>SUMA MATERIAŁY:</span>
              <span>{formatPrice(totals.materialsTotal)}</span>
            </div>
          </div>
        </div>

         <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Wygeneruj Ofertę</h3>
          <OfferButtons offerData={offerData} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = { 
    brand: 'bg-brand-50 text-brand-700', 
    amber: 'bg-amber-50 text-amber-700', 
    green: 'bg-green-50 text-green-700', 
    purple: 'bg-purple-50 text-purple-700' 
  };
  return (
    <div className={`p-5 rounded-xl ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 font-semibold text-sm">
        <Icon className="w-5 h-5" />
        <span>{title}</span>
      </div>
      <p className="text-2xl font-bold  whitespace-nowrap mt-3">
        {value}
      </p>
    </div>
  );
};

export default SummaryDashboard;