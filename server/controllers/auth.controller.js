const asyncHandler = require("../utils/asyncHandler");
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const cookieOptions = require("../utils/cookieOptions");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const User = require("../models/user.model");

const registerUser = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(
      400,
      "Validation failed",
      validation.error.issues)
  }

  const { email, username, password } = validation.data;

  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const user = await User.create({
    username,
    email,
    password
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Failed to register user");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      createdUser,
      "User registered successfully"
    )
  )
});

const loginUser = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    throw new ApiError(
      400,
      "Validation failed",
      validation.error.issues
    );
  }

  const { email, password } = validation.data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select("-password");

  if (!loggedInUser) {
    throw new ApiError(500, "Failed to fetch user");
  }

  return res
    .cookie(
      "accessToken",
      accessToken,
      cookieOptions
    )
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken
        },
        "User logged in successfully"
      )
    )
});

const getCurrentUser = asyncHandler(async (req, res) => {

  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "User data fetched successfully"
    )
  );
});

const logOut = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken", cookieOptions);

  return res.status(200).json(
    new ApiResponse(
      200,
      {},
      "User logged out successfully"
    )
  );
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logOut
}