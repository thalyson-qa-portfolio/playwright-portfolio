import { Page, Locator } from '@playwright/test';

/**
 * Page Object para a página de Carrinho do SauceDemo
 * URL: /cart.html
 */
export class CartPage {
  // ===== PROPRIEDADES =====
  readonly page: Page;

  // ===== LOCATORS =====
  readonly title: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartItem: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantity: Locator;
  readonly removeButton: Locator;

  // ===== CONSTRUTOR =====
  constructor(page: Page) {
    this.page = page;

    this.title = page.locator('.title');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
    this.cartItem = page.locator('.cart_item');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
    this.removeButton = page.locator('[data-test^="remove-"]'); // Começa com "remove-"
  }

  // ===== MÉTODOS =====

  /**
   * Inicia o processo de checkout
   */
  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  /**
   * Volta para continuar comprando
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}