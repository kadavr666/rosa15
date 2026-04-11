import { defineConfig } from 'astro/config';

export default defineConfig({
    devToolbar: { enabled: false },
    vite: {
        server: {
            proxy: {
                '/studio': {
                    target: 'http://localhost:3333',
                    changeOrigin: true,
                    ws: true,
                },
            },
        },
    },
});
