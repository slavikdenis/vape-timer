/**
 * CONTROLS
 */
export const getTimerStartButton = () =>
  cy.get('[data-testid=timer-start-button]');

export const getTimerPauseButton = () =>
  cy.get('[data-testid=timer-pause-button]');

export const getTimerResumeButton = () =>
  cy.get('[data-testid=timer-resume-button]');

export const getTimerResetButton = () =>
  cy.get('[data-testid=timer-reset-button]');

/**
 * TIMERS
 */
export const getTimerTotalTime = () => cy.get('[data-testid=total-timer]');

/**
 * TIMER ICONS
 */
export const getTimerBlazingIcon = () => cy.get('[data-testid=blazing-icon]');

export const getTimerHeatingIcon = () => cy.get('[data-testid=heating-icon]');

/**
 * SETTINGS BUTTON
 */

export const getSettingsButton = () => cy.get('[data-testid=settings-button]');

/**
 * SETTINGS
 */

// Title
export const getSettingsTitle = () => cy.get('[data-testid=settings-title]');

// Close button
export const getSettingsCloseButton = () =>
  cy.get('[data-testid=settings-close-button]');

// Reset timers button
export const getSettingsResetTimersButton = () =>
  cy.get('[data-testid=reset-timers]');

/**
 * SETTINGS - Heating time
 */
export const getSettingsFieldHeatingTime = () =>
  cy.get('[data-testid=settings-field-heatingTime]');

export const getSettingsFieldHeatingTimeInput = () =>
  cy.get('[data-testid=settings-input-heatingTime]');

export const getSettingsHeatingTimeIncrementButton = () =>
  cy.get('[data-testid=settings-increment-button-heatingTime]');

export const getSettingsHeatingTimeDecrementButton = () =>
  cy.get('[data-testid=settings-decrement-button-heatingTime]');

/**
 * SETTINGS - Blaze time
 */
export const getSettingsFieldBlazeTimeInput = () =>
  cy.get('[data-testid=settings-input-blazeTime]');

export const getSettingsFieldBlazeTime = () =>
  cy.get('[data-testid=settings-field-blazeTime]');

export const getSettingsBlazeTimeIncrementButton = () =>
  cy.get('[data-testid=settings-increment-button-blazeTime]');

export const getSettingsBlazeTimeDecrementButton = () =>
  cy.get('[data-testid=settings-decrement-button-blazeTime]');

/**
 * SETTINGS - Auto stop
 */
export const getSettingsAutoStopCheckbox = () =>
  cy.get('[data-testid=auto-stop-timer-checkbox]');

export const getSettingsFieldAutoStopInput = () =>
  cy.get('[data-testid=settings-input-autoStopTime]');

export const getSettingsAutoStopIncrementButton = () =>
  cy.get('[data-testid=settings-increment-button-autoStopTime]');

export const getSettingsAutoStopDecrementButton = () =>
  cy.get('[data-testid=settings-decrement-button-autoStopTime]');
