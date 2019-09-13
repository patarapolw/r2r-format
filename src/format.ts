import Anki from "ankisync";
import SparkMD5 from "spark-md5";
import stringify from "fast-json-stable-stringify";
import { R2rLocal } from ".";
import { ICondOptions, IEntry, IPagedOutput, IRender, ISortedData, IProgress } from "./util";

export interface IMedia {
  name: string;
  h: string;
  data: ArrayBuffer;
}

export abstract class R2rFormat {
  abstract async build(): Promise<this>;
  abstract async close(): Promise<this>;
  abstract async reset(): Promise<this>;
  abstract async parseCond(
    q: string,
    options: ICondOptions<IEntry>
  ): Promise<IPagedOutput<Partial<IEntry>>>;
  abstract async insertMany(entries: IEntry[]): Promise<string[]>;
  abstract async updateMany(ids: string[], u: Partial<IEntry>): Promise<void>;
  abstract async addTags(ids: string[], tags: string[]): Promise<void>;
  abstract async removeTags(ids: string[], tags: string[]): Promise<void>;
  abstract async deleteMany(ids: string[]): Promise<void>;
  abstract async render(cardId: string): Promise<IRender>;
  abstract async fromR2r(r2r: R2rLocal, options?: { filename?: string, callback?: (p: IProgress) => void }): Promise<void>;
  abstract async export(r2r: R2rLocal, q: string, 
    options?: { callback?: (p: IProgress) => void }): Promise<void>;
  abstract async fromAnki(anki: Anki, options?: { filename?: string, callback?: (p: IProgress) => void }): Promise<void>;
  
  abstract async getMedia(h: string): Promise<IMedia | null>;
  abstract async allMedia(): Promise<IMedia[]>;
  abstract async createMedia(m: {name: string, data: ArrayBuffer}): Promise<string>;
  abstract async deleteMedia(h: string): Promise<boolean>;

  protected abstract async updateSrsLevel(dSrsLevel: number, cardId: string): Promise<void>;
  protected abstract async transformCreateOrUpdate(
    cardId: string | null,
    u: Partial<IEntry>,
    timestamp: Date
  ): Promise<Partial<IEntry>>;
  protected abstract async getOrCreateDeck(name: string): Promise<string | number>;
  protected abstract async getData(cardId: string): Promise<ISortedData | null>;
  protected abstract async getFront(cardId: string): Promise<string>;

  

  public markRight(cardId: string) {
    return this.updateSrsLevel(+1, cardId);
  }

  public markWrong(cardId: string) {
    return this.updateSrsLevel(-1, cardId);
  }

  public getTemplateKey(t: any) {
    const { front, back, css, js } = t;
    return SparkMD5.hash(stringify({ front, back, css, js }));
  }

  public getNoteKey(data: Record<string, any>) {
    return SparkMD5.hash(stringify(data));
  }
}