import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

declare var iziToast: any;

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private titleService: Title) { }

  ngOnInit() {
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      })
      .filter((route) => route.outlet === 'primary')
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        this.titleService.setTitle(event['title']);
        window.scrollTo(0, 0);
      });

      iziToast.settings({
          timeout: 10000,
          resetOnHover: true,
          color: 'green', // blue, red, green, yellow
          transitionIn: 'flipInX',
          transitionOut: 'flipOutX',
          close: true,
          closeOnEscape: true,
          closeOnClick: true,
          onOpening: () => {},
          onClosing: () => {}
      });
  }
}
