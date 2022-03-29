import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectView, toggle } from './modalSlice';
import ModalContent from './ModalContent';

export default function LoginModal(): JSX.Element {
  const view = useAppSelector(selectView);
  const dispatch = useAppDispatch();
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (element.current && e.target && element.current.contains(e.target)) return;
      dispatch((toggle()))
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [dispatch]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center
    justify-center" style={{ background: 'rgba(0, 0, 0, 0.3)', zIndex: '100' }}>
      <div ref={element} className="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
        <ModalContent view={view} />
      </div>
    </div>
  );
};