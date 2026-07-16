import { test, expect } from "@playwright/test"; import { loginPage } from "../../utils/loginPage"; test("Assignment5", async ({ page }) => {
    const userName = "shravan.arepaka@gmail.com"; const password = "Sravan@1234"; const login = new loginPage(page, expect);
    await login.openLoginPage(); await page.getByPlaceholder("you@email.com").fill(userName);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Sign In" }).click();
    await expect(page.locator("h2").first()).toHaveText("Featured Events");
    //Fetch response using route method 
    const patchedBookingpromise = login.patchBookingsList({ eventTitle: "Hyderabad Event", bookingRef: "HYD-EVENT", quantity: "1", totalPrice: 700, });
    //Click mybookings and wait for the response 
    await page.locator("#nav-bookings").click();
    await expect(page.locator("h1")).toBeVisible();
    const patchedBookingData = await patchedBookingpromise;
    // console.log("Printing Patched Booking Data:", patchedBookingData); 
    const card = await login.findBookingCardByRef(patchedBookingData.bookingRef);
    await expect(card).toBeVisible();
    await expect(card.locator("h3")).toHaveText(patchedBookingData.event.title);
    await expect(card.locator(".items-start .gap-x-4 span").nth(1)).toContainText(patchedBookingData.quantity);

    let price = await card.locator(".items-start .text-right .text-indigo-700").textContent();
    price = login.parseCurrency(price);
    await expect(price).toBe(parseInt(patchedBookingData.totalPrice));
    await expect(page.locator("#booking-card .booking-ref").nth(1)).not.toHaveText(patchedBookingData.event.title);
    await login.patchBookingDetail(patchedBookingData);
    await card.getByRole("button", { name: "View Details" }).click();
    await expect(page.locator(".items-center .font-mono").first()).toBeVisible();
    await expect(page.locator(".items-center .font-mono").first()).toHaveText(patchedBookingData.bookingRef);
    await expect(page.locator("h1")).toHaveText(patchedBookingData.event.title);

    const tikcetCount = page.locator(".space-y-4 .bg-white").nth(2);
    await expect(tikcetCount.locator(".font-medium").first()).toHaveText(patchedBookingData.quantity.toString());
    let totalAmount = login.parseCurrency(await page.locator(".justify-between .text-indigo-700").last().textContent());
    let ticketQuantity = await tikcetCount.locator(".font-medium").first().textContent();
    expect(totalAmount).toBe(parseInt(patchedBookingData.totalPrice));
    const email = page.locator(".space-y-4 .bg-white").nth(1);
    expect(await email.locator(".font-medium").nth(1).textContent()).toBe(patchedBookingData.customerEmail);
    await page.locator('#nav-bookings').click();
    const card1 = await login.findBookingCardByRef(patchedBookingData.bookingRef);
    await expect(card1).toBeVisible();
    await expect(card1.locator("h3")).toHaveText(patchedBookingData.event.title);
    let price1 = await card1.locator(".items-start .text-right .text-indigo-700").textContent();
    price1 = login.parseCurrency(price1);
    await expect(price).toBe(parseInt(patchedBookingData.totalPrice));
});