import { readJsonFromS3 } from "../../server/s3";
import { userSchema } from "../schemas/user";

export const getUsers = readJsonFromS3("users.json", userSchema.array());