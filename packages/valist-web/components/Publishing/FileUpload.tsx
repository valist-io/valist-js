import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { TrashIcon } from '@heroicons/react/solid';
import { SetUseState } from '../../utils/Account/types';

interface FileUploadProps {
  files: any
  setFiles: SetUseState<any>
}

interface FileItemProps {
  file: File
  files: any
  size?: string
  setFiles: SetUseState<any>
}

function FileItem(props:FileItemProps){
  const updateFileArch = (e: any) => {
    let files = Object.assign({}, props.files);
    files[e.target.id].arch = e.target.value;
    props.setFiles(files);
  }

  return (
    <li className="flex mb-2 overflow-hidden">
      <input
        name="name"
        type="text"
        onChange={(e) => updateFileArch(e)}
        required
        className="appearance-none block px-3 py-2 border border-gray-300
        shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
        focus:border-indigo-500 sm:text-sm rounded-l-lg"
        placeholder='os/arch'
        id={props.file.path}
      />
      <div className="flex border border-gray-300 p-2 rounded-r-lg w-full">
        <div className='my-auto'>{props.file.path}</div>
      </div>
      {/* <TrashIcon className="my-auto" height={25} name={props.file.path} onClick={(e) => removeFile(e)} /> */}
    </li>
  )
}

export default function FileUpload(props: FileUploadProps) {
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();

  useEffect(() => {
    const files:any = {}

    for (const file of acceptedFiles) {
      const fileObject = {
        file: file,
        arch: "",
      }
      files[file.path] = fileObject;
    }

    props.setFiles(files);
  }, [acceptedFiles]);

  const renderFileList = () => {
    const fileItems: JSX.Element[] = [];
    Object.keys(props.files).map((key) => {
      const current = props.files[key];
      fileItems.push(
        <FileItem key={current.file.path} file={current.file} setFiles={props.setFiles} files={props.files} />
      );
    });
    return fileItems;
  }

  return (
    <section>
      <h4 className='mb-1 block text-sm font-medium text-gray-700'>Atifacts</h4>
      <div style={{minHeight: "150px"}} {...getRootProps({className: 'dropzone border-4 border-dashed border-gray-200 p-4'})}>
        <input {...getInputProps()} />
        <p className='text-center align-middle'>Drag files here, or click to select files</p>
      </div>
      <aside className='mt-4'>
        <ul>
          {renderFileList()}
        </ul>
      </aside>
    </section>
  );
}