import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { deleteProduct } from '@/lib/storage/products';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth().catch(() => ({ userId: null }));
    const userId = session?.userId || 'usr_local_founder';

    const ok = await deleteProduct(id, userId);
    return NextResponse.json({ success: ok });
  } catch (err: any) {
    console.error('Error deleting product:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
