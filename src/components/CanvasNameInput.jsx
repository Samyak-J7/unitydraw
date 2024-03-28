import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCanvasName } from "@/lib/actions/canvas.action";

export function CanvasNameInput(props) {
  const searchParams = useSearchParams();
  const [canvasName, setCanvasName] = useState(null);

  useEffect(() => {
    const canvasID = `${searchParams}`.slice(0, -1);
    if (!canvasID) return;
    fetchCanvasName(canvasID)
      .then((name) => {
        setCanvasName(name);
        props.title(name);
      })
      .catch((error) => {
        setCanvasName("Untitled");
      });
  }, []);

  return (

      <input className=" text-end text-gray-400 underline outline-none bg-transparent "
        type="text"
        onChange={(e) => {
          props.title(e.target.value);
        }}
        placeholder={canvasName || "Untitled"}
      />

  );
}
