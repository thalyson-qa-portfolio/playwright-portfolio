import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Carrega variáveis do arquivo .env
dotenv.config();

/**
 * Configuração do Playwright
 * Documentação: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // ===== LOCALIZAÇÃO DOS TESTES =====
  testDir: './tests',

  // ===== PARALELIZAÇÃO =====
  fullyParallel: true,

  // ===== SEGURANÇA NO CI =====
  forbidOnly: !!process.env.CI,

  // ===== RETENTATIVAS =====
  retries: process.env.CI ? 2 : 0,

  // ===== WORKERS =====
  workers: process.env.CI ? 1 : undefined,

  // ===== RELATÓRIOS =====
  reporter: 'html',

  // ===== CONFIGURAÇÕES GLOBAIS =====
  use: {
    // URL base - lê do .env com fallback
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

    // Captura trace quando falha
    trace: 'retain-on-failure',

    // Screenshot quando falha
    screenshot: 'only-on-failure',

    // Vídeo quando falha
    video: 'retain-on-failure',

    // Timeout para ações (click, fill, hover)
    actionTimeout: 10000,

    // Timeout para navegação (goto, reload)
    navigationTimeout: 30000,
  },

  // ===== BROWSERS =====
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  // ===== DIRETÓRIO DE SAÍDA =====
  outputDir: 'test-results/',

  // ===== TIMEOUT GLOBAL POR TESTE =====
  timeout: 60000,

  // ===== TIMEOUT PARA ASSERTIONS =====
  expect: {
    timeout: 10000,
  },
});