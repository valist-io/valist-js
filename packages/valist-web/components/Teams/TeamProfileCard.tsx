import { useEffect, useState } from 'react';
import { parseCID } from '../../utils/Ipfs';
import AddressIdenticon from '../Identicons/AddressIdenticon';
import Tabs from '../Tabs';

interface TeamProfileCardProps {
  view: string,
  setView: Function
  teamName: string,
  metaCID: string,
}

export default function TeamProfileCard(props: TeamProfileCardProps): JSX.Element {
  const [meta, setMeta] = useState<any>({
    description: 'loading',
  });

  const fetchMeta = async (metaCID: string) => {
    try{
      const parsedCID = parseCID(metaCID);
      const resp = await fetch(`http://localhost:8080/ipfs/${parsedCID}`);
      const metaJSON = await resp.json();
      setMeta(metaJSON);
    }catch(err){/* TODO HANDLE */}
  }

  useEffect(() => {
    (async () => {
      fetchMeta(props.metaCID);
    })()
  }, [props.metaCID]);

  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="sm:flex sm:items-center pt-6 px-6">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              <AddressIdenticon address={`${props.teamName}`} height={85} />
            </div>
            <div>
              <p className={`lg:text-3xl text-gray-900 sm:text-2xl font-medium`}>
                {props.teamName}
              </p>
              <p>
                {meta.description}
              </p>
            </div>
          </div>
        </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={['Projects']}
        />
      </div>
    </section>
  );
}
