import React, { useEffect, useContext, useRef } from 'react';
import AccountCtx from './AccountContext';
import LoginForm from './LoginForm';

export default function LoginModal(): JSX.Element {
  const accountCtx = useContext(AccountCtx);
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (!accountCtx) return;
      if (element.current && e.target && element.current.contains(e.target)) return;
      accountCtx.setShowLogin(false);
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [accountCtx]);

  return (
    <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center
    justify-center" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
      <div ref={element} className="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
          <LoginForm setProvider={accountCtx?.setProvider} setAddress={accountCtx?.setAddress} />
      </div>
    </div>
  );
};