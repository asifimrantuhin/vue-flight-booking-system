<template>
  <div>
    <!-- Flight Search Section -->
    <section class="ticketok-search-section py-5">
      <div class="container">
        <div class="ticketok-search-box position-relative">
          
          <!-- Top Tab -->
          <div class="ticketok-tab text-center">
            <button class="ticketok-tab-btn">
              <img src="/img/flight-icon.svg" style="width: 36px;"/> FLIGHTS
            </button>
          </div>

          <!-- Inner Card -->
          <div class="ticketok-card p-4 shadow-sm rounded-4">
            
            <!-- Top Dropdowns -->
            <div class="d-flex flex-wrap gap-3 mb-4">
              <select class="form-select ticketok-mini-select" v-model="tripType">
                <option value="oneway">One Way</option>
                <option value="roundtrip">Round Trip</option>
              </select>
              <select class="form-select ticketok-mini-select" v-model.number="passengers">
                <option v-for="n in 9" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Adult' : 'Adults' }}</option>
              </select>
              <select class="form-select ticketok-mini-select" v-model="flightClass">
                <option value="Economy">Economy</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <!-- From / To Row -->
            <div class="row g-3 align-items-center">
              <div class="col-md-4">
                <div class="ticketok-location-box border rounded-3 p-3" @click="showOriginModal = true">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="from">
                      <div class="ticketok-muted-color ticketok-text-14">From</div>
                    </div>
                    <img v-if="selectedOrigin.flag" :src="selectedOrigin.flag" height="20" :alt="selectedOrigin.code">
                  </div>
                  <div>
                    <div class="fw-semibold ticketok-text-16" v-if="selectedOrigin.code">
                      {{ selectedOrigin.code }} - {{ selectedOrigin.name }}
                    </div>
                    <div class="ticketok-muted-color ticketok-text-14" v-if="selectedOrigin.airport">
                      {{ selectedOrigin.airport }}
                    </div>
                    <div v-else class="ticketok-muted-color">Click to select</div>
                  </div>
                </div>
              </div>

              <!-- Swap Button -->
              <div class="col-md-1 text-center">
                <button class="btn ticketok-swap-btn" @click="swapLocations">
                  <img src="/img/refresh-icon.svg" height="20" alt="Swap">
                </button>
              </div>

              <div class="col-md-4">
                <div class="ticketok-location-box border rounded-3 p-3" @click="showDestinationModal = true">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="to">
                      <div class="ticketok-muted-color ticketok-text-14">To</div>
                    </div>
                    <img v-if="selectedDestination.flag" :src="selectedDestination.flag" height="20" :alt="selectedDestination.code">
                  </div>
                  <div>
                    <div class="fw-semibold ticketok-text-16" v-if="selectedDestination.code">
                      {{ selectedDestination.code }} - {{ selectedDestination.name }}
                    </div>
                    <div class="ticketok-muted-color ticketok-text-14" v-if="selectedDestination.airport">
                      {{ selectedDestination.airport }}
                    </div>
                    <div v-else class="ticketok-muted-color">Click to select</div>
                  </div>
                </div>
              </div>

              <div class="col-md-3" v-if="tripType === 'roundtrip'">
                <div class="ticketok-location-box border rounded-3 p-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="flex-fill me-2">
                      <label class="ticketok-muted-color ticketok-text-10">DEPARTURE DATE</label>
                      <input type="date" v-model="departDateRaw" class="form-control form-control-sm border-0 p-0 fw-semibold ticketok-text-14" :min="minDate">
                      <div class="ticketok-muted-color ticketok-text-12">{{ getDayName(departDate) }}</div>
                    </div>
                    <div class="flex-fill ms-2">
                      <label class="ticketok-muted-color ticketok-text-10">RETURN DATE</label>
                      <input type="date" v-model="returnDateRaw" class="form-control form-control-sm border-0 p-0 fw-semibold ticketok-text-14" :min="departDateRaw">
                      <div class="ticketok-muted-color ticketok-text-12">{{ getDayName(returnDate) }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3" v-else>
                <div class="ticketok-location-box border rounded-3 p-3">
                  <div>
                    <label class="ticketok-muted-color ticketok-text-10">DEPARTURE DATE</label>
                    <input type="date" v-model="departDateRaw" class="form-control form-control-sm border-0 p-0 fw-semibold ticketok-text-14" :min="minDate">
                    <div class="ticketok-muted-color ticketok-text-12">{{ getDayName(departDate) }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Search -->
            <div class="row g-3 align-items-end mt-4">
              <div class="col-md-6 d-flex align-items-center">
                <a href="#" class="ticketok-muted-color ticketok-text-14 text-decoration-none">Advance Search</a>
              </div>
              <div class="col-md-6 text-end">
                <button class="btn ticketok-btn-search-main px-5 py-1" @click="searchFlights">
                  <img src="/img/search-button-icon.svg">SEARCH
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <div class="features py-5">
      <div class="container">
        <h2 class="text-center mb-5">Why Choose TicketOkay?</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="feature text-center">
              <h3>🔒 Secure Booking</h3>
              <p>Your data and payments are protected with industry-standard encryption.</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="feature text-center">
              <h3>💰 Best Prices</h3>
              <p>Compare prices from multiple airlines to get the best deals.</p>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="feature text-center">
              <h3>✈️ 24/7 Support</h3>
              <p>Our support team is available round the clock to help you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Airport Selection Modal -->
    <teleport to="body">
      <div class="modal fade" :class="{ 'show': showOriginModal || showDestinationModal, 'd-block': showOriginModal || showDestinationModal }" tabindex="-1" v-if="showOriginModal || showDestinationModal" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Select Airport</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <input type="text" v-model="searchQuery" class="form-control mb-3" placeholder="Search airports...">
              <div class="list-group" style="max-height: 400px; overflow-y: auto;">
                <button 
                  v-for="city in filteredCities" 
                  :key="city.code"
                  class="list-group-item list-group-item-action"
                  @click="selectAirport(city)"
                >
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{{ city.code }}</strong> - {{ city.name }}
                      <small class="d-block text-muted">{{ city.airport }}</small>
                    </div>
                    <img v-if="city.flag" :src="city.flag" height="20" :alt="city.code">
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'Home',
  setup() {
    const router = useRouter()
    
    const tripType = ref('oneway')
    const passengers = ref(1)
    const flightClass = ref('Economy')
    
    const showOriginModal = ref(false)
    const showDestinationModal = ref(false)
    const searchQuery = ref('')
    
    const selectedOrigin = ref({
      code: '',
      name: '',
      airport: '',
      flag: '/img/bangladesh-flag.svg'
    })
    
    const selectedDestination = ref({
      code: '',
      name: '',
      airport: '',
      flag: '/img/usa-flag.svg'
    })
    
    const cities = ref([])
    
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/flights/cities')
        if (response.data && response.data.cities) {
          // Map cities and add flag based on country
          cities.value = response.data.cities.map(city => ({
            ...city,
            flag: getFlagForCountry(city.country)
          }))
          
          // Set defaults if cities loaded
          if (cities.value.length > 0 && !selectedOrigin.value.code) {
            selectedOrigin.value = cities.value.find(c => c.code === 'DAC') || cities.value[0]
            selectedDestination.value = cities.value.find(c => c.code === 'ATL') || cities.value[1]
          }
        }
      } catch (error) {
        console.error('Error fetching cities:', error)
        // Fallback to hardcoded cities
        cities.value = [
          { code: 'DAC', name: 'Dhaka', airport: 'Hazrat Shahjalal Int. Airport', country: 'Bangladesh', flag: '/img/bangladesh-flag.svg' },
          { code: 'ATL', name: 'Atlanta', airport: 'Hartsfield–Jackson Atlanta International', country: 'USA', flag: '/img/usa-flag.svg' },
          { code: 'SIN', name: 'Singapore', airport: 'Singapore Changi Airport', country: 'Singapore', flag: '/img/usa-flag.svg' },
          { code: 'DXB', name: 'Dubai', airport: 'Dubai International Airport', country: 'UAE', flag: '/img/usa-flag.svg' },
          { code: 'LHR', name: 'London', airport: 'London Heathrow Airport', country: 'UK', flag: '/img/usa-flag.svg' },
          { code: 'JFK', name: 'New York', airport: 'John F. Kennedy International Airport', country: 'USA', flag: '/img/usa-flag.svg' },
          { code: 'LAX', name: 'Los Angeles', airport: 'Los Angeles International Airport', country: 'USA', flag: '/img/usa-flag.svg' },
          { code: 'NRT', name: 'Tokyo', airport: 'Narita International Airport', country: 'Japan', flag: '/img/usa-flag.svg' },
        ]
        selectedOrigin.value = cities.value[0]
        selectedDestination.value = cities.value[1]
      }
    }
    
    const getFlagForCountry = (country) => {
      const flagMap = {
        'Bangladesh': '/img/bangladesh-flag.svg',
        'USA': '/img/usa-flag.svg',
        'UK': '/img/usa-flag.svg',
        'UAE': '/img/usa-flag.svg',
        'Singapore': '/img/usa-flag.svg',
        'Japan': '/img/usa-flag.svg'
      }
      return flagMap[country] || '/img/usa-flag.svg'
    }
    
    const filteredCities = computed(() => {
      if (!searchQuery.value) return cities.value
      const query = searchQuery.value.toLowerCase()
      return cities.value.filter(city => 
        city.code.toLowerCase().includes(query) ||
        city.name.toLowerCase().includes(query) ||
        city.airport.toLowerCase().includes(query)
      )
    })
    
    const minDate = new Date().toISOString().split('T')[0]
    
    // Get default dates
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    const departDateRaw = ref(tomorrow.toISOString().split('T')[0])
    const returnDateRaw = ref(nextWeek.toISOString().split('T')[0])
    
    const departDate = computed(() => new Date(departDateRaw.value))
    const returnDate = computed(() => new Date(returnDateRaw.value))
    
    const formatDate = (date) => {
      if (!date) return ''
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
    
    const getDayName = (date) => {
      if (!date) return ''
      const d = typeof date === 'string' ? new Date(date) : date
      return d.toLocaleDateString('en-US', { weekday: 'long' })
    }
    
    const swapLocations = () => {
      const temp = { ...selectedOrigin.value }
      selectedOrigin.value = { ...selectedDestination.value }
      selectedDestination.value = temp
    }
    
    const selectAirport = (city) => {
      if (showOriginModal.value) {
        selectedOrigin.value = city
      } else if (showDestinationModal.value) {
        selectedDestination.value = city
      }
      closeModal()
    }
    
    const closeModal = () => {
      showOriginModal.value = false
      showDestinationModal.value = false
      searchQuery.value = ''
    }
    
    const searchFlights = () => {
      if (!selectedOrigin.value.code || !selectedDestination.value.code) {
        alert('Please select origin and destination')
        return
      }
      
      if (tripType.value === 'roundtrip' && !returnDateRaw.value) {
        alert('Please select return date')
        return
      }
      
      const searchParams = {
        origin: selectedOrigin.value.code,
        origin_name: selectedOrigin.value.name,
        destination: selectedDestination.value.code,
        destination_name: selectedDestination.value.name,
        depart_date: departDateRaw.value,
        passengers: passengers.value,
        class: flightClass.value,
        trip_type: tripType.value
      }
      
      // Add return date only if round trip
      if (tripType.value === 'roundtrip') {
        searchParams.return_date = returnDateRaw.value
      }
      
      router.push({
        path: '/search',
        query: searchParams
      })
    }
    
    // Watch trip type to reset return date if needed
    watch(tripType, (newVal) => {
      if (newVal === 'roundtrip') {
        // Ensure return date is after departure date
        if (new Date(returnDateRaw.value) <= new Date(departDateRaw.value)) {
          const newReturnDate = new Date(departDateRaw.value)
          newReturnDate.setDate(newReturnDate.getDate() + 1)
          returnDateRaw.value = newReturnDate.toISOString().split('T')[0]
        }
      }
    })
    
    // Fetch cities on mount
    onMounted(() => {
      fetchCities()
    })
    
    return {
      tripType,
      passengers,
      flightClass,
      selectedOrigin,
      selectedDestination,
      showOriginModal,
      showDestinationModal,
      searchQuery,
      cities,
      filteredCities,
      minDate,
      departDateRaw,
      returnDateRaw,
      departDate,
      returnDate,
      formatDate,
      getDayName,
      swapLocations,
      selectAirport,
      closeModal,
      searchFlights,
      fetchCities
    }
  }
}
</script>

<style scoped>
.features {
  background: #f8f9fa;
}

.feature {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.feature h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature p {
  color: #666;
  line-height: 1.6;
}

.date-info {
  cursor: pointer;
}

.ticketok-location-box {
  cursor: pointer;
  transition: all 0.3s;
}

.ticketok-location-box:hover {
  border-color: #009CFC !important;
  box-shadow: 0 2px 8px rgba(0, 156, 252, 0.1);
}
</style>
