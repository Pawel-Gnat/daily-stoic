import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";

const username = process.env.E2E_USERNAME;
const password = process.env.E2E_PASSWORD;

if (!username || !password) {
  throw new Error("E2E_USERNAME and E2E_PASSWORD environment variables must be set");
}

test.describe("Login Flow", () => {
  test("should allow a user to log in and redirect to the homepage", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(username, password);

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");
  });
});
