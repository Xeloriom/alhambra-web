import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE = 'https://www.alhambra-web.com'
const NOW    = '2026-05-19'
const RECENT = '2026-05-19'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Homepage ──────────────────────────────────────────────────────────
    {
      url: `${BASE}/`,
      lastModified: NOW,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ── SEO landing page ──────────────────────────────────────────────────────
    {
      url: `${BASE}/agence-seo-lyon/`,
      lastModified: NOW,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },

    // ── Local SEO landing pages ───────────────────────────────────────────
    {
      url: `${BASE}/agence-web-lyon/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/agence-web-ain/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/agence-web-isere/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/creation-site-web-lyon/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/agence-web-rhone-alpes/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/agence-web-pont-de-cheruy/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE}/agence-web-villeurbanne/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE}/creation-site-web-restaurant/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
