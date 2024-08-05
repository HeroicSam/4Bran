import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { formatDate } from "../utility/functions";
import useOnScreen from "@/hooks/use-on-screen";
import ReplyPreviewBox from "./reply-preview-box";

function formatComment(comment: string, allReplyIds: Map<any, any>, replyId: number) {
  // Split the comment by newlines and special formatting rules
  const parts = comment.split(/(>>\d+|>.+?$)/gm);
  
  return parts.map((part, index) => {
    // Handle replies (>> followed by numbers)
    if (part.startsWith(">>")) {
      const id = Number(part.slice(2));
      if (allReplyIds.has(id) && id < replyId) {
        return (
          <a key={index} href={`#${part.slice(2)}`} className="text-red-600 underline">
            {part}
          </a>
        );
      } else return part;
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

export default function Reply({
  allReplyIds,
  reply,
  handleReplyClick,
  hoveredReply,
  setHoveredReply,
  inViewReply,
  setInViewReply
}: { 
  allReplyIds: Map<any, any>,
  reply: any,
  handleReplyClick: Function,
  hoveredReply: number | null,
  setHoveredReply: React.Dispatch<React.SetStateAction<null>>,
  inViewReply: any,
  setInViewReply: any
}) {
  const [ratio, setRatio] = useState(1);
  const [width, setWidth] = useState(150);
  const [height, setHeight] = useState(150);
  const [enlarged, setEnlarged] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const spanRef = useRef<HTMLSpanElement>(null);
  const isVisible = useOnScreen(ref);

  function handleImageClick() {
    if (!reply) return;

    if (!enlarged) {
      setWidth(Number(reply.imageResolution.split('x')[0]))
      setHeight(Number(reply.imageResolution.split('x')[1]))
    } else {
      setWidth(150)
      setHeight(150)
    }
    setEnlarged(!enlarged);
  }

  useEffect(() => {
    if (hoveredReply === reply.id && !isVisible) {
      setInViewReply(reply)
    }
  }, [ hoveredReply])

  function handleMouseLeave() {
    setHoveredReply(null)
    setInViewReply(null)
  }

  return (
    <div id={reply.id.toString()} ref={ref} className="relative clear-right text-[13px] bg-inherit my-0.5 pt-1 px-2">
      <div className={`relative flex max-w-fit pt-1 pb-3 ${isVisible && hoveredReply === reply.id ? "bg-red-100" : "bg-blue-200"}`}>
        <div className="px-2 flex flex-col ">
          <div className="flex items-center">
            <span className="px-2 font-bold text-green-700 ">Anonymous</span>
            <span className={`px-1 ${isVisible && hoveredReply === reply.id ? "bg-red-100" : "bg-blue-200"}`}>{formatDate(reply.createdAt)}</span>
            <span className="px-1 hover:text-red-600 hover:cursor-pointer" onClick={() => handleReplyClick({ reply })}>No.{reply.id}</span>
            {reply.replyReferences && reply.replyReferences.map((reply: any) => (
              <div className="relative">
                <span ref={spanRef} className="px-1 underline text-[10px] text-slate-600 hover:text-red-600 hover:cursor-pointer" onMouseEnter={() => setHoveredReply(reply)} onMouseLeave={handleMouseLeave}>
                  &gt;&gt;{reply}
                </span>
                {inViewReply && (inViewReply.id === reply) && (
                  <ReplyPreviewBox reply={inViewReply} width={spanRef?.current?.offsetWidth || 0} />
                )}
              </div>
            ))}
          </div>
          {reply.image && (
            <div className="px-2">
              <span>File:</span>
              <a target="_blank" className="px-1 underline text-blue-950 hover:text-red-600" href={reply.image}>{reply.imageName}</a>
              <span>({reply.imageSize}, {reply.imageResolution})</span>
            </div>
          )}
          <div className={`${enlarged ? "flex flex-col" : ""} relative`}>
            {reply.image && (
              <Image
                src={reply.image}
                alt={reply.comment}
                width={width}
                height={height / ratio}
                className="float-left pl-2 pb-1 hover:cursor-pointer"
                onClick={handleImageClick}
              />
            )}
            <span className="clear-right">
              <div className="flex">
                <blockquote className="clear-right whitespace-pre-wrap w-full pt-2 px-2 text-[12px]">{formatComment(reply.comment, allReplyIds, reply.id)}</blockquote>
              </div>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}