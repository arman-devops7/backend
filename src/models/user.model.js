import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true  //to make field searchable (optimize)
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    avatar: {
      type: String, //cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video"
      }
    ],
    password: {
      type: String,
      required: [
        true, "Password is required"
      ],
    },
    refreshToken: {
      type: String,
    },
  }, { timestamps: true }
);

// mongoose pre hook middleware (to do smthng before storing in db eg encrypt pass)
// note dont use fat arrow fn becoz we cant use this keyword
userSchema.pre("save", async function (next) {
  // only make chngs whn psswrd is modified else return
  if (!this.isModified("password")) return next();
  // to ecrypt the password (password, no of rounds)
  this.password = await bcrypt.hash(this.password, 10)
  next();

})

// custom method (to check passsword)
userSchema.methods.isPasswordCorrect = async function (password) {
  // this returns true or false
  return await bcrypt.compare(password, this.password)

}

// generate access token (shortlived)
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      //payload
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
     //accessToken 
    process.env.ACCESS_TOKEN_SECRET,
    // expires when
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

// generate refresh token (refresh token holds less info) (long lived)
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      //payload
      _id: this._id,
    },
    //refreshToken 
    process.env.REFRESH_TOKEN_SECRET,
    // expires when
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema)