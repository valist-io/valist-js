import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { SiweMessage } from "siwe";
import { useAccount, useNetwork, useSignMessage } from "wagmi";
import { Layout } from "@/components/Layout";
import type { NextPage } from "next";

export interface SiweProps {
    csrfToken: string,
}

export async function getServerSideProps(context: any) {
    return {
        props: {
            csrfToken: await getCsrfToken(context),
        },
    };
}

const Protected: NextPage<SiweProps> = (props) => {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: session, status } = useSession();

  const handleLogin = async () => {
    try {
      const callbackUrl = "/protected";

      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to Valist.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce: props.csrfToken,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });

    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <Layout>
      {status === 'unauthenticated' && <button onClick={handleLogin}>
        Sign-in
      </button>}
      {status === 'authenticated' &&
        <div>
            Signed in! Session: {JSON.stringify(session)}
            <button onClick={() => signOut()}>
                Sign-out
            </button>
        </div>
      }
    </Layout>
  );
};

export default Protected;