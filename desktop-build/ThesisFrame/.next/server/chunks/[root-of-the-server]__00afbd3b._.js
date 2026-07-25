module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),a=e.i(14747);try{let e=(0,a.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let n=globalThis,s=n.prisma??new t.PrismaClient({log:[]});async function T(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await s.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}n.prisma=s,e.s(["db",0,s,"ensureDb",()=>T])},62972,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),T=e.i(74677),o=e.i(69741),i=e.i(16795),E=e.i(87718),d=e.i(95169),l=e.i(47587),u=e.i(66012),c=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),U=e.i(43793);async function h(){try{let e=await U.db.notebookEntry.findMany({orderBy:{createdAt:"desc"}});return L.NextResponse.json({success:!0,entries:e})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}async function I(e){try{let{searchParams:t}=new URL(e.url),r=t.get("id");if(!r)return L.NextResponse.json({error:"L'id de l'entrée est requis."},{status:400});return await U.db.notebookEntry.delete({where:{id:r}}),L.NextResponse.json({success:!0,message:"Entrée supprimée."})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}e.s(["DELETE",()=>I,"GET",()=>h],19598);var x=e.i(19598);let f=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/notebook/entries/route",pathname:"/api/notebook/entries",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/notebook/entries/route.ts",nextConfigOutput:"standalone",userland:x}),{workAsyncStorage:D,workUnitAsyncStorage:M,serverHooks:C}=f;function O(){return(0,a.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:M})}async function v(e,t,a){f.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/notebook/entries/route";L=L.replace(/\/index$/,"")||"/";let U=await f.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!U)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:h,params:I,nextConfig:x,parsedUrl:D,isDraftMode:M,prerenderManifest:C,routerServerContext:O,isOnDemandRevalidate:v,revalidateOnlyGenerated:m,resolvedPathname:g,clientReferenceManifest:X,serverActionsManifest:S}=U,y=(0,o.normalizeAppPath)(L),w=!!(C.dynamicRoutes[y]||C.routes[g]),b=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,D,!1):t.end("This page could not be found"),null);if(w&&!M){let e=!!C.routes[g],t=C.dynamicRoutes[y];if(t&&!1===t.fallback&&!e){if(x.experimental.adapterPath)return await b();throw new N.NoFallbackError}}let F=null;!w||f.isDev||M||(F="/index"===(F=g)?"/":F);let P=!0===f.isDev||!w,_=w&&!P;S&&X&&(0,T.setManifestsSingleton)({page:L,clientReferenceManifest:X,serverActionsManifest:S});let k=e.method||"GET",q=(0,s.getTracer)(),j=q.getActiveScopeSpan(),H={params:I,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:P,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>f.onRequestError(e,t,a,n,O)},sharedContext:{buildId:h}},B=new i.NodeNextRequest(e),K=new i.NodeNextResponse(t),Y=E.NextRequestAdapter.fromNodeNextRequest(B,(0,E.signalFromNodeResponse)(t));try{let T=async e=>f.handle(Y,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${L}`)}),o=!!(0,n.getRequestMeta)(e,"minimalMode"),i=async n=>{var s,i;let E=async({previousCacheEntry:r})=>{try{if(!o&&v&&m&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await T(n);e.fetchMetrics=H.renderOpts.fetchMetrics;let i=H.renderOpts.pendingWaitUntil;i&&a.waitUntil&&(a.waitUntil(i),i=void 0);let E=H.renderOpts.collectedTags;if(!w)return await (0,u.sendResponse)(B,K,s,H.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(s.headers);E&&(t[A.NEXT_CACHE_TAGS_HEADER]=E),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,O),t}},d=await f.handleResponse({req:e,nextConfig:x,cacheKey:F,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:m,responseGenerator:E,waitUntil:a.waitUntil,isMinimalMode:o});if(!w)return null;if((null==d||null==(s=d.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(i=d.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",v?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),M&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,c.fromNodeOutgoingHttpHeaders)(d.value.headers);return o&&w||N.delete(A.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(d.cacheControl)),await (0,u.sendResponse)(B,K,new Response(d.value.body,{headers:N,status:d.value.status||200})),null};j?await i(j):await q.withPropagatedContext(e.headers,()=>q.trace(d.BaseServerSpan.handleRequest,{spanName:`${k} ${L}`,kind:s.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},i))}catch(t){if(t instanceof N.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,O),w)throw t;return await (0,u.sendResponse)(B,K,new Response(null,{status:500})),null}}e.s(["handler",()=>v,"patchFetch",()=>O,"routeModule",()=>f,"serverHooks",()=>C,"workAsyncStorage",()=>D,"workUnitAsyncStorage",()=>M],62972)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__00afbd3b._.js.map