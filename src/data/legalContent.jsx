// src/data/legalContent.jsx

import React from 'react';

// --- KOMPONENTY STYLIZUJĄCE (TYPOGRAFIA) ---
const H2 = ({ children }) => (
  <h2 className="text-xl md:text-2xl font-bold text-gray-800 border-b pb-2 mb-4 mt-8 first:mt-0">
    {children}
  </h2>
);

const H3 = ({ children }) => (
  <h3 className="text-lg md:text-xl font-semibold text-gray-700 mt-6 mb-2">
    {children}
  </h3>
);

const P = ({ children }) => (
  <p className="mb-4 leading-relaxed text-gray-600 text-sm md:text-base text-justify">
    {children}
  </p>
);

const Ul = ({ children }) => (
  <ul className="list-disc list-inside space-y-1 mb-4 pl-2 text-gray-600 text-sm md:text-base">
    {children}
  </ul>
);

const ImportantBlock = ({ title, children, type = 'blue' }) => {
  const styles = type === 'warning' 
    ? "bg-amber-50 border-amber-500 text-amber-900" 
    : "bg-blue-50 border-blue-500 text-gray-800";

  return (
    <div className={`p-4 border-l-4 rounded-r-lg my-6 ${styles}`}>
      {title && <p className="font-bold mb-2 uppercase text-xs tracking-wider">{title}</p>}
      <div className="text-sm md:text-base">{children}</div>
    </div>
  );
};

// --- DANE FIRMY (UŻYWANE W TEKSTACH) ---
const COMPANY_DATA = {
  name: "TREEO ART Bartłomiej Stokłosa, Sebastian Rzepecki S.C.",
  address: "ul. Limanowska 28A, 32-720 Nowy Wiśnicz",
  nip: "868-198-75-13",
  email: "b.stoklosa@woodlygroup.pl"
};


// ==========================================
// 1. REGULAMIN (TERMS)
// ==========================================
export const TermsContent = (
  <>
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900">REGULAMIN ŚWIADCZENIA USŁUG</h1>
      <p className="text-gray-500 text-sm">w ramach aplikacji "QALQLY"</p>
    </div>

    <H2>§ 1. Postanowienia Ogólne</H2>
    <P>
      1. Niniejszy Regulamin określa zasady korzystania z aplikacji internetowej <strong>Qalqly</strong> (zwanej dalej "Aplikacją"), dostępnej w modelu SaaS.<br />
      2. Właścicielem marki "WOODLY GROUP" oraz Aplikacji jest Bartłomiej Stokłosa.<br />
      3. Operatorem Aplikacji, Sprzedawcą usług oraz podmiotem odpowiedzialnym za obsługę płatności i wystawianie faktur VAT jest: <br />
      <strong>{COMPANY_DATA.name}</strong>, {COMPANY_DATA.address}, NIP: {COMPANY_DATA.nip}, e-mail: {COMPANY_DATA.email} (zwany dalej "Usługodawcą").<br />
      4. Użytkownikiem jest każdy podmiot (osoba fizyczna prowadząca działalność gospodarczą, osoba prawna), który korzysta z Aplikacji. Usługa skierowana jest przede wszystkim do klientów biznesowych (B2B).
    </P>

    <H2>§ 2. Wymagania Techniczne</H2>
    <P>Do korzystania z Aplikacji niezbędne są:</P>
    <Ul>
      <li>Urządzenie z dostępem do Internetu.</li>
      <li>Aktualna przeglądarka internetowa (zalecane: Google Chrome, Firefox, Safari, Edge).</li>
      <li>Włączona obsługa JavaScript oraz plików Cookies.</li>
      <li>Aktywne konto e-mail.</li>
    </Ul>

    <H2>§ 3. Rodzaj i Zakres Usług</H2>
    <P>
      1. Aplikacja Qalqly służy do wspomagania procesu wyceny mebli i stolarki, zarządzania materiałami oraz generowania ofert handlowych.<br/>
      2. Dostęp do pełnej funkcjonalności Aplikacji jest odpłatny, z zastrzeżeniem § 4 (Okres Próbny).
    </P>

    <H2>§ 4. Rejestracja i Okres Próbny</H2>
    <P>
      1. Rejestracja w Aplikacji jest dobrowolna i bezpłatna.<br/>
      2. Każdemu nowemu Użytkownikowi przysługuje jednorazowy, bezpłatny okres próbny ("Trial") trwający <strong>7 dni</strong> od momentu rejestracji.<br/>
      3. W trakcie okresu próbnego Użytkownik ma dostęp do pełnej funkcjonalności Aplikacji bez konieczności podawania danych karty płatniczej.<br/>
      4. Po upływie 7 dni dostęp do funkcji kalkulacyjnych zostaje zablokowany do momentu wykupienia płatnego planu.
    </P>

    <H2>§ 5. Płatności i Subskrypcja</H2>
    <P>
      1. Płatności realizowane są za pośrednictwem bezpiecznego operatora płatności <strong>Stripe Inc.</strong><br/>
      2. Usługodawca ({COMPANY_DATA.name}) nie gromadzi pełnych danych kart płatniczych Użytkowników.<br/>
      3. Faktury VAT wystawiane są przez Usługodawcę i przesyłane drogą elektroniczną.<br/>
      4. Subskrypcja odnawialna może zostać anulowana przez Użytkownika w dowolnym momencie.
    </P>

    <H2>§ 6. Odpowiedzialność i Zastrzeżenia</H2>
    <ImportantBlock title="WAŻNE OSTRZEŻENIE" type="warning">
      <P>
        Aplikacja Qalqly jest narzędziem pomocniczym. Wyniki obliczeń są szacunkowe. 
        <strong> Usługodawca nie ponosi odpowiedzialności za:</strong>
      </P>
      <Ul>
        <li>Błędy w wycenach wynikające z błędnego wprowadzenia danych przez Użytkownika.</li>
        <li>Decyzje biznesowe, finansowe lub handlowe podjęte na podstawie wyników z Aplikacji.</li>
        <li>Straty finansowe wynikające z różnic między wyceną a rzeczywistymi kosztami.</li>
      </Ul>
      <P>
        Użytkownik zobowiązany jest do każdorazowej weryfikacji oferty przed przedstawieniem jej swojemu klientowi.
      </P>
    </ImportantBlock>

    <H2>§ 7. Reklamacje</H2>
    <P>
      1. Reklamacje należy zgłaszać na adres e-mail: {COMPANY_DATA.email}.<br/>
      2. Usługodawca rozpatrzy reklamację w terminie 14 dni od jej otrzymania.
    </P>

    <H2>§ 8. Postanowienia Końcowe</H2>
    <P>
      W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie mają przepisy Kodeksu Cywilnego. Sądem właściwym jest sąd właściwy dla siedziby Usługodawcy.
    </P>
  </>
);


// ==========================================
// 2. POLITYKA PRYWATNOŚCI
// ==========================================
export const PrivacyPolicyContent = (
  <>
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900">POLITYKA PRYWATNOŚCI</h1>
      <p className="text-gray-500 text-sm">Ochrona danych i pliki cookies</p>
    </div>

    <H2>1. Administrator Danych</H2>
    <P>
      Administratorem Państwa danych osobowych jest:<br/>
      <strong>{COMPANY_DATA.name}</strong><br/>
      {COMPANY_DATA.address}<br/>
      NIP: {COMPANY_DATA.nip}<br/>
      Kontakt: {COMPANY_DATA.email}
    </P>

    <H2>2. Jakie dane przetwarzamy?</H2>
    <Ul>
      <li><strong>Adres e-mail</strong> (niezbędny do logowania i odzyskiwania hasła).</li>
      <li><strong>Dane do faktury</strong> (Nazwa firmy, NIP, Adres) – w przypadku zakupu płatnego planu.</li>
      <li><strong>Dane techniczne</strong> (adres IP, logi) w celach bezpieczeństwa.</li>
      <li><strong>Dane projektowe</strong> – wprowadzane wymiary i materiały (przetwarzane tylko w celu kalkulacji).</li>
    </Ul>

    <H2>3. Cel przetwarzania</H2>
    <P>
      Dane przetwarzane są w celu realizacji usługi (dostęp do kalkulatora), obsługi płatności i księgowości (faktury VAT) oraz obsługi technicznej/reklamacyjnej.
    </P>

    <H2>4. Odbiorcy danych</H2>
    <P>Państwa dane mogą być powierzane zaufanym podmiotom:</P>
    <Ul>
      <li><strong>Google (Firebase)</strong> – infrastruktura chmurowa i baza danych.</li>
      <li><strong>Stripe Inc.</strong> – bezpieczne płatności online.</li>
      <li><strong>Biuro księgowe</strong> – obsługa podatkowa Usługodawcy.</li>
    </Ul>

    <H2>5. Prawa Użytkownika (RODO)</H2>
    <P>
      Przysługuje Państwu prawo do dostępu do swoich danych, ich sprostowania, usunięcia ("prawo do bycia zapomnianym"), ograniczenia przetwarzania oraz wniesienia skargi do UODO.
    </P>

    <H2>6. Pliki Cookies</H2>
    <P>
      Aplikacja wykorzystuje pliki Cookies w celu utrzymania sesji zalogowanego Użytkownika oraz zapamiętywania ustawień projektów. Można je wyłączyć w ustawieniach przeglądarki, co może jednak utrudnić korzystanie z Aplikacji.
    </P>
  </>
);


// ==========================================
// 3. DISCLAIMER (NOTA PRAWNA)
// ==========================================
export const DisclaimerContent = (
  <>
    <div className="text-center mb-8">
      <h1 className="text-2xl font-bold text-gray-900">NOTA PRAWNA (DISCLAIMER)</h1>
      <p className="text-gray-500 text-sm">Wyłączenie odpowiedzialności</p>
    </div>

    <H2>Charakter Aplikacji</H2>
    <P>
      Aplikacja Qalqly, dostarczana pod marką <strong>WOODLY GROUP</strong>, jest specjalistycznym oprogramowaniem wspomagającym proces wyceny. Należy jednak pamiętać, że jest to <strong>wyłącznie narzędzie pomocnicze</strong>. Algorytmy opierają się na danych wejściowych zdefiniowanych przez Użytkownika.
    </P>

    <ImportantBlock title="ODPOWIEDZIALNOŚĆ UŻYTKOWNIKA" type="blue">
      <P>Użytkownik ponosi pełną i wyłączną odpowiedzialność za:</P>
      <Ul>
        <li>Weryfikację wyników wycen przed przedstawieniem ich klientom końcowym.</li>
        <li>Sprawdzenie aktualności cen materiałów i stawek robocizny.</li>
        <li>Dostosowanie marż do specyfiki projektu.</li>
        <li>Wszelkie decyzje biznesowe podjęte na podstawie wyliczeń Aplikacji.</li>
      </Ul>
    </ImportantBlock>

    <H2>Wyłączenie Odpowiedzialności Dostawcy</H2>
    <P>
      Operator Aplikacji – <strong>{COMPANY_DATA.name}</strong> – nie ponosi odpowiedzialności za:
    </P>
    <Ul>
      <li>Dokładność wycen w stosunku do rzeczywistego zużycia materiału (odpady, błędy rozkroju).</li>
      <li>Błędy powstałe w wyniku wprowadzenia niepoprawnych cen przez Użytkownika.</li>
      <li>Rentowność ofert handlowych wystawianych przez Użytkownika.</li>
    </Ul>

    <H2>Prawa Autorskie</H2>
    <P>
      Właścicielem praw majątkowych do marki WOODLY GROUP jest Bartłomiej Stokłosa. Operatorem upoważnionym do sprzedaży subskrypcji jest {COMPANY_DATA.name}. Kopiowanie kodu lub elementów graficznych bez zgody jest zabronione.
    </P>
    
    <ImportantBlock title="AKCEPTACJA" type="warning">
      <P>
        Korzystanie z Aplikacji jest równoznaczne z pełną akceptacją powyższych zastrzeżeń oraz Regulaminu.
      </P>
    </ImportantBlock>
  </>
);