  import { Schema, model } from "mongoose";

  const CategorySchema = new Schema({
      name: { type: String, required: true },
      books: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
    },{ collection: "category"});

  export default model ("Category",CategorySchema);