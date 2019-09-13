export type ISortedData = Array<{ key: string, value: any }>;

export interface IEntry {
  front: string;
  deck: string;
  back?: string;
  mnemonic?: string;
  srsLevel?: number;
  nextReview?: Date | string;
  tag?: string[];
  created?: Date | string;
  modified?: Date | string;
  stat?: {
    streak: { right: number; wrong: number };
  };
  template?: string;
  tFront?: string;
  tBack?: string;
  css?: string;
  js?: string;
  data?: ISortedData;
  source?: string;
  sH?: string;
  sCreated?: Date | string;
}

export interface IRender {
  front: string;
  back?: string;
  mnemonic?: string;
  tFront?: string;
  tBack?: string;
  data: ISortedData;
  css?: string;
  js?: string;
}

export interface ICondOptions<T extends Record<string, any>> {
  offset?: number;
  limit?: number;
  sortBy?: keyof T | "random";
  desc?: boolean;
  fields?: Array<keyof T> | "*";
}

export interface IPagedOutput<T> {
  data: T[];
  count: number;
}

export function toDate(s?: Date | string): Date | undefined {
  return s ? new Date(s) : undefined;
}