import { NextResponse } from 'next/server';

/*
import { auth } from '@clerk/nextjs/server';
import { getProductsByUser, saveProduct } from '@/lib/storage/products';
*/

export async function GET() {
  return NextResponse.json({ success: true, products: [] });
}

export async function POST() {
  return NextResponse.json({ success: true });
}
