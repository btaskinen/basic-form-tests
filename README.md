# Playwright Test Suite for Basic Form

The test suite tests the "Form.io Example Form" on the [Form.io Angular Demo webpage](https://formio.github.io/angular-demo/#/).

The following three test scenarios were implemented:
- Successful submission with all required fields filled
  - When the user enters a valid value into the First Name field
  - And the user enters a valid value into the Last Name field
  - And the user enters a valid email address
  - And the user submits the form
  - Then the form should be submitted successfully
  - And no validation error messages should be visible

- Submission fails when required fields are empty
  - When the user submits the form without filling any fields
  - Then validation error messages should be displayed for required fields
  - And the form should not be submitted

- Invalid email address is rejected
  - When the user enters a valid value into the First Name field
  - And the user enters a valid value into the Last Name field
  - And the user enters an invalid email address
  - And the user submits the form
  - Then a validation error message should be displayed for the Email field
  - And the form should not be submitted


### Running the tests on your local machine
1. Ensure that you have `Node` installed on your machine.
2. Clone the repository to your machine.
3. From the root folder run `npm install` to install all dependencies.
4. Run the tests either in the terminal with `npm run test` or in UI mode with `npm run test:ui`.
5. To get a test report, run `npm run test:report`, which will open the latest generated HTML report.
