/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: "mongodb+srv://e-castasus:Eton110300@cluster0.wbcoa.mongodb.net/gather?retryWrites=true&w=majority",
    TOKEN_SECRET: "gatherappforthesisabcdefghigklmnop",
    PUSHER_KEY: "cef12948d59cee44b67e",
    PUSHER_SECRET: "9c65a319db3b2316113c",
    CLOUDINARY_KEY: "233121187336843",
    CLOUDINARY_SECRET: "VUIsbqj5Kq1zFyNb7UPwboxCcuM"
  }
}

module.exports = nextConfig;
