export const transformQueryParamsToBoolOrUndefined = (
  value: string,
): boolean | undefined => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};
