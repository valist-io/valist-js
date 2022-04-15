import React, { useEffect } from 'react';
import { SetUseState } from '../../utils/Account/types';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  title?: string;
  files: File[];
  setFiles: SetUseState<File[]>;
}

export default function FileUpload(props: FileUploadProps) {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
  
  useEffect(() => {
    if (acceptedFiles.length != 0) {
      props.setFiles(acceptedFiles);
    }
  }, [acceptedFiles, props.setFiles]);
  
  return (
    <div>
      <label htmlFor="cover-photo" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
        {props.title || 'Files'}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md" {...getRootProps()}>
          <div className="space-y-1 text-center">
            <div className="flex text-sm text-gray-600" >
              <input id="file-upload" name="file-upload" {...getInputProps()} />
              <p className="pl-1">Upload a file or drag and drop</p>
            </div>
          </div>
        </div>
        <ul>
          {props.files && props.files.map((file) => (
            <li key={file.name}>
              {(file as any).path || file.webkitRelativePath || file.name }
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}