"use client";
import { useRouter } from "next/navigation";

export default function NewsList() {
  const router = useRouter();

  // Dummy data for news
  const newsData = [
    {
      id: 1,
      title: "New Disaster Preparedness Plan Announced",
      date: "2024-11-15",
      imgUrl: "/bpbd-bg.png",
    },
    {
      id: 2,
      title: "Flood Relief Efforts Ongoing",
      date: "2024-11-10",
      imgUrl: "/bpbd-bg.png",
    },
    {
      id: 3,
      title: "Community Training on Earthquake Safety",
      date: "2024-11-05",
      imgUrl: "/bpbd-bg.png",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <span 
          className="text-[#f28202] cursor-pointer" 
          onClick={() => router.push('/')}
        >
          Back To Dashboard
        </span>
        <h1 className="text-4xl font-bold">List News</h1>
      </div>
      <div className="grid gap-8">
        {newsData.map(news => (
          <div key={news.id} className="flex items-center space-x-4 bg-white shadow-md p-4 rounded-lg">
            <img src={news.imgUrl} alt={news.title} className="w-24 h-24 rounded-lg object-cover" />
            <div>
              <h2 className="text-xl font-bold cursor-pointer" onClick={() => router.push(`/visitor/news/${news.id}`)}>
                {news.title}
              </h2>
              <p className="text-gray-500">{news.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
