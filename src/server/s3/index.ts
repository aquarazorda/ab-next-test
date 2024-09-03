import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Effect } from "effect";
import { Resource } from "sst";
import { z } from "zod";
import { env } from "../../utils/env";

const s3Client = new S3Client({
  region: env.AWS_REGION,
});

const getS3UploadUrl = (key: string) => {
  const command = new PutObjectCommand({
    Key: key,
    Bucket: Resource.TestBucket.name,
  });
  return getSignedUrl(s3Client, command);
};

export const readJsonFromS3 = <T extends z.ZodSchema>(key: string, schema: T) =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise(() =>
      s3Client
        .send(
          new GetObjectCommand({ Bucket: Resource.TestBucket.name, Key: key }),
        )
        .then((r) => r.Body?.transformToString()),
    );

    if (!response) {
      return yield* Effect.fail("Failed to read from S3");
    }

    const json = yield* Effect.try(() => JSON.parse(response));

    const parsed: z.infer<T> = yield* Effect.tryPromise({
      try: () => schema.parseAsync(json),
      catch: () => "JSON is not matching schema",
    });

    return parsed;
  }).pipe(Effect.tapError(Effect.logError));

export const uploadJsonToS3 = (Key: string, data: object) =>
  Effect.tryPromise(async () => {
    const url = await getS3UploadUrl(Key);

    return fetch(url, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  });
