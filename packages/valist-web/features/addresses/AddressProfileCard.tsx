import Link from "next/link";
import { SetUseState } from "../../utils/Account/types";
import { truncate } from "../../utils/Formatting/truncate";
import AddressIdenticon from "../../components/Identicons/AddressIdenticon";
import Tabs from "../../components/Tabs";
import { useContext, useEffect, useState } from "react";
import Web3Context from "../valist/Web3Context";

interface AddressProfileCardProps {
  address: string,
  view: string,
  setView: SetUseState<string>,
}

export default function AddressProfileCard(props: AddressProfileCardProps) {
  const web3Ctx = useContext(Web3Context);
  const [ens, setEns] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let value = null;

      if (props.address !== '0x0') {
        try {
          value = await web3Ctx.reverseEns(props.address);
        } catch (err) {}
      }

      setEns(value);
    })();
  }, [props.address, web3Ctx.reverseEns]);
  
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
                      {ens || truncate(props.address, 8)}
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
          tabs={[{ text: 'Projects', disabled:false }]}
        />
      </div>
    </section>
  );
}