/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: false,

  env: {
    AWS_COGNITO_USERPOOL_ID: "ap-northeast-2_vo86vEtnN",
  },
  redirects: async () => {
    return [
      {
        source: "/kiosk/orders",
        destination: "/kiosk/orders/products",
        permanent: true,
      },
      {
        source: "/user/experience",
        destination: "/user/experience/hello",
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gobundalcrmstack-crmbucket11d59937-zyxwpe9qg2xl.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
      },
    ],
  },
};
