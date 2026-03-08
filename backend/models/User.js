const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
{
  email: {
    type: String,
    required: [true, "Email là bắt buộc"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"]
  },

  password: {
    type: String,
    required: [true, "Mật khẩu là bắt buộc"],
    minlength: [6, "Mật khẩu phải ít nhất 6 ký tự"]
  },

  username: {
    type: String,
    trim: true,
  }

},
{
  timestamps: true
}
);

// Hash password trước khi lưu vào database
userSchema.pre("save", async function () {

  // chỉ hash khi password thay đổi
  if (!this.isModified("password")) return;

  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;

    console.log(`Password hashed successfully for user: ${this.email}`);

  } catch (error) {

    console.error("Error hashing password:", error);
    throw error;

  }

});


// hàm so sánh password khi đăng nhập
userSchema.methods.comparePassword = async function (candidatePassword) {

  return bcrypt.compare(candidatePassword, this.password);

};

// hàm này sẽ loại bỏ trường password khi trả về user object (ví dụ khi gọi res.json(user))
userSchema.methods.toJSON = function () {

  const user = this.toObject();

  delete user.password;

  return user;

};


module.exports = mongoose.model("User", userSchema);