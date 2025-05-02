// file which changes the path for production and dev, this ensures that two ports are running simultaneously 3000 for front end 5000 for backend or otherwise

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? "/api/:path*"
            : "http://localhost:5000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
