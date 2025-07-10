/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores sólidos para Konrad Inmobiliaria
        primary: '#1e3a8a', // Azul marino sólido
        secondary: '#f59e0b', // Dorado sólido
        success: '#10b981', // Verde sólido
        warning: '#f59e0b', // Amarillo sólido
        error: '#ef4444', // Rojo sólido
        neutral: {
          light: '#f8fafc',
          medium: '#64748b',
          dark: '#1e293b',
        },
        background: '#ffffff',
        surface: '#f8fafc',
        text: {
          primary: '#1e293b',
          secondary: '#64748b',
          light: '#94a3b8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(5px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}; 