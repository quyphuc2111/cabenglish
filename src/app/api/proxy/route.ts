import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'Origin': 'https://lms.bkt.net.vn',
        'Referer': 'https://lms.bkt.net.vn/',
      },
    });

    const headers = new Headers();
    headers.set('Access-Control-Allow-Origin', '*');
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', '*');
    
    // Sao chép các headers quan trọng từ response gốc
    const contentType = response.headers.get('content-type');
    if (contentType) headers.set('Content-Type', contentType);

    const content = await response.text();
    return new NextResponse(content, { headers });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Error fetching content', { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  // Xử lý preflight request
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
} 