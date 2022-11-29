import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const RedirectPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && typeof router.query.state === 'string' && typeof router.query.code === 'string') {
      const location = JSON.parse(Buffer.from(router.query.state, 'base64').toString("utf8"));
      if (location) {
        location.query.code = router.query.code;
        router.push(location);
      }
    }
  }, [router, router.isReady]);
  
  return (
    <div>Redirecting....</div>
  );
};

export default RedirectPage;