import { useMantineTheme } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  markdown: string,
}

export default function RenderMarkdown(props: MarkdownProps): JSX.Element {
  const theme = useMantineTheme();
  const backgroundColor = theme.colorScheme === 'dark' ? '#282733' : '';
  
  return (
    <div className="markdown">
      <ReactMarkdown skipHtml={true} remarkPlugins={[remarkGfm]} components={{
        pre: ({ node, ...props }) => <pre style={{ background: backgroundColor }} {...props} />,
      }}>
        {props.markdown}
      </ReactMarkdown>
    </div>
  );
}
