import { NextResponse } from "next/server";

export async function GET() {
  const apiKey1 = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const apiKey2 = process.env.NEXT_PUBLIC_YOUTUBE_API_BACKUPKEY;
  const channelId = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;

  const getUrl = (key) =>
    `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channelId}&part=snippet,id&order=date&maxResults=12`;

  try {
    let res = await fetch(getUrl(apiKey1));
    if (!res.ok) throw new Error("Primary key failed");

    const data = await res.json();
    return NextResponse.json(data.items);
  } catch {
    try {
      const res = await fetch(getUrl(apiKey2));
      const data = await res.json();
      return NextResponse.json(data.items);
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch videos" },
        { status: 500 }
      );
    }
  }
}
