/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './*.html',
        './js/**/*.js',
    ],
    theme: {
        extend: {
            colors: {
                // Primary brand color - Forest Green (from logo)
                evergreen: {
                    50: '#f0f5f1',
                    100: '#dce8df',
                    200: '#b9d1bf',
                    300: '#8fb89a',
                    400: '#5c9a6b',
                    500: '#3d7a4d', // Mid forest green
                    600: '#2f5f3b',
                    700: '#254a2f',
                    800: '#1c3322', // PRIMARY - Dark Forest Green (logo)
                    900: '#152618',
                    950: '#0d1a0f', // Deepest forest (logo background)
                },
                // Neutral scale
                charcoal: {
                    50: '#F5F7F6',  // Warm Off-White (backgrounds)
                    100: '#e6ebe8',
                    200: '#ccd6d0',
                    300: '#9CA8A0', // Cool Gray (borders, dividers)
                    400: '#6b7a70',
                    500: '#4a5850', // Slate Gray (secondary text)
                    600: '#3a4540',
                    700: '#1F2A24', // Dark Charcoal (headers, body)
                    800: '#171f1a',
                    900: '#0f1512',
                    950: '#0a0f0c',
                },
                // Accent color - forest teal for links
                teal: {
                    50: '#e8f4f0',
                    100: '#d0e9e1',
                    200: '#a1d3c3',
                    300: '#72bda5',
                    400: '#4a9f84',
                    500: '#357a62', // Muted Forest Teal (links)
                    600: '#2a6350',
                    700: '#204c3d',
                    800: '#16362b',
                    900: '#0d201a',
                },
                // Gold/Amber accent (from logo)
                gold: {
                    50: '#fefbf3',
                    100: '#fcf4de',
                    200: '#f7e5b5',
                    300: '#f0d080', // Light gold (quote marks)
                    400: '#e5b84a', // Bright gold (numbers on dark, logo highlight)
                    500: '#c9a227', // Primary gold (eyebrows, accents, logo main)
                    600: '#a8871f', // Hover state
                    700: '#876c19',
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
                // Background colors (warm tones to complement forest green)
                offwhite: '#F5F7F6',
                cream: '#F7F9F7', // Warm off-white with green undertone
                ivory: '#f0f4f1',
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
