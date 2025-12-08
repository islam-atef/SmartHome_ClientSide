import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authentication-layout-component',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './authentication-layout-component.html',
  styleUrl: './authentication-layout-component.css',
})
export class AuthenticationLayoutComponent {}
