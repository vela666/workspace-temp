import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
// global css
import './styles/globals.scss';
import autoRegisterComponent from '@/components'
const app = createApp(App)
autoRegisterComponent(app)
app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.mount('#app')
