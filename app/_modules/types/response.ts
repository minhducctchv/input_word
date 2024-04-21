import IMeaning from "./meaning";
import IPhonetic, { ILicense } from "./phonetic";

export interface IItemResponse {
  word: string;
  phonetic: string;
  phonetics: IPhonetic[];
  meanings: IMeaning[];
  license: ILicense;
  sourceUrls: string[];
}

type IResponse = IItemResponse[];

export default IResponse;
