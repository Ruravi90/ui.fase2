import { Injectable } from '@angular/core';

import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

declare var qz: any;

@Injectable({
  providedIn: 'root'
})
export class QzTrayService {
  constructor() { }

  errorHandler(error: any): Observable<any> {
    alert(error);
    return throwError(() => error);
  }

  // Get list of printers connected
  getPrinters(): Observable<string[]> {
    return from(qz.websocket.connect().then(() => qz.printers.find()))
      .pipe(
        map((printers: any) => printers as string[]),
        catchError((err) => this.errorHandler(err))
      );
  }

  // Get the SPECIFIC connected printer
  getPrinter(printerName: string): Observable<string> {
    return from(qz.websocket.connect().then(() => qz.printers.find(printerName)))
      .pipe(
        map((printer: any) => printer as string),
        catchError((err) => this.errorHandler(err))
      );
  }

  // Print data to chosen printer
  printData(printer: string, data: any): Observable<any> {
    // Create a default config for the found printer
    const config = qz.configs.create(printer);
    return from(qz.print(config, data))
      .pipe(
        map((anything: any) => anything),
        catchError((err) => this.errorHandler(err))
      );
  }

  // Disconnect QZ Tray from the browser
  removePrinter(): void {
     qz.websocket.disconnect();
  }
}
