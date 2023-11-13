import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

export const decorators = [];

export const parameters = {
  layout: 'centered',
};
setCompodocJson(docJson);
