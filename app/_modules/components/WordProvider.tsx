import { useQuery } from "react-query";
import WordService from "../services/word.service";
import { notification } from "antd";
import { createContext, useContext } from "react";
import IResponse from "../types/response";

interface IProps {
  word?: string;
  children: React.ReactElement;
}

interface IValue {
  isLoading: boolean;
  data?: IResponse;
}

const Context = createContext<IValue>({
  isLoading: true,
});

export default function WordProvider(props: IProps) {
  const { word, children } = props;

  const [api, contextHolder] = notification.useNotification();

  const { data, isLoading } = useQuery(
    ["fetch-word", word],
    () => WordService.get(word ?? ""),
    {
      enabled: !!word,
      onError: (err: any) => {
        api.error({
          message: "Error",
          description: `${err}`,
        });
      },
    }
  );

  return (
    <Context.Provider value={{ isLoading, data }}>
      {contextHolder}
      {children}
    </Context.Provider>
  );
}

export function useWordContext() {
  const context = useContext(Context);
  if (!context) {
    throw Error("Missing ContextProvider");
  }
  return context;
}
