import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import type { ComponentProps } from "react";
import { CodeBlock } from "@/components/docs/code-block";
import { cn } from "@/lib/utils";

const basePath = (process.env.BASE_PATH ?? "").replace(/\/$/, "");

function withBasePath(src?: string) {
  if (!src) return src;
  if (/^(https?:|data:|\/\/)/i.test(src)) return src;
  if (src.startsWith("/") && basePath) return `${basePath}${src}`;
  return src;
}

function DocsImage({
  src,
  alt = "",
  className,
  ...props
}: ComponentProps<"img">) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={withBasePath(typeof src === "string" ? src : undefined)}
      alt={alt}
      className={cn(
        "my-6 h-auto max-w-full border border-border",
        className,
      )}
      {...props}
    />
  );
}

const components = {
  img: DocsImage,
  pre: CodeBlock,
};

export async function MdxContent({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <div className={cn("prose-rhi", className)}>
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypePrettyCode,
                {
                  theme: {
                    light: "github-light",
                    dark: "github-dark",
                  },
                  keepBackground: false,
                  defaultLang: "plaintext",
                  onVisitLine(node: { children: unknown[] }) {
                    if (node.children.length === 0) {
                      node.children = [{ type: "text", value: " " }];
                    }
                  },
                },
              ],
            ],
          },
        }}
      />
    </div>
  );
}
