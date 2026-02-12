async function getUser() {
  const res = await fetch("http://localhost:3000/api/user", {
    cache: "no-store", // Don't cache during development
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }

  return res.json();
}

export default async function HomePage() {
  const user = await getUser();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Hello, {user.name}!</h1>
        <p className="text-gray-600">
          This data came from Railway PostgreSQL 🎉
        </p>
      </div>
    </main>
  );
}
