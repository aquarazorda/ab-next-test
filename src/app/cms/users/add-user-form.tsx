"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Effect, Either } from "effect";
import { revalidatePath } from "next/cache";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MultiSelect } from "../../../components/ui/multi-select";
import { userFormSchema } from "../../../lib/schemas/user";
import { addUser } from "../../../server/queries/users";

export const userSegments = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "vip",
    label: "VIP",
  },
  {
    value: "regular",
    label: "Regular",
  },
];

export default function AddUserForm() {
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      segments: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof userFormSchema>) => {
    const res = await Effect.tryPromise(() => addUser(values)).pipe(
      Effect.either,
      Effect.runPromise,
    );

    if (Either.isRight(res)) {
      revalidatePath("/cms/users");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-4 w-full items-center justify-center"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter user name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="segments"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Segments</FormLabel>
              <FormControl>
                <MultiSelect
                  defaultValue={field.value}
                  options={userSegments}
                  {...field}
                  onValueChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-auto">
          Add User
        </Button>
      </form>
    </Form>
  );
}
