import {Page, Locator} from "@playwright/test"
import {expect} from "../fixtures/index.fixture"
import { ENV } from "../config/env.config";
import { BasePage } from "./BasePage";

export class InventoryPage extends BasePage {

    protected readonly path = '/inventory.html';
    
    constructor(page:Page){
        super(page);
    }

    async assertInventoryPageLoaded(){
        await expect(this.page).toHaveURL(/.*inventory/); //Passes
        // await expect(this.page).not.toHaveURL(/.*inventory/); //Fails
    }

}