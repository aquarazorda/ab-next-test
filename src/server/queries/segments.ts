"use server";

import { Effect } from "effect";
import { z } from "zod";
import { getSegments } from "../../lib/queries/segments";
import { segmentSchema } from "../../lib/schemas/segments";
import { uploadJsonToS3 } from "../s3";

export const addSegment = (values: z.infer<typeof segmentSchema>) => Effect.gen(function* () {
  const segments = yield* getSegments;
  const newSegments = [...(segments ?? []), values];

  yield* uploadJsonToS3("segments.json", newSegments);

  return newSegments;
}).pipe(
  Effect.runPromise
);

export const updateSegments = (values: z.infer<typeof segmentSchema>[]) => Effect.gen(function* () {
  yield* uploadJsonToS3("segments.json", values);

  return values;
}).pipe(
  Effect.runPromise
);
