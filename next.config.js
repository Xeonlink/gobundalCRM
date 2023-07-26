/** @type {import('next').NextConfig} */

module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/admin/orders",
        permanent: true,
      },
    ];
  },
};
