import React from 'react';
import { FileWithPath } from 'file-selector';
import { Dropzone, DropzoneStatus } from '@mantine/dropzone';
import { Group, Text, MantineTheme, useMantineTheme } from '@mantine/core';
import { XIcon } from '@heroicons/react/outline';
import { Center } from '@mantine/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical } from 'tabler-icons-react';
import { UseListStateHandler } from '@mantine/hooks/lib/use-list-state/use-list-state';

export type FileList = {
  src: FileWithPath | string;
  type: string;
  name: string;
}

interface FileUploadProps {
  files: FileList[];
  title?: string;
  size?: number;
  fileNum?: number;
  fileView: 'ordered' | 'tree' | 'none';
  setFiles: UseListStateHandler<FileList>;
}

export default function FileUpload(props: FileUploadProps) {
  const theme = useMantineTheme();

  const removeFile = (index: number) => {
    props.setFiles.remove(index);
  };

  const handleFiles = (files: File[]) => {
    if (props.fileNum === 1) {
      files.map((file) => {
        props.setFiles.setState([{
          src: file,
          type: file.type,
          name: file.name,
        }]);
      });
    } else {
      files.map((file) => {
        props.setFiles.append({
          src: file,
          type: file.type,
          name: file.name,
        });
      });
    }
  };

  const fields = props.files.map((file, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided) => (
        <Group ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
          {(props.fileView === 'ordered') 
            && <Center {...provided.dragHandleProps}>
                <GripVertical size={18} />
              </Center>
          }
          <div style={{ maxWidth: 275 }} className="overflow-hidden">{ (typeof file.src === "object") ? file.src.path : file.src }</div>
          <XIcon onClick={() => removeFile(index)} style={{ strokeWidth: 3 }} height={30} width={30} />
        </Group>
      )}
    </Draggable>
  ));

  return (
    <div>
      <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 mb-2">
        {props.title || 'Files'}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <Dropzone onDrop={(files) => handleFiles(files)}>
          {(status) => dropzoneChildren(status, theme)}
        </Dropzone>
        <DragDropContext
          onDragEnd={({ destination, source }) =>
            // @ts-ignore
            props.setFiles.reorder({ from: source.index, to: destination?.index })
          }
        >
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
  <Group position="center" spacing="xl" style={{ minHeight: 150, pointerEvents: 'none' }}>
    <div>
      <Text size="xl" inline>
        Drag files here or click to select files.
      </Text>
    </div>
  </Group>
);