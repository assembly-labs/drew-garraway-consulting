import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Test environment
        environment: 'jsdom',

        // Test file patterns
        include: ['tests/**/*.test.js', 'tests/**/*.spec.js'],

        // Global test setup
        globals: true,

        // Coverage configuration
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            include: ['assets/js/**/*.js', 'scripts/**/*.js'],
            exclude: ['**/node_modules/**', '**/tests/**']
        },

        // Reporter configuration
        reporters: ['verbose'],

        // Watch mode exclusions
        watchExclude: ['**/node_modules/**', '**/content/**']
    }
});
