/* eslint-disable */
import axios from 'axios'
import { showAlert } from './alert'

// const stripe = Stripe('pk_test_51OMrOCG93zgBhFXtE6VmSZaHF8dcaEBsz6qs7eE0ugxy0Hb1o27E8lw5L4mzVKJm6TTJRS1GJrcV0Dd0SUB3GXmr00THarIB5R')

export const handleBookTour = e => {
  e.target.textContent = 'Processing...'
  const { tourId } = e.target.dataset
  bookTour(tourId)
}

const bookTour = async tourID => {
  try {
    const res = await axios
      .post(`/api/v1/bookings/checkout/${tourID}`)
    location.assign(res.data.session.url)
  } catch (err) {
    showAlert('error', err.message)
  }
}
