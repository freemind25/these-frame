module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),s=e.i(14747);try{let e=(0,s.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let n=globalThis,a=n.prisma??new t.PrismaClient({log:[]});async function o(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await a.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}n.prisma=a,e.s(["db",0,a,"ensureDb",()=>o])},33875,e=>{"use strict";var t=e.i(47909),r=e.i(74017),s=e.i(96250),n=e.i(59756),a=e.i(61916),o=e.i(74677),i=e.i(69741),l=e.i(16795),T=e.i(87718),u=e.i(95169),d=e.i(47587),c=e.i(66012),E=e.i(70101),p=e.i(26937),m=e.i(10372),A=e.i(93695);e.i(52474);var N=e.i(220),R=e.i(89171),h=e.i(43793);let L=["google/gemma-4-26b-a4b-it:free","nvidia/nemotron-3-super-120b-a12b:free","nvidia/nemotron-3-nano-30b-a3b:free"];async function x(e,t,r){let s=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({model:t,messages:r})});if(!s.ok){let e=await s.text(),r=s.headers.get("x-ratelimit-remaining"),n=s.headers.get("x-ratelimit-limit");if(429===s.status){let e=Error("RATE_LIMIT");throw e.rateLimitRemaining=r,e.rateLimitLimit=n,e.statusCode=429,e}throw Error(`OpenRouter (${t}): ${s.status} - ${e.slice(0,200)}`)}let n=await s.json(),a=s.headers.get("x-ratelimit-remaining"),o=s.headers.get("x-ratelimit-limit");return a&&o&&(n._rateLimit={remaining:parseInt(a),limit:parseInt(o)}),n.choices?.[0]?.message?.content||""}async function f(e,t,r){let s=t.replace("mistral-direct/",""),n=await fetch("https://api.mistral.ai/v1/chat/completions",{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({model:s,messages:r})});if(!n.ok){let e=await n.text();throw Error(`Mistral (${s}): ${n.status} - ${e.slice(0,200)}`)}let a=await n.json();return a.choices?.[0]?.message?.content||""}async function U(e,t,r,s){if(r.startsWith("mistral-direct/")){if(!t)throw Error("Clé API Mistral non configurée.");return f(t,r,s)}if(!e)throw Error("Clé API OpenRouter non configurée.");return x(e,r,s)}async function g(e,t,r,s,n){let a=n.map(e=>`[${e.modelId}]:
${e.response}`).join("\n\n---\n\n"),o=`Tu es un \xe9valuateur de consensus entre plusieurs mod\xe8les d'IA.

Question originale : ${s}

Voici les r\xe9ponses de chaque mod\xe8le :

${a}

\xc9value le niveau de consensus entre ces r\xe9ponses sur une \xe9chelle de 0 \xe0 100%.

- 100% = Les r\xe9ponses sont parfaitement align\xe9es sur les m\xeames points cl\xe9s, conclusions et recommandations.
- 0% = Les r\xe9ponses sont contradictoires ou totalement divergentes.

R\xe9ponds EXACTEMENT sous ce format (en fran\xe7ais) :
SCORE: [nombre entre 0 et 100]
R\xc9SUM\xc9: [br\xe8ve description en 1-2 phrases du niveau d'accord et des points de convergence/divergence]`,i=await U(e,t,r,[{role:"user",content:o}]),l=i.match(/SCORE:\s*(\d+)/),T=i.match(/RÉSUMÉ:\s*([\s\S]*?)(?:\n|$)/);return{score:l?Math.min(100,Math.max(0,parseInt(l[1],10))):50,summary:T?T[1].trim():i.trim().slice(0,300)}}async function I(){try{let e=await h.db.aiToolConfig.findFirst({where:{tool:"openrouter"}}),t=await h.db.aiToolConfig.findFirst({where:{tool:"mistral"}}),r=!1;if(e?.extraConfig)try{r=!0===JSON.parse(e.extraConfig).isFreeTier}catch{}return R.NextResponse.json({connected:!!e?.apiKey,mistralConnected:!!t?.apiKey,isFreeTier:r})}catch(e){return R.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}async function C(e){try{let t,{question:r,models:s,modelIds:n,maxRounds:a,evaluatorModel:o}=await e.json();if(!r||"string"!=typeof r||0===r.trim().length)return R.NextResponse.json({error:"La question est requise."},{status:400});let i=await h.db.aiToolConfig.findFirst({where:{tool:"openrouter"}}),l=await h.db.aiToolConfig.findFirst({where:{tool:"mistral"}}),T=i?.apiKey||void 0,u=l?.apiKey||void 0;if(!T&&!u)return R.NextResponse.json({error:"Aucune clé API configurée. Configurez au moins OpenRouter ou Mistral."},{status:400});let d=n&&n.length>0||s&&s.length>0?n||s:L,c=Math.min(Math.max(a||2,1),10),E=d.some(e=>e.startsWith("mistral-direct/")),p=d.some(e=>!e.startsWith("mistral-direct/"));t=o||(E&&!p&&u||u&&!T?"mistral-direct/mistral-small-latest":"google/gemma-4-26b-a4b-it:free");let m=[],A=[],N=d.map(async e=>{let t=await U(T,u,e,[{role:"user",content:r}]);return{modelId:e,response:t}});A=await Promise.all(N);let x=await g(T,u,t,r,A);m.push({round:1,responses:A,consensusScore:x.score,consensusSummary:x.summary});for(let e=2;e<=c;e++){let s=A.map(e=>`[${e.modelId}]: ${e.response}`).join("\n\n---\n\n"),n=`Question originale : ${r}

Voici les r\xe9ponses pr\xe9c\xe9dentes de tous les mod\xe8les :

${s}

En te basant sur ces r\xe9ponses, affine ta propre r\xe9ponse pour tendre vers un consensus avec les autres mod\xe8les. Identifie les points d'accord et propose une r\xe9ponse nuanc\xe9e qui int\xe8gre les meilleures contributions de chacun. Si tu es en d\xe9saccord avec un point, explique bri\xe8vement pourquoi.`,a=d.map(async e=>{let t=await U(T,u,e,[{role:"user",content:r},{role:"assistant",content:A.find(t=>t.modelId===e)?.response||""},{role:"user",content:n}]);return{modelId:e,response:t}});A=await Promise.all(a);let o=await g(T,u,t,r,A);if(m.push({round:e,responses:A,consensusScore:o.score,consensusSummary:o.summary}),o.score>=90)break}let f=m[m.length-1],I={score:f.consensusScore,summary:f.consensusSummary,reached:f.consensusScore>=75};return R.NextResponse.json({success:!0,score:I.score,consensus:I.summary,rounds:m.map(e=>({round:e.round,responses:e.responses.map(e=>({model:e.modelId,label:e.modelId.split("/").pop()?.replace(/-/g," ").replace(/\b\w/g,e=>e.toUpperCase())||e.modelId,response:e.response}))}))})}catch(e){if(console.error("Consensus error:",e),e instanceof Error&&"RATE_LIMIT"===e.message){let t=e.rateLimitRemaining,r=e.rateLimitLimit;return R.NextResponse.json({error:"rate_limit",message:`Limite quotidienne atteinte${r?` (${r} requ\xeates/jour)`:""}. Le plan gratuit OpenRouter est limit\xe9 \xe0 50 requ\xeates/jour pour les mod\xe8les gratuits. Ajoutez 10€ de cr\xe9dits pour obtenir 1000 requ\xeates/jour gratuites, ou attendez demain (r\xe9initialisation \xe0 00h UTC).`,rateLimitRemaining:t,rateLimitLimit:r},{status:429})}return R.NextResponse.json({error:e instanceof Error?e.message:"Erreur interne du serveur."},{status:500})}}e.s(["GET",()=>I,"POST",()=>C],54118);var v=e.i(54118);let M=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/consensus/route",pathname:"/api/consensus",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/consensus/route.ts",nextConfigOutput:"standalone",userland:v}),{workAsyncStorage:O,workUnitAsyncStorage:y,serverHooks:S}=M;function w(){return(0,s.patchFetch)({workAsyncStorage:O,workUnitAsyncStorage:y})}async function D(e,t,s){M.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/consensus/route";R=R.replace(/\/index$/,"")||"/";let h=await M.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!h)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:L,params:x,nextConfig:f,parsedUrl:U,isDraftMode:g,prerenderManifest:I,routerServerContext:C,isOnDemandRevalidate:v,revalidateOnlyGenerated:O,resolvedPathname:y,clientReferenceManifest:S,serverActionsManifest:w}=h,D=(0,i.normalizeAppPath)(R),b=!!(I.dynamicRoutes[D]||I.routes[y]),X=async()=>((null==C?void 0:C.render404)?await C.render404(e,t,U,!1):t.end("This page could not be found"),null);if(b&&!g){let e=!!I.routes[y],t=I.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(f.experimental.adapterPath)return await X();throw new A.NoFallbackError}}let P=null;!b||M.isDev||g||(P="/index"===(P=y)?"/":P);let F=!0===M.isDev||!b,_=b&&!F;w&&S&&(0,o.setManifestsSingleton)({page:R,clientReferenceManifest:S,serverActionsManifest:w});let j=e.method||"GET",q=(0,a.getTracer)(),k=q.getActiveScopeSpan(),$={params:x,prerenderManifest:I,renderOpts:{experimental:{authInterrupts:!!f.experimental.authInterrupts},cacheComponents:!!f.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:f.cacheLife,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s,n)=>M.onRequestError(e,t,s,n,C)},sharedContext:{buildId:L}},K=new l.NodeNextRequest(e),B=new l.NodeNextResponse(t),H=T.NextRequestAdapter.fromNodeNextRequest(K,(0,T.signalFromNodeResponse)(t));try{let o=async e=>M.handle(H,$).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=q.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route");if(s){let t=`${j} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t)}else e.updateName(`${j} ${R}`)}),i=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var a,l;let T=async({previousCacheEntry:r})=>{try{if(!i&&v&&O&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await o(n);e.fetchMetrics=$.renderOpts.fetchMetrics;let l=$.renderOpts.pendingWaitUntil;l&&s.waitUntil&&(s.waitUntil(l),l=void 0);let T=$.renderOpts.collectedTags;if(!b)return await (0,c.sendResponse)(K,B,a,$.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,E.toNodeOutgoingHttpHeaders)(a.headers);T&&(t[m.NEXT_CACHE_TAGS_HEADER]=T),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==$.renderOpts.collectedRevalidate&&!($.renderOpts.collectedRevalidate>=m.INFINITE_CACHE)&&$.renderOpts.collectedRevalidate,s=void 0===$.renderOpts.collectedExpire||$.renderOpts.collectedExpire>=m.INFINITE_CACHE?void 0:$.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==r?void 0:r.isStale)&&await M.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,C),t}},u=await M.handleResponse({req:e,nextConfig:f,cacheKey:P,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:I,isRoutePPREnabled:!1,isOnDemandRevalidate:v,revalidateOnlyGenerated:O,responseGenerator:T,waitUntil:s.waitUntil,isMinimalMode:i});if(!b)return null;if((null==u||null==(a=u.value)?void 0:a.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});i||t.setHeader("x-nextjs-cache",v?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),g&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let A=(0,E.fromNodeOutgoingHttpHeaders)(u.value.headers);return i&&b||A.delete(m.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||A.get("Cache-Control")||A.set("Cache-Control",(0,p.getCacheControlHeader)(u.cacheControl)),await (0,c.sendResponse)(K,B,new Response(u.value.body,{headers:A,status:u.value.status||200})),null};k?await l(k):await q.withPropagatedContext(e.headers,()=>q.trace(u.BaseServerSpan.handleRequest,{spanName:`${j} ${R}`,kind:a.SpanKind.SERVER,attributes:{"http.method":j,"http.target":e.url}},l))}catch(t){if(t instanceof A.NoFallbackError||await M.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,d.getRevalidateReason)({isStaticGeneration:_,isOnDemandRevalidate:v})},!1,C),b)throw t;return await (0,c.sendResponse)(K,B,new Response(null,{status:500})),null}}e.s(["handler",()=>D,"patchFetch",()=>w,"routeModule",()=>M,"serverHooks",()=>S,"workAsyncStorage",()=>O,"workUnitAsyncStorage",()=>y],33875)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__0320bea6._.js.map