/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alert'

const url = '/api/v1/users'
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
      url: `${url}/login`,
      data: {
        email,
        password
      }
    })

    if (res.data.status === 'success') {
      showAlert('success', 'You logged in successfully')
      window.setTimeout(() => {
        location.assign('/')
      }, 500)
    }
  } catch (e) {
    showAlert('error', e.response.data.message || e.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: `${url}/logout`,
    })

    if (res.data.status === 'success') location.assign('/login')
  } catch (e) {
    showAlert('error', e.response.data.message || e.message)
  }
}
