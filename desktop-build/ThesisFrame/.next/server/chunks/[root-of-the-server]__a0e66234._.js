module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),s=e.i(14747);try{let e=(0,s.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let i=globalThis,a=i.prisma??new t.PrismaClient({log:[]});async function n(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await a.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}i.prisma=a,e.s(["db",0,a,"ensureDb",()=>n])},36161,e=>{"use strict";var t=e.i(47909),r=e.i(74017),s=e.i(96250),i=e.i(59756),a=e.i(61916),n=e.i(74677),o=e.i(69741),l=e.i(16795),d=e.i(87718),T=e.i(95169),c=e.i(47587),u=e.i(66012),p=e.i(70101),E=e.i(26937),h=e.i(10372),A=e.i(93695);e.i(52474);var N=e.i(220),R=e.i(89171),L=e.i(43793);let U=[{order:1,number:"I",title:"Introduction générale",shortTitle:"Introduction",icon:"FileText",color:"emerald",description:"Contexte, problématique, objectifs et plan de la thèse.",expectations:["Amener le sujet par un contexte large (domaine disciplinaire)","Faire émerger une problématique de recherche claire","Formuler les objectifs principaux de la recherche","Présenter les hypothèses de recherche","Annoncer le plan du manuscrit (chapitre par chapitre)"],structure:["1.1 Contexte général du domaine","1.2 Problématique de recherche","1.3 Questions et hypothèses de recherche","1.4 Objectifs de la recherche","1.5 Apports et intérêt scientifique","1.6 Organisation du manuscrit"]},{order:2,number:"II",title:"Données bibliographiques et cadre théorique",shortTitle:"Bibliographie",icon:"BookOpen",color:"sky",description:"Revue de littérature, cadre conceptuel et positionnement théorique.",expectations:["Couvrir les principaux courants théoriques du domaine","Identifier les lacunes de la recherche (research gaps)","Construire un cadre conceptuel cohérent","Positionner votre travail par rapport aux études antérieures","Définir les concepts clés avec précision"],structure:["2.1 Revue de littérature thématique","2.2 Cadre conceptuel et théorique","2.3 Positionnement par rapport aux travaux existants","2.4 Définition des concepts opérationnels"]},{order:3,number:"III",title:"Cadre méthodologique",shortTitle:"Méthodologie",icon:"FlaskConical",color:"amber",description:"Design de recherche, outils de collecte et techniques d'analyse.",expectations:["Justifier le choix du design de recherche","Décrire la population et l'échantillon","Présenter les instruments de collecte de données","Expliquer les techniques d'analyse","Aborder les considérations éthiques"],structure:["3.1 Approche épistémologique et design de recherche","3.2 Population et stratégie d'échantillonnage","3.3 Instruments et procédures de collecte des données","3.4 Techniques d'analyse des données","3.5 Considérations éthiques"]},{order:4,number:"IV",title:"Résultats",shortTitle:"Résultats",icon:"BarChart3",color:"violet",description:"Présentation des analyses et des principaux résultats de la recherche.",expectations:["Présenter les résultats de manière organisée","Utiliser tableaux, figures et graphiques","Rapporter les analyses statistiques ou qualitatives","Restituer les résultats par objectif / hypothèse"],structure:["4.1 Résultats de l'analyse descriptive","4.2 Résultats de l'analyse inférentielle / qualitative","4.3 Synthèse des résultats par hypothèse"]},{order:5,number:"V",title:"Discussion",shortTitle:"Discussion",icon:"MessageSquare",color:"rose",description:"Interprétation des résultats, mise en perspective et limites.",expectations:["Interpréter les résultats à la lumière de la littérature","Confronter les résultats aux hypothèses initiales","Discuter les implications théoriques et pratiques","Identifier les limites de l'étude","Proposer des perspectives de recherche future"],structure:["5.1 Interprétation et mise en perspective","5.2 Confrontation aux hypothèses et à la littérature","5.3 Implications théoriques et pratiques","5.4 Limites de l'étude","5.5 Perspectives de recherche"]},{order:6,number:"VI",title:"Conclusion générale",shortTitle:"Conclusion",icon:"GraduationCap",color:"teal",description:"Synthèse globale, réponse à la problématique et contribution.",expectations:["Rappeler la problématique et les objectifs","Synthétiser les principaux résultats","Répondre explicitement à la problématique","Dégager la contribution scientifique","Ouvrir sur des perspectives"],structure:["6.1 Rappel de la problématique et des objectifs","6.2 Synthèse des principaux résultats","6.3 Réponse à la problématique de recherche","6.4 Contribution scientifique","6.5 Perspectives et ouverture"]}];async function x(){try{await (0,L.ensureDb)();let e=await L.db.thesis.findFirst({include:{chapters:{orderBy:{order:"asc"}}}});if(e)return R.NextResponse.json(e);let t=await L.db.thesis.create({data:{chapters:{create:U.map(e=>({order:e.order,number:e.number,title:e.title,content:"",wordCount:0,status:"draft"}))}},include:{chapters:{orderBy:{order:"asc"}}}});return R.NextResponse.json(t,{status:201})}catch(e){return console.error("[POST /api/thesis/seed] Error:",e),R.NextResponse.json({error:"Failed to seed thesis"},{status:500})}}e.s(["POST",()=>x],15403);var m=e.i(15403);let I=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/thesis/seed/route",pathname:"/api/thesis/seed",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/thesis/seed/route.ts",nextConfigOutput:"standalone",userland:m}),{workAsyncStorage:f,workUnitAsyncStorage:C,serverHooks:v}=I;function g(){return(0,s.patchFetch)({workAsyncStorage:f,workUnitAsyncStorage:C})}async function D(e,t,s){I.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let R="/api/thesis/seed/route";R=R.replace(/\/index$/,"")||"/";let L=await I.prepare(e,t,{srcPage:R,multiZoneDraftMode:!1});if(!L)return t.statusCode=400,t.end("Bad Request"),null==s.waitUntil||s.waitUntil.call(s,Promise.resolve()),null;let{buildId:U,params:x,nextConfig:m,parsedUrl:f,isDraftMode:C,prerenderManifest:v,routerServerContext:g,isOnDemandRevalidate:D,revalidateOnlyGenerated:b,resolvedPathname:O,clientReferenceManifest:y,serverActionsManifest:M}=L,S=(0,o.normalizeAppPath)(R),P=!!(v.dynamicRoutes[S]||v.routes[O]),q=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,f,!1):t.end("This page could not be found"),null);if(P&&!C){let e=!!v.routes[O],t=v.dynamicRoutes[S];if(t&&!1===t.fallback&&!e){if(m.experimental.adapterPath)return await q();throw new A.NoFallbackError}}let X=null;!P||I.isDev||C||(X="/index"===(X=O)?"/":X);let F=!0===I.isDev||!P,w=P&&!F;M&&y&&(0,n.setManifestsSingleton)({page:R,clientReferenceManifest:y,serverActionsManifest:M});let _=e.method||"GET",k=(0,a.getTracer)(),j=k.getActiveScopeSpan(),B={params:x,prerenderManifest:v,renderOpts:{experimental:{authInterrupts:!!m.experimental.authInterrupts},cacheComponents:!!m.cacheComponents,supportsDynamicResponse:F,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:m.cacheLife,waitUntil:s.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,s,i)=>I.onRequestError(e,t,s,i,g)},sharedContext:{buildId:U}},H=new l.NodeNextRequest(e),K=new l.NodeNextResponse(t),Y=d.NextRequestAdapter.fromNodeNextRequest(H,(0,d.signalFromNodeResponse)(t));try{let n=async e=>I.handle(Y,B).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=k.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==T.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let s=r.get("next.route");if(s){let t=`${_} ${s}`;e.setAttributes({"next.route":s,"http.route":s,"next.span_name":t}),e.updateName(t)}else e.updateName(`${_} ${R}`)}),o=!!(0,i.getRequestMeta)(e,"minimalMode"),l=async i=>{var a,l;let d=async({previousCacheEntry:r})=>{try{if(!o&&D&&b&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await n(i);e.fetchMetrics=B.renderOpts.fetchMetrics;let l=B.renderOpts.pendingWaitUntil;l&&s.waitUntil&&(s.waitUntil(l),l=void 0);let d=B.renderOpts.collectedTags;if(!P)return await (0,u.sendResponse)(H,K,a,B.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(a.headers);d&&(t[h.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==B.renderOpts.collectedRevalidate&&!(B.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&B.renderOpts.collectedRevalidate,s=void 0===B.renderOpts.collectedExpire||B.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:B.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:s}}}}catch(t){throw(null==r?void 0:r.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:R,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:w,isOnDemandRevalidate:D})},!1,g),t}},T=await I.handleResponse({req:e,nextConfig:m,cacheKey:X,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:v,isRoutePPREnabled:!1,isOnDemandRevalidate:D,revalidateOnlyGenerated:b,responseGenerator:d,waitUntil:s.waitUntil,isMinimalMode:o});if(!P)return null;if((null==T||null==(a=T.value)?void 0:a.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==T||null==(l=T.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});o||t.setHeader("x-nextjs-cache",D?"REVALIDATED":T.isMiss?"MISS":T.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let A=(0,p.fromNodeOutgoingHttpHeaders)(T.value.headers);return o&&P||A.delete(h.NEXT_CACHE_TAGS_HEADER),!T.cacheControl||t.getHeader("Cache-Control")||A.get("Cache-Control")||A.set("Cache-Control",(0,E.getCacheControlHeader)(T.cacheControl)),await (0,u.sendResponse)(H,K,new Response(T.value.body,{headers:A,status:T.value.status||200})),null};j?await l(j):await k.withPropagatedContext(e.headers,()=>k.trace(T.BaseServerSpan.handleRequest,{spanName:`${_} ${R}`,kind:a.SpanKind.SERVER,attributes:{"http.method":_,"http.target":e.url}},l))}catch(t){if(t instanceof A.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:S,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:w,isOnDemandRevalidate:D})},!1,g),P)throw t;return await (0,u.sendResponse)(H,K,new Response(null,{status:500})),null}}e.s(["handler",()=>D,"patchFetch",()=>g,"routeModule",()=>I,"serverHooks",()=>v,"workAsyncStorage",()=>f,"workUnitAsyncStorage",()=>C],36161)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__a0e66234._.js.map