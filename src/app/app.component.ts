import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { filter, map, mergeMap } from 'rxjs/operators';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { UserService } from './services/user.service';

declare var iziToast: any;

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet>\n<app-chat-widget *ngIf="isLoggedIn && !isSuperAdmin"></app-chat-widget>',
    imports: [RouterOutlet, ChatWidgetComponent, CommonModule]
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  isSuperAdmin = false;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private titleService: Title,
    private userService: UserService
  ) {
    this.userService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.isSuperAdmin = user?.roles?.some((r: any) => r.name === 'super_admin') ?? false;
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) { route = route.firstChild; }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((event) => {
        if (event['title']) {
          this.titleService.setTitle(event['title']);
        }
        window.scrollTo(0, 0);
      });

      if (typeof iziToast !== 'undefined') {
        iziToast.settings({
            timeout: 10000,
            resetOnHover: true,
            color: 'green',
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
}
