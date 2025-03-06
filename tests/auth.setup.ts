import { test as setup, expect } from "@playwright/test";
import user from "../.auth/user.json";
import fs from "fs";

const authFile = ".auth/user.json";

// create user.json
// create user.json
// setup("init authentication", async ({ page }) => {
//   await page.goto("https://conduit.bondaracademy.com/");
//   await page.getByRole("link", { name: "Sign in" }).click();
//   await page.getByPlaceholder("Email").fill("viewpoint@test.com");
//   await page.getByPlaceholder("Password").fill("viewpoint1");
//   await page.getByRole("button", { name: "Sign in" }).click();
//   await page.waitForResponse("https://conduit-api.bondaracademy.com/api/tags");

//   await page.context().storageState({ path: authFile });
// });

//update token
setup("update token", async ({ page, request }) => {
  const response = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: { user: { email: "viewpoint@test.com", password: "viewpoint1" } },
    }
  );
  const loginData = await response.json();
  const token = loginData.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user)); //Ghi đối tượng user đã được cập nhật vào tệp user.json

  process.env["ACCESS_TOKEN"] = token;
});

// setup("create a new article", async ({ request }) => {
//   const token = process.env.ACCESS_TOKEN;
//   console.log("check token from auth.setup.ts: ", token);

//   // Create a new article via API
//   const articleResponse = await request.post(
//     "https://conduit-api.bondaracademy.com/api/articles/",
//     {
//       headers: {
//         Authorization: `Token ${token}`,
//       },
//       data: {
//         article: {
//           title: "Article check like button",
//           description: "New Article Description",
//           body: "This is the body of the new article.",
//           tagList: ["test", "playwright"],
//         },
//       },
//     }
//   );
//   expect(articleResponse.status()).toEqual(201);
//   const articleData = await articleResponse.json();
//   process.env["SLUGID"] = articleData.article.slug;
// });
