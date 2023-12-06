namespace NodeJS {
  interface ProcessEnv {
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
  }
}
