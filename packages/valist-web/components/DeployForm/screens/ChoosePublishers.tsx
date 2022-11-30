import { publishTypes } from "../DeployForm";
import { useState } from "react";
import { LogoButton } from "../LogoButton";

export function ChoosePublishers():JSX.Element {
  const [pending, setPending] = useState<string[]>([]);

  const togglePublisher = (publisher: string) => pending.includes(publisher) ? setPending(pending.filter((p) => p !== publisher)) : setPending([...pending, publisher]);
  const isActive = (publisher: string) => pending.includes(publisher);

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