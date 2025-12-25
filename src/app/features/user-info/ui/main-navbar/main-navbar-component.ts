import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-main-navbar-component',
  imports: [MatToolbarModule, MatButtonModule, MatMenuModule, MatIcon],
  templateUrl: './main-navbar-component.html',
  styleUrls: ['./main-navbar-component.css'],
})
export class MainNavbarComponent {
  @Input() imageSource: string = '';
  @Input() userName: string = '';
}
