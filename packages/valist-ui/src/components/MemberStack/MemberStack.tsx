import { Identicon } from '../Identicon';
import { Address } from '../Address';

export interface MemberStackProps {
  limit: number;
  members: string[];
}

export function MemberStack(props: MemberStackProps) {
  return (
    <div style={{ display: 'flex' }}>
      {props.members.slice(0, props.limit).map((member, index) =>
        <Identicon key={index} value={member} stack={index !== 0} />
      )}
      {props.members.length === 1 &&
        <Address address={props.members[0]} style={{ marginLeft: 8 }} truncate />
      }
    </div>
  );
}

MemberStack.defaultProps = {
  limit: 5,
};