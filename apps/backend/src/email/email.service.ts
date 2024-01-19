import { Injectable } from "@nestjs/common";
import { Transporter, createTransport, SendMailOptions } from 'nodemailer'

@Injectable()
export default class EmailService {

  private _transporter: Transporter | null = null

  constructor() {
    if (process.env.MAIL_USER && process.env.MAIL_PASSWORD) {
      this._transporter = createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        }
      })
    }
  }

  send(sendMailOptions: Omit<SendMailOptions, 'from'>) {
    if (!this._transporter) {
      throw new Error('Email service not configured.')
    }
    this._transporter.sendMail({
      from: process.env.MAIL_USER,
      ...sendMailOptions
    })
  }

}