export default function parseError(err: any) {
  let errString = '';
  let text = '';

  if (err.message) {
    errString = err.message;
  }

  if (err?.data?.message) {
    errString = err?.data.message;
  }

  if (errString.includes('err: insufficient funds')) {
    text = 'Insufficient funds for transaction.';
  }

  return (text !== '') ? text : String(errString);
};