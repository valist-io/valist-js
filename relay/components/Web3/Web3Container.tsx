// import useState next to FunctionComponent
import React, { FunctionComponent, useState, useEffect  } from 'react';
import getValistContract from 'valist/dist/getValistContract';
import getValistOrganizationContract from 'valist/dist/getValistOrganizationContract'
import Web3Modal from "web3modal";
import { Web3 } from 'valist';

export const Web3Container:FunctionComponent<any> = () => {

    const providerOptions = {
        /* See Provider Options Section */
    };

    const [contract, setContract] = useState(null);
    const [provider, setProvider] = useState(null)
    const [web3, setWeb3] = useState(null)
    const [contractOutput, setContractOutput] = useState(null)
    const [organizationContractOutput, setOrganizationContractOutput] = useState(null)

    useEffect(() => {
        async function connectWeb3() {
            try {
                const web3Modal = new Web3Modal({
                    network: "mainnet", // optional
                    cacheProvider: true, // optional
                    providerOptions // required
                });
                
                const provider = await web3Modal.connect();
                const web3 = Web3(provider);
                const contract = await getValistContract(web3);
                const organization = await contract.methods.orgs("Akashic tech").call()
                const organizationContract = await getValistOrganizationContract(web3, organization)
                console.log( await organizationContract.methods.orgMeta.call())

                setContract(contract)
                setProvider(provider)
                setWeb3(web3)

                setContractOutput(organization)
                // setOrganizationContractOutput(orgOutput)
                
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`
                )
                console.log(error)
            }
        }
        connectWeb3()
    }, [])

    return (
        <div>
            {JSON.stringify(contractOutput)}
        </div>
    )
}