import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {type: String, maxLength: [25, "Name cant be grater than 25 characters"]},
  email: {type: String, unique: true, required: true,
    match: [/.+\@.+\../, "Please enter a valid email address"]
  },
  password: {type: String,
    validate: {
      validator: function(v){
        return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(v)
      },
      message: "Password should be between 8 to 12 characters and should have a special character"
    }
  },
  type: {type: String, enum: ['Customer', 'Seller']}
});