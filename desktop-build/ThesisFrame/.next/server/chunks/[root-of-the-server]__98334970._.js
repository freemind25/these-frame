module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),a=e.i(14747);try{let e=(0,a.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let n=globalThis,T=n.prisma??new t.PrismaClient({log:[]});async function s(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await T.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}n.prisma=T,e.s(["db",0,T,"ensureDb",()=>s])},40879,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),T=e.i(61916),s=e.i(74677),i=e.i(69741),o=e.i(16795),E=e.i(87718),d=e.i(95169),l=e.i(47587),c=e.i(66012),u=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),U=e.i(43793);async function h(){try{let e=await U.db.cloudDriveConnection.findFirst({where:{provider:"google_drive"}});return e&&await U.db.cloudDriveConnection.update({where:{id:e.id},data:{connected:!1,accessToken:null,refreshToken:null,tokenExpiresAt:null}}),L.NextResponse.json({disconnected:!0})}catch{return L.NextResponse.json({error:"Erreur déconnexion"},{status:500})}}e.s(["POST",()=>h],62340);var I=e.i(62340);let x=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/cloud-drive/disconnect/route",pathname:"/api/cloud-drive/disconnect",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/cloud-drive/disconnect/route.ts",nextConfigOutput:"standalone",userland:I}),{workAsyncStorage:v,workUnitAsyncStorage:D,serverHooks:C}=x;function f(){return(0,a.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:D})}async function O(e,t,a){x.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/cloud-drive/disconnect/route";L=L.replace(/\/index$/,"")||"/";let U=await x.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!U)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:h,params:I,nextConfig:v,parsedUrl:D,isDraftMode:C,prerenderManifest:f,routerServerContext:O,isOnDemandRevalidate:M,revalidateOnlyGenerated:X,resolvedPathname:m,clientReferenceManifest:S,serverActionsManifest:g}=U,w=(0,i.normalizeAppPath)(L),y=!!(f.dynamicRoutes[w]||f.routes[m]),F=async()=>((null==O?void 0:O.render404)?await O.render404(e,t,D,!1):t.end("This page could not be found"),null);if(y&&!C){let e=!!f.routes[m],t=f.dynamicRoutes[w];if(t&&!1===t.fallback&&!e){if(v.experimental.adapterPath)return await F();throw new N.NoFallbackError}}let P=null;!y||x.isDev||C||(P="/index"===(P=m)?"/":P);let b=!0===x.isDev||!y,_=y&&!b;g&&S&&(0,s.setManifestsSingleton)({page:L,clientReferenceManifest:S,serverActionsManifest:g});let k=e.method||"GET",q=(0,T.getTracer)(),j=q.getActiveScopeSpan(),H={params:I,prerenderManifest:f,renderOpts:{experimental:{authInterrupts:!!v.experimental.authInterrupts},cacheComponents:!!v.cacheComponents,supportsDynamicResponse:b,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:v.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>x.onRequestError(e,t,a,n,O)},sharedContext:{buildId:h}},K=new o.NodeNextRequest(e),B=new o.NodeNextResponse(t),Y=E.NextRequestAdapter.fromNodeNextRequest(K,(0,E.signalFromNodeResponse)(t));try{let s=async e=>x.handle(Y,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${L}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),o=async n=>{var T,o;let E=async({previousCacheEntry:r})=>{try{if(!i&&M&&X&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let T=await s(n);e.fetchMetrics=H.renderOpts.fetchMetrics;let o=H.renderOpts.pendingWaitUntil;o&&a.waitUntil&&(a.waitUntil(o),o=void 0);let E=H.renderOpts.collectedTags;if(!y)return await (0,c.sendResponse)(K,B,T,H.renderOpts.pendingWaitUntil),null;{let e=await T.blob(),t=(0,u.toNodeOutgoingHttpHeaders)(T.headers);E&&(t[A.NEXT_CACHE_TAGS_HEADER]=E),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,a=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:T.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await x.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:M})},!1,O),t}},d=await x.handleResponse({req:e,nextConfig:v,cacheKey:P,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:f,isRoutePPREnabled:!1,isOnDemandRevalidate:M,revalidateOnlyGenerated:X,responseGenerator:E,waitUntil:a.waitUntil,isMinimalMode:i});if(!y)return null;if((null==d||null==(T=d.value)?void 0:T.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(o=d.value)?void 0:o.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",M?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,u.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&y||N.delete(A.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(d.cacheControl)),await (0,c.sendResponse)(K,B,new Response(d.value.body,{headers:N,status:d.value.status||200})),null};j?await o(j):await q.withPropagatedContext(e.headers,()=>q.trace(d.BaseServerSpan.handleRequest,{spanName:`${k} ${L}`,kind:T.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},o))}catch(t){if(t instanceof N.NoFallbackError||await x.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,l.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:M})},!1,O),y)throw t;return await (0,c.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>O,"patchFetch",()=>f,"routeModule",()=>x,"serverHooks",()=>C,"workAsyncStorage",()=>v,"workUnitAsyncStorage",()=>D],40879)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__98334970._.js.map