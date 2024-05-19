import { Schema, model } from 'mongoose';

const tokenRegistrationSchema = new Schema(
    {
        token: { type: String, required: true, unique: true },
        userEmail: { type: String, required: true },
        expiresAt: { type: Date, required: true, default: () => Date.now() + 24 * 60 * 60 * 1000 } // Token sẽ hết hạn sau 24 giờ
    }
);

const TokenRegistration = model('TokenRegistration', tokenRegistrationSchema);

export default TokenRegistration;