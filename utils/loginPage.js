class loginPage {

    constructor(page, expect) {
        this.page = page;
        this.expect = expect;
    }

    async openLoginPage() {
        await this.page.goto('/login');
    }

    async getEmailField() {
        return this.page.getByPlaceholder('you@email.com');
    }

    async login(userName, password) {
        await this.page.getByPlaceholder('you@email.com').fill(userName);
        await this.page.getByLabel('Password').fill(password);
        await this.page.getByRole('button', { name: 'Sign In' }).click();
        await this.page.getByRole('link', { name: /browse events/i }).first().click();
    }

    async getEventCards() {
        const eventCard = this.page.locator(".grid .bg-white h3");
        return eventCard;
    }

    async parseSeatCount(seatValue) {
        const seatCount = seatValue.split(" ");
        return seatCount[0];
    }

    async createBookingFromFilter(bookingData) {
        await this.page.getByPlaceholder('Search events, venues…').pressSequentially(bookingData.searchText);
        const categorydropDown = this.page.locator('select.w-full').first();
        await categorydropDown.selectOption(bookingData.category);
        const cityDropdown = this.page.locator('select.w-full').last();
        await cityDropdown.selectOption(bookingData.city);
        // const eventCard = this.page.locator('.grid .bg-white');
        // await eventCard.locator(`h3:has-text('${bookingData.searchText}')`).waitFor({state:'visible'});
        const eventCard = this.page.locator('#event-card h3');
        await this.expect(eventCard).toHaveCount(1);
        const eventTitle = await eventCard.textContent();
        console.log("EventTitle: ", eventTitle);
        await this.expect(this.page.locator('#book-now-btn')).toBeEnabled();
        await this.page.locator('#book-now-btn').click();
        // await this.page.getByRole("button",{name: "Book Now"}).click();
        //await this.page.locator('#customerName').waitFor({ state: 'visible' });
        await this.page.locator('#customerName').fill(bookingData.customerName);
        await this.page.locator('#customer-email').fill(bookingData.customerEmail);
        await this.page.locator('#phone').fill(bookingData.phone);
        const ticketCount = this.page.locator('#ticket-count');
        if (parseInt(await ticketCount.textContent()) != bookingData.quantity) {
            for (let i = 1; i <= bookingData.quantity; i++) {
                await this.page.locator("button[type='button']").last().click();
                if (parseInt(await ticketCount.textContent()) === bookingData.quantity) {
                    break;
                }
            }
        }
        await this.page.locator('button[type="submit"]').click();
        const bookingRef = await this.page.locator('.border-indigo-100 .booking-ref').textContent();
        const ticketQuantity = await this.page.locator('.border-indigo-100 .flex .text-gray-900').nth(2).textContent();
        const price = await this.page.locator('.border-indigo-100 .flex .text-gray-900').nth(3).textContent();
        return {
            eventTitle: eventTitle,
            bookingRef: bookingRef,
            ticketQuantity: ticketQuantity,
            price: price
        };
    }

    async findBookingCardByRef(bookingRef){
        const cards = this.page.locator('#booking-card');
        console.log("Cards count: ",await cards.count());
        for(let i=0;i< await cards.count();i++){
            const card = cards.nth(i);
            const refCode = await card.locator('.booking-ref').textContent();
            console.log("ReferCode inside function: ",refCode);
            console.log("ReferCode passed to a helper: ",bookingRef)
            if(refCode === bookingRef){
                return card;
                break;
            }
        }
    }

    async openBookingDetailFromCard(card){
        await card.locator('a').click();
    }

}

module.exports = { loginPage };