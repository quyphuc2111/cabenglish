// src/components/CookieSetter.tsx
'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

// Function to parse the complete cookie string
function parseCookieString(cookieString: string) {
  // Extract the basic name=value part
  const mainMatch = cookieString.match(/^([^=]+)=([^;]+)/);
  if (!mainMatch || mainMatch.length < 3) return null;
  
  const name = mainMatch[1].trim();
  const value = mainMatch[2].trim();
  
  // Extract other attributes
  const expires = cookieString.match(/expires=([^;]+)/i)?.[1]?.trim();
  const path = cookieString.match(/path=([^;]+)/i)?.[1]?.trim() || '/';
  const secure = cookieString.includes('secure');
  const sameSite = cookieString.match(/samesite=([^;]+)/i)?.[1]?.trim();
  const httpOnly = cookieString.includes('httponly');
  
  return {
    name,
    value,
    expires,
    path,
    secure,
    sameSite,
    httpOnly
  };
}

// Get API domain for cookies
function getApiDomain() {
  // Get API URL from environment
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  try {
    // Parse domain from API URL
    const url = new URL(apiUrl);
    
    // For cross-domain cookies, we'll need the base domain or exact domain
    // Get the hostname first
    const hostname = url.hostname;
    
    console.log('API hostname:', hostname);
    
    // For development with different domains, you might need to return the exact API domain
    // For production, you might want to extract the base domain
    return hostname;
  } catch (error) {
    console.error('Error extracting domain from API URL:', error);
    // Default domain for development
    return 'smkapi2025.bkt.net.vn';
  }
}

export default function CookieSetter() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.moodleCookie) {
      console.log('CookieSetter: Found moodleCookie in session');
      
      try {
        // Parse the complete cookie
        const parsedCookie = parseCookieString(session.user.moodleCookie);
        
        if (parsedCookie) {
          
          // Get API domain
          const apiDomain = getApiDomain();
          console.log(`CookieSetter: Using API domain: ${apiDomain}`);
          
          // Build cookie string with all original attributes except httpOnly
          // httpOnly can only be set by the server
          let cookieString = `${parsedCookie.name}=${parsedCookie.value}`;
          
          // Add domain - required for API access
          cookieString += `; domain=${apiDomain}`;
          
          // Always use path=/
          cookieString += `; path=/`;
          
          if (parsedCookie.expires) {
            cookieString += `; expires=${parsedCookie.expires}`;
          }
          
          // For cross-domain cookies, always use secure and SameSite=None
          cookieString += '; secure; samesite=none';
          
          // Set the cookie in the browser with cross-domain attributes
          document.cookie = cookieString;
          
          // Also try without domain to see if that helps
          let cookieWithoutDomain = `${parsedCookie.name}=${parsedCookie.value}; path=/; secure; samesite=none`;
          if (parsedCookie.expires) {
            cookieWithoutDomain += `; expires=${parsedCookie.expires}`;
          }
          document.cookie = cookieWithoutDomain;
          
          // Also call the API for httpOnly and other server-side attributes
          fetch('/api/set-cookie', {
            credentials: 'include'
          }).then(response => {
            if (response.ok) {
              console.log('CookieSetter: API route successfully called');
            } else {
              console.error('CookieSetter: API route returned error status', response.status);
            }
          }).catch(err => {
            console.error('CookieSetter: API call failed:', err);
          });
          
          // Add a diagnostic log to check if the cookie is present after setting
          setTimeout(() => {
            console.log('CookieSetter: Current cookies:', document.cookie);
          }, 500);
        } else {
          console.log('CookieSetter: Failed to parse cookie string');
        }
      } catch (err) {
        console.error('CookieSetter: Error setting cookie:', err);
      }
    } else {
      console.log('CookieSetter: No authCookie in session');
    }
  }, [session]);

  // This component doesn't render anything
  return null;
}