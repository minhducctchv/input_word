import { Button, Collapse, Tabs } from "antd";
import IMeaning from "../types/meaning";
import { useWordContext } from "./WordProvider";
import { useState } from "react";

interface IProps {
  wordIndex?: number;
}

export default function Meanings(props: IProps) {
  const { wordIndex = 0 } = props;
  const { data, isLoading } = useWordContext();

  if (isLoading) return <>Loading...</>;
  if (!data) return <></>;

  let meanings = data[wordIndex]?.meanings;

  const items: any = meanings.map((meaning, index) => ({
    key: index,
    label: meaning.partOfSpeech,
    children: <Meaning meaning={meaning} />,
  }));

  return (
    <>
      <Tabs defaultActiveKey="0" items={items} />
    </>
  );
}

const Meaning = (props: { meaning: IMeaning }) => {
  const { meaning } = props;
  const [isShowFull, setIsShowFull] = useState(false);

  const definitions = meaning.definitions;
  const manyMeaning = definitions.length > 3;
  let newDefinitions = [...definitions];
  if (manyMeaning && !isShowFull) {
    newDefinitions = definitions.slice(0, 3);
  }

  const items = newDefinitions.map((definition, index) => ({
    key: index,
    label: definition.definition,
    children: <p>{definition.example}</p>,
  }));
  return (
    <>
      <Collapse defaultActiveKey={0} items={items} />
      {manyMeaning && (
        <div className="text-center">
          <Button
            size="small"
            type="link"
            onClick={() => setIsShowFull((val) => !val)}
          >
            Show/Hidden
          </Button>
        </div>
      )}
    </>
  );
};
