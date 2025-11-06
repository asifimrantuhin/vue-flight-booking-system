import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import App from './App.vue'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import SearchResults from './views/SearchResults.vue'
import FlightDetails from './views/FlightDetails.vue'
import Booking from './views/Booking.vue'
import MyBookings from './views/MyBookings.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/search', component: SearchResults },
  { path: '/flight-details/:id', component: FlightDetails },
  { path: '/booking/:id', component: Booking },
  { path: '/my-bookings', component: MyBookings }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 3000
})
app.mount('#app')

