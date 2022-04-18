import React from 'react';
import { Log } from '../../utils/Apollo/types';
import { truncate } from "../../utils/Formatting/truncate";

interface LogTextProps {
  log: Log
}

export default function LogText(props: LogTextProps) {
  switch (props.log.type) {
    case 'TeamCreated':
      return <React.Fragment>Created team <a href={`/${props.log.team}`} className="font-medium">{props.log.team}</a></React.Fragment>;
    case 'TeamUpdated':
      return <React.Fragment>Updated team <a href={`/${props.log.team}`} className="font-medium">{props.log.team}</a></React.Fragment>;
    case 'TeamMemberAdded':
      return <React.Fragment>Added {truncate(props.log.member, 8)} to team <a href={`/${props.log.team}`} className="font-medium">{props.log.team}</a></React.Fragment>;
    case 'TeamMemberRemoved':
      return <React.Fragment>Removed {truncate(props.log.member, 8)} from team <a href={`/${props.log.team}`} className="font-medium">{props.log.team}</a></React.Fragment>;
    case 'ProjectCreated':
      return <React.Fragment>Created project <a href={`/${props.log.team}/${props.log.project}`} className="font-medium">{props.log.project}</a></React.Fragment>;
    case 'ProjectUpdated':
      return <React.Fragment>Updated project <a href={`/${props.log.team}/${props.log.project}`} className="font-medium">{props.log.project}</a></React.Fragment>;
    case 'ProjectMemberAdded':
      return <React.Fragment>Added {truncate(props.log.member, 8)} to project <a href={`/${props.log.team}/${props.log.project}`} className="font-medium">{props.log.project}</a></React.Fragment>;
    case 'ProjectMemberRemoved':
      return <React.Fragment>Removed {truncate(props.log.member, 8)} from project <a href={`/${props.log.team}/${props.log.project}`} className="font-medium">{props.log.project}</a></React.Fragment>;
    case 'ReleaseCreated':
      return <React.Fragment>Created release <a href={`/${props.log.team}/${props.log.project}/${props.log.release}`} className="font-medium">{props.log.release}</a></React.Fragment>;
    case 'ReleaseApproved':
      return <React.Fragment>Approved release <a href={`/${props.log.team}/${props.log.project}/${props.log.release}`} className="font-medium">{props.log.release}</a></React.Fragment>;
    case 'ReleaseRejected':
      return <React.Fragment>Rejected release <a href={`/${props.log.team}/${props.log.project}/${props.log.release}`} className="font-medium">{props.log.release}</a></React.Fragment>;
    default:
      return <React.Fragment></React.Fragment>;
  }
}