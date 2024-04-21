import axios from "axios";

export default class WordService {
  static get = async (word: string) => {
    try {
      const response = await axios.get(
        "https://api.dictionaryapi.dev/api/v2/entries/en/" + word.trim()
      );
      return response?.data;
    } catch (error: any) {
      throw Error(error?.response?.data?.message ?? "Some thing went wrong");
    }
  };
}
