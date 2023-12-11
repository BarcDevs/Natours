/* eslint-disable */
import '@babel/polyfill'
import { loginHandler, logout } from './login'
import { displayMap } from './mapbox'
import { handleUpdateData, handleUpdatePass } from './updateUser'

const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const userForm = document.querySelector('.form-user-data')
const passForm = document.querySelector('.form-user-password')
const mapBox = document.getElementById('map')

loginForm && loginForm.addEventListener('submit', loginHandler)
logoutBtn && logoutBtn.addEventListener('click', logout)
userForm && userForm.addEventListener('submit', handleUpdateData)
passForm && passForm.addEventListener('submit', handleUpdatePass)
// TODO sort out mapbox
mapBox && displayMap(JSON.parse(mapBox.dataset.locations))
