const { z } = require("zod");

const registerSchema = z.object({
  username:
    z.string()
      .trim()
      .min(3, "Username must be at least 3 characters"),
  email:
    z.string()
      .trim()
      .email("Please enter a valid email address"),

  password:
    z.string()
      .min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
  email:
    z.string()
      .trim()
      .lowercase()
      .email("Please enter a valid email address"),

  password:
    z.string()
      .min(6, "Password must be at least 6 characters")
});

module.exports = {
  registerSchema,
  loginSchema
}