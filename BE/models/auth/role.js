import { Schema, model } from 'mongoose'; // Erase if already required

const COLLECTION_NAME = "roles";
const DOCUMENT_NAME = "Roles";

var roleSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    permissions: [{ type: String }],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model(DOCUMENT_NAME, roleSchema);
