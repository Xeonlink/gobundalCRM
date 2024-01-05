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
        source: "/experience",
        destination: "/experience/hello",
        permanent: false,
      },
    ];
  },

  images: {
    remotePatterns: [
      // AWS S3 버킷 주소 - 상품이미지에 사용되는 에셋들을 받아는 주소
      {
        protocol: "https",
        hostname:
          "gobundalserverv2stack-imagebucket6194e37c-y8obdbi9torr.s3.ap-northeast-2.amazonaws.com",
      },
      // 네이버 사용자 프로필 이미지 - 사용자가 아무것도 등록하지 않은 경우
      {
        protocol: "https",
        hostname: "ssl.pstatic.net",
      },
      // 카카오로그인시 프로필 사진 받아오는 사이트의 주소
      {
        protocol: "http",
        hostname: "k.kakaocdn.net",
      },
      // 구글로그인시 프로필 사진 받아오는 사이트의 주소
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};
