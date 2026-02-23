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

  await expect(elements.firstNameInput).toBeVisible();
  await expect(elements.lastNameInput).toBeVisible();
  await expect(elements.emailInput).toBeVisible();
  await expect(elements.submitButton).toBeVisible();

  return elements

}

test.describe('Basic Form tests', () => {
  test.beforeEach('Navigate to url', async ({ page}) => {
    await page.goto('https://formio.github.io/angular-demo/#/');
    await expect(page.getByText('Example Form')).toBeVisible();
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
  })


  test('Submission fails when required fields are empty', async({ page }) => {
    const { firstNameInput, lastNameInput, emailInput, submitButton } = await getFormElements(page);

    await firstNameInput.clear();
    await lastNameInput.clear();
    await emailInput.clear();
    await submitButton.click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect.soft(page.getByRole('alert')).not.toHaveText('Submission Complete.');
    await expect(page.locator('.help-block')).toBeVisible();
    await expect.soft(page.locator('.help-block')).not.toHaveText('Submission Complete');
  })

  test('Invalid email address is rejected', async({ page }) => {
    const { firstNameInput, lastNameInput, emailInput, submitButton } = await getFormElements(page);

    await firstNameInput.fill(firstName);
    await lastNameInput.fill(lastName);
    await emailInput.fill('jane.doeemail.com');
    await expect(submitButton).toBeDisabled();
    await expect(emailInput).toHaveClass('form-control is-invalid');
    await expect(page.getByText('Email must be a valid email.')).toBeVisible();
  })
})