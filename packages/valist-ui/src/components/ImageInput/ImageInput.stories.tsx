import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ImageInput } from './ImageInput';

export default {
  title: 'ImageInput',
  component: ImageInput,
} as ComponentMeta<typeof ImageInput>;

const Template: ComponentStory<typeof ImageInput> = (args) => {
  const [file, setFile] = useState<File>(null);
  return (
    <ImageInput {...args} value={file} onChange={setFile} />
  );
};

export const Primary = Template.bind({});

Primary.args = {

};
