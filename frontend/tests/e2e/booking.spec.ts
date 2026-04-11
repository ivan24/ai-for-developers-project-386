import { expect, test } from "@playwright/test";

const buildUtcSlotStart = () => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}T09:00:00+00:00`;
};

test("guest can complete the main booking flow", async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const guestName = "Playwright Guest";
  const guestEmail = "playwright.guest@example.com";

  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto("/");

  await expect(page.getByText("E2E Intro Call", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Book slot" }).click();

  const slotButton = page.getByTestId(`slot-button-${buildUtcSlotStart()}`);

  await expect(slotButton).toBeVisible();
  await slotButton.click();
  await expect(page.getByTestId("selected-slot-alert")).toBeVisible();

  await page.getByRole("button", { name: "Continue to details" }).click();

  await page.getByLabel("Guest name").fill(guestName);
  await page.getByLabel("Guest email").fill(guestEmail);

  const bookingResponse = page.waitForResponse((response) => {
    return (
      response.url().includes("/public/bookings")
      && response.request().method() === "POST"
      && response.status() === 201
    );
  });

  await page.getByRole("button", { name: "Create booking" }).click();

  await bookingResponse;

  const confirmationAlert = page.getByTestId("booking-confirmed-alert");

  await expect(confirmationAlert).toContainText("Booking confirmed");
  await expect(confirmationAlert).toContainText(guestName);
  await expect(confirmationAlert).toContainText("Guest token:");

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
