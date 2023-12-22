import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const query: string | null = url.searchParams.get("query");

  // handle if query is not present
  if (query === null) {
    return new Response(
      JSON.stringify({
        error: "Query param is missing",
      }),
      {
        status: 400, // bad request
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection('blog')

  const searchResults = allBlogArticles.filter((a) => {
    const titleMatch: boolean = a.data.title
      .toLowerCase()
      .includes(query!.toLowerCase());

    const bodyMatch: boolean = a.body
      .toLowerCase()
      .includes(query!.toLowerCase());

    const slugMatch: boolean = a.slug
      .toLowerCase()
      .includes(query!.toLowerCase());

    return titleMatch || bodyMatch || slugMatch
  });

  return new Response(JSON.stringify(searchResults), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
