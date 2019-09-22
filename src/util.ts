export type ISortedData = Array<{ key: string, value: any }>;

export interface IEntry {
  _id?: string;
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

export interface IProgress {
  text: string;
  current?: number;
  max?: number;
}

export function ankiMustache(
  s: string,
  d: Record<string, any> | Array<{key: string, value: any}> = {},
  front: string = ""
): string {
  if (Array.isArray(d)) {
    d = fromSortedData(d).data;
  }

  s = s.replace(/\{\{FrontSide}}/g, front.replace(/@html\n/g, ""))

  for (const [k, v] of Object.entries(d)) {
      if (typeof v === "string") {
          s = s.replace(
              new RegExp(`\\{\\{(\\S+:)?${escapeRegExp(k)}}}`, "g"),
              v.replace(/^@[^\n]+\n/gs, "")
          );
      }
  }

  s = s.replace(/\{\{#(\S+)}}([^]*)\{\{\1}}/gs, (m, p1, p2) => {
      return Object.keys(d).includes(p1) ? p2 : "";
  });

  s = s.replace(/{{[^}]+}}/g, "");

  return s;
}

export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // $& means the whole matched string
}

export function fromSortedData(sd: ISortedData) {
  const data: Record<string, any> = {};
  const order: Record<string, number> = {};

  let index = 1;
  for (const { key, value } of sd) {
    data[key] = value;
    order[key] = index
    index++;
  }
  return {data, order};
}

export function toSortedData(d: {data: Record<string, any>, order: Record<string, number>}): ISortedData {
  const {data, order} = d;

  return Object.keys(order).sort((a, b) => {
    return order[b] - order[a];
  }).map((key) => {
    return {
      key,
      value: data[key]
    };
  });
}