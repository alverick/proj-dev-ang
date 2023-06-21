import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { SharedModule } from '../../shared.module';
import { LabelControlComponent } from './label-control.component';

export default {
  title: 'UI/Forms/Label',
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
      ],
    }),
  ],
} as Meta;

const Template: Story<LabelControlComponent> = (
  args: LabelControlComponent
) => ({
  props: args,
  template: `<cs-label-control class="tw-m-5">Label <input
      type="text"
      pInputText
    /></cs-label-control>`,
});

export const normal = Template.bind({});
normal.args = {};

// export const DefaultStory = () => ({
//   template: `<cs-label-control class="tw-m-5">Label <input
//       type="text"
//       pInputText
//     /></cs-label-control>`,
//   props: {
//     text: 'Button with custom styles',
//   },
//   styles: [
//     `
//       cs-text-input {
//         margin: 25px;
//       }
//     `,
//   ],
// });
//
// DefaultStory.story = {
//   name: 'Default',
// };
//
// export const normal = () => ({
//   component: LabelControlComponent,
//   props: {
//     gtpMode: boolean('GTP Mode', false),
//   },
//   argTypes: { sendForm: { action: 'clicked' } },
// });
//
// export const ActionOnly = () => ({
//   component: Button,
//   props: {
//     text: 'Action only',
//     onClick: action('log 1'),
//   },
// });
//
// ActionOnly.story = {
//   name: 'Action only',
// };
//
// export const ActionAndMethod = () => ({
//   component: Button,
//   props: {
//     text: 'Action and Method',
//     onClick: (e) => {
//       console.log(e);
//       e.preventDefault();
//       action('log2')(e.target);
//     },
//   },
// });
//
// ActionAndMethod.story = {
//   name: 'Action and method',
// };
