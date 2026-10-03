"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { slugify } from "@/lib/mock-ai";

/* Tipe hast minimal, cukup untuk plugin di bawah */
interface HNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HNode[];
}

const textOf = (n: HNode): string => (n.type === "text" ? (n.value ?? "") : (n.children ?? []).map(textOf).join(""));

/** Memberi id pada h3 (untuk daftar isi) & menyorot tag (ASUMSI). */
function rehypePrd() {
  return (tree: HNode) => {
    const walk = (node: HNode) => {
      if (!node.children) return;
      const next: HNode[] = [];
      for (const child of node.children) {
        if (child.type === "element" && child.tagName === "h3") {
          child.properties = { ...child.properties, id: slugify(textOf(child)) };
        }
        if (child.type === "text" && child.value?.includes("(ASUMSI)")) {
          const parts = child.value.split("(ASUMSI)");
          parts.forEach((p, i) => {
            if (p) next.push({ type: "text", value: p });
            if (i < parts.length - 1)
              next.push({
                type: "element",
                tagName: "span",
                properties: { className: ["assume-tag"], title: "Bagian ini ditebak AI — perlu kamu validasi" },
                children: [{ type: "text", value: "ASUMSI" }],
              });
          });
          continue;
        }
        walk(child);
        next.push(child);
      }
      node.children = next;
    };
    walk(tree);
  };
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypePrd]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
