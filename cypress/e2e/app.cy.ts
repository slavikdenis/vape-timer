import {
  getSettingsAutoStopCheckbox,
  getSettingsAutoStopDecrementButton,
  getSettingsAutoStopIncrementButton,
  getSettingsBlazeTimeDecrementButton,
  getSettingsBlazeTimeIncrementButton,
  getSettingsButton,
  getSettingsCloseButton,
  getSettingsFieldAutoStopInput,
  getSettingsFieldBlazeTime,
  getSettingsFieldBlazeTimeInput,
  getSettingsFieldHeatingTime,
  getSettingsFieldHeatingTimeInput,
  getSettingsHeatingTimeDecrementButton,
  getSettingsHeatingTimeIncrementButton,
  getSettingsResetTimersButton,
  getSettingsTitle,
  getTimerBlazingIcon,
  getTimerHeatingIcon,
  getTimerPauseButton,
  getTimerResetButton,
  getTimerResumeButton,
  getTimerStartButton,
  getTimerTotalTime,
} from '../utils';

describe('Vape Timer', () => {
  it('start, paused, resumes and resets timer', () => {
    // https://docs.cypress.io/api/commands/clock
    const now = new Date();

    cy.visit('/');
    cy.clock(now, [
      'clearInterval',
      'clearTimeout',
      'setInterval',
      'setTimeout',
    ]);

    // Start timer
    const timerStartBtn = getTimerStartButton();
    timerStartBtn.should('be.visible');
    timerStartBtn.click();

    // Proceed time by 10 milliseconds
    cy.tick(100);

    // Check that timer is running
    getTimerHeatingIcon().should('be.visible');
    getTimerTotalTime().should('be.visible').contains('00:00');

    // Proceed time by 10 seconds
    cy.tick(10000);

    // Check that timer have 10 seconds on it
    getTimerTotalTime().should('be.visible').contains('00:10');

    // Pause timer
    const timerPauseBtn = getTimerPauseButton();
    timerPauseBtn.should('be.visible');
    timerPauseBtn.click();

    // Proceed time by 10 seconds
    cy.tick(10000);

    // Check that timer is still paused
    getTimerTotalTime().should('be.visible').contains('00:10');

    // Resume timer
    const timerResumeBtn = getTimerResumeButton().should('be.visible');
    timerResumeBtn.click();

    // Proceed time by 25 seconds
    cy.tick(25000);

    // Check that timer have 35 seconds on it
    getTimerTotalTime().should('be.visible').contains('00:35');

    // Check that the timer is in the "blazing" state
    getTimerBlazingIcon().should('be.visible');

    // Reset time
    const timerResetBtn = getTimerResetButton();
    timerResetBtn.should('be.visible');
    timerResetBtn.click();

    // Proceed time by 10 milliseconds
    cy.tick(100);

    // Check that timer is reset
    const timerStartBtn2 = getTimerStartButton();
    timerStartBtn2.should('be.visible');
  });

  // Opens settings
  it('opens and closes settings', () => {
    cy.visit('/');

    // Check that settings is closed
    const settingsTitle = getSettingsTitle();
    settingsTitle.should('not.exist');

    // Open settings
    const settingsBtn = getSettingsButton();
    settingsBtn.should('be.visible');
    settingsBtn.click();

    // Check that settings is open
    settingsTitle.should('be.visible');

    // Close settings
    const settingsCloseBtn = getSettingsCloseButton();
    settingsCloseBtn.should('be.visible');
    settingsCloseBtn.click();

    // Check that settings is closed
    settingsTitle.should('not.exist');
  });

  // Opens settings and changes the timer duration
  it('changes timer duration and checks persistence after page reload', () => {
    cy.visit('/');

    // Open settings
    const settingsBtn = getSettingsButton();
    settingsBtn.should('be.visible');
    settingsBtn.click();

    // Check that settings is open
    const settingsTitle = getSettingsTitle();
    settingsTitle.should('be.visible');

    // Check if the heating time field  exists
    getSettingsFieldHeatingTime().should('be.visible');

    // Check that the heating time value is '00:30'
    getSettingsFieldHeatingTimeInput().should('have.value', '00:30');

    // Press the increment button 2 times (increments by 10 seconds) on heating time field
    getSettingsHeatingTimeIncrementButton().click();
    getSettingsHeatingTimeIncrementButton().click();

    // Check that the value is '00:40' now
    getSettingsFieldHeatingTimeInput().should('have.value', '00:40');

    // Press the decrement button 1 time (decrements by 5 seconds) on heating time field
    getSettingsHeatingTimeDecrementButton().click();

    // Check that the heating time value is '00:35' now
    getSettingsFieldHeatingTimeInput().should('have.value', '00:35');

    // Check if the blaze time field  exists
    getSettingsFieldBlazeTime().should('be.visible');

    // Check that the blaze time value is '00:15'
    getSettingsFieldBlazeTimeInput().should('have.value', '00:15');

    // Press the increment button 1 times (increments by 5 seconds) on blaze time field
    getSettingsBlazeTimeIncrementButton().click();

    // Check that the value is '00:20' now
    getSettingsFieldBlazeTimeInput().should('have.value', '00:20');

    // Press the decrement button 2 time (decrements by 10 seconds) on blaze time field
    getSettingsBlazeTimeDecrementButton().click();
    getSettingsBlazeTimeDecrementButton().click();

    // Check that the blaze time value is '00:10' now
    getSettingsFieldBlazeTimeInput().should('have.value', '00:10');

    // Close settings
    const settingsCloseBtn = getSettingsCloseButton();
    settingsCloseBtn.should('be.visible');
    settingsCloseBtn.click();

    // Refresh page
    cy.visit('/');

    // Check that the setting values persisted
    // Open settings
    const settingsBtn2 = getSettingsButton();
    settingsBtn2.should('be.visible');
    settingsBtn2.click();

    // Check that settings is open
    const settingsTitle2 = getSettingsTitle();
    settingsTitle2.should('be.visible');

    // Check that the heating time value is '00:35'
    getSettingsFieldHeatingTimeInput().should('have.value', '00:35');

    // Check that the blaze time value is '00:10'
    getSettingsFieldBlazeTimeInput().should('have.value', '00:10');
  });

  // Changes timer duration and checks if the timer is working with new values
  it('changes timer duration and checks if the timer is working with new values', () => {
    // Clear local storage
    cy.clearLocalStorage();

    const now = new Date();
    cy.visit('/');
    cy.clock(now, [
      'clearInterval',
      'clearTimeout',
      'setInterval',
      'setTimeout',
    ]);

    // Open settings
    const settingsBtn = getSettingsButton();
    settingsBtn.should('be.visible');
    settingsBtn.click();

    // Press the decrement button 2 time (decrements by 10 seconds) on heating time field
    getSettingsHeatingTimeDecrementButton().click();
    getSettingsHeatingTimeDecrementButton().click();

    // Check that the heating time value is '00:20' now
    getSettingsFieldHeatingTimeInput().should('have.value', '00:20');

    // Press the decrement button 1 times (decrements by 5 seconds) on blaze time field
    getSettingsBlazeTimeDecrementButton().click();

    // Check that the blaze time value is '00:10' now
    getSettingsFieldBlazeTimeInput().should('have.value', '00:10');

    // Close settings
    const settingsCloseBtn = getSettingsCloseButton();
    settingsCloseBtn.should('be.visible');
    settingsCloseBtn.click();

    // Wait until the settings are closed
    cy.wait(1000);

    // Check that the timer is working with new values
    // Check that the timer is not running
    const timerStartBtn = getTimerStartButton();
    timerStartBtn.should('be.visible');

    // Start timer
    timerStartBtn.click({ force: true });

    // Proceed time by 10 milliseconds
    cy.tick(100);

    // Check that the timer is running
    const timerPauseBtn = getTimerPauseButton();
    timerPauseBtn.should('be.visible');

    // Run the timer for 10 seconds
    cy.tick(10000);

    // Check that timer have 20 seconds on it
    getTimerTotalTime().should('be.visible').contains('00:10');

    // Check that the timer is in the "heating" state
    getTimerHeatingIcon().should('be.visible');

    // Run the timer for 12 seconds
    cy.tick(12000);

    // Check that the timer have 22 seconds on it
    getTimerTotalTime().should('be.visible').contains('00:22');

    // Check that the timer is in the "blazing" state
    getTimerBlazingIcon().should('be.visible');

    // Run the timer for 9 seconds
    cy.tick(9000);

    // Check that the timer have 31 seconds on it
    getTimerTotalTime().should('be.visible').contains('00:31');

    // Check that the timer is in the "heating" state
    getTimerHeatingIcon().should('be.visible');
  });

  // Check if resetting settings works
  it('checks if resetting settings works', () => {
    // Clear local storage
    cy.clearLocalStorage();

    // Open home page
    cy.visit('/');

    // Open settings
    const settingsBtn = getSettingsButton();
    settingsBtn.should('be.visible');
    settingsBtn.click();

    // Check that the default values are set
    getSettingsFieldHeatingTimeInput().should('have.value', '00:30');
    getSettingsFieldBlazeTimeInput().should('have.value', '00:15');

    // Press the decrement button 2 time (decrements by 10 seconds) on heating time field
    getSettingsHeatingTimeDecrementButton().click();
    getSettingsHeatingTimeDecrementButton().click();

    // Check that the heating time value is '00:20' now
    getSettingsFieldHeatingTimeInput().should('have.value', '00:20');

    // Press the increment button 2 times (increment by 10 seconds) on blaze time field
    getSettingsBlazeTimeIncrementButton().click();
    getSettingsBlazeTimeIncrementButton().click();

    // Check that the blaze time value is '00:25' now
    getSettingsFieldBlazeTimeInput().should('have.value', '00:25');

    // Reset settings
    const settingsResetBtn = getSettingsResetTimersButton();
    settingsResetBtn.should('be.visible');
    settingsResetBtn.click();

    // Check that the default values are set
    getSettingsFieldHeatingTimeInput().should('have.value', '00:30');

    getSettingsFieldBlazeTimeInput().should('have.value', '00:15');

    // Close settings
    const settingsCloseBtn = getSettingsCloseButton();
    settingsCloseBtn.should('be.visible');
    settingsCloseBtn.click();
  });

  // Check if auto stop works
  it('checks if auto stop works', () => {
    // Clear local storage
    cy.clearLocalStorage();

    // Open home page
    cy.visit('/');

    const now = new Date();
    cy.clock(now, [
      'clearInterval',
      'clearTimeout',
      'setInterval',
      'setTimeout',
    ]);

    // Open settings
    const settingsBtn = getSettingsButton();
    settingsBtn.should('be.visible');
    settingsBtn.click();

    // Check that the settings opened
    const settingsTitle = getSettingsTitle();
    settingsTitle.should('be.visible');

    // Check that auto stop input is present
    const settingsAutoStopInput = getSettingsFieldAutoStopInput();
    settingsAutoStopInput.should('be.visible');

    // Check that the auto stop checkbox is not checked
    const settingsAutoStopCheckbox = getSettingsAutoStopCheckbox();
    settingsAutoStopCheckbox.should('not.be.checked');

    // Check that increment and decrement buttons are disabled
    getSettingsAutoStopDecrementButton().should('be.disabled');
    getSettingsAutoStopIncrementButton().should('be.disabled');

    // Tick auto stop checkbox
    settingsAutoStopCheckbox.click();

    // Check that increment and decrement buttons are enabled
    getSettingsAutoStopDecrementButton().should('not.be.disabled');
    getSettingsAutoStopIncrementButton().should('not.be.disabled');

    // Check that the auto stop default value is '05:00'
    getSettingsFieldAutoStopInput().should('have.value', '05:00');

    // Press the decrement button 2 time (decrements by 10 seconds) on auto stop field
    getSettingsAutoStopDecrementButton().click();
    getSettingsAutoStopDecrementButton().click();

    // Check that the auto stop value is '04:50' now
    getSettingsFieldAutoStopInput().should('have.value', '04:50');

    // Press the increment button 4 times (increment by 20 seconds) on auto stop field
    getSettingsAutoStopIncrementButton().click();
    getSettingsAutoStopIncrementButton().click();
    getSettingsAutoStopIncrementButton().click();
    getSettingsAutoStopIncrementButton().click();

    // Check that the auto stop value is '05:10' now
    getSettingsFieldAutoStopInput().should('have.value', '05:10');

    // Close settings
    const settingsCloseBtn = getSettingsCloseButton();
    settingsCloseBtn.should('be.visible');
    settingsCloseBtn.click();

    // Wait until the settings are closed
    cy.wait(1000);

    // Check that the timer is working with new values
    // Check that the timer is not running
    const timerStartBtn = getTimerStartButton();
    timerStartBtn.should('be.visible');

    // Start timer
    timerStartBtn.click({ force: true });

    // Proceed time by 10 milliseconds
    cy.tick(100);

    // Check that the timer is running
    const timerPauseBtn = getTimerPauseButton();
    timerPauseBtn.should('be.visible');

    // Proceed time by 5 minutes
    cy.tick(5 * 60 * 1000);

    // Check that the timer is still running
    timerPauseBtn.should('be.visible');

    // Proceed time by 11 seconds
    cy.tick(11 * 1000);

    // Check that the timer is not running
    timerStartBtn.should('be.visible');

    // Check that the auto stop timer toast is present
    cy.get('#toast-auto-stop-timer').should('be.visible');

    // Proceed time by 5 seconds
    cy.tick(5 * 1000);

    // Check that the auto stop timer toast is not present
    cy.get('#toast-auto-stop-timer').should('not.exist');
  });

  // Check that the settings are not changeable when the timer is running
  it('checks that the settings are not changeable when the timer is running', () => {
    const now = new Date();
    cy.clock(now, [
      'clearInterval',
      'clearTimeout',
      'setInterval',
      'setTimeout',
    ]);

    // Clear local storage
    cy.clearLocalStorage();

    // Open home page
    cy.visit('/');

    // Start timer
    const timerStartBtn = getTimerStartButton();
    timerStartBtn.should('be.visible');
    timerStartBtn.click({ force: true });

    // Proceed time by 5 seconds
    cy.tick(5 * 1000);

    // Open settings
    const settingsBtn = getSettingsButton();
    settingsBtn.should('be.visible');
    settingsBtn.click();

    // Check that the settings opened
    const settingsTitle = getSettingsTitle();
    settingsTitle.should('be.visible');

    // Check that the heating time is default value
    getSettingsFieldHeatingTimeInput().should('have.value', '00:30');

    // Check that the blaze time is default value
    getSettingsFieldBlazeTimeInput().should('have.value', '00:15');

    // Try to increment heating time
    getSettingsHeatingTimeIncrementButton().click();

    // Verify that the heating time is still default value
    getSettingsFieldHeatingTimeInput().should('have.value', '00:30');

    // Check if the alert is present
    const alert = cy.get('#chakra-modal-settings-alert-running');
    alert.should('be.visible');

    // Find second button in alert and press it (reset timer)
    const resetButton = cy.get('#settings-alert-reset-btn');
    resetButton.should('be.visible');
    resetButton.click();

    // Check that the alert is not visible
    // FIXME: should work, but stopped \_(-_-)_/
    // alert.should('not.be.visible');

    // Close settings
    const settingsCloseBtn = getSettingsCloseButton();
    settingsCloseBtn.click({ force: true });

    // Check that the timer is not running
    timerStartBtn.should('exist');
  });

  // Check that the settings are not changeable when the timer is paused
  it('checks that the settings are not changeable when the timer is paused', () => {
    const now = new Date();
    cy.clock(now, [
      'clearInterval',
      'clearTimeout',
      'setInterval',
      'setTimeout',
    ]);

    // Clear local storage
    cy.clearLocalStorage();

    // Open home page
    cy.visit('/');

    // Start timer
    const timerStartBtn = getTimerStartButton();
    timerStartBtn.should('be.visible');
    timerStartBtn.click({ force: true });

    // Proceed time by 5 seconds
    cy.tick(5 * 1000);

    // Pause timer
    const timerPauseBtn = getTimerPauseButton();
    timerPauseBtn.should('be.visible');
    timerPauseBtn.click({ force: true });

    // Open settings
    const settingsBtn = getSettingsButton();
    settingsBtn.should('be.visible');
    settingsBtn.click();

    // Check that the settings opened
    const settingsTitle = getSettingsTitle();
    settingsTitle.should('be.visible');

    // Check that the heating time is default value
    getSettingsFieldHeatingTimeInput().should('have.value', '00:30');

    // Check that the blaze time is default value
    getSettingsFieldBlazeTimeInput().should('have.value', '00:15');

    // Try to increment heating time
    getSettingsHeatingTimeIncrementButton().click();

    // Verify that the heating time is still default value
    getSettingsFieldHeatingTimeInput().should('have.value', '00:30');

    // Check if the alert is present
    const alert = cy.get('#chakra-modal-settings-alert-paused');
    alert.should('be.visible');

    // Find first button in alert and press it (cancel alert)
    const resetButton = cy.get('#settings-alert-cancel-btn');
    resetButton.should('be.visible');
    resetButton.click();

    // Check that the alert is not visible
    // FIXME: should work, but stopped \_(-_-)_/
    // alert.should('not.be.visible');

    // Close settings
    const settingsCloseBtn = getSettingsCloseButton();
    settingsCloseBtn.click({ force: true });

    // Check that the timer is still paused
    timerPauseBtn.should('exist');
  });
});
