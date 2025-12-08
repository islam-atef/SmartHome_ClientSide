import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacadeService } from './features/auth/application/auth-facade.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'SmartHome_ClientSide';
  constructor(private authFacade: AuthFacadeService) {
    this.authFacade.initFromLocalStorage();
  }
}
