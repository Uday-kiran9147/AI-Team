import fs from 'fs';
import path from 'path';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { Product, ProductSchema } from '../types/product';

// Mongoose Model Schema
interface IProductDoc extends Document {
  userId: string;
  name: string;
  tagline: string;
  repo: string;
  description: string;
  audience: string;
  tone: string;
  pricing: string;
  brandTokens: {
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
    fontStyle?: string;
  };
  webhookSecret: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductMongooseSchema = new Schema<IProductDoc>(
  {
    userId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    repo: { type: String, required: true },
    description: { type: String, required: true },
    audience: { type: String, required: true },
    tone: { type: String, required: true },
    pricing: { type: String, default: '' },
    brandTokens: {
      primaryColor: { type: String, default: '#2A3BFF' },
      accentColor: { type: String, default: '#1F9D55' },
      logoUrl: { type: String, default: '' },
      fontStyle: { type: String, default: 'Bricolage Grotesque' },
    },
    webhookSecret: { type: String, required: true },
  },
  { timestamps: true }
);

let ProductModel: Model<IProductDoc>;
try {
  ProductModel = mongoose.model<IProductDoc>('Product');
} catch {
  ProductModel = mongoose.model<IProductDoc>('Product', ProductMongooseSchema);
}

// Local File Persistence Fallback
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'products.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalProducts(): Product[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalProducts(products: Product[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

async function connectMongo(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return false;
  if (mongoose.connection.readyState === 1) return true;
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 2500 });
    return true;
  } catch (err) {
    console.warn('[MongoDB] Connection skipped or failed, using local storage fallback.', err);
    return false;
  }
}

export async function getProductsByUser(userId: string): Promise<Product[]> {
  const isMongo = await connectMongo();
  if (isMongo) {
    try {
      const docs = await ProductModel.find({ userId }).sort({ updatedAt: -1 }).lean();
      return docs.map((d) => ({
        id: d._id.toString(),
        userId: d.userId,
        name: d.name,
        tagline: d.tagline,
        repo: d.repo,
        description: d.description,
        audience: d.audience,
        tone: d.tone,
        pricing: d.pricing,
        brandTokens: d.brandTokens,
        webhookSecret: d.webhookSecret,
        createdAt: (d as any).createdAt?.toISOString(),
        updatedAt: (d as any).updatedAt?.toISOString(),
      }));
    } catch (err) {
      console.warn('[MongoDB] Query failed, falling back to local storage:', err);
    }
  }

  const all = readLocalProducts();
  return all.filter((p) => p.userId === userId || userId === 'all');
}

export async function getProductById(id: string): Promise<Product | null> {
  const isMongo = await connectMongo();
  if (isMongo) {
    try {
      const d = await ProductModel.findById(id).lean();
      if (d) {
        return {
          id: d._id.toString(),
          userId: d.userId,
          name: d.name,
          tagline: d.tagline,
          repo: d.repo,
          description: d.description,
          audience: d.audience,
          tone: d.tone,
          pricing: d.pricing,
          brandTokens: d.brandTokens,
          webhookSecret: d.webhookSecret,
          createdAt: (d as any).createdAt?.toISOString(),
          updatedAt: (d as any).updatedAt?.toISOString(),
        };
      }
    } catch (err) {
      console.warn('[MongoDB] FindById failed:', err);
    }
  }

  const all = readLocalProducts();
  return all.find((p) => p.id === id) || null;
}

export async function saveProduct(productData: Partial<Product> & { userId: string }): Promise<Product> {
  const isMongo = await connectMongo();

  const validated = ProductSchema.parse({
    ...productData,
    webhookSecret: productData.webhookSecret || `whsec_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`,
  });

  if (isMongo) {
    try {
      if (productData.id && mongoose.isValidObjectId(productData.id)) {
        const updated = await ProductModel.findByIdAndUpdate(
          productData.id,
          { ...validated },
          { new: true, lean: true }
        );
        if (updated) {
          return {
            id: updated._id.toString(),
            userId: updated.userId,
            name: updated.name,
            tagline: updated.tagline,
            repo: updated.repo,
            description: updated.description,
            audience: updated.audience,
            tone: updated.tone,
            pricing: updated.pricing,
            brandTokens: updated.brandTokens,
            webhookSecret: updated.webhookSecret,
            createdAt: (updated as any).createdAt?.toISOString(),
            updatedAt: (updated as any).updatedAt?.toISOString(),
          };
        }
      }

      const created = await ProductModel.create(validated);
      return {
        id: created._id.toString(),
        userId: created.userId,
        name: created.name,
        tagline: created.tagline,
        repo: created.repo,
        description: created.description,
        audience: created.audience,
        tone: created.tone,
        pricing: created.pricing,
        brandTokens: created.brandTokens,
        webhookSecret: created.webhookSecret,
        createdAt: (created as any).createdAt?.toISOString(),
        updatedAt: (created as any).updatedAt?.toISOString(),
      };
    } catch (err) {
      console.warn('[MongoDB] Save failed, fallback to local storage:', err);
    }
  }

  // Local storage save
  const all = readLocalProducts();
  const now = new Date().toISOString();

  if (productData.id) {
    const idx = all.findIndex((p) => p.id === productData.id);
    if (idx !== -1) {
      const updated: Product = {
        ...all[idx],
        ...validated,
        id: productData.id,
        updatedAt: now,
      };
      all[idx] = updated;
      writeLocalProducts(all);
      return updated;
    }
  }

  const newProduct: Product = {
    ...validated,
    id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: now,
    updatedAt: now,
  };
  all.push(newProduct);
  writeLocalProducts(all);
  return newProduct;
}

export async function deleteProduct(id: string, userId: string): Promise<boolean> {
  const isMongo = await connectMongo();
  if (isMongo) {
    try {
      const res = await ProductModel.deleteOne({ _id: id, userId });
      if (res.deletedCount > 0) return true;
    } catch (err) {
      console.warn('[MongoDB] Delete failed:', err);
    }
  }

  const all = readLocalProducts();
  const filtered = all.filter((p) => !(p.id === id && (p.userId === userId || userId === 'all')));
  if (filtered.length !== all.length) {
    writeLocalProducts(filtered);
    return true;
  }
  return false;
}
