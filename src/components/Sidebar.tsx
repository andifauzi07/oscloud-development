import { Link } from "@tanstack/react-router";
import {
  MessageCircle,
  PaintBucket,
  PlusCircle,
  SearchIcon,
} from "lucide-react";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

const Sidebar = () => {
  return (
    <div className="h-full w-full flex-col border-r bg-white">
      <div className="flex flex-col pt-14 pb-10 text-center font-bold border-b">
        OSMERGE - BETA
      </div>
      <div className="flex flex-col p-4 text-sm border-b">
        <div className="flex justify-between">
          <span className="text-xs text-slate-400">Workspace</span>
          <Link to="/">
            <PlusCircle
              size={16}
              className="hover:text-slate-400 cursor-pointer transition-all"
            />
          </Link>
        </div>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select Workspace" />
          </SelectTrigger>
          <SelectContent></SelectContent>
        </Select>
      </div>
      {/* Other sidebar items can go here */}
      <div className="flex flex-col p-4 border-b">
        <div className="flex justify-between">
          <span className="text-xs text-slate-400 mb-2">Category</span>
        </div>
        <Link
          to="/dashboard/employee"
          className="flex gap-2 hover:bg-slate-50 rounded-sm p-2"
        >
          <span className="text-sm text-black">Employee</span>
        </Link>
        <a href="#" className="flex gap-2 hover:bg-slate-50 rounded-sm p-2">
          <MessageCircle size={16} className="self-center" />
          <span className="text-sm text-black">Chatbot</span>
        </a>
        <a href="#" className="flex gap-2 hover:bg-slate-50 rounded-sm p-2">
          <SearchIcon size={16} className="self-center" />
          <span className="text-sm text-black">Search</span>
        </a>
        <a href="#" className="flex gap-2 hover:bg-slate-50 rounded-sm p-2">
          <PaintBucket size={16} className="self-center" />
          <span className="text-sm text-black">Generative</span>
        </a>
        <a href="#" className="text-center text-slate-400 text-xs mt-4">
          View more
        </a>
      </div>
      <div className="flex flex-col p-4 border-b">
        <div className="flex justify-between">
          <span className="text-xs text-slate-400 mb-2">Shared Channel</span>
          <PlusCircle
            size={16}
            className="hover:text-slate-400 cursor-pointer transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col p-4 border-b">
        <div className="flex justify-between">
          <span className="text-xs text-slate-400 mb-2">Private Channel</span>
          <PlusCircle
            size={16}
            className="hover:text-slate-400 cursor-pointer transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
