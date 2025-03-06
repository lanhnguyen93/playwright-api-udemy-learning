import { request, expect } from "@playwright/test";
import user from "./.auth/user.json";
import fs from "fs";

async function globalSetup() {
  console.log("global setup ...");
  const authFile = ".auth/user.json";
  const context = await request.newContext();

  const loginResponse = await context.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    {
      data: { user: { email: "viewpoint@test.com", password: "viewpoint1" } },
    }
  );
  const loginData = await loginResponse.json();
  const token = loginData.user.token;
  user.origins[0].localStorage[0].value = token;
  fs.writeFileSync(authFile, JSON.stringify(user)); //Ghi đối tượng user đã được cập nhật vào tệp user.json
  process.env["ACCESS_TOKEN"] = token;
  console.log("check token: ", process.env.ACCESS_TOKEN);

  // Create a new article via API
  const articleResponse = await context.post(
    "https://conduit-api.bondaracademy.com/api/articles/",
    {
      headers: {
        Authorization: `Token ${process.env.ACCESS_TOKEN}`,
      },
      data: {
        article: {
          title: "Global article check like button",
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
  console.log("check token: ", process.env.SLUGID);
}

export default globalSetup;
