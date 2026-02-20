import { FaDownload } from "react-icons/fa6";

export const FileFooter = ({ chat }) => {
    return (
      <div className="flex items-center justify-between px-2 py-1 text-xs bg-black/10">
        <div className="truncate">{chat?.file_name}</div>
  
        <a
          href={chat?.file_url}
          download={chat?.file_name}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 hover:scale-110 transition"
        >
          <FaDownload />
        </a>
      </div>
    );
  };