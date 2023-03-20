import { Flex } from "@mantine/core";

export interface ActivityViewProps {
  logs: {blockTime:string}[]
}

export function ActivityView(props: ActivityViewProps) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov','Dec',];

  let grid = [...Array(52)].map(e => Array(7));

  for (const log of props.logs) {
    const date = new Date(log.blockTime);
    const day = date.getDay();
  }

  const getColor = (value: number):string => {
    if (value == 0) {
      return '#161b22'
    } else if (0 < value && value >= 5) {
      return '#006d32'
    } else if (5 < value && value >= 10) {
      return '#26a641'
    } else if (10 < value && value >= 15) {
      return '#39d353'
    } else if (15 < value && value >= 20) {
      return '#39d353'
    }
  }

	return (
    <div>
      <div>
        {months.map((month: string) => (
          <div>{month}</div>
        ))}
      </div>
      <Flex gap={5}>
        {grid.map((column) => (
          <>
            {column.map((value) => (
              <div style={{height: 11, width: 11, backgroundColor: getColor(value)}} />
            ))}
          </>
        ))}
      </Flex>
    </div>
  );
}