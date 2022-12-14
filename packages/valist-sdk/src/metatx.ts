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

const functionIDMapPolygon: Record<string, string> = {
  'addAccountMember': 'c1729f2a-9506-4b22-9138-a95a17ce47af',
  'addProjectMember': 'a980b5e1-4819-42be-a49f-9c1747cf8d05',
  'approveRelease': '301f41c9-8087-4d57-bc5b-29e1ed6db644',
  'createAccount': '41541ef8-dce6-4aaf-9cb1-115be68eb73e',
  'createProject': '943a1019-428d-4ef9-a8cf-04dfab6db639',
  'createRelease': 'f9414c87-d41b-4b3a-94c4-a6046250a845',
  'removeAccountMember': '45b06907-6086-4e69-89b2-92698b436063',
  'removeProjectMember': '85eef2f4-24c7-4a1a-ac09-e833440d0531',
  'revokeRelease': '6bd7a911-d6b8-4f90-9bb4-13cd89a3dc3c',
  'setAccountMetaURI': '02162d2d-4832-45c4-8826-c52a99679751',
  'setProjectMetaURI': '3c1956c7-3d6e-4764-8704-83e84ae0b519',
};

const functionIDMapMumbai: Record<string, string> = {
  'addAccountMember': '56912eec-511f-432a-9747-9feaf947ab8d',
  'addProjectMember': '80191ad6-ed10-462d-8cc3-f52f20d7df84',
  'approveRelease': '3cb3ff68-ef7b-4b70-a773-d7bad0347894',
  'createAccount': 'b3f7b13a-722f-437a-b416-e735f82ad114',
  'createProject': '9249eb1f-c9a3-489c-9e43-999c91224d4d',
  'createRelease': '8de50c88-b1e0-48cd-be94-999027374692',
  'removeAccountMember': '10341a14-da5c-48bf-a823-a2e0bd459c33',
  'removeProjectMember': 'd83d318a-2239-4bf6-abef-5cfe6312a66c',
  'revokeRelease': '0cb27135-72a9-41b4-9666-301fca43f62f',
  'setAccountMetaURI': '69cca256-ad9a-4dcd-8275-8d63364bd164',
  'setProjectMetaURI': '8deb7a85-93eb-40ca-b192-8c3b41608210',
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

// biconomy public api keys
const polygonAPI = '9Jk9qeZLi.56894f4d-0437-47c1-b9da-16b269c7bab7';
const mumbaiAPI = 'qLW9TRUjQ.f77d2f86-c76a-4b9c-b1ee-0453d0ead878';

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
  return txResp.hash;
};

const sendMetaTx = async (
    provider: ethers.providers.Web3Provider,
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

    console.log('network ID', networkID, forwarder, request)
  
    const domainSeparator = getDomainSeperator(networkID);
    const dataToSign = getDataToSignForEIP712(request, networkID);
  
    const sig = await provider.send('eth_signTypedData_v3', [account, dataToSign]);
  
    const resp = await fetch('https://api.biconomy.io/api/v2/meta-tx/native', {
      method: 'POST',
      headers: {
        // public biconomy key
        'x-api-key': networkID == 80001 ? mumbaiAPI : polygonAPI,
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        to: tx.to,
        apiId: networkID == 80001 ? functionIDMapMumbai[functionName] : functionIDMapPolygon[functionName],
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