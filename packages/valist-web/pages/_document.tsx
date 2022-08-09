import Document from 'next/document';
import { createGetInitialProps } from '@mantine/next';

const getInitialProps = createGetInitialProps();

class ValistDocument extends Document {
  static getInitialProps = getInitialProps;
}

export default ValistDocument;