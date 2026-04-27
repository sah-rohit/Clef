import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkBreaks from "remark-breaks";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";

interface Props {
  content: string;
}

/**
 * Renders AI response text with:
 * - Full Markdown (headings, bold, italic, lists, tables, blockquotes, code)
 * - LaTeX math via KaTeX ($inline$ and $$block$$)
 * - Syntax-highlighted code blocks
 * - Colorful inline accents matching Clef's palette
 */
export function AIMarkdown({ content }: Props) {
  if (!content) return null;

  return (
    <div className="ai-markdown font-inter text-[11px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="font-oswald text-base font-bold uppercase tracking-tight text-[#1a1a1a] mt-3 mb-1.5 border-b-[2px] border-black/10 pb-1">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-oswald text-sm font-bold uppercase tracking-tight text-[#1a1a1a] mt-3 mb-1">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-oswald text-xs font-bold uppercase tracking-wider text-[#FF0004] mt-2 mb-1">
              {children}
            </h3>
          ),

          // Paragraph
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 text-[#1a1a1a]/85 leading-relaxed">{children}</p>
          ),

          // Bold — yellow highlight
          strong: ({ children }) => (
            <strong className="font-bold text-[#1a1a1a] bg-[#F9FF00]/40 px-0.5 rounded-none">
              {children}
            </strong>
          ),

          // Italic — cyan tint
          em: ({ children }) => (
            <em className="not-italic font-semibold text-[#0891B2]">{children}</em>
          ),

          // Inline code — purple
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <code className={`${className} text-[10px]`}>{children}</code>
              );
            }
            return (
              <code className="font-mono text-[10px] bg-[#7C3AED]/10 text-[#7C3AED] px-1 py-0.5 border border-[#7C3AED]/20">
                {children}
              </code>
            );
          },

          // Code block wrapper
          pre: ({ children }) => (
            <pre className="bg-[#1a1a1a] text-white text-[10px] p-3 my-2 overflow-x-auto border-l-[3px] border-[#F9FF00] font-mono leading-relaxed">
              {children}
            </pre>
          ),

          // Unordered list
          ul: ({ children }) => (
            <ul className="my-1.5 space-y-0.5 pl-0">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-2 text-[#1a1a1a]/80">
              <span className="mt-1.5 w-1.5 h-1.5 bg-[#00E5FF] rotate-45 flex-shrink-0" />
              <span>{children}</span>
            </li>
          ),

          // Ordered list
          ol: ({ children }) => (
            <ol className="my-1.5 space-y-0.5 pl-0 counter-reset-list">{children}</ol>
          ),

          // Blockquote — green left border
          blockquote: ({ children }) => (
            <blockquote className="border-l-[3px] border-[#00FF87] pl-3 my-2 text-[#1a1a1a]/60 italic">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => <hr className="border-black/10 my-3" />,

          // Table
          table: ({ children }) => (
            <div className="overflow-x-auto my-2">
              <table className="w-full border-[2px] border-black text-[10px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#1a1a1a] text-white">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-2 py-1 font-oswald text-[9px] uppercase tracking-wider border-r border-white/10 last:border-r-0 text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-2 py-1 border-r border-black/10 last:border-r-0 border-t border-black/10">
              {children}
            </td>
          ),

          // Links — red
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF0004] underline decoration-[#FF0004]/40 hover:decoration-[#FF0004] transition-all"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
