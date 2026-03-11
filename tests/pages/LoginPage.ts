import { Page, Locator } from '@playwright/test';

/**
 * Page Object para a página de Login do SauceDemo
 * Encapsula todos os elementos e ações relacionadas ao login
 */
export class LoginPage {
  // ===== PROPRIEDADES =====
  readonly page: Page;
  
  // ===== LOCATORS =====
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  // ===== CONSTRUTOR =====
  constructor(page: Page) {
    this.page = page;
    
    // Inicializa os locators
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // ===== MÉTODOS =====
  
  /**
   * Navega para a página de login
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Preenche o campo de username
   */
  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  /**
   * Preenche o campo de password
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Clica no botão de login
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Executa o fluxo completo de login
   * @param username - Nome do usuário
   * @param password - Senha do usuário
   */
  async login(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }
}