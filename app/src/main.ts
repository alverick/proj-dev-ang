import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';

const { production, hmr: hmrValue = false } = environment;

if (production) {
  enableProdMode();
}

if (hmrValue || !production) {
  import('./mocks/browser')
    .then(({ worker }) => {
      return worker.start({
        onUnhandledRequest: 'bypass',
      });
    })
    .catch((err) => console.error('Failed to start MSW', err));
}

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...(appConfig.providers ?? []), provideAnimations()],
}).catch((err) => console.log(err));
