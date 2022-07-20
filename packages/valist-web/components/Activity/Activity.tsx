import React from 'react';
import { useNetwork } from 'wagmi';
import { Anchor } from '@mantine/core';

import { 
  Activity as ActivityUI,
  Address,
} from '@valist/ui';

export interface ActivityProps {
  id: string;
  type: string;
  sender: string;
  member?: string;
  account?: { name: string };
  project?: { name: string };
  release?: { name: string };
}

export function Activity(props: ActivityTextProps) {
  const { chain } = useNetwork();

  const account = props.account?.name;
  const project = props.project?.name;
  const release = props.release?.name;

  const accountURL = `/${account}`;
  const projectURL = `/${account}/${project}`;
  const releaseURL = `/${account}/${project}/${release}`;

  const href = getBlockExplorer(chain?.id, props.id);
  const children = () => {
    switch (props.type) {
      case 'AccountCreated':
        return <React.Fragment>Created account <Anchor href={accountURL}>{account}</Anchor></React.Fragment>;
      case 'AccountUpdated':
        return <React.Fragment>Updated account <Anchor href={accountURL}>{account}</Anchor></React.Fragment>;
      case 'AccountMemberAdded':
        return <React.Fragment>Added account member <Address address={props.member} size={14} truncate /></React.Fragment>;
      case 'AccountMemberRemoved':
        return <React.Fragment>Removed account member <Address address={props.member} size={14} truncate /></React.Fragment>;
      case 'ProjectCreated':
        return <React.Fragment>Created project <Anchor href={projectURL}>{project}</Anchor></React.Fragment>;
      case 'ProjectUpdated':
        return <React.Fragment>Updated project <Anchor href={projectURL}>{project}</Anchor></React.Fragment>;
      case 'ProjectMemberAdded':
        return <React.Fragment>Added <Address address={props.member} size={14} truncate /> to project <a href={projectURL}>{project}</a></React.Fragment>;
      case 'ProjectMemberRemoved':
        return <React.Fragment>Removed <Address address={props.member} size={14} truncate /> from project <a href={projectURL}>{project}</a></React.Fragment>;
      case 'ReleaseCreated':
        return <React.Fragment>Created release <Anchor href={releaseURL}>{release}</Anchor></React.Fragment>;
      case 'ReleaseApproved':
        return <React.Fragment>Approved release <Anchor href={releaseURL}>{release}</Anchor></React.Fragment>;
      case 'ReleaseRejected':
        return <React.Fragment>Rejected release <Anchor href={releaseURL}>{release}</Anchor></React.Fragment>;
      case 'PriceChanged':
        return <React.Fragment>Price changed for <Anchor href={projectURL}>{project}</Anchor></React.Fragment>;
      case 'LimitChanged':
        return <React.Fragment>Limit changed for <Anchor href={projectURL}>{project}</Anchor></React.Fragment>;
      case 'RoyaltyChanged':
        return <React.Fragment>Royalty changed for <Anchor href={projectURL}>{project}</Anchor></React.Fragment>;
      case 'ProductPurchased':
        return <React.Fragment>Purchase on <Anchor href={projectURL}>{project}</Anchor></React.Fragment>;
      default:
        return <React.Fragment></React.Fragment>;
    }
  };

  return (
    <ActivityUI sender={props.sender} href={href}>
      {children()}
    </ActivityUI>
  );
}

function getBlockExplorer(chainId?: number, id: string) {
  const hash = id.split('-')[0];
  switch (chainId) {
    case 1:
      return `https://etherscan.com/tx/${hash}`;
    case 137:
      return `https://polygonscan.com/tx/${hash}`;
    case 80001:
      return `https://mumbai.polygonscan.com/tx/${hash}`;
    default:
      return `https://polygonscan.com/tx/${hash}`;
  }
}
