import { BigNumberish, ethers } from "ethers";
import { useState } from "react";
import QRCode from "react-qr-code";
import { truncate } from '../../utils/Formatting/truncate';

interface DonateformProps {
  address: string,
}

export default function Donateform(props: DonateformProps) {
  const [donation, setDonation] = useState<BigNumberish>(0);

  const handleDonation = (value:string) => {
    if (value === undefined || value === '') {
      value = '0';
    }
    
    const donationInWei = ethers.utils.parseEther(value);
    setDonation(donationInWei);
  };

  const donate = () => {
    console.log('Donating', donation);
  };

  return (
    <div>
      <QRCode value={props.address} />
      <p className="text-xl py-4">{truncate(props.address, 10)}</p>
      <div>
        <div className="mt-1 flex">
          <input
            id="donation"
            name="donation"
            type="number"
            onChange={(e) => handleDonation(e.target.value.toString())}
            required
            className="inline-flex appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
            placeholder=".001"
          />
          <div className='inline-flex justify-center py-2 px-4 border border-transparent 
          shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            onClick={() => donate()}>
            Donate
          </div>
        </div>
      </div>
    </div>
  );
}