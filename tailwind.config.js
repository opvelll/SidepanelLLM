/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/sidepanel/index.html',
    './src/pages/sidepanel/**/*.{js,ts,jsx,tsx}',
    './src/pages/options/index.html',
    './src/pages/options/**/*.{js,ts,jsx,tsx}',
    '../react-ai-chat-view/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
