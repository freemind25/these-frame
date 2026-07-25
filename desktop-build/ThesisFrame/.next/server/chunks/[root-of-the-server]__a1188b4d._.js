module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),a=e.i(14747);try{let e=(0,a.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let s=globalThis,n=s.prisma??new t.PrismaClient({log:[]});async function i(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await n.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}s.prisma=n,e.s(["db",0,n,"ensureDb",()=>i])},9467,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),n=e.i(61916),i=e.i(74677),T=e.i(69741),o=e.i(16795),d=e.i(87718),E=e.i(95169),l=e.i(47587),u=e.i(66012),c=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),h=e.i(43793);async function U(){try{await (0,h.ensureDb)();let e=await h.db.thesis.findFirst({include:{chapters:{orderBy:{order:"asc"}}}});return e||(e=await h.db.thesis.create({data:{},include:{chapters:{orderBy:{order:"asc"}}}})),L.NextResponse.json(e)}catch(e){return console.error("[GET /api/thesis] Error:",e),L.NextResponse.json({error:"Failed to fetch thesis"},{status:500})}}async function I(e){try{await (0,h.ensureDb)();let{title:t,subtitle:r,author:a,field:s,university:n,status:i}=await e.json(),T=await h.db.thesis.findFirst();if(!T)return L.NextResponse.json({error:"No thesis found. Please seed the thesis first."},{status:404});let o={};void 0!==t&&(o.title=t),void 0!==r&&(o.subtitle=r),void 0!==a&&(o.author=a),void 0!==s&&(o.field=s),void 0!==n&&(o.university=n),void 0!==i&&(o.status=i);let d=await h.db.thesis.update({where:{id:T.id},data:o,include:{chapters:{orderBy:{order:"asc"}}}});return L.NextResponse.json(d)}catch(e){return console.error("[PATCH /api/thesis] Error:",e),L.NextResponse.json({error:"Failed to update thesis"},{status:500})}}e.s(["GET",()=>U,"PATCH",()=>I],752);var x=e.i(752);let f=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/thesis/route",pathname:"/api/thesis",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/thesis/route.ts",nextConfigOutput:"standalone",userland:x}),{workAsyncStorage:v,workUnitAsyncStorage:D,serverHooks:C}=f;function M(){return(0,a.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:D})}async function O(e,t,a){f.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/thesis/route";L=L.replace(/\/index$/,"")||"/";let h=await f.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!h)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,params:I,nextConfig:x,parsedUrl:v,isDraftMode:D,prerenderManifest:C,routerServerContext:M,isOnDemandRevalidate:O,revalidateOnlyGenerated:X,resolvedPathname:m,clientReferenceManifest:S,serverActionsManifest:y}=h,g=(0,T.normalizeAppPath)(L),w=!!(C.dynamicRoutes[g]||C.routes[m]),F=async()=>((null==M?void 0:M.render404)?await M.render404(e,t,v,!1):t.end("This page could not be found"),null);if(w&&!D){let e=!!C.routes[m],t=C.dynamicRoutes[g];if(t&&!1===t.fallback&&!e){if(x.experimental.adapterPath)return await F();throw new N.NoFallbackError}}let P=null;!w||f.isDev||D||(P="/index"===(P=m)?"/":P);let b=!0===f.isDev||!w,_=w&&!b;y&&S&&(0,i.setManifestsSingleton)({page:L,clientReferenceManifest:S,serverActionsManifest:y});let k=e.method||"GET",j=(0,n.getTracer)(),q=j.getActiveScopeSpan(),H={params:I,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!x.experimental.authInterrupts},cacheComponents:!!x.cacheComponents,supportsDynamicResponse:b,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:x.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,s)=>f.onRequestError(e,t,a,s,M)},sharedContext:{buildId:U}},B=new o.NodeNextRequest(e),K=new o.NodeNextResponse(t),Y=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let i=async e=>f.handle(Y,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==E.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${L}`)}),T=!!(0,s.getRequestMeta)(e,"minimalMode"),o=async s=>{var n,o;let d=async({previousCacheEntry:r})=>{try{if(!T&&O&&X&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(s);e.fetchMetrics=H.renderOpts.fetchMetrics;let o=H.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let d=H.renderOpts.collectedTags;if(!w)return await (0,u.sendResponse)(B,K,n,H.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(n.headers);d&&(t[A.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await f.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:O})},!1,M),t}},E=await f.handleResponse({req:e,nextConfig:x,cacheKey:P,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:X,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:T});if(!w)return null;if((null==E||null==(n=E.value)?void 0:n.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(o=E.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});T||t.setHeader("x-nextjs-cache",O?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,c.fromNodeOutgoingHttpHeaders)(E.value.headers);return T&&w||N.delete(A.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(E.cacheControl)),await (0,u.sendResponse)(B,K,new Response(E.value.body,{headers:N,status:E.value.status||200})),null};q?await o(q):await j.withPropagatedContext(e.headers,()=>j.trace(E.BaseServerSpan.handleRequest,{spanName:`${k} ${L}`,kind:n.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},o))}catch(t){if(t instanceof N.NoFallbackError||await f.onRequestError(e,t,{routerKind:"App Router",routePath:g,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:O})},!1,M),w)throw t;return await (0,u.sendResponse)(B,K,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>M,"routeModule",()=>f,"serverHooks",()=>C,"workAsyncStorage",()=>v,"workUnitAsyncStorage",()=>D],9467)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a1188b4d._.js.map