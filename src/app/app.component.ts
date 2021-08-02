import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';
import { LoaderService } from './services/loader.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  title = 'on-boarding';
  loading = true;

  constructor(private router: Router, private loaderService: LoaderService) {
    this.router.events.subscribe((event: Event) => {
      switch (true) {
      case event instanceof NavigationStart: {
      this.loading = true;
      this.loaderService.isLoading.next(this.loading);
      break;
      }
      case event instanceof NavigationEnd:
      case event instanceof NavigationCancel:
      case event instanceof NavigationError: {
      this.loading = false;
      this.loaderService.isLoading.next(this.loading);
      break;
      }
      default: {
      break;
      }
      }
      });
  }

  ngOnInit() {
    this.loaderService.isLoading.next(true);
  }
}
