import Link from "next/link";
import { SetUseState } from "../../utils/Account/types";
import { truncate } from "../../utils/Formatting/truncate";
import EnsResolver from "../Ens";
import AddressIdenticon from "../Identicons/AddressIdenticon";
import Tabs from "../Tabs";

interface HomepageProfileCardProps {
  address: string,
  view: string,
  setView: SetUseState<string>,
}

export default function HomepageProfileCard(props:HomepageProfileCardProps) {
  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white overflow-hidden shadow">
        <div className="bg-white pt-6 px-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5">
              <div className="flex-shrink-0">
                <AddressIdenticon address={props.address} height={85} />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">Welcome back,</p>
                <a target="_blank" rel="noopener noreferrer" 
                  href={`https://polygonscan.com/address/${props.address}`} 
                  className="sm:text-xl lg:text-3xl font-bold text-gray-900 hover:text-indigo-500">
                  {EnsResolver({address: props.address}) || truncate(props.address, 8)}
                </a>
                <p className="lg:text-sm font-medium text-gray-600 hidden md:block">
                  {props.address}
                </p>
              </div>
            </div>

            <div style={{marginTop: 30}} className="mr-10 flex content-end sm:mt-0">
              <Link href="create?action=release">
                <a className="flex justify-center items-center px-4 py-2 border
                border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Publish Release
                </a>
              </Link>
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
  )
}