import useSWRImmutable from 'swr/immutable';

export interface MetadataProps {
  url: string;
  children: (data: any) => React.ReactNode;
}

export function Metadata(props: MetadataProps) {
  const { data } = useSWRImmutable(props.url);

  return (
    <>
      {props.children(data)}
    </>
  );
}