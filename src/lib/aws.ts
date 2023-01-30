import { env } from "@/env/server.mjs";
import * as aws from "aws-sdk";

aws.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION,
  signatureVersion: "v4",
});

export const AWS = aws;
