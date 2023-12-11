/* eslint-disable */

import axios from 'axios'
import { showAlert } from './alert'

const url = 'http://localhost:8080/api/v1/users'
export const handleUpdateData = async e => {
  e.preventDefault()
  const name = document.getElementById('name').value
  const email = document.getElementById('email').value

  await update('data', {
    name,
    email
  })
}

export const handleUpdatePass = async e => {
  e.preventDefault()
  const currentPasswordField = document.getElementById('password-current')
  const newPasswordField = document.getElementById('password')
  const passwordConfirmField = document.getElementById('password-confirm')

  await update('password', {
    currentPassword: currentPasswordField.value,
    newPassword: newPasswordField.value,
    passwordConfirm: passwordConfirmField.value
  })

  currentPasswordField.value = newPasswordField.value = passwordConfirmField.value = ''
}
const update = async (type, data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `${url}/${type === 'password' ? 'updatePassword' : 'updateUser'}`,
      data
    })

    if (res.data.status === 'success') {
      showAlert('success', `${type} updated successfully`)
    }
  } catch (e) {
    showAlert('error', e.response.data.message || e.message)
  }
}
