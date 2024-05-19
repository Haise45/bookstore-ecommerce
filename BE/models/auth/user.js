import { Schema, SchemaType, model, mongoose } from 'mongoose'; // Erase if already required


const COLLECTION_NAME = "users";
const DOCUMENT_NAME = "User";
// Declare the Schema of the Mongo model
var userSchema = new Schema({

    lastName:{
        type:String,
        required:true,
        unique:false,
        index:true,
    },

    firstName:{
        type:String,
        required:true,
        unique:false,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
   
    password:{
        type:String,
        required:true,
    },

    role: { 
        type:String,
        default: 'User'
    },

    isEnable:{
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true.valueOf,
        collection: COLLECTION_NAME,
    }
    
);

userSchema.pre('save', function(next) {
    // Kiểm tra nếu không có trường roles được truyền vào
    if (!this.roles) {
        // Gán giá trị mặc định là 'User' cho trường roles
        this.roles = 'User';
    }
    next();
});

export default model(DOCUMENT_NAME, userSchema);