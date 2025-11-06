# Frontend

Vue.js 3 frontend application for the  flight booking system.

## 🚀 Overview

Modern, responsive frontend built with Vue.js 3, Vue Router, and Bootstrap 5. Provides an intuitive user interface for searching, viewing, and booking flights.

## ✨ Features

### Core Features
- 🔍 **Flight Search**: Search flights by origin, destination, date, and passenger count
- 📅 **Date Selection**: Native date pickers for departure and return dates
- 🎫 **Flight Listings**: Display search results with filters and sorting
- 📋 **Flight Details**: Comprehensive flight information page
- 🛒 **Booking Process**: Multi-step booking with passenger information collection
- 📦 **My Bookings**: View and manage user bookings
- 🔐 **Authentication**: User registration and login
- 🎨 **Responsive Design**: Mobile-friendly interface

### UI/UX Features
- Modern Bootstrap 5 design
- Real-time search results
- Advanced filtering (price, stops, airlines, layover)
- Sort options (price, duration, best value)
- Loading states and error handling
- Toast notifications
- Copy/share flight information

## 🛠️ Tech Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router 4** - Official router for Vue.js
- **Axios** - HTTP client for API requests
- **Bootstrap 5** - CSS framework
- **Vue Toastification** - Toast notification library
- **Vite** - Next-generation frontend tooling
- **Font Awesome** - Icon library

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## 🚀 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### 4. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── css/           # Bootstrap and custom CSS
│   ├── img/           # Images and icons
│   └── js/            # JavaScript libraries
├── src/
│   ├── views/         # Vue page components
│   │   ├── Home.vue           # Home page with search
│   │   ├── SearchResults.vue  # Flight search results
│   │   ├── FlightDetails.vue  # Flight details page
│   │   ├── Booking.vue        # Booking page
│   │   ├── MyBookings.vue     # User bookings
│   │   ├── Login.vue          # Login page
│   │   └── Register.vue       # Registration page
│   ├── App.vue        # Root component
│   └── main.js        # Application entry point
├── index.html         # HTML template
├── package.json       # Dependencies
└── vite.config.js     # Vite configuration
```

## 🎯 Key Components

### Home.vue
Main landing page with flight search form:
- Trip type selection (one-way/round-trip)
- Passenger count selection
- Flight class selection
- Origin/destination selection with modal
- Date pickers for departure and return dates

### SearchResults.vue
Displays flight search results:
- Filter sidebar (price, stops, layover, airlines)
- Sort options
- Flight cards with details
- Alternate dates with cheaper prices
- Pagination support

### FlightDetails.vue
Detailed flight information page:
- Flight summary
- Detailed segment information
- Baggage information
- Fare information
- Other policies
- Book Now button

### Booking.vue
Booking confirmation page:
- Passenger information forms
- Flight summary
- Price breakdown
- Booking confirmation

### MyBookings.vue
User bookings management:
- List of all bookings
- Booking details
- Flight information
- Passenger details
- Cancel booking option

## 🔌 API Integration

The frontend communicates with the backend API at `http://localhost:8080/api/v1`.

### API Endpoints Used

```javascript
// Flight Search
GET /api/v1/flights/search?origin=DAC&destination=ATL&depart_date=2025-11-04

// Flight Details
GET /api/v1/flights/:id

// Cities List
GET /api/v1/flights/cities

// User Registration
POST /api/v1/users/register

// User Login
POST /api/v1/users/login

// Create Booking
POST /api/v1/bookings

// Get User Bookings
GET /api/v1/bookings

// Cancel Booking
PUT /api/v1/bookings/:id/cancel
```

### API Configuration

Update API base URL in components if needed:

```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1'
```

## 🎨 Styling

### CSS Files
- `public/css/bootstrap.min.css` - Bootstrap 5
- `public/css/app.css` - Custom application styles
- `public/css/style.css` -  brand styles

### Custom Classes
- `ticketok-*` -  brand classes
- `ticketok-primary-color` - Primary brand color (#009CFC)
- `ticketok-btn-primary` - Primary button style
- `ticketok-flight-card` - Flight card styling

## 🔐 Authentication

User authentication is handled via JWT tokens stored in localStorage:

```javascript
// Store token after login
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))

// Use token in API requests
headers: {
  'Authorization': `Bearer ${token}`
}
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🧪 Development

### Hot Module Replacement (HMR)
Vite provides instant HMR for fast development.

### Code Structure
- Use Vue 3 Composition API
- Keep components modular and reusable
- Use computed properties for derived state
- Use ref/reactive for reactive state

### Best Practices
- Follow Vue.js style guide
- Use meaningful component names
- Keep components focused and small
- Use props for parent-to-child communication
- Use events for child-to-parent communication

## 🐛 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Change port in vite.config.js
server: {
  port: 3000
}
```

**API connection errors**
- Verify backend is running on port 8080
- Check CORS configuration in backend
- Verify API endpoints are correct

**Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Styling issues**
- Clear browser cache
- Verify CSS files are loaded
- Check Bootstrap version compatibility

## 📦 Dependencies

### Production Dependencies
- `vue` ^3.5.13 - Vue.js framework
- `vue-router` ^4.5.0 - Router
- `axios` ^1.7.7 - HTTP client
- `vue-toastification` ^2.0.0-beta.5 - Toast notifications

### Development Dependencies
- `vite` ^6.0.5 - Build tool
- `@vitejs/plugin-vue` ^5.2.1 - Vue plugin for Vite

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
1. Build the application
2. Upload `dist` folder contents to your hosting provider
3. Configure server to serve `index.html` for all routes

### Environment Variables
For production, update API URLs:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api/v1'
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔗 Related Documentation

- [Vue.js Documentation](https://vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)

## 📄 License

Proprietary - 

---

**Version**: 1.0.0  
**Last Updated**: November 2025
