/* eslint-disable */
import '@babel/polyfill'
import { loginHandler } from './login'
import { displayMap } from './mapbox'

const loginForm = document.querySelector('.form--login')
const mapBox = document.getElementById('map')

loginForm && loginForm.addEventListener('submit', loginHandler)
mapBox && displayMap(JSON.parse(mapBox.dataset.locations))
