import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest } from "next/server";

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.IMAGE_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.IAMGE_BUCKET_SECRET_ACCESS_KEY,
  },
  region: process.env.IAMGE_BUCKET_REGION,
});

export async function GET(req: NextRequest) {
  const filename = req.nextUrl.searchParams.get("filename");
  if (filename === null) {
    return new Response("filename is required", { status: 400 });
  }
  const mimeType = req.nextUrl.searchParams.get("mimeType");
  if (mimeType === null) {
    return new Response("mimeType is required", { status: 400 });
  }

  const command = new PutObjectCommand({
    Bucket: process.env.IMAGE_BUCKET_NAME,
    Key: filename,
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: 60 * 60 * 24,
    signingRegion: process.env.IAMGE_BUCKET_REGION,
  });

  return new Response(url, { status: 200 });
}
