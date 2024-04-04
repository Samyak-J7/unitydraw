import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchAllCanvas } from "@/lib/actions/canvas.action";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const HomeTable = (props) => {
  const [allCanvas, setAllCanvas] = useState([]);
  const userId = props.userId;
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    fetchAllCanvas(userId).then((data) => {
      setAllCanvas(data);
    }).catch((error) => {
      //TODO: handle error
    })
  },[userId])

  const open = (id, roomId) => {
    roomId ? router.push(`/draw/${roomId}`) : router.push(`/draw?${id}`);
  };

  return (
    <div className="w-full mt-20 flex justify-center items-center relative z-10">
      <div className="w-1/2">
        <Table className="bg-black border border-gray-800 ">
          <TableCaption>Your Canvas List </TableCaption>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-center">Canvas Name</TableHead>
              <TableHead className="text-center">Created By</TableHead>
              <TableHead className="text-center">Last Update At</TableHead>
              <TableHead className="text-center">Shared With</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allCanvas &&
              allCanvas.map((canvas) => (
                <TableRow
                  key={canvas.canvasId}
                  className="text-center text-gray-300 hover:cursor-pointer"
                  onClick={() => open(canvas.canvasId, canvas.roomId)}>
                    <TableCell className="font-medium text-white">
                      {canvas.canvasName}
                    </TableCell>
                    <TableCell>{canvas.createdBy}</TableCell>
                    <TableCell>{canvas.updatedAt}</TableCell>
                    <TableCell>{canvas.members}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HomeTable;
