export default interface IMeaning {
  partOfSpeech: string;
  definitions: IDefinition[];
  synonyms: string[];
  antonyms: any[];
}

interface IDefinition {
  definition: string;
  synonyms: any[];
  antonyms: any[];
  example?: string;
}
