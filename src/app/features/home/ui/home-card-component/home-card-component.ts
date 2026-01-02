import { Component, Input, OnInit } from '@angular/core';
import { UserHomeDTO } from '../../../user-info/models/user-home.dto';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-card-component',
  imports: [MatIconModule],
  templateUrl: './home-card-component.html',
  styleUrl: './home-card-component.css',
})
export class HomeCardComponent implements OnInit {
  gotoHome() {
    throw new Error('Method not implemented.');
  }
  @Input() home: UserHomeDTO = new UserHomeDTO();

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
