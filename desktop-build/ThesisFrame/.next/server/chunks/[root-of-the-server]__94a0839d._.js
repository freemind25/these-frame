module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),a=e.i(14747);try{let e=(0,a.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let n=globalThis,o=n.prisma??new t.PrismaClient({log:[]});async function i(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await o.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS User (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        name TEXT,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS Post (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        published INTEGER NOT NULL DEFAULT 0,
        authorId TEXT NOT NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS MendeleyConfig (
        id TEXT PRIMARY KEY,
        clientId TEXT,
        clientSecret TEXT,
        accessToken TEXT,
        refreshToken TEXT,
        tokenExpiresAt DATETIME,
        connected INTEGER NOT NULL DEFAULT 0,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS Reference (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL DEFAULT 'article',
        citationKey TEXT,
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        year TEXT,
        journal TEXT,
        volume TEXT,
        number TEXT,
        pages TEXT,
        doi TEXT,
        abstract TEXT,
        tags TEXT,
        notes TEXT,
        source TEXT NOT NULL DEFAULT 'manual',
        mendeleyId TEXT UNIQUE,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS Thesis (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL DEFAULT 'Ma these de doctorat',
        subtitle TEXT,
        author TEXT NOT NULL DEFAULT 'Doctorant',
        field TEXT NOT NULL DEFAULT '',
        university TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'draft',
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS Chapter (
        id TEXT PRIMARY KEY,
        thesisId TEXT NOT NULL REFERENCES Thesis(id) ON DELETE CASCADE,
        "order" INTEGER NOT NULL,
        number TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        wordCount INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'draft',
        directorFeedback TEXT,
        directorFeedbackAt DATETIME,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT Chapter_thesisId_order_key UNIQUE(thesisId, "order")
      );
      CREATE TABLE IF NOT EXISTS CloudDriveConnection (
        id TEXT PRIMARY KEY,
        provider TEXT NOT NULL DEFAULT 'google_drive',
        connected INTEGER NOT NULL DEFAULT 0,
        email TEXT,
        displayName TEXT,
        accessToken TEXT,
        refreshToken TEXT,
        tokenExpiresAt DATETIME,
        lastSyncAt DATETIME,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)}catch(e){console.error("ensureDb error:",e)}}n.prisma=o,e.s(["db",0,o,"ensureDb",()=>i])},9946,e=>{"use strict";var t=e.i(43793);let r="https://oauth2.googleapis.com/token",a="https://www.googleapis.com/drive/v3";function n(e){let t=e||process.env.NEXT_PUBLIC_APP_URL;if(!t)throw Error("NEXT_PUBLIC_APP_URL is not set. Add it to .env, e.g. NEXT_PUBLIC_APP_URL=https://these-frame.vercel.app");let r=t.replace(/\/+$/,"");return`${r}/api/cloud-drive/callback`}function o(e,t){let r=process.env.GOOGLE_DRIVE_CLIENT_ID,a=n(t);if(!r)throw Error("GOOGLE_DRIVE_CLIENT_ID not configured");let o=new URLSearchParams({client_id:r,redirect_uri:a,response_type:"code",scope:"https://www.googleapis.com/auth/drive.file",access_type:"offline",prompt:"consent",...e?{state:e}:{}});return`https://accounts.google.com/o/oauth2/v2/auth?${o.toString()}`}async function i(e,t){let a=n(t),o=await fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code:e,client_id:process.env.GOOGLE_DRIVE_CLIENT_ID,client_secret:process.env.GOOGLE_DRIVE_CLIENT_SECRET,redirect_uri:a,grant_type:"authorization_code"})});if(!o.ok){let e=await o.text();throw Error(`Token exchange failed: ${e}`)}let i=await o.json();return{access_token:i.access_token,refresh_token:i.refresh_token,expires_in:i.expires_in}}async function s(e){let a=await fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({refresh_token:e,client_id:process.env.GOOGLE_DRIVE_CLIENT_ID,client_secret:process.env.GOOGLE_DRIVE_CLIENT_SECRET,grant_type:"refresh_token"})});if(!a.ok){let e=await a.text();throw Error(`Token refresh failed: ${e}`)}let n=await a.json(),o=await t.db.cloudDriveConnection.findFirst({where:{provider:"google_drive"}});if(o){let r=new Date(Date.now()+1e3*n.expires_in);await t.db.cloudDriveConnection.update({where:{id:o.id},data:{accessToken:n.access_token,refreshToken:n.refresh_token||e,tokenExpiresAt:r}})}return n.access_token}async function T(){let e=await t.db.cloudDriveConnection.findFirst({where:{provider:"google_drive"}});if(!e?.accessToken)throw Error("Google Drive not connected");if(e.tokenExpiresAt&&new Date(e.tokenExpiresAt).getTime()-Date.now()<3e5){if(!e.refreshToken)throw Error("No refresh token available");return s(e.refreshToken)}return e.accessToken}async function d(e){let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)throw Error("Failed to fetch Google profile");let r=await t.json();return{email:r.email,name:r.name||r.given_name||""}}async function l(e,t="ThesisFrame"){let r=encodeURIComponent(`name='${t}' and mimeType='application/vnd.google-apps.folder' and trashed=false`),n=await fetch(`${a}/files?q=${r}&spaces=drive&fields=files(id)`,{headers:{Authorization:`Bearer ${e}`}});if(n.ok){let e=await n.json();if(e.files?.length>0)return e.files[0].id}let o=await fetch(`${a}/files`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({name:t,mimeType:"application/vnd.google-apps.folder"})});if(!o.ok)throw Error("Failed to create ThesisFrame folder");return(await o.json()).id}async function c(e=10){let t=await T(),r=await l(t),n=encodeURIComponent(`'${r}' in parents and trashed=false`),o=await fetch(`${a}/files?q=${n}&orderBy=modifiedTime desc&pageSize=${e}&fields=files(id,name,webViewLink,createdTime)`,{headers:{Authorization:`Bearer ${t}`}});return o.ok&&(await o.json()).files||[]}e.s(["exchangeCode",()=>i,"getGoogleAuthUrl",()=>o,"getGoogleProfile",()=>d,"listDriveFiles",()=>c])},74541,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),o=e.i(61916),i=e.i(74677),s=e.i(69741),T=e.i(16795),d=e.i(87718),l=e.i(95169),c=e.i(47587),E=e.i(66012),p=e.i(70101),u=e.i(26937),h=e.i(10372),A=e.i(93695);e.i(52474);var N=e.i(220),f=e.i(89171),L=e.i(9946),R=e.i(43793);async function U(e){let{searchParams:t}=new URL(e.url),r=t.get("code"),a=t.get("error"),n=function(e){if(process.env.NEXT_PUBLIC_APP_URL)return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/,"");let t=e.headers.get("x-forwarded-proto")||"https",r=e.headers.get("host")||"localhost:3000";return`${t}://${r}`}(e);if(a)return f.NextResponse.redirect(`${n}/?drive_error=${encodeURIComponent(a)}`);if(!r)return f.NextResponse.redirect(`${n}/?drive_error=no_code`);try{let e=await (0,L.exchangeCode)(r,n),t=new Date(Date.now()+1e3*e.expires_in),a=await (0,L.getGoogleProfile)(e.access_token),o=await R.db.cloudDriveConnection.findFirst({where:{provider:"google_drive"}});return o?await R.db.cloudDriveConnection.update({where:{id:o.id},data:{connected:!0,email:a.email,displayName:a.name,accessToken:e.access_token,refreshToken:e.refresh_token,tokenExpiresAt:t,lastSyncAt:new Date}}):await R.db.cloudDriveConnection.create({data:{provider:"google_drive",connected:!0,email:a.email,displayName:a.name,accessToken:e.access_token,refreshToken:e.refresh_token,tokenExpiresAt:t}}),f.NextResponse.redirect(`${n}/?drive_connected=1&drive_email=${encodeURIComponent(a.email)}`)}catch(t){let e=t instanceof Error?t.message:"Erreur OAuth";return f.NextResponse.redirect(`${n}/?drive_error=${encodeURIComponent(e)}`)}}e.s(["GET",()=>U],87765);var _=e.i(87765);let w=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/cloud-drive/callback/route",pathname:"/api/cloud-drive/callback",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/cloud-drive/callback/route.ts",nextConfigOutput:"standalone",userland:_}),{workAsyncStorage:v,workUnitAsyncStorage:I,serverHooks:m}=w;function g(){return(0,a.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:I})}async function C(e,t,a){w.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/cloud-drive/callback/route";f=f.replace(/\/index$/,"")||"/";let L=await w.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!L)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:U,nextConfig:_,parsedUrl:v,isDraftMode:I,prerenderManifest:m,routerServerContext:g,isOnDemandRevalidate:C,revalidateOnlyGenerated:x,resolvedPathname:D,clientReferenceManifest:O,serverActionsManifest:k}=L,y=(0,s.normalizeAppPath)(f),P=!!(m.dynamicRoutes[y]||m.routes[D]),S=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,v,!1):t.end("This page could not be found"),null);if(P&&!I){let e=!!m.routes[D],t=m.dynamicRoutes[y];if(t&&!1===t.fallback&&!e){if(_.experimental.adapterPath)return await S();throw new A.NoFallbackError}}let M=null;!P||w.isDev||I||(M="/index"===(M=D)?"/":M);let X=!0===w.isDev||!P,b=P&&!X;k&&O&&(0,i.setManifestsSingleton)({page:f,clientReferenceManifest:O,serverActionsManifest:k});let F=e.method||"GET",$=(0,o.getTracer)(),q=$.getActiveScopeSpan(),G={params:U,prerenderManifest:m,renderOpts:{experimental:{authInterrupts:!!_.experimental.authInterrupts},cacheComponents:!!_.cacheComponents,supportsDynamicResponse:X,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:_.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>w.onRequestError(e,t,a,n,g)},sharedContext:{buildId:R}},j=new T.NodeNextRequest(e),B=new T.NodeNextResponse(t),H=d.NextRequestAdapter.fromNodeNextRequest(j,(0,d.signalFromNodeResponse)(t));try{let i=async e=>w.handle(H,G).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=$.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==l.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${F} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${F} ${f}`)}),s=!!(0,n.getRequestMeta)(e,"minimalMode"),T=async n=>{var o,T;let d=async({previousCacheEntry:r})=>{try{if(!s&&C&&x&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(n);e.fetchMetrics=G.renderOpts.fetchMetrics;let T=G.renderOpts.pendingWaitUntil;T&&a.waitUntil&&(a.waitUntil(T),T=void 0);let d=G.renderOpts.collectedTags;if(!P)return await (0,E.sendResponse)(j,B,o,G.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(o.headers);d&&(t[h.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==G.renderOpts.collectedRevalidate&&!(G.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&G.renderOpts.collectedRevalidate,a=void 0===G.renderOpts.collectedExpire||G.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:G.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:b,isOnDemandRevalidate:C})},!1,g),t}},l=await w.handleResponse({req:e,nextConfig:_,cacheKey:M,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:m,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:x,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!P)return null;if((null==l||null==(o=l.value)?void 0:o.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(T=l.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",C?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),I&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let A=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return s&&P||A.delete(h.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||t.getHeader("Cache-Control")||A.get("Cache-Control")||A.set("Cache-Control",(0,u.getCacheControlHeader)(l.cacheControl)),await (0,E.sendResponse)(j,B,new Response(l.value.body,{headers:A,status:l.value.status||200})),null};q?await T(q):await $.withPropagatedContext(e.headers,()=>$.trace(l.BaseServerSpan.handleRequest,{spanName:`${F} ${f}`,kind:o.SpanKind.SERVER,attributes:{"http.method":F,"http.target":e.url}},T))}catch(t){if(t instanceof A.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:b,isOnDemandRevalidate:C})},!1,g),P)throw t;return await (0,E.sendResponse)(j,B,new Response(null,{status:500})),null}}e.s(["handler",()=>C,"patchFetch",()=>g,"routeModule",()=>w,"serverHooks",()=>m,"workAsyncStorage",()=>v,"workUnitAsyncStorage",()=>I],74541)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__94a0839d._.js.map