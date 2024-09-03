import { Effect, pipe } from "effect";
import { readJsonFromS3 } from "../../server/s3";
import { segmentSchema } from "../schemas/segments";

export const getSegments = pipe(
  readJsonFromS3("segments.json", segmentSchema.array()),
  Effect.catchAll(() => Effect.succeed(undefined))
);
