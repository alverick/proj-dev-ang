import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const { production, hmr: hmrValue = false } = environment;

if (production) {
  enableProdMode();
}

// Function to start the application (standard bootstrap)
const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

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
bootstrap().catch((err) => console.log(err));
