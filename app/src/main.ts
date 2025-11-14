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

// --- MSW Setup ---
// Run MSW worker start unconditionally if it's not a production build
// This setup is moved outside the legacy HMR block.
if (hmrValue || !production) {
  import('./mocks/browser')
    .then(({ worker }) => {
      return worker.start({
        onUnhandledRequest: 'bypass',
      });
    })
    .catch((err) => console.error('Failed to start MSW', err));
}
// --- MSW Setup End ---

// Standard application bootstrap
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideAnimations()
  ]
}).catch((err) => console.log(err));
