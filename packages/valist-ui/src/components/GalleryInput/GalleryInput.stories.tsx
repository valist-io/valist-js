import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { GalleryInput } from './GalleryInput';

export default {
  title: 'GalleryInput',
  component: GalleryInput,
} as ComponentMeta<typeof GalleryInput>;

const Template: ComponentStory<typeof GalleryInput> = (args) => {
  const [files, setFiles] = useState<(File | string)[]>([]);
  return (
    <GalleryInput value={files} onChange={setFiles} />
  );
};

export const Primary = Template.bind({});

Primary.args = {

};
