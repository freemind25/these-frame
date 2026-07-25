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
    `)}catch(e){console.error("ensureDb error:",e)}}s.prisma=n,e.s(["db",0,n,"ensureDb",()=>i])},81362,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),s=e.i(59756),n=e.i(61916),i=e.i(74677),o=e.i(69741),T=e.i(16795),l=e.i(87718),E=e.i(95169),d=e.i(47587),u=e.i(66012),c=e.i(70101),p=e.i(26937),A=e.i(10372),N=e.i(93695);e.i(52474);var R=e.i(220),L=e.i(89171),U=e.i(43793);async function h(e){try{let{apiKey:t}=await e.json();if(!t||"string"!=typeof t||0===t.trim().length)return L.NextResponse.json({error:"La clé API est requise."},{status:400});let r=t.trim(),a=await fetch("https://api.mistral.ai/v1/models",{headers:{Authorization:`Bearer ${r}`}});if(!a.ok){let e=await a.text();return L.NextResponse.json({error:`Cl\xe9 API Mistral invalide (${a.status}) : ${e.slice(0,200)}`},{status:400})}return await U.db.aiToolConfig.upsert({where:{tool:"mistral"},update:{apiKey:r,connected:!0},create:{tool:"mistral",apiKey:r,connected:!0}}),L.NextResponse.json({success:!0,message:"Clé API Mistral enregistrée avec succès."})}catch(e){return console.error("Mistral config error:",e),L.NextResponse.json({error:e instanceof Error?e.message:"Erreur interne du serveur."},{status:500})}}async function I(){try{let e=await U.db.aiToolConfig.findFirst({where:{tool:"mistral"}});if(!e)return L.NextResponse.json({error:"Configuration Mistral introuvable."},{status:404});return await U.db.aiToolConfig.update({where:{id:e.id},data:{apiKey:null,connected:!1}}),L.NextResponse.json({success:!0,message:"Clé API Mistral supprimée."})}catch(e){return L.NextResponse.json({error:e instanceof Error?e.message:"Erreur interne du serveur."},{status:500})}}e.s(["DELETE",()=>I,"POST",()=>h],18836);var f=e.i(18836);let x=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/consensus/mistral-config/route",pathname:"/api/consensus/mistral-config",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/consensus/mistral-config/route.ts",nextConfigOutput:"standalone",userland:f}),{workAsyncStorage:C,workUnitAsyncStorage:m,serverHooks:M}=x;function g(){return(0,a.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:m})}async function v(e,t,a){x.isDev&&(0,s.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let L="/api/consensus/mistral-config/route";L=L.replace(/\/index$/,"")||"/";let U=await x.prepare(e,t,{srcPage:L,multiZoneDraftMode:!1});if(!U)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:h,params:I,nextConfig:f,parsedUrl:C,isDraftMode:m,prerenderManifest:M,routerServerContext:g,isOnDemandRevalidate:v,revalidateOnlyGenerated:D,resolvedPathname:O,clientReferenceManifest:X,serverActionsManifest:S}=U,y=(0,o.normalizeAppPath)(L),w=!!(M.dynamicRoutes[y]||M.routes[O]),P=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,C,!1):t.end("This page could not be found"),null);if(w&&!m){let e=!!M.routes[O],t=M.dynamicRoutes[y];if(t&&!1===t.fallback&&!e){if(f.experimental.adapterPath)return await P();throw new N.NoFallbackError}}let F=null;!w||x.isDev||m||(F="/index"===(F=O)?"/":F);let b=!0===x.isDev||!w,_=w&&!b;S&&X&&(0,i.setManifestsSingleton)({page:L,clientReferenceManifest:X,serverActionsManifest:S});let k=e.method||"GET",j=(0,n.getTracer)(),q=j.getActiveScopeSpan(),K={params:I,prerenderManifest:M,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:b,incrementalCache:(0,s.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:f.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,s)=>x.onRequestError(e,t,a,s,g)},sharedContext:{buildId:h}},H=new T.NodeNextRequest(e),B=new T.NodeNextResponse(t),Y=l.NextRequestAdapter.fromNodeNextRequest(H,(0,l.signalFromNodeResponse)(t));try{let i=async e=>x.handle(Y,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==E.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${L}`)}),o=!!(0,s.getRequestMeta)(e,"minimalMode"),T=async s=>{var n,T;let l=async({previousCacheEntry:r})=>{try{if(!o&&v&&D&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await i(s);e.fetchMetrics=K.renderOpts.fetchMetrics;let T=K.renderOpts.pendingWaitUntil;T&&a.waitUntil&&(a.waitUntil(T),T=void 0);let l=K.renderOpts.collectedTags;if(!w)return await (0,u.sendResponse)(H,B,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,c.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[A.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=A.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=A.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:R.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await x.onRequestError(e,t,{routerKind:"App Router",routePath:L,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,g),t}},E=await x.handleResponse({req:e,nextConfig:f,cacheKey:F,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:M,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:D,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:o});if(!w)return null;if((null==E||null==(n=E.value)?void 0:n.kind)!==R.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==E||null==(T=E.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",v?"REVALIDATED":E.isMiss?"MISS":E.isStale?"STALE":"HIT"),m&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let N=(0,c.fromNodeOutgoingHttpHeaders)(E.value.headers);return o&&w||N.delete(A.NEXT_CACHE_TAGS_HEADER),!E.cacheControl||t.getHeader("Cache-Control")||N.get("Cache-Control")||N.set("Cache-Control",(0,p.getCacheControlHeader)(E.cacheControl)),await (0,u.sendResponse)(H,B,new Response(E.value.body,{headers:N,status:E.value.status||200})),null};q?await T(q):await j.withPropagatedContext(e.headers,()=>j.trace(E.BaseServerSpan.handleRequest,{spanName:`${k} ${L}`,kind:n.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},T))}catch(t){if(t instanceof N.NoFallbackError||await x.onRequestError(e,t,{routerKind:"App Router",routePath:y,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,g),w)throw t;return await (0,u.sendResponse)(H,B,new Response(null,{status:500})),null}}e.s(["handler",()=>v,"patchFetch",()=>g,"routeModule",()=>x,"serverHooks",()=>M,"workAsyncStorage",()=>C,"workUnitAsyncStorage",()=>m],81362)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__f3d8288b._.js.map