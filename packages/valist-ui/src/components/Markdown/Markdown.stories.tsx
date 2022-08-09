import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Markdown } from './Markdown';

export default {
  title: 'Markdown',
  component: Markdown,
} as ComponentMeta<typeof Markdown>;

const Template: ComponentStory<typeof Markdown> = (args) => (
  <Markdown {...args} />
);

export const Primary = Template.bind({});

Primary.args = {
  children: `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`
}