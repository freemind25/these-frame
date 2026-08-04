# Task 3 - api-routes-agent

## Task
Create all auth provider API routes (12 files)

## Status: Completed

## Files Created
1. `src/app/api/auth/providers/route.ts` - GET (list + seed), POST (save config), DELETE (remove config)
2. `src/app/api/auth/providers/test/route.ts` - POST (test connection)
3. `src/app/api/auth/providers/accounts/route.ts` - GET (list accounts with optional provider filter)
4. `src/app/api/auth/auth0/authorize/route.ts` - GET (build Auth0 authorize URL)
5. `src/app/api/auth/auth0/callback/route.ts` - GET (OAuth callback: exchange code, get user info, upsert account, set session cookie, redirect)
6. `src/app/api/auth/auth0/userinfo/route.ts` - GET (get current user from session cookie)
7. `src/app/api/auth/stytch/send-otp/route.ts` - POST (send OTP)
8. `src/app/api/auth/stytch/verify-otp/route.ts` - POST (verify OTP, upsert account, set cookie)
9. `src/app/api/auth/stytch/send-magic-link/route.ts` - POST (send magic link)
10. `src/app/api/auth/stytch/verify-magic-link/route.ts` - POST (verify magic link, upsert account, set cookie)
11. `src/app/api/auth/warrant/check/route.ts` - POST (check feature access)
12. `src/app/api/auth/warrant/policies/route.ts` - GET/POST/PUT/DELETE (CRUD + sync)

## Key Implementation Details
- All imports use named exports from `@/lib/auth-providers`
- DB access via `import { db } from '@/lib/db'`
- Session cookie: `tf_auth_session` (httpOnly, secure in prod, 7-day maxAge)
- Auth0 callback redirects to `/` with optional `auth_error` query param on failure
- All error messages in French
- AuthAccount upsert uses `providerId_providerUserId` composite key
- Session tokens stored in `metadata.sessionToken` field
