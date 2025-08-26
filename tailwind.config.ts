import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'asu-maroon': '#8C1D40',
        'asu-gold': '#FFC627',
      },
    },
  },
  plugins: [],
}
export default config
