"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Effect, Either } from "effect";
import { revalidatePath } from "next/cache";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { updateSegments } from "../../../server/queries/segments";

const segmentSchema = z.object({
  name: z.string().min(1, "Segment name is required"),
  routes: z.array(z.string()),
});

const formSchema = z.object({
  segments: z.array(segmentSchema),
});

type Segment = z.infer<typeof segmentSchema>;

interface SegmentFormProps {
  initialSegments: Segment[];
}

export default function SegmentForm({ initialSegments }: SegmentFormProps) {
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      segments: initialSegments,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "segments",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await Effect.tryPromise(() =>
      updateSegments(values.segments),
    ).pipe(Effect.either, Effect.runPromise);

    if (Either.isRight(res)) {
      revalidatePath("/cms/segments");
      setIsDirty(false);
    }
  };

  const handleChange = () => {
    setIsDirty(true);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Table>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`segments.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              handleChange();
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`segments.${index}.routes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            onChange={(e) => {
                              field.onChange(e.target.value.split(","));
                              handleChange();
                            }}
                            value={field.value.join(",")}
                            placeholder="Enter routes separated by commas"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => {
                      remove(index);
                      handleChange();
                    }}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button
          type="button"
          onClick={() => {
            append({ name: "", routes: [] });
            handleChange();
          }}
        >
          Add Segment
        </Button>
        {isDirty && <Button type="submit">Save Changes</Button>}
      </form>
    </Form>
  );
}
