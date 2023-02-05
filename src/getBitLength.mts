export const getBitLength = (value: number): number => value === 0 ? 1 : Math.ceil(Math.log2(value + 1));
