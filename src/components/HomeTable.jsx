import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

const HomeTable = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-1/2">
        <Table className="bg-black border border-gray-800">
          <TableCaption>Your Canvas List </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Canvas Name</TableHead>
              <TableHead className="text-center">Created By</TableHead>
              <TableHead className="text-center">Last Update At</TableHead>
              <TableHead className="text-center">Shared With</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="text-center text-gray-300">
              <TableCell className="font-medium text-white">Canvas</TableCell>
              <TableCell>You</TableCell>
              <TableCell>2hours ago</TableCell>
              <TableCell>Thala and 7 others</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HomeTable;
