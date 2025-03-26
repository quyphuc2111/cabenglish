import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(request: NextRequest) {
  const token = await getToken({ req: request as any });
  
  if (token?.authCookie) {
    // Tạo response với cookie từ session
    const response = NextResponse.json({ success: true });
    
    // Phân tích cookie string và thiết lập
    // Lưu ý: Đây là cách đơn giản, bạn có thể cần phân tích cookie string phức tạp hơn
    const cookieParts = token.authCookie.split(';')[0].split('=');
    if (cookieParts.length >= 2) {
      const cookieName = cookieParts[0].trim();
      const cookieValue = cookieParts[1].trim();
      
      response.cookies.set({
        name: cookieName,
        value: cookieValue,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/'
      });
    }
    
    return response;
  }
  
  return NextResponse.json({ success: false, message: 'No cookie found in session' });
}
