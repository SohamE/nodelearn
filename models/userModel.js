const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "User with this email ({VALUE}) already exists"],
    lower: true,
    validate: [validator.isEmail, "The provided email ({VALUE}) is invalid"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [8, "Password must be atleast 8 characters long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a confirm password"],
    validate: {
      validator: function (cnfPass) {
        return cnfPass === this.password;
      },
      message: "The confirm password doesnot match the password",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "lead-guide", "guide", "user"],
      message: "Please provide a valid user role.",
    },
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// Custom method available for a certain schema.
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
