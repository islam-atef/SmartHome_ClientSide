import { Component, Input } from '@angular/core';
import { UserHomeDTO } from '../../models/user-home.dto';

@Component({
  selector: 'app-home-card-component',
  imports: [],
  templateUrl: './home-card-component.html',
  styleUrl: './home-card-component.css',
})
export class HomeCardComponent {
  @Input() home: UserHomeDTO = new UserHomeDTO();
}
