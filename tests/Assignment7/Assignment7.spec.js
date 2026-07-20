import { test, expect } from "@playwright/test";
import { loginPage } from "../../utils/loginPage";
import { url } from "inspector";

test('Assignment6', async({page, playwright}) => {
    const userName = "shravan.arepaka@gmail.com"; 
    const password = "Sravan@1234"; 
    const login = new loginPage(page, expect);
    const details = await login.createAuthorizedApiContext(playwright,userName,password);
   console.log("Token: ", details.token);
   const getEventDetails = await login.selectBookableEvent(details,2);
   const eventID = getEventDetails.id;
   const eventTitle = getEventDetails.title;
   const eventcategory = getEventDetails.category;
   const eventCity = getEventDetails.city;
   const eventPrice = getEventDetails.price;

   const bookingPayload = {customerName: "Sravan", customerEmail: "shravan.arepaka@gmail.com", customerPhone: '7995418311', quantity: 2, eventId: eventID};

   const bookingDataResp = await login.createBooking(details,bookingPayload);
   console.log('Quantity: ',bookingDataResp.data.quantity,"Price: ",bookingDataResp.data.totalPrice);
   await login.injectTokenBeforeNavigation(page,details.token);
   await page.goto('/bookings');
   await expect(page.locator('h1')).toHaveText("My Bookings");
   await expect(page.locator('#booking-card').first()).toBeVisible();
   const firstCard = await login.findBookingCardByRef(bookingDataResp.data.bookingRef);
   expect(await firstCard.locator('.items-start h3').textContent()).toContain(eventTitle);
   let ticketQuantity = bookingDataResp.data.quantity;
   let formatedticketQuantity = ticketQuantity.toString();
   console.log("Ticket quantity: ",formatedticketQuantity);
   console.log("TypeOf ticket quantity: ",typeof(formatedticketQuantity));
   expect(await firstCard.locator('.items-start .flex-wrap span').nth(4).textContent()).toContain(formatedticketQuantity);
   let ticketPrice = (parseInt(eventPrice) * ticketQuantity);
   expect(await firstCard.locator('.items-start .text-right .text-xl').textContent()).toContain(ticketPrice.toString());

   //Test2
   await firstCard.getByRole("button", { name: "View Details" }).click();
   await expect(page.locator(".items-center .font-mono").first()).toHaveText(bookingDataResp.data.bookingRef);
   //await expect(page.url()).toContain(`/bookings/${bookingDataResp.data.id}`);
   await expect(page.locator("h1")).toHaveText(bookingDataResp.data.event.title);
   const category = await page.locator(".space-y-4 .bg-white").nth(0);
   await expect(category.locator('.font-medium').nth(1)).toHaveText(bookingDataResp.data.event.category);
   await expect(category.locator('.font-medium').nth(4)).toHaveText(bookingDataResp.data.event.city);
   await expect(page.url()).toContain(`/bookings/${bookingDataResp.data.id}`);
   const paymentSummary = page.locator(".space-y-4 .bg-white").nth(2);
   await expect(paymentSummary.locator('.font-medium').nth(0)).toHaveText(formatedticketQuantity);
   await expect(page.locator('.justify-between .text-indigo-700')).toContainText(ticketPrice.toString());
   const customerInfo = page.locator(".space-y-4 .bg-white").nth(1);
   await expect(customerInfo.locator('.font-medium').nth(1)).toHaveText(bookingDataResp.data.customerEmail);
   const deleteResp = await login.deleteBooking(details,bookingDataResp.data.id);
   console.log('Delete Resp: ',deleteResp.message);
   expect(deleteResp.message).toBe('Booking cancelled');
   await page.locator("a[href='/bookings']").last().click();
   await page.locator('#nav-bookings').click();
   const card = await login.findBookingCardByRef(bookingDataResp.data.bookingRef);
   await expect(card).toBeNull();
   await login.dispose(details);
});