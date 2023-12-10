/* eslint-disable */
import '@babel/polyfill'
import { loginHandler } from './login'
import { displayMap } from './mapbox'

const loginForm = document.querySelector('.form--login')

loginForm && loginForm.addEventListener('submit', loginHandler)

