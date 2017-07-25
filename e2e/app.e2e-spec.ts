import { BillingUiPage } from './app.po';

describe('billing-ui App', () => {
  let page: BillingUiPage;

  beforeEach(() => {
    page = new BillingUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
