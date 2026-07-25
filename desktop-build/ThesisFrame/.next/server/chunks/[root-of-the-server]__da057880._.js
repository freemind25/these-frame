module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),a=e.i(14747);try{let e=(0,a.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let n=globalThis,s=n.prisma??new t.PrismaClient({log:[]});async function i(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await s.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}n.prisma=s,e.s(["db",0,s,"ensureDb",()=>i])},6237,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),i=e.i(74677),o=e.i(69741),T=e.i(16795),d=e.i(87718),E=e.i(95169),l=e.i(47587),c=e.i(66012),u=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var h=e.i(220),R=e.i(89171),L=e.i(43793);async function U(e,{params:t}){try{await (0,L.ensureDb)();let{chapterId:e}=await t,r=await L.db.chapter.findUnique({where:{id:e}});if(!r)return R.NextResponse.json({error:"Chapter not found"},{status:404});return R.NextResponse.json(r)}catch(e){return console.error("[GET /api/thesis/chapters/:id] Error:",e),R.NextResponse.json({error:"Failed to fetch chapter"},{status:500})}}async function I(e,{params:t}){try{await (0,L.ensureDb)();let{chapterId:r}=await t,{title:a,content:n,status:s,directorFeedback:i}=await e.json();if(!await L.db.chapter.findUnique({where:{id:r}}))return R.NextResponse.json({error:"Chapter not found"},{status:404});let o={};void 0!==a&&(o.title=a),void 0!==s&&(o.status=s),void 0!==i&&(o.directorFeedback=i,o.directorFeedbackAt=new Date),void 0!==n&&(o.content=n,o.wordCount=n.split(/\s+/).filter(e=>e.length>0).length);let T=await L.db.chapter.update({where:{id:r},data:o});return R.NextResponse.json(T)}catch(e){return console.error("[PATCH /api/thesis/chapters/:id] Error:",e),R.NextResponse.json({error:"Failed to update chapter"},{status:500})}}async function x(e,{params:t}){try{await (0,L.ensureDb)();let{chapterId:e}=await t;if(!await L.db.chapter.findUnique({where:{id:e}}))return R.NextResponse.json({error:"Chapter not found"},{status:404});let r=await L.db.chapter.update({where:{id:e},data:{content:"",wordCount:0,status:"draft"}});return R.NextResponse.json(r)}catch(e){return console.error("[DELETE /api/thesis/chapters/:id] Error:",e),R.NextResponse.json({error:"Failed to reset chapter"},{status:500})}}e.s(["DELETE",()=>x,"GET",()=>U,"PATCH",()=>I],21629);var f=e.i(21629);let C=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/thesis/chapters/[chapterId]/route",pathname:"/api/thesis/chapters/[chapterId]",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/thesis/chapters/[chapterId]/route.ts",nextConfigOutput:"standalone",userland:f}),{workAsyncStorage:D,workUnitAsyncStorage:v,serverHooks:M}=C;function O(){return(0,a.patchFetch)({workAsyncStorage:D,workUnitAsyncStorage:v})}async function w(e,t,a){C.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/thesis/chapters/[chapterId]/route";R=R.replace(/\/index$/,"")||"/";let L=await C.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!L)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,params:I,nextConfig:x,parsedUrl:f,isDraftMode:D,prerenderManifest:v,routerServerContext:M,isOnDemandRevalidate:O,revalidateOnlyGenerated:w,resolvedPathname:X,clientReferenceManifest:m,serverActionsManifest:g}=L,S=(0,o.normalizeAppPath)(R),y=!!(v.dynamicRoutes[S]||v.routes[X]),F=async()=>((null==M?void 0:M.render404)?await M.render404(e,t,f,!1):t.end("This page could not be found"),null);if(y&&!D){let e=!!v.routes[X],t=v.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(x.experimental.adapterPath)return await F();throw new N.NoFallbackError}}let b=null;!y||C.isDev||D||(b="/index"===(b=X)?"/":b);let P=!0===C.isDev||!y,_=y&&!P;g&&m&&(0,i.setManifestsSingleton)({page:R,clientReferenceManifest:m,serverActionsManifest:g});let k=e.method||"GET",j=(0,s.getTracer)(),q=j.getActiveScopeSpan(),H={params:I,prerenderManifest:v,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:P,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>C.onRequestError(e,t,a,n,M)},sharedContext:{buildId:U}},K=new T.NodeNextRequest(e),B=new T.NodeNextResponse(t),Y=d.NextRequestAdapter.fromNodeNextRequest(K,(0,d.signalFromNodeResponse)(t));try{let i=async e=>C.handle(Y,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==E.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${R}`)}),o=!!(0,n.getRequestMeta)(e,"minimalMode"),T=async n=>{var s,T;let d=async({previousCacheEntry:r})=>{try{if(!o&&O&&w&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(n);e.fetchMetrics=H.renderOpts.fetchMetrics;let T=H.renderOpts.pendingWaitUntil;T&&a.waitUntil&&(a.waitUntil(T),T=void 0);let d=H.renderOpts.collectedTags;if(!y)return await (0,c.sendResponse)(K,B,s,H.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(s.headers);d&&(t[A.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await C.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:O})},!1,M),t}},E=await C.handleResponse({req:e,nextConfig:x,cacheKey:b,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:w,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:o});if(!y)return null;if((null==E||null==(s=E.value)?void 0:s.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(T=E.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",O?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,u.fromNodeOutgoingHttpHeaders)(E.value.headers);return o&&y||N.delete(A.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(E.cacheControl)),await (0,c.sendResponse)(K,B,new Response(E.value.body,{headers:N,status:E.value.status||200})),null};q?await T(q):await j.withPropagatedContext(e.headers,()=>j.trace(E.BaseServerSpan.handleRequest,{spanName:`${k} ${R}`,kind:s.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},T))}catch(t){if(t instanceof N.NoFallbackError||await C.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:O})},!1,M),y)throw t;return await (0,c.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>w,"patchFetch",()=>O,"routeModule",()=>C,"serverHooks",()=>M,"workAsyncStorage",()=>D,"workUnitAsyncStorage",()=>v],6237)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__da057880._.js.map