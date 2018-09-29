// eslint-disable-next-line
export const combineTransition = (t1: string) => (t2?: string) => {
  if (t2) {
    return `${t1}, ${t2}`;
  }

  return t1;
};
