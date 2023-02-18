import { env } from "@/env/server.mjs";
import * as aws from "aws-sdk";

aws.config.update({
  apiVersion: "2006-03-01",
  accessKeyId: env.S3_KEY_ID,
  secretAccessKey: env.S3_KEY_SECRET,
  region: env.S3_REGION,
  signatureVersion: "v4",
});

export const AWS = aws;
