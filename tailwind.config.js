/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        weather: {
          bgDark: "#0C0B17",
          bgBlue: "#3C6CC4",
          textWhite: "#FEFEFE",
          borderWhite: "rgba(254, 254, 254, 0.4)",
          // Pastel colors
          pastelBlue: "#A8C5EC",
          pastelGreen: "#C6ECD9",
          pastelYellow: "#FCEBBE",
          pastelOrange: "#FAD8C2",
          pastelRed: "#F7C2C9",
          pastelPurple: "#D4C7F5",
          pastelPink: "#F6C8EC",
          pastelGray: "#D2D5DD",
        }
      },
      fontFamily: {
        switzer: ["Switzer", "System", "sans-serif"],
      }
    },
  },
  plugins: [],
}
