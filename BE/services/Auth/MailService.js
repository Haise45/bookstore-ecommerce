import MailSender from '../../config/MailConfig.js'
class MailService {

    constructor(){

    }

    static registration(token, email, req, from = 'BookStore Registration') {
      return new Promise((resolve, reject) => {
        const confirmationUrl = `${req.protocol}://${req.get('host')}/api/guest/auth/confirm-registration/${token}`;
        const mailOptions = {
          from: from,
          to: email,
          subject: 'Confirm registration',
          html: `
            <p>Thank you for registering.</p>
            <p>Please click the following link to confirm your account:</p>
            <a href="${confirmationUrl}">Confirm registration</a>
          `
        };
  
        MailSender.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            reject(error); // Reject Promise nếu có lỗi
          } else {
            console.log('Email sent: ' + info.response);
            this.handleEmailSent(confirmationUrl); // Xử lý logic sau khi gửi email thành công
            resolve(confirmationUrl); // Resolve Promise với confirmationUrl
          }
        });
      });
    }

    static handleEmailSent(confirmationUrl) {
        console.log(`confirm url: ${confirmationUrl}`);
        // Xử lý logic khác sau khi gửi email thành công
      }

}
export default MailService;