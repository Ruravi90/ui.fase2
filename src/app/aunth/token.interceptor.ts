import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '../services';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public auth: UserService,private spinner: NgxSpinnerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const startTime = Date.now();
    //const loading = document.getElementById('loading');
    //loading.classList.add('show');
    this.spinner.show(); 
    let status: string;
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    });
    return next.handle(req).pipe(
        tap(
          event => {
            status = '';
            if (event instanceof HttpResponse) {
              status = 'succeeded';
            }
          },
          error => status = 'failed'
        ),
        finalize(() => {
          const elapsedTime = Date.now() - startTime;
          const message = req.method + ' ' + req.urlWithParams + ' ' + status + ' in ' + elapsedTime + 'ms';
          this.logDetails(message);
          this.spinner.hide();
          //loading.classList.remove('show');
        })
    );
  }
  private logDetails(msg: string) {
    console.log(msg);
  }
}
