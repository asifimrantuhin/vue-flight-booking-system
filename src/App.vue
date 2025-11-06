<template>
  <div id="app">
    <!-- Header -->
    <header class="ticketok-header py-3">
      <div class="container">
        <div class="row align-items-center">
          <!-- Logo -->
          <div class="col-md-2">
            <div class="ticketok-logo d-flex align-items-center">
              <router-link to="/" class="text-decoration-none">
                <img src="/img/logo-main.png" alt="TicketOkay" class="me-2" height="30">
              </router-link>
            </div>
          </div>

          <!-- Tagline -->
          <div class="col-md-4">
            <div class="ticketok-text-14 ticketok-primary-color">
              Find your desired <strong>flight</strong> with best <strong>price</strong>
            </div>
          </div>

          <div class="col-md-2"></div>

          <!-- Country -->
          <div class="col-md-2 text-md-end mb-2 mb-md-0" v-if="!isAuthenticated">
            <div class="dropdown">
              <button class="btn ticketok-country-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <img src="/img/currency-icon.png" alt="USA" height="18" class="me-1"> USA
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="#"><img src="/img/currency-icon.png" height="16" class="me-2"> BD</a></li>
                <li><a class="dropdown-item" href="#"><img src="/img/currency-icon.png" height="16" class="me-2"> USA</a></li>
              </ul>
            </div>
          </div>

          <!-- Sign In / User Menu -->
          <div class="col-md-2 text-md-end">
            <div v-if="!isAuthenticated">
              <router-link to="/login" class="btn ticketok-btn-primary px-4 py-2 text-decoration-none">Sign in / Register</router-link>
            </div>
            <div v-else class="dropdown">
              <button class="btn ticketok-btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                {{ userName || 'Account' }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><router-link to="/my-bookings" class="dropdown-item">My Bookings</router-link></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" @click="logout" style="cursor: pointer;">Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>

    <router-view />

    <footer class="ticketok-footer mt-5">
      <div class="container">
        <div class="footer-content text-center">
          <p>&copy; 2025 TicketOkay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(false)
    const user = ref(null)

    onMounted(() => {
      const token = localStorage.getItem('token')
      isAuthenticated.value = !!token
      
      const userData = localStorage.getItem('user')
      if (userData) {
        user.value = JSON.parse(userData)
      }
    })

    const userName = computed(() => {
      if (user.value) {
        return `${user.value.first_name || ''} ${user.value.last_name || ''}`.trim()
      }
      return ''
    })

    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }

    return { isAuthenticated, user, userName, logout }
  }
}
</script>

<style>
/* Custom overrides for Bootstrap */
/* Styles handled by Bootstrap and ticketok styles */
</style>

