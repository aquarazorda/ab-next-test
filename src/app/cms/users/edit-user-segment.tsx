"use client";

import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Effect, Either } from "effect";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { User, userFormSchema } from "../../../lib/schemas/user";
import { updateUsers } from "../../../server/queries/users";
import { userSegments } from "./add-user-form";

interface EditUserSegmentProps {
  initialUsers: User[];
}

const formSchema = z.object({
  users: z.array(userFormSchema),
});

export default function EditUserSegment({
  initialUsers,
}: EditUserSegmentProps) {
  const router = useRouter();
  const [isDirty, setIsDirty] = useState(false);

  const form = useForm<{ users: User[] }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      users: initialUsers,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "users",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await Effect.tryPromise(() => updateUsers(values.users)).pipe(
      Effect.either,
      Effect.runPromise,
    );

    if (Either.isRight(res)) {
      revalidatePath("/cms/users");
    }
    // Reset the dirty state after saving
    setIsDirty(false);
  };

  const handleSegmentChange = (index: number, newValue: string[]) => {
    form.setValue(`users.${index}.segments`, newValue);
    setIsDirty(true);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Segments</TableHead>
            <TableHead>Impersonate User</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>{field.name}</TableCell>
              <TableCell>
                <MultiSelect
                  options={userSegments}
                  defaultValue={field.segments}
                  onValueChange={(value) => handleSegmentChange(index, value)}
                />
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    document.cookie = `user=${encodeURIComponent(field.name)}; path=/`;
                    router.push("/");
                  }}
                >
                  Impersonate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {isDirty && (
        <div className="mt-4">
          <Button type="submit">Save Changes</Button>
        </div>
      )}
    </form>
  );
}
