import Link from "next/link";
import { SetUseState } from "../../utils/Account/types";
import { truncate } from "../../utils/Formatting/truncate";
import EnsResolver from "../Ens";
import AddressIdenticon from "../Identicons/AddressIdenticon";
import Tabs from "../Tabs";

interface AddressProfileCardProps {
  address: string,
  view: string,
  setView: SetUseState<string>,
}

export default function AddressProfileCard(props: AddressProfileCardProps) {
  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="bg-white px-6 pt-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <AddressIdenticon address={props.address} height={80} width={80}/>
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left align-middle">
                <Link href={`https://polygonscan.com/address/${props.address}`} >
                  <a className="cursor-pointer hover:text-indigo-500" rel="noreferrer" target="_blank">
                    <p className="lg:text-3xl font-bold text-gray-900 sm:text-xl hover:text-indigo-500">
                      {EnsResolver({ address: props.address }) || truncate(props.address, 8)}
                    </p>
                  </a>
                </Link>
                <p className="lg:text-sm font-medium text-gray-600 sm:text-xl">
                  {props.address}
                </p>
              </div>
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