const nodeMailer = require('nodemailer')
const config = require('../config/config.js')
const { response } = require('express')


class MailSender {

  constructor(){
    this.transporter = nodeMailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user:config.MAIL.GMAIL_ADRESS,
        pass:config.MAIL.GMAIL_PASSWORD

      }
    })
  }

  async send(to, body){

    const response = await this.transporter.sendMail({
      from: 'no-reply@plisU.com',
      subject:'new purchase',
      to: to,
      html: body
    })
    console.log(response)
  }
}

module.exports = new MailSender()