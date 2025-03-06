import { test, expect } from "@playwright/test";
import tags from "../test-data/tags.json";

test.beforeEach(async ({ page }) => {
  await page.route("*/**/api/tags", async (route) => {
    await route.fulfill({
      body: JSON.stringify(tags),
    });
  });

  await page.goto("https://conduit.bondaracademy.com/");
  await page.waitForLoadState("load");
});

test("has tags", async ({ page }) => {
  await expect(page.locator(".sidebar")).toContainText("Automation");
});

test("check article", async ({ page }) => {
  await page.route("*/**/api/articles*", async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();
    responseBody.articles[0].title = "This is MOCK title";
    responseBody.articles[0].description = "This is MOCK description";
    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });
  await page.getByText("Global Feed").click();
  const article = page.locator("app-article-preview").first();
  await expect(article.getByRole("heading")).toHaveText("This is MOCK title");
  await expect(article.locator("p")).toHaveText("This is MOCK description");
  await expect(
    page.locator("app-article-preview h1", {
      hasText: "This is MOCK title",
    })
  ).toBeVisible();
});

test("delete article", async ({ page, request }) => {
  // get login access token
  //   const response = await request.post(
  //     "https://conduit-api.bondaracademy.com/api/users/login",
  //     {
  //       data: { user: { email: "viewpoint@test.com", password: "viewpoint1" } },
  //     }
  //   );
  //   const loginData = await response.json();
  //   const token = loginData.user.token;
  const token = process.env.ACCESS_TOKEN;

  // Create a new article via API
  const articleResponse = await request.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      //   headers: {
      //     Authorization: `Token ${token}`,
      //   },
      data: {
        article: {
          title: "The Article Title",
          description: "New Article Description",
          body: "This is the body of the new article.",
          tagList: ["test", "playwright"],
        },
      },
    }
  );
  expect(articleResponse.status()).toEqual(201);
  const articleData = await articleResponse.json();
  const slug = articleData.article.slug;

  await page.getByText("Global Feed").click();
  await expect(
    page.locator("app-article-preview h1", {
      hasText: articleData.article.title,
    })
  ).toBeVisible();

  //Delete article via browser
  await page.goto(`https://conduit.bondaracademy.com/article/${slug}`);
  await page.locator(".banner button", { hasText: "Delete Article" }).click();

  //Verify the article is deleted
  await page.getByText("Global Feed").click();
  await expect(
    page.locator("app-article-preview h1", {
      hasText: articleData.article.title,
    })
  ).not.toBeVisible();
});

test("create a article", async ({ page, request }) => {
  await page.getByRole("link", { name: "New Article" }).click();
  await page.getByPlaceholder("Article Title").fill("Playwright is awesome");
  await page
    .getByPlaceholder("What's this article about?")
    .fill("Playwright description");
  await page
    .getByPlaceholder("Write your article (in markdown)")
    .fill("Playwright body");
  await page.getByRole("button", { name: "Publish Article" }).click();
  const articleResponse = await page.waitForResponse(
    "https://conduit-api.bondaracademy.com/api/articles/"
  );
  const articleData = await articleResponse.json();
  const slug = articleData.article.slug;
  const title = articleData.article.title;
  expect(articleResponse.status()).toEqual(201);

  await page.getByRole("link", { name: "Home" }).click();
  await page.getByText("Global Feed").click();
  await expect(
    page.locator("app-article-preview h1", {
      hasText: articleData.article.title,
    })
  ).toBeVisible();

  // get login access token
  //   const response = await request.post(
  //     "https://conduit-api.bondaracademy.com/api/users/login",
  //     {
  //       data: { user: { email: "viewpoint@test.com", password: "viewpoint1" } },
  //     }
  //   );
  //   const loginData = await response.json();
  //   const token = loginData.user.token;
  //   const token = process.env.ACCESS_TOKEN;

  //Delete article via API
  const deleteResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slug}`
  );

  //Verify the article is deleted
  await page.reload();
  await page.getByText("Global Feed").click();
  await expect(
    page.locator("app-article-preview h1", {
      hasText: articleData.article.title,
    })
  ).not.toBeVisible();
});
