import { Effect } from "effect";
import { readJsonFromS3 } from "../../server/s3";
import { userSchema } from "../schemas/user";

export const getUsers = Effect.gen(function* () {
  const users = yield* readJsonFromS3("users.json", userSchema.array());

  return users;
}).pipe(Effect.catchAll(() => Effect.succeed(undefined)));