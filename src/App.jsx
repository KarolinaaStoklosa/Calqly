import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext'; 
import { MaterialsProvider } from './context/MaterialContext';
import Layout from './components/layout/Layout';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import SubscriptionPage from './components/pages/SubscriptionPage';
import SuccessPage from './components/pages/SuccessPage';
import CancelPage from './components/pages/CancelPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import KorpusyTable from './components/sections/KorpusyTable';
import SzufladyTable from './components/sections/SzufladyTable';
import WidocznyBokTable from './components/sections/WidocznyBokTable';
import DrzwiPrzesuwneTable from './components/sections/DrzwiPrzesuwneTable';
import UchwytyTable from './components/sections/UchwytyTable';
import ZawiasyTable from './components/sections/ZawiasyTable';
import PodnosnikiTable from './components/sections/PodnosnikiTable';
import BlatyTable from './components/sections/BlatyTable';
import AkcesoriaTable from './components/sections/AkcesoriaTable';
import SummaryDashboard from './components/sections/SummaryDashboard';
import ProjectSetupForm from './components/sections/ProjectSetupForm';
import CalculationSection from './components/sections/CalculationSection';
import CompanySettings from './components/sections/CompanySettings';
import ArchivePage from './components/sections/ArchivePage';
import MaterialsManager from './components/sections/MaterialsManager';
import { Sparkles, FilePlus, FolderOpen } from 'lucide-react';
import LegalPage from './components/pages/LegalPage.jsx';
import { TermsContent, PrivacyPolicyContent, DisclaimerContent } from './data/legalContent.jsx'; 
import CookieConsentBanner from './components/layout/CookieConsentBanner'; 
import Footer from './components/layout/Footer';

const WelcomeScreen = ({ setActiveTab }) => {
  const { resetProject } = useProject();
  
  const handleCreateFirstProject = () => {
    resetProject();
    setActiveTab('projectSetup');
  };

  return (
    // ZMIANA: Usunięto fioletowe gradienty tła, teraz jest czyste i profesjonalne
    <div className="bg-gray-50 p-8 text-center flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] rounded-xl">
      
      {/* IKONA GŁÓWNA */}
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-gray-200">
        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-brand-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900">Witaj w Aplikacji!</h1>
      <p className="text-gray-500 mt-3 max-w-lg mx-auto mb-10">
        Skonfiguruj dane Firmy, zarządzaj materiałami i stwórz nowy projekt lub otwórz istniejący z archiwum.
      </p>

      {/* PRZYCISKI AKCJI */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        
        {/* Przycisk: Utwórz Projekt (Główny - Pomarańczowy) */}
        <button 
          onClick={handleCreateFirstProject}
          className="flex-1 flex items-center justify-center px-6 py-4 bg-brand-500 text-white rounded-xl font-bold shadow-md shadow-brand-500/20 hover:bg-brand-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
        >
          <FilePlus className="w-5 h-5 mr-2" />
          Utwórz Projekt
        </button>

        {/* Przycisk: Otwórz Archiwum (Drugorzędny - Biały) */}
        <button 
          onClick={() => setActiveTab('archive')}
          className="flex-1 flex items-center justify-center px-6 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <FolderOpen className="w-5 h-5 mr-2 text-gray-400" />
          Otwórz z Archiwum
        </button>
      </div>
      
    </div>
  );
};


const MainCalculatorApp = () => {
  const { projectData, resetProject } = useProject();

  const sections = {
    companySettings: { title: '🏢 Dane Firmy', component: CompanySettings, isCalculator: false },
    projectSetup: { title: '📂 Dane projektu', component: ProjectSetupForm, isCalculator: false },
    szafki: { title: '📦 Szafki/Korpusy', component: KorpusyTable, isCalculator: true },
    szuflady: { title: '🗂️ Szuflady', component: SzufladyTable, isCalculator: true },
    widocznyBok: { title: '👁️ Widoczny Bok', component: WidocznyBokTable, isCalculator: true },
    drzwiPrzesuwne: { title: '🚪 Drzwi Przesuwne', component: DrzwiPrzesuwneTable, isCalculator: true },
    uchwyty: { title: '🔧 Uchwyty', component: UchwytyTable, isCalculator: true },
    zawiasy: { title: '🔗 Zawiasy', component: ZawiasyTable, isCalculator: true },
    podnosniki: { title: '⬆️ Podnośniki', component: PodnosnikiTable, isCalculator: true },
    blaty: { title: '🏔️ Blaty', component: BlatyTable, isCalculator: true },
    akcesoria: { title: '🛠️ Akcesoria', component: AkcesoriaTable, isCalculator: true },
    kalkulacja: { title: '💰 Pozostałe koszty', component: CalculationSection, isCalculator: true },
    podsumowanie: { title: '📊 Podsumowanie', component: SummaryDashboard, isCalculator: true },
    archive: { title: '📦 Archiwum', component: ArchivePage, isCalculator: false },
    materials: { title: '📚 Zarządzaj Materiałami', component: MaterialsManager, isCalculator: false },
  };

  return (
    <Layout>
      {({ activeTab, setActiveTab }) => {
        
        useEffect(() => {
          window.scrollTo(0, 0);
        }, [activeTab]);

        const isCalculatorTab = sections[activeTab]?.isCalculator;
        let componentToRender;

        if (!projectData && isCalculatorTab) {
          componentToRender = <WelcomeScreen setActiveTab={setActiveTab} resetProject={resetProject} />;
        } else {
          const ActiveComponent = sections[activeTab]?.component || WelcomeScreen;
          
          if (activeTab === 'projectSetup') {
            componentToRender = <ProjectSetupForm onComplete={() => setActiveTab('szafki')} />;
          } else if (activeTab === 'archive') {
            componentToRender = <ArchivePage setActiveTab={setActiveTab} />;
          } else {
            componentToRender = <ActiveComponent setActiveTab={setActiveTab} />;
          }
        }

        return (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {componentToRender}
            </div>
            {projectData && <ProjectStatusFooter />}
          </>
        );
      }}
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <MaterialsProvider>
          <ProjectProvider>
            <CookieConsentBanner />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
               <Route path="/regulamin" element={<LegalPage title="Regulamin Aplikacji Qalqly">{TermsContent}</LegalPage>} />
              <Route path="/polityka-prywatnosci" element={<LegalPage title="Polityka Prywatności i Plików Cookies">{PrivacyPolicyContent}</LegalPage>} />
              <Route path="/disclaimer" element={<LegalPage title="Zastrzeżenia Prawne">{DisclaimerContent}</LegalPage>} />

              <Route path="/subscribe" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
              <Route path="/cancel" element={<ProtectedRoute><CancelPage /></ProtectedRoute>} />
               <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <>
                      <MainCalculatorApp />
                      <Footer />
                    </>
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </ProjectProvider>
        </MaterialsProvider>
      </AuthProvider>
    </Router>
  );
}

const ProjectStatusFooter = () => {
  const { projectData, totals } = useProject();
  const projectName = projectData?.projectName || 'Nowy Projekt';
  const grossTotal = totals?.grossTotal || 0;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-between text-sm">
        <span className="text-gray-500">
          📂 Projekt: <span className="font-semibold text-gray-900 ml-1">{projectName}</span>
        </span>
        <span className="text-gray-500">
          💰 Wartość: <span className="font-bold text-brand-600 ml-1 text-base">
            {grossTotal.toFixed(2)} zł
          </span>
        </span>
    </div>
  );
};

export default App;