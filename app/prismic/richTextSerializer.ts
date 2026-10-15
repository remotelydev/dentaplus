import { type HTMLRichTextMapSerializer } from '@prismicio/client';

const serializer: HTMLRichTextMapSerializer = {
  heading1: ({ children }) =>
    `<h1 class="font-semibold leading-tight tracking-tight md:leading-tight text-4xl md:text-5xl mb-7 mt-12 first:mt-0 last:mb-0">${children}</h1>`,
  heading2: ({ children }) =>
    `<h2 class="font-semibold leading-tight tracking-tight md:leading-tight text-3xl md:text-4xl mb-7 mt-12 first:mt-0 last:mb-0">${children}</h2>`,
  heading3: ({ children }) =>
    `<h3 class="font-semibold leading-tight tracking-tight md:leading-tight text-xl md:text-2xl mb-7 mt-12 first:mt-0 last:mb-0">${children}</h3>`,
  paragraph: ({ children }) =>
    `<p class="mb-7 last:mb-0">${children}</p>`,
  oList: ({ children }) =>
    `<ol class="mb-7 pl-4 last:mb-0 md:pl-6">${children}</ol>`,
  oListItem: ({ children }) =>
    `<li class="mb-1 list-decimal pl-1 last:mb-0 md:pl-2">${children}</li>`,
  list: ({ children }) =>
    `<ul class="mb-7 pl-4 last:mb-0 md:pl-6">${children}</ul>`,
  listItem: ({ children }) =>
    `<li class="mb-1 list-disc pl-1 last:mb-0 md:pl-2">${children}</li>`,
  preformatted: ({ children }) =>
    `<pre class="mb-7 rounded bg-slate-100 p-4 text-sm last:mb-0 md:p-8 md:text-lg"><code>${children}</code></pre>`,
  strong: ({ children }) =>
    `<strong class="font-semibold">${children}</strong>`,
  hyperlink: ({ children, node }) =>
    `<a href="${node.data.url}" class="underline decoration-1 underline-offset-2">${children}</a>`
}

export default serializer;