import { test, expect } from '@playwright/test';
import { loginPage } from '../../utils/loginPage';


test('Assignment5', async ({ page }) => {
    const userName = "shravan.arepaka@gmail.com";
    const password = "Sravan@1234"
    const login = new loginPage(page, expect);
    //Step1
    const fakePayload = login.buildMockEvents();
    const dummyPayload = {
        success: true, data: fakePayload[1], pagination: {
            total: fakePayload.length, page: 1, limit: 12,
            totalPages: 1
        }
    };
    const body = {
        success: true,
        data: fakePayload,
        pagination: {
            total: fakePayload.length,
            page: 1,
            limit: 12,
            totalPages: 1
        }
    };
    await login.openLoginPage();
    await login.installMockEventRoutes(page, body)
    await login.login(userName, password);
    await expect(page.locator('h1')).toHaveText('Upcoming Events');
    await page.locator('#nav-events').click();
    await page.waitForResponse("https://api.eventhub.rahulshettyacademy.com/api/events?page=1&limit=12");
    await expect(page.locator('#event-card')).toHaveCount(4);
    await expect(page.locator('#event-card h3')).toHaveCount(4);
    await expect(page.getByText('World Tech Summit')).not.toBeVisible();
    for (let i = 0; i < await page.locator('#event-card').count(); i++) {
        const card = page.locator('#event-card');
        await expect(card.getByRole("link", { name: 'Book Now' }).nth(i)).toHaveAttribute('href', `/events/${fakePayload[i].id}`);
        await expect(page.locator("p[class*='text-indigo-700']").nth(i)).toBeVisible();
        await expect(page.locator(".grid article .p-4 span[class*='text-xs']").nth(i)).toBeVisible();
    }
    await page.route("https://api.eventhub.rahulshettyacademy.com/api/events?search=Hyderabad&category=Conference&city=Hyderabad&page=1&limit=12",
        async route => {
            const response = await page.request.fetch(route.request());
            route.fulfill({
                response,
                body: JSON.stringify(dummyPayload)
            });
        }
    )
    await page.getByPlaceholder('Search events, venues…').fill("Hyderabad Event");
    const categorydropDown = page.locator('select.w-full').first();
    await categorydropDown.selectOption('Conference');
    const cityDropdown = page.locator('select.w-full').last();
    await cityDropdown.selectOption('Hyderabad');
    console.log(fakePayload[1]);
    await page.waitForResponse("https://api.eventhub.rahulshettyacademy.com/api/events?search=Hyderabad&category=Conference&city=Hyderabad&page=1&limit=12");
    await page.pause();
});