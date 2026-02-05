/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.html',
        './js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                navy: {
                    50: '#f0f3f9',
                    100: '#d9e0f0',
                    200: '#b3c1e0',
                    300: '#8da2d1',
                    400: '#6683c1',
                    500: '#4064b2',
                    600: '#33508e',
                    700: '#263c6b',
                    800: '#1a2847',
                    900: '#0d1424',
                    950: '#0a0f1a',
                },
                slate: {
                    850: '#192033',
                },
                gold: {
                    50: '#fdf9ef',
                    100: '#f9f0d5',
                    200: '#f2deaa',
                    300: '#eac974',
                    400: '#e2b04a',
                    500: '#d4982e',
                    600: '#b87a22',
                    700: '#995c1e',
                    800: '#7d4a1f',
                    900: '#673d1d',
                    950: '#3b1f0d',
                },
                copper: {
                    400: '#c78d6d',
                    500: '#b87333',
                    600: '#a3602a',
                },
                cream: '#FAFAF8',
                ivory: '#F5F5F0',
            },
            fontFamily: {
                heading: ['"Playfair Display"', 'Georgia', 'serif'],
                body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            },
            fontSize: {
                '5xl': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
                '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                '7xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
            },
            spacing: {
                18: '4.5rem',
                22: '5.5rem',
            },
            boxShadow: {
                'card': '0 1px 3px rgba(13, 20, 36, 0.06), 0 1px 2px rgba(13, 20, 36, 0.04)',
                'card-hover': '0 10px 25px rgba(13, 20, 36, 0.08), 0 4px 10px rgba(13, 20, 36, 0.04)',
                'nav': '0 1px 3px rgba(13, 20, 36, 0.05)',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.6s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
};
