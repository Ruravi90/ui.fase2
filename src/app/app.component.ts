import { Component, OnInit } from '@angular/core';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';
import { setTheme } from 'ngx-bootstrap/utils';

@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit {
  constructor(
    public iconSet: IconSetService
  ) {
    iconSet.icons = { ...freeSet };
    setTheme('bs5'); // or 'bs4'
  }

  ngOnInit() {
    window.scrollTo(0, 0);
  }
}
