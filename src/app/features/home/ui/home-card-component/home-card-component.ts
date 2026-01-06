import { Component, inject, Input, OnInit } from '@angular/core';
import { UserHomeDTO } from '../../../user-info/models/user-home.dto';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-card-component',
  imports: [MatIconModule],
  templateUrl: './home-card-component.html',
  styleUrl: './home-card-component.css',
})
export class HomeCardComponent implements OnInit {
  private _router = inject(Router);

  @Input() home: UserHomeDTO = new UserHomeDTO();

  homeExists: boolean = false;
  homeName = '';

  ngOnInit(): void {
    if (this.home) {
      this.homeExists = true;
      this.homeName = this.home.HomeName;
    } else {
      this.homeExists = false;
      this.homeName = 'Add New Home';
    }
  }

  gotoHome() {
    this._router.navigate(['/home', this.home.HomeId]);
  }

  NewHome() {
    this._router.navigate([`/home/new`]);
  }
}
