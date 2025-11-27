import { Injectable } from '@angular/core';
import { ApiHttpService } from '../../../core/htttp/api-http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  //  beginLogin() / verifyOtp() / refresh() / logout()
  constructor(private apiHttp: ApiHttpService) {}
}
