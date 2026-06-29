class loginPage{

    constructor(page){
        this.page = page;
    }

    async openLoginPage(){
        await this.page.goto('https://eventhub.rahulshettyacademy.com/login');
    }
}

module.exports = {loginPage};