import React from 'react';
import { Address } from '@valist/ui'

export interface ActivityTextProps {
  type: string;
  sender: string;
  member?: string;
  account?: { name: string };
  project?: { name: string };
  release?: { name: string };
}

export function ActivityText(props: ActivityTextProps) {
  const account = props.account?.name;
  const project = props.project?.name;
  const release = props.release?.name;

  const accountURL = `/${account}`;
  const projectURL = `/${account}/${project}`;
  const releaseURL = `/${account}/${project}/${release}`;

  switch (props.type) {
    case 'AccountCreated':
      return <React.Fragment>Created account <a href={accountURL}>{account}</a></React.Fragment>;
    case 'AccountUpdated':
      return <React.Fragment>Updated account <a href={accountURL}>{account}</a></React.Fragment>;
    case 'AccountMemberAdded':
      return <React.Fragment>Added account member <Address address={props.member} truncate /></React.Fragment>;
    case 'AccountMemberRemoved':
      return <React.Fragment>Removed account member <Address address={props.member} truncate /></React.Fragment>;
    case 'ProjectCreated':
      return <React.Fragment>Created project <a href={projectURL}>{project}</a></React.Fragment>;
    case 'ProjectUpdated':
      return <React.Fragment>Updated project <a href={projectURL}>{project}</a></React.Fragment>;
    case 'ProjectMemberAdded':
      return <React.Fragment>Added <Address address={props.member} truncate /> to project <a href={projectURL}>{project}</a></React.Fragment>;
    case 'ProjectMemberRemoved':
      return <React.Fragment>Removed <Address address={props.member} truncate /> from project <a href={projectURL}>{project}</a></React.Fragment>;
    case 'ReleaseCreated':
      return <React.Fragment>Created release <a href={releaseURL}>{release}</a></React.Fragment>;
    case 'ReleaseApproved':
      return <React.Fragment>Approved release <a href={releaseURL}>{release}</a></React.Fragment>;
    case 'ReleaseRejected':
      return <React.Fragment>Rejected release <a href={releaseURL}>{release}</a></React.Fragment>;
    case 'PriceChanged':
      return <React.Fragment>Price changed for <a href={projectURL}>{project}</a></React.Fragment>;
    case 'LimitChanged':
      return <React.Fragment>Limit changed for <a href={projectURL}>{project}</a></React.Fragment>;
    case 'RoyaltyChanged':
      return <React.Fragment>Royalty changed for <a href={projectURL}>{project}</a></React.Fragment>;
    case 'ProductPurchased':
      return <React.Fragment>Purchase on <a href={projectURL}>{project}</a></React.Fragment>;
    case 'Connected':
      return <React.Fragment>Connected wallet {props.sender}</React.Fragment>;
    default:
      return <React.Fragment></React.Fragment>;
  }
}