"use server";

import { Effect } from "effect";
import { z } from "zod";
import { getUsers } from "../../lib/queries/users";
import { userFormSchema } from "../../lib/schemas/user";
import { uploadJsonToS3 } from "../s3";

export const addUser = (values: z.infer<typeof userFormSchema>) => Effect.gen(function* () {
  const users = yield* getUsers;
  const newUsers = [...(users ?? []), values];

  yield* uploadJsonToS3("users.json", newUsers);

  return newUsers;
}).pipe(
  Effect.runPromise
);

export const updateUsers = (values: z.infer<typeof userFormSchema>[]) => Effect.gen(function* () {
  yield* uploadJsonToS3("users.json", values);

  return values;
}).pipe(
  Effect.runPromise
);