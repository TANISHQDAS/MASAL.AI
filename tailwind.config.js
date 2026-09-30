/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aws: {
          dark: '#131a22',
          header: '#232f3e',
          subnav: '#161e2d',
          card: '#ffffff',
          darkcard: '#1e293b',
          bg: '#eaeded',
          darkbg: '#0f172a',
          orange: '#ec7211',
          'orange-hover': '#eb5f07',
          'orange-light': '#fff3e8',
          'orange-border': '#ff9900',
          blue: '#0972d3',
          'blue-hover': '#033160',
          'blue-light': '#f1faff',
          green: '#037f0c',
          'green-light': '#f2fcf3',
          red: '#d13212',
          'red-light': '#fdf3f1',
          border: '#d5dbdb',
          darkborder: '#334155',
          text: '#16191f',
          secondary: '#545b64',
        }
      },
      fontFamily: {
        sans: ['"Amazon Ember"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Amazon Ember Mono"', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'aws': '0 1px 1px 0 rgba(0, 28, 36, 0.3), 1px 1px 1px 0 rgba(0, 28, 36, 0.15)',
        'aws-hover': '0 4px 12px 0 rgba(0, 28, 36, 0.15)',
        'aws-card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
