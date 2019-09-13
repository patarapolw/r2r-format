import { R2rFormat } from "./format";
export * from "./util";

export abstract class R2rLocal extends R2rFormat {
  protected filename: string;

  constructor(filename: string) {
    super();
    this.filename = filename;
  }
}

export abstract class R2rOnline extends R2rFormat {
  abstract async signup(username: string, password?: string): Promise<string>;
  abstract async getSecret(): Promise<string | null>;
  abstract async newSecret(): Promise<string | null>;
  abstract async login(username: string, password: string): Promise<boolean>;
  abstract async logout(): Promise<boolean>;
}