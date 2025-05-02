import { Component } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet, NavigationEnd, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, RouterLink, MatToolbarModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
  currentRoute?: string;
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        this.currentRoute = this.route.root.firstChild?.snapshot.url[0]?.path;
      }
    });
  }
}
