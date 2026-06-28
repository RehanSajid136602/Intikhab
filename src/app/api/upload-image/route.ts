import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin } from '@/lib/supabase/auth';

/**
 * POST /api/upload-image
 * Admin only: uploads an image file to Supabase Storage 'product-images' bucket.
 * Expects multipart/form-data with a 'file' field.
 * Returns: { url: string }
 */
export async function POST(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createClient();

  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File size exceeds the 5MB limit.' }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
  }

  // Validate file extension
  const ext = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif'];
  if (!ext || !allowedExtensions.includes(ext)) {
    return NextResponse.json(
      { error: 'Invalid file extension. Only jpg, jpeg, png, gif, webp, avif are allowed.' },
      { status: 400 },
    );
  }

  // Generate unique filename
  const fileName = `product-${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error('Supabase upload error:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('product-images').getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl });
}
