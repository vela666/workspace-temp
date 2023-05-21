import {fileURLToPath, URL} from 'node:url'
import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
    root: './src/packages/',
    // root: resolve(__filename, 'src/packages/'),
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        open: true, // 是否自动在浏览器打开
    },
    build: {
        rollupOptions: {
            input: {
                // http://127.0.0.1:5173
                main: resolve(__dirname, 'src/packages/index.html'),
                // http://127.0.0.1:5173/page1.html
                page1: resolve(__dirname, 'src/packages/page1.html'),
            },
            /* input: {
               app1: resolve(__dirname, 'src/packages/index.html'),
               app2: resolve(__dirname, 'src/packages/app2.html'),
             },*/
            // input: [resolve(__dirname, 'src/packages/index.html'),  resolve(__dirname, 'src/packages/app2.html')],
            // input: ['./src/packages/index.html', './src/packages/page1.html'],
            output: {
                dir: './dist',
                // chunkFileNames: 'js/[name]-[hash].js',
                // entryFileNames: 'js/[name]-[hash].js',
                // assetFileNames: '[ext]/[name]-[hash].[ext]',
            }
        }
    }
})
