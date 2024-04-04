import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchCanvasById, fetchCanvasName } from "@/lib/actions/canvas.action";
import { fetchCanvasByroomId } from "@/lib/actions/room.action";

export function CanvasNameInput(props) {
  const searchParams = useSearchParams();
  const [canvasName, setCanvasName] = useState(null);

  useEffect(() => {
    if (props.roomId) {
      fetchCanvasByroomId(props.roomId)
        .then((data) => {
          setCanvasName(data.canvasName);
          props.title(data.canvasName);
        })
        .catch((error) => {
          setCanvasName("Untitled");
        });
    }
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
    <input
      className="text-gray-400 underline outline-none bg-transparent sm:w-max  w-[70px]"
      type="text"
      onChange={(e) => {
        props.title(e.target.value);
      }}
      placeholder={canvasName || "Untitled"}
    />
  );
}
