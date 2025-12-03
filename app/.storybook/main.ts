// This file has been automatically migrated to valid ESM format by Storybook.
import { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  staticDirs: [
    { from: '../src/assets', to: '/assets' },
    { from: '../src/scss', to: '/css' },
    { from: '../src', to: '/' },
  ],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};
export default config;
