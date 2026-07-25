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
    `)}catch(e){console.error("ensureDb error:",e)}}n.prisma=s,e.s(["db",0,s,"ensureDb",()=>i])},67910,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),s=e.i(61916),i=e.i(74677),o=e.i(69741),T=e.i(16795),l=e.i(87718),E=e.i(95169),d=e.i(47587),u=e.i(66012),c=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),h=e.i(43793);async function U(){try{let e=await h.db.reference.findMany({orderBy:{createdAt:"desc"}}),t="";for(let r of e){let e=r.citationKey||`ref_${r.id.slice(0,6)}`,a=r.authors?r.authors.split(";").map(e=>e.trim()).join(" and "):"Unknown";switch(r.type){case"book":t+=`@book{${e},
  author    = {${a}},
  title     = {${r.title}},
  year      = {${r.year||""}},
  publisher = {${r.journal||""}},
  doi       = {${r.doi||""}},
  note      = {${r.notes||""}}
}

`;break;case"inproceedings":t+=`@inproceedings{${e},
  author    = {${a}},
  title     = {${r.title}},
  booktitle = {${r.journal||""}},
  year      = {${r.year||""}},
  pages     = {${r.pages||""}},
  doi       = {${r.doi||""}},
  note      = {${r.notes||""}}
}

`;break;case"thesis":t+=`@phdthesis{${e},
  author = {${a}},
  title  = {${r.title}},
  school = {${r.journal||""}},
  year   = {${r.year||""}},
  note   = {${r.notes||""}}
}

`;break;case"incollection":t+=`@incollection{${e},
  author    = {${a}},
  title     = {${r.title}},
  booktitle = {${r.journal||""}},
  year      = {${r.year||""}},
  pages     = {${r.pages||""}},
  publisher = {${r.journal||""}},
  doi       = {${r.doi||""}}
}

`;break;case"web":t+=`@misc{${e},
  author       = {${a}},
  title        = {${r.title}},
  howpublished = {${r.journal||""}},
  year         = {${r.year||""}},
  url          = {${r.doi||""}},
  note         = {${r.notes||""}}
}

`;break;default:t+=`@article{${e},
  author  = {${a}},
  title   = {${r.title}},
  journal = {${r.journal||""}},
  year    = {${r.year||""}},
  volume  = {${r.volume||""}},
  number  = {${r.number||""}},
  pages   = {${r.pages||""}},
  doi     = {${r.doi||""}},
  note    = {${r.notes||""}}
}

`}}return new L.NextResponse(t,{status:200,headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":'attachment; filename="references.bib"'}})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}e.s(["GET",()=>U],88603);var I=e.i(88603);let x=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/references/bibtex/route",pathname:"/api/references/bibtex",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/references/bibtex/route.ts",nextConfigOutput:"standalone",userland:I}),{workAsyncStorage:f,workUnitAsyncStorage:C,serverHooks:D}=x;function M(){return(0,a.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:C})}async function m(e,t,a){x.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/references/bibtex/route";L=L.replace(/\/index$/,"")||"/";let h=await x.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!h)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:U,params:I,nextConfig:f,parsedUrl:C,isDraftMode:D,prerenderManifest:M,routerServerContext:m,isOnDemandRevalidate:O,revalidateOnlyGenerated:b,resolvedPathname:v,clientReferenceManifest:y,serverActionsManifest:g}=h,X=(0,o.normalizeAppPath)(L),$=!!(M.dynamicRoutes[X]||M.routes[v]),S=async()=>((null==m?void 0:m.render404)?await m.render404(e,t,C,!1):t.end("This page could not be found"),null);if($&&!D){let e=!!M.routes[v],t=M.dynamicRoutes[X];if(t&&!1===t.fallback&&!e){if(f.experimental.adapterPath)return await S();throw new N.NoFallbackError}}let w=null;!$||x.isDev||D||(w="/index"===(w=v)?"/":w);let F=!0===x.isDev||!$,P=$&&!F;g&&y&&(0,i.setManifestsSingleton)({page:L,clientReferenceManifest:y,serverActionsManifest:g});let _=e.method||"GET",k=(0,s.getTracer)(),j=k.getActiveScopeSpan(),q={params:I,prerenderManifest:M,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:f.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>x.onRequestError(e,t,a,n,m)},sharedContext:{buildId:U}},H=new T.NodeNextRequest(e),K=new T.NodeNextResponse(t),B=l.NextRequestAdapter.fromNodeNextRequest(H,(0,l.signalFromNodeResponse)(t));try{let i=async e=>x.handle(B,q).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=k.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==E.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${_} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${_} ${L}`)}),o=!!(0,n.getRequestMeta)(e,"minimalMode"),T=async n=>{var s,T;let l=async({previousCacheEntry:r})=>{try{if(!o&&O&&b&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await i(n);e.fetchMetrics=q.renderOpts.fetchMetrics;let T=q.renderOpts.pendingWaitUntil;T&&a.waitUntil&&(a.waitUntil(T),T=void 0);let l=q.renderOpts.collectedTags;if(!$)return await (0,u.sendResponse)(H,K,s,q.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[A.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==q.renderOpts.collectedRevalidate&&!(q.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&q.renderOpts.collectedRevalidate,a=void 0===q.renderOpts.collectedExpire||q.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:q.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await x.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:O})},!1,m),t}},E=await x.handleResponse({req:e,nextConfig:f,cacheKey:w,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:M,isRoutePPREnabled:!1,isOnDemandRevalidate:O,revalidateOnlyGenerated:b,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:o});if(!$)return null;if((null==E||null==(s=E.value)?void 0:s.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(T=E.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",O?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),D&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,c.fromNodeOutgoingHttpHeaders)(E.value.headers);return o&&$||N.delete(A.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(E.cacheControl)),await (0,u.sendResponse)(H,K,new Response(E.value.body,{headers:N,status:E.value.status||200})),null};j?await T(j):await k.withPropagatedContext(e.headers,()=>k.trace(E.BaseServerSpan.handleRequest,{spanName:`${_} ${L}`,kind:s.SpanKind.SERVER,attributes:{"http.method":_,"http.target":e.url}},T))}catch(t){if(t instanceof N.NoFallbackError||await x.onRequestError(e,t,{routerKind:"App Router",routePath:X,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:O})},!1,m),$)throw t;return await (0,u.sendResponse)(H,K,new Response(null,{status:500})),null}}e.s(["handler",()=>m,"patchFetch",()=>M,"routeModule",()=>x,"serverHooks",()=>D,"workAsyncStorage",()=>f,"workUnitAsyncStorage",()=>C],67910)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__2cbcc727._.js.map