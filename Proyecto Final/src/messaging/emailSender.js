import { createTransport } from 'nodemailer';
import { NODEMAILER_CONFIG } from '../config/config.js';

class emailsSender {
    constructor(config) {
        this.clienteNodemailer = createTransport(config)
    }

    async send(mailOptions) {
        try {
            return await this.clienteNodemailer.sendMail(mailOptions)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

export const emailSender = new emailsSender(NODEMAILER_CONFIG)
