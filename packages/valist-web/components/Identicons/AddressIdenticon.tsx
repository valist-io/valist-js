import { toSvg } from 'jdenticon';

interface AddressIdenticonProps {
  address: string,
  height: number,
  width: number,
}

const AddressIdenticon = (props: AddressIdenticonProps): JSX.Element => {
  const svgString = toSvg(props.address, 128);
  return (
    <img height={props.height} width={props.height} className='mx-auto rounded-full'
      src={`data:image/svg+xml;base64,${Buffer.from(svgString, 'utf8').toString('base64')}`} alt="" />
  );
};

export default AddressIdenticon;
