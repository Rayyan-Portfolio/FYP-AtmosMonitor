const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          return (
            /[a-z]/.test(value) &&
            /[A-Z]/.test(value) &&
            /\d/.test(value) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(value)
          );
        },
        message:
          "Password must contain at least one uppercase, lowercase, digit, and special character",
      },
    },
    otp: {
      type: String,
      required: false,  // OTP is not required initially, it will be used for verification
    },
    otpExpiryTime: {
      type: Date,
      required: false,  // OTP expiry time
    },
  },
  { timestamps: true }
);

// Hash password before saving it to the database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);  // Generate salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash password
    next();
  } catch (error) {
    return next(error);  // If there's an error, pass it to the next middleware
  }
});

// Method to compare entered password with the stored hashed password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);  // Compare hashed password with the entered password
};

// Export the User model to be used in other parts of the application
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
