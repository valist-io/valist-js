import { Title } from '@mantine/core';
import { Activity, Card, List } from '@valist/ui';
import { ActivityText, ActivityTextProps } from '@/components/ActivityText';

export interface ActivityCardProps {
  logs: ActivityTextProps[];
}

export function ActivityCard(props: ActivityCardProps) {
  return (
    <Card>
      <Title order={5}>Recent Activity</Title>
      <List style={{ marginTop: 24 }}>
        {props.logs.slice(0, 4).map((log: any, index: number) => 
          <Activity key={index} sender={log.sender}>
            <ActivityText {...log} />
          </Activity>
        )}
      </List>
    </Card>
  );
}