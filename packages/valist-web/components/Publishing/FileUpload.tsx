import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { TrashIcon } from '@heroicons/react/solid';
import { SetUseState } from '../../utils/Account/types';

interface FileItemProps {
  file: File
  size?: string
  setFiles: SetUseState<File[]>
  files: File[]
}

function FileItem(props:FileItemProps){
  const removeFile = (e: any) => {
    const target = e.target.getAttribute("name")
    props.setFiles(props.files.filter(item => item.path !== target));
  }

  return (
    <li className="flex mb-2 overflow-hidden" key={props.path}>
      <input
        name="name"
        type="text"
        onChange={(e) => {}}
        required
        className="appearance-none block px-3 py-2 border border-gray-300
        shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
        focus:border-indigo-500 sm:text-sm rounded-l-lg"
        placeholder='os/arch'
      />
      <div className="flex border border-gray-300 p-2 rounded-r-lg">
        <div className='my-auto'>{props.path}</div>
      </div>
      <TrashIcon className="my-auto" height={25} name={props.path} onClick={(e) => removeFile(e)} />
    </li>
  )
}

export default function FileUpload() {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setFiles(acceptedFiles);
  }, [acceptedFiles]);
  
  const filesList = files.map((file:any) => (
    <FileItem path={file.path} setFiles={setFiles} files={files} />
  ));

  return (
    <section>
      <h4 className='mb-1 block text-sm font-medium text-gray-700'>Atifacts</h4>
      <div style={{minHeight: "200px"}} {...getRootProps({className: 'dropzone border-4 border-dashed border-gray-200 p-4'})}>
        <input {...getInputProps()} />
        <p className='text-center align-middle'>Drag files here, or click to select files</p>
      </div>
      <aside className='mt-4'>
        <ul>
          {filesList}
        </ul>
      </aside>
    </section>
  );
}