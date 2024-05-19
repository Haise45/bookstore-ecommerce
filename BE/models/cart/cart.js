import { Schema, model} from 'mongoose';

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  cartItems: [{ type: Schema.Types.ObjectId, ref: 'CartItem' }]
}, { collection: 'cart' });

export default model('Cart', CartSchema);