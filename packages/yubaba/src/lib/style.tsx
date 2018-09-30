export const combine = (t1: string) => (t2?: string | number) => {
  if (t2) {
    return `${t1}, ${t2}`;
  }

  return t1;
};
