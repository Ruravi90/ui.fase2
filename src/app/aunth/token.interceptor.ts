import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '../services';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const startTime = Date.now();
    //const loading = document.getElementById('loading');
    //loading.classList.add('show');
    //this.spinner.show(); 
    let status: string;
    const auth = this.injector.get(UserService);
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.getToken()}`
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
          //this.spinner.hide();
          //loading.classList.remove('show');
        })
    );
  }
  private logDetails(msg: string) {
    console.log(msg);
  }
}
