import { Page, Locator } from '@playwright/test';

/**
 * Page Object para as páginas de Checkout do SauceDemo
 * Cobre: checkout-step-one, checkout-step-two, checkout-complete
 */
export class CheckoutPage {
  // ===== PROPRIEDADES =====
  readonly page: Page;

  // ===== LOCATORS - STEP 1 (Your Information) =====
  readonly title: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  // ===== LOCATORS - STEP 2 (Overview) =====
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantity: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // ===== LOCATORS - COMPLETE =====
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backToProductsButton: Locator;

  // ===== CONSTRUTOR =====
  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.title = page.locator('.title');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');

    // Step 2
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.locator('[data-test="finish"]');

    // Complete
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.completeText = page.locator('[data-test="complete-text"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  // ===== MÉTODOS =====

  /**
   * Preenche os dados pessoais (Step 1)
   */
  async fillPersonalInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Continua para o próximo passo
   */
  async continue() {
    await this.continueButton.click();
  }

  /**
   * Finaliza a compra (Step 2)
   */
  async finish() {
    await this.finishButton.click();
  }

  /**
   * Volta para a página de produtos (Complete)
   */
  async backToProducts() {
    await this.backToProductsButton.click();
  }

  /**
   * Fluxo completo: preenche dados e continua
   */
  async completePersonalInfo(firstName: string, lastName: string, postalCode: string) {
    await this.fillPersonalInfo(firstName, lastName, postalCode);
    await this.continue();
  }
}