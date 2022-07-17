import { CommentSection } from "@theconvospace/react";
import { useSigner } from "wagmi";
import { ThemeProvider } from 'degen';
import 'degen/styles';

interface CommentsSectionProps {
  threadId: string;
}

export default function CommentsSection(props: CommentsSectionProps): JSX.Element {
  const { data } = useSigner();

  if (data?.provider) {
    return (
      <ThemeProvider>
        <CommentSection
        query={{
          threadId: props.threadId,
          url: "https://app.valist.i",
        }}
        apikey="CSCpPwHnkB3niBJiUjy92YGP6xVkVZbWfK8xriDO"
        hostname="https://app.valist.io"
        provider={data?.provider} 
        isVotingEnabled={false}
      />
      </ThemeProvider>
    );
  } else {
    return <div />;
  }
};