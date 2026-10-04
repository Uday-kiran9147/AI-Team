import { z } from 'zod';

export interface BrandTokens {
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  fontStyle?: string;
}

export interface Product {
  id?: string;
  userId: string;
  name: string;
  tagline: string;
  repo: string;
  description: string;
  audience: string;
  tone: string;
  pricing?: string;
  brandTokens: BrandTokens;
  webhookSecret: string;
  createdAt?: string;
  updatedAt?: string;
}

export const BrandTokensSchema = z.object({
  primaryColor: z.string().default('#2A3BFF'),
  accentColor: z.string().default('#1F9D55'),
  logoUrl: z.string().optional().default(''),
  fontStyle: z.string().optional().default('Bricolage Grotesque'),
});

export const ProductSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  tagline: z.string().min(5, 'Tagline must be at least 5 characters'),
  repo: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'Repo must be in owner/repo format (e.g. acme/tablely)'),
  description: z.string().min(10, 'Product brief must be at least 10 characters'),
  audience: z.string().min(3, 'Target audience is required'),
  tone: z.string().min(3, 'Tone and voice guidelines are required'),
  pricing: z.string().optional().default('Free during beta / Subscription'),
  brandTokens: BrandTokensSchema.default({
    primaryColor: '#2A3BFF',
    accentColor: '#1F9D55',
    logoUrl: '',
    fontStyle: 'Bricolage Grotesque',
  }),
  webhookSecret: z.string().default(() => `whsec_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
