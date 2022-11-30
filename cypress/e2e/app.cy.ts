describe('app', () => {
  it('works', () => {
    const now = new Date();

    cy.visit('/');
    cy.clock(now, ['clearInterval', 'clearTimeout', 'setInterval', 'setTimeout']);

    const timerStartBtn = cy.get('[data-testid=timer-start-button');

    timerStartBtn.should('be.visible');
    timerStartBtn.click();

    cy.tick(100);

    cy.get('[data-testid=heating-icon]').should('be.visible');
    cy.get('[data-testid=total-timer]').should('be.visible').contains('00:00');

    cy.tick(10000);

    cy.get('[data-testid=total-timer]').should('be.visible').contains('00:10');

    const timerPauseBtn = cy.get('[data-testid=timer-pause-button]');
    timerPauseBtn.should('be.visible');
    timerPauseBtn.click();

    cy.tick(10000);
    cy.get('[data-testid=total-timer]').should('be.visible').contains('00:10');

    const timerResumeBtn = cy
      .get('[data-testid=timer-resume-button]')
      .should('be.visible');
    timerResumeBtn.click();

    cy.tick(25000);
    cy.get('[data-testid=total-timer]').should('be.visible').contains('00:35');

    cy.get('[data-testid=blazing-icon]').should('be.visible');

    const timerResetBtn = cy.get('[data-testid=timer-reset-button]');
    timerResetBtn.should('be.visible');
    timerResetBtn.click();

    cy.tick(100);

    const timerStartBtn2 = cy.get('[data-testid=timer-start-button');
    timerStartBtn2.should('be.visible');
  });
});
