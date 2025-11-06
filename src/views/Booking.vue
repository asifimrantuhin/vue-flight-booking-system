<template>
  <div class="booking-page">
    <div class="container">
      <h2>Complete Your Booking</h2>
      
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border ticketok-primary-color" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="flight" class="booking-form">
        <div class="passenger-form">
          <h3>Passenger Details</h3>
          <div v-for="(passenger, index) in passengers" :key="index" class="passenger-card">
            <h4>Passenger {{ index + 1 }}</h4>
            <div class="form-row">
              <div class="form-group">
                <label>First Name</label>
                <input type="text" v-model="passenger.first_name" required>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input type="text" v-model="passenger.last_name" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Passport Number</label>
                <input type="text" v-model="passenger.passport" required>
              </div>
              <div class="form-group">
                <label>Date of Birth</label>
                <input type="date" v-model="passenger.dob" required>
              </div>
              <div class="form-group">
                <label>Gender</label>
                <select v-model="passenger.gender" required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="booking-summary">
          <h3>Booking Summary</h3>
          
          <!-- Flight Summary -->
          <div class="flight-summary-card">
            <div class="flight-summary-header">
              <h6>{{ flight.origin_code }} → {{ flight.destination_code }}</h6>
              <small class="text-muted">{{ route.query.trip_type === 'roundtrip' ? 'Round Trip' : 'One Way' }}</small>
            </div>
            
            <div class="flight-summary-body">
              <div class="airline-info-small">
                <img v-if="flight.airline_logo" :src="'/img/' + flight.airline_logo" :alt="flight.airline" height="20">
                <span>{{ flight.airline }} {{ flight.flight_number }}</span>
              </div>
              
              <div class="flight-times">
                <div class="time-row">
                  <span class="time">{{ formatTime(flight.departure_time) }}</span>
                  <span class="airport">{{ flight.origin_code }}</span>
                  <span class="date">{{ formatDate(flight.departure_time) }}</span>
                </div>
                <div class="duration-row">
                  <span>{{ flight.duration }}</span>
                </div>
                <div class="time-row">
                  <span class="time">{{ formatTime(flight.arrival_time) }}</span>
                  <span class="airport">{{ flight.destination_code }}</span>
                  <span class="date">{{ formatDate(flight.arrival_time) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Price Breakdown -->
          <div class="price-breakdown">
            <div class="price-row">
              <span>Price per traveler</span>
              <span>${{ formatPrice(flight.price) }}</span>
            </div>
            <div class="price-row">
              <span>Travelers ({{ passengers.length }})</span>
              <span>x{{ passengers.length }}</span>
            </div>
            <div class="divider"></div>
            <div class="price-row total">
              <span>Total Amount</span>
              <span class="price">${{ formatPrice(totalPrice) }}</span>
            </div>
          </div>

          <button @click="confirmBooking" class="confirm-btn">Confirm Booking</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'Booking',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const toast = useToast()
    
    // Get passenger count from URL query or default to 1
    const passengerCount = ref(parseInt(route.query.passengers) || 1)
    
    // Create array of passengers based on count
    const createPassengersArray = (count) => {
      const arr = []
      for (let i = 0; i < count; i++) {
        arr.push({
          first_name: '',
          last_name: '',
          passport: '',
          dob: '',
          gender: 'Male'
        })
      }
      return arr
    }
    
    const passengers = ref(createPassengersArray(passengerCount.value))
    const flight = ref(null)
    const loading = ref(true)

    const totalPrice = computed(() => {
      if (!flight.value) return 0
      return flight.value.price * passengers.value.length
    })

    const fetchFlightDetails = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/flights/${route.params.id}`)
        flight.value = response.data
      } catch (error) {
        toast.error('Error fetching flight details')
        router.push('/search')
      } finally {
        loading.value = false
      }
    }

    const confirmBooking = async () => {
      // Validate all passenger fields
      for (let i = 0; i < passengers.value.length; i++) {
        const p = passengers.value[i]
        if (!p.first_name || !p.last_name || !p.passport || !p.dob || !p.gender) {
          toast.error(`Please fill all details for Passenger ${i + 1}`)
          return
        }
      }

      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const response = await axios.post(
          'http://localhost:8080/api/v1/bookings',
          {
            flight_id: parseInt(route.params.id),
            passengers: passengers.value
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        toast.success('Booking confirmed!')
        router.push('/my-bookings')
      } catch (error) {
        toast.error(error.response?.data?.error || 'Booking failed')
      }
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat().format(price)
    }

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
    }

    onMounted(() => {
      fetchFlightDetails()
    })

    return { 
      passengers, 
      flight, 
      loading, 
      totalPrice, 
      confirmBooking, 
      formatPrice, 
      formatTime, 
      formatDate 
    }
  }
}
</script>

<style scoped>
.booking-page {
  padding: 2rem 0;
  min-height: 60vh;
}

.booking-form {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.passenger-form h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.passenger-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.passenger-card h4 {
  margin-bottom: 1rem;
  color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.form-group input,
.form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.booking-summary {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  padding: 2rem;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.booking-summary h3 {
  margin-bottom: 1.5rem;
  color: #333;
}

.flight-summary-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.flight-summary-header {
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.flight-summary-header h6 {
  margin: 0;
  color: #333;
  font-weight: 600;
}

.airline-info-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.flight-times {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.time-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-row .time {
  font-weight: 600;
  color: #333;
}

.time-row .airport {
  font-weight: 600;
  color: #009CFC;
}

.time-row .date {
  font-size: 0.85rem;
  color: #666;
}

.duration-row {
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  padding: 0.25rem 0;
}

.price-breakdown {
  margin-top: 1.5rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.9rem;
}

.price-row.total {
  font-weight: 600;
  font-size: 1.1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  margin-top: 0.5rem;
}

.price-row .price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #009CFC;
}

.divider {
  height: 1px;
  background: #eee;
  margin: 0.5rem 0;
}

.confirm-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .booking-form {
    grid-template-columns: 1fr;
  }
}
</style>

