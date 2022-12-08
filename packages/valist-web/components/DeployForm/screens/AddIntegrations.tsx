import { integrations } from "../DeployForm";
import { useState } from "react";
import { LogoButton } from "../LogoButton";

export function AddIntegrations():JSX.Element {
  const [pending, setPending] = useState<string[]>([]);

  const toggleIntegration = (integration: string) => pending.includes(integration) ? setPending(pending.filter((p) => p !== integration)) : setPending([...pending, integration]);
  const isActive = (publisher: string) => pending.includes(publisher);

  return (
    <section>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '0 auto' }}>
      {Object.keys(integrations).map((integration) => (
        <LogoButton
          key={integration} 
          active={isActive(integration)}
          disabled={true}
          image={integrations[integration].icon} 
          onClick={() => toggleIntegration(integration)}
          text={integration} 
        />
      ))}
      </div>
    </section>
  );
};