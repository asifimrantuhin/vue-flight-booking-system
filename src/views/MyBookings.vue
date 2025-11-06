<template>
  <div class="my-bookings">
    <div class="container">
      <h2>My Bookings</h2>
      <div v-if="loading" class="loading">Loading your bookings...</div>
      
      <div v-else-if="bookings.length === 0" class="no-bookings">
        <p>You don't have any bookings yet.</p>
      </div>

      <div v-else>
        <div v-for="booking in bookings" :key="booking.id" class="booking-card">
          <div class="booking-header">
            <div>
              <h3>Booking Reference: {{ booking.booking_ref }}</h3>
              <p class="date">Booked on {{ formatDate(booking.created_at) }}</p>
            </div>
            <div class="status">
              <span :class="getStatusClass(booking.status)">{{ booking.status }}</span>
            </div>
          </div>

          <!-- Flight Details -->
          <div v-if="booking.flight" class="flight-section">
            <div class="section-header">
              <h4><i class="fa fa-plane"></i> Flight Information</h4>
            </div>
            <div class="flight-info">
              <div class="airline-info">
                <img v-if="booking.flight.airline_logo" :src="'/img/' + booking.flight.airline_logo" :alt="booking.flight.airline" height="30">
                <div>
                  <strong>{{ booking.flight.airline }}</strong>
                  <p class="mb-0">{{ booking.flight.flight_number }} • {{ booking.flight.class }}</p>
                </div>
              </div>
              <div class="route-info">
                <div class="route-item">
                  <div class="airport-code">{{ booking.flight.origin_code }}</div>
                  <div class="airport-name">{{ booking.flight.origin }}</div>
                  <div class="time">{{ formatTime(booking.flight.departure_time) }}</div>
                  <div class="date">{{ formatDateShort(booking.flight.departure_time) }}</div>
                </div>
                <div class="route-middle">
                  <span class="duration">{{ booking.flight.duration }}</span>
                  <div class="line"></div>
                </div>
                <div class="route-item">
                  <div class="airport-code">{{ booking.flight.destination_code }}</div>
                  <div class="airport-name">{{ booking.flight.destination }}</div>
                  <div class="time">{{ formatTime(booking.flight.arrival_time) }}</div>
                  <div class="date">{{ formatDateShort(booking.flight.arrival_time) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Passengers Details -->
          <div v-if="booking.passengers && booking.passengers.length > 0" class="passengers-section">
            <div class="section-header">
              <h4><i class="fa fa-users"></i> Passengers ({{ booking.passengers.length }})</h4>
            </div>
            <div class="passengers-list">
              <div v-for="(passenger, idx) in booking.passengers" :key="idx" class="passenger-item">
                <div class="passenger-number">{{ idx + 1 }}</div>
                <div class="passenger-details">
                  <strong>{{ passenger.first_name }} {{ passenger.last_name }}</strong>
                  <div class="passenger-meta">
                    <span><i class="fa fa-id-card"></i> {{ passenger.passport }}</span>
                    <span><i class="fa fa-birthday-cake"></i> {{ formatDate(passenger.dob) }}</span>
                    <span><i class="fa fa-venus-mars"></i> {{ passenger.gender }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Price and Actions -->
          <div class="booking-details">
            <div class="detail-item">
              <span>Total Amount</span>
              <span class="price">${{ formatPrice(booking.total_price) }}</span>
            </div>
            <div v-if="booking.status !== 'Cancelled'" class="cancel-btn">
              <button @click="cancelBooking(booking.id)" class="cancel-button">Cancel Booking</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'MyBookings',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const bookings = ref([])
    const loading = ref(true)

    const fetchBookings = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await axios.get('http://localhost:8080/api/v1/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        bookings.value = response.data.bookings
      } catch (error) {
        toast.error('Error fetching bookings')
      } finally {
        loading.value = false
      }
    }

    const cancelBooking = async (bookingId) => {
      const token = localStorage.getItem('token')
      if (!confirm('Are you sure you want to cancel this booking?')) return

      try {
        await axios.put(
          `http://localhost:8080/api/v1/bookings/${bookingId}/cancel`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )
        toast.success('Booking cancelled successfully')
        fetchBookings()
      } catch (error) {
        toast.error('Error cancelling booking')
      }
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const formatDateShort = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat().format(price)
    }

    const getStatusClass = (status) => {
      return {
        'badge': true,
        'badge-confirmed': status === 'Confirmed',
        'badge-pending': status === 'Pending',
        'badge-cancelled': status === 'Cancelled'
      }
    }

    onMounted(() => {
      fetchBookings()
    })

    return { bookings, loading, cancelBooking, formatDate, formatDateShort, formatTime, formatPrice, getStatusClass }
  }
}
</script>

<style scoped>
.my-bookings {
  padding: 2rem 0;
  min-height: 60vh;
}

.loading, .no-bookings {
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #666;
}

.booking-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;
}

.booking-header h3 {
  color: #333;
  margin-bottom: 0.5rem;
}

.date {
  color: #666;
  font-size: 0.9rem;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.badge-confirmed {
  background: #d4edda;
  color: #155724;
}

.badge-pending {
  background: #fff3cd;
  color: #856404;
}

.badge-cancelled {
  background: #f8d7da;
  color: #721c24;
}

.booking-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
}

.cancel-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.cancel-button:hover {
  background: #c82333;
}

.section-header {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #009CFC;
}

.section-header h4 {
  color: #009CFC;
  font-size: 1.1rem;
  margin: 0;
}

.section-header i {
  margin-right: 0.5rem;
}

.flight-section {
  margin: 1.5rem 0;
}

.airline-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.airline-info img {
  border-radius: 5px;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.route-item {
  flex: 1;
}

.airport-code {
  font-size: 1.5rem;
  font-weight: bold;
  color: #009CFC;
  margin-bottom: 0.25rem;
}

.airport-name {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.time {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.date {
  font-size: 0.85rem;
  color: #999;
}

.route-middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
}

.duration {
  font-size: 0.9rem;
  color: #666;
  white-space: nowrap;
}

.line {
  width: 60px;
  height: 2px;
  background: #ccc;
  position: relative;
}

.line::before {
  content: '';
  position: absolute;
  right: -5px;
  top: -3px;
  width: 0;
  height: 0;
  border-left: 6px solid #ccc;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.passengers-section {
  margin: 1.5rem 0;
}

.passengers-list {
  display: grid;
  gap: 1rem;
}

.passenger-item {
  display: flex;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #009CFC;
}

.passenger-number {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #009CFC;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.passenger-details {
  flex: 1;
}

.passenger-details strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.1rem;
}

.passenger-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
}

.passenger-meta span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.passenger-meta i {
  color: #009CFC;
}
</style>

