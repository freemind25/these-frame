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
    `)}catch(e){console.error("ensureDb error:",e)}}a.prisma=s,e.s(["db",0,s,"ensureDb",()=>i])},32139,e=>e.a(async(t,r)=>{try{let t=await e.y("z-ai-web-dev-sdk-55cc529b8c59a411");e.n(t),r()}catch(e){r(e)}},!0),46786,(e,t,r)=>{t.exports=e.x("os",()=>require("os"))},51963,e=>e.a(async(t,r)=>{try{var n=e.i(22734),a=e.i(14747),s=e.i(46786),i=e.i(32139),o=t([i]);[i]=o.then?(await o)():o;let d=null,u=!1,p=null;function T(){let e=process.env.ZAI_BASE_URL,t=process.env.ZAI_API_KEY;if(!e||!t)return null;let r={baseUrl:e,apiKey:t};return process.env.ZAI_CHAT_ID&&(r.chatId=process.env.ZAI_CHAT_ID),process.env.ZAI_USER_ID&&(r.userId=process.env.ZAI_USER_ID),process.env.ZAI_TOKEN&&(r.token=process.env.ZAI_TOKEN),r}function l(){try{for(let e of[".z-ai-config",(0,a.join)((0,s.homedir)(),".z-ai-config"),"/etc/.z-ai-config"])try{if(!(0,n.existsSync)(e))continue;let t=JSON.parse((0,n.readFileSync)(e,"utf-8"));if(t.baseUrl&&t.apiKey)return t}catch{}}catch{}return null}async function E(){if(d)return d;if(u&&p)throw Error(p);u=!0;let e=l();if(e)try{return d=new i.default(e)}catch(e){console.error("Failed to initialize ZAI from file config:",e)}let t=T();if(t)try{return d=new i.default(t)}catch(e){console.error("Failed to initialize ZAI from env config:",e)}throw p="Configuration IA non trouvée. Sur Vercel, ajoutez les variables d'environnement : ZAI_BASE_URL, ZAI_API_KEY, ZAI_CHAT_ID, ZAI_TOKEN, ZAI_USER_ID. En local, le fichier .z-ai-config est utilisé automatiquement.",Error(p)}function c(){if(T())return!0;try{if(l())return!0}catch{}return!1}e.s(["getZAI",()=>E,"isZAIConfigured",()=>c]),r()}catch(e){r(e)}},!1),17842,e=>e.a(async(t,r)=>{try{var n=e.i(89171),a=e.i(43793),s=e.i(51963),i=t([s]);[s]=i.then?(await i)():i;let T=`Tu es un assistant de recherche acad\xe9mique. R\xe9ponds \xe0 la question de l'\xe9tudiant en te basant EXCLUSIVEMENT sur les sources fournies. Cite les sources utilis\xe9es. Si les sources ne contiennent pas assez d'information, indique-le clairement.`;async function o(e){try{let{question:t,sourceIds:r}=await e.json();if(!t||"string"!=typeof t||0===t.trim().length)return n.NextResponse.json({error:"La question est requise."},{status:400});let i=r&&r.length>0?await a.db.researchSource.findMany({where:{id:{in:r}}}):await a.db.researchSource.findMany();if(0===i.length)return n.NextResponse.json({error:"Aucune source disponible. Veuillez d'abord ajouter des sources."},{status:400});let o=i.map((e,t)=>`--- Source ${t+1} : ${e.title} ---
${e.content}`).join("\n\n"),l=`${T}

Sources disponibles :

${o}`,E=await (0,s.getZAI)(),c=await E.chat.completions.create({messages:[{role:"system",content:l},{role:"user",content:t.trim()}],thinking:{type:"disabled"}}),d=c.choices?.[0]?.message?.content||"Désolé, une erreur est survenue lors de la génération.",u=i.map(e=>e.id),p=await a.db.notebookEntry.create({data:{question:t.trim(),answer:d,sourceIds:u.join(",")}});return n.NextResponse.json({success:!0,answer:d,sourceIds:u,entryId:p.id})}catch(e){return console.error("Notebook ask error:",e),n.NextResponse.json({error:e instanceof Error?e.message:"Erreur interne du serveur."},{status:500})}}e.s(["POST",()=>o]),r()}catch(e){r(e)}},!1),6801,e=>e.a(async(t,r)=>{try{var n=e.i(47909),a=e.i(74017),s=e.i(96250),i=e.i(59756),o=e.i(61916),T=e.i(74677),l=e.i(69741),E=e.i(16795),c=e.i(87718),d=e.i(95169),u=e.i(47587),p=e.i(66012),A=e.i(70101),N=e.i(26937),R=e.i(10372),L=e.i(93695);e.i(52474);var h=e.i(220),I=e.i(17842),U=t([I]);[I]=U.then?(await U)():U;let v=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/notebook/ask/route",pathname:"/api/notebook/ask",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/notebook/ask/route.ts",nextConfigOutput:"standalone",userland:I}),{workAsyncStorage:m,workUnitAsyncStorage:D,serverHooks:y}=v;function f(){return(0,s.patchFetch)({workAsyncStorage:m,workUnitAsyncStorage:D})}async function x(e,t,r){v.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let n="/api/notebook/ask/route";n=n.replace(/\/index$/,"")||"/";let s=await v.prepare(e,t,{srcPage:n,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:I,params:U,nextConfig:f,parsedUrl:x,isDraftMode:m,prerenderManifest:D,routerServerContext:y,isOnDemandRevalidate:C,revalidateOnlyGenerated:g,resolvedPathname:O,clientReferenceManifest:S,serverActionsManifest:M}=s,_=(0,l.normalizeAppPath)(n),w=!!(D.dynamicRoutes[_]||D.routes[O]),X=async()=>((null==y?void 0:y.render404)?await y.render404(e,t,x,!1):t.end("This page could not be found"),null);if(w&&!m){let e=!!D.routes[O],t=D.dynamicRoutes[_];if(t&&!1===t.fallback&&!e){if(f.experimental.adapterPath)return await X();throw new L.NoFallbackError}}let b=null;!w||v.isDev||m||(b=O,b="/index"===b?"/":b);let F=!0===v.isDev||!w,P=w&&!F;M&&S&&(0,T.setManifestsSingleton)({page:n,clientReferenceManifest:S,serverActionsManifest:M});let k=e.method||"GET",q=(0,o.getTracer)(),j=q.getActiveScopeSpan(),K={params:U,prerenderManifest:D,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:f.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,n,a)=>v.onRequestError(e,t,n,a,y)},sharedContext:{buildId:I}},H=new E.NodeNextRequest(e),Z=new E.NodeNextResponse(t),B=c.NextRequestAdapter.fromNodeNextRequest(H,(0,c.signalFromNodeResponse)(t));try{let s=async e=>v.handle(B,K).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${k} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${k} ${n}`)}),T=!!(0,i.getRequestMeta)(e,"minimalMode"),l=async i=>{var o,l;let E=async({previousCacheEntry:a})=>{try{if(!T&&C&&g&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let n=await s(i);e.fetchMetrics=K.renderOpts.fetchMetrics;let o=K.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let l=K.renderOpts.collectedTags;if(!w)return await (0,p.sendResponse)(H,Z,n,K.renderOpts.pendingWaitUntil),null;{let e=await n.blob(),t=(0,A.toNodeOutgoingHttpHeaders)(n.headers);l&&(t[R.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==K.renderOpts.collectedRevalidate&&!(K.renderOpts.collectedRevalidate>=R.INFINITE_CACHE)&&K.renderOpts.collectedRevalidate,a=void 0===K.renderOpts.collectedExpire||K.renderOpts.collectedExpire>=R.INFINITE_CACHE?void 0:K.renderOpts.collectedExpire;return{value:{kind:h.CachedRouteKind.APP_ROUTE,status:n.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==a?void 0:a.isStale)&&await v.onRequestError(e,t,{routerKind:"App Router",routePath:n,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:C})},!1,y),t}},c=await v.handleResponse({req:e,nextConfig:f,cacheKey:b,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:D,isRoutePPREnabled:!1,isOnDemandRevalidate:C,revalidateOnlyGenerated:g,responseGenerator:E,waitUntil:r.waitUntil,isMinimalMode:T});if(!w)return null;if((null==c||null==(o=c.value)?void 0:o.kind)!==h.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(l=c.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});T||t.setHeader("x-nextjs-cache",C?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),m&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,A.fromNodeOutgoingHttpHeaders)(c.value.headers);return T&&w||d.delete(R.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,N.getCacheControlHeader)(c.cacheControl)),await (0,p.sendResponse)(H,Z,new Response(c.value.body,{headers:d,status:c.value.status||200})),null};j?await l(j):await q.withPropagatedContext(e.headers,()=>q.trace(d.BaseServerSpan.handleRequest,{spanName:`${k} ${n}`,kind:o.SpanKind.SERVER,attributes:{"http.method":k,"http.target":e.url}},l))}catch(t){if(t instanceof L.NoFallbackError||await v.onRequestError(e,t,{routerKind:"App Router",routePath:_,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:P,isOnDemandRevalidate:C})},!1,y),w)throw t;return await (0,p.sendResponse)(H,Z,new Response(null,{status:500})),null}}e.s(["handler",()=>x,"patchFetch",()=>f,"routeModule",()=>v,"serverHooks",()=>y,"workAsyncStorage",()=>m,"workUnitAsyncStorage",()=>D]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__f21b1c4b._.js.map