import { Layout } from "@/components/Layout";
import { Button, _404 } from "@valist/ui";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  return (
    <Layout>
      <_404
        message={"Seems a slight error occurred, no biggie, click on the button below and we would happily guide you back to safety."}
        action={
          <Button onClick={() => router.push(`/`)}>Go to dashboard</Button>
        }
      />
    </Layout>
  );
}