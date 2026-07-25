module.exports=[22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021),r=e.i(22734),a=e.i(14747);try{let e=(0,a.resolve)(process.cwd(),".env");for(let t of(0,r.readFileSync)(e,"utf-8").split("\n")){let e=t.trim();if(e.startsWith("DATABASE_URL=")){let t=e.slice(13);(t.startsWith("postgresql://")||t.startsWith("postgres://"))&&(process.env.DATABASE_URL=t)}}}catch{}let n=globalThis,i=n.prisma??new t.PrismaClient({log:[]});async function o(){if((process.env.DATABASE_URL||"").startsWith("file:"))try{await i.$executeRawUnsafe(`
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
    `)}catch(e){console.error("ensureDb error:",e)}}n.prisma=i,e.s(["db",0,i,"ensureDb",()=>o])},9946,e=>{"use strict";var t=e.i(43793);let r="https://oauth2.googleapis.com/token",a="https://www.googleapis.com/drive/v3";function n(e){let t=e||process.env.NEXT_PUBLIC_APP_URL;if(!t)throw Error("NEXT_PUBLIC_APP_URL is not set. Add it to .env, e.g. NEXT_PUBLIC_APP_URL=https://these-frame.vercel.app");let r=t.replace(/\/+$/,"");return`${r}/api/cloud-drive/callback`}function i(e,t){let r=process.env.GOOGLE_DRIVE_CLIENT_ID,a=n(t);if(!r)throw Error("GOOGLE_DRIVE_CLIENT_ID not configured");let i=new URLSearchParams({client_id:r,redirect_uri:a,response_type:"code",scope:"https://www.googleapis.com/auth/drive.file",access_type:"offline",prompt:"consent",...e?{state:e}:{}});return`https://accounts.google.com/o/oauth2/v2/auth?${i.toString()}`}async function o(e,t){let a=n(t),i=await fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code:e,client_id:process.env.GOOGLE_DRIVE_CLIENT_ID,client_secret:process.env.GOOGLE_DRIVE_CLIENT_SECRET,redirect_uri:a,grant_type:"authorization_code"})});if(!i.ok){let e=await i.text();throw Error(`Token exchange failed: ${e}`)}let o=await i.json();return{access_token:o.access_token,refresh_token:o.refresh_token,expires_in:o.expires_in}}async function s(e){let a=await fetch(r,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({refresh_token:e,client_id:process.env.GOOGLE_DRIVE_CLIENT_ID,client_secret:process.env.GOOGLE_DRIVE_CLIENT_SECRET,grant_type:"refresh_token"})});if(!a.ok){let e=await a.text();throw Error(`Token refresh failed: ${e}`)}let n=await a.json(),i=await t.db.cloudDriveConnection.findFirst({where:{provider:"google_drive"}});if(i){let r=new Date(Date.now()+1e3*n.expires_in);await t.db.cloudDriveConnection.update({where:{id:i.id},data:{accessToken:n.access_token,refreshToken:n.refresh_token||e,tokenExpiresAt:r}})}return n.access_token}async function T(){let e=await t.db.cloudDriveConnection.findFirst({where:{provider:"google_drive"}});if(!e?.accessToken)throw Error("Google Drive not connected");if(e.tokenExpiresAt&&new Date(e.tokenExpiresAt).getTime()-Date.now()<3e5){if(!e.refreshToken)throw Error("No refresh token available");return s(e.refreshToken)}return e.accessToken}async function l(e){let t=await fetch("https://www.googleapis.com/oauth2/v2/userinfo",{headers:{Authorization:`Bearer ${e}`}});if(!t.ok)throw Error("Failed to fetch Google profile");let r=await t.json();return{email:r.email,name:r.name||r.given_name||""}}async function d(e,t="ThesisFrame"){let r=encodeURIComponent(`name='${t}' and mimeType='application/vnd.google-apps.folder' and trashed=false`),n=await fetch(`${a}/files?q=${r}&spaces=drive&fields=files(id)`,{headers:{Authorization:`Bearer ${e}`}});if(n.ok){let e=await n.json();if(e.files?.length>0)return e.files[0].id}let i=await fetch(`${a}/files`,{method:"POST",headers:{Authorization:`Bearer ${e}`,"Content-Type":"application/json"},body:JSON.stringify({name:t,mimeType:"application/vnd.google-apps.folder"})});if(!i.ok)throw Error("Failed to create ThesisFrame folder");return(await i.json()).id}async function c(e=10){let t=await T(),r=await d(t),n=encodeURIComponent(`'${r}' in parents and trashed=false`),i=await fetch(`${a}/files?q=${n}&orderBy=modifiedTime desc&pageSize=${e}&fields=files(id,name,webViewLink,createdTime)`,{headers:{Authorization:`Bearer ${t}`}});return i.ok&&(await i.json()).files||[]}e.s(["exchangeCode",()=>o,"getGoogleAuthUrl",()=>i,"getGoogleProfile",()=>l,"listDriveFiles",()=>c])},89621,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),i=e.i(61916),o=e.i(74677),s=e.i(69741),T=e.i(16795),l=e.i(87718),d=e.i(95169),c=e.i(47587),E=e.i(66012),p=e.i(70101),u=e.i(26937),h=e.i(10372),A=e.i(93695);e.i(52474);var N=e.i(220),f=e.i(89171),L=e.i(9946),R=e.i(43793);async function U(){try{let e=await R.db.cloudDriveConnection.findFirst({where:{provider:"google_drive"}});if(!e?.connected)return f.NextResponse.json({files:[],connected:!1});let t=await (0,L.listDriveFiles)(10);return f.NextResponse.json({files:t,connected:!0})}catch{return f.NextResponse.json({files:[],error:"Impossible de lister les fichiers"})}}e.s(["GET",()=>U],811);var I=e.i(811);let w=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/cloud-drive/files/route",pathname:"/api/cloud-drive/files",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/cloud-drive/files/route.ts",nextConfigOutput:"standalone",userland:I}),{workAsyncStorage:v,workUnitAsyncStorage:_,serverHooks:m}=w;function g(){return(0,a.patchFetch)({workAsyncStorage:v,workUnitAsyncStorage:_})}async function x(e,t,a){w.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let f="/api/cloud-drive/files/route";f=f.replace(/\/index$/,"")||"/";let L=await w.prepare(e,t,{srcPage:f,multiZoneDraftMode:!1});if(!L)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:R,params:U,nextConfig:I,parsedUrl:v,isDraftMode:_,prerenderManifest:m,routerServerContext:g,isOnDemandRevalidate:x,revalidateOnlyGenerated:D,resolvedPathname:C,clientReferenceManifest:O,serverActionsManifest:y}=L,M=(0,s.normalizeAppPath)(f),S=!!(m.dynamicRoutes[M]||m.routes[C]),P=async()=>((null==g?void 0:g.render404)?await g.render404(e,t,v,!1):t.end("This page could not be found"),null);if(S&&!_){let e=!!m.routes[C],t=m.dynamicRoutes[M];if(t&&!1===t.fallback&&!e){if(I.experimental.adapterPath)return await P();throw new A.NoFallbackError}}let X=null;!S||w.isDev||_||(X="/index"===(X=C)?"/":X);let k=!0===w.isDev||!S,F=S&&!k;y&&O&&(0,o.setManifestsSingleton)({page:f,clientReferenceManifest:O,serverActionsManifest:y});let b=e.method||"GET",j=(0,i.getTracer)(),$=j.getActiveScopeSpan(),q={params:U,prerenderManifest:m,renderOpts:{experimental:{authInterrupts:!!I.experimental.authInterrupts},cacheComponents:!!I.cacheComponents,supportsDynamicResponse:k,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:I.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>w.onRequestError(e,t,a,n,g)},sharedContext:{buildId:R}},G=new T.NodeNextRequest(e),B=new T.NodeNextResponse(t),H=l.NextRequestAdapter.fromNodeNextRequest(G,(0,l.signalFromNodeResponse)(t));try{let o=async e=>w.handle(H,q).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=j.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${b} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${b} ${f}`)}),s=!!(0,n.getRequestMeta)(e,"minimalMode"),T=async n=>{var i,T;let l=async({previousCacheEntry:r})=>{try{if(!s&&x&&D&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let i=await o(n);e.fetchMetrics=q.renderOpts.fetchMetrics;let T=q.renderOpts.pendingWaitUntil;T&&a.waitUntil&&(a.waitUntil(T),T=void 0);let l=q.renderOpts.collectedTags;if(!S)return await (0,E.sendResponse)(G,B,i,q.renderOpts.pendingWaitUntil),null;{let e=await i.blob(),t=(0,p.toNodeOutgoingHttpHeaders)(i.headers);l&&(t[h.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==q.renderOpts.collectedRevalidate&&!(q.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&q.renderOpts.collectedRevalidate,a=void 0===q.renderOpts.collectedExpire||q.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:q.renderOpts.collectedExpire;return{value:{kind:N.CachedRouteKind.APP_ROUTE,status:i.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await w.onRequestError(e,t,{routerKind:"App Router",routePath:f,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:x})},!1,g),t}},d=await w.handleResponse({req:e,nextConfig:I,cacheKey:X,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:m,isRoutePPREnabled:!1,isOnDemandRevalidate:x,revalidateOnlyGenerated:D,responseGenerator:l,waitUntil:a.waitUntil,isMinimalMode:s});if(!S)return null;if((null==d||null==(i=d.value)?void 0:i.kind)!==N.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==d||null==(T=d.value)?void 0:T.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",x?"REVALIDATED":d.isMiss?"MISS":d.isStale?"STALE":"HIT"),_&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let A=(0,p.fromNodeOutgoingHttpHeaders)(d.value.headers);return s&&S||A.delete(h.NEXT_CACHE_TAGS_HEADER),!d.cacheControl||t.getHeader("Cache-Control")||A.get("Cache-Control")||A.set("Cache-Control",(0,u.getCacheControlHeader)(d.cacheControl)),await (0,E.sendResponse)(G,B,new Response(d.value.body,{headers:A,status:d.value.status||200})),null};$?await T($):await j.withPropagatedContext(e.headers,()=>j.trace(d.BaseServerSpan.handleRequest,{spanName:`${b} ${f}`,kind:i.SpanKind.SERVER,attributes:{"http.method":b,"http.target":e.url}},T))}catch(t){if(t instanceof A.NoFallbackError||await w.onRequestError(e,t,{routerKind:"App Router",routePath:M,routeType:"route",revalidateReason:(0,c.getRevalidateReason)({isStaticGeneration:F,isOnDemandRevalidate:x})},!1,g),S)throw t;return await (0,E.sendResponse)(G,B,new Response(null,{status:500})),null}}e.s(["handler",()=>x,"patchFetch",()=>g,"routeModule",()=>w,"serverHooks",()=>m,"workAsyncStorage",()=>v,"workUnitAsyncStorage",()=>_],89621)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__6606dd2c._.js.map