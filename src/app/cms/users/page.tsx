'use client';

import { MultiSelect } from "@/components/ui/multi-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const users = [
    { id: 1, name: 'John Doe', segments: ['admin', 'vip'] },
] satisfies {
    id: number;
    name: string;
    segments: (typeof segments)[number]['value'][];
}[];

const segments = [
    {
        value: "admin",
        label: "Admin"
    },
    {
        value: "vip",
        label: "VIP"
    },
    {
        value: "regular",
        label: "Regular"
    },
];

export default function UsersPage() {
    return <div>
        <h1>Users</h1>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Segments</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                            <MultiSelect options={segments} defaultValue={user.segments} onValueChange={(value) => {
                                console.log(value);
                            }} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
}