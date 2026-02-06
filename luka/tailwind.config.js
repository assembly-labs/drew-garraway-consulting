/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.html',
        './js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand color - Dark Evergreen
                evergreen: {
                    50: '#e8f2ee',
                    100: '#d1e5dd',
                    200: '#a3cbb9',
                    300: '#75b196',
                    400: '#479773',
                    500: '#1E6F5C', // Success green / mid evergreen
                    600: '#186350',
                    700: '#125038',
                    800: '#0F3D2E', // PRIMARY - Dark Evergreen
                    900: '#0a2a1f',
                    950: '#051812',
                },
                // Neutral scale (replacing navy)
                charcoal: {
                    50: '#F4F6F8',  // Soft Off-White (backgrounds)
                    100: '#e4e8ec',
                    200: '#c8d0d8',
                    300: '#9CA3AF', // Cool Gray (borders, dividers)
                    400: '#737d8a',
                    500: '#4B5563', // Slate Gray (secondary text)
                    600: '#39424e',
                    700: '#1F2933', // Blue-Gray Charcoal (headers, body)
                    800: '#171e26',
                    900: '#0f1419',
                    950: '#0a0e12',
                },
                // Accent color - teal for links
                teal: {
                    50: '#e6f3f3',
                    100: '#cce7e7',
                    200: '#99cfcf',
                    300: '#66b7b8',
                    400: '#449a9b',
                    500: '#2C7A7B', // Muted Teal (links, secondary actions)
                    600: '#246566',
                    700: '#1c5051',
                    800: '#143b3c',
                    900: '#0c2627',
                },
                // Gold/Amber accent for highlights
                gold: {
                    50: '#fdf9ef',
                    100: '#faf0d5',
                    200: '#f4deaa',
                    300: '#edc974', // Light gold (quote marks)
                    400: '#e6b04a', // Bright gold (numbers on dark)
                    500: '#d4982e', // Primary gold (eyebrows, accents)
                    600: '#b87a22', // Hover state
                    700: '#995c1e',
                },
                // Highlight / Focus accent
                indigo: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#a78bfa',
                    500: '#8B5CF6', // Muted Indigo (focus states)
                    600: '#7c3aed',
                    700: '#6d28d9',
                },
                // Status colors
                success: '#1E6F5C',
                warning: '#B45309',
                error: '#991B1B',
                info: '#1D4ED8',
                // Background colors
                offwhite: '#F4F6F8',
                cream: '#F4F6F8', // Updated to match new palette
                ivory: '#eef1f4',
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
                'card': '0 1px 3px rgba(31, 41, 51, 0.06), 0 1px 2px rgba(31, 41, 51, 0.04)',
                'card-hover': '0 10px 25px rgba(31, 41, 51, 0.10), 0 4px 10px rgba(31, 41, 51, 0.06)',
                'nav': '0 1px 3px rgba(31, 41, 51, 0.05)',
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
