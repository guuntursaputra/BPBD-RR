"use client";
import { useRouter, useParams } from "next/navigation";

export default function NewsDetail() {
  const router = useRouter();
  const { id } = useParams();

  // Dummy data for news details
  const newsDetails = {
    id: id,
    title: "New Disaster Preparedness Plan Announced",
    date: "2024-11-15",
    imgUrl: "/bpbd-bg.png",
    content: `
      This is a detailed description of the news article. It highlights the important aspects of the disaster preparedness plan announced by local authorities.
      The plan includes multiple initiatives to increase awareness and resilience in communities, especially in high-risk areas. 
      Local authorities emphasize that citizens should be aware of evacuation routes and have emergency kits ready at all times.
    `,
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <span 
          className="text-[#f28202] cursor-pointer" 
          onClick={() => router.push('/visitor/news')}
        >
          Back To List News
        </span>
        <h1 className="text-4xl font-bold">News Detail</h1>
      </div>
      <div className="bg-white shadow-md rounded-lg p-8">
        <img src={newsDetails.imgUrl} alt={newsDetails.title} className="w-full h-64 object-cover rounded-lg mb-6" />
        <h2 className="text-3xl font-bold mb-2">{newsDetails.title}</h2>
        <p className="text-gray-500 mb-4">Published on: {newsDetails.date}</p>
        <p className="text-sm font-semibold text-gray-400 mb-6">News ID: {newsDetails.id}</p>
        <p className="text-lg text-gray-700 leading-relaxed">{newsDetails.content}</p>
      </div>
    </div>
  );
}
