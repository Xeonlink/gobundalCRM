/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,

  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/admin/orders",
        permanent: true,
      },
      {
        source: "/kiosk/orders",
        destination: "/kiosk/orders/products",
        permanent: true,
      },
      {
        source: "/kiosk/teams",
        destination: "/kiosk/teams/start",
        permanent: true,
      },
    ];
  },
};
