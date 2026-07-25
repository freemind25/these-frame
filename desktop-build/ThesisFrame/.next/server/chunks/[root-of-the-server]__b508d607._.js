module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),s=e.i(14747);try{let e=(0,s.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let a=globalThis,n=a.prisma??new t.PrismaClient({log:[]});async function o(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await n.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}a.prisma=n,e.s(["db",0,n,"ensureDb",()=>o])},12598,e=>{"use strict";var t=e.i(47909),r=e.i(74017),s=e.i(96250),a=e.i(59756),n=e.i(61916),o=e.i(74677),i=e.i(69741),T=e.i(16795),E=e.i(87718),d=e.i(95169),u=e.i(47587),l=e.i(66012),c=e.i(70101),p=e.i(26937),N=e.i(10372),A=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),U=e.i(43793);async function h(e){try{let{searchParams:t}=new URL(e.url),r=t.get("tag")||"",s=await U.db.researchSource.findMany({where:r?{tags:{contains:r}}:void 0,orderBy:{updatedAt:"desc"}});return L.NextResponse.json({success:!0,sources:s})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}async function x(e){try{let{title:t,content:r,sourceType:s,tags:a}=await e.json();if(!t||"string"!=typeof t||0===t.trim().length)return L.NextResponse.json({error:"Le titre est requis."},{status:400});if(!r||"string"!=typeof r||0===r.trim().length)return L.NextResponse.json({error:"Le contenu est requis."},{status:400});let n=await U.db.researchSource.create({data:{title:t.trim(),content:r.trim(),sourceType:s||"text",tags:a||null}});return L.NextResponse.json({success:!0,source:n})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}async function f(e){try{let{id:t,title:r,content:s,tags:a}=await e.json();if(!t||"string"!=typeof t)return L.NextResponse.json({error:"L'id de la source est requis."},{status:400});if(!await U.db.researchSource.findUnique({where:{id:t}}))return L.NextResponse.json({error:"Source introuvable."},{status:404});let n=await U.db.researchSource.update({where:{id:t},data:{...void 0!==r?{title:r.trim()}:{},...void 0!==s?{content:s.trim()}:{},...void 0!==a?{tags:a}:{}}});return L.NextResponse.json({success:!0,source:n})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}async function I(e){try{let{searchParams:t}=new URL(e.url),r=t.get("id");if(!r)return L.NextResponse.json({error:"L'id de la source est requis."},{status:400});return await U.db.researchSource.delete({where:{id:r}}),L.NextResponse.json({success:!0,message:"Source supprimée."})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}e.s(["DELETE",()=>I,"GET",()=>h,"POST",()=>x,"PUT",()=>f],64517);var v=e.i(64517);let g=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/notebook/sources/route",pathname:"/api/notebook/sources",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/notebook/sources/route.ts",nextConfigOutput:"standalone",userland:v}),{workAsyncStorage:m,workUnitAsyncStorage:D,serverHooks:M}=g;function O(){return(0,s.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:D})}async function C(e,t,s){g.isDev&&(0,a.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/notebook/sources/route";L=L.replace(/\/index$/,"")||"/";let U=await g.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!U)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:h,params:x,nextConfig:f,parsedUrl:I,isDraftMode:v,prerenderManifest:m,routerServerContext:D,isOnDemandRevalidate:M,revalidateOnlyGenerated:O,resolvedPathname:C,clientReferenceManifest:S,serverActionsManifest:y}=U,w=(0,i.normalizeAppPath)(L),X=!!(m.dynamicRoutes[w]||m.routes[C]),b=async()=>((null==D?void 0:D.render404)?await D.render404(e,t,I,!1):t.end("This page could not be found"),null);if(X&&!v){let e=!!m.routes[C],t=m.dynamicRoutes[w];if(t&&!1===t.fallback&&!e){if(f.experimental.adapterPath)return await b();throw new A.NoFallbackError}}let P=null;!X||g.isDev||v||(P="/index"===(P=C)?"/":P);let F=!0===g.isDev||!X,_=X&&!F;y&&S&&(0,o.setManifestsSingleton)({page:L,clientReferenceManifest:S,serverActionsManifest:y});let k=e.method||"GET",j=(0,n.getTracer)(),q=j.getActiveScopeSpan(),H={params:x,prerenderManifest:m,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,a.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:f.cacheLife,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s,a)=>g.onRequestError(e,t,s,a,D)},sharedContext:{buildId:h}},B=new T.NodeNextRequest(e),K=new T.NodeNextResponse(t),Y=E.NextRequestAdapter.fromNodeNextRequest(B,(0,E.signalFromNodeResponse)(t));try{let o=async e=>g.handle(Y,H).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route");if(s){let t=`${k} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${L}`)}),i=!!(0,a.getRequestMeta)(e,"minimalMode"),T=async a=>{var n,T;let E=async({previousCacheEntry:r})=>{try{if(!i&&M&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await o(a);e.fetchMetrics=H.renderOpts.fetchMetrics;let T=H.renderOpts.pendingWaitUntil;T&&s.waitUntil&&(s.waitUntil(T),T=void 0);let E=H.renderOpts.collectedTags;if(!X)return await (0,l.sendResponse)(B,K,n,H.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(n.headers);E&&(t[N.NEXT_CACHE_TAGS_HEADER]=E),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==H.renderOpts.collectedRevalidate&&!(H.renderOpts.collectedRevalidate>=N.INFINITE_CACHE)&&H.renderOpts.collectedRevalidate,s=void 0===H.renderOpts.collectedExpire||H.renderOpts.collectedExpire>=N.INFINITE_CACHE?void 0:H.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==r?void 0:r.isStale)&&await g.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:M})},!1,D),t}},d=await g.handleResponse({req:e,nextConfig:f,cacheKey:P,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:m,isRoutePPREnabled:!1,isOnDemandRevalidate:M,revalidateOnlyGenerated:O,responseGenerator:E,waitUntil:s.waitUntil,isMinimalMode:i});if(!X)return null;if((null==d||null==(n=d.value)?void 0:n.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(T=d.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",M?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),v&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let A=(0,c.fromNodeOutgoingHttpHeaders)(d.value.headers);return i&&X||A.delete(N.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||A.get("Cache-Control")||A.set("Cache-Control",(0,p.getCacheControlHeader)(d.cacheControl)),await (0,l.sendResponse)(B,K,new Response(d.value.body,{headers:A,status:d.value.status||200})),null};q?await T(q):await j.withPropagatedContext(e.headers,()=>j.trace(d.BaseServerSpan.handleRequest,{spanName:`${k} ${L}`,kind:n.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},T))}catch(t){if(t instanceof A.NoFallbackError||await g.onRequestError(e,t,{routerKind:"App Router",routePath:w,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:M})},!1,D),X)throw t;return await (0,l.sendResponse)(B,K,new Response(null,{status:500})),null}}e.s(["handler",()=>C,"patchFetch",()=>O,"routeModule",()=>g,"serverHooks",()=>M,"workAsyncStorage",()=>m,"workUnitAsyncStorage",()=>D],12598)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__b508d607._.js.map