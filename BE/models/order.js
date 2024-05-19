import { Schema, model } from 'mongoose';

const OrderSchema = new Schema({
  date: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookList: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  payment: { type: Number, required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'], default: 'PENDING' }
}, { collection: 'orderdetail' });

export default model('Order', OrderSchema);