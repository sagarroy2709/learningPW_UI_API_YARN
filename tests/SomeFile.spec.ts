import {test, expect} from "../fixtures/index.fixture"
import { InventoryPage } from "../pages/InventoryPage.PO";
import { ENV } from "../config/env.config";
import { LoginPage } from "../pages/loginPage.PO";

test('Inventory Loads', async ({ standardUserPage }) => {

    const inventoryPage = new InventoryPage(standardUserPage);
    await inventoryPage.goto(); // ← test decides destination
    await inventoryPage.assertInventoryPageLoaded();  
});

test('Locked out user', async ({ lockedOutUserPage }) => {

    const loginPage = new LoginPage(lockedOutUserPage);
    await loginPage.verifyLockedoutMessageForLockedOutUser();
});