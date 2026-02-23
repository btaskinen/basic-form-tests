import { test, expect, Locator, Page } from '@playwright/test'

const firstName = 'Jane';
const lastName = 'Doe';
const email = 'jane.doe@email.com';

type FormElements = {
  firstNameInput: Locator;
  lastNameInput: Locator;
  emailInput: Locator;
  submitButton: Locator;
}

const getFormElements = async(page: Page):Promise<FormElements> => {
  const elements: FormElements = {
    firstNameInput : page.getByLabel('First Name'),
    lastNameInput : page.getByLabel('Last Name'),
    emailInput : page.getByLabel('Email'),
    submitButton : page.getByRole('button', { name: 'Submit'}),
  }

  return elements
}

test.describe('Basic Form tests', () => {
  test.beforeEach('Navigate to url', async ({ page}) => {
    await page.goto('https://formio.github.io/angular-demo/#/');
    await expect(page.getByText('Example Form')).toBeVisible();

    const { firstNameInput, lastNameInput, emailInput, submitButton } = await getFormElements(page);

    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(submitButton).toBeVisible();

  })

  test('Successful submission with all required fields filled', async({ page }) => {
    const { firstNameInput, lastNameInput, emailInput, submitButton } = await getFormElements(page);

    await firstNameInput.fill(firstName);
    await lastNameInput.fill(lastName);
    await emailInput.fill(email);
    await submitButton.click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toHaveText('Submission Complete.');
    await expect(page.locator('.help-block')).toBeVisible();
    await expect(page.locator('.help-block')).toHaveText('Submission Complete');
    await expect(firstNameInput).not.toContainClass('is-invalid');
    await expect(lastNameInput).not.toContainClass('is-invalid');
    await expect(emailInput).not.toContainClass('is-invalid');
    await expect(page.getByText(/is required/)).not.toBeVisible();
  })


  test('Submission fails when required fields are empty', async({ page }) => {
    const { firstNameInput, lastNameInput, emailInput, submitButton } = await getFormElements(page);

    await submitButton.click();

    await expect(page.getByRole('alert')).not.toBeVisible();
    await expect(page.locator('.help-block')).not.toBeVisible();
    // assumtion is that empty input fields would disply error border and error text 'X is required'
    await expect(firstNameInput).toContainClass('is-invalid');
    await expect(lastNameInput).toContainClass('is-invalid');
    await expect(emailInput).toContainClass('is-invalid');
    await expect(page.getByText(/is required/)).toHaveCount(3);
  })

  test('Invalid email address is rejected', async({ page }) => {
    const { firstNameInput, lastNameInput, emailInput, submitButton } = await getFormElements(page);

    await firstNameInput.fill(firstName);
    await lastNameInput.fill(lastName);
    await emailInput.fill('jane.doeemail.com');
    await expect(submitButton).toBeDisabled();
    await expect(emailInput).toContainClass('is-invalid');
    await expect(page.getByText('Email must be a valid email.')).toBeVisible();
  })
})