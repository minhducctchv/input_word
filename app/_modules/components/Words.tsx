import { Tabs } from "antd";
import Meanings from "./Meanings";
import Phonetics from "./Phonetics";
import { useWordContext } from "./WordProvider";

export default function Words() {
  const { data, isLoading } = useWordContext();

  if (isLoading) return <>Loading...</>;
  if (!data) return <>Not found</>;

  const items: any = data.map((_data, index) => ({
    key: index,
    label: <span className="font-medium">{`Word ${index + 1}`}</span>,
    children: <Word wordIndex={index} />,
  }));

  return (
    <>
      <Tabs defaultActiveKey="0" items={items} />
    </>
  );
}

function Word(props: { wordIndex: number }) {
  const { wordIndex } = props;
  return (
    <>
      <Phonetics wordIndex={wordIndex} />
      <Meanings wordIndex={wordIndex} />
    </>
  );
}
