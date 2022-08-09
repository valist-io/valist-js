import { 
  useMantineTheme 
} from '@mantine/core';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface MarkdownProps {
  children?: string;
}

export function Markdown(props: MarkdownProps) {
  const theme = useMantineTheme();
  const background = theme.colorScheme === 'dark' 
    ? '#282733' 
    : '';

  return (
    <ReactMarkdown 
      skipHtml={true} 
      remarkPlugins={[remarkGfm]} 
      components={{
        pre: ({ node, ...props }) => (
          <pre style={{ background }} {...props} />
        )
      }}
    >
      {props.children}
    </ReactMarkdown>
  );
}