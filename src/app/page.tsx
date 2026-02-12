import { query } from "@/lib/db";
import Link from "next/link";

async function getUsers() {
  const result = await query("SELECT * FROM users ORDER BY created_at DESC");
  return result.rows;
}

export default async function HomePage() {
  const users = await getUsers();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Users</h1>
          <Link
            href="/users/registration"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create New User
          </Link>
        </div>

        {users.length === 0 ? (
          <p className="text-gray-600">
            No users yet. Create one to get started!
          </p>
        ) : (
          <div className="space-y-4">
            {users.map((user: any) => (
              <div
                key={user.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.username}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Created: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
