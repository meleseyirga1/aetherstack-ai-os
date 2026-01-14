import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Allow everyone to see the landing page ('/')
  // But force login for any internal API calls or dashboard routes
  if (!session && request.nextUrl.pathname.startsWith('/api/alpha')) {
    return NextResponse.json({ error: 'Sovereign ID Required' }, { status: 401 })
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}