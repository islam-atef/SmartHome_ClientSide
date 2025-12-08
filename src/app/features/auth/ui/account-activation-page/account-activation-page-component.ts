import { Component, inject, OnInit } from '@angular/core';
import { AuthFacadeService } from '../../application/auth-facade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountActivationDto } from '../../models/account-activation.dto';
import { MatCardContent, MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-account-activation-page-component',
  imports: [MatCardContent, MatCard, MatIcon],
  templateUrl: './account-activation-page-component.html',
  styleUrl: './account-activation-page-component.css',
})
export class AccountActivationPageComponent implements OnInit {
  private authFacade = inject(AuthFacadeService);
  private route = inject(ActivatedRoute);

  activationResult: string = '';
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userId = params['email'];
      const activationCode = params['code'];
      if (userId && activationCode) {
        let dto: AccountActivationDto = {
          userEmail: userId,
          activationToken: activationCode,
        };
        this.authFacade.accountActivation(dto).subscribe({
          next: (success) => {
            if (success) {
              console.log('Account activation successful');
              this.activationResult = 'Account activation successful';
            } else {
              console.log('Account activation failed');
              this.activationResult = 'Account activation failed';
            }
          },
          error: (error: any) => {
            console.log(
              `There is an error in Activating your account: ${error}`
            );
          },
        });
      }
    });
    // window.close();
  }
}
