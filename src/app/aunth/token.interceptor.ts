import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

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
        () => { status = 'failed'; }
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
