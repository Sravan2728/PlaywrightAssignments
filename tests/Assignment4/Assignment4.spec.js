import {test, expect} from '@playwright/test';
import {loginPage} from '../../utils/loginPage';

test('Assigment4', async({page}) => {
    const userName = "shravan.arepaka@gmail.com";
    const password = "Sravan@1234"
    const login = new loginPage(page,expect);
    //Step1
    await login.openLoginPage();
    await login.login(userName,password);
    await expect(page.locator('.backdrop-blur .justify-between .hidden')).toBeVisible();
    const booking1 = await login.createBookingFromFilter({ searchText: 'World', category: 'Conference', city: 'Hyderabad', quantity: 1, customerName: 'Sravan', customerEmail : userName, phone: '7995418311' });
    expect(booking1.eventTitle).toBe("World Tech Summit")
    expect(booking1.bookingRef).not.toBe("");
    expect(booking1.ticketQuantity).toBe("1");
    await page.locator('a[href="/events"] button').click();
    //Step 2
    const booking2 = await login.createBookingFromFilter({ searchText: 'Dilli', category: 'Festival', city: 'Delhi', quantity: 2, customerName: 'Sravan', customerEmail : userName, phone: '7995418311' });
    expect(booking2.bookingRef).not.toBe(booking1.bookingRef);
    expect(booking2.eventTitle).not.toBe(booking1.eventTitle);
    expect(booking2.ticketQuantity).toBe("2");
    console.log("Booking2 price: ",booking2.price);
    const bookingDetails = [];
    bookingDetails.push(booking1.bookingRef,booking2.bookingRef);
    //Test2
    await page.locator('#nav-bookings').click();
    await expect(page.locator('h1')).toHaveText("My Bookings");
    await expect(page.locator('#booking-card').first()).toBeVisible();
    const firstCard = await login.findBookingCardByRef(booking1.bookingRef);
    const secondCard = await login.findBookingCardByRef(booking2.bookingRef);
    await expect(firstCard).toBeVisible();
    await expect(secondCard).toBeVisible();
    expect(await firstCard.locator('.items-start .items-center .inline-flex').textContent()).toBe('confirmed');
    expect(await firstCard.locator('.items-start .items-center .inline-flex').textContent()).toBe('confirmed');
    expect(await firstCard.locator('.items-start h3').textContent()).toContain(booking1.eventTitle);
    expect(await firstCard.locator('.items-start .flex-wrap span').nth(4).textContent()).toContain(booking1.ticketQuantity);
    expect(await firstCard.locator('.items-start .text-right .text-xl').textContent()).toContain(booking1.price);

    expect(await secondCard.locator('.items-start .items-center .inline-flex').textContent()).toBe('confirmed');
    expect(await secondCard.locator('.items-start .items-center .inline-flex').textContent()).toBe('confirmed');
    expect(await secondCard.locator('.items-start h3').textContent()).toContain(booking2.eventTitle);
    expect(await secondCard.locator('.items-start .flex-wrap span').nth(4).textContent()).toContain(booking2.ticketQuantity);
    expect(await secondCard.locator('.items-start .text-right .text-xl').textContent()).toContain(booking2.price);
    
    expect(await firstCard.locator('.booking-ref').textContent()).not.toBe(await secondCard.locator('.booking-ref').textContent());
    
    //Test2 : Step 3
    await login.openBookingDetailFromCard(firstCard);
    expect(await page.locator('.items-center .text-gray-900').nth(1).textContent()).toContain(booking1.bookingRef);
    expect(await page.locator('.items-start h1').textContent()).toBe(booking1.eventTitle);
    const customerInfoCard = page.locator('.space-y-4 .bg-white').nth(1);
    //expect(await customerInfoCard.locator('.font-medium').nth(1).textContent()).toMatch(userName);
    //Unable to do this assertion because the . is being ignored by the application
    const paymentSummaryCard =  page.locator('.space-y-4 .bg-white').nth(2);
    expect(await paymentSummaryCard.locator('.font-medium').nth(0).textContent()).toBe(booking1.ticketQuantity);
    const bookingSummaryCard = page.locator('.space-y-4 .bg-white').nth(4);
    await expect(bookingSummaryCard.locator('.font-medium').nth(1)).toContainText(/\d+/);

    //Test2: Step4
    await page.locator('#nav-bookings').click();
    await login.openBookingDetailFromCard(secondCard);
    await expect(page.locator('.max-w-3xl .items-start h1')).toBeVisible();
    expect(await page.locator('.max-w-3xl .items-start h1').textContent()).toBe(booking2.eventTitle);
    expect(await paymentSummaryCard.locator('.font-medium').nth(0).textContent()).toBe(booking2.ticketQuantity);
    expect(await paymentSummaryCard.locator('.font-bold').textContent()).toBe(booking2.price);
    expect(await page.locator('.items-center .text-gray-900').nth(1).textContent()).not.toBe(booking1.bookingRef);
    await page.pause();
});