/* eslint-disable */
import axios from 'axios'

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
      alert('You logged in successfully')
      setTimeout(()=>{
        location.assign('/')
      }, 1500)
    }
  } catch (e) {
    console.log(e.response.data.message || e)
  }
}
