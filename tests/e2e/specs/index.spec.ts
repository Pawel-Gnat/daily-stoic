import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/LoginPage";
import { mockNewEntryData } from "tests/mocks/mocks";

const username = process.env.E2E_USERNAME;
const password = process.env.E2E_PASSWORD;

if (!username || !password) {
  throw new Error("E2E_USERNAME and E2E_PASSWORD environment variables must be set");
}

test.describe("Index Page View (Homepage)", () => {
  test("should allow logged-in user without entry to fill and submit reflection form", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();

    await loginPage.login(username, password);

    await page.waitForURL("/");
    await expect(page).toHaveURL("/");

    await expect(page.getByRole("link", { name: "View Example Reflections" })).not.toBeVisible();

    const reflectionForm = page.getByTestId("reflection-form");
    await expect(reflectionForm).toBeVisible();

    const submitButton = page.getByTestId("reflection-form-submit-button");
    await expect(submitButton).toBeEnabled();

    await expect(page.getByTestId("entry-detail-card")).not.toBeVisible();

    await page.getByTestId("reflection-form-textarea-matters-most").fill(mockNewEntryData.what_matters_most);
    await page.getByTestId("reflection-form-textarea-fears-of-loss").fill(mockNewEntryData.fears_of_loss);
    await page.getByTestId("reflection-form-textarea-personal-goals").fill(mockNewEntryData.personal_goals);

    await submitButton.click();

    await expect(reflectionForm).not.toBeVisible({ timeout: 15000 });

    await expect(page.getByTestId("entry-detail-card")).toBeVisible({ timeout: 15000 });
  });
});
