import { Copy, Check, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Share(props) {
  const [copy, setCopy] = useState(false); // State to control the copy button

  const copyLink = () => {
    const link = props.link;
    navigator.clipboard.writeText(link); // Write the link to the clipboard
    setCopy(!copy);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="shadow-2xl bg-blue-200 text-black border-2 border-blue-500 hover:bg-blue-400 hover:border-gray-600">
          <Users className="m-2" size={20} />
          <span className="sm:block hidden" > Invite Members </span> 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Copy link</DialogTitle>
          <DialogDescription>
            Share this link with others to invite them to the team.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={props.link} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={copyLink}>
            <span className="sr-only">Copy</span>
            {copy ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
