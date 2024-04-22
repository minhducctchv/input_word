import { Tag } from "antd";
import { useWordContext } from "./WordProvider";
import { SoundOutlined } from "@ant-design/icons";
import { useRef } from "react";

interface IProps {
  wordIndex?: number;
}

export default function Phonetics(props: IProps) {
  const { wordIndex = 0 } = props;
  const { data, isLoading } = useWordContext();
  const audioRef = useRef<any[]>([]);

  if (isLoading) return <>Loading...</>;
  if (!data) return <></>;

  const phonetics = data[wordIndex]?.phonetics;
  const rootPhonetic = data[wordIndex]?.phonetic;

  const togglePlay = (index: number) => {
    const audio = audioRef?.current[index];
    if (!!audio) {
      audio.play();
    }
  };

  return (
    <div className="flex justify-around flex-wrap items-center">
      {phonetics.map((phonetic, index) => (
        <div key={index}>
          <audio
            ref={(ele) => {
              audioRef.current[index] = ele;
            }}
            className="hidden"
          >
            <source src={phonetic.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <Tag
            color={phonetic.text == rootPhonetic ? "green" : undefined}
            className={`${
              !phonetic.audio
                ? "cursor-not-allowed text-gray-400"
                : "cursor-pointer"
            } text-lg`}
            icon={<SoundOutlined />}
            onClick={() => togglePlay(index)}
          >
            {phonetic.text}
          </Tag>
        </div>
      ))}
    </div>
  );
}
