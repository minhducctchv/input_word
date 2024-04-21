export default interface IPhonetic {
  text: string;
  audio: string;
  sourceUrl: string;
  license: ILicense;
}

export interface ILicense {
  name: string;
  url: string;
}
