/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./public/**/*.html",
        "./public/**/*.js",
        "./src/**/*.{html,js,jsx,ts,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                'brand-purple': '#667eea',
                'brand-purple-dark': '#764ba2',
                'brand-red': '#ff6b6b',
                'brand-red-dark': '#ee5a24'
            },
            fontFamily: {
                'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif']
            }
        },
    },
    plugins: [],
} 