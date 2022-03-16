import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers';
import { ethers, PopulatedTransaction } from 'ethers';

const biconomyForwarderAbi = [{'inputs':[{'internalType':'address','name':'_owner','type':'address'}],'stateMutability':'nonpayable','type':'constructor'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'bytes32','name':'domainSeparator','type':'bytes32'},{'indexed':false,'internalType':'bytes','name':'domainValue','type':'bytes'}],'name':'DomainRegistered','type':'event'},{'anonymous':false,'inputs':[{'indexed':true,'internalType':'address','name':'previousOwner','type':'address'},{'indexed':true,'internalType':'address','name':'newOwner','type':'address'}],'name':'OwnershipTransferred','type':'event'},{'inputs':[],'name':'EIP712_DOMAIN_TYPE','outputs':[{'internalType':'string','name':'','type':'string'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'REQUEST_TYPEHASH','outputs':[{'internalType':'bytes32','name':'','type':'bytes32'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'bytes32','name':'','type':'bytes32'}],'name':'domains','outputs':[{'internalType':'bool','name':'','type':'bool'}],'stateMutability':'view','type':'function'},{'inputs':[{'components':[{'internalType':'address','name':'from','type':'address'},{'internalType':'address','name':'to','type':'address'},{'internalType':'address','name':'token','type':'address'},{'internalType':'uint256','name':'txGas','type':'uint256'},{'internalType':'uint256','name':'tokenGasPrice','type':'uint256'},{'internalType':'uint256','name':'batchId','type':'uint256'},{'internalType':'uint256','name':'batchNonce','type':'uint256'},{'internalType':'uint256','name':'deadline','type':'uint256'},{'internalType':'bytes','name':'data','type':'bytes'}],'internalType':'structERC20ForwardRequestTypes.ERC20ForwardRequest','name':'req','type':'tuple'},{'internalType':'bytes32','name':'domainSeparator','type':'bytes32'},{'internalType':'bytes','name':'sig','type':'bytes'}],'name':'executeEIP712','outputs':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'ret','type':'bytes'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'components':[{'internalType':'address','name':'from','type':'address'},{'internalType':'address','name':'to','type':'address'},{'internalType':'address','name':'token','type':'address'},{'internalType':'uint256','name':'txGas','type':'uint256'},{'internalType':'uint256','name':'tokenGasPrice','type':'uint256'},{'internalType':'uint256','name':'batchId','type':'uint256'},{'internalType':'uint256','name':'batchNonce','type':'uint256'},{'internalType':'uint256','name':'deadline','type':'uint256'},{'internalType':'bytes','name':'data','type':'bytes'}],'internalType':'structERC20ForwardRequestTypes.ERC20ForwardRequest','name':'req','type':'tuple'},{'internalType':'bytes','name':'sig','type':'bytes'}],'name':'executePersonalSign','outputs':[{'internalType':'bool','name':'success','type':'bool'},{'internalType':'bytes','name':'ret','type':'bytes'}],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'address','name':'from','type':'address'},{'internalType':'uint256','name':'batchId','type':'uint256'}],'name':'getNonce','outputs':[{'internalType':'uint256','name':'','type':'uint256'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'isOwner','outputs':[{'internalType':'bool','name':'','type':'bool'}],'stateMutability':'view','type':'function'},{'inputs':[],'name':'owner','outputs':[{'internalType':'address','name':'','type':'address'}],'stateMutability':'view','type':'function'},{'inputs':[{'internalType':'string','name':'name','type':'string'},{'internalType':'string','name':'version','type':'string'}],'name':'registerDomainSeparator','outputs':[],'stateMutability':'nonpayable','type':'function'},{'inputs':[],'name':'renounceOwnership','outputs':[],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'internalType':'address','name':'newOwner','type':'address'}],'name':'transferOwnership','outputs':[],'stateMutability':'nonpayable','type':'function'},{'inputs':[{'components':[{'internalType':'address','name':'from','type':'address'},{'internalType':'address','name':'to','type':'address'},{'internalType':'address','name':'token','type':'address'},{'internalType':'uint256','name':'txGas','type':'uint256'},{'internalType':'uint256','name':'tokenGasPrice','type':'uint256'},{'internalType':'uint256','name':'batchId','type':'uint256'},{'internalType':'uint256','name':'batchNonce','type':'uint256'},{'internalType':'uint256','name':'deadline','type':'uint256'},{'internalType':'bytes','name':'data','type':'bytes'}],'internalType':'structERC20ForwardRequestTypes.ERC20ForwardRequest','name':'req','type':'tuple'},{'internalType':'bytes32','name':'domainSeparator','type':'bytes32'},{'internalType':'bytes','name':'sig','type':'bytes'}],'name':'verifyEIP712','outputs':[],'stateMutability':'view','type':'function'},{'inputs':[{'components':[{'internalType':'address','name':'from','type':'address'},{'internalType':'address','name':'to','type':'address'},{'internalType':'address','name':'token','type':'address'},{'internalType':'uint256','name':'txGas','type':'uint256'},{'internalType':'uint256','name':'tokenGasPrice','type':'uint256'},{'internalType':'uint256','name':'batchId','type':'uint256'},{'internalType':'uint256','name':'batchNonce','type':'uint256'},{'internalType':'uint256','name':'deadline','type':'uint256'},{'internalType':'bytes','name':'data','type':'bytes'}],'internalType':'structERC20ForwardRequestTypes.ERC20ForwardRequest','name':'req','type':'tuple'},{'internalType':'bytes','name':'sig','type':'bytes'}],'name':'verifyPersonalSign','outputs':[],'stateMutability':'view','type':'function'}];

const biconomyForwarderDomainData = {
	name: 'Biconomy Forwarder',
	version: '1',
};

const domainType = [
	{ name: 'name', type: 'string' },
	{ name: 'version', type: 'string' },
	{ name: 'verifyingContract', type: 'address' },
	{ name: 'salt', type: 'bytes32' },
];

const forwardRequestType = [
	{ name: 'from', type: 'address' },
	{ name: 'to', type: 'address' },
	{ name: 'token', type: 'address' },
	{ name: 'txGas', type: 'uint256' },
	{ name: 'tokenGasPrice', type: 'uint256' },
	{ name: 'batchId', type: 'uint256' },
	{ name: 'batchNonce', type: 'uint256' },
	{ name: 'deadline', type: 'uint256' },
	{ name: 'data', type: 'bytes' },
];

/* on dashboard page, this script helps scrape these values quickly:
const table = document.getElementsByTagName('table')[0]
let functionIDMap = {}
for (let i = 1; i < table.rows.length; ++i) {
    functionIDMap[table.rows[i].children[1].textContent] = table.rows[i].children[2].textContent
}
*/
const functionIDMap: Record<string, string> = {
  'addProjectMember': '0f0b5bc4-406f-4935-839b-10b4874d2467',
  'addTeamMember': '11bbda4c-ad7b-4bca-a117-b87b2a1a7a85',
  'approveRelease': '9557bd7e-088c-44fc-a9a4-26d0a90a6958',
  'createProject': '6e1c96cb-8df6-4a1e-b1b4-a9333891cd97',
  'createRelease': 'becea6b7-0d29-438a-ab4d-908ddc2d6de5',
  'createTeam': 'f671e0a9-6177-44f6-bff1-608858a8d845',
  'rejectRelease': '5369c7e3-2b01-43d9-88a9-96e94631014e',
  'removeProjectMember': 'e876f70d-a1a8-4a96-b0db-aa8ab8a6462f',
  'removeTeamMember': 'd1fbe756-7f61-47d0-a24d-15a13319f974',
  'setProjectMetaURI': 'eeab2716-4d6f-4e36-95f1-0114d39f5ab8',
  'setTeamBeneficiary': '3c000312-09e1-4329-a664-cff59b868c0b',
  'setTeamMetaURI': 'e3bac177-e3f2-4e29-901e-a5614830f5f3',
  'createLicense': '9fd3f38c-5d54-40e3-861a-7c6134f1d174',
  'mintLicense': 'e40098f1-0e12-4a04-af14-00550f26bded'
};

// pass the networkId to get GSN forwarder contract addresses
const getContractAddresses = (networkId: number) => {
	const addressMap: Record<number, string> = {
		80001: '0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b',
		137: '0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8',
		1: '0x84a0856b038eaAd1cC7E297cF34A7e72685A8693',
	};
	const contractAddresses: any = {};
	contractAddresses.biconomyForwarderAddress = addressMap[networkId || 80001];
	return contractAddresses;
};

/**
 * Returns ABI and contract address based on network Id
 * You can build biconomy forwarder contract object using above values and calculate the nonce
 * @param {*} networkId
 */
 const getBiconomyForwarderConfig = (networkId: number) => {
	// get trusted forwarder contract address from network id
	const contractAddresses = getContractAddresses(networkId);
	const forwarderAddress = contractAddresses.biconomyForwarderAddress;
	return { abi: biconomyForwarderAbi, address: forwarderAddress };
  };

/**
 * pass the below params in any order e.g. account=<account>,batchNone=<batchNone>,...
 * @param {*}  account - from (end user's) address for this transaction
 * @param {*}  to - target recipient contract address
 * @param {*}  gasLimitNum - gas estimation of your target method in numeric format
 * @param {*}  batchId - batchId
 * @param {*}  batchNonce - batchNonce which can be verified and obtained from the biconomy forwarder
 * @param {*}  data - functionSignature of target method
 * @param {*}  deadline - optional deadline for this forward request
 */
const buildForwardTxRequest = ({
  account, to, gasLimitNum, batchId, batchNonce, data, deadline,
}: any) => {
  const req = {
    from: account,
    to,
    token: ethers.constants.AddressZero,
    txGas: gasLimitNum,
    tokenGasPrice: '0',
    batchId: parseInt(batchId),
    batchNonce: parseInt(batchNonce),
    deadline: deadline || Math.floor(Date.now() / 1000 + 3600),
    data,
  };
  return req;
};

/**
 * pass your forward request and network Id
 * use this method to build message to be signed by end user in EIP712 signature format
 * @param {*} request - forward request object
 * @param {*} networkId
 */
const getDataToSignForEIP712 = (request: any, networkId: number) => {
  const contractAddresses = getContractAddresses(networkId);
  const forwarderAddress = contractAddresses.biconomyForwarderAddress;
  const domainData: any = biconomyForwarderDomainData;
  domainData.salt = ethers.utils.hexZeroPad((ethers.BigNumber.from(networkId)).toHexString(), 32);
  domainData.verifyingContract = forwarderAddress;

  const dataToSign = JSON.stringify({
    types: {
      EIP712Domain: domainType,
      ERC20ForwardRequest: forwardRequestType,
    },
    domain: domainData,
    primaryType: 'ERC20ForwardRequest',
    message: request,
  });
  return dataToSign;
};

/**
 * get the domain seperator that needs to be passed while using EIP712 signature type
 * @param {*} networkId
 */
const getDomainSeperator = (networkId: number) => {
  const contractAddresses = getContractAddresses(networkId);
  const forwarderAddress = contractAddresses.biconomyForwarderAddress;
  const domainData: any = biconomyForwarderDomainData;
  domainData.salt = ethers.utils.hexZeroPad((ethers.BigNumber.from(networkId)).toHexString(), 32);
  domainData.verifyingContract = forwarderAddress;

  const domainSeparator = ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode([
        'bytes32',
        'bytes32',
        'bytes32',
        'address',
        'bytes32'
    ], [
        ethers.utils.id('EIP712Domain(string name,string version,address verifyingContract,bytes32 salt)'),
        ethers.utils.id(domainData.name),
        ethers.utils.id(domainData.version),
        domainData.verifyingContract,
        domainData.salt,
    ]));
    
    return domainSeparator;
};

const sendTx = async (
    provider: Web3Provider | JsonRpcProvider,
    functionName: string,
    tx: PopulatedTransaction,
): Promise<string> => {
  tx.gasLimit = await provider.estimateGas(tx);
  tx.gasPrice = await provider.getGasPrice();

  const gasLimit = tx.gasLimit.toHexString();
  const gasPrice = tx.gasPrice.toHexString();
  const value = tx.value ? tx.value.toHexString() : '0x0';

  const txResp = await provider.send('eth_sendTransaction', [{...tx, gasLimit, gasPrice, value}]);
  return txResp;
};

const sendMetaTx = async (
    provider: Web3Provider | JsonRpcProvider,
    functionName: string,
    tx: PopulatedTransaction,
): Promise<string> => {
    const account = tx.from;
    const networkID = await provider.getSigner().getChainId();
    const forwarder = getBiconomyForwarderConfig(networkID);
    const forwarderContract = new ethers.Contract(forwarder.address, forwarder.abi, provider);
    const batchNonce = await forwarderContract.getNonce(account, 0);
    const gasLimit = Number(await provider.estimateGas(tx));
  
    const request = buildForwardTxRequest({
      account,
      to: tx.to,
      gasLimitNum: gasLimit,
      batchId: 0,
      batchNonce,
      data: `${tx.data}`,
      deadline: '',
    });
  
    const domainSeparator = getDomainSeperator(networkID);
    const dataToSign = getDataToSignForEIP712(request, networkID);
  
    const sig = await provider.send('eth_signTypedData_v4', [account, dataToSign]);
  
    const resp = await fetch('https://api.biconomy.io/api/v2/meta-tx/native', {
      method: 'POST',
      headers: {
        // public biconomy key
        'x-api-key': '9Jk9qeZLi.56894f4d-0437-47c1-b9da-16b269c7bab7',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        to: tx.to,
        apiId: functionIDMap[functionName],
        params: [request, domainSeparator, sig],
        from: account,
        signatureType: 'EIP712_SIGN',
      }),
    });
  
    const txResp = await resp.json();
    console.log('Biconomy response', txResp);
    return txResp['txHash'];
};

export {
    sendTx,
    sendMetaTx,
};