/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Add custom colors here
        primary: "#1C1C1D", // Gold
        secondary: "#BDC5DB", // Dodger Blue
        button: "#337DFF", // Orange Red
        t_color: "#BDC5DB",
      },
    },
  },
  plugins: [],
};
