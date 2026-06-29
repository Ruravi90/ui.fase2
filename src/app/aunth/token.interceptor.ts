import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const startTime = Date.now();
    let status = '';
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (!(req.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const xsrfToken = this.getCookie('XSRF-TOKEN');
    if (xsrfToken && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method.toUpperCase())) {
      headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
    }

    const authReq = req.clone({
      withCredentials: true,
      setHeaders: headers,
    });

    return next.handle(authReq).pipe(
      tap(
        event => {
          if (event instanceof HttpResponse) {
            status = 'succeeded';
          }
        },
        (error) => {
          status = 'failed';
          if (error instanceof HttpErrorResponse && error.status === 403) {
            // We force a hard redirect to the subscription page to avoid router conflicts
            if (!window.location.hash.includes('/admin/subscription')) {
              window.location.hash = '/admin/subscription';
              window.location.reload();
            }
          }
        }
      ),
      finalize(() => {
        const elapsedTime = Date.now() - startTime;
        const message = authReq.method + ' ' + authReq.urlWithParams + ' ' + status + ' in ' + elapsedTime + 'ms';
        this.logDetails(message);
      })
    );
  }

  private logDetails(msg: string) {
    console.log(msg);
  }

  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
    return match ? match[2] : null;
  }
}
