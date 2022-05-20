import { configure } from '@storybook/angular';
import '@storybook/addon-console';

const req = require.context('../src', true, /.stories.ts$/);

const loadStories = () => {
  req.keys().forEach((filename) => req(filename));
};

configure(loadStories, module);
