import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { AffiliationService } from '../../services';
import { RegistrationFinishedPage } from './registration-finished.page';

class MockAffiliationService {
  email: 'mailmock@mail.com';
}

const meta: Meta<RegistrationFinishedPage> = {
  title: 'Page/Registration Finished',
  component: RegistrationFinishedPage,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AffiliationService, useClass: MockAffiliationService },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<RegistrationFinishedPage>;

export const Default: Story = {
  args: {
    email: 'mail@mail.com',
  },
};
