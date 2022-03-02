import React, { ChangeEvent } from 'react';
import { SetUseState } from '../../utils/Account/types';

interface FileUploadProps {
  files: FileList
  archs: string[]
  setFiles: SetUseState<FileList>
  setArchs: SetUseState<string[]>
}

interface FileItemProps {
  file: File,
  files: FileList
  archs: string[]
  number: string
  setFiles: SetUseState<FileList>
  setArchs: SetUseState<string[]>
}

function FileItem(props:FileItemProps) {
  const updateFileArch = (e: any) => {
    let archs = [...props.archs];
    for (let i = 0; i < Object.keys(props.files).length; i++) {
      if (i.toString() === e.target.id) {
        archs[i] = e.target.value;
      }
    }
    props.setArchs(archs);
  };

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
        id={props.number}
      />
      <div className="flex border border-gray-300 p-2 rounded-r-lg w-full">
        <div className='my-auto'>{props.file.name}</div>
      </div>
    </li>
  );
}

export default function FileUpload(props: FileUploadProps) {
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      props.setFiles(e.target.files);
    };
  };

  const fileItems = () => {
    const items = [];
    for (let i = 0; i < Object.keys(props.files).length; i++) {
      items.push(
        <FileItem 
          key={i}
          number={i.toString()} 
          archs={props.archs}
          file={props.files[i]} 
          files={props.files} 
          setArchs={props.setArchs} 
          setFiles={props.setFiles} 
        />,
      );
    }

    return items;
  };

  return (
    <section>
      <h4 className='mb-1 block text-sm font-medium text-gray-700'>Artifacts</h4>
      <label style={{ minHeight: "80px" }} className='flex justify-center py-2 px-4 border border-transparent rounded-md 
        shadow-sm text-sm font-medium focus:outline-none 
        mt-4 mx-auto border-4 border-dashed border-gray-200 p-4'>
        <input type='file' onChange={(e) => handleImage(e)} multiple={true} className="hidden" />
        <p className='text-center text-gray-400 align-middle'>Click to select files</p>
      </label>
      <aside className='mt-4'>
        <ul>
          {fileItems()}
        </ul>
      </aside>
    </section>
  );
}