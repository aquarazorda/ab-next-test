"use server";

import { Effect } from "effect";
import { getSegments } from "../../../lib/queries/segments";
import SegmentForm from "./segment-form";

export default async function SegmentsPage() {
  const segments = await Effect.runPromise(getSegments);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        {segments ? "Segments" : "No segments found"}
      </h1>
      <SegmentForm initialSegments={segments || []} />
    </div>
  );
}
