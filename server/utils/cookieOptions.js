const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: Number(process.env.COOKIE_EXPIRY),
};

module.exports = cookieOptions;