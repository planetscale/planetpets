export interface Database {
  branches_count: number
  name: string
}

export interface Key {
  value: any;
  isDown: boolean;
  isUp: boolean;
  press: any;
  release: any;
  downHandler?(event: any): void;
  upHandler?(event: any): void;
  unsubscribe?(): void;
}