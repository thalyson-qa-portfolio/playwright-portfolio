import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('Login', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
  });

  test('deve fazer login com credenciais válidas @smoke', async ({ page }) => {
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await loginPage.login('usuario_invalido', 'senha_errada');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match'
    );
  });

  test('deve exibir erro quando username está vazio', async ({ page }) => {
    await loginPage.login('', 'secret_sauce');

    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test('deve fazer logout com sucesso', async ({ page }) => { 
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL('/inventory.html');
    
    await inventoryPage.logout();

    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

});

test.describe('Carrinho de compras', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('deve adicionar produto ao carrinho @smoke', async ({page}) =>{
    await inventoryPage.addBackpack();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1')

    await inventoryPage.goToCart();
    await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
  });

  test('deve remover produto do carrinho', async ({page}) =>{
    await inventoryPage.addBackpack();
    await inventoryPage.removeBackpack();
    
    await inventoryPage.goToCart();
    await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

});

test.describe('Produtos', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('deve ordenar produtos por preço (menor para maior)', async () =>{
    await inventoryPage.sortBy('lohi');

    await expect(inventoryPage.getFirstProductPrice()).toHaveText('$7.99');
    await expect(inventoryPage.getFirstProductName()).toHaveText('Sauce Labs Onesie');
  });

  test('deve ordenar produtos por preço (maior para menor)', async () =>{
    await inventoryPage.sortBy('hilo');

    await expect(inventoryPage.getFirstProductPrice()).toHaveText('$49.99');
    await expect(inventoryPage.getFirstProductName()).toHaveText('Sauce Labs Fleece Jacket');
  });

  test('deve ordenar produtos por nome (A ao Z)', async () =>{
    await inventoryPage.sortBy('az');

    await expect(inventoryPage.getFirstProductName()).toHaveText('Sauce Labs Backpack');
    await expect(inventoryPage.getLastProductName()).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('deve ordenar produtos por nome (Z ao A)', async () =>{
    await inventoryPage.sortBy('za');

    await expect(inventoryPage.getFirstProductName()).toHaveText('Test.allTheThings() T-Shirt (Red)');
    await expect(inventoryPage.getLastProductName()).toHaveText('Sauce Labs Backpack');
  });
});

test.describe('Checkout',() => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test('deve completar uma compra com sucesso @smoke', async ({page}) =>{
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await test.step('Fazer login', async() => {
      await loginPage.goto();
      await loginPage.login('standard_user', 'secret_sauce');

      await expect(page).toHaveURL('/inventory.html');
      await expect(page.locator('.title')).toHaveText('Products');
    });

    await test.step('Adicionar produto ao carrinho', async() => {
      await inventoryPage.addBackpack();
      await expect(inventoryPage.shoppingCartBadge).toHaveText('1');
    });

    await test.step('Ir para o carrinho', async() => {
      await page.locator('[data-test="shopping-cart-link"]').click();
      await expect(page).toHaveURL('/cart.html');
      await expect(page.locator('.title')).toHaveText('Your Cart');
      await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
    });

    await test.step('Iniciar checkout', async() => {
      await page.locator('[data-test="checkout"]').click();
      await expect(page).toHaveURL('/checkout-step-one.html');
      await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
    });

    await test.step('Preencher dados de envio', async() => {
      await page.locator('[data-test="firstName"]').fill('Thalyson');
      await page.locator('[data-test="lastName"]').fill('Santos');
      await page.locator('[data-test="postalCode"]').fill('35700-000');
      await page.locator('[data-test="continue"]').click();
      await expect(page).toHaveURL('/checkout-step-two.html');
      await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    });

    await test.step('Verificar resumo e finalizar compra', async() => {
      await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
      await expect(page.locator('[data-test="item-quantity"]')).toHaveText('1');
      await expect(page.locator('[data-test="inventory-item-price"]')).toHaveText('$29.99');
      await expect(page.locator('[data-test="total-label"]')).toBeVisible();

      await page.locator('[data-test="finish"]').click();
      await expect(page).toHaveURL('/checkout-complete.html');
    });

    await test.step('Confirmar sucesso da compra', async() => {
      await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
      await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
      await expect(page.locator('[data-test="back-to-products"]')).toBeVisible();

      await page.locator('[data-test="back-to-products"]').click();
      await expect(page).toHaveURL('/inventory.html');
    });

    await test.step('Fazer logout', async() => {
      await page.getByRole('button', { name: 'Open Menu'}).click();
      await page.getByRole('link', { name: 'Logout'}).click();

      await expect(page).toHaveURL('/');
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});