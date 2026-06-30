class loginPage{

    constructor(page){
        this.page = page;
    }

    async openLoginPage(){
        await this.page.goto('/login');
    }

    async getEmailField(){
        return this.page.getByPlaceholder('you@email.com');
    }
}

module.exports = {loginPage};