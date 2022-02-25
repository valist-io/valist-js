import {
  Fragment, useState, Dispatch,
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { classNames } from '../../utils/Styles';
import { parseCID } from '../../utils/Ipfs';
import { ReleaseMeta } from '../../utils/Valist/types';

interface DownloadBoxProps {
  releaseName: string;
  releaseMeta: ReleaseMeta,
}

interface ReleaseDownloadsProps {
  releaseArtifacts: string[],
  setChosenArtifact: Dispatch<any>,
}

interface ReleaseArtifactProps {
  artifact: string,
  setChosenArtifact: Dispatch<any>,
}

const ReleaseArtifact = (props: ReleaseArtifactProps) => {
  const { artifact, setChosenArtifact } = props;
  return (
    <div onClick={() => setChosenArtifact(artifact)} key={artifact}>
      <Listbox.Option
        className={({ active }) => classNames(
          active ? 'text-white bg-gray-500' : 'text-white-900',
          'cursor-default select-none relative p-4 text-sm',
        )}
        value={artifact}
      >
        {({ selected, active }) => (
          <div className="flex flex-col">
            <div className="flex justify-between">
              <p className={selected ? 'font-semibold' : 'font-normal'}>
                {artifact}
              </p>
              {selected ? (
                <span className={active ? 'text-white' : 'text-indigo-500'}>
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : null}
            </div>
          </div>
        )}
      </Listbox.Option>
    </div>
  );
};

const ReleaseDownloads = (props: ReleaseDownloadsProps) => (
  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
    <Listbox.Options
      className="origin-top-right absolute z-10 right-0 mt-2 w-72
          rounded-md shadow-lg overflow-hidden bg-white divide-y divide-gray-200 ring-1
          ring-black ring-opacity-5 focus:outline-none">
      {props.releaseArtifacts.map((artifact: string) => (
        <ReleaseArtifact
          key={artifact}
          artifact={artifact}
          setChosenArtifact={props.setChosenArtifact}
        />
      ))}
      {(props.releaseArtifacts.length === 0)
        && <ReleaseArtifact
          artifact={'Loading'}
          setChosenArtifact={(() => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [, setState] = useState();
            return setState;
          })()}
        />
      }
    </Listbox.Options>
  </Transition>
);

export default function DownloadBox(props: DownloadBoxProps) {
  const [selected, setSelected] = useState();
  const [chosenArtifact, setChosenArtifact] = useState<any>('');

  const artifactFromName = (artifactName: string) => {
    try {
      const cid = props.releaseMeta?.artifacts?.get(artifactName)?.provider;
      if (!cid) return;
      const parsedCID = parseCID(cid);
      const url = `https://gateway.valist.io/ipfs/${parsedCID}?filename=${props.releaseName}`;
      window.location.assign(url);
    } catch (err) {
      console.log('Failed to fetch artifact by name', err);
    }
  };

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative cursor-pointer">
        <div className="inline-flex shadow-sm rounded-md divide-x divide-white-600">
          <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-gray-600">
            <div onClick={() => {
              if (chosenArtifact !== '') {
                artifactFromName(chosenArtifact);
              } else {
                alert('Please select an artifact to download.');
              }
            }}
              className="relative inline-flex items-center bg-gray-300 w-30
              py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white">
              <p className="ml-2.5 text-sm font-medium">{(chosenArtifact !== '') ? chosenArtifact : 'Downloads'}</p>
            </div>
            <Listbox.Button className="relative inline-flex items-center bg-gray-300 p-2
            rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-gray-00
            focus:outline-none focus:ring-offset-gray-50
            focus:ring-white-500">
              <ChevronDownIcon className="h-5 w-5 text-gray" aria-hidden="true" />
            </Listbox.Button>
          </div>
        </div>
        <ReleaseDownloads
          releaseArtifacts={Object.keys(props.releaseMeta.artifacts || {})}
          setChosenArtifact={setChosenArtifact}
        />
      </div>
    </Listbox>
  );
}
