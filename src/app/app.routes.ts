import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DailyPageComponent } from './daily-page/daily-page.component';
import { EndlessPageComponent } from './endless-page/endless-page.component';

const BASE_TITLE = 'Arknightsdle';

export const routes: Routes = [
	{ path: '', component: HomeComponent, title: BASE_TITLE },
	{ path: 'daily', component: DailyPageComponent, title: 'Daily - ' + BASE_TITLE },
	{ path: 'endless', component: EndlessPageComponent, title: 'Endless - ' + BASE_TITLE }
];
