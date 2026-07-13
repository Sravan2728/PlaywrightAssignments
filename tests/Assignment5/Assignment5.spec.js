import { test, expect } from "@playwright/test"; import { loginPage } from "../../utils/loginPage";
test("Assignment5", async ({ page }) => {
    const userName = "shravan.arepaka@gmail.com";
    const password = "Sravan@1234";
    const login = new loginPage(page, expect);

    //Step1 
    const fakePayload = login.buildMockEvents();
    //const dummyPayload = { success: true, data: fakePayload[1], pagination: { total: fakePayload.length, page: 1, limit: 12, totalPages: 1, }, };
    const body = { success: true, data: fakePayload, pagination: { total: fakePayload.length, page: 1, limit: 12, totalPages: 1, }, };
    await login.openLoginPage();
    await login.installMockEventRoutes(page, fakePayload);
    await login.login(userName, password);
    await expect(page.locator("h1")).toHaveText("Upcoming Events");
    await page.locator("#nav-events").click();
    //await page.waitForResponse("**/api/events?**");
    await expect(page.locator("#event-card")).toHaveCount(4);

    for (const eventtitle of fakePayload) {
        await expect(page.getByText(eventtitle.title)).toBeVisible();
    }
    await expect(page.getByText("World Tech Summit")).not.toBeVisible();
    for (let i = 0; i < (await page.locator("#event-card").count()); i++) {
        const card = page.locator("#event-card");
        await expect(card.getByRole("link", { name: "Book Now" }).nth(i)).toHaveAttribute("href", `/events/${fakePayload[i].id}`);
        await expect(page.locator("p[class*='text-indigo-700']").nth(i)).toContainText(fakePayload[i].price);
        await expect(page.locator(".grid article .p-4 span[class*='text-xs']").nth(i)).toContainText(fakePayload[i].availableSeats.toString());
    }
    await page.getByPlaceholder("Search events, venues…").fill("Hyderabad Event");
    const categorydropDown = page.locator("select.w-full").first();
    await categorydropDown.selectOption("Conference");
    const cityDropdown = page.locator("select.w-full").last();
    await cityDropdown.selectOption("Hyderabad");
    await page.waitForResponse("**/events?*");

    //Test2
    await expect(page.locator("#event-card")).toHaveCount(1);
    await expect(page.locator('#book-now-btn')).toBeVisible();
    await expect(page.locator('#book-now-btn')).toBeEnabled();
    await page.waitForTimeout(2000);
    await page.locator('#book-now-btn').click({force: true});
    await page.waitForResponse("**/events/*");
    let macthedEvent = [...fakePayload];
    console.log(await page.waitForURL("**/events/*"));
    const id = await page.url().split('/').pop();
    macthedEvent = macthedEvent.find(event => event.id === parseInt(id));
    expect(await page.url()).toContain(`/events/${id}`);
    await expect(page.locator('h1')).toHaveText(macthedEvent.title);
    await expect(page.locator('.grid-cols-1 .items-start .text-sm').nth(5)).toContainText(macthedEvent.price);
    await expect(page.locator('.grid-cols-1 .items-start .text-sm').nth(2)).toContainText(macthedEvent.city);
    await expect(page.locator('.grid-cols-1 .items-start .text-sm').nth(4)).toContainText(`${macthedEvent.availableSeats} / `);
    await expect(page.locator('#ticket-count')).toContainText('1');
    let totalAmount = login.parseCurrency(await page.locator('.justify-between .text-indigo-700').last().textContent());
    expect(parseInt(macthedEvent.price)).toBe(totalAmount);
    await page.locator('.space-y-4 button').nth(1).click();
    await expect(page.locator('#ticket-count')).toContainText('2');
    let amount = await page.locator('.justify-between .text-indigo-700').last().textContent();
    const formatAmount = login.parseCurrency(amount);
    expect(formatAmount).toBe(parseInt(macthedEvent.price) * 2);
});