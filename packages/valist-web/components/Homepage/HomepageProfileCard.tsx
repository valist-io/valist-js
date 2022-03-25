import { useContext, useEffect, useState } from "react";
import { SetUseState } from "../../utils/Account/types";
import { truncate } from "../../utils/Formatting/truncate";
import AccountContext from "../Accounts/AccountContext";
import AccountPicker from "../Accounts/AccountPicker";
import AddressIdenticon from "../Identicons/AddressIdenticon";
import Tabs from "../Tabs";

interface HomepageProfileCardProps {
  isProjects: boolean;
  isTeams: boolean;
  isLicenses: boolean;
  address: string;
  view: string;
  accountNames: string[];
  userAccount: string;
  setUserAccount: SetUseState<string>;
  setView: SetUseState<string>;
  reverseEns: (address: string) => Promise<string | null>;
}

export default function HomepageProfileCard(props:HomepageProfileCardProps) {
  const { address, reverseEns } = props;
  const [ens, setEns] = useState<string | null>();
  const accountCtx = useContext(AccountContext);
  const tabs = [
    {
      text: 'Projects',
      disabled: true,
    },
    {
      text: 'Licenses',
      disabled: true,
    },
    {
      text: 'Activity',
      disabled: true,
    },
  ];

  if (props.isTeams) {
    tabs[2].disabled = false;
  }

  if (props.isProjects) {
    tabs[0].disabled = false;
  }

  if (props.isLicenses) {
    tabs[1].disabled = false;
  }

  useEffect(() => {
    (async () => {
      let value = null;

      if (accountCtx.address !== '0x0') {
        try {
          value = await reverseEns(accountCtx.address);
        } catch (err) {}
      }

      setEns(value);
    })();
  }, [accountCtx.address, reverseEns]);

  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white shadow">
        <div className="bg-white pt-6 px-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5 mr-10">
              <div className="flex-shrink-0">
                <AddressIdenticon address={props.address} height={85} width={85} />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">Connected with,</p>
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
            <div className="mt-5 flex justify-center sm:mt-0">
              <AccountPicker 
                accountNames={props.accountNames} 
                userAccount={props.userAccount} 
                setUserAccount={props.setUserAccount} 
              />
            </div>
          </div>
        </div>
        <Tabs 
          setView={props.setView}
          view={props.view}
          tabs={tabs}
        />
      </div>
    </section>
  );
}