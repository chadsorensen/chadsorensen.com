import { createApp } from 'vue'
import { inject } from '@vercel/analytics'
import App from './App.vue'
import './styles/main.css'

createApp(App).mount('#app')

// Vercel Web Analytics: reports page views on Vercel, only logs in local dev
inject()
