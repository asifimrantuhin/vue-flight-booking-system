<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Register</h2>
      <form @submit.prevent="register">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" v-model="firstName" required>
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" v-model="lastName" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" required minlength="6">
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input type="tel" v-model="phone" required>
        </div>
        <div class="form-group">
          <label>User Type</label>
          <select v-model="userType" required>
            <option value="B2C">B2C (Individual)</option>
            <option value="B2B">B2B (Business)</option>
          </select>
        </div>
        <button type="submit" class="submit-btn">Register</button>
      </form>
      <p>Already have an account? <router-link to="/login">Login here</router-link></p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const toast = useToast()
    const firstName = ref('')
    const lastName = ref('')
    const email = ref('')
    const password = ref('')
    const phone = ref('')
    const userType = ref('B2C')

    const register = async () => {
      try {
        await axios.post('http://localhost:8080/api/v1/users/register', {
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          password: password.value,
          phone: phone.value,
          user_type: userType.value
        })
        
        toast.success('Registration successful! Please login.')
        router.push('/login')
      } catch (error) {
        toast.error(error.response?.data?.error || 'Registration failed')
      }
    }

    return { firstName, lastName, email, password, phone, userType, register }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  padding: 3rem;
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
}

.auth-card p {
  text-align: center;
  margin-top: 1.5rem;
  color: #666;
}

.auth-card a {
  color: #667eea;
  text-decoration: none;
}
</style>

