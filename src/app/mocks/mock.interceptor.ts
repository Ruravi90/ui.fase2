import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { getMockContext, mockRoutes } from './mock-api';

@Injectable()
export class MockInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!environment.useMocks) {
      return next.handle(req);
    }

    const mockResponse = this.findMockResponse(req);

    if (mockResponse !== undefined) {
      console.log(`[MOCK] Intercepted ${req.method} ${req.url}`, mockResponse);
      return of(new HttpResponse({ status: 200, body: mockResponse })).pipe(delay(500));
    }

    return next.handle(req);
  }

  private findMockResponse(req: HttpRequest<any>): any {
    const context = getMockContext(req);

    for (const route of mockRoutes) {
      if (route.pattern.test(context.path) && route.method === req.method) {
        return route.response(req, context);
      }
    }

    return undefined;
  }
}
