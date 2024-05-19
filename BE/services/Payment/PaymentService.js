import paypal from '@paypal/checkout-server-sdk';

class PaymentService {
  constructor() {
    // Không cần cấu hình môi trường ở đây
  }

  async createPaymentOrder(payment) {
    const environment = new paypal.core.SandboxEnvironment(
      'ATmrSrhnD2MvOWd-R0VZKAoTwlNEfyu1zBXrPBLwuX5_M4YocOF85gKzKNuTEC7GTU22kRFvWxjwab0S',
      'EBSX6_nEbXCsyf4hh0OovLCoewdXH8HJ9C6FeP1DP6kH4F0y0Yvn3ukgd9akANjJ_F98QlalDGo3zs-i'
    );
    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      "intent": "CAPTURE",
      "purchase_units": [{
        "amount": {
          "currency_code": "USD",
          "value": payment
        }
      }]
    });

    try {
      const order = await client.execute(request);
      return order.result.id;
    } catch (err) {
      throw err;
    }
  }
}

export default PaymentService;