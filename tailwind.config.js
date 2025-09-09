/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#005A9C',
          'hover': '#004a80',
        },
        'fondo': '#f4f7fa',
        'card': '#ffffff',
        'texto-principal': '#333333',
        'texto-secundario': '#6c757d',
        'borde': '#dee2e6',
        'exito': {
          DEFAULT: '#28a745',
          'fondo': '#f0f9f2',
        },
        'peligro': {
          DEFAULT: '#dc3545',
          'fondo': '#fef7f7',
        },
        'alerta': {
          'borde': '#ffc107',
        },
      }
    },
  },
  plugins: [],
}