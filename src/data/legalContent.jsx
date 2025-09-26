// src/data/legalContent.jsx

import React from 'react';

const H2 = ({ children }) => <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4 mt-8 first:mt-0">{children}</h2>;
const H3 = ({ children }) => <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-3">{children}</h3>;
const P = ({ children }) => <p className="mb-4 leading-relaxed text-gray-600">{children}</p>;
const Ul = ({ children }) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-600">{children}</ul>;
const ImportantBlock = ({ title, children }) => (
  <div className="p-4 bg-gray-50 border-l-4 border-blue-500 rounded-r-lg my-6">
    <p className="font-semibold text-gray-800">{title}</p>
    {children}
  </div>
);


export const TermsContent = (
  <>
    <H2>§ 1 DEFINICJE</H2>
    <P>
      1. Użytkownik - osoba fizyczna prowadząca działalność gospodarczą lub osoba prawna, która rejestruje się w Aplikacji i korzysta z Usług zgodnie z niniejszym Regulaminem.<br />
      2. Konsument - osoba fizyczna dokonująca czynności prawnej niezwiązanej bezpośrednio z jej działalnością gospodarczą lub zawodową.<br />
      3. Konto - indywidualny panel użytkownika w Aplikacji, utworzony po dokonaniu Rejestracji.<br />
      4. Rejestracja - proces utworzenia Konta przez wypełnienie formularza rejestracyjnego i akceptację Regulaminu.<br />
      5. Aplikacja - system informatyczny Calqly dostępny pod adresem calqly.woodlygroup.pl<br />
      6. Usługi - usługi cyfrowe świadczone przez Dostawcę za pośrednictwem Aplikacji.<br />
      7. Dostawca - Bartłomiej Stokłosa prowadzący działalność gospodarczą pod firmą [NAZWA SPÓŁKI] z siedzibą w Nowy Wiśnicz, adres: [ADRES SPÓŁKI], NIP: [NIP SPÓŁKI], REGON: [REGON SPÓŁKI].<br />
      8. Subskrypcja - płatny dostęp do Usług na określony okres.<br />
      9. Okres Próbny - bezpłatny 7-dniowy dostęp do Usług dla nowych Użytkowników.<br />
      10. Umowa - umowa o świadczenie usług cyfrowych zawarta między Dostawcą a Użytkownikiem.
    </P>

    <H2>§ 2 ZASADY OGÓLNE</H2>
    <P>
      1. Niniejszy Regulamin określa zasady rejestracji, korzystania z Aplikacji, świadczenia Usług, dokonywania płatności, anulowania Subskrypcji oraz składania reklamacji.<br />
      2. Korzystanie z Aplikacji i Usług oznacza akceptację niniejszego Regulaminu.<br />
      3. W sprawach nieuregulowanych w Regulaminie zastosowanie mają przepisy prawa polskiego.
    </P>
  </>
);

export const PrivacyPolicyContent = (
  <>
    <H2>1. POSTANOWIENIA OGÓLNE</H2>
    <P>Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych, które zostały pozyskane od użytkowników za pośrednictwem aplikacji Calqly.</P>
    
    <H2>2. ADMINISTRATOR DANYCH</H2>
    <P>Administratorem Danych Osobowych jest Bartłomiej Stokłosa prowadzący działalność gospodarczą pod firmą [NAZWA SPÓŁKI] z siedzibą w Nowy Wiśnicz, adres: [ADRES SPÓŁKI], NIP: [NIP SPÓŁKI], REGON: [REGON SPÓŁKI]. Kontakt: b.stoklosa@gmail.com.</P>
    
    <H2>3. RODZAJE PRZETWARZANYCH DANYCH</H2>
    <H3>3.1 Dane rejestracyjne</H3>
    <P>Cel: Utworzenie i zarządzanie kontem użytkownika. Podstawa prawna: Wykonanie umowy (art. 6 ust. 1 lit. b RODO). Podanie danych: Wymagane do korzystania z Aplikacji.</P>
    
    <H3>3.2 Dane płatnicze</H3>
    <P>Cel: Obsługa płatności i rozliczeń subskrypcji. Podstawa prawna: Wykonanie umowy. Podanie danych: Wymagane do aktywacji płatnej subskrypcji.</P>
    
    <H2>4. PODMIOTY PRZETWARZAJĄCE DANE</H2>
    <P>Dane mogą być przekazywane następującym podmiotom trzecim:</P>
    <Ul>
      <li><b>Stripe Inc.</b> - w celu przetwarzania płatności.</li>
      <li><b>Google Cloud Platform</b> - w celu hostingu aplikacji i przechowywania danych.</li>
      <li><b>Biuro rachunkowe</b> - w celu prowadzenia księgowości.</li>
    </Ul>
  </>
);

export const DisclaimerContent = (
    <>
      <H2>CHARAKTER APLIKACJI</H2>
      <P>Aplikacja Calqly jest narzędziem wspomagającym proces tworzenia wycen stolarskich i nie zastępuje profesjonalnego doświadczenia, wiedzy branżowej ani indywidualnej oceny każdego projektu przez użytkownika.</P>
      
      <ImportantBlock title="UŻYTKOWNIK PONOSI PEŁNĄ I WYŁĄCZNĄ ODPOWIEDZIALNOŚĆ ZA:">
        <Ul>
            <li>Weryfikację wyników wycen przed przedstawieniem ich klientom końcowym.</li>
            <li>Sprawdzenie aktualności cen materiałów, kosztów robocizny i innych składników kalkulacji.</li>
            <li>Dostosowanie marż do lokalnych warunków rynkowych i specyfiki projektu.</li>
            <li>Decyzje biznesowe podejmowane na podstawie wyników z aplikacji.</li>
        </Ul>
      </ImportantBlock>
      
      <H2>WYŁĄCZENIA ODPOWIEDZIALNOŚCI DOSTAWCY</H2>
      <P>DOSTAWCA APLIKACJI NIE PONOSI ODPOWIEDZIALNOŚCI ZA:</P>
      <H3>Błędy i niedokładności</H3>
      <Ul>
        <li>Błędy w wycenach wynikające z nieprawidłowych danych wprowadzonych przez użytkownika.</li>
        <li>Niedokładności w kalkulacjach spowodowane specyfiką lokalnych warunków.</li>
      </Ul>
      <H3>Skutki finansowe</H3>
       <Ul>
        <li>Straty finansowe wynikające z nieprawidłowych wycen.</li>
        <li>Utracone zyski z powodu błędnych kalkulacji.</li>
      </Ul>
      
      <H2>CHARAKTER INFORMACYJNY</H2>
      <P>Wszystkie dane, kalkulacje i informacje techniczne udostępniane przez aplikację mają charakter wyłącznie informacyjny i stanowią wskazówki dla użytkownika, a nie wiążące wyceny.</P>
    </>
);