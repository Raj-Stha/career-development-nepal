import YouTubeGrid from "./_components/youtube-grid";
import EmptyState from "./_components/emptystate";

export default async function Youtube() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/youtube`, {
    cache: "no-store",
  }).then((res) => res.json());

  return (
    <div>
      <div className="container mx-auto px-4 py-4" />

      {data ? <YouTubeGrid data={data} /> : <EmptyState />}
    </div>
  );
}
