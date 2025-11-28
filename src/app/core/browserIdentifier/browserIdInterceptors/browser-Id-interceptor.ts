import { HttpInterceptorFn } from '@angular/common/http';

export const browserIdInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
