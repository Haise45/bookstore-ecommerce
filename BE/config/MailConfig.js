import { createTransport } from 'nodemailer';

const transporter = createTransport({
  service: 'gmail', 
  port: 587,
  auth: {
    user: 'thenghia25022003@gmail.com',
    pass: 'nlunszlvjzxtliss'
  },
  tls: {
    rejectUnauthorized: false
  }
});

export default transporter;