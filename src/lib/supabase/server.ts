import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

/**
 * WHAT THIS FILE DOES
 * -------------------
 * Creates a **server-side Supabase client** that is:
 *   1) **Cookie-aware** (reads/writes auth cookies via Next.js cookies API)
 *   2) **Cache-tag aware** (optionally adds Next.js `next.tags` to all fetches)
 *
 * WHY:
 * - Supabase Auth stores/refreshes the session in cookies. On the server, we must
 *   pass cookie getters/setters to `createServerClient` so Supabase can read the
 *   session and (when allowed) write refreshed tokens.
 * - We also want all data reads done through this client to carry a cache tag,
 *   so `revalidateTag('entries:<uid>')` invalidates the dashboard immediately.
 *
 * NEXT 15 NOTE:
 * - `cookies()` is async in Next 15+, so this factory is async too.
 * - Supabase now expects `cookies.getAll` / `cookies.setAll` (not get/set/remove).
 *
 * USAGE:
 *   const supabase = await createClient(`entries:${userId}`); // tag is optional
 *   const { data } = await supabase.from('entries').select('*');
 */
export async function createClient(tag?: string) {
  // In server components/actions, this is the request-scoped cookie jar.
  // In RSC it's often read-only; in Route Handlers it can be writable.
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // NEW API: use getAll/setAll instead of get/set/remove
      cookies: {
        /**
         * Return all cookies as { name, value } pairs so Supabase can
         * read the auth session (access/refresh tokens).
         */
        getAll() {
          // Next's cookieStore.getAll() already returns { name, value }[]
          // compatible with Supabase's expectation.
          return cookieStore
            .getAll()
            .map(({ name, value }) => ({ name, value }));
        },

        /**
         * Allow Supabase to set/refresh auth cookies when possible.
         * In RSC, cookies are read-only; trying to set will throw,
         * so we swallow errors. In Route Handlers/Server Actions,
         * this will succeed and persist updated tokens.
         */
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // In RSC this is read-only (throws); in routes it's writable.
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // No-op in read-only contexts (Server Components).
          }
        },
      },

      /**
       * Ensure **every** network call made by the Supabase client
       * preserves existing fetch init AND (optionally) carries a Next.js cache tag.
       * This lets us call `revalidateTag(tag)` after mutations to refresh lists.
       */
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          if (!tag) return fetch(input as any, init as any);

          // Merge any existing `next.tags` with our provided tag (de-duped).
          const existingNext = (init as any)?.next ?? {};
          const existingTags: string[] = Array.isArray(existingNext.tags)
            ? existingNext.tags
            : existingNext.tags
            ? [existingNext.tags]
            : [];

          const mergedInit: RequestInit & { next?: { tags?: string[] } } = {
            ...init,
            next: {
              ...existingNext,
              tags: Array.from(new Set([...existingTags, tag])),
            },
          };

          return fetch(input as any, mergedInit as any);
        },
      },
    }
  );
}
