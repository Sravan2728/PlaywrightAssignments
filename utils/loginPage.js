class loginPage{

    constructor(page,expect){
        this.page = page;
        this.expect = expect;
    }

    async openLoginPage(){
        await this.page.goto('/login');
    }

    async getEmailField(){
        return this.page.getByPlaceholder('you@email.com');
    }

    async login(userName,password){
        await this.page.getByPlaceholder('you@email.com').fill(userName);
        await this.page.getByLabel('Password').fill(password);
        await this.page.getByRole('button', {name: 'Sign In'}).click();
        await this.page.getByRole('link', { name: /browse events/i }).first().click();
    }

    async getEventCards(){
        const eventCard = this.page.locator(".grid .bg-white h3");
        return eventCard;
    }

    async parseSeatCount(seatValue){
        const seatCount = seatValue.split(" ");
        return seatCount[0];
    }
}

module.exports = {loginPage};