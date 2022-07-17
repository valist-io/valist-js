import { Identicon } from '../Identicon';

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
    </div>
  );
}

MemberStack.defaultProps = {
  limit: 5,
};