const nodemailer = require('nodemailer')
const { renderFile } = require('pug')
const htmlToText = require('html-to-text')

class Email {
  constructor(user, url) {
    this.to = user.email
    this.name = user.name
    this.url = url
    this.from = `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`
  }

  createTransport() {
    const devMode = process.env.NODE_ENV === false
      return nodemailer.createTransport({
        host: process.env[`${devMode ? 'MAILTRAP' : 'ELASTICMAIL'}_HOST`],
        port: process.env[`${devMode ? 'MAILTRAP' : 'ELASTICMAIL'}_PORT`],
        auth: {
          user: process.env[`${devMode ? 'MAILTRAP' : 'ELASTICMAIL'}_USERNAME`],
          pass: process.env[`${devMode ? 'MAILTRAP' : 'ELASTICMAIL'}_PASSWORD`]
        }
      })
    }

  async send(template, subject) {
    const html = renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.name.split(' ')[0],
      url: this.url,
      subject
    })

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    }

    await this.createTransport()
      .sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'welcome to the Natours Family!')
  }

  async sendResetPassword() {
    await this.send('passwordReset', 'Your password reset token')
  }
}

module.exports = Email
