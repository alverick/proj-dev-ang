import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';

import { AffiliationService } from '../../services';
import { ProcessingUpdatePage } from './processing-update.page';

class MockAffiliationService {
  email: 'mailmock@mail.com';
}

const meta: Meta<ProcessingUpdatePage> = {
  title: 'Page/Update Finished',
  component: ProcessingUpdatePage,
  decorators: [
    moduleMetadata({
      providers: [
        { provide: AffiliationService, useClass: MockAffiliationService },
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ProcessingUpdatePage>;

export const Default: Story = {
  args: {
    email: 'mail-item@mail.com',
  },
};
