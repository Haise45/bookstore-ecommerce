import { core } from '@paypal/checkout-server-sdk';

core.LiveEnvironment({
  'mode': 'sandbox', // Chế độ sandbox
  'client_id': 'YOUR_PAATmrSrhnD2MvOWd-R0VZKAoTwlNEfyu1zBXrPBLwuX5_M4YocOF85gKzKNuTEC7GTU22kRFvWxjwab0SYPAL_SANDBOX_CLIENT_ID',
  'client_secret': 'ATmrSrhnD2MvOWd-R0VZKAoTwlNEfyu1zBXrPBLwuX5_M4YocOF85gKzKNuTEC7GTU22kRFvWxjwab0S'
});