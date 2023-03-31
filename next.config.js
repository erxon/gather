/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: "mongodb+srv://e-castasus:Eton110300@cluster0.wbcoa.mongodb.net/gather?retryWrites=true&w=majority"
  }
}

module.exports = nextConfig;
