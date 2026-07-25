module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),n=e.i(14747);try{let e=(0,n.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let a=globalThis,s=a.prisma??new t.PrismaClient({log:[]});async function i(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await s.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}a.prisma=s,e.s(["db",0,s,"ensureDb",()=>i])},54466,e=>{"use strict";var t=e.i(47909),r=e.i(74017),n=e.i(96250),a=e.i(59756),s=e.i(61916),i=e.i(74677),o=e.i(69741),T=e.i(16795),l=e.i(87718),d=e.i(95169),E=e.i(47587),c=e.i(66012),u=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),h=e.i(43793);async function U(){let e=await h.db.mendeleyConfig.findFirst();if(!e?.accessToken)return null;if(e.tokenExpiresAt&&new Date>e.tokenExpiresAt){if(e.refreshToken&&e.clientId&&e.clientSecret)try{let t=await fetch("https://api.mendeley.com/oauth/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded",Authorization:`Basic ${Buffer.from(`${e.clientId}:${e.clientSecret}`).toString("base64")}`},body:new URLSearchParams({grant_type:"refresh_token",refresh_token:e.refreshToken}).toString()});if(t.ok){let r=await t.json();return await h.db.mendeleyConfig.update({where:{id:e.id},data:{accessToken:r.access_token,refreshToken:r.refresh_token||e.refreshToken,tokenExpiresAt:r.expires_in?new Date(Date.now()+1e3*r.expires_in):null}}),r.access_token}}catch{}return null}return e.accessToken}async function f(e){try{let t=await U();if(!t)return L.NextResponse.json({error:"Non connecté à Mendeley"},{status:401});let{searchParams:r}=new URL(e.url),n=parseInt(r.get("limit")||"50"),a=parseInt(r.get("offset")||"0"),s=await fetch(`https://api.mendeley.com/documents?limit=${n}&offset=${a}&view=all`,{headers:{Authorization:`Bearer ${t}`,Accept:"application/vnd.mendeley-document.1+json"}});if(!s.ok){let e=await s.text();return L.NextResponse.json({error:`Erreur Mendeley API: ${s.status}`,details:e},{status:s.status})}let i=await s.json();return L.NextResponse.json(i)}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}e.s(["GET",()=>f],9090);var I=e.i(9090);let x=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/mendeley/documents/route",pathname:"/api/mendeley/documents",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/mendeley/documents/route.ts",nextConfigOutput:"standalone",userland:I}),{workAsyncStorage:m,workUnitAsyncStorage:D,serverHooks:C}=x;function M(){return(0,n.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:D})}async function O(e,t,n){x.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/mendeley/documents/route";L=L.replace(/\/index$/,"")||"/";let h=await x.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!h)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:U,params:f,nextConfig:I,parsedUrl:m,isDraftMode:D,prerenderManifest:C,routerServerContext:M,isOnDemandRevalidate:O,revalidateOnlyGenerated:v,resolvedPathname:y,clientReferenceManifest:w,serverActionsManifest:g}=h,S=(0,o.normalizeAppPath)(L),X=!!(C.dynamicRoutes[S]||C.routes[y]),P=async()=>((null==M?void 0:M.render404)?await M.render404(e,t,m,!1):t.end("This page could not be found"),null);if(X&&!D){let e=!!C.routes[y],t=C.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(I.experimental.adapterPath)return await P();throw new N.NoFallbackError}}let _=null;!X||x.isDev||D||(_="/index"===(_=y)?"/":_);let k=!0===x.isDev||!X,F=X&&!k;g&&w&&(0,i.setManifestsSingleton)({page:L,clientReferenceManifest:w,serverActionsManifest:g});let b=e.method||"GET",j=(0,s.getTracer)(),q=j.getActiveScopeSpan(),B={params:f,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:I.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>x.onRequestError(e,t,n,a,M)},sharedContext:{buildId:U}},H=new T.NodeNextRequest(e),$=new T.NodeNextResponse(t),K=l.NextRequestAdapter.fromNodeNextRequest(H,(0,l.signalFromNodeResponse)(t));try{let i=async e=>x.handle(K,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${b} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${b} ${L}`)}),o=!!(0,a.getRequestMeta)(e,"minimalMode"),T=async a=>{var s,T;let l=async({previousCacheEntry:r})=>{try{if(!o&&O&&v&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(a);e.fetchMetrics=B.renderOpts.fetchMetrics;let T=B.renderOpts.pendingWaitUntil;T&&n.waitUntil&&(n.waitUntil(T),T=void 0);let l=B.renderOpts.collectedTags;if(!X)return await (0,c.sendResponse)(H,$,s,B.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[A.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,n=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==r?void 0:r.isStale)&&await x.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:O})},!1,M),t}},d=await x.handleResponse({req:e,nextConfig:I,cacheKey:_,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:v,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:o});if(!X)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(T=d.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",O?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,u.fromNodeOutgoingHttpHeaders)(d.value.headers);return o&&X||N.delete(A.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(d.cacheControl)),await (0,c.sendResponse)(H,$,new Response(d.value.body,{headers:N,status:d.value.status||200})),null};q?await T(q):await j.withPropagatedContext(e.headers,()=>j.trace(d.BaseServerSpan.handleRequest,{spanName:`${b} ${L}`,kind:s.SpanKind.SERVER,attributes:{"http.method":b,"http.target":e.url}},T))}catch(t){if(t instanceof N.NoFallbackError||await x.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,E.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:O})},!1,M),X)throw t;return await (0,c.sendResponse)(H,$,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>M,"routeModule",()=>x,"serverHooks",()=>C,"workAsyncStorage",()=>m,"workUnitAsyncStorage",()=>D],54466)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b570564e._.js.map