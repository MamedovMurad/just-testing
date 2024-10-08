export const isDevelopment =
  origin === "http://tmreg.asan.org" ||
  process.env.NODE_ENV === "development" ||
  origin === "http://mreg.asan.org";
