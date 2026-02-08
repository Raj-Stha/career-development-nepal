"use client";
import dynamic from "next/dynamic";
const Blog = dynamic(() => import("./_components/Blog"), { ssr: false });

export default function BlogsPage() {
  return <>
    <Blog />
  </>;
}
