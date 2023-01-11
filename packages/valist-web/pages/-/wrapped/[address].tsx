import query from '@/graphql/Wrapped.graphql';
import client from "@/utils/apollo";
import { Flex, Loader, Stack, Text } from '@mantine/core';
import Image from 'next/image';
import axios, { AxiosResponse } from 'axios';

export const getServerSideProps = async ({ params, res }: any) => {
  const { data } = await client.query({
    query: query,
    variables: { address: String(params.address).toLowerCase() },
  });

  let metaRes: AxiosResponse<any>;
  let meta = {};

  try {
    if (data?.users && data?.users[0] && data.users[0].projects[0]) {
      metaRes = await axios.get(data.users[0].projects[0].metaURI);
      meta = metaRes?.data;
    }
  } catch {
    console.log('Failed to fetch meta!');
  }
  
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=11',
  );


  return {
    props: {
      data,
      meta,
    },
  };
};

export default function WrappedPage(props: any) {
  return (
    <Stack id="capture" py={40} px={32} style={{ maxWidth: 500, background: 'linear-gradient(270deg, #8680F8 0.01%, #4152CF 100%)' }}>
      <Flex
        align="center"
        px={15}
        py={10}
        style={{ backgroundColor: '#fae8cf', borderRadius: 8 }}
        mb={19}
        gap={16}
      >
        <Text size={90} color={'#F79009'} style={{ lineHeight: 1 }}>
          {props.data.users[0].projects.length}
        </Text>
        <div>
          <Text style={{ fontSize: 12,color: '#9B9BB1' }}>
            Total Projects
          </Text>
          <Text style={{ fontSize: 24 }}>
            Published
          </Text>
        </div>
      </Flex>

      <Flex      
        direction="row"
        wrap="wrap"
        gap="md"
        style={{ fontSize: 12, border: '0.5px solid #FFFFFF', borderRadius: 8, color: "#FFFFFF" }}
        p={16}
        mb={24}
      >
        <div>
          Total Releases: {0}
        </div>
        <div>
          No. of on-chain transactions: {0}
        </div>
        <div>
          Software Licenses created: {24}
        </div>
        <div>
          Valist Ranking: {5}
        </div>
      </Flex>
      
      <div>
        <Text size={12} weight={400} mb={8} color="#CBC9F9">Your First Project</Text>
        <Flex
          gap={16}
        >
          {!props?.meta?.image ? <Loader height={100} width={120} /> : <Image height={100} width={130} alt="project-img" src={props?.meta?.image} />}
          <div>
            <div style={{ fontSize: 14, color: "#FFFFFF", fontWeight: 700 }}>
              {props?.meta?.name}
            </div>
            <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 400, marginBottom: 16 }}>
              {props?.meta?.short_description}
            </div>
            <div style={{ fontSize: 12, color: "#FFFFFF", fontWeight: 400 }}>
              <div style={{ fontWeight: 700 }}>Last Edit: </div>
            </div>
          </div>
        </Flex>
      </div>
    </Stack>
  );
};

  // const capture = () => {
  //   // @ts-ignore
  //   document.getElementById("capture").addEventListener("click", function() {
  //     // @ts-ignore
  //     html2canvas(document.querySelector('#caputure')).then(function(canvas) {
  //         saveAs(canvas.toDataURL(), 'file-name.png');
  //     });
  // });
  
  
  // function saveAs(uri: any, filename: any) {
  //     var link = document.createElement('a');
  
  //     if (typeof link.download === 'string') {
  
  //         link.href = uri;
  //         link.download = filename;
  
  //         //Firefox requires the link to be in the body
  //         document.body.appendChild(link);
  
  //         //simulate click
  //         link.click();
  
  //         //remove the link when done
  //         document.body.removeChild(link);
  
  //     } else {
  
  //         window.open(uri);
  
  //     }
  // }
  // };

  // useEffect(() => {
  //   if (props?.users && props?.users[0] && props.users[0].projects[0]) {
  //     console.log('called');
  //     capture();
  //   }
  // }, [props.data.users, props.users]);
  
