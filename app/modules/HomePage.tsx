"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
//@ts-ignore
import { Howl } from "howler";
import { isMobile } from "react-device-detect";

function compareArrays(array1: string[], array2: string[]) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const word = searchParams.get("word") ?? "";

  const [suggest, setSuggest] = useState<string[]>([]);
  const [suggestNoSort, setSuggestNoSort] = useState<string[]>([]);
  const [result, setResult] = useState<string[]>([]);
  const [repeatMode, setRepeatMode] = useState(false);
  const [keyDown, setKeyDown] = useState<string | undefined>();
  const [keyDownIndex, setKeyDownIndex] = useState(0);
  const [status, setStatus] = useState<"input" | "success" | "error">("input");
  const inputRef = useRef<any>(null);

  const success = new Howl({
    src: ["./mp3/success.mp3"],
    preload: true,
    onplay: () => {},
    onpause: () => {},
    onend: () => {},
  });
  const inputSound = new Howl({
    src: ["./mp3/button.mp3"],
    preload: true,
    onplay: () => {},
    onpause: () => {},
    onend: () => {},
  });
  const buzzer = new Howl({
    src: ["./mp3/buzzer.mp3"],
    preload: true,
    onplay: () => {},
    onpause: () => {},
    onend: () => {},
  });
  const failed = new Howl({
    src: ["./mp3/failed.mp3"],
    preload: true,
    onplay: () => {},
    onpause: () => {},
    onend: () => {},
  });

  useEffect(() => {
    if (!isMobile) {
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isMobile]);

  useEffect(() => {
    init();
    showKeyBoard();
  }, [word]);

  useEffect(() => {
    if (keyDown == "Backspace") {
      handleBackspace();
      return;
    } else {
      handleCharacter(keyDown);
    }
  }, [keyDown, keyDownIndex]);

  useEffect(() => {
    if (!suggest.length && !result.includes("_") && result?.length) {
      if (compareArrays(result, word.trim().toLocaleLowerCase().split(""))) {
        setStatus("success");
        success.play();
      } else {
        setStatus("error");
        failed.play();
      }
    }
  }, [suggest, result]);

  const init = () => {
    const characters = word.trim().toLocaleLowerCase().split("");
    setSuggestNoSort(characters?.filter((s) => s !== " "));
    setSuggest(characters?.filter((s) => s !== " ").sort());
    setResult(characters.map((c) => (c === " " ? " " : "_")));
  };

  const showKeyBoard = () => {
    if (isMobile) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }
  };

  const handleKeyDown = (event: any) => {
    if (/^[a-zA-Z0-9]$/.test(event?.key) || event?.key == "Backspace") {
      setKeyDown(event.key);
      setKeyDownIndex((val) => val + 1);
    }
  };

  const handleBackspace = () => {
    const resultClone = [...result];
    // result bot 1 chu
    let index = resultClone.findIndex((c) => c === "_");
    if (index === 0) return;
    inputCorrect();
    if (index > 0) {
      --index;
    } else {
      index = resultClone.length - 1;
    }
    let character;
    if (resultClone[index] === " ") {
      character = resultClone.splice(index - 1, 1, "_");
    } else {
      character = resultClone.splice(index, 1, "_");
    }
    setResult(resultClone);
    // suggest them 1 chu
    const suggestClone = [...suggest];
    suggestClone.push(...character);
    setSuggest(suggestClone);
  };

  const handleCharacter = (key: any) => {
    if (/^[a-zA-Z0-9]$/.test(key)) {
      const character: string = key;
      if (!repeatMode) {
        if (suggest.includes(character)) {
          // dung
          inputCorrect();
          // suggest bo 1 chu
          const index = suggest.findIndex((s) => s === character);
          const suggestClone = [...suggest];
          suggestClone.splice(index, 1);
          setSuggest(suggestClone);
          // result them 1 chu
          const index2 = result.findIndex((r) => r === "_");
          const resultClone = [...result];
          resultClone.splice(index2, 1, character);
          setResult(resultClone);
        } else {
          // sai
          // thong bao sai
          inputInCorrect();
        }
      } else {
        if (suggestNoSort.length && suggestNoSort[0] === character) {
          inputCorrect();
          // suggestNoSort bo 1 chu
          const suggestNoSortClone = [...suggestNoSort];
          suggestNoSortClone.splice(0, 1);
          setSuggestNoSort(suggestNoSortClone);
          // suggest bo 1 chu
          const index = suggest.findIndex((s) => s === character);
          const suggestClone = [...suggest];
          suggestClone.splice(index, 1);
          setSuggest(suggestClone);
          // result them 1 chu
          const index2 = result.findIndex((r) => r === "_");
          const resultClone = [...result];
          resultClone.splice(index2, 1, character);
          setResult(resultClone);
        } else {
          inputInCorrect();
          // sai
        }
      }
    }
  };

  const switchMode = () => {
    setRepeatMode(!repeatMode);
    init();
    showKeyBoard();
  };

  const inputCorrect = () => {
    inputSound.play();
  };
  const inputInCorrect = () => {
    buzzer.play();
  };

  const handleStatusColor = () => {
    if (result.includes("_")) {
      return "text-[#002cff] text-shadow-blue";
    }
    if (status === "error") {
      return "text-[#ff4a4a] text-shadow-red";
    }
    return "text-[#1e9e25] text-shadow-green";
  };

  const handleChange = (event: any) => {
    if (isMobile) {
      if (event.nativeEvent.inputType === "deleteContentBackward") {
        setKeyDown("Backspace");
      } else {
        if (event.target.value.slice(-1)) {
          setKeyDown(event.target.value.slice(-1).toLowerCase());
        }
      }
      setKeyDownIndex((val) => val + 1);
    }
  };

  if (!word?.length) return <>Word not found.</>;

  return (
    <div
      className="flex flex-col items-center w-screen h-screen bg-blue-100"
      onClick={showKeyBoard}
    >
      <input
        type="text"
        ref={inputRef}
        onChange={handleChange}
        className="block md:hidden"
        // style={{ display: "none" }}
      />
      <div
        className="shadow-2xl rounded-lg p-4 flex flex-col gap-2 bg-blue-200
        mt-[10vh]
      justify-center items-center
      min-w-[300px] max-w-[100%] md:max-w-[88%]"
      >
        <div className="flex w-full flex-wrap">
          {suggest.map((c, index) => (
            <>
              <span key={index} className={`text-2xl font-bold m-[2px]`}>
                {c}
              </span>
            </>
          ))}
        </div>
        <div>
          {result.map((c, index) => (
            <>
              <span
                key={index}
                className={`text-2xl font-bold  m-[2px] ${handleStatusColor()}`}
              >
                {c}
              </span>
            </>
          ))}
        </div>
        <div className="my-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={switchMode}
          >
            {repeatMode ? "Hard" : "Easy"}
          </button>
        </div>
      </div>
    </div>
  );
}
