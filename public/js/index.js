/* eslint-disable */
import '@babel/polyfill'
import { loginHandler, logout } from './login'
import { displayMap } from './mapbox'

const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const mapBox = document.getElementById('map')

loginForm && loginForm.addEventListener('submit', loginHandler)
logoutBtn && logoutBtn.addEventListener('click', logout)
mapBox && displayMap(JSON.parse(mapBox.dataset.locations))
