// Angular 2 Universal
import { bootstrap } from '@angular/platform-browser-dynamic';
import { provideRouter } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

// Application
import { AppComponent } from './app/app.component';
import { UserService } from './app/user.service';
import { routes } from './app/app.routes';

export function ngApp() {
  return bootstrap(AppComponent, [
    HTTP_PROVIDERS,
    UserService,
    provideRouter(routes)
  ]);
}
