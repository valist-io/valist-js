import Image from 'next/image';

interface LoginButtonProps {
  active:boolean;
  disabled?: boolean;
  image: string;
  onClick: () => void;
  text: string;
}

export function LogoButton(props: LoginButtonProps):JSX.Element {
  const activeStyle = props.active ? 'solid 5px #820cd8' : undefined;

  return (
    <button
      style={{ width: 240, margin: 20, border: activeStyle }}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span><Image style={{ display: 'block' }} height={55} width={55} alt={props.text + 'Logo'} src={props.image} /></span>
      <span style={{ fontSize: 25, display: 'block' }}>{props.text}</span>
    </button>
  );
}