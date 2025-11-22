import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";

async function getNewsItem(id: string) {
  const newsItem = await prisma.news.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  if (!newsItem || !newsItem.published) {
    return null;
  }

  return newsItem;
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsItem = await getNewsItem(id);

  if (!newsItem) {
    notFound();
  }

  const readingTime = Math.ceil(
    newsItem.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-white-kings via-white-off to-gray-100 dark:from-black-dark dark:via-gray-900 dark:to-black-kings py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center space-x-2 text-blue-kings hover:text-blue-dark mb-6 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver a Novedades</span>
          </Link>

          <article className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {newsItem.image && (
              <div className="relative w-full h-96 md:h-[500px]">
                <Image
                  src={newsItem.image}
                  alt={newsItem.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">
                    {newsItem.author.name || "Administrador"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={newsItem.createdAt.toISOString()}>
                    {format(new Date(newsItem.createdAt), "d 'de' MMMM 'de' yyyy", {
                      locale: es,
                    })}
                  </time>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min de lectura</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                {newsItem.title}
              </h1>

              <div
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-p:text-gray-700 dark:prose-p:text-gray-300
                  prose-a:text-blue-kings dark:prose-a:text-blue-light
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                  prose-ol:text-gray-700 dark:prose-ol:text-gray-300
                  prose-li:text-gray-700 dark:prose-li:text-gray-300
                  prose-blockquote:border-l-blue-kings
                  prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
                  prose-code:text-blue-kings dark:prose-code:text-blue-light
                  prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                  prose-img:rounded-lg prose-img:shadow-lg
                  mb-8"
                dangerouslySetInnerHTML={{ __html: newsItem.content }}
              />

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Publicado el{" "}
                      {format(new Date(newsItem.createdAt), "d 'de' MMMM 'de' yyyy 'a las' HH:mm", {
                        locale: es,
                      })}
                    </p>
                  </div>
                  <Link
                    href="/news"
                    className="text-blue-kings hover:text-blue-dark font-medium transition-colors"
                  >
                    Ver todas las noticias →
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
