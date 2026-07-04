import {test,expect} from '@playwright/test'
import {loginPage} from '../../utils/loginPage'

test('Assignment3', async({page}) => {
    const userName = "shravan.arepaka@gmail.com";
    const password = "Sravan@1234"
    const login = new loginPage(page,expect);
    await login.openLoginPage();
    await login.login(userName,password);
    await expect(page.locator('h1')).toHaveText('Upcoming Events');
    //Locate the search box by placeholder Search events, venues… and fill World
    await page.getByPlaceholder('Search events, venues…').fill("World");
    await expect(page.getByPlaceholder('Search events, venues…')).toHaveValue('World');
    //Locate the category dropdown and select Conference
    const categorydropDown = page.locator('select.w-full').first();
    await categorydropDown.selectOption('Conference');
    //Locate the city dropdown and select Hyderabad
    const cityDropdown = page.locator('select.w-full').last();
    await cityDropdown.selectOption('Hyderabad');
    await expect(await categorydropDown.inputValue()).toBe("Conference");
    await expect(await cityDropdown.inputValue()).toBe("Hyderabad");
    const eventCards = await login.getEventCards();
    await expect(eventCards.first()).toBeVisible();
    await expect(page.locator('h3:has-text("World Tech Summit")')).toHaveCount(1);
    await expect(page.locator('h3:has-text("World Tech Summit")')).toBeVisible();
    const eventCard = page.locator('.grid .bg-white');
    await expect(eventCard.locator("h3:has-text('World Tech Summit')")).toBeVisible();
    await expect(eventCard.locator("h3:has-text('World Tech Summit')")).toHaveCount(1);
    const eventTitle = await eventCard.locator("h3").textContent();
    console.log("Event title is: ", eventTitle);
    const eventPrice = await page.locator('.grid .bg-white p').textContent();
    await expect(eventPrice).toContain('$');
    const seatCountelement = await page.locator('.grid .bg-white .flex .text-xs');
    const seatCount = await login.parseSeatCount(await seatCountelement.textContent());
    await expect(parseInt(seatCount)).toBeGreaterThan(0);
    await page.locator('#book-now-btn').click();
    await expect(page.url()).toContain('/events');
    await expect(page.locator('h1')).toHaveText(eventTitle);
    await expect(page.locator('.flex .text-2xl')).toHaveText(eventPrice);

    //Test2
    await page.goBack();
    await page.getByPlaceholder('Search events, venues…').clear();
    await categorydropDown.selectOption('All Categories');
    await cityDropdown.selectOption('All Cities');
    await expect(eventCards).toHaveCount(3);
    await expect(eventCards.first()).toBeVisible();
    const firstTitle = await eventCards.first().textContent();
    const lastTitle = await eventCards.last().textContent();
    const middleTitle = await eventCards.nth(1).textContent();
    expect(firstTitle).not.toBe(" ");
    expect(lastTitle).not.toBe(" ");
    expect(middleTitle).not.toBe(" ");
    expect(firstTitle).not.toBe(lastTitle);
    
});