import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiHttpService {
  private readonly baseUrl = environment.apiBaseUrl;
  private readonly http = inject(HttpClient);

  // GET
  get<T>(
    url: string,
    options?: {
      params?: HttpParams | { [key: string]: any };
      headers?: HttpHeaders | { [key: string]: string };
    }
  ) {
    return this.http.get<T>(this.buildUrl(url), options);
  }

  // POST
  post<T>(
    url: string,
    body: any,
    options?: {
      params?: HttpParams | { [key: string]: any };
      headers?: HttpHeaders | { [key: string]: string };
    }
  ) {
    return this.http.post<T>(this.buildUrl(url), body, options);
  }

  // PUT
  put<T>(
    url: string,
    body: any,
    options?: {
      params?: HttpParams | { [key: string]: any };
      headers?: HttpHeaders | { [key: string]: string };
    }
  ) {
    return this.http.put<T>(this.buildUrl(url), body, options);
  }

  // DELETE
  delete<T>(
    url: string,
    options?: {
      params?: HttpParams | { [key: string]: any };
      headers?: HttpHeaders | { [key: string]: string };
    }
  ) {
    return this.http.delete<T>(this.buildUrl(url), options);
  }

  // buildUrl
  private buildUrl(relative: string): string {
    // relative url as "http://..."
    if (relative.startsWith('http://') || relative.startsWith('https://')) {
      return relative; // return relative
    }
    // make sure that baseUrl ends with "/"
    const base = this.baseUrl.endsWith('/')
      ? this.baseUrl.slice(0, -1)
      : this.baseUrl;
    const rel = relative.startsWith('/') ? relative : `/${relative}`;
    return `${base}${rel}`;
  }
}
