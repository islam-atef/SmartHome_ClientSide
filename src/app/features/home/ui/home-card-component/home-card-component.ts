import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { UserHomeDTO } from '../../../user-info/models/user-home.dto';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { HomeCardDTO } from '../../models/response-dtos/home-card.dto';

@Component({
  selector: 'app-home-card-component',
  imports: [MatIconModule],
  templateUrl: './home-card-component.html',
  styleUrl: './home-card-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeCardComponent implements OnInit, OnChanges {
  private _router = inject(Router);

  @Input() home!: UserHomeDTO | HomeCardDTO;
  @Input() userIn: boolean = false;
  @Input() isOwner: boolean = false;

  homeExists: boolean = false;
  homeName: string = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['home']) {
      this.home = changes['home'].currentValue;
      this.homeExists = this.home.homeId ? true : false;
      this.homeName = this.home.homeName;
    }
    if (changes['userIn']) {
      this.userIn = changes['userIn'].currentValue;
    }
    if (changes['isOwner']) {
      this.isOwner = changes['isOwner'].currentValue;
    }
    this.cdr.detectChanges();
  }

  ngOnInit(): void {
    if (!this.home) {
      // No home input bound — treat as the "Add New Home" placeholder card
      this.homeExists = false;
      this.userIn = false;
      this.isOwner = false;
      this.homeName = 'Add New Home';
      this.cdr.detectChanges();
      return;
    }
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
