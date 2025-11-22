// tailwind.config.js (CommonJS 格式)
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0C', // 更暖的深黑色背景
        charcoal: {
          matte: '#16161A', // 卡片背景
        },
        muted: {
          gold: '#C2A878', // 高光强调色
          blue: '#5A7D9A', // 氛围背景色
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}