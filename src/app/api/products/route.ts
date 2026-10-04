import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getProductsByUser, saveProduct } from '@/lib/storage/products';
import { ProductSchema } from '@/lib/types/product';

export async function GET() {
  try {
    const session = await auth().catch(() => ({ userId: null }));
    const userId = session?.userId || 'usr_local_founder';

    const products = await getProductsByUser(userId);
    return NextResponse.json({ success: true, products });
  } catch (err: any) {
    console.error('Error fetching products:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth().catch(() => ({ userId: null }));
    const userId = session?.userId || 'usr_local_founder';

    const body = await req.json();
    const validated = ProductSchema.parse({
      ...body,
      userId,
    });

    const saved = await saveProduct(validated);
    return NextResponse.json({ success: true, product: saved });
  } catch (err: any) {
    console.error('Error saving product brief:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Validation error' },
      { status: 400 }
    );
  }
}
