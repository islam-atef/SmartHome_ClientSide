import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewHomeComponent } from './create-new-home-component';

describe('CreateNewHomeComponent', () => {
  let component: CreateNewHomeComponent;
  let fixture: ComponentFixture<CreateNewHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
