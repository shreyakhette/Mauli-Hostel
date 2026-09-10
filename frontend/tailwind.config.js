/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wine: {
          50: '#FDF5F6',
          100: '#F9E6E9',
          200: '#F4C9D1',
          300: '#E99CB0',
          400: '#D86685',
          500: '#BF3B62',
          600: '#9F2447',
          700: '#821937',
          800: '#6B172E',
          900: '#530D1E',
          950: '#330510'
        },
        brand: {
          50: '#FDF5F6',
          100: '#F9E6E9',
          200: '#F4C9D1',
          300: '#E99CB0',
          400: '#D86685',
          500: '#BF3B62',
          600: '#9F2447',
          700: '#821937',
          800: '#6B172E',
          900: '#530D1E',
          950: '#330510'
        },
        gold: {
          50: '#FFFDF5',
          100: '#FEF9E7',
          200: '#FDF0C5',
          300: '#FCE49B',
          400: '#F8D15B',
          500: '#F5BE27',
          600: '#D99B0F',
          700: '#B0750A',
          800: '#8D5B0E',
          900: '#744910'
        },
        surface: {
          DEFAULT: '#F8FAFC',
          50: '#FFFFFF',
          100: '#F1F5F9',
          200: '#E2E8F0',
          divider: '#E2E8F0',
          card: '#FFFFFF',
          charcoal: '#0F172A',
          muted: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif']
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 16px -2px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)',
        'elevated': '0 20px 30px -10px rgba(15, 23, 42, 0.08), 0 10px 15px -3px rgba(15, 23, 42, 0.04)'
      }
    },
  },
  plugins: [],
}
