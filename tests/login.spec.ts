import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve fazer login com credenciais válidas @smoke', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.pause ();
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('/inventory.html');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('usuario_invalido');
    await page.locator('[data-test="password"]').fill('senha_errada');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]')).toContainText(
      'Username and password do not match'
    );
  });

  test('deve exibir erro quando username está vazio', async ({ page }) => {
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('deve fazer logout com sucesso', async ({ page }) => {
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await expect(page).toHaveURL('/inventory.html');
    
    await page.getByRole('button', { name: 'Open Menu'}).click();
    await page.getByRole('link', { name: 'Logout'}).click();

    await expect(page).toHaveURL('/');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });

});

test.describe('Carrinho de compras', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();    
  });

  test('deve adicionar produto ao carrinho @smoke', async ({page}) =>{
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.locator('[data-test="inventory-item-name"]')).toContainText('Sauce Labs Backpack');
  });

  test('deve remover produto do carrinho', async ({page}) =>{
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page.getByText('Sauce Labs Backpack')).not.toBeVisible();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

});

test.describe('Produtos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();    
  });

  test('deve ordenar produtos por preço (menor para maior)', async ({page}) =>{
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const firstProductPrice = page.locator('[data-test="inventory-item-price"]').first()
    await expect(firstProductPrice).toHaveText('$7.99');

    const firstProductName = page.locator('[data-test="inventory-item-name"]').first()
    await expect(firstProductName).toHaveText('Sauce Labs Onesie');
  });

  test('deve ordenar produtos por preço (maior para menor)', async ({page}) =>{
    await page.locator('[data-test="product-sort-container"]').selectOption('hilo');

    const firstProductPrice = page.locator('[data-test="inventory-item-price"]').first()
    await expect(firstProductPrice).toHaveText('$49.99');

    const firstProductName = page.locator('[data-test="inventory-item-name"]').first()
    await expect(firstProductName).toHaveText('Sauce Labs Fleece Jacket');
  });

  test('deve ordenar produtos por nome (A ao Z)', async ({page}) =>{
    await page.locator('[data-test="product-sort-container"]').selectOption('az');

    const firstProductName = page.locator('[data-test="inventory-item-name"]').first()
    await expect(firstProductName).toHaveText('Sauce Labs Backpack');

    const lastProductName = page.locator('[data-test="inventory-item-name"]').last()
    await expect(lastProductName).toHaveText('Test.allTheThings() T-Shirt (Red)');
  });

  test('deve ordenar produtos por nome (Z ao A)', async ({page}) =>{
    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    const lastProductName = page.locator('[data-test="inventory-item-name"]').first()
    await expect(lastProductName).toHaveText('Test.allTheThings() T-Shirt (Red)');
    
    const firstProductName = page.locator('[data-test="inventory-item-name"]').last()
    await expect(firstProductName).toHaveText('Sauce Labs Backpack');    
  });
});

test.describe('Checkout',() => {

  test('deve completar uma compra com sucesso @smoke', async ({page}) =>{

    await test.step('Fazer login', async() => {
      await page.goto('/');
      await page.locator('[data-test="username"]').fill('standard_user');
      await page.locator('[data-test="password"]').fill('secret_sauce');
      await page.locator('[data-test="login-button"]').click(); 

      await expect(page).toHaveURL('/inventory.html');
      await expect(page.locator('.title')).toHaveText('Products');
    });

    await test.step('Adicionar produto ao carrinho', async() => {
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1')
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
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });
  });
});