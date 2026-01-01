// import the User model
const { User, File } = require("../models");
const hashPassword = require("../utils/hashpassword");
const comparePassword = require("../utils/comparepassword");
const generateToken = require("../utils/generatetoken");
const generateCode = require("../utils/generatecode");
const sendEmail = require("../utils/sendemail");

// signup controller function
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      res.code = 400;
      throw new Error("Email already exists");
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({
      code: 201,
      status: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    next(err);
  }
};
const signin = async (req, res, next) => {
  // Signin logic to be implemented
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 401;
      throw new Error("Invalid email or password");
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      res.code = 401;
      throw new Error("Invalid email or password");
    }
    const token = generateToken(user);
    res.status(200).json({
      code: 200,
      status: true,
      message: "User logged in successfully",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};
const verifyCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User with this email does not exist");
    }
    if (user.isVerified) {
      res.code = 400;
      throw new Error("Email is already verified");
    }
    code = generateCode(6);
    user.verificationCode = code;
    await user.save();

    // send email
    await sendEmail({
      emailTo: user.email,
      subject: "Email verfication Code",
      code,
      content: "verify your account",
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Verification code sent to email",
    });
  } catch (err) {
    next(err);
  }
};
const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (user.verificationCode !== code) {
      res.code = 400;
      throw new Error("Invalid code");
    }
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();
    res
      .status(200)
      .json({ code: 200, status: true, message: "User verified Successfully" });
  } catch (err) {
    next(err);
  }
};
const forgotPasswordCode = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 400;
      throw new Error("User not found!");
    }
    const code = generateCode(6);
    user.forgetPasswordCode = code;
    await user.save();

    await sendEmail({
      emailTo: user.email,
      subject: "Forgotten password reset code",
      code,
      content: "change your password",
    });

    res.status(200).json({
      code: 200,
      status: true,
      message: "Forgot password code sent successfully",
    });
  } catch (err) {
    next(err);
  }
};
const recoverPassword = async (req, res, next) => {
  try {
    const { email, code, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.code = 400;
      throw new Error("User not found");
    }
    if (user.forgetPasswordCode !== code) {
      res.code = 400;
      throw new Error("Invalid code");
    }
    const hashedPassword = await hashPassword(password);
    user.password = hashedPassword;
    user.forgetPasswordCode = null;
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Password recovered successfully",
    });
  } catch (err) {
    next(err);
  }
};
const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { _id } = req.user;
    const user = await User.findById(_id);
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    const match = await comparePassword(oldPassword, user.password);
    if (!match) {
      res.code = 400;
      throw new Error("Old password is incorrect");
    }
    if (oldPassword === newPassword) {
      res.code = 400;
      throw new Error("New password must be different from old password");
    }
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { name, email, profilePic } = req.body;
    const user = await User.findById(_id).select("name email isVerified");
    if (!user) {
      res.code = 404;
      throw new Error("User not found");
    }
    if (email) {
      const isEmailExist = await User.findOne({ email });
      if (
        isEmailExist &&
        isEmailExist.email === email &&
        String(user._id) !== String(isEmailExist._id)
      ) {
        res.code = 400;
        throw new Error("Email already in use by another user");
      }
    }
    if (profilePic) {
      const file = await File.findById(profilePic);
      if (!file) {
        res.code = 404;
        throw new Error("File not found");
      }
    }
    user.name = name ? name : user.name;
    user.email = email ? email : user.email;
    user.profilePic = profilePic;

    if (email) {
      user.isVerified = false;
    }
    await user.save();
    res.status(200).json({
      code: 200,
      status: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
const currentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id)
      .select("-password -verificationCode -forgetPasswordCode")
      .populate("profilePic");
    if (!user) {
      res.code = 404;
      throw new Error("User not found!");
    }
    res.status(200).json({
      code: 200,
      status: true,
      message: "Get current user successfully",
      data: { user },
    });
  } catch (err) {
    next(err);
  }
};
// export the signup function
module.exports = {
  signup,
  signin,
  verifyCode,
  verifyUser,
  forgotPasswordCode,
  recoverPassword,
  changePassword,
  updateProfile,
  currentUser,
};
