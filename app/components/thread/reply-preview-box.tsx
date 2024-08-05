import Image from "next/image"
import { formatDate } from "../utility/functions"

function formatComment(comment: string) {
  // Split the comment by newlines and special formatting rules
  const parts = comment.split(/(>>\d+|>.+?$)/gm);
  
  return parts.map((part, index) => {
    // Handle replies (>> followed by numbers)
    if (part.startsWith(">>")) {
      return (
        <a key={index} href={`#${part.slice(2)}`} className="text-red-600 underline">
          {part}
        </a>
      );
    // Handle green text (lines that start with a single ">")
    } else if (part.startsWith(">") && !part.startsWith(">>")) {
      return (
        <span key={index} className="text-[#789922]">
          {part}
        </span>
      );
    // Handle newlines
    } else if (part === "\n") {
      return <br key={index} />;
    // Handle regular text
    } else {
      return part;
    }
  });
}

export default function ReplyPreviewBox({ reply, width }: { reply: any, width: number }) {
  return (
    <div className="absolute right-100 origin-left clear-right text-[13px] bg-inherit my-0.5 pt-1 px-2" style={{ transform: `translateX(${width}px) translateY(-50%)` }}>
      <div className="relative flex max-w-fit pt-1 pb-3 bg-red-200">
        <div className="px-2 flex flex-col ">
          <div className="flex items-center">
            <span className="px-2 font-bold text-green-700 ">Anonymous</span>
            <span className="bg-red-200">{formatDate(reply.createdAt)}</span>
            <span className="px-1 hover:text-red-600 hover:cursor-pointer">No.{reply.id}</span>
          </div>
          {reply.image && (
            <div className="px-2">
              <span>File:</span>
              <a target="_blank" className="px-1 underline text-blue-950 hover:text-red-600" href={reply.image}>{reply.imageName}</a>
              <span>({reply.imageSize}, {reply.imageResolution})</span>
            </div>
          )}
          <div className="relative">
            {reply.image && (
              <Image
                src={reply.image}
                alt={reply.comment}
                width={150}
                height={150}
                className="float-left pl-2 pb-1 hover:cursor-pointer"
              />
            )}
            <span className="clear-right">
              <div className="flex">
                <blockquote className="clear-right whitespace-pre-wrap w-full pt-2 px-2 text-[12px]">{formatComment(reply.comment)}</blockquote>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}