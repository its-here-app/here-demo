import SpotSearch from "@/components/SpotSearch";

export default function SearchPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Search Places</h1>
      <SpotSearch />
    </main>
  );
}
