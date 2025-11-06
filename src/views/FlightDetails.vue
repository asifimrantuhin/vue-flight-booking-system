<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border ticketok-primary-color" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3">Loading flight details...</p>
    </div>

    <!-- Flight Details -->
    <section class="py-4" v-else-if="flight">
      <div class="container">
        <div class="row">
          <div class="col-md-1"></div>
          <!-- Flight Results -->
          <div class="col-md-10 ticketok-ps-8">
            <!-- Card -->
            <div class="ticketok-flight-card">
              <div class="flight-card-header">
                <h6>{{ flight.origin_name || flight.origin }} to {{ flight.destination_name || flight.destination }} <span>({{ tripType }})</span></h6>
                <div class="search-actions">
                  <button class="copy-btn" @click="copyFlight">
                    <img src="/img/copy-icon.svg" alt="Copy" width="20" height="20">
                  </button>
                  <button class="share-btn">
                    <img src="/img/share-icon.svg" alt="Share" width="20" height="20">
                  </button>
                </div>
              </div>

              <div class="flight-card-body">
                <!-- OUTBOUND -->
                <div class="flight-segment">
                  <div class="airline-info">
                    <img v-if="flight.airline_logo" :src="'/img/' + flight.airline_logo" :alt="flight.airline" height="20">
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
                      <span class="stop-label" v-if="flight.stops > 0">{{ flight.stops }} Stop</span>
                      <span class="stop-label" v-else>Non-Stop</span>
                      <div class="line"></div>
                      <span class="duration">{{ flight.duration }}</span>
                    </div>

                    <div class="segment-col text-end">
                      <div class="time">{{ formatTime(flight.arrival_time) }}</div>
                      <div class="airport">{{ flight.destination_code }} - {{ flight.destination_name || flight.destination }}</div>
                      <div class="date text-muted">{{ formatDate(flight.arrival_time) }}</div>
                    </div>
                  </div>
                </div>

                <div class="divider"></div>

                <!-- PRICE BLOCK -->
                <div class="price-block">
                  <div class="price-details">
                    <div class="price">${{ formatPrice(flight.price) }}</div>
                    <div class="price-note text-muted">per traveler</div>
                  </div>
                  <button class="btn ticketok-btn-primary w-100" @click="goToBooking">Book Now</button>
                </div>
              </div>

              <!-- Footer -->
              <div class="flight-card-footer">
                <div class="left-links">
                  <a href="#" class="active">✈️ Flight Details</a>
                  <a href="#">🌍 Map View</a>
                </div>
                <div class="right-info text-muted">
                  <span>Baggage: {{ flight.baggage || 1 }}</span> • 
                  <span v-if="flight.refundable">Refundable</span>
                  <span v-else>Non-Refundable</span>
                </div>
              </div>
            </div>

            <!-- Detailed Flight Card -->
            <div class="ticketok-flight-details-card">
              <div class="flight-card-header position-relative d-flex align-items-center justify-content-between">
                <h6 class="mb-0">{{ flight.origin_name || flight.origin }} to {{ flight.destination_name || flight.destination }} <span>({{ tripType }})</span></h6>
                <h6 class="mb-0 position-absolute start-50 translate-middle-x text-center">DETAILS</h6>
                <div class="search-actions">
                  <button class="copy-btn" @click="copyFlight">
                    <img src="/img/copy-icon.svg" alt="Copy" width="20" height="20">
                  </button>
                  <button class="share-btn">
                    <img src="/img/share-icon.svg" alt="Share" width="20" height="20">
                  </button>
                </div>
              </div>

              <div class="flight-details-card-body">
                <!-- Flight Segment Details -->
                <div class="flight-details-segment">
                  <div class="row align-items-start">
                    <div class="col-md-4">
                      <div class="details-airline-info d-flex align-items-center gap-2 mb-2">
                        <img v-if="flight.airline_logo" :src="'/img/' + flight.airline_logo" :alt="flight.airline" height="20">
                        <div>
                          <p class="mb-0 fw-semibold">{{ flight.airline }}</p>
                          <small class="text-muted">{{ flight.flight_number }}</small>
                          <small class="text-muted d-block">{{ flight.class }}</small>
                        </div>
                      </div>
                    </div>

                    <div class="col-md-8">
                      <div class="details-segment-row">
                        <!-- Left -->
                        <div class="details-segment-col">
                          <div class="airport">{{ flight.origin_code }} ({{ flight.origin_code }})</div>
                          <div class="airport-name">{{ flight.origin_name || flight.origin }}</div>
                          <div class="time">{{ formatTime(flight.departure_time) }}</div>
                          <div class="date text-muted">{{ formatDateFull(flight.departure_time) }}</div>
                        </div>

                        <!-- Center -->
                        <div class="details-segment-line">
                          <span class="dot left"></span>
                          <div class="line"></div>
                          <span class="plane"><img src="/img/plane-icon-5.svg" alt=""></span>
                          <span class="dot right"></span>
                          <div class="details-duration">{{ flight.duration }}</div>
                        </div>

                        <!-- Right -->
                        <div class="details-segment-col">
                          <div class="airport">{{ flight.destination_code }} ({{ flight.destination_code }})</div>
                          <div class="airport-name">{{ flight.destination_name || flight.destination }}</div>
                          <div class="time">{{ formatTime(flight.arrival_time) }}</div>
                          <div class="date text-muted">{{ formatDateFull(flight.arrival_time) }}</div>
                        </div>
                      </div>

                      <div class="layover" v-if="flight.stops > 0">
                        <span>Stops: <strong>{{ flight.stops }}</strong> | Total Duration: <strong>{{ flight.duration }}</strong></span>
                      </div>
                      <div class="layover" v-else>
                        <span>Non-Stop Flight | Total Duration: <strong>{{ flight.duration }}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="divider"></div>

                <!-- Baggage Information -->
                <div class="flight-details-segment mt-4">
                  <div class="row align-items-start">
                    <div class="col-md-4">
                      <div class="details-airline-info mb-2">
                        <h6 class="ticketok-text-14">Baggage Information</h6>
                        <small class="text-muted d-block">Per Person</small>
                      </div>
                    </div>

                    <div class="col-md-8">
                      <div class="details-segment-row py-0">
                        <div class="details-segment-col">
                          <h6 class="ticketok-text-12 ps-4">Flight</h6>
                          <ul class="mb-0 ps-4">
                            <li>{{ flight.origin_code }} to {{ flight.destination_code }}</li>
                          </ul>
                        </div>

                        <div class="details-segment-col">
                          <h6 class="ticketok-text-12">Checked bags</h6>
                          <ul class="list-unstyled mb-0 ps-0">
                            <li>{{ flight.baggage || 1 }} nos, 50 lbs each</li>
                          </ul>
                        </div>

                        <div class="details-segment-col">
                          <h6 class="ticketok-text-12">Carry on bag</h6>
                          <ul class="list-unstyled mb-0 ps-0">
                            <li>1 nos, 15 lbs each</li>
                          </ul>
                        </div>
                      </div>

                      <div class="divider"></div>
                    </div>
                  </div>
                </div>

                <!-- Fare Information -->
                <div class="flight-details-segment mt-3">
                  <div class="row align-items-start">
                    <div class="col-md-4">
                      <div class="details-airline-info mb-2">
                        <h6 class="ticketok-text-14">Fare Information</h6>
                        <small class="text-muted d-block">Per Person</small>
                      </div>
                    </div>

                    <div class="col-md-8">
                      <div class="details-segment-row py-0">
                        <div class="details-segment-col">
                          <ul class="mb-0 ps-4">
                            <li>Seat choice for a fee</li>
                            <li v-if="flight.refundable">Cancellation fee: ${{ Math.round(flight.price * 0.2) }}</li>
                            <li v-else>Non-refundable ticket</li>
                            <li>Change fee: ${{ Math.round(flight.price * 0.15) }}</li>
                          </ul>
                        </div>
                      </div>

                      <div class="divider"></div>
                    </div>
                  </div>
                </div>

                <!-- Other Information -->
                <div class="flight-details-segment mt-3">
                  <div class="row align-items-start">
                    <div class="col-md-4">
                      <div class="details-airline-info mb-2">
                        <h6 class="ticketok-text-14">Other Information</h6>
                      </div>
                    </div>

                    <div class="col-md-8">
                      <div class="details-segment-row py-0">
                        <div class="details-segment-col w-100">
                          <ul class="mb-0 ps-4">
                            <li>Refund is calculated by deducting Airline's fee and ST fee from the paid amount.</li>
                            <li>Date Change fee is calculated by adding Airline's fee, fare difference and ST fee.</li>
                            <li>Read <a href="#">Policy Details</a> for more information</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="flight-details-card-footer px-0">
                <div class="tollfree-contact">
                  <p class="mb-0">Call Us Toll Free 24/7</p>
                  <a href="tel:+18001234567" class="ticketok-primary-color" style="font-size:20px;">1-800-123-4567</a>
                </div>
                <div class="divider-vertical">
                  <img src="/img/divider-vertical.svg" alt="" height="40" width="1">
                </div>
                <div class="live-chat justify-content-between align-items-center d-flex gap-2">
                  <span>Start Live Chat</span>
                  <img src="/img/live-chat-icon.svg" alt="" width="40" height="50">
                </div>

                <div class="btn-ref-block text-end">
                  <button class="btn ticketok-btn-primary" @click="goToBooking">Book Now</button>
                  <div class="ref-id d-flex align-items-center justify-content-end gap-1 ticketok-text-10">
                    <a href="#" class="text-decoration-none py-1">Ref ID: {{ flight.id }}ABC{{ flight.flight_number }}</a>
                    <button class="copy-btn px-0 py-0" @click="copyRefId">
                      <img src="/img/copy-icon.svg" alt="Copy" width="15" height="15">
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-1"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

export default {
  name: 'FlightDetails',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const flight = ref(null)
    const loading = ref(true)
    const tripType = ref('One Way')

    const fetchFlightDetails = async () => {
      loading.value = true
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/flights/${route.params.id}`)
        flight.value = response.data
        
        // Get trip type from query params if available
        if (route.query.trip_type) {
          tripType.value = route.query.trip_type === 'roundtrip' ? 'Round Trip' : 'One Way'
        }
      } catch (error) {
        console.error('Error fetching flight details:', error)
        router.push('/search')
      } finally {
        loading.value = false
      }
    }

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    }

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
    }

    const formatDateFull = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', weekday: 'long' })
    }

    const formatPrice = (price) => {
      return new Intl.NumberFormat().format(price)
    }

    const goToBooking = () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      router.push({
        path: `/booking/${route.params.id}`,
        query: {
          passengers: route.query.passengers || 1,
          class: route.query.class || 'Economy',
          trip_type: route.query.trip_type || 'oneway'
        }
      })
    }

    const copyFlight = () => {
      const text = `${flight.value.airline} ${flight.value.flight_number}: ${flight.value.origin_code} to ${flight.value.destination_code}`
      navigator.clipboard.writeText(text)
      alert('Flight information copied to clipboard!')
    }

    const copyRefId = () => {
      const refId = `${flight.value.id}ABC${flight.value.flight_number}`
      navigator.clipboard.writeText(refId)
      alert('Reference ID copied to clipboard!')
    }

    onMounted(() => {
      fetchFlightDetails()
    })

    return {
      flight,
      loading,
      tripType,
      formatTime,
      formatDate,
      formatDateFull,
      formatPrice,
      goToBooking,
      copyFlight,
      copyRefId
    }
  }
}
</script>

<style scoped>
.spinner-border {
  width: 3rem;
  height: 3rem;
}

.ticketok-ps-8 {
  padding-left: 2rem;
}

@media (max-width: 768px) {
  .ticketok-ps-8 {
    padding-left: 0;
  }
}
</style>

