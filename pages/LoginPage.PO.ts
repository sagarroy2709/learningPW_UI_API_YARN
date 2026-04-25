import { Page, Locator, expect } from "@playwright/test"

export class LoginPage {

    private readonly page: Page;
    private readonly usernameInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly lockedOutLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = page.getByRole('textbox', { name: 'Username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.locator('[data-test="login-button"]');
        this.lockedOutLabel = page.getByRole('heading', { name: /Epic sadface: Sorry, this user has been locked out\./i });
    }

    async goto(baseURL: string) {
        await this.page.goto(baseURL);
    }

    private async fillUsername(username: string) {
        await this.usernameInput.fill(username);
    }

    private async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    private async submit() {
        await this.signInButton.click();
    }

    async loginAs(username: string, password: string) {
        await this.fillUsername(username);
        await this.fillPassword(password);
        await this.submit();
    }

    async verifyLockedoutMessageForLockedOutUser(){
        await expect(this.lockedOutLabel).toBeVisible();
    }

}



