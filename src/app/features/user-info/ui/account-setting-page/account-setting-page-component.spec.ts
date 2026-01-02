import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingPageComponent } from './account-setting-page-component';

describe('AccountSettingPageComponent', () => {
  let component: AccountSettingPageComponent;
  let fixture: ComponentFixture<AccountSettingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSettingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountSettingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
