import { useContext, useEffect, useState } from "react";
import { SetUseState } from "../../utils/Account/types";
import { truncate } from "../../utils/Formatting/truncate";
import AccountPicker from "../accounts/AccountPicker";
import AddressIdenticon from "../../components/Identicons/AddressIdenticon";
import Tabs from "../../components/Tabs";
import { useAppSelector } from "../../app/hooks";
import { selectAddress } from "../accounts/accountsSlice";
import Web3Context from "../valist/Web3Context";

interface HomepageProfileCardProps {
  isProjects: boolean;
  isTeams: boolean;
  isLicenses: boolean;
  view: string;
  accountNames: string[];
  userAccount: string;
  setView: SetUseState<string>;
}

export default function HomepageProfileCard(props:HomepageProfileCardProps) {
  const web3Ctx = useContext(Web3Context);
  const address = useAppSelector(selectAddress);
  const [ens, setEns] = useState<string | null>();
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

      if (address !== '0x0') {
        try {
          value = await web3Ctx.reverseEns(address);
        } catch (err) {}
      }

      setEns(value);
    })();
  }, [address, web3Ctx.reverseEns]);

  return (
    <section aria-labelledby="profile-overview-title">
      <div className="rounded-lg bg-white shadow">
        <div className="bg-white pt-6 px-6">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex sm:space-x-5 mr-10">
              <div className="flex-shrink-0">
                <AddressIdenticon address={address} height={85} width={85} />
              </div>
              <div className="mt-4 text-center sm:mt-0 sm:pt-1 sm:text-left">
                <p className="text-sm font-medium text-gray-600">Connected with,</p>
                <a target="_blank" rel="noopener noreferrer" 
                  href={`https://polygonscan.com/address/${address}`} 
                  className="sm:text-xl lg:text-3xl font-bold text-gray-900 hover:text-indigo-500">
                  {ens || truncate(address, 8)}
                </a>
                <p className="lg:text-sm font-medium text-gray-600 hidden md:block">
                  {address}
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-center sm:mt-0">
              <AccountPicker 
                accountNames={props.accountNames} 
                userAccount={props.userAccount} 
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