import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpEvent } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { UserService } from '../services';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  loading = swal.mixin({
    didOpen: (toast) => {
      swal.showLoading();
    }
  })

  constructor(public auth: UserService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    this.loading.fire({
      title: 'Estoy trabajando!',
    });

    const startTime = Date.now();
    let status: string;
    req = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    });

    return next.handle(req).pipe(
        tap({
          next:(event:HttpEvent<any>)=>{
            status = '';
            if (event instanceof HttpResponse) {
              status = 'succeeded';
            }
          },
          error:(error: any)=>{
            if(error.status === 401)
            status = 'failed'
          }
        }),
        finalize(() => {
          const elapsedTime = Date.now() - startTime;
          const message = req.method + ' ' + req.urlWithParams + ' ' + status + ' in ' + elapsedTime + 'ms';
          this.logDetails(message);
          this.loading.close();

          if(status === 'failed') this.router.navigate(['/login']);
        })
    );
  }
  private logDetails(msg: string) {
    console.log(msg);
  }
}
