/**
 * AssemblyScript
 */

export class Foo {
  a: f32;
  b: i8;
  c: i8;
  d: i8;
  constructor(public str: string) {}
  //クラスの文字列のみ抜き出す
  getString(): string {
    return this.str
  }
}

//インスタンス作成してClass返す
export function getFoo(): Foo {
  return new Foo("Hello string!")
}

//Uint8Arrayを受け取りClass返す
//ID確保
export const UINT8ARRAY_ID = idof<Uint8Array>();
//Uint8Array を受け取り、少し計算してFooクラスを返す
export function calcPacket(rtp: Uint8Array): Foo | null {
  const nc = new Foo("Hello class!");
  nc.a = rtp[1] as f32 / 10;
  nc.b = rtp[2];
  nc.c = rtp[3];
  nc.d = rtp[4];

  return nc;
}