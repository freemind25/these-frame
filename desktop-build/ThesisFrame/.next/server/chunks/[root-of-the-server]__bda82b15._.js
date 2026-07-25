module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),n=e.i(14747);try{let e=(0,n.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let a=globalThis,o=a.prisma??new t.PrismaClient({log:[]});async function i(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await o.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}a.prisma=o,e.s(["db",0,o,"ensureDb",()=>i])},81829,e=>{"use strict";var t=e.i(47909),r=e.i(74017),n=e.i(96250),a=e.i(59756),o=e.i(61916),i=e.i(74677),s=e.i(69741),T=e.i(16795),l=e.i(87718),d=e.i(95169),E=e.i(47587),c=e.i(66012),u=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),U=e.i(43793);async function h(e){try{let{searchParams:t}=new URL(e.url),r=t.get("code"),n=t.get("error");if(n)return L.NextResponse.redirect(new URL(`/?mendeley_error=${encodeURIComponent(n)}`,e.url));if(!r)return L.NextResponse.redirect(new URL("/?mendeley_error=no_code",e.url));let a=await U.db.mendeleyConfig.findFirst();if(!a?.clientId||!a?.clientSecret)return L.NextResponse.redirect(new URL("/?mendeley_error=no_config",e.url));let o=`${process.env.NEXT_PUBLIC_BASE_URL||"http://localhost:3000"}/api/mendeley/callback`,i=await fetch("https://api.mendeley.com/oauth/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:`Basic ${Buffer.from(`${a.clientId}:${a.clientSecret}`).toString("base64")}`},body:new URLSearchParams({grant_type:"authorization_code",code:r,redirect_uri:o}).toString()});if(!i.ok){let t=await i.text();return console.error("Mendeley token error:",t),L.NextResponse.redirect(new URL("/?mendeley_error=token_exchange_failed",e.url))}let s=await i.json();return await U.db.mendeleyConfig.update({where:{id:a.id},data:{accessToken:s.access_token,refreshToken:s.refresh_token||null,tokenExpiresAt:s.expires_in?new Date(Date.now()+1e3*s.expires_in):null,connected:!0}}),L.NextResponse.redirect(new URL("/?mendeley=connected",e.url))}catch(t){return console.error("Mendeley callback error:",t),L.NextResponse.redirect(new URL("/?mendeley_error=server_error",e.url))}}e.s(["GET",()=>h],63213);var I=e.i(63213);let x=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/mendeley/callback/route",pathname:"/api/mendeley/callback",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/mendeley/callback/route.ts",nextConfigOutput:"standalone",userland:I}),{workAsyncStorage:f,workUnitAsyncStorage:m,serverHooks:C}=x;function D(){return(0,n.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:m})}async function M(e,t,n){x.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/mendeley/callback/route";L=L.replace(/\/index$/,"")||"/";let U=await x.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!U)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:h,params:I,nextConfig:f,parsedUrl:m,isDraftMode:C,prerenderManifest:D,routerServerContext:M,isOnDemandRevalidate:y,revalidateOnlyGenerated:O,resolvedPathname:v,clientReferenceManifest:w,serverActionsManifest:g}=U,S=(0,s.normalizeAppPath)(L),_=!!(D.dynamicRoutes[S]||D.routes[v]),X=async()=>((null==M?void 0:M.render404)?await M.render404(e,t,m,!1):t.end("This page could not be found"),null);if(_&&!C){let e=!!D.routes[v],t=D.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(f.experimental.adapterPath)return await X();throw new N.NoFallbackError}}let b=null;!_||x.isDev||C||(b="/index"===(b=v)?"/":b);let P=!0===x.isDev||!_,F=_&&!P;g&&w&&(0,i.setManifestsSingleton)({page:L,clientReferenceManifest:w,serverActionsManifest:g});let k=e.method||"GET",q=(0,o.getTracer)(),j=q.getActiveScopeSpan(),B={params:I,prerenderManifest:D,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:P,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:f.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>x.onRequestError(e,t,n,a,M)},sharedContext:{buildId:h}},H=new T.NodeNextRequest(e),K=new T.NodeNextResponse(t),$=l.NextRequestAdapter.fromNodeNextRequest(H,(0,l.signalFromNodeResponse)(t));try{let i=async e=>x.handle($,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${k} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${L}`)}),s=!!(0,a.getRequestMeta)(e,"minimalMode"),T=async a=>{var o,T;let l=async({previousCacheEntry:r})=>{try{if(!s&&y&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(a);e.fetchMetrics=B.renderOpts.fetchMetrics;let T=B.renderOpts.pendingWaitUntil;T&&n.waitUntil&&(n.waitUntil(T),T=void 0);let l=B.renderOpts.collectedTags;if(!_)return await (0,c.sendResponse)(H,K,o,B.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(o.headers);l&&(t[A.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await x.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:y})},!1,M),t}},d=await x.handleResponse({req:e,nextConfig:f,cacheKey:b,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:D,isRoutePPREnabled:!1,isOnDemandRevalidate:y,revalidateOnlyGenerated:O,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:s});if(!_)return null;if((null==d||null==(o=d.value)?void 0:o.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(T=d.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",y?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,u.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&_||N.delete(A.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(d.cacheControl)),await (0,c.sendResponse)(H,K,new Response(d.value.body,{headers:N,status:d.value.status||200})),null};j?await T(j):await q.withPropagatedContext(e.headers,()=>q.trace(d.BaseServerSpan.handleRequest,{spanName:`${k} ${L}`,kind:o.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},T))}catch(t){if(t instanceof N.NoFallbackError||await x.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:y})},!1,M),_)throw t;return await (0,c.sendResponse)(H,K,new Response(null,{status:500})),null}}e.s(["handler",()=>M,"patchFetch",()=>D,"routeModule",()=>x,"serverHooks",()=>C,"workAsyncStorage",()=>f,"workUnitAsyncStorage",()=>m],81829)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__bda82b15._.js.map