import { test as setup } from "@playwright/test";

setup("clean up the new article", async ({ request }) => {
  const deleteResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`
  );
});
