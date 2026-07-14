import { test, expect } from "@playwright/test"; import { loginPage } from "../../utils/loginPage";
test("Assignment5", async ({ page }) => {
    const userName = "shravan.arepaka@gmail.com";
    const password = "Sravan@1234";
    const login = new loginPage(page, expect);

    await login.openLoginPage();
    await page.getByPlaceholder('you@email.com').fill(userName);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.locator('h2').first()).toHaveText('Featured Events');

    //Fetch response using route method
    await page.route('**/api/bookings**', async route => {

        console.log("Intercepted");

        const response = await route.fetch();

        console.log(response.status());

        const body = await response.json();
        const bookingData = body.data[0];
        console.log(bookingData);
        bookingData.event.title = "Hyderabad Event";
        await route.fulfill({
            response,
            json: body
        });
    });

    //Click mybookings and wait for the response
    await page.locator('#nav-bookings').click();
    //await page.waitForLoadState('networkidle');
    await page.pause();
});