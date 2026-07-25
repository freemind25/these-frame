module.exports=[93695,(e,t,r)=>{t.exports=e.x("next/dist/shared/lib/no-fallback-error.external.js",()=>require("next/dist/shared/lib/no-fallback-error.external.js"))},32319,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-unit-async-storage.external.js",()=>require("next/dist/server/app-render/work-unit-async-storage.external.js"))},24725,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/after-task-async-storage.external.js",()=>require("next/dist/server/app-render/after-task-async-storage.external.js"))},18622,(e,t,r)=>{t.exports=e.x("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js",()=>require("next/dist/compiled/next-server/app-page-turbo.runtime.prod.js"))},56704,(e,t,r)=>{t.exports=e.x("next/dist/server/app-render/work-async-storage.external.js",()=>require("next/dist/server/app-render/work-async-storage.external.js"))},70406,(e,t,r)=>{t.exports=e.x("next/dist/compiled/@opentelemetry/api",()=>require("next/dist/compiled/@opentelemetry/api"))},32139,e=>e.a(async(t,r)=>{try{let t=await e.y("z-ai-web-dev-sdk-55cc529b8c59a411");e.n(t),r()}catch(e){r(e)}},!0),14747,(e,t,r)=>{t.exports=e.x("path",()=>require("path"))},22734,(e,t,r)=>{t.exports=e.x("fs",()=>require("fs"))},46786,(e,t,r)=>{t.exports=e.x("os",()=>require("os"))},51963,e=>e.a(async(t,r)=>{try{var a=e.i(22734),n=e.i(14747),s=e.i(46786),i=e.i(32139),o=t([i]);[i]=o.then?(await o)():o;let d=null,p=!1,b=null;function l(){let e=process.env.ZAI_BASE_URL,t=process.env.ZAI_API_KEY;if(!e||!t)return null;let r={baseUrl:e,apiKey:t};return process.env.ZAI_CHAT_ID&&(r.chatId=process.env.ZAI_CHAT_ID),process.env.ZAI_USER_ID&&(r.userId=process.env.ZAI_USER_ID),process.env.ZAI_TOKEN&&(r.token=process.env.ZAI_TOKEN),r}function u(){try{for(let e of[".z-ai-config",(0,n.join)((0,s.homedir)(),".z-ai-config"),"/etc/.z-ai-config"])try{if(!(0,a.existsSync)(e))continue;let t=JSON.parse((0,a.readFileSync)(e,"utf-8"));if(t.baseUrl&&t.apiKey)return t}catch{}}catch{}return null}async function x(){if(d)return d;if(p&&b)throw Error(b);p=!0;let e=u();if(e)try{return d=new i.default(e)}catch(e){console.error("Failed to initialize ZAI from file config:",e)}let t=l();if(t)try{return d=new i.default(t)}catch(e){console.error("Failed to initialize ZAI from env config:",e)}throw b="Configuration IA non trouvée. Sur Vercel, ajoutez les variables d'environnement : ZAI_BASE_URL, ZAI_API_KEY, ZAI_CHAT_ID, ZAI_TOKEN, ZAI_USER_ID. En local, le fichier .z-ai-config est utilisé automatiquement.",Error(b)}function c(){if(l())return!0;try{if(u())return!0}catch{}return!1}e.s(["getZAI",()=>x,"isZAIConfigured",()=>c]),r()}catch(e){r(e)}},!1),65752,e=>e.a(async(t,r)=>{try{var a=e.i(89171),n=e.i(51963),s=t([n]);[n]=s.then?(await s)():s;let o=`Tu es un \xe9diteur sp\xe9cialis\xe9 qui identifie et supprime les signes d'\xe9criture g\xe9n\xe9r\xe9e par IA pour rendre le texte plus naturel et humain. Ce guide est bas\xe9 sur le travail de WikiProject AI Cleanup de Wikipedia.

## Ta t\xe2che

Quand on te donne du texte \xe0 humaniser :

1. **Identifier les patterns IA** - Scanne les patterns list\xe9s ci-dessous.
2. **R\xe9\xe9crire, pas supprimer** - Remplace les tics d'IA par des alternatives naturelles. Couvre tout ce que l'original couvre.
3. **Pr\xe9server le sens** - Garde le message principal intact.
4. **Adapter le ton** - Ajuste au ton acad\xe9mique attendu pour une th\xe8se/m\xe9moire universitaire en fran\xe7ais.

## Processus

1. **Premi\xe8re passe** : R\xe9\xe9cris le texte en \xe9liminant les patterns IA.
2. **Audit** : Relis ta r\xe9\xe9criture et identifie les r\xe9sidus de patterns IA.
3. **Passe finale** : Corrige les r\xe9sidus d\xe9tect\xe9s.
4. **R\xe9sultat** : Retourne uniquement le texte humanis\xe9, sans commentaire ni explication.

## 33 PATTERNS \xc0 D\xc9TECTER ET CORRIGER

### Patterns de contenu

1. **Gonflement de l'importance** : supprime \xab marque un moment pivot \xbb, \xab t\xe9moigne de \xbb, \xab r\xf4le crucial \xbb, \xab met en \xe9vidence son importance \xbb, \xab refl\xe8te une tendance plus large \xbb, \xab symbolisant \xbb, \xab contribuant \xe0 \xbb, \xab pr\xe9parant le terrain \xbb
2. **Mise en avant de la notori\xe9t\xe9** : \xe9viter de lister des sources sans contexte
3. **Analyses superficielles en -ant** : supprime \xab symbolisant... refl\xe9tant... mettant en valeur... \xbb
4. **Langage promotionnel** : supprime \xab nich\xe9 au cœur de \xbb, \xab \xe0 couper le souffle \xbb, \xab renomm\xe9 pour \xbb, \xab incontournable \xbb
5. **Attributions vagues** : \xab Des experts estiment que \xbb → citer des sources sp\xe9cifiques
6. **Sections d\xe9fis et perspectives formula\xefques** : \xab Malgr\xe9 ces d\xe9fis, X continue de prosp\xe9rer \xbb → donner des faits sp\xe9cifiques

### Patterns de langage

7. **Vocabulaire IA sur-repr\xe9sent\xe9** : supprime \xab en effet \xbb, \xab il convient de noter \xbb, \xab crucial \xbb, \xab approfondir \xbb, \xab mettre en exergue \xbb, \xab favoriser \xbb, \xab paysage \xbb, \xab pivot \xbb, \xab t\xe9moignage \xbb, \xab souligner \xbb, \xab dynamique \xbb, \xab t\xe9lescope \xbb (m\xe9taphore), \xab riche \xbb (figur\xe9), \xab vibrant \xbb
8. **\xc9vitement du verbe \xeatre** : \xab sert de \xbb → \xab est \xbb ; \xab se caract\xe9rise par \xbb → \xab a \xbb
9. **Parall\xe9lismes n\xe9gatifs** : \xab Ce n'est pas seulement X, c'est Y \xbb → dire directement
10. **R\xe8gle de trois** : \xe9viter les triplets syst\xe9matiques d'adjectifs ou d'items
11. **Cyclage de synonymes** : ne pas alterner \xab protagoniste/acteur/personnage \xbb — garder le m\xeame terme
12. **Fausses \xe9tendues** : \xab du Big Bang \xe0 la mati\xe8re noire \xbb → lister directement
13. **Voix passive excessive** : nommer l'agent quand cela aide la clart\xe9

### Patterns de style

14. **Tirets (em/en) excessifs** : couper en faveur de points, virgules, parenth\xe8ses
15. **Gras abusif** : \xe9viter le texte en **gras** excessif dans le corps
16. **Listes en-t\xeates en ligne** : convertir en prose
17. **Titres en majuscules** : utiliser la casse normale pour les titres de sections
18. **\xc9mojis** : supprimer tous les \xe9mojis
19. **Guillemets curlys** : utiliser les guillemets fran\xe7ais standard \xab \xbb
20. **Art\xe9facts de chatbot** : supprime \xab J'esp\xe8re que cela aide ! \xbb, \xab N'h\xe9sitez pas \xe0 me poser des questions \xbb
21. **Avertissements de coupure** : \xab Bien que les d\xe9tails soient limit\xe9s... \xbb → trouver des sources ou supprimer
22. **Ton sycophantique** : \xab Excellente question ! \xbb → r\xe9pondre directement
23. **Phrases de remplissage** : \xab Afin de \xbb → \xab Pour \xbb ; \xab En raison du fait que \xbb → \xab Parce que \xbb ; \xab Dans le cadre de \xbb → \xab Dans \xbb
24. **H\xe9sitation excessive** : \xab pourrait potentiellement peut-\xeatre \xbb → \xab peut \xbb
25. **Conclusions g\xe9n\xe9riques** : \xab L'avenir s'annonce prometteur \xbb → donner des plans ou faits sp\xe9cifiques
26. **Paires de mots hyphen\xe9s abusifs** : \xab interdisciplinaire, ax\xe9 sur les donn\xe9es, orient\xe9 client \xbb → r\xe9duire les tirets
27. **Tropes d'autorit\xe9 persuasifs** : \xab Au fond, ce qui compte est... \xbb → dire directement
28. **Annonces de plan** : \xab Passons en revue \xbb, \xab Voici ce qu'il faut savoir \xbb → commencer par le contenu
29. **En-t\xeates fragment\xe9s** : un en-t\xeate suivi d'une seule phrase \xe9vidente → fusionner
30. **\xc9criture ancr\xe9e sur les diff\xe9rences** : \xab Cette fonction a \xe9t\xe9 ajout\xe9e pour remplacer... \xbb → d\xe9crire ce que \xe7a fait
31. **Effets dramatiques staccato** : \xab Il n'avait aucune pr\xe9f\xe9rence. Aucun pass\xe9. Aucune nostalgie. \xbb → varier les longueurs
32. **Formules d'aphorismes** : \xab La sym\xe9trie est le langage de la confiance \xbb → remplacer par l'affirmation r\xe9elle
33. **Ouverture rh\xe9torique conversationnelle** : \xab Honn\xeatement ? Cela d\xe9pend... \xbb → supprimer le setup faux-candid

## R\xc8GLES SP\xc9CIFIQUES AU CONTEXTE ACAD\xc9MIQUE

- Garder le registre acad\xe9mique (pas trop familier)
- Conserver les termes techniques du domaine
- Pr\xe9server les r\xe9f\xe9rences bibliographiques et citations
- Maintenir la structure logique (IMRaD, etc.)
- Ne pas injecter d'opinions personnelles dans un texte encyclop\xe9dique
- Varier les longueurs de phrases naturellement
- Pr\xe9f\xe9rer la voix active quand c'est clair
- \xc9viter les adverbes redondants

IMPORTANT : Retourne UNIQUEMENT le texte humanis\xe9. Pas de pr\xe9ambule, pas d'explication, pas de commentaire sur les changements effectu\xe9s. Juste le texte.`;async function i(e){try{let{text:t,voiceSample:r}=await e.json();if(!t||"string"!=typeof t||0===t.trim().length)return a.NextResponse.json({error:"Le texte est requis."},{status:400});if(t.length>15e3)return a.NextResponse.json({error:"Le texte ne doit pas dépasser 15 000 caractères."},{status:400});let s=await (0,n.getZAI)(),i=o;r&&r.trim().length>50&&(i+=`

## CALIBRAGE DE VOIX

L'utilisateur a fourni un \xe9chantillon de son \xe9criture. Analyse-le d'abord :
- Longueurs de phrases
- Choix de mots (acad\xe9mique ? direct ?)
- Fa\xe7on de commencer les paragraphes
- Habitudes de ponctuation
- Phrases r\xe9currentes

Adapter la r\xe9\xe9criture pour correspondre \xe0 CE style d'\xe9criture, pas \xe0 un style g\xe9n\xe9rique.

### \xc9chantillon de l'utilisateur :
${r.trim()}`);let l=await s.chat.completions.create({messages:[{role:"assistant",content:i},{role:"user",content:t.trim()}],thinking:{type:"disabled"}}),u=l.choices[0]?.message?.content||t;return a.NextResponse.json({success:!0,humanized:u})}catch(e){return console.error("Humanizer error:",e),a.NextResponse.json({error:e instanceof Error?e.message:"Erreur interne."},{status:500})}}e.s(["POST",()=>i]),r()}catch(e){r(e)}},!1),24722,e=>e.a(async(t,r)=>{try{var a=e.i(47909),n=e.i(74017),s=e.i(96250),i=e.i(59756),o=e.i(61916),l=e.i(74677),u=e.i(69741),x=e.i(16795),c=e.i(87718),d=e.i(95169),p=e.i(47587),b=e.i(66012),m=e.i(70101),f=e.i(26937),h=e.i(10372),g=e.i(93695);e.i(52474);var v=e.i(220),A=e.i(65752),R=t([A]);[A]=R.then?(await R)():R;let I=new a.AppRouteRouteModule({definition:{kind:n.RouteKind.APP_ROUTE,page:"/api/humanizer/route",pathname:"/api/humanizer",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/src/app/api/humanizer/route.ts",nextConfigOutput:"standalone",userland:A}),{workAsyncStorage:q,workUnitAsyncStorage:C,serverHooks:w}=I;function E(){return(0,s.patchFetch)({workAsyncStorage:q,workUnitAsyncStorage:C})}async function y(e,t,r){I.isDev&&(0,i.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let a="/api/humanizer/route";a=a.replace(/\/index$/,"")||"/";let s=await I.prepare(e,t,{srcPage:a,multiZoneDraftMode:!1});if(!s)return t.statusCode=400,t.end("Bad Request"),null==r.waitUntil||r.waitUntil.call(r,Promise.resolve()),null;let{buildId:A,params:R,nextConfig:E,parsedUrl:y,isDraftMode:q,prerenderManifest:C,routerServerContext:w,isOnDemandRevalidate:P,revalidateOnlyGenerated:T,resolvedPathname:_,clientReferenceManifest:N,serverActionsManifest:S}=s,j=(0,u.normalizeAppPath)(a),O=!!(C.dynamicRoutes[j]||C.routes[_]),U=async()=>((null==w?void 0:w.render404)?await w.render404(e,t,y,!1):t.end("This page could not be found"),null);if(O&&!q){let e=!!C.routes[_],t=C.dynamicRoutes[j];if(t&&!1===t.fallback&&!e){if(E.experimental.adapterPath)return await U();throw new g.NoFallbackError}}let k=null;!O||I.isDev||q||(k=_,k="/index"===k?"/":k);let D=!0===I.isDev||!O,H=O&&!D;S&&N&&(0,l.setManifestsSingleton)({page:a,clientReferenceManifest:N,serverActionsManifest:S});let M=e.method||"GET",Z=(0,o.getTracer)(),L=Z.getActiveScopeSpan(),z={params:R,prerenderManifest:C,renderOpts:{experimental:{authInterrupts:!!E.experimental.authInterrupts},cacheComponents:!!E.cacheComponents,supportsDynamicResponse:D,incrementalCache:(0,i.getRequestMeta)(e,"incrementalCache"),cacheLifeProfiles:E.cacheLife,waitUntil:r.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,r,a,n)=>I.onRequestError(e,t,a,n,w)},sharedContext:{buildId:A}},F=new x.NodeNextRequest(e),K=new x.NodeNextResponse(t),B=c.NextRequestAdapter.fromNodeNextRequest(F,(0,c.signalFromNodeResponse)(t));try{let s=async e=>I.handle(B,z).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let r=Z.getRootSpanAttributes();if(!r)return;if(r.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${r.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=r.get("next.route");if(n){let t=`${M} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t)}else e.updateName(`${M} ${a}`)}),l=!!(0,i.getRequestMeta)(e,"minimalMode"),u=async i=>{var o,u;let x=async({previousCacheEntry:n})=>{try{if(!l&&P&&T&&!n)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let a=await s(i);e.fetchMetrics=z.renderOpts.fetchMetrics;let o=z.renderOpts.pendingWaitUntil;o&&r.waitUntil&&(r.waitUntil(o),o=void 0);let u=z.renderOpts.collectedTags;if(!O)return await (0,b.sendResponse)(F,K,a,z.renderOpts.pendingWaitUntil),null;{let e=await a.blob(),t=(0,m.toNodeOutgoingHttpHeaders)(a.headers);u&&(t[h.NEXT_CACHE_TAGS_HEADER]=u),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let r=void 0!==z.renderOpts.collectedRevalidate&&!(z.renderOpts.collectedRevalidate>=h.INFINITE_CACHE)&&z.renderOpts.collectedRevalidate,n=void 0===z.renderOpts.collectedExpire||z.renderOpts.collectedExpire>=h.INFINITE_CACHE?void 0:z.renderOpts.collectedExpire;return{value:{kind:v.CachedRouteKind.APP_ROUTE,status:a.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:r,expire:n}}}}catch(t){throw(null==n?void 0:n.isStale)&&await I.onRequestError(e,t,{routerKind:"App Router",routePath:a,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:P})},!1,w),t}},c=await I.handleResponse({req:e,nextConfig:E,cacheKey:k,routeKind:n.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:C,isRoutePPREnabled:!1,isOnDemandRevalidate:P,revalidateOnlyGenerated:T,responseGenerator:x,waitUntil:r.waitUntil,isMinimalMode:l});if(!O)return null;if((null==c||null==(o=c.value)?void 0:o.kind)!==v.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(u=c.value)?void 0:u.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});l||t.setHeader("x-nextjs-cache",P?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),q&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,m.fromNodeOutgoingHttpHeaders)(c.value.headers);return l&&O||d.delete(h.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,f.getCacheControlHeader)(c.cacheControl)),await (0,b.sendResponse)(F,K,new Response(c.value.body,{headers:d,status:c.value.status||200})),null};L?await u(L):await Z.withPropagatedContext(e.headers,()=>Z.trace(d.BaseServerSpan.handleRequest,{spanName:`${M} ${a}`,kind:o.SpanKind.SERVER,attributes:{"http.method":M,"http.target":e.url}},u))}catch(t){if(t instanceof g.NoFallbackError||await I.onRequestError(e,t,{routerKind:"App Router",routePath:j,routeType:"route",revalidateReason:(0,p.getRevalidateReason)({isStaticGeneration:H,isOnDemandRevalidate:P})},!1,w),O)throw t;return await (0,b.sendResponse)(F,K,new Response(null,{status:500})),null}}e.s(["handler",()=>y,"patchFetch",()=>E,"routeModule",()=>I,"serverHooks",()=>w,"workAsyncStorage",()=>q,"workUnitAsyncStorage",()=>C]),r()}catch(e){r(e)}},!1)];

//# sourceMappingURL=%5Broot-of-the-server%5D__2f5cf4d0._.js.map