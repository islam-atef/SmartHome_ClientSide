import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivationPageComponent } from './account-activation-page-component';

describe('AccountActivationPageComponent', () => {
  let component: AccountActivationPageComponent;
  let fixture: ComponentFixture<AccountActivationPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountActivationPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountActivationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
