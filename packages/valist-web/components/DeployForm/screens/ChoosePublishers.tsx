import { publishTypes } from "../DeployForm";
import { LogoButton } from "../LogoButton";
interface ChoosePublishersProps {
  pending: string[];
  setPending: (value: string[]) => void;
}

export function ChoosePublishers(props: ChoosePublishersProps):JSX.Element {
  const togglePublisher = (publisher: string) => props.pending.includes(publisher) ? props.setPending(props.pending.filter((p) => p !== publisher)) : props.setPending([...props.pending, publisher]);
  const isActive = (publisher: string) => props.pending.includes(publisher);

  return (
    <section>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '0 auto' }}>
      {Object.keys(publishTypes).map((publisher) => (
        <LogoButton
          key={publisher} 
          active={isActive(publisher)}
          disabled={publisher !== 'Valist Protocol'}
          image={publishTypes[publisher].icon} 
          onClick={() => togglePublisher(publisher)}
          text={publisher} 
        />
      ))}
      </div>
    </section>
  );
};