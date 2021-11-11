const SetLoading = (text: string): string => {
  if (text === 'Loading' || text === 'Loading/Loading') {
    return 'loading';
  }
  return ' ';
};

export default SetLoading;
