import {Page, Locator} from "@playwright/test"
import {expect} from "../fixtures/index.fixture"
import { ENV } from "../config/env.config";

export class InventoryPage{

    private readonly page: Page;

    constructor(page:Page){
        this.page = page;
    }

    async goto() {
        await this.page.goto(ENV.BASE_URL + '/inventory.html');
    }
    async assertInventoryPageLoaded(){
        await expect(this.page).toHaveURL(/.*inventory/);
    }

}