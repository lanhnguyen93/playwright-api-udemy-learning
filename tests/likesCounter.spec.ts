import { test, expect } from "@playwright/test";

test("like counter increase", async ({ page }) => {
  await page.goto("https://conduit.bondaracademy.com/");
  await page.getByText("Global Feed").click();

  const firstArticle = page.locator("app-article-preview").first();
  const likeButton = firstArticle.locator("app-favorite-button button");
  await expect(likeButton).toHaveText("0");
  await likeButton.click();
  await expect(likeButton).toHaveText("1");
});
