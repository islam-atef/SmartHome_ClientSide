import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { UserHomeDTO } from '../../../user-info/models/user-home.dto';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-card-component',
  imports: [MatIconModule],
  templateUrl: './home-card-component.html',
  styleUrl: './home-card-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardComponent implements OnInit {
  private _router = inject(Router);

  @Input() home: UserHomeDTO = new UserHomeDTO();
  @Input() userIn: boolean = false;
  @Input() isOwner: boolean = false;

  homeExists: boolean = false;
  homeName: string = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.home.homeId) {
      this.homeExists = true;
      this.homeName = this.home.homeName;
    } else {
      this.homeExists = false;
      this.userIn = false;
      this.isOwner = false;
      this.homeName = 'Add New Home';
    }
    this.cdr.detectChanges();
  }

  gotoHome() {
    this._router.navigate(['/home', this.home.homeId]);
  }

  NewHome() {
    this._router.navigate([`/new-home`]);
  }
}
