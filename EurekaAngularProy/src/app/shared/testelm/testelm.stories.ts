import { storiesOf } from '@storybook/angular';

import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestelmComponent } from './testelm.component';

storiesOf('Testelm', module).add('usecase1', () => ({
  component: TestelmComponent,
  moduleMetadata: {
    declarations: [TestelmComponent], // Adding this brings it back to live
    imports: [MatFormFieldModule, MatInputModule, BrowserAnimationsModule],
  },
  props: {},
}));
