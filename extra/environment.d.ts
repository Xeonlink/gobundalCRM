namespace NodeJS {
  interface ProcessEnv {
    // NextAuth
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    // Cognito
    COGNITO_USERPOOL_ID: string;
    COGNITO_CLIENT_ID: string;
    COGNITO_CLIENT_SECRET: string;
    COGNITO_ISSUER: string;
    // Naver
    NAVER_CLIENT_ID: string;
    NAVER_CLIENT_SECRET: string;
    // Kakao
    KAKAO_CLIENT_ID: string;
    KAKAO_CLIENT_SECRET: string;
    // Google
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    // 결제연동
    STORE_ID: string;
    IAMPORT_IMP: string;
    PORTONE_API_KEY: string;
    PORTONE_API_SECRET: string;
    // 결제연동 - client
    NEXT_PUBLIC_STORE_ID: string;
    NEXT_PUBLIC_IAMPORT_IMP: string;
  }
}
