import {
  Fragment, useState, Dispatch, useEffect,
} from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/solid';
import { parseCID } from '@valist/sdk/dist/utils';

interface DownloadBoxProps {
  releaseCID: string,
  releaseName: string,
}

interface ReleaseDownloadsProps {
  releaseCID: string,
  releaseArtifacts: string[],
  setChosenArtifact: Dispatch<any>,
}

interface ReleaseArtifactProps {
  artifact: string,
  setChosenArtifact: Dispatch<any>,
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const ReleaseArtifact = (props: ReleaseArtifactProps) => {
  const { artifact, setChosenArtifact } = props;
  return (
    <div onClick={() => setChosenArtifact(artifact)} key={artifact}>
      <Listbox.Option
        className={({ active }) => classNames(
          active ? 'text-white bg-indigo-500' : 'text-gray-900',
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
    <Listbox.Options className="origin-top-right absolute z-10 right-0 mt-2 w-72
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
  const [releaseArtifacts, setReleaseArtifacts] = useState<string[]>([]);
  const [releaseMeta, setReleaseMeta] = useState<any>({});
  const [chosenArtifact, setChosenArtifact] = useState<any>('');

  const artifactFromName = (artifactName: string) => {
    try {
      const cid = releaseMeta.artifacts[artifactName].provider;
      const parsedCID = parseCID(cid);
      const url = `https://gateway.valist.io/ipfs/${parsedCID}?filename=${props.releaseName}`;
      window.location.assign(url);
    } catch (err) {
      console.log('Failed to fetch artifact by name', err);
    }
  };

  const artifactFromCID = (artifactCID: string) => {
    const cid = parseCID(artifactCID);
    const url = `https://gateway.valist.io/ipfs/${cid}`;
    window.open(url, '_blank');
  };

  const fetchData = async () => {
    const parsedCID = parseCID(props.releaseCID);
    const url = `https://gateway.valist.io/ipfs/${parsedCID}`;
    let artifactNames: string[] = [];
    let response: any;
    let json: any;

    if (releaseArtifacts.length === 0) {
      try {
        response = await fetch(url);
        json = await response.json();
        artifactNames = Object.keys(json.artifacts);
      } catch (err) {
        console.log('Error while fetching artifacts:', err);
      }

      if (artifactNames.length === 0) {
        artifactNames.push('artifact');
      }

      setReleaseMeta(json);
      setReleaseArtifacts(artifactNames);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative cursor-pointer">
        <div className="inline-flex shadow-sm rounded-md divide-x divide-indigo-600">
          <div className="relative z-0 inline-flex shadow-sm rounded-md divide-x divide-indigo-600">
            <div onClick={() => {
              if (chosenArtifact === 'artifact') {
                artifactFromCID(props.releaseCID);
              } else if (chosenArtifact !== '' && chosenArtifact !== 'artifact') {
                artifactFromName(chosenArtifact);
              } else {
                alert('Please select an artifact to download.');
              }
            }}
              className="relative inline-flex items-center bg-indigo-500 w-32
              py-2 pl-3 pr-4 border border-transparent rounded-l-md shadow-sm text-white">
              <p className="ml-2.5 text-sm font-medium">{(chosenArtifact !== '') ? chosenArtifact : 'Download'}</p>
            </div>
            <Listbox.Button className="relative inline-flex items-center bg-indigo-500 p-2
            rounded-l-none rounded-r-md text-sm font-medium text-white hover:bg-indigo-600
            focus:outline-none focus:z-10 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50
            focus:ring-indigo-500">
              <ChevronDownIcon className="h-5 w-5 text-white" aria-hidden="true" />
            </Listbox.Button>
          </div>
        </div>
        <ReleaseDownloads
          releaseArtifacts={releaseArtifacts}
          releaseCID={props.releaseCID}
          setChosenArtifact={setChosenArtifact}
        />
      </div>
    </Listbox>
  );
}
