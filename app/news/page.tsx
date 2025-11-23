import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { Newspaper, Calendar, User } from "lucide-react";
import Link from "next/link";

async function getNews() {
  return await prisma.news.findMany({
    where: { published: true },
    include: {
      author: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-black-dark via-gray-900 to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-8">
            <Newspaper className="h-8 w-8 text-blue-kings" />
            <h1 className="text-4xl font-bold">Novedades</h1>
          </div>

          <div className="space-y-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{item.author.name || "Admin"}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(item.createdAt), "d MMMM yyyy")}</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
                <div
                  className="text-gray-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
              </article>
            ))}

            {news.length === 0 && (
              <div className="text-center py-12 bg-gray-800 rounded-2xl shadow-lg">
                <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">
                  No hay novedades aún
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

