import {
  Modal as MantineModal,
  CloseButton,
  BackgroundImage,
} from '@mantine/core';

import React from 'react';

export interface ModalProps {
  opened: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  image?: string;
}

export function Modal(props: ModalProps) {
  return (
    <MantineModal
      size={900}
      padding={0}
      opened={props.opened}
      onClose={props.onClose}
      withCloseButton={false}
      centered
    >
      <div style={{ display: 'flex' }}>
        <div style={{ flex: '1 1 0', padding: 40 }}>
          {props.children}
        </div>
        <div style={{ flex: '1 1 0' }}>
          <BackgroundImage
            radius="md"
            src={props.image}
            style={{ padding: 29, width: '100%', height: '100%' }}
          >
            <CloseButton
              style={{ float: 'right' }}
              onClick={props.onClose}
              aria-label="Close modal"
              variant="transparent"
            />
          </BackgroundImage>
        </div>
      </div>
    </MantineModal>
  );
} 