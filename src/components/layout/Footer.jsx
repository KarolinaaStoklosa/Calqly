import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = "1.0.0";

  return (
    <footer className="w-full text-center p-6 text-[10px] text-gray-400 bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto space-y-3">
        
        {/* 1. BRANDING & LEGAL CONNECTION */}
        <div className="leading-relaxed opacity-80">
          <p>
            <span className="font-bold text-gray-500">Qalqly App</span> 
            <span className="mx-2">|</span> 
            <span>Powered by WOODLY GROUP</span>
          </p>
          <p className="mt-1">
            Usługa dostarczana przez: <strong>TREEO ART Bartłomiej Stokłosa, Sebastian Rzepecki S.C., NIP: 8681987513</strong>.
          </p>
        </div>

        {/* 2. DISCLAIMER (Krótki) */}
        <p className="italic text-gray-300 max-w-xl mx-auto">
          Narzędzie wspomagające wycenę. Użytkownik weryfikuje ostateczne koszty.
        </p>

        {/* 3. INFO TECHNICZNE + STRIPE */}
        <div className="pt-2 flex justify-center items-center gap-3 opacity-60">
           <span>&copy; {currentYear} v.{appVersion}</span>
           <span>|</span>
           <span>
             Secured by <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">Stripe</a>
           </span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;