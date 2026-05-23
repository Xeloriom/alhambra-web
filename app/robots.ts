import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Standard: allow all except private routes ──────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/fonts/'],
      },

      // ── Google ─────────────────────────────────────────────────────────
      { userAgent: 'Googlebot',       allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'Googlebot-Image', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' }, // Gemini AI training

      // ── Microsoft / Bing ───────────────────────────────────────────────
      { userAgent: 'Bingbot',     allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'msnbot',      allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'BingPreview', allow: '/' },

      // ── Yahoo ──────────────────────────────────────────────────────────
      { userAgent: 'Slurp', allow: '/', disallow: ['/api/', '/admin/'] },

      // ── DuckDuckGo ─────────────────────────────────────────────────────
      { userAgent: 'DuckDuckBot', allow: '/' },

      // ── Apple ──────────────────────────────────────────────────────────
      { userAgent: 'Applebot',           allow: '/' },
      { userAgent: 'Applebot-Extended',  allow: '/' },

      // ── Yandex ─────────────────────────────────────────────────────────
      { userAgent: 'YandexBot',          allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'YandexImages',       allow: '/' },

      // ── OpenAI / ChatGPT ───────────────────────────────────────────────
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User',  allow: '/' },

      // ── Anthropic / Claude ─────────────────────────────────────────────
      { userAgent: 'ClaudeBot',     allow: '/' },
      { userAgent: 'anthropic-ai',  allow: '/' },
      { userAgent: 'Claude-Web',    allow: '/' },

      // ── Perplexity ─────────────────────────────────────────────────────
      { userAgent: 'PerplexityBot', allow: '/' },

      // ── Cohere AI ──────────────────────────────────────────────────────
      { userAgent: 'cohere-ai', allow: '/' },

      // ── Meta / Facebook AI ─────────────────────────────────────────────
      { userAgent: 'Meta-ExternalAgent',    allow: '/' },
      { userAgent: 'Meta-ExternalFetcher',  allow: '/' },
      { userAgent: 'facebookexternalhit',   allow: '/' },

      // ── Common Crawl (AI training datasets) ───────────────────────────
      { userAgent: 'CCBot', allow: '/' },

      // ── Diffbot (used by AI/knowledge companies) ───────────────────────
      { userAgent: 'Diffbot', allow: '/' },

      // ── ByteDance / TikTok ─────────────────────────────────────────────
      { userAgent: 'Bytespider', allow: '/' },

      // ── Social media preview bots ─────────────────────────────────────
      { userAgent: 'LinkedInBot', allow: '/' },
      { userAgent: 'Twitterbot',  allow: '/' },
      { userAgent: 'Slackbot',    allow: '/' },
      { userAgent: 'WhatsApp',    allow: '/' },

      // ── Internet Archive / Wayback Machine ────────────────────────────
      { userAgent: 'ia_archiver', allow: '/' },

      // ── SEO tools — allow so tools like SEMrush can track rankings ──────
      { userAgent: 'SemrushBot',    allow: '/' },
      { userAgent: 'AhrefsBot',     allow: '/' },
      { userAgent: 'MajesticBot',   allow: '/' },
      { userAgent: 'DataForSeoBot', allow: '/' },

      // ── Block aggressive link scrapers only ───────────────────────────
      { userAgent: 'MJ12bot',  disallow: '/' },
      { userAgent: 'DotBot',   disallow: '/' },
      { userAgent: 'BLEXBot',  disallow: '/' },
      { userAgent: 'SEOkicks', disallow: '/' },
      { userAgent: 'PetalBot', disallow: '/' },
    ],
    sitemap: 'https://www.alhambra-web.com/sitemap.xml',
    host: 'https://www.alhambra-web.com',
  }
}
