import { useEffect, useState } from "react";
import { SetUseState } from "../../utils/Account/types";
import { truncate } from "../../utils/Formatting/truncate";
import AddressIdenticon from "../Identicons/AddressIdenticon";
import Tabs from "../Tabs";

interface HomepageProfileCardProps {
  address: string,
  view: string,
  setView: SetUseState<string>,
  resolveEns: (address: string) => Promise<string | null>
}

export default function HomepageProfileCard(props:HomepageProfileCardProps) {
  const [ens, setEns] = useState<string | null>();
  useEffect(() => {
    (async () => {
      let value = null;
      try {
         value = await props.resolveEns(props.address);
      } catch (err) {}
        setEns(value);
    })();
  }, [props, props.address]);

  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="bg-white pt-6 px-6">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex sm:space-x-5 mr-10">
              <div className="flex-shrink-0">
                <AddressIdenticon address={props.address} height={85} width={85} />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                <a target="_blank" rel="noopener noreferrer" 
                  href={`https://polygonscan.com/address/${props.address}`} 
                  className="sm:text-xl lg:text-3xl font-bold text-gray-900 hover:text-indigo-500">
                  {ens || truncate(props.address, 8)}
                </a>
                <p className="lg:text-sm font-medium text-gray-600 hidden md:block">
                  {props.address}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={['Projects', 'Licenses', 'Activity']}
        />
      </div>
    </section>
  );
}