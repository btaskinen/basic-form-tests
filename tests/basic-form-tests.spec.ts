import { test, expect } from '@playwright/test'

const firstName = 'Jane';
const lastName = 'Doe';
const email = 'jane.doe@email.com';

test.describe('Basic Form tests', () => {
  test.beforeEach('Navigate to url', async ({ page}) => {
    await page.goto('https://formio.github.io/angular-demo/#/');
    await expect(page.getByText('Example Form')).toBeVisible();
  })

  test('Successful submission with all required fields filled', async({ page }) => {
    const firstNameInput = page.getByLabel('First Name');
    const lastNameInput = page.getByLabel('Last Name');
    const emailInput = page.getByLabel('Email');
    const submitButton = page.getByRole('button', { name: 'Submit'});

    await expect(firstNameInput).toBeVisible();
    await firstNameInput.fill(firstName);

    await expect(lastNameInput).toBeVisible();
    await lastNameInput.fill(lastName);

    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);

    await expect(submitButton).toBeVisible();
    await submitButton.click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toHaveText('Submission Complete.');
    await expect(page.locator('.help-block')).toBeVisible();
    await expect(page.locator('.help-block')).toHaveText('Submission Complete');
  })


  test('Submission fails when required fields are empty', async({ page }) => {
    const firstNameInput = page.getByLabel('First Name');
    const lastNameInput = page.getByLabel('Last Name');
    const emailInput = page.getByLabel('Email');
    const submitButton = page.getByRole('button', { name: 'Submit'});

    await expect(firstNameInput).toBeVisible();
    await firstNameInput.clear();

    await expect(lastNameInput).toBeVisible();
    await lastNameInput.clear();

    await expect(emailInput).toBeVisible();
    await emailInput.clear();

    await expect(submitButton).toBeVisible();
    await submitButton.click();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect.soft(page.getByRole('alert')).not.toHaveText('Submission Complete.');
    await expect(page.locator('.help-block')).toBeVisible();
    await expect.soft(page.locator('.help-block')).not.toHaveText('Submission Complete');
  })
})