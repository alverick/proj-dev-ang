import { type Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

setCompodocJson(docJson);

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
      height: '768px',
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
      viewports: {
        ...tailwindViewports,
      },
    },
  },
};

export default preview;
