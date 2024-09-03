"use server";

import { Effect } from "effect";
import { getUsers } from "../../../lib/queries/users";
import AddUserForm from "./add-user-form";
import EditUserSegment from "./edit-user-segment";

export default async function UsersPage() {
  const users = await Effect.runPromise(getUsers);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">
        {users ? "Users" : "No users found"}
      </h1>
      {users && <EditUserSegment initialUsers={users} />}
      <AddUserForm />
    </div>
  );
}
