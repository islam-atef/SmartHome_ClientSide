import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeRoomComponent } from './home-room-component';

describe('HomeRoomComponent', () => {
  let component: HomeRoomComponent;
  let fixture: ComponentFixture<HomeRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeRoomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
