# Core Web Vitals / CrUX tracking

Field data (CrUX) is what Google uses for ranking. Lab Lighthouse is only a proxy.

## How to read field CWV

1. [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https://www.dentaplus.pl/) — “Discover what your real users are experiencing”.
2. Search Console → Experience → Core Web Vitals (URL groups, 28-day CrUX).
3. If CrUX is empty, traffic is too low; keep lab notes and re-check monthly.

## Log

| Date | Source | URL | LCP | INP | CLS | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-09-13 | Lab Lighthouse 11.6 mobile | https://www.dentaplus.pl/ | 3.8 s | — (TBT 20 ms) | 0.087 | Pre-fix baseline from SEO audit. Field CrUX not available in that environment. |
| 2026-09-13 | CrUX / PSI field | https://www.dentaplus.pl/ | TBD | TBD | TBD | Re-measure after the LCP image/font deploy is live on Netlify. Do not invent numbers if CrUX is still empty. |

Re-check the homepage after production deploy of `perf: constrain Prismic images and Inter subsets`.
