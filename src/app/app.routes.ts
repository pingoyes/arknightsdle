import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DailyPageComponent } from './daily-page/daily-page.component';
import { EndlessPageComponent } from './endless-page/endless-page.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'daily', component: DailyPageComponent },
    { path: 'endless', component: EndlessPageComponent}
];
