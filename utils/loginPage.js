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

    async findBookingCardByRef(bookingRef) {
        const cards = this.page.locator('#booking-card');
        console.log("Cards count: ", await cards.count());
        for (let i = 0; i < await cards.count(); i++) {
            const card = cards.nth(i);
            const refCode = await card.locator('.booking-ref').textContent();
            console.log("ReferCode inside function: ", refCode);
            console.log("ReferCode passed to a helper: ", bookingRef)
            if (refCode === bookingRef) {
                return card;
                break;
            }
        }
    }

    async openBookingDetailFromCard(card) {
        await card.locator('a').click();
    }

    buildMockEvents() {
        return [
            {

                id: 4,
                title: "Delhi Event",
                description: "Celebrate the Festival of Lights at the grandest Diwali Mela in North India. Enjoy 200+ stalls of artisanal crafts, street food, folk performances, fireworks, and cultural showcases spanning three vibrant evenings.",
                category: "Festival",
                venue: "Pragati Maidan Exhibition Grounds",
                city: "Delhi",
                eventDate: "2026-10-20T17:00:00.000Z",
                price: "300",
                totalSeats: 1000,
                availableSeats: 8,
                imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
                isStatic: true,
                userId: null,
                createdAt: "2026-02-22T23:03:37.680Z",
                updatedAt: "2026-05-29T05:44:25.067Z"

            },
            {

                id: 5,
                title: "Hyderabad Event",
                description: "A premier technology conference bringing together 500+ industry leaders, startup founders, and engineers for two days of keynotes, workshops, and networking. Topics include AI/ML, cloud infrastructure, DevSecOps, and the future of the Indian tech ecosystem.",
                category: "Conference",
                venue: "Hyderabad, Hitech city",
                city: "Hyderabad",
                eventDate: "2026-04-18T09:00:00.000Z",
                price: "700",
                totalSeats: 2000,
                availableSeats: 8,
                imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                isStatic: true,
                userId: null,
                createdAt: "2026-02-22T23:03:37.659Z",
                updatedAt: "2026-05-23T06:57:02.677Z"
            },
            {
                id: 6,
                title: "Mumbai Event",
                description: "A premier technology conference bringing together 500+ industry leaders, startup founders, and engineers for two days of keynotes, workshops, and networking. Topics include AI/ML, cloud infrastructure, DevSecOps, and the future of the Indian tech ecosystem.",
                category: "Concert",
                venue: "Mumbai, Mumbai city",
                city: "Mumbai",
                eventDate: "2026-04-19T09:00:00.000Z",
                price: "700",
                totalSeats: 3000,
                availableSeats: 10,
                imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
                isStatic: true,
                userId: null,
                createdAt: "2026-02-22T23:03:37.659Z",
                updatedAt: "2026-05-23T06:57:02.677Z"
            },
            {
                id: 7,
                title: "Bangalore Event",
                description: "A premier technology conference bringing together 500+ industry leaders, startup founders, and engineers for two days of keynotes, workshops, and networking. Topics include AI/ML, cloud infrastructure, DevSecOps, and the future of the Indian tech ecosystem.",
                category: "Workshop",
                venue: "Bangalore, Bangalore city",
                city: "Mumbai",
                eventDate: "2026-04-19T09:00:00.000Z",
                price: "700",
                totalSeats: 4000,
                availableSeats: 20,
                imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800",
                isStatic: true,
                userId: null,
                createdAt: "2026-02-22T23:03:37.659Z",
                updatedAt: "2026-05-23T06:57:02.677Z"
            }
        ]
    }

    async installMockEventRoutes(page, mockEvents) {

        // Catalog API
        await page.route("**/api/events?**", async (route) => {

            const url = new URL(route.request().url());

            const search = url.searchParams.get("search");
            const category = url.searchParams.get("category");
            const city = url.searchParams.get("city");

            let filteredEvents = [...mockEvents];

            if (search) {
                filteredEvents = filteredEvents.filter(event =>
                    event.title.toLowerCase().includes(search.toLowerCase()) ||
                    event.city.toLowerCase().includes(search.toLowerCase())
                );
            }

            if (category) {
                filteredEvents = filteredEvents.filter(event =>
                    event.category === category
                );
            }

            if (city) {
                filteredEvents = filteredEvents.filter(event =>
                    event.city === city
                );
            }
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    data: filteredEvents,
                    pagination: {
                        total: filteredEvents.length,
                        page: 1,
                        limit: 12,
                        totalPages: 1
                    }
                })
            });
        });

        // Event Details API
        await page.route("**/api/events/*", async (route) => {

            const eventId = Number(route.request().url().split("/").pop());

            const matchedEvent = mockEvents.find(event => event.id === eventId);

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    data: matchedEvent
                })
            });
        });
    }

    parseCurrency(text) {
        return Number(text.replace(/[$,]/g, ""));
    }

}

module.exports = { loginPage };