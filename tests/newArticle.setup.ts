import { test as setup, expect } from "@playwright/test";

setup("create a new article", async ({ request }) => {
  const token = process.env.ACCESS_TOKEN;
  console.log("check token from new Article: ", token);

  // Create a new article via API
  const articleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        article: {
          title: "Article check like button",
          description: "New Article Description",
          body: "This is the body of the new article.",
          tagList: ["test", "playwright"],
        },
      },
    }
  );
  expect(articleResponse.status()).toEqual(201);
  const articleData = await articleResponse.json();
  process.env["SLUGID"] = articleData.article.slug;
});
