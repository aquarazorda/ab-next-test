"use server";

import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Effect } from "effect";
import { Resource } from "sst";
import { z } from "zod";
import { env } from "../../utils/env";

const s3Client = new S3Client({
  region: env.AWS_REGION
});

const getS3UploadUrl = (key: string) => {
  const command = new PutObjectCommand({
    Key: key,
    Bucket: Resource.TestBucket.name
  });
  return getSignedUrl(s3Client, command);
};

export const readJsonFromS3 = <T extends z.ZodSchema>(key: string, schema: T) =>
  Effect.tryPromise<z.infer<T>>(() =>
    s3Client
      .send(new GetObjectCommand({ Bucket: Resource.TestBucket.name, Key: key }))
      .then(async (response) => {
        const bodyContents = await response.Body?.transformToString();

        if (!bodyContents) {
          throw new Error("No body contents");
        }

        return schema.parse(JSON.parse(bodyContents));
      })
  ).pipe(Effect.tap(() => Effect.log({
    message: "Successfully read JSON from S3",
    key,
    bucket: Resource.TestBucket.name
  })), Effect.tapError(e => Effect.logError({
    message: "Error reading JSON from S3",
    key,
    error: e,
    bucket: Resource.TestBucket.name
  })), Effect.catchAll(() => Effect.succeed(undefined)));

export const uploadJsonToS3 = (Key: string, data: object) =>
  Effect.tryPromise(async () => {
    const url = await getS3UploadUrl(Key);

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });
