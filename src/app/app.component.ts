import { Component, OnInit } from '@angular/core';
import { Ng2IzitoastService } from 'ng2-izitoast';//<-- this line

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(public iziToast: Ng2IzitoastService) { }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.iziToast.settings({
        timeout: 10000,
        resetOnHover: true,
        color: 'green', // blue, red, green, yellow
        transitionIn: 'flipInX',
        transitionOut: 'flipOutX',
        close: true,
        closeOnEscape: true,
        onOpening: () => {},
        onClosing: () => {}
    });
  }
}
