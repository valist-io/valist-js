import React from 'react';
import { Log } from '../../utils/Apollo/types';
import { truncate } from "../../utils/Formatting/truncate";

interface LogTextProps {
  log: Log
}

export default function LogText(props: LogTextProps) {
  switch (props.log.type) {
    case 'AccountCreated':
      return <React.Fragment>Created account <a href={`/${props?.log?.account?.name}`} className="font-medium">{props?.log?.account?.name}</a></React.Fragment>;
    case 'AccountUpdated':
      return <React.Fragment>Updated account <a href={`/${props.log.account?.name}`} className="font-medium">{props.log.account?.name}</a></React.Fragment>;
    case 'AccountMemberAdded':
      return <React.Fragment>Added {truncate(props.log.member || '', 8)} to account <a href={`/${props.log.account?.name}`} className="font-medium">{props?.log?.account?.name}</a></React.Fragment>;
    case 'AccountMemberRemoved':
      return <React.Fragment>Removed {truncate(props.log.member || '', 8)} from account <a href={`/${props.log.account?.name}`} className="font-medium">{props.log.account?.name}</a></React.Fragment>;
    case 'ProjectCreated':
      return <React.Fragment>Created project <a href={`/${props.log.project?.account.name}/${props.log.project?.name}`} className="font-medium">{props.log.project?.name}</a></React.Fragment>;
    case 'ProjectUpdated':
      return <React.Fragment>Updated project <a href={`/${props.log.project?.account.name}/${props.log.project?.name}`} className="font-medium">{props.log.project?.name}</a></React.Fragment>;
    case 'ProjectMemberAdded':
      return <React.Fragment>Added {truncate(props.log.member || '', 8)} to project <a href={`/${props.log.account}/${props.log.project}`} className="font-medium">{props.log.project?.name}</a></React.Fragment>;
    case 'ProjectMemberRemoved':
      return <React.Fragment>Removed {truncate(props.log.member || '', 8)} from project <a href={`/${props.log.account}/${props.log.project}`} className="font-medium">{props.log.project?.name}</a></React.Fragment>;
    case 'ReleaseCreated':
      return <React.Fragment>Created release <a href={`/${props.log.project?.account.name}/${props.log.project?.name}/`} className="font-medium">{props.log?.release?.name}</a></React.Fragment>;
    case 'ReleaseApproved':
      return <React.Fragment>Approved release <a href={`/${props.log.account}/${props.log.project?.name}/${props.log.release?.name}`} className="font-medium">{props.log.release?.name}</a></React.Fragment>;
    case 'ReleaseRejected':
      return <React.Fragment>Rejected release <a href={`/${props.log.account}/${props.log.project?.name}/${props.log.release?.name}`} className="font-medium">{props.log.release?.name}</a></React.Fragment>;
    case 'Connected':
      return <React.Fragment>Connected wallet <div className="font-medium inline-block">{props.log.sender}</div></React.Fragment>;
    default:
      return <React.Fragment></React.Fragment>;
  }
}