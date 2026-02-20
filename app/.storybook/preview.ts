import { type Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { initialize, mswLoader } from 'storybook-msw-addon';
import { handlers } from '../src/mocks/handlers';

setCompodocJson(docJson);

initialize({}, handlers);

const tailwindViewports = {
  mobile: {
    name: 'mobile',
    styles: {
      width: '340px',
      height: '668px',
    },
  },
  sm: {
    name: 'sm',
    styles: {
      width: '640px',
      height: '963px',
    },
  },
  md: {
    name: 'md',
    styles: {
      width: '768px',
      height: '963px',
    },
  },
  lg: {
    name: 'lg',
    styles: {
      width: '1024px',
      height: '768px',
    },
  },
  xl: {
    name: 'xl',
    styles: {
      width: '1280px',
      height: '768px',
    },
  },
  default: {
    name: 'default',
    styles: {
      width: '1320px',
      height: '748px',
    },
  },
  '2xl': {
    name: '2xl',
    styles: {
      width: '1536px',
      height: '768px',
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        ...tailwindViewports,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;
