/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alert'

export const loginHandler = e => {
  e.preventDefault()
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value

  login(email, password)
}

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://localhost:8080/api/v1/users/login',
      data: {
        email,
        password
      }
    })

    if (res.data.status === 'success') {
      showAlert('success', 'You logged in successfully')
      window.setTimeout(() => {
        location.assign('/')
      }, 1500)
    }
  } catch (e) {
    showAlert('error', e.response.data.message || e.message)
    console.log(e.response.data || e)
  }
}
