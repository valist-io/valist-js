import type { NextPage } from 'next';
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';

import {
  Group,
} from '@mantine/core';

import { 
  Tabs,
  Button,
} from '@valist/ui';

const Project: NextPage = () => {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive(active < 3 ? active + 1 : active);
  const prevStep = () => setActive(active > 0 ? active - 1 : active);

  return (
    <Layout>
      <Tabs active={active} onTabChange={setActive} grow>
        <Tabs.Tab label="Basic Info">
          
        </Tabs.Tab>
        <Tabs.Tab label="Descriptions">
          
        </Tabs.Tab>
        <Tabs.Tab label="Members">
          
        </Tabs.Tab>
        <Tabs.Tab label="Graphics">
          
        </Tabs.Tab>
      </Tabs>
      <Group mt="lg">
        { active > 0 && 
          <Button onClick={() => prevStep()} variant="secondary">Back</Button>
        }
        { active < 3 &&
          <Button onClick={() => nextStep()} variant="primary">Next</Button>
        }
        { active === 3 &&
          <Button>Save</Button>
        }
      </Group>
    </Layout>
  );
};

export default Project;