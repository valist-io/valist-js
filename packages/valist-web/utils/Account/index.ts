import { LoginType } from './types';
import { Client, Contract, Storage } from '@valist/sdk';

export const checkLoggedIn = (required:boolean, loginType:LoginType) => {
  if (required) {
    return (loginType !== 'readOnly') ? true : false;
  }
  return true;
};

export function createValistClient(provider: Contract.EVM_Provider) {
  const chainID = 137;
  const metaTx = true;
  const ipfsGateway = 'https://gateway.valist.io';
  const pinataJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIwZWQ5M2NjNy1mMjI3LTRjNTAtOTZjMS1jYThiOTYxODViOTEiLCJlbWFpbCI6ImFsZWNAdmFsaXN0LmlvIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZX0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjM3MGVjNWE2M2Y5ZmRiNjIwNzBlIiwic2NvcGVkS2V5U2VjcmV0IjoiZGNlMTE1Y2I2NWMwNWJiNmUzZmU4NGVkMWY0N2IxYjczYzEwYTBhNWJhZDk3YTYxOWYzZDk2MWFmNGEyY2E4NCIsImlhdCI6MTY0NjM3MTMyOX0.rEsRZzy2choMl4GXqt1H9pXl4Lp0rAZJJCBNenu-PcM"

  const options = new Contract.EVM_Options(chainID, metaTx);
  const contract = new Contract.EVM(options, provider);
  const storage = new Storage.Pinata(pinataJWT, ipfsGateway);
  return new Client(contract, storage);
}