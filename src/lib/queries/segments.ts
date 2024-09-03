import { readJsonFromS3 } from "../../server/s3";
import { segmentSchema } from "../schemas/segments";

export const getSegments = readJsonFromS3("segments.json", segmentSchema.array());
