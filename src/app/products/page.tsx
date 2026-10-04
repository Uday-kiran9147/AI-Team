'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, Show, SignInButton } from '@clerk/nextjs';
import {
  Sparkles,
  GitBranch,
  Save,
  Trash2,
  Plus,
  Copy,
  Check,
  ArrowLeft,
  Palette,
  ShieldCheck,
  Layers,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import { Product } from '@/lib/types/product';

const DEFAULT_PRODUCT: Partial<Product> = {
  name: 'Tablely',
  tagline: "Find restaurants that are open right now, without guessing",
  repo: 'acme/tablely',
  description:
    'A fast, hyper-local restaurant discovery app focused on real-time opening hours and accurate dietary filters. Built for diners who hate arriving at closed kitchens.',
  audience: 'City explorers, foodies, late-night diners, and busy urban professionals.',
  tone: 'Concise, direct, authentic, builder-first. No corporate buzzwords or hype words like revolutionary or game-changing.',
  pricing: 'Free tier + $9/mo Pro search filters',
  brandTokens: {
    primaryColor: '#2A3BFF',
    accentColor: '#1F9D55',
    logoUrl: '',
    fontStyle: 'Bricolage Grotesque',
  },
};

export default function ProductsPage() {
  const { user, isLoaded } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string>('new');
  const [formData, setFormData] = useState<Partial<Product>>(DEFAULT_PRODUCT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'idle'; text: string }>({
    type: 'idle',
    text: '',
  });

  // Fetch user products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
        if (data.products.length > 0 && selectedId === 'new') {
          setSelectedId(data.products[0].id);
          setFormData(data.products[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectProduct = (id: string) => {
    setSelectedId(id);
    setStatusMessage({ type: 'idle', text: '' });
    if (id === 'new') {
      setFormData({
        name: '',
        tagline: '',
        repo: '',
        description: '',
        audience: '',
        tone: '',
        pricing: '',
        brandTokens: {
          primaryColor: '#2A3BFF',
          accentColor: '#1F9D55',
          logoUrl: '',
          fontStyle: 'Bricolage Grotesque',
        },
      });
    } else {
      const found = products.find((p) => p.id === id);
      if (found) {
        setFormData(found);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: 'idle', text: '' });

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: selectedId !== 'new' ? selectedId : undefined,
        }),
      });
      const data = await res.json();

      if (data.success && data.product) {
        setStatusMessage({
          type: 'success',
          text: 'Product memory saved successfully. Your AI team is now calibrated to this brief!',
        });
        await fetchProducts();
        setSelectedId(data.product.id);
        setFormData(data.product);
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to save product brief',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Network error while saving',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (selectedId === 'new') return;
    if (!confirm('Are you sure you want to delete this product memory?')) return;

    try {
      const res = await fetch(`/api/products/${selectedId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: 'Product removed.' });
        setSelectedId('new');
        setFormData(DEFAULT_PRODUCT);
        await fetchProducts();
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  const copyWebhookSecret = () => {
    if (formData.webhookSecret) {
      navigator.clipboard.writeText(formData.webhookSecret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  return (
    <div className="wrap py-6 sm:py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--line)]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--ink)] mb-2 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Tenfold</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Product Memory &amp; Brief
            </h1>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[var(--accent)] text-[var(--accent-ink)]">
              Week 1 Foundation
            </span>
          </div>
          <p className="text-sm text-[var(--muted)] mt-1">
            Connect your repository and calibrate your AI team with your voice, audience, and brand tokens.
          </p>
        </div>

        {/* Product Selector */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <select
            value={selectedId}
            onChange={(e) => handleSelectProduct(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-[var(--surface)] border border-[var(--line)] text-sm font-medium text-[var(--ink)] cursor-pointer focus:outline-none focus:border-[var(--accent)]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.repo})
              </option>
            ))}
            <option value="new">+ Add New Product</option>
          </select>

          <button
            type="button"
            onClick={() => handleSelectProduct('new')}
            className="p-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--bg)] text-[var(--ink)] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Create new product"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
        {/* Left Form (8 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-8 space-y-6">
          {/* Section 1: Repo & Identity */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
              <GitBranch className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-base font-bold">1. GitHub Connection &amp; Identity</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tablely"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  GitHub Repository (owner/repo) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. acme/tablely"
                  value={formData.repo || ''}
                  onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm font-mono text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                One-Line Tagline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Find restaurants that are open right now"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {/* Section 2: Product Brief & Memory */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
              <Layers className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-base font-bold">2. Product Brief &amp; Context</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                What does this product do? (Product Brief) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain what the product does, the key problem it solves, and how it works..."
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
              <p className="text-[11px] text-[var(--muted)] mt-1">
                The Marketer agent references this on every release to understand the domain and value.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Target Audience <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solo founders, developers, city foodies"
                  value={formData.audience || ''}
                  onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Pricing / Business Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free beta / $19/mo per seat"
                  value={formData.pricing || ''}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Founder Tone & Brand Tokens */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
              <Palette className="w-4 h-4 text-[var(--accent)]" />
              <h2 className="text-base font-bold">3. Tone of Voice &amp; Brand Tokens</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                Tone &amp; Style Rules <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Direct, technical, authentic builder voice. No emojis unless necessary. No hype buzzwords."
                value={formData.tone || ''}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brandTokens?.primaryColor || '#2A3BFF'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandTokens: {
                          ...formData.brandTokens!,
                          primaryColor: e.target.value,
                        },
                      })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--line)] p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.brandTokens?.primaryColor || '#2A3BFF'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandTokens: {
                          ...formData.brandTokens!,
                          primaryColor: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--ink)] mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.brandTokens?.accentColor || '#1F9D55'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandTokens: {
                          ...formData.brandTokens!,
                          accentColor: e.target.value,
                        },
                      })
                    }
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--line)] p-0.5 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.brandTokens?.accentColor || '#1F9D55'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        brandTokens: {
                          ...formData.brandTokens!,
                          accentColor: e.target.value,
                        },
                      })
                    }
                    className="flex-1 px-3.5 py-2 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center gap-2 text-sm font-semibold disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Brief...' : 'Save Product Memory'}</span>
              </button>

              {selectedId !== 'new' && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2.5 rounded-lg border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>

            {statusMessage.text && (
              <span
                className={`text-xs font-medium ${
                  statusMessage.type === 'error' ? 'text-rose-500' : 'text-emerald-500'
                }`}
              >
                {statusMessage.text}
              </span>
            )}
          </div>
        </form>

        {/* Right Sidebar: Webhook Setup & Live AI Preview (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Memory Preview Card */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <span className="text-xs font-bold text-[var(--ink)]">AI Teammate Preview</span>
              <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Ready
              </span>
            </div>

            <div
              className="p-4 rounded-xl text-white space-y-2"
              style={{
                backgroundColor: formData.brandTokens?.primaryColor || '#2A3BFF',
              }}
            >
              <div className="flex items-center justify-between text-xs opacity-85">
                <span className="font-bold">{formData.name || 'Product'}</span>
                <span className="font-mono text-[10px]">v1.0.0</span>
              </div>
              <p className="text-sm font-semibold leading-snug">
                {formData.tagline || 'Your release headline will appear here.'}
              </p>
              <div className="pt-2 flex items-center gap-2 text-[10px]">
                <span
                  className="px-2 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor: formData.brandTokens?.accentColor || '#1F9D55',
                    color: '#fff',
                  }}
                >
                  New Release
                </span>
                <span className="opacity-80 font-mono">
                  {formData.repo || 'owner/repo'}
                </span>
              </div>
            </div>

            <div className="text-xs text-[var(--muted)] space-y-1.5 pt-1">
              <div>
                <strong className="text-[var(--ink)]">Voice Rule:</strong>{' '}
                <span className="italic">
                  {formData.tone ? `"${formData.tone.substring(0, 90)}..."` : 'Default tone'}
                </span>
              </div>
              <div>
                <strong className="text-[var(--ink)]">Audience:</strong>{' '}
                <span>{formData.audience || 'General'}</span>
              </div>
            </div>
          </div>

          {/* GitHub Webhook Details */}
          <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl p-5 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--line)]">
              <Terminal className="w-4 h-4 text-[var(--accent)]" />
              <h3 className="text-xs font-bold text-[var(--ink)]">GitHub Webhook Setup</h3>
            </div>

            <p className="text-xs text-[var(--muted)] leading-relaxed">
              In your GitHub repo settings &rarr; <strong>Webhooks &rarr; Add webhook</strong>:
            </p>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[var(--muted)] block">PAYLOAD URL</span>
              <div className="p-2.5 rounded-lg bg-[var(--bg)] border border-[var(--line)] text-xs font-mono text-[var(--ink)] break-all select-all">
                https://your-domain.com/api/webhooks/github
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-[var(--muted)] block">WEBHOOK SECRET</span>
              <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[var(--bg)] border border-[var(--line)]">
                <code className="text-xs font-mono text-[var(--ink)] truncate">
                  {formData.webhookSecret || 'whsec_auto_generated'}
                </code>
                <button
                  type="button"
                  onClick={copyWebhookSecret}
                  className="p-1.5 rounded hover:bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                  title="Copy secret"
                >
                  {copiedSecret ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[var(--muted)] border-t border-[var(--line)] flex items-center justify-between">
              <span>Events: Releases &amp; Merged PRs</span>
              <span className="text-emerald-500 font-mono">HMAC SHA-256</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
