import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = "1.0.0"; // W przyszłości można to pobrać dynamicznie

  return (
    <footer className="w-full text-center p-6 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto space-y-2">
        <p>
          &copy; {currentYear} Qalqly. Wszystkie prawa zastrzeżone. | Wersja {appVersion}
        </p>
        <p className="italic">
          Aplikacja jest narzędziem wspomagającym. Użytkownik ponosi odpowiedzialność za weryfikację wycen.
        </p>
        <p>
          Płatności bezpiecznie realizowane przez <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-600 hover:text-blue-600">Stripe Inc.</a> | PCI DSS Level 1
        </p>
      </div>
    </footer>
  );
};

export default Footer;