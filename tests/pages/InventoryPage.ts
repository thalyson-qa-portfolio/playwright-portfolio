import { Page, Locator } from '@playwright/test';

/**
 * Page Object para a página de Inventário/Produtos do SauceDemo
 * Esta página aparece após o login e lista todos os produtos
 */
export class InventoryPage {
  // ===== PROPRIEDADES =====
  readonly page: Page;

  // ===== LOCATORS - HEADER =====
  readonly title: Locator;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  // ===== LOCATORS - PRODUTOS =====
  readonly productSortContainer: Locator;
  readonly inventoryItemName: Locator;
  readonly inventoryItemPrice: Locator;

  // ===== LOCATORS - PRODUTO ESPECÍFICO (Backpack) =====
  readonly addBackpackToCart: Locator;
  readonly removeBackpackFromCart: Locator;

  // ===== CONSTRUTOR =====
  constructor(page: Page) {
    this.page = page;

    // Header
    this.title = page.locator('.title');
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.logoutLink = page.getByRole('link', { name: 'Logout' });

    // Produtos
    this.productSortContainer = page.locator('[data-test="product-sort-container"]');
    this.inventoryItemName = page.locator('[data-test="inventory-item-name"]');
    this.inventoryItemPrice = page.locator('[data-test="inventory-item-price"]');

    // Produto específico (Backpack)
    this.addBackpackToCart = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    this.removeBackpackFromCart = page.locator('[data-test="remove-sauce-labs-backpack"]');
  }

  // ===== MÉTODOS =====

  /**
   * Adiciona o Backpack ao carrinho
   */
  async addBackpack() {
    await this.addBackpackToCart.click();
  }

  /**
   * Remove o Backpack do carrinho
   */
  async removeBackpack() {
    await this.removeBackpackFromCart.click();
  }

  /**
   * Vai para o carrinho
   */
  async goToCart() {
    await this.shoppingCartLink.click();
  }

  /**
   * Ordena produtos
   * @param option - 'az' | 'za' | 'lohi' | 'hilo'
   */
  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.productSortContainer.selectOption(option);
  }

  /**
   * Faz logout
   */
  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  /**
   * Retorna o primeiro nome de produto
   */
  getFirstProductName() {
    return this.inventoryItemName.first();
  }

  /**
   * Retorna o último nome de produto
   */
  getLastProductName() {
    return this.inventoryItemName.last();
  }

  /**
   * Retorna o primeiro preço de produto
   */
  getFirstProductPrice() {
    return this.inventoryItemPrice.first();
  }
}