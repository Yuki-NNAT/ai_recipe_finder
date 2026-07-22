/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF4F87',
          soft: '#FF8FB1',
          light: '#FFD6E5',
          50: '#FFF1F6',
          100: '#FFE3ED',
          200: '#FFC7DA',
          300: '#FFA3C1',
          400: '#FF7AA4',
          500: '#FF4F87',
          600: '#F02D6C',
          700: '#C81E56',
          800: '#9E1846',
          900: '#7C163A',
        },
        secondary: '#FF8FB1',
        accent: '#FFD6E5',
        surface: '#FFFFFF',
        ink: '#202020',
        muted: '#777777',
        success: '#00C896',
        warning: '#FFC542',
        danger: '#FF5C7A',
        canvas: '#FFF7FA',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '18px',
        '2xl': '22px',
        '3xl': '28px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(255, 79, 135, 0.25)',
        'soft-lg': '0 24px 60px -20px rgba(255, 79, 135, 0.32)',
        'soft-sm': '0 6px 18px -8px rgba(255, 79, 135, 0.22)',
        glass: '0 8px 32px rgba(255, 79, 135, 0.12)',
        ring: '0 0 0 4px rgba(255, 79, 135, 0.14)',
      },
      backdropBlur: {
        glass: '18px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
        float: 'float 5s ease-in-out infinite',
        shimmer: 'shimmer 1.6s infinite',
        'typing-dot': 'typing-dot 1.2s infinite',
      },
    },
  },
  plugins: [],
};
