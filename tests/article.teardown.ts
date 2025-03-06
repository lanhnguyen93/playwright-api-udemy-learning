import { test as teardown } from "@playwright/test";

teardown("clean up the new article", async ({ request }) => {
  const deleteResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${process.env.SLUGID}`
  );
});
