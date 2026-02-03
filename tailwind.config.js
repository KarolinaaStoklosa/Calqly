/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Twoja nowa paleta firmowa (zastępuje domyślny niebieski w elementach UI)
        brand: {
          50: '#fff5f2',  // Tła (bardzo jasny)
          100: '#ffebe6',
          200: '#ffd1c2',
          300: '#ffb299',
          400: '#ff7a4d',
          500: '#ff3d00', // Twój GŁÓWNY KOLOR (#ff3d00)
          600: '#e62e00', // Hover (ciemniejszy)
          700: '#cc2900', // Active
          800: '#a32000',
          900: '#851a00',
        },
        // Zachowujemy kolory sekcji (zostawiamy je bez zmian w kodzie, ale warto wiedzieć)
        // blue, green, purple, amber - one zostaną z domyślnego Tailwinda
      },
    },
  },
  plugins: [],
}