module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},63021,(e,t,r)=>{t.exports=e.x("@prisma/client-2c3a283f134fdcb6",()=>require("@prisma/client-2c3a283f134fdcb6"))},43793,e=>{"use strict";var t=e.i(63021);let r=globalThis,a=r.prisma??new t.PrismaClient({log:[]});async function n(){}r.prisma=a,e.s(["db",0,a,"ensureDb",()=>n])},67910,e=>{"use strict";var t=e.i(47909),r=e.i(74017),a=e.i(96250),n=e.i(59756),o=e.i(61916),i=e.i(74677),s=e.i(69741),l=e.i(16795),d=e.i(87718),u=e.i(95169),p=e.i(47587),c=e.i(66012),h=e.i(70101),x=e.i(26937),f=e.i(10372),R=e.i(93695);e.i(52474);var b=e.i(220),m=e.i(89171),v=e.i(43793);async function g(){try{let e=await v.db.reference.findMany({orderBy:{createdAt:"desc"}}),t="";for(let r of e){let e=r.citationKey||`ref_${r.id.slice(0,6)}`,a=r.authors?r.authors.split(";").map(e=>e.trim()).join(" and "):"Unknown";switch(r.type){case"book":t+=`@book{${e},
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

`}}return new m.NextResponse(t,{status:200,headers:{"Content-Type":"text/plain; charset=utf-8","Content-Disposition":'attachment; filename="references.bib"'}})}catch(e){return m.NextResponse.json({error:e instanceof Error?e.message:"Erreur serveur"},{status:500})}}e.s(["GET",()=>g],88603);var $=e.i(88603);let y=new t.AppRouteRouteModule({definition:{kind:r.RouteKind.APP_ROUTE,page:"/api/references/bibtex/route",pathname:"/api/references/bibtex",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/references/bibtex/route.ts",nextConfigOutput:"standalone",userland:$}),{workAsyncStorage:w,workUnitAsyncStorage:E,serverHooks:C}=y;function k(){return(0,a.patchFetch)({workAsyncStorage:w,workUnitAsyncStorage:E})}async function A(e,t,a){y.isDev&&(0,n.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let m="/api/references/bibtex/route";m=m.replace(/\/index$/,"")||"/";let v=await y.prepare(e,t,{srcPage:m,multiZoneDraftMode:!1});if(!v)return t.statusCode=400,t.end("Bad Request"),null==a.waitUntil||a.waitUntil.call(a,Promise.resolve()),null;let{buildId:g,params:$,nextConfig:w,parsedUrl:E,isDraftMode:C,prerenderManifest:k,routerServerContext:A,isOnDemandRevalidate:j,revalidateOnlyGenerated:T,resolvedPathname:N,clientReferenceManifest:P,serverActionsManifest:q}=v,O=(0,s.normalizeAppPath)(m),_=!!(k.dynamicRoutes[O]||k.routes[N]),S=async()=>((null==A?void 0:A.render404)?await A.render404(e,t,E,!1):t.end("This page could not be found"),null);if(_&&!C){let e=!!k.routes[N],t=k.dynamicRoutes[O];if(t&&!1===t.fallback&&!e){if(w.experimental.adapterPath)return await S();throw new R.NoFallbackError}}let H=null;!_||y.isDev||C||(H="/index"===(H=N)?"/":H);let U=!0===y.isDev||!_,D=_&&!U;q&&P&&(0,i.setManifestsSingleton)({page:m,clientReferenceManifest:P,serverActionsManifest:q});let I=e.method||"GET",M=(0,o.getTracer)(),K=M.getActiveScopeSpan(),F={params:$,prerenderManifest:k,renderOpts:{experimental:{authInterrupts:!!w.experimental.authInterrupts},cacheComponents:!!w.cacheComponents,supportsDynamicResponse:U,incrementalCache:(0,n.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:w.cacheLife,waitUntil:a.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>y.onRequestError(e,t,a,n,A)},sharedContext:{buildId:g}},B=new l.NodeNextRequest(e),L=new l.NodeNextResponse(t),G=d.NextRequestAdapter.fromNodeNextRequest(B,(0,d.signalFromNodeResponse)(t));try{let i=async e=>y.handle(G,F).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=M.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==u.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let a=r.get("next.route");if(a){let t=`${I} ${a}`;e.setAttributes({"next.route":a,"http.route":a,"next.span_name":t}),e.updateName(t)}else e.updateName(`${I} ${m}`)}),s=!!(0,n.getRequestMeta)(e,"minimalMode"),l=async n=>{var o,l;let d=async({previousCacheEntry:r})=>{try{if(!s&&j&&T&&!r)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let o=await i(n);e.fetchMetrics=F.renderOpts.fetchMetrics;let l=F.renderOpts.pendingWaitUntil;l&&a.waitUntil&&(a.waitUntil(l),l=void 0);let d=F.renderOpts.collectedTags;if(!_)return await (0,c.sendResponse)(B,L,o,F.renderOpts.pendingWaitUntil),null;{let e=await o.blob(),t=(0,h.toNodeOutgoingHttpHeaders)(o.headers);d&&(t[f.NEXT_CACHE_TAGS_HEADER]=d),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==F.renderOpts.collectedRevalidate&&!(F.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&F.renderOpts.collectedRevalidate,a=void 0===F.renderOpts.collectedExpire||F.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:F.renderOpts.collectedExpire;return{value:{kind:b.CachedRouteKind.APP_ROUTE,status:o.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:a}}}}catch(t){throw(null==r?void 0:r.isStale)&&await y.onRequestError(e,t,{routerKind:"App Router",routePath:m,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:j})},!1,A),t}},u=await y.handleResponse({req:e,nextConfig:w,cacheKey:H,routeKind:r.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:k,isRoutePPREnabled:!1,isOnDemandRevalidate:j,revalidateOnlyGenerated:T,responseGenerator:d,waitUntil:a.waitUntil,isMinimalMode:s});if(!_)return null;if((null==u||null==(o=u.value)?void 0:o.kind)!==b.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==u||null==(l=u.value)?void 0:l.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});s||t.setHeader("x-nextjs-cache",j?"REVALIDATED":u.isMiss?"MISS":u.isStale?"STALE":"HIT"),C&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let R=(0,h.fromNodeOutgoingHttpHeaders)(u.value.headers);return s&&_||R.delete(f.NEXT_CACHE_TAGS_HEADER),!u.cacheControl||t.getHeader("Cache-Control")||R.get("Cache-Control")||R.set("Cache-Control",(0,x.getCacheControlHeader)(u.cacheControl)),await (0,c.sendResponse)(B,L,new Response(u.value.body,{headers:R,status:u.value.status||200})),null};K?await l(K):await M.withPropagatedContext(e.headers,()=>M.trace(u.BaseServerSpan.handleRequest,{spanName:`${I} ${m}`,kind:o.SpanKind.SERVER,attributes:{"http.method":I,"http.target":e.url}},l))}catch(t){if(t instanceof R.NoFallbackError||await y.onRequestError(e,t,{routerKind:"App Router",routePath:O,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:D,isOnDemandRevalidate:j})},!1,A),_)throw t;return await (0,c.sendResponse)(B,L,new Response(null,{status:500})),null}}e.s(["handler",()=>A,"patchFetch",()=>k,"routeModule",()=>y,"serverHooks",()=>C,"workAsyncStorage",()=>w,"workUnitAsyncStorage",()=>E],67910)}];

//# sourceMappingURL=%5Broot-of-the-server%5D__6349d705._.js.map