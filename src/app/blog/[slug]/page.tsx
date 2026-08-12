import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPost } from "@/lib/blog";
import { extractToc } from "@/lib/toc";
import { MdxContent } from "@/components/mdx-content";
import { DocsToc } from "@/components/docs/docs-toc";
import {
  InstrumentLabel,
  MetaRow,
  FramedPanel,
  ProductCover,
} from "@/components/instrument";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const toc = extractToc(post.body);

  const related = getAllPosts()
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tags.some((t) => post.tags.includes(t)),
    )
    .slice(0, 3);

  return (
    <div>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.05fr_0.95fr] sm:px-6">
        <ProductCover
          accent={post.coverAccent}
          name={post.title}
          imageSrc={post.coverImage}
          showName={false}
          textBackdrop
          className="min-h-[220px] lg:min-h-[320px]"
        />

        <div className="space-y-6">
          <div className="space-y-3">
            <InstrumentLabel>{formatDate(post.publishedAt)}</InstrumentLabel>
            <h1 className="font-brand text-4xl font-bold tracking-tight">
              {post.title}
            </h1>
            <p className="text-lg text-muted-foreground">{post.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex h-5 items-center rounded-none border border-border px-2 font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          <MetaRow
            items={[
              { label: "Author", value: post.author },
              { label: "Read", value: `${post.readingMinutes} min` },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {post.body.trim() ? (
          <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <DocsToc items={toc} />
            <FramedPanel
              className="glass-panel backdrop-blur-xl"
              contentClassName="p-6 sm:p-8"
            >
              <InstrumentLabel className="mb-4 block">
                Field brief
              </InstrumentLabel>
              <MdxContent source={post.body} />
            </FramedPanel>
          </div>
        ) : (
          <FramedPanel
            className="border-dashed glass-panel backdrop-blur-xl"
            contentClassName="px-6 py-10"
          >
            <p className="font-mono text-sm uppercase tracking-[0.18em] text-muted-foreground">
              Entry body empty
            </p>
          </FramedPanel>
        )}

        {related.length > 0 && (
          <div className="mt-10 space-y-4">
            <InstrumentLabel>Related notes</InstrumentLabel>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/blog/${item.slug}/`}>
                  <FramedPanel
                    className="glass-panel h-full backdrop-blur-xl transition-colors hover:border-primary/50"
                    contentClassName="p-4"
                  >
                    <p className="font-brand font-bold">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.excerpt}
                    </p>
                  </FramedPanel>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
