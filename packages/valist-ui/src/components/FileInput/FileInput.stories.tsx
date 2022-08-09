import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { FileInput } from './FileInput';

export default {
  title: 'FileInput',
  component: FileInput,
} as ComponentMeta<typeof FileInput>;

const Template: ComponentStory<typeof FileInput> = (args) => {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <FileInput onChange={setFiles} value={files} />
  );
};

export const Primary = Template.bind({});

Primary.args = {
  
};
