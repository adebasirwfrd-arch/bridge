export interface Signature {
  kind: "drawn" | "image";
  dataUrl: string;
  width: number;
  height: number;
  signedAt: number;
}
