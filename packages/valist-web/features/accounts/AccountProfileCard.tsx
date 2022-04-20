/* eslint-disable @next/next/no-img-element */
import Tabs, { Tab } from '../../components/Tabs';
import { AccountMeta } from '../../utils/Valist/types';
import AddressIdenticon from '../../components/Identicons/AddressIdenticon';

interface TeamProfileCardProps {
  view: string,
  tabs: Tab[],
  setView: Function,
  accountName: string,
  accountImage: string,
  meta: AccountMeta,
}

export default function AccountProfileCard(props: TeamProfileCardProps): JSX.Element {
  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white pt-6 px-6 overflow-hidden shadow">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex sm:space-x-5">
            <div className="flex-shrink-0">
              {props.accountImage ? 
                <div className="flex-shrink-0 mx-auto rounded-full overflow-hidden" style={{ height: 85, width: 85 }} >
                  <img src={props.accountImage} alt="profile-image" />
                </div>
                :
                <div className="px-6">
                  <AddressIdenticon address={props.accountName} height={80} width={80} />
                </div>
              }
            </div>
            <div>
              <p className={`lg:text-3xl text-gray-900 sm:text-2xl font-medium`}>
                {props.accountName}
              </p>
              <p>
                {props.meta.description}
              </p>
            </div> 
          </div>
        </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={props.tabs}
        />
      </div>
    </section>
  );
}
