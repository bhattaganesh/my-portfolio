import { z } from 'zod';

/** Inline content inside a block. Text is stored as plain strings and rendered as React text, never as HTML. */
export type Inline =
  | { t: 'text'; value: string }
  | { t: 'code'; value: string }
  | { t: 'strong'; children: Inline[] }
  | { t: 'em'; children: Inline[] }
  | { t: 'link'; href: string; children: Inline[] };

/** Only absolute https: or mailto: URLs survive archiving. */
const safeHref = z
  .string()
  .url()
  .refine((href) => /^(https:|mailto:)/.test(href), 'Only https: and mailto: links are allowed');

export const inlineSchema: z.ZodType<Inline> = z.lazy(() =>
  z.discriminatedUnion('t', [
    z.object({ t: z.literal('text'), value: z.string() }).strict(),
    z.object({ t: z.literal('code'), value: z.string() }).strict(),
    z.object({ t: z.literal('strong'), children: z.array(inlineSchema) }).strict(),
    z.object({ t: z.literal('em'), children: z.array(inlineSchema) }).strict(),
    z.object({ t: z.literal('link'), href: safeHref, children: z.array(inlineSchema) }).strict(),
  ]),
);

export const blockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('heading'), level: z.union([z.literal(2), z.literal(3), z.literal(4)]), inlines: z.array(inlineSchema).min(1) }).strict(),
  z.object({ type: z.literal('paragraph'), inlines: z.array(inlineSchema).min(1) }).strict(),
  z.object({ type: z.literal('list'), ordered: z.boolean(), items: z.array(z.array(inlineSchema).min(1)).min(1) }).strict(),
  z.object({ type: z.literal('code'), lang: z.string().regex(/^[a-z0-9+#-]{1,20}$/).optional(), text: z.string().min(1) }).strict(),
  z.object({ type: z.literal('quote'), inlines: z.array(inlineSchema).min(1) }).strict(),
]);

export type Block = z.infer<typeof blockSchema>;

export const blocksSchema = z.array(blockSchema);

export const noteSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    title: z.string().min(1),
    publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/),
    published: z.boolean(),
    provenance: z.object({ sourceUrl: z.string().url(), capturedFrom: z.string().min(1), capturedAt: z.string().min(1) }).strict(),
    blocks: blocksSchema.min(1),
  })
  .strict();

export type Note = z.infer<typeof noteSchema>;
