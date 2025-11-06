<template>
  <div>
    <!-- Search Summary Bar -->
    <section class="ticketok-summary pt-2">
      <div class="container">
        <div class="summary-details d-flex justify-content-between align-items-center">
          <div>
            <span class="ticketok-text-10 text-uppercase">Search Result For</span>
            <h5 class="fw-semibold mb-0">{{ searchOrigin }} — {{ searchDestination }}</h5>
            <small class="text-muted">{{ tripType }} | {{ passengers }} {{ passengers === 1 ? 'Adult' : 'Adults' }} | {{ flightClass }} | Multiple Airlines</small>
          </div>
          <div class="d-flex align-items-center gap-3">
            <button class="btn ticketok-btn-white text-uppercase" @click="goBackHome">Modify</button>
            <button class="btn ticketok-btn-white align-items-center">
              <span class="remaining-text">Time Remaining</span>
              <span class="remaining-time">18:24</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-4">
      <div class="container">
        <div class="row">
          <!-- Sidebar Filters -->
          <aside class="col-md-3">
            <!-- Filtered Items -->
            <div class="filter-card rounded-3 px-4 py-3 mb-3">
              <div class="d-flex justify-content-between">
                <h6 class="fw-semibold mb-3">Filter Results</h6>
                <h6 class="fw-semibold mb-3 ticketok-primary-color cursor-pointer" @click="resetFilters">RESET</h6>
              </div>
              <div class="mb-3" v-if="activeFilters.length > 0">
                <button 
                  type="button" 
                  class="btn ticketok-label-btn ticketok-text-12 mb-1 me-1" 
                  v-for="(filter, idx) in activeFilters" 
                  :key="idx"
                  @click="removeFilter(filter.type, filter.value)"
                >
                  <span>{{ filter.label }}</span>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div v-else class="text-muted ticketok-text-12">No filters applied</div>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-card rounded-3 px-4 py-3 mb-3">
              <h6 class="fw-semibold mb-3">Price Range</h6>
              <div class="mb-3">
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="lowRangeFare" v-model="filters.priceRange.low">
                      <label class="form-check-label mb-0" for="lowRangeFare">Low Range fare</label>
                    </div>
                    <span>{{ priceCounts.low }}</span>
                  </div>
                </div>
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="midRangeFare" v-model="filters.priceRange.mid">
                      <label class="form-check-label mb-0" for="midRangeFare">Mid range fare</label>
                    </div>
                    <span>{{ priceCounts.mid }}</span>
                  </div>
                </div>
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="higherRangeFare" v-model="filters.priceRange.high">
                      <label class="form-check-label mb-0" for="higherRangeFare">Higher range fare</label>
                    </div>
                    <span>{{ priceCounts.high }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stops Filter -->
            <div class="filter-card rounded-3 px-4 py-3 mb-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-semibold mb-0">Stops</h6>
                <div class="d-flex align-items-center gap-1">
                  <span class="ticketok-text-10">Departure </span> | <span class="ticketok-muted-color ticketok-text-10"> Arrival</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="nonStop" v-model="filters.stops.nonStop">
                      <label class="form-check-label mb-0" for="nonStop">Non-Stop</label>
                    </div>
                    <span>{{ stopCounts.nonStop }}</span>
                  </div>
                </div>
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="oneStop" v-model="filters.stops.one">
                      <label class="form-check-label mb-0" for="oneStop">1 Stop</label>
                    </div>
                    <span>{{ stopCounts.one }}</span>
                  </div>
                </div>
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="twoStops" v-model="filters.stops.two">
                      <label class="form-check-label mb-0" for="twoStops">2 Stops</label>
                    </div>
                    <span>{{ stopCounts.two }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Layover Filter -->
            <div class="filter-card rounded-3 px-4 py-3 mb-3">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-semibold mb-0">Layover</h6>
                <div class="d-flex align-items-center gap-1">
                  <span class="ticketok-text-10">Departure </span> | <span class="ticketok-muted-color ticketok-text-10"> Arrival</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="layover3h" v-model="filters.layover.within3">
                      <label class="form-check-label mb-0" for="layover3h">Within 3 hours</label>
                    </div>
                    <span>{{ layoverCounts.within3 }}</span>
                  </div>
                </div>
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="layover5h" v-model="filters.layover.within5">
                      <label class="form-check-label mb-0" for="layover5h">Within 5 hours</label>
                    </div>
                    <span>{{ layoverCounts.within5 }}</span>
                  </div>
                </div>
                <div class="form-check">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" id="layover5p" v-model="filters.layover.above5">
                      <label class="form-check-label mb-0" for="layover5p">Above 5 hours</label>
                    </div>
                    <span>{{ layoverCounts.above5 }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Airlines Filter -->
            <div class="filter-card rounded-3 px-4 py-3 mb-3">
              <h6 class="fw-semibold mb-3">Airlines</h6>
              <div class="mb-3">
                <div class="form-check" v-for="airline in airlines" :key="airline.id">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                      <input class="form-check-input me-2" type="checkbox" :id="'airline-' + airline.id" v-model="airline.selected">
                      <label class="form-check-label mb-0" :for="'airline-' + airline.id">{{ airline.name }}</label>
                    </div>
                    <span>{{ airline.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <!-- Flight Results -->
          <div class="col-md-9 ticketok-ps-8">
            <!-- Sort and Filter Section -->
            <section class="sort-filter-section my-3">
              <div class="quick-sort">
                <span class="sort-label">QUICK SORT <i class="fa fa-chevron-right"></i></span>
                <div class="sort-options">
                  <span class="sort-option" @click="sortBy = 'price'">
                    CHEAPEST <br>
                    <small>from $1370</small>
                  </span>
                  <span class="sort-option" @click="sortBy = 'duration'">
                    FASTEST <br>
                    <small>from 21 hr 30 min</small>
                  </span>
                  <span class="sort-option" @click="sortBy = 'best'">
                    BEST <br>
                    <small>from $1576</small>
                  </span>
                </div>
              </div>
              
              <div class="sort-by">
                <span class="sort-label">SORT BY</span>
                <select v-model="sortBy" class="form-select sort-dropdown">
                  <option value="price">Price (lowest to highest)</option>
                  <option value="duration">Duration (shortest to longest)</option>
                  <option value="best">Best Value</option>
                </select>
              </div>
            </section>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border ticketok-primary-color" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3">Searching for flights...</p>
            </div>

            <!-- No Results -->
            <div v-else-if="flights.length === 0" class="text-center py-5">
              <h5>No flights found</h5>
              <p class="text-muted">Try modifying your search criteria</p>
            </div>

            <!-- Flight Cards -->
            <div v-else>
              <div v-for="flight in sortedFlights" :key="flight.id" class="ticketok-flight-card">
                <div class="flight-card-header">
                  <h6>{{ flight.origin_code }} to {{ flight.destination_code }} <span>({{ tripType }})</span></h6>
                  <div class="search-actions">
                    <button class="copy-btn" @click="copyFlight(flight)">
                      <img src="/img/copy-icon.svg" alt="Copy" width="20" height="20">
                    </button>
                    <button class="share-btn">
                      <img src="/img/share-icon.svg" alt="Share" width="20" height="20">
                    </button>
                  </div>
                </div>

                <div class="flight-card-body">
                  <!-- Flight Segment -->
                  <div class="flight-segment">
                    <div class="airline-info">
                      <img :src="'/img/' + flight.airline_logo" :alt="flight.airline" height="20">
                      <div>
                        <p class="mb-0">{{ flight.airline }}</p>
                        <small class="text-muted">{{ flight.flight_number }}</small>
                      </div>
                    </div>

                    <div class="segment-row">
                      <div class="segment-col">
                        <div class="time">{{ formatTime(flight.departure_time) }}</div>
                        <div class="airport">{{ flight.origin_code }} - {{ flight.origin_name || flight.origin }}</div>
                        <div class="date text-muted">{{ formatDate(flight.departure_time) }}</div>
                      </div>

                      <div class="segment-line">
                        <span class="duration">{{ flight.duration }}</span>
                        <div class="line"></div>
                        <span class="stop-label" v-if="flight.stops > 0">{{ flight.stops }} Stop</span>
                        <span class="stop-label" v-else>Non-Stop</span>
                      </div>

                      <div class="segment-col text-end">
                        <div class="time">{{ formatTime(flight.arrival_time) }}</div>
                        <div class="airport">{{ flight.destination_code }} - {{ flight.destination_name || flight.destination }}</div>
                        <div class="date text-muted">{{ formatDate(flight.arrival_time) }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="divider"></div>

                  <!-- Price Block -->
                  <div class="price-block">
                    <div class="price-details">
                      <div class="price">${{ formatPrice(flight.price) }}</div>
                      <div class="price-note text-muted">per traveler</div>
                    </div>
                    <button class="btn ticketok-btn-primary w-100" @click="viewFlightDetails(flight.id)">Book Now</button>
                  </div>
                </div>

                <!-- Footer -->
                            <div class="flight-card-footer">
                              <div class="left-links">
                                <a href="#" class="active" @click.prevent="viewFlightDetails(flight.id)">✈️ Flight Details</a>
                                <a href="#">🌍 Map View</a>
                              </div>
                  <div class="right-info text-muted">
                    <span>Baggage: {{ flight.baggage }}</span> • 
                    <span v-if="flight.refundable">Refundable</span>
                    <span v-else>Non-Refundable</span>
                  </div>
                </div>
              </div>
              
              <!-- Alternate Dates Section -->
              <section class="alternate-section my-4" v-if="alternateFlights.length > 0">
                <div class="d-flex align-items-center mb-3">
                  <h5 class="mb-0 text-center flex-grow-1">Alternate dates with Cheaper Price</h5>
                  <div class="ms-2">
                    <button class="alt-slider-btn" :class="{ active: altSlideIndex > 0 }" @click="slideAltLeft" :disabled="altSlideIndex === 0">
                      <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <button class="alt-slider-btn active" @click="slideAltRight" :disabled="altSlideIndex >= alternateFlights.length - 1">
                      <i class="fa-solid fa-chevron-right"></i>
                    </button>
                  </div>
                </div>

                <div class="alternate-cards">
                  <div class="alt-card" v-for="(flight, idx) in displayedAlternateFlights" :key="flight.id">
                    <div class="flight-info">
                      <div class="airline-row">
                        <img :src="'/img/' + flight.airline_logo" height="20">
                        <span>{{ flight.airline }}</span>
                        <span v-if="flight.stops > 0">{{ flight.stops }} Stop</span>
                      </div>

                      <div class="segment">
                        <div class="col">
                          <div class="airport">{{ flight.origin_code }} - {{ flight.origin_name || flight.origin }}</div>
                          <div class="time">{{ formatTime(flight.departure_time) }}</div>
                          <div class="date">{{ formatDateShort(flight.departure_time) }}</div>
                        </div>
                        <div class="flight-line">
                          <div class="flight-bar">
                            <div class="stop" v-if="flight.stops > 0">
                              <div class="dot"></div>
                              <div class="stop-time">{{ flight.duration }}</div>
                            </div>
                          </div>
                        </div>
                        <div class="col text-end">
                          <div class="airport">{{ flight.destination_code }} - {{ flight.destination_name || flight.destination }}</div>
                          <div class="time">{{ formatTime(flight.arrival_time) }}</div>
                          <div class="date">{{ formatDateShort(flight.arrival_time) }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Price -->
                    <div class="price-box">
                      <div class="alt-price-details">
                        <div class="price">${{ formatPrice(flight.price) }}</div>
                        <div class="per">per traveler</div>
                      </div>
                      <div class="save-details" v-if="flight.savings > 0">
                        <div class="save">SAVE</div>
                        <div class="amount">${{ flight.savings }}</div>
                        <div class="per">per traveler</div>
                      </div>
                    </div>

                    <div class="footer">
                      <a href="#" class="active">✈️ Flight Details</a>
                      <a href="#">🌍 Map View</a>
                                  <a href="#" class="btn-book" @click.prevent="viewFlightDetails(flight.id)">Book Now</a>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'SearchResults',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const flights = ref([])
    const loading = ref(true)
    const sortBy = ref('price')

    const searchOrigin = computed(() => route.query.origin_name || route.query.origin)
    const searchDestination = computed(() => route.query.destination_name || route.query.destination)
    const tripType = computed(() => route.query.trip_type === 'roundtrip' ? 'Round Trip' : 'One Way')
    const passengers = computed(() => route.query.passengers || 1)
    const flightClass = computed(() => route.query.class || 'Economy')

    const filters = ref({
      priceRange: { low: false, mid: false, high: false },
      stops: { nonStop: false, one: false, two: false },
      layover: { within3: false, within5: false, above5: false }
    })

    const airlines = ref([
      { id: 1, name: 'Turkish Airlines', count: 45, selected: false, logo: 'turkish-airlines-logo.svg' },
      { id: 2, name: 'United Airlines', count: 32, selected: false, logo: 'united-airlines-logo.svg' },
      { id: 3, name: 'Delta Airlines', count: 28, selected: false, logo: 'delta-airlines-logo.svg' },
      { id: 4, name: 'IndiGo', count: 15, selected: false, logo: 'indigo-airlines-logo.svg' },
      { id: 5, name: 'Spirit Airlines', count: 12, selected: false, logo: 'spirit-airlines-logo.svg' }
    ])
    
    const altSlideIndex = ref(0)

    // Compute filter counts
    const priceCounts = computed(() => {
      const allFlights = flights.value
      return {
        low: allFlights.filter(f => f.price >= 1000 && f.price <= 1500).length,
        mid: allFlights.filter(f => f.price > 1500 && f.price <= 2000).length,
        high: allFlights.filter(f => f.price > 2000).length
      }
    })

    const stopCounts = computed(() => {
      const allFlights = flights.value
      return {
        nonStop: allFlights.filter(f => f.stops === 0).length,
        one: allFlights.filter(f => f.stops === 1).length,
        two: allFlights.filter(f => f.stops === 2).length
      }
    })

    const layoverCounts = computed(() => {
      const allFlights = flights.value
      return {
        within3: Math.floor(allFlights.length * 0.4),
        within5: Math.floor(allFlights.length * 0.3),
        above5: Math.floor(allFlights.length * 0.2)
      }
    })

    const activeFilters = computed(() => {
      const active = []
      if (filters.value.priceRange.low) active.push({ type: 'price', value: 'low', label: 'Low Range' })
      if (filters.value.priceRange.mid) active.push({ type: 'price', value: 'mid', label: 'Mid Range' })
      if (filters.value.priceRange.high) active.push({ type: 'price', value: 'high', label: 'High Range' })
      if (filters.value.stops.nonStop) active.push({ type: 'stops', value: 'nonStop', label: 'Non-Stop' })
      if (filters.value.stops.one) active.push({ type: 'stops', value: 'one', label: '1 Stop' })
      if (filters.value.stops.two) active.push({ type: 'stops', value: 'two', label: '2 Stops' })
      if (filters.value.layover.within3) active.push({ type: 'layover', value: 'within3', label: 'Within 3 hours' })
      if (filters.value.layover.within5) active.push({ type: 'layover', value: 'within5', label: 'Within 5 hours' })
      if (filters.value.layover.above5) active.push({ type: 'layover', value: 'above5', label: 'Above 5 hours' })
      airlines.value.forEach(a => {
        if (a.selected) active.push({ type: 'airline', value: a.name, label: a.name })
      })
      return active
    })

    const filteredFlights = computed(() => {
      let filtered = [...flights.value]
      
      // Filter by price range
      if (filters.value.priceRange.low || filters.value.priceRange.mid || filters.value.priceRange.high) {
        filtered = filtered.filter(flight => {
          if (filters.value.priceRange.low && flight.price >= 1000 && flight.price <= 1500) return true
          if (filters.value.priceRange.mid && flight.price > 1500 && flight.price <= 2000) return true
          if (filters.value.priceRange.high && flight.price > 2000) return true
          return false
        })
      }
      
      // Filter by stops
      if (filters.value.stops.nonStop || filters.value.stops.one || filters.value.stops.two) {
        filtered = filtered.filter(flight => {
          if (filters.value.stops.nonStop && flight.stops === 0) return true
          if (filters.value.stops.one && flight.stops === 1) return true
          if (filters.value.stops.two && flight.stops === 2) return true
          return false
        })
      }
      
      // Filter by airlines
      const selectedAirlines = airlines.value.filter(a => a.selected).map(a => a.name)
      if (selectedAirlines.length > 0) {
        filtered = filtered.filter(flight => selectedAirlines.includes(flight.airline))
      }
      
      return filtered
    })

    const sortedFlights = computed(() => {
      const sorted = [...filteredFlights.value]
      if (sortBy.value === 'price') {
        return sorted.sort((a, b) => a.price - b.price)
      } else if (sortBy.value === 'duration') {
        return sorted.sort((a, b) => a.duration_minutes - b.duration_minutes)
      }
      return sorted
    })

    // Alternate flights (cheaper dates)
    const alternateFlights = computed(() => {
      if (sortedFlights.value.length === 0) return []
      const basePrice = sortedFlights.value[0].price
      const cheaper = flights.value
        .filter(f => f.price < basePrice)
        .map(f => ({
          ...f,
          savings: basePrice - f.price
        }))
        .slice(0, 10)
      return cheaper
    })

    const displayedAlternateFlights = computed(() => {
      return alternateFlights.value.slice(altSlideIndex.value, altSlideIndex.value + 2)
    })
    
    const resetFilters = () => {
      filters.value.priceRange = { low: false, mid: false, high: false }
      filters.value.stops = { nonStop: false, one: false, two: false }
      filters.value.layover = { within3: false, within5: false, above5: false }
      airlines.value.forEach(a => a.selected = false)
    }
    
    const removeFilter = (type, value) => {
      if (type === 'price') {
        filters.value.priceRange[value] = false
      } else if (type === 'stops') {
        filters.value.stops[value] = false
      } else if (type === 'layover') {
        filters.value.layover[value] = false
      } else if (type === 'airline') {
        const airline = airlines.value.find(a => a.name === value)
        if (airline) airline.selected = false
      }
    }
    
    const slideAltLeft = () => {
      if (altSlideIndex.value > 0) {
        altSlideIndex.value -= 2
      }
    }
    
    const slideAltRight = () => {
      if (altSlideIndex.value < alternateFlights.value.length - 2) {
        altSlideIndex.value += 2
      }
    }

    const fetchFlights = async () => {
      loading.value = true
      try {
        const params = {
          origin: route.query.origin,
          destination: route.query.destination,
          depart_date: route.query.depart_date,
          return_date: route.query.return_date,
          passengers: route.query.passengers,
          class: route.query.class,
          trip_type: route.query.trip_type
        }

        const response = await axios.get('http://localhost:8080/api/v1/flights/search', { params })
        flights.value = response.data.flights || []
      } catch (error) {
        console.error('Error fetching flights:', error)
        console.error('Error details:', error.response?.data)
        flights.value = []
      } finally {
        loading.value = false
      }
    }

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
    }

    const formatDateShort = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat().format(price)
    }

    const viewFlightDetails = (flightId) => {
      router.push({
        path: `/flight-details/${flightId}`,
        query: {
          passengers: passengers.value,
          class: flightClass.value,
          trip_type: route.query.trip_type
        }
      })
    }

    const bookFlight = (flightId) => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      // Pass passenger count to booking page
      router.push({
        path: `/booking/${flightId}`,
        query: {
          passengers: passengers.value,
          class: flightClass.value,
          trip_type: route.query.trip_type
        }
      })
    }

    const copyFlight = (flight) => {
      const text = `${flight.airline} ${flight.flight_number}: ${flight.origin_code} to ${flight.destination_code}`
      navigator.clipboard.writeText(text)
      alert('Flight copied to clipboard!')
    }

    const goBackHome = () => {
      router.push('/')
    }

    onMounted(() => {
      fetchFlights()
    })

    return {
      flights,
      loading,
      sortBy,
      searchOrigin,
      searchDestination,
      tripType,
      passengers,
      flightClass,
      filters,
      airlines,
      filteredFlights,
      sortedFlights,
      priceCounts,
      stopCounts,
      layoverCounts,
      activeFilters,
      alternateFlights,
      displayedAlternateFlights,
      altSlideIndex,
                  formatTime,
                  formatDate,
                  formatDateShort,
                  formatPrice,
                  viewFlightDetails,
                  bookFlight,
                  copyFlight,
                  goBackHome,
                  resetFilters,
                  removeFilter,
                  slideAltLeft,
                  slideAltRight
                }
  }
}
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  opacity: 0.8;
}
</style>
