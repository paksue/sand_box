(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))s(l);new MutationObserver(l=>{for(const c of l)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&s(d)}).observe(document,{childList:!0,subtree:!0});function i(l){const c={};return l.integrity&&(c.integrity=l.integrity),l.referrerPolicy&&(c.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?c.credentials="include":l.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function s(l){if(l.ep)return;l.ep=!0;const c=i(l);fetch(l.href,c)}})();function jS(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}var xd={exports:{}},Ho={};var jg;function ZS(){if(jg)return Ho;jg=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.fragment");function i(s,l,c){var d=null;if(c!==void 0&&(d=""+c),l.key!==void 0&&(d=""+l.key),"key"in l){c={};for(var p in l)p!=="key"&&(c[p]=l[p])}else c=l;return l=c.ref,{$$typeof:r,type:s,key:d,ref:l!==void 0?l:null,props:c}}return Ho.Fragment=e,Ho.jsx=i,Ho.jsxs=i,Ho}var Zg;function KS(){return Zg||(Zg=1,xd.exports=ZS()),xd.exports}var L=KS(),Sd={exports:{}},at={};var Kg;function QS(){if(Kg)return at;Kg=1;var r=Symbol.for("react.transitional.element"),e=Symbol.for("react.portal"),i=Symbol.for("react.fragment"),s=Symbol.for("react.strict_mode"),l=Symbol.for("react.profiler"),c=Symbol.for("react.consumer"),d=Symbol.for("react.context"),p=Symbol.for("react.forward_ref"),m=Symbol.for("react.suspense"),h=Symbol.for("react.memo"),x=Symbol.for("react.lazy"),S=Symbol.for("react.activity"),g=Symbol.iterator;function E(C){return C===null||typeof C!="object"?null:(C=g&&C[g]||C["@@iterator"],typeof C=="function"?C:null)}var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},D=Object.assign,y={};function _(C,Y,ee){this.props=C,this.context=Y,this.refs=y,this.updater=ee||A}_.prototype.isReactComponent={},_.prototype.setState=function(C,Y){if(typeof C!="object"&&typeof C!="function"&&C!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,C,Y,"setState")},_.prototype.forceUpdate=function(C){this.updater.enqueueForceUpdate(this,C,"forceUpdate")};function I(){}I.prototype=_.prototype;function O(C,Y,ee){this.props=C,this.context=Y,this.refs=y,this.updater=ee||A}var w=O.prototype=new I;w.constructor=O,D(w,_.prototype),w.isPureReactComponent=!0;var U=Array.isArray;function P(){}var F={H:null,A:null,T:null,S:null},T=Object.prototype.hasOwnProperty;function z(C,Y,ee){var ye=ee.ref;return{$$typeof:r,type:C,key:Y,ref:ye!==void 0?ye:null,props:ee}}function X(C,Y){return z(C.type,Y,C.props)}function K(C){return typeof C=="object"&&C!==null&&C.$$typeof===r}function j(C){var Y={"=":"=0",":":"=2"};return"$"+C.replace(/[=:]/g,function(ee){return Y[ee]})}var oe=/\/+/g;function Z(C,Y){return typeof C=="object"&&C!==null&&C.key!=null?j(""+C.key):Y.toString(36)}function ne(C){switch(C.status){case"fulfilled":return C.value;case"rejected":throw C.reason;default:switch(typeof C.status=="string"?C.then(P,P):(C.status="pending",C.then(function(Y){C.status==="pending"&&(C.status="fulfilled",C.value=Y)},function(Y){C.status==="pending"&&(C.status="rejected",C.reason=Y)})),C.status){case"fulfilled":return C.value;case"rejected":throw C.reason}}throw C}function N(C,Y,ee,ye,De){var Fe=typeof C;(Fe==="undefined"||Fe==="boolean")&&(C=null);var re=!1;if(C===null)re=!0;else switch(Fe){case"bigint":case"string":case"number":re=!0;break;case"object":switch(C.$$typeof){case r:case e:re=!0;break;case x:return re=C._init,N(re(C._payload),Y,ee,ye,De)}}if(re)return De=De(C),re=ye===""?"."+Z(C,0):ye,U(De)?(ee="",re!=null&&(ee=re.replace(oe,"$&/")+"/"),N(De,Y,ee,"",function($e){return $e})):De!=null&&(K(De)&&(De=X(De,ee+(De.key==null||C&&C.key===De.key?"":(""+De.key).replace(oe,"$&/")+"/")+re)),Y.push(De)),1;re=0;var me=ye===""?".":ye+":";if(U(C))for(var be=0;be<C.length;be++)ye=C[be],Fe=me+Z(ye,be),re+=N(ye,Y,ee,Fe,De);else if(be=E(C),typeof be=="function")for(C=be.call(C),be=0;!(ye=C.next()).done;)ye=ye.value,Fe=me+Z(ye,be++),re+=N(ye,Y,ee,Fe,De);else if(Fe==="object"){if(typeof C.then=="function")return N(ne(C),Y,ee,ye,De);throw Y=String(C),Error("Objects are not valid as a React child (found: "+(Y==="[object Object]"?"object with keys {"+Object.keys(C).join(", ")+"}":Y)+"). If you meant to render a collection of children, use an array instead.")}return re}function V(C,Y,ee){if(C==null)return C;var ye=[],De=0;return N(C,ye,"","",function(Fe){return Y.call(ee,Fe,De++)}),ye}function fe(C){if(C._status===-1){var Y=C._result;Y=Y(),Y.then(function(ee){(C._status===0||C._status===-1)&&(C._status=1,C._result=ee)},function(ee){(C._status===0||C._status===-1)&&(C._status=2,C._result=ee)}),C._status===-1&&(C._status=0,C._result=Y)}if(C._status===1)return C._result.default;throw C._result}var se=typeof reportError=="function"?reportError:function(C){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var Y=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof C=="object"&&C!==null&&typeof C.message=="string"?String(C.message):String(C),error:C});if(!window.dispatchEvent(Y))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",C);return}console.error(C)},H={map:V,forEach:function(C,Y,ee){V(C,function(){Y.apply(this,arguments)},ee)},count:function(C){var Y=0;return V(C,function(){Y++}),Y},toArray:function(C){return V(C,function(Y){return Y})||[]},only:function(C){if(!K(C))throw Error("React.Children.only expected to receive a single React element child.");return C}};return at.Activity=S,at.Children=H,at.Component=_,at.Fragment=i,at.Profiler=l,at.PureComponent=O,at.StrictMode=s,at.Suspense=m,at.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=F,at.__COMPILER_RUNTIME={__proto__:null,c:function(C){return F.H.useMemoCache(C)}},at.cache=function(C){return function(){return C.apply(null,arguments)}},at.cacheSignal=function(){return null},at.cloneElement=function(C,Y,ee){if(C==null)throw Error("The argument must be a React element, but you passed "+C+".");var ye=D({},C.props),De=C.key;if(Y!=null)for(Fe in Y.key!==void 0&&(De=""+Y.key),Y)!T.call(Y,Fe)||Fe==="key"||Fe==="__self"||Fe==="__source"||Fe==="ref"&&Y.ref===void 0||(ye[Fe]=Y[Fe]);var Fe=arguments.length-2;if(Fe===1)ye.children=ee;else if(1<Fe){for(var re=Array(Fe),me=0;me<Fe;me++)re[me]=arguments[me+2];ye.children=re}return z(C.type,De,ye)},at.createContext=function(C){return C={$$typeof:d,_currentValue:C,_currentValue2:C,_threadCount:0,Provider:null,Consumer:null},C.Provider=C,C.Consumer={$$typeof:c,_context:C},C},at.createElement=function(C,Y,ee){var ye,De={},Fe=null;if(Y!=null)for(ye in Y.key!==void 0&&(Fe=""+Y.key),Y)T.call(Y,ye)&&ye!=="key"&&ye!=="__self"&&ye!=="__source"&&(De[ye]=Y[ye]);var re=arguments.length-2;if(re===1)De.children=ee;else if(1<re){for(var me=Array(re),be=0;be<re;be++)me[be]=arguments[be+2];De.children=me}if(C&&C.defaultProps)for(ye in re=C.defaultProps,re)De[ye]===void 0&&(De[ye]=re[ye]);return z(C,Fe,De)},at.createRef=function(){return{current:null}},at.forwardRef=function(C){return{$$typeof:p,render:C}},at.isValidElement=K,at.lazy=function(C){return{$$typeof:x,_payload:{_status:-1,_result:C},_init:fe}},at.memo=function(C,Y){return{$$typeof:h,type:C,compare:Y===void 0?null:Y}},at.startTransition=function(C){var Y=F.T,ee={};F.T=ee;try{var ye=C(),De=F.S;De!==null&&De(ee,ye),typeof ye=="object"&&ye!==null&&typeof ye.then=="function"&&ye.then(P,se)}catch(Fe){se(Fe)}finally{Y!==null&&ee.types!==null&&(Y.types=ee.types),F.T=Y}},at.unstable_useCacheRefresh=function(){return F.H.useCacheRefresh()},at.use=function(C){return F.H.use(C)},at.useActionState=function(C,Y,ee){return F.H.useActionState(C,Y,ee)},at.useCallback=function(C,Y){return F.H.useCallback(C,Y)},at.useContext=function(C){return F.H.useContext(C)},at.useDebugValue=function(){},at.useDeferredValue=function(C,Y){return F.H.useDeferredValue(C,Y)},at.useEffect=function(C,Y){return F.H.useEffect(C,Y)},at.useEffectEvent=function(C){return F.H.useEffectEvent(C)},at.useId=function(){return F.H.useId()},at.useImperativeHandle=function(C,Y,ee){return F.H.useImperativeHandle(C,Y,ee)},at.useInsertionEffect=function(C,Y){return F.H.useInsertionEffect(C,Y)},at.useLayoutEffect=function(C,Y){return F.H.useLayoutEffect(C,Y)},at.useMemo=function(C,Y){return F.H.useMemo(C,Y)},at.useOptimistic=function(C,Y){return F.H.useOptimistic(C,Y)},at.useReducer=function(C,Y,ee){return F.H.useReducer(C,Y,ee)},at.useRef=function(C){return F.H.useRef(C)},at.useState=function(C){return F.H.useState(C)},at.useSyncExternalStore=function(C,Y,ee){return F.H.useSyncExternalStore(C,Y,ee)},at.useTransition=function(){return F.H.useTransition()},at.version="19.2.0",at}var Qg;function Zh(){return Qg||(Qg=1,Sd.exports=QS()),Sd.exports}var Nn=Zh();const JS=jS(Nn);var Md={exports:{}},Go={},yd={exports:{}},Ed={};var Jg;function $S(){return Jg||(Jg=1,(function(r){function e(N,V){var fe=N.length;N.push(V);e:for(;0<fe;){var se=fe-1>>>1,H=N[se];if(0<l(H,V))N[se]=V,N[fe]=H,fe=se;else break e}}function i(N){return N.length===0?null:N[0]}function s(N){if(N.length===0)return null;var V=N[0],fe=N.pop();if(fe!==V){N[0]=fe;e:for(var se=0,H=N.length,C=H>>>1;se<C;){var Y=2*(se+1)-1,ee=N[Y],ye=Y+1,De=N[ye];if(0>l(ee,fe))ye<H&&0>l(De,ee)?(N[se]=De,N[ye]=fe,se=ye):(N[se]=ee,N[Y]=fe,se=Y);else if(ye<H&&0>l(De,fe))N[se]=De,N[ye]=fe,se=ye;else break e}}return V}function l(N,V){var fe=N.sortIndex-V.sortIndex;return fe!==0?fe:N.id-V.id}if(r.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var c=performance;r.unstable_now=function(){return c.now()}}else{var d=Date,p=d.now();r.unstable_now=function(){return d.now()-p}}var m=[],h=[],x=1,S=null,g=3,E=!1,A=!1,D=!1,y=!1,_=typeof setTimeout=="function"?setTimeout:null,I=typeof clearTimeout=="function"?clearTimeout:null,O=typeof setImmediate<"u"?setImmediate:null;function w(N){for(var V=i(h);V!==null;){if(V.callback===null)s(h);else if(V.startTime<=N)s(h),V.sortIndex=V.expirationTime,e(m,V);else break;V=i(h)}}function U(N){if(D=!1,w(N),!A)if(i(m)!==null)A=!0,P||(P=!0,j());else{var V=i(h);V!==null&&ne(U,V.startTime-N)}}var P=!1,F=-1,T=5,z=-1;function X(){return y?!0:!(r.unstable_now()-z<T)}function K(){if(y=!1,P){var N=r.unstable_now();z=N;var V=!0;try{e:{A=!1,D&&(D=!1,I(F),F=-1),E=!0;var fe=g;try{t:{for(w(N),S=i(m);S!==null&&!(S.expirationTime>N&&X());){var se=S.callback;if(typeof se=="function"){S.callback=null,g=S.priorityLevel;var H=se(S.expirationTime<=N);if(N=r.unstable_now(),typeof H=="function"){S.callback=H,w(N),V=!0;break t}S===i(m)&&s(m),w(N)}else s(m);S=i(m)}if(S!==null)V=!0;else{var C=i(h);C!==null&&ne(U,C.startTime-N),V=!1}}break e}finally{S=null,g=fe,E=!1}V=void 0}}finally{V?j():P=!1}}}var j;if(typeof O=="function")j=function(){O(K)};else if(typeof MessageChannel<"u"){var oe=new MessageChannel,Z=oe.port2;oe.port1.onmessage=K,j=function(){Z.postMessage(null)}}else j=function(){_(K,0)};function ne(N,V){F=_(function(){N(r.unstable_now())},V)}r.unstable_IdlePriority=5,r.unstable_ImmediatePriority=1,r.unstable_LowPriority=4,r.unstable_NormalPriority=3,r.unstable_Profiling=null,r.unstable_UserBlockingPriority=2,r.unstable_cancelCallback=function(N){N.callback=null},r.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):T=0<N?Math.floor(1e3/N):5},r.unstable_getCurrentPriorityLevel=function(){return g},r.unstable_next=function(N){switch(g){case 1:case 2:case 3:var V=3;break;default:V=g}var fe=g;g=V;try{return N()}finally{g=fe}},r.unstable_requestPaint=function(){y=!0},r.unstable_runWithPriority=function(N,V){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var fe=g;g=N;try{return V()}finally{g=fe}},r.unstable_scheduleCallback=function(N,V,fe){var se=r.unstable_now();switch(typeof fe=="object"&&fe!==null?(fe=fe.delay,fe=typeof fe=="number"&&0<fe?se+fe:se):fe=se,N){case 1:var H=-1;break;case 2:H=250;break;case 5:H=1073741823;break;case 4:H=1e4;break;default:H=5e3}return H=fe+H,N={id:x++,callback:V,priorityLevel:N,startTime:fe,expirationTime:H,sortIndex:-1},fe>se?(N.sortIndex=fe,e(h,N),i(m)===null&&N===i(h)&&(D?(I(F),F=-1):D=!0,ne(U,fe-se))):(N.sortIndex=H,e(m,N),A||E||(A=!0,P||(P=!0,j()))),N},r.unstable_shouldYield=X,r.unstable_wrapCallback=function(N){var V=g;return function(){var fe=g;g=V;try{return N.apply(this,arguments)}finally{g=fe}}}})(Ed)),Ed}var $g;function eM(){return $g||($g=1,yd.exports=$S()),yd.exports}var Td={exports:{}},Ln={};var e_;function tM(){if(e_)return Ln;e_=1;var r=Zh();function e(m){var h="https://react.dev/errors/"+m;if(1<arguments.length){h+="?args[]="+encodeURIComponent(arguments[1]);for(var x=2;x<arguments.length;x++)h+="&args[]="+encodeURIComponent(arguments[x])}return"Minified React error #"+m+"; visit "+h+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function i(){}var s={d:{f:i,r:function(){throw Error(e(522))},D:i,C:i,L:i,m:i,X:i,S:i,M:i},p:0,findDOMNode:null},l=Symbol.for("react.portal");function c(m,h,x){var S=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:l,key:S==null?null:""+S,children:m,containerInfo:h,implementation:x}}var d=r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function p(m,h){if(m==="font")return"";if(typeof h=="string")return h==="use-credentials"?h:""}return Ln.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=s,Ln.createPortal=function(m,h){var x=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!h||h.nodeType!==1&&h.nodeType!==9&&h.nodeType!==11)throw Error(e(299));return c(m,h,null,x)},Ln.flushSync=function(m){var h=d.T,x=s.p;try{if(d.T=null,s.p=2,m)return m()}finally{d.T=h,s.p=x,s.d.f()}},Ln.preconnect=function(m,h){typeof m=="string"&&(h?(h=h.crossOrigin,h=typeof h=="string"?h==="use-credentials"?h:"":void 0):h=null,s.d.C(m,h))},Ln.prefetchDNS=function(m){typeof m=="string"&&s.d.D(m)},Ln.preinit=function(m,h){if(typeof m=="string"&&h&&typeof h.as=="string"){var x=h.as,S=p(x,h.crossOrigin),g=typeof h.integrity=="string"?h.integrity:void 0,E=typeof h.fetchPriority=="string"?h.fetchPriority:void 0;x==="style"?s.d.S(m,typeof h.precedence=="string"?h.precedence:void 0,{crossOrigin:S,integrity:g,fetchPriority:E}):x==="script"&&s.d.X(m,{crossOrigin:S,integrity:g,fetchPriority:E,nonce:typeof h.nonce=="string"?h.nonce:void 0})}},Ln.preinitModule=function(m,h){if(typeof m=="string")if(typeof h=="object"&&h!==null){if(h.as==null||h.as==="script"){var x=p(h.as,h.crossOrigin);s.d.M(m,{crossOrigin:x,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0})}}else h==null&&s.d.M(m)},Ln.preload=function(m,h){if(typeof m=="string"&&typeof h=="object"&&h!==null&&typeof h.as=="string"){var x=h.as,S=p(x,h.crossOrigin);s.d.L(m,x,{crossOrigin:S,integrity:typeof h.integrity=="string"?h.integrity:void 0,nonce:typeof h.nonce=="string"?h.nonce:void 0,type:typeof h.type=="string"?h.type:void 0,fetchPriority:typeof h.fetchPriority=="string"?h.fetchPriority:void 0,referrerPolicy:typeof h.referrerPolicy=="string"?h.referrerPolicy:void 0,imageSrcSet:typeof h.imageSrcSet=="string"?h.imageSrcSet:void 0,imageSizes:typeof h.imageSizes=="string"?h.imageSizes:void 0,media:typeof h.media=="string"?h.media:void 0})}},Ln.preloadModule=function(m,h){if(typeof m=="string")if(h){var x=p(h.as,h.crossOrigin);s.d.m(m,{as:typeof h.as=="string"&&h.as!=="script"?h.as:void 0,crossOrigin:x,integrity:typeof h.integrity=="string"?h.integrity:void 0})}else s.d.m(m)},Ln.requestFormReset=function(m){s.d.r(m)},Ln.unstable_batchedUpdates=function(m,h){return m(h)},Ln.useFormState=function(m,h,x){return d.H.useFormState(m,h,x)},Ln.useFormStatus=function(){return d.H.useHostTransitionStatus()},Ln.version="19.2.0",Ln}var t_;function nM(){if(t_)return Td.exports;t_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Td.exports=tM(),Td.exports}var n_;function iM(){if(n_)return Go;n_=1;var r=eM(),e=Zh(),i=nM();function s(t){var n="https://react.dev/errors/"+t;if(1<arguments.length){n+="?args[]="+encodeURIComponent(arguments[1]);for(var a=2;a<arguments.length;a++)n+="&args[]="+encodeURIComponent(arguments[a])}return"Minified React error #"+t+"; visit "+n+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function l(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function c(t){var n=t,a=t;if(t.alternate)for(;n.return;)n=n.return;else{t=n;do n=t,(n.flags&4098)!==0&&(a=n.return),t=n.return;while(t)}return n.tag===3?a:null}function d(t){if(t.tag===13){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function p(t){if(t.tag===31){var n=t.memoizedState;if(n===null&&(t=t.alternate,t!==null&&(n=t.memoizedState)),n!==null)return n.dehydrated}return null}function m(t){if(c(t)!==t)throw Error(s(188))}function h(t){var n=t.alternate;if(!n){if(n=c(t),n===null)throw Error(s(188));return n!==t?null:t}for(var a=t,o=n;;){var u=a.return;if(u===null)break;var f=u.alternate;if(f===null){if(o=u.return,o!==null){a=o;continue}break}if(u.child===f.child){for(f=u.child;f;){if(f===a)return m(u),t;if(f===o)return m(u),n;f=f.sibling}throw Error(s(188))}if(a.return!==o.return)a=u,o=f;else{for(var v=!1,R=u.child;R;){if(R===a){v=!0,a=u,o=f;break}if(R===o){v=!0,o=u,a=f;break}R=R.sibling}if(!v){for(R=f.child;R;){if(R===a){v=!0,a=f,o=u;break}if(R===o){v=!0,o=f,a=u;break}R=R.sibling}if(!v)throw Error(s(189))}}if(a.alternate!==o)throw Error(s(190))}if(a.tag!==3)throw Error(s(188));return a.stateNode.current===a?t:n}function x(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t;for(t=t.child;t!==null;){if(n=x(t),n!==null)return n;t=t.sibling}return null}var S=Object.assign,g=Symbol.for("react.element"),E=Symbol.for("react.transitional.element"),A=Symbol.for("react.portal"),D=Symbol.for("react.fragment"),y=Symbol.for("react.strict_mode"),_=Symbol.for("react.profiler"),I=Symbol.for("react.consumer"),O=Symbol.for("react.context"),w=Symbol.for("react.forward_ref"),U=Symbol.for("react.suspense"),P=Symbol.for("react.suspense_list"),F=Symbol.for("react.memo"),T=Symbol.for("react.lazy"),z=Symbol.for("react.activity"),X=Symbol.for("react.memo_cache_sentinel"),K=Symbol.iterator;function j(t){return t===null||typeof t!="object"?null:(t=K&&t[K]||t["@@iterator"],typeof t=="function"?t:null)}var oe=Symbol.for("react.client.reference");function Z(t){if(t==null)return null;if(typeof t=="function")return t.$$typeof===oe?null:t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case D:return"Fragment";case _:return"Profiler";case y:return"StrictMode";case U:return"Suspense";case P:return"SuspenseList";case z:return"Activity"}if(typeof t=="object")switch(t.$$typeof){case A:return"Portal";case O:return t.displayName||"Context";case I:return(t._context.displayName||"Context")+".Consumer";case w:var n=t.render;return t=t.displayName,t||(t=n.displayName||n.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case F:return n=t.displayName||null,n!==null?n:Z(t.type)||"Memo";case T:n=t._payload,t=t._init;try{return Z(t(n))}catch{}}return null}var ne=Array.isArray,N=e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,V=i.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,fe={pending:!1,data:null,method:null,action:null},se=[],H=-1;function C(t){return{current:t}}function Y(t){0>H||(t.current=se[H],se[H]=null,H--)}function ee(t,n){H++,se[H]=t.current,t.current=n}var ye=C(null),De=C(null),Fe=C(null),re=C(null);function me(t,n){switch(ee(Fe,n),ee(De,t),ee(ye,null),n.nodeType){case 9:case 11:t=(t=n.documentElement)&&(t=t.namespaceURI)?_g(t):0;break;default:if(t=n.tagName,n=n.namespaceURI)n=_g(n),t=vg(n,t);else switch(t){case"svg":t=1;break;case"math":t=2;break;default:t=0}}Y(ye),ee(ye,t)}function be(){Y(ye),Y(De),Y(Fe)}function $e(t){t.memoizedState!==null&&ee(re,t);var n=ye.current,a=vg(n,t.type);n!==a&&(ee(De,t),ee(ye,a))}function Oe(t){De.current===t&&(Y(ye),Y(De)),re.current===t&&(Y(re),Io._currentValue=fe)}var ot,en;function it(t){if(ot===void 0)try{throw Error()}catch(a){var n=a.stack.trim().match(/\n( *(at )?)/);ot=n&&n[1]||"",en=-1<a.stack.indexOf(`
    at`)?" (<anonymous>)":-1<a.stack.indexOf("@")?"@unknown:0:0":""}return`
`+ot+t+en}var vt=!1;function Lt(t,n){if(!t||vt)return"";vt=!0;var a=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var o={DetermineComponentFrameRoot:function(){try{if(n){var Ee=function(){throw Error()};if(Object.defineProperty(Ee.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Ee,[])}catch(pe){var de=pe}Reflect.construct(t,[],Ee)}else{try{Ee.call()}catch(pe){de=pe}t.call(Ee.prototype)}}else{try{throw Error()}catch(pe){de=pe}(Ee=t())&&typeof Ee.catch=="function"&&Ee.catch(function(){})}}catch(pe){if(pe&&de&&typeof pe.stack=="string")return[pe.stack,de.stack]}return[null,null]}};o.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var u=Object.getOwnPropertyDescriptor(o.DetermineComponentFrameRoot,"name");u&&u.configurable&&Object.defineProperty(o.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var f=o.DetermineComponentFrameRoot(),v=f[0],R=f[1];if(v&&R){var G=v.split(`
`),ce=R.split(`
`);for(u=o=0;o<G.length&&!G[o].includes("DetermineComponentFrameRoot");)o++;for(;u<ce.length&&!ce[u].includes("DetermineComponentFrameRoot");)u++;if(o===G.length||u===ce.length)for(o=G.length-1,u=ce.length-1;1<=o&&0<=u&&G[o]!==ce[u];)u--;for(;1<=o&&0<=u;o--,u--)if(G[o]!==ce[u]){if(o!==1||u!==1)do if(o--,u--,0>u||G[o]!==ce[u]){var xe=`
`+G[o].replace(" at new "," at ");return t.displayName&&xe.includes("<anonymous>")&&(xe=xe.replace("<anonymous>",t.displayName)),xe}while(1<=o&&0<=u);break}}}finally{vt=!1,Error.prepareStackTrace=a}return(a=t?t.displayName||t.name:"")?it(a):""}function pt(t,n){switch(t.tag){case 26:case 27:case 5:return it(t.type);case 16:return it("Lazy");case 13:return t.child!==n&&n!==null?it("Suspense Fallback"):it("Suspense");case 19:return it("SuspenseList");case 0:case 15:return Lt(t.type,!1);case 11:return Lt(t.type.render,!1);case 1:return Lt(t.type,!0);case 31:return it("Activity");default:return""}}function kt(t){try{var n="",a=null;do n+=pt(t,a),a=t,t=t.return;while(t);return n}catch(o){return`
Error generating stack: `+o.message+`
`+o.stack}}var tn=Object.prototype.hasOwnProperty,Mn=r.unstable_scheduleCallback,Xt=r.unstable_cancelCallback,nn=r.unstable_shouldYield,Q=r.unstable_requestPaint,Ot=r.unstable_now,Dt=r.unstable_getCurrentPriorityLevel,B=r.unstable_ImmediatePriority,M=r.unstable_UserBlockingPriority,te=r.unstable_NormalPriority,ue=r.unstable_LowPriority,ge=r.unstable_IdlePriority,Ae=r.log,Ne=r.unstable_setDisableYieldValue,_e=null,ve=null;function Re(t){if(typeof Ae=="function"&&Ne(t),ve&&typeof ve.setStrictMode=="function")try{ve.setStrictMode(_e,t)}catch{}}var Ve=Math.clz32?Math.clz32:Ke,Pe=Math.log,Ue=Math.LN2;function Ke(t){return t>>>=0,t===0?32:31-(Pe(t)/Ue|0)|0}var Qe=256,nt=262144,q=4194304;function Ce(t){var n=t&42;if(n!==0)return n;switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return t&261888;case 262144:case 524288:case 1048576:case 2097152:return t&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return t&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return t}}function Se(t,n,a){var o=t.pendingLanes;if(o===0)return 0;var u=0,f=t.suspendedLanes,v=t.pingedLanes;t=t.warmLanes;var R=o&134217727;return R!==0?(o=R&~f,o!==0?u=Ce(o):(v&=R,v!==0?u=Ce(v):a||(a=R&~t,a!==0&&(u=Ce(a))))):(R=o&~f,R!==0?u=Ce(R):v!==0?u=Ce(v):a||(a=o&~t,a!==0&&(u=Ce(a)))),u===0?0:n!==0&&n!==u&&(n&f)===0&&(f=u&-u,a=n&-n,f>=a||f===32&&(a&4194048)!==0)?n:u}function we(t,n){return(t.pendingLanes&~(t.suspendedLanes&~t.pingedLanes)&n)===0}function Be(t,n){switch(t){case 1:case 2:case 4:case 8:case 64:return n+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return n+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Te(){var t=q;return q<<=1,(q&62914560)===0&&(q=4194304),t}function Ze(t){for(var n=[],a=0;31>a;a++)n.push(t);return n}function We(t,n){t.pendingLanes|=n,n!==268435456&&(t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0)}function Bt(t,n,a,o,u,f){var v=t.pendingLanes;t.pendingLanes=a,t.suspendedLanes=0,t.pingedLanes=0,t.warmLanes=0,t.expiredLanes&=a,t.entangledLanes&=a,t.errorRecoveryDisabledLanes&=a,t.shellSuspendCounter=0;var R=t.entanglements,G=t.expirationTimes,ce=t.hiddenUpdates;for(a=v&~a;0<a;){var xe=31-Ve(a),Ee=1<<xe;R[xe]=0,G[xe]=-1;var de=ce[xe];if(de!==null)for(ce[xe]=null,xe=0;xe<de.length;xe++){var pe=de[xe];pe!==null&&(pe.lane&=-536870913)}a&=~Ee}o!==0&&bt(t,o,0),f!==0&&u===0&&t.tag!==0&&(t.suspendedLanes|=f&~(v&~n))}function bt(t,n,a){t.pendingLanes|=n,t.suspendedLanes&=~n;var o=31-Ve(n);t.entangledLanes|=n,t.entanglements[o]=t.entanglements[o]|1073741824|a&261930}function Xn(t,n){var a=t.entangledLanes|=n;for(t=t.entanglements;a;){var o=31-Ve(a),u=1<<o;u&n|t[o]&n&&(t[o]|=n),a&=~u}}function ti(t,n){var a=n&-n;return a=(a&42)!==0?1:jr(a),(a&(t.suspendedLanes|n))!==0?0:a}function jr(t){switch(t){case 2:t=1;break;case 8:t=4;break;case 32:t=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:t=128;break;case 268435456:t=134217728;break;default:t=0}return t}function Zr(t){return t&=-t,2<t?8<t?(t&134217727)!==0?32:268435456:8:2}function Kr(){var t=V.p;return t!==0?t:(t=window.event,t===void 0?32:Gg(t.type))}function Xs(t,n){var a=V.p;try{return V.p=t,n()}finally{V.p=a}}var Bi=Math.random().toString(36).slice(2),ln="__reactFiber$"+Bi,An="__reactProps$"+Bi,Wn="__reactContainer$"+Bi,cs="__reactEvents$"+Bi,fl="__reactListeners$"+Bi,dl="__reactHandles$"+Bi,us="__reactResources$"+Bi,Ra="__reactMarker$"+Bi;function Ca(t){delete t[ln],delete t[An],delete t[cs],delete t[fl],delete t[dl]}function Ji(t){var n=t[ln];if(n)return n;for(var a=t.parentNode;a;){if(n=a[Wn]||a[ln]){if(a=n.alternate,n.child!==null||a!==null&&a.child!==null)for(t=bg(t);t!==null;){if(a=t[ln])return a;t=bg(t)}return n}t=a,a=t.parentNode}return null}function $i(t){if(t=t[ln]||t[Wn]){var n=t.tag;if(n===5||n===6||n===13||n===31||n===26||n===27||n===3)return t}return null}function fs(t){var n=t.tag;if(n===5||n===26||n===27||n===6)return t.stateNode;throw Error(s(33))}function wa(t){var n=t[us];return n||(n=t[us]={hoistableStyles:new Map,hoistableScripts:new Map}),n}function cn(t){t[Ra]=!0}var hl=new Set,Qr={};function b(t,n){k(t,n),k(t+"Capture",n)}function k(t,n){for(Qr[t]=n,t=0;t<n.length;t++)hl.add(n[t])}var he=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),ie={},ae={};function Ie(t){return tn.call(ae,t)?!0:tn.call(ie,t)?!1:he.test(t)?ae[t]=!0:(ie[t]=!0,!1)}function ke(t,n,a){if(Ie(n))if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":t.removeAttribute(n);return;case"boolean":var o=n.toLowerCase().slice(0,5);if(o!=="data-"&&o!=="aria-"){t.removeAttribute(n);return}}t.setAttribute(n,""+a)}}function Le(t,n,a){if(a===null)t.removeAttribute(n);else{switch(typeof a){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(n);return}t.setAttribute(n,""+a)}}function He(t,n,a,o){if(o===null)t.removeAttribute(a);else{switch(typeof o){case"undefined":case"function":case"symbol":case"boolean":t.removeAttribute(a);return}t.setAttributeNS(n,a,""+o)}}function Ge(t){switch(typeof t){case"bigint":case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function rt(t){var n=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(n==="checkbox"||n==="radio")}function ht(t,n,a){var o=Object.getOwnPropertyDescriptor(t.constructor.prototype,n);if(!t.hasOwnProperty(n)&&typeof o<"u"&&typeof o.get=="function"&&typeof o.set=="function"){var u=o.get,f=o.set;return Object.defineProperty(t,n,{configurable:!0,get:function(){return u.call(this)},set:function(v){a=""+v,f.call(this,v)}}),Object.defineProperty(t,n,{enumerable:o.enumerable}),{getValue:function(){return a},setValue:function(v){a=""+v},stopTracking:function(){t._valueTracker=null,delete t[n]}}}}function Ye(t){if(!t._valueTracker){var n=rt(t)?"checked":"value";t._valueTracker=ht(t,n,""+t[n])}}function At(t){if(!t)return!1;var n=t._valueTracker;if(!n)return!0;var a=n.getValue(),o="";return t&&(o=rt(t)?t.checked?"true":"false":t.value),t=o,t!==a?(n.setValue(t),!0):!1}function qt(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}var Wt=/[\n"\\]/g;function ut(t){return t.replace(Wt,function(n){return"\\"+n.charCodeAt(0).toString(16)+" "})}function un(t,n,a,o,u,f,v,R){t.name="",v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"?t.type=v:t.removeAttribute("type"),n!=null?v==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+Ge(n)):t.value!==""+Ge(n)&&(t.value=""+Ge(n)):v!=="submit"&&v!=="reset"||t.removeAttribute("value"),n!=null?gn(t,v,Ge(n)):a!=null?gn(t,v,Ge(a)):o!=null&&t.removeAttribute("value"),u==null&&f!=null&&(t.defaultChecked=!!f),u!=null&&(t.checked=u&&typeof u!="function"&&typeof u!="symbol"),R!=null&&typeof R!="function"&&typeof R!="symbol"&&typeof R!="boolean"?t.name=""+Ge(R):t.removeAttribute("name")}function Xe(t,n,a,o,u,f,v,R){if(f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(t.type=f),n!=null||a!=null){if(!(f!=="submit"&&f!=="reset"||n!=null)){Ye(t);return}a=a!=null?""+Ge(a):"",n=n!=null?""+Ge(n):a,R||n===t.value||(t.value=n),t.defaultValue=n}o=o??u,o=typeof o!="function"&&typeof o!="symbol"&&!!o,t.checked=R?t.checked:!!o,t.defaultChecked=!!o,v!=null&&typeof v!="function"&&typeof v!="symbol"&&typeof v!="boolean"&&(t.name=v),Ye(t)}function gn(t,n,a){n==="number"&&qt(t.ownerDocument)===t||t.defaultValue===""+a||(t.defaultValue=""+a)}function ft(t,n,a,o){if(t=t.options,n){n={};for(var u=0;u<a.length;u++)n["$"+a[u]]=!0;for(a=0;a<t.length;a++)u=n.hasOwnProperty("$"+t[a].value),t[a].selected!==u&&(t[a].selected=u),u&&o&&(t[a].defaultSelected=!0)}else{for(a=""+Ge(a),n=null,u=0;u<t.length;u++){if(t[u].value===a){t[u].selected=!0,o&&(t[u].defaultSelected=!0);return}n!==null||t[u].disabled||(n=t[u])}n!==null&&(n.selected=!0)}}function zn(t,n,a){if(n!=null&&(n=""+Ge(n),n!==t.value&&(t.value=n),a==null)){t.defaultValue!==n&&(t.defaultValue=n);return}t.defaultValue=a!=null?""+Ge(a):""}function ni(t,n,a,o){if(n==null){if(o!=null){if(a!=null)throw Error(s(92));if(ne(o)){if(1<o.length)throw Error(s(93));o=o[0]}a=o}a==null&&(a=""),n=a}a=Ge(n),t.defaultValue=a,o=t.textContent,o===a&&o!==""&&o!==null&&(t.value=o),Ye(t)}function Bn(t,n){if(n){var a=t.firstChild;if(a&&a===t.lastChild&&a.nodeType===3){a.nodeValue=n;return}}t.textContent=n}var Da=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Nt(t,n,a){var o=n.indexOf("--")===0;a==null||typeof a=="boolean"||a===""?o?t.setProperty(n,""):n==="float"?t.cssFloat="":t[n]="":o?t.setProperty(n,a):typeof a!="number"||a===0||Da.has(n)?n==="float"?t.cssFloat=a:t[n]=(""+a).trim():t[n]=a+"px"}function Kt(t,n,a){if(n!=null&&typeof n!="object")throw Error(s(62));if(t=t.style,a!=null){for(var o in a)!a.hasOwnProperty(o)||n!=null&&n.hasOwnProperty(o)||(o.indexOf("--")===0?t.setProperty(o,""):o==="float"?t.cssFloat="":t[o]="");for(var u in n)o=n[u],n.hasOwnProperty(u)&&a[u]!==o&&Nt(t,u,o)}else for(var f in n)n.hasOwnProperty(f)&&Nt(t,f,n[f])}function pi(t){if(t.indexOf("-")===-1)return!1;switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ft=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Fi=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Ri(t){return Fi.test(""+t)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":t}function mi(){}var mu=null;function gu(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ws=null,Ys=null;function gp(t){var n=$i(t);if(n&&(t=n.stateNode)){var a=t[An]||null;e:switch(t=n.stateNode,n.type){case"input":if(un(t,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name),n=a.name,a.type==="radio"&&n!=null){for(a=t;a.parentNode;)a=a.parentNode;for(a=a.querySelectorAll('input[name="'+ut(""+n)+'"][type="radio"]'),n=0;n<a.length;n++){var o=a[n];if(o!==t&&o.form===t.form){var u=o[An]||null;if(!u)throw Error(s(90));un(o,u.value,u.defaultValue,u.defaultValue,u.checked,u.defaultChecked,u.type,u.name)}}for(n=0;n<a.length;n++)o=a[n],o.form===t.form&&At(o)}break e;case"textarea":zn(t,a.value,a.defaultValue);break e;case"select":n=a.value,n!=null&&ft(t,!!a.multiple,n,!1)}}}var _u=!1;function _p(t,n,a){if(_u)return t(n,a);_u=!0;try{var o=t(n);return o}finally{if(_u=!1,(Ws!==null||Ys!==null)&&(ec(),Ws&&(n=Ws,t=Ys,Ys=Ws=null,gp(n),t)))for(n=0;n<t.length;n++)gp(t[n])}}function Jr(t,n){var a=t.stateNode;if(a===null)return null;var o=a[An]||null;if(o===null)return null;a=o[n];e:switch(n){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(o=!o.disabled)||(t=t.type,o=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!o;break e;default:t=!1}if(t)return null;if(a&&typeof a!="function")throw Error(s(231,n,typeof a));return a}var ea=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),vu=!1;if(ea)try{var $r={};Object.defineProperty($r,"passive",{get:function(){vu=!0}}),window.addEventListener("test",$r,$r),window.removeEventListener("test",$r,$r)}catch{vu=!1}var Na=null,xu=null,pl=null;function vp(){if(pl)return pl;var t,n=xu,a=n.length,o,u="value"in Na?Na.value:Na.textContent,f=u.length;for(t=0;t<a&&n[t]===u[t];t++);var v=a-t;for(o=1;o<=v&&n[a-o]===u[f-o];o++);return pl=u.slice(t,1<o?1-o:void 0)}function ml(t){var n=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&n===13&&(t=13)):t=n,t===10&&(t=13),32<=t||t===13?t:0}function gl(){return!0}function xp(){return!1}function Yn(t){function n(a,o,u,f,v){this._reactName=a,this._targetInst=u,this.type=o,this.nativeEvent=f,this.target=v,this.currentTarget=null;for(var R in t)t.hasOwnProperty(R)&&(a=t[R],this[R]=a?a(f):f[R]);return this.isDefaultPrevented=(f.defaultPrevented!=null?f.defaultPrevented:f.returnValue===!1)?gl:xp,this.isPropagationStopped=xp,this}return S(n.prototype,{preventDefault:function(){this.defaultPrevented=!0;var a=this.nativeEvent;a&&(a.preventDefault?a.preventDefault():typeof a.returnValue!="unknown"&&(a.returnValue=!1),this.isDefaultPrevented=gl)},stopPropagation:function(){var a=this.nativeEvent;a&&(a.stopPropagation?a.stopPropagation():typeof a.cancelBubble!="unknown"&&(a.cancelBubble=!0),this.isPropagationStopped=gl)},persist:function(){},isPersistent:gl}),n}var ds={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},_l=Yn(ds),eo=S({},ds,{view:0,detail:0}),Yv=Yn(eo),Su,Mu,to,vl=S({},eo,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Eu,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==to&&(to&&t.type==="mousemove"?(Su=t.screenX-to.screenX,Mu=t.screenY-to.screenY):Mu=Su=0,to=t),Su)},movementY:function(t){return"movementY"in t?t.movementY:Mu}}),Sp=Yn(vl),qv=S({},vl,{dataTransfer:0}),jv=Yn(qv),Zv=S({},eo,{relatedTarget:0}),yu=Yn(Zv),Kv=S({},ds,{animationName:0,elapsedTime:0,pseudoElement:0}),Qv=Yn(Kv),Jv=S({},ds,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),$v=Yn(Jv),ex=S({},ds,{data:0}),Mp=Yn(ex),tx={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},nx={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},ix={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function ax(t){var n=this.nativeEvent;return n.getModifierState?n.getModifierState(t):(t=ix[t])?!!n[t]:!1}function Eu(){return ax}var sx=S({},eo,{key:function(t){if(t.key){var n=tx[t.key]||t.key;if(n!=="Unidentified")return n}return t.type==="keypress"?(t=ml(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?nx[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Eu,charCode:function(t){return t.type==="keypress"?ml(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?ml(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),rx=Yn(sx),ox=S({},vl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),yp=Yn(ox),lx=S({},eo,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Eu}),cx=Yn(lx),ux=S({},ds,{propertyName:0,elapsedTime:0,pseudoElement:0}),fx=Yn(ux),dx=S({},vl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),hx=Yn(dx),px=S({},ds,{newState:0,oldState:0}),mx=Yn(px),gx=[9,13,27,32],Tu=ea&&"CompositionEvent"in window,no=null;ea&&"documentMode"in document&&(no=document.documentMode);var _x=ea&&"TextEvent"in window&&!no,Ep=ea&&(!Tu||no&&8<no&&11>=no),Tp=" ",bp=!1;function Ap(t,n){switch(t){case"keyup":return gx.indexOf(n.keyCode)!==-1;case"keydown":return n.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Rp(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var qs=!1;function vx(t,n){switch(t){case"compositionend":return Rp(n);case"keypress":return n.which!==32?null:(bp=!0,Tp);case"textInput":return t=n.data,t===Tp&&bp?null:t;default:return null}}function xx(t,n){if(qs)return t==="compositionend"||!Tu&&Ap(t,n)?(t=vp(),pl=xu=Na=null,qs=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(n.ctrlKey||n.altKey||n.metaKey)||n.ctrlKey&&n.altKey){if(n.char&&1<n.char.length)return n.char;if(n.which)return String.fromCharCode(n.which)}return null;case"compositionend":return Ep&&n.locale!=="ko"?null:n.data;default:return null}}var Sx={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Cp(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n==="input"?!!Sx[t.type]:n==="textarea"}function wp(t,n,a,o){Ws?Ys?Ys.push(o):Ys=[o]:Ws=o,n=oc(n,"onChange"),0<n.length&&(a=new _l("onChange","change",null,a,o),t.push({event:a,listeners:n}))}var io=null,ao=null;function Mx(t){fg(t,0)}function xl(t){var n=fs(t);if(At(n))return t}function Dp(t,n){if(t==="change")return n}var Np=!1;if(ea){var bu;if(ea){var Au="oninput"in document;if(!Au){var Up=document.createElement("div");Up.setAttribute("oninput","return;"),Au=typeof Up.oninput=="function"}bu=Au}else bu=!1;Np=bu&&(!document.documentMode||9<document.documentMode)}function Lp(){io&&(io.detachEvent("onpropertychange",Op),ao=io=null)}function Op(t){if(t.propertyName==="value"&&xl(ao)){var n=[];wp(n,ao,t,gu(t)),_p(Mx,n)}}function yx(t,n,a){t==="focusin"?(Lp(),io=n,ao=a,io.attachEvent("onpropertychange",Op)):t==="focusout"&&Lp()}function Ex(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return xl(ao)}function Tx(t,n){if(t==="click")return xl(n)}function bx(t,n){if(t==="input"||t==="change")return xl(n)}function Ax(t,n){return t===n&&(t!==0||1/t===1/n)||t!==t&&n!==n}var ii=typeof Object.is=="function"?Object.is:Ax;function so(t,n){if(ii(t,n))return!0;if(typeof t!="object"||t===null||typeof n!="object"||n===null)return!1;var a=Object.keys(t),o=Object.keys(n);if(a.length!==o.length)return!1;for(o=0;o<a.length;o++){var u=a[o];if(!tn.call(n,u)||!ii(t[u],n[u]))return!1}return!0}function Pp(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Ip(t,n){var a=Pp(t);t=0;for(var o;a;){if(a.nodeType===3){if(o=t+a.textContent.length,t<=n&&o>=n)return{node:a,offset:n-t};t=o}e:{for(;a;){if(a.nextSibling){a=a.nextSibling;break e}a=a.parentNode}a=void 0}a=Pp(a)}}function zp(t,n){return t&&n?t===n?!0:t&&t.nodeType===3?!1:n&&n.nodeType===3?zp(t,n.parentNode):"contains"in t?t.contains(n):t.compareDocumentPosition?!!(t.compareDocumentPosition(n)&16):!1:!1}function Bp(t){t=t!=null&&t.ownerDocument!=null&&t.ownerDocument.defaultView!=null?t.ownerDocument.defaultView:window;for(var n=qt(t.document);n instanceof t.HTMLIFrameElement;){try{var a=typeof n.contentWindow.location.href=="string"}catch{a=!1}if(a)t=n.contentWindow;else break;n=qt(t.document)}return n}function Ru(t){var n=t&&t.nodeName&&t.nodeName.toLowerCase();return n&&(n==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||n==="textarea"||t.contentEditable==="true")}var Rx=ea&&"documentMode"in document&&11>=document.documentMode,js=null,Cu=null,ro=null,wu=!1;function Fp(t,n,a){var o=a.window===a?a.document:a.nodeType===9?a:a.ownerDocument;wu||js==null||js!==qt(o)||(o=js,"selectionStart"in o&&Ru(o)?o={start:o.selectionStart,end:o.selectionEnd}:(o=(o.ownerDocument&&o.ownerDocument.defaultView||window).getSelection(),o={anchorNode:o.anchorNode,anchorOffset:o.anchorOffset,focusNode:o.focusNode,focusOffset:o.focusOffset}),ro&&so(ro,o)||(ro=o,o=oc(Cu,"onSelect"),0<o.length&&(n=new _l("onSelect","select",null,n,a),t.push({event:n,listeners:o}),n.target=js)))}function hs(t,n){var a={};return a[t.toLowerCase()]=n.toLowerCase(),a["Webkit"+t]="webkit"+n,a["Moz"+t]="moz"+n,a}var Zs={animationend:hs("Animation","AnimationEnd"),animationiteration:hs("Animation","AnimationIteration"),animationstart:hs("Animation","AnimationStart"),transitionrun:hs("Transition","TransitionRun"),transitionstart:hs("Transition","TransitionStart"),transitioncancel:hs("Transition","TransitionCancel"),transitionend:hs("Transition","TransitionEnd")},Du={},Hp={};ea&&(Hp=document.createElement("div").style,"AnimationEvent"in window||(delete Zs.animationend.animation,delete Zs.animationiteration.animation,delete Zs.animationstart.animation),"TransitionEvent"in window||delete Zs.transitionend.transition);function ps(t){if(Du[t])return Du[t];if(!Zs[t])return t;var n=Zs[t],a;for(a in n)if(n.hasOwnProperty(a)&&a in Hp)return Du[t]=n[a];return t}var Gp=ps("animationend"),Vp=ps("animationiteration"),kp=ps("animationstart"),Cx=ps("transitionrun"),wx=ps("transitionstart"),Dx=ps("transitioncancel"),Xp=ps("transitionend"),Wp=new Map,Nu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Nu.push("scrollEnd");function Ci(t,n){Wp.set(t,n),b(n,[t])}var Sl=typeof reportError=="function"?reportError:function(t){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var n=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof t=="object"&&t!==null&&typeof t.message=="string"?String(t.message):String(t),error:t});if(!window.dispatchEvent(n))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",t);return}console.error(t)},gi=[],Ks=0,Uu=0;function Ml(){for(var t=Ks,n=Uu=Ks=0;n<t;){var a=gi[n];gi[n++]=null;var o=gi[n];gi[n++]=null;var u=gi[n];gi[n++]=null;var f=gi[n];if(gi[n++]=null,o!==null&&u!==null){var v=o.pending;v===null?u.next=u:(u.next=v.next,v.next=u),o.pending=u}f!==0&&Yp(a,u,f)}}function yl(t,n,a,o){gi[Ks++]=t,gi[Ks++]=n,gi[Ks++]=a,gi[Ks++]=o,Uu|=o,t.lanes|=o,t=t.alternate,t!==null&&(t.lanes|=o)}function Lu(t,n,a,o){return yl(t,n,a,o),El(t)}function ms(t,n){return yl(t,null,null,n),El(t)}function Yp(t,n,a){t.lanes|=a;var o=t.alternate;o!==null&&(o.lanes|=a);for(var u=!1,f=t.return;f!==null;)f.childLanes|=a,o=f.alternate,o!==null&&(o.childLanes|=a),f.tag===22&&(t=f.stateNode,t===null||t._visibility&1||(u=!0)),t=f,f=f.return;return t.tag===3?(f=t.stateNode,u&&n!==null&&(u=31-Ve(a),t=f.hiddenUpdates,o=t[u],o===null?t[u]=[n]:o.push(n),n.lane=a|536870912),f):null}function El(t){if(50<wo)throw wo=0,kf=null,Error(s(185));for(var n=t.return;n!==null;)t=n,n=t.return;return t.tag===3?t.stateNode:null}var Qs={};function Nx(t,n,a,o){this.tag=t,this.key=a,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=n,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=o,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function ai(t,n,a,o){return new Nx(t,n,a,o)}function Ou(t){return t=t.prototype,!(!t||!t.isReactComponent)}function ta(t,n){var a=t.alternate;return a===null?(a=ai(t.tag,n,t.key,t.mode),a.elementType=t.elementType,a.type=t.type,a.stateNode=t.stateNode,a.alternate=t,t.alternate=a):(a.pendingProps=n,a.type=t.type,a.flags=0,a.subtreeFlags=0,a.deletions=null),a.flags=t.flags&65011712,a.childLanes=t.childLanes,a.lanes=t.lanes,a.child=t.child,a.memoizedProps=t.memoizedProps,a.memoizedState=t.memoizedState,a.updateQueue=t.updateQueue,n=t.dependencies,a.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext},a.sibling=t.sibling,a.index=t.index,a.ref=t.ref,a.refCleanup=t.refCleanup,a}function qp(t,n){t.flags&=65011714;var a=t.alternate;return a===null?(t.childLanes=0,t.lanes=n,t.child=null,t.subtreeFlags=0,t.memoizedProps=null,t.memoizedState=null,t.updateQueue=null,t.dependencies=null,t.stateNode=null):(t.childLanes=a.childLanes,t.lanes=a.lanes,t.child=a.child,t.subtreeFlags=0,t.deletions=null,t.memoizedProps=a.memoizedProps,t.memoizedState=a.memoizedState,t.updateQueue=a.updateQueue,t.type=a.type,n=a.dependencies,t.dependencies=n===null?null:{lanes:n.lanes,firstContext:n.firstContext}),t}function Tl(t,n,a,o,u,f){var v=0;if(o=t,typeof t=="function")Ou(t)&&(v=1);else if(typeof t=="string")v=IS(t,a,ye.current)?26:t==="html"||t==="head"||t==="body"?27:5;else e:switch(t){case z:return t=ai(31,a,n,u),t.elementType=z,t.lanes=f,t;case D:return gs(a.children,u,f,n);case y:v=8,u|=24;break;case _:return t=ai(12,a,n,u|2),t.elementType=_,t.lanes=f,t;case U:return t=ai(13,a,n,u),t.elementType=U,t.lanes=f,t;case P:return t=ai(19,a,n,u),t.elementType=P,t.lanes=f,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case O:v=10;break e;case I:v=9;break e;case w:v=11;break e;case F:v=14;break e;case T:v=16,o=null;break e}v=29,a=Error(s(130,t===null?"null":typeof t,"")),o=null}return n=ai(v,a,n,u),n.elementType=t,n.type=o,n.lanes=f,n}function gs(t,n,a,o){return t=ai(7,t,o,n),t.lanes=a,t}function Pu(t,n,a){return t=ai(6,t,null,n),t.lanes=a,t}function jp(t){var n=ai(18,null,null,0);return n.stateNode=t,n}function Iu(t,n,a){return n=ai(4,t.children!==null?t.children:[],t.key,n),n.lanes=a,n.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},n}var Zp=new WeakMap;function _i(t,n){if(typeof t=="object"&&t!==null){var a=Zp.get(t);return a!==void 0?a:(n={value:t,source:n,stack:kt(n)},Zp.set(t,n),n)}return{value:t,source:n,stack:kt(n)}}var Js=[],$s=0,bl=null,oo=0,vi=[],xi=0,Ua=null,Hi=1,Gi="";function na(t,n){Js[$s++]=oo,Js[$s++]=bl,bl=t,oo=n}function Kp(t,n,a){vi[xi++]=Hi,vi[xi++]=Gi,vi[xi++]=Ua,Ua=t;var o=Hi;t=Gi;var u=32-Ve(o)-1;o&=~(1<<u),a+=1;var f=32-Ve(n)+u;if(30<f){var v=u-u%5;f=(o&(1<<v)-1).toString(32),o>>=v,u-=v,Hi=1<<32-Ve(n)+u|a<<u|o,Gi=f+t}else Hi=1<<f|a<<u|o,Gi=t}function zu(t){t.return!==null&&(na(t,1),Kp(t,1,0))}function Bu(t){for(;t===bl;)bl=Js[--$s],Js[$s]=null,oo=Js[--$s],Js[$s]=null;for(;t===Ua;)Ua=vi[--xi],vi[xi]=null,Gi=vi[--xi],vi[xi]=null,Hi=vi[--xi],vi[xi]=null}function Qp(t,n){vi[xi++]=Hi,vi[xi++]=Gi,vi[xi++]=Ua,Hi=n.id,Gi=n.overflow,Ua=t}var Rn=null,jt=null,yt=!1,La=null,Si=!1,Fu=Error(s(519));function Oa(t){var n=Error(s(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw lo(_i(n,t)),Fu}function Jp(t){var n=t.stateNode,a=t.type,o=t.memoizedProps;switch(n[ln]=t,n[An]=o,a){case"dialog":gt("cancel",n),gt("close",n);break;case"iframe":case"object":case"embed":gt("load",n);break;case"video":case"audio":for(a=0;a<No.length;a++)gt(No[a],n);break;case"source":gt("error",n);break;case"img":case"image":case"link":gt("error",n),gt("load",n);break;case"details":gt("toggle",n);break;case"input":gt("invalid",n),Xe(n,o.value,o.defaultValue,o.checked,o.defaultChecked,o.type,o.name,!0);break;case"select":gt("invalid",n);break;case"textarea":gt("invalid",n),ni(n,o.value,o.defaultValue,o.children)}a=o.children,typeof a!="string"&&typeof a!="number"&&typeof a!="bigint"||n.textContent===""+a||o.suppressHydrationWarning===!0||mg(n.textContent,a)?(o.popover!=null&&(gt("beforetoggle",n),gt("toggle",n)),o.onScroll!=null&&gt("scroll",n),o.onScrollEnd!=null&&gt("scrollend",n),o.onClick!=null&&(n.onclick=mi),n=!0):n=!1,n||Oa(t,!0)}function $p(t){for(Rn=t.return;Rn;)switch(Rn.tag){case 5:case 31:case 13:Si=!1;return;case 27:case 3:Si=!0;return;default:Rn=Rn.return}}function er(t){if(t!==Rn)return!1;if(!yt)return $p(t),yt=!0,!1;var n=t.tag,a;if((a=n!==3&&n!==27)&&((a=n===5)&&(a=t.type,a=!(a!=="form"&&a!=="button")||ad(t.type,t.memoizedProps)),a=!a),a&&jt&&Oa(t),$p(t),n===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));jt=Tg(t)}else if(n===31){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(317));jt=Tg(t)}else n===27?(n=jt,ja(t.type)?(t=cd,cd=null,jt=t):jt=n):jt=Rn?yi(t.stateNode.nextSibling):null;return!0}function _s(){jt=Rn=null,yt=!1}function Hu(){var t=La;return t!==null&&(Kn===null?Kn=t:Kn.push.apply(Kn,t),La=null),t}function lo(t){La===null?La=[t]:La.push(t)}var Gu=C(null),vs=null,ia=null;function Pa(t,n,a){ee(Gu,n._currentValue),n._currentValue=a}function aa(t){t._currentValue=Gu.current,Y(Gu)}function Vu(t,n,a){for(;t!==null;){var o=t.alternate;if((t.childLanes&n)!==n?(t.childLanes|=n,o!==null&&(o.childLanes|=n)):o!==null&&(o.childLanes&n)!==n&&(o.childLanes|=n),t===a)break;t=t.return}}function ku(t,n,a,o){var u=t.child;for(u!==null&&(u.return=t);u!==null;){var f=u.dependencies;if(f!==null){var v=u.child;f=f.firstContext;e:for(;f!==null;){var R=f;f=u;for(var G=0;G<n.length;G++)if(R.context===n[G]){f.lanes|=a,R=f.alternate,R!==null&&(R.lanes|=a),Vu(f.return,a,t),o||(v=null);break e}f=R.next}}else if(u.tag===18){if(v=u.return,v===null)throw Error(s(341));v.lanes|=a,f=v.alternate,f!==null&&(f.lanes|=a),Vu(v,a,t),v=null}else v=u.child;if(v!==null)v.return=u;else for(v=u;v!==null;){if(v===t){v=null;break}if(u=v.sibling,u!==null){u.return=v.return,v=u;break}v=v.return}u=v}}function tr(t,n,a,o){t=null;for(var u=n,f=!1;u!==null;){if(!f){if((u.flags&524288)!==0)f=!0;else if((u.flags&262144)!==0)break}if(u.tag===10){var v=u.alternate;if(v===null)throw Error(s(387));if(v=v.memoizedProps,v!==null){var R=u.type;ii(u.pendingProps.value,v.value)||(t!==null?t.push(R):t=[R])}}else if(u===re.current){if(v=u.alternate,v===null)throw Error(s(387));v.memoizedState.memoizedState!==u.memoizedState.memoizedState&&(t!==null?t.push(Io):t=[Io])}u=u.return}t!==null&&ku(n,t,a,o),n.flags|=262144}function Al(t){for(t=t.firstContext;t!==null;){if(!ii(t.context._currentValue,t.memoizedValue))return!0;t=t.next}return!1}function xs(t){vs=t,ia=null,t=t.dependencies,t!==null&&(t.firstContext=null)}function Cn(t){return em(vs,t)}function Rl(t,n){return vs===null&&xs(t),em(t,n)}function em(t,n){var a=n._currentValue;if(n={context:n,memoizedValue:a,next:null},ia===null){if(t===null)throw Error(s(308));ia=n,t.dependencies={lanes:0,firstContext:n},t.flags|=524288}else ia=ia.next=n;return a}var Ux=typeof AbortController<"u"?AbortController:function(){var t=[],n=this.signal={aborted:!1,addEventListener:function(a,o){t.push(o)}};this.abort=function(){n.aborted=!0,t.forEach(function(a){return a()})}},Lx=r.unstable_scheduleCallback,Ox=r.unstable_NormalPriority,fn={$$typeof:O,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Xu(){return{controller:new Ux,data:new Map,refCount:0}}function co(t){t.refCount--,t.refCount===0&&Lx(Ox,function(){t.controller.abort()})}var uo=null,Wu=0,nr=0,ir=null;function Px(t,n){if(uo===null){var a=uo=[];Wu=0,nr=Zf(),ir={status:"pending",value:void 0,then:function(o){a.push(o)}}}return Wu++,n.then(tm,tm),n}function tm(){if(--Wu===0&&uo!==null){ir!==null&&(ir.status="fulfilled");var t=uo;uo=null,nr=0,ir=null;for(var n=0;n<t.length;n++)(0,t[n])()}}function Ix(t,n){var a=[],o={status:"pending",value:null,reason:null,then:function(u){a.push(u)}};return t.then(function(){o.status="fulfilled",o.value=n;for(var u=0;u<a.length;u++)(0,a[u])(n)},function(u){for(o.status="rejected",o.reason=u,u=0;u<a.length;u++)(0,a[u])(void 0)}),o}var nm=N.S;N.S=function(t,n){F0=Ot(),typeof n=="object"&&n!==null&&typeof n.then=="function"&&Px(t,n),nm!==null&&nm(t,n)};var Ss=C(null);function Yu(){var t=Ss.current;return t!==null?t:Yt.pooledCache}function Cl(t,n){n===null?ee(Ss,Ss.current):ee(Ss,n.pool)}function im(){var t=Yu();return t===null?null:{parent:fn._currentValue,pool:t}}var ar=Error(s(460)),qu=Error(s(474)),wl=Error(s(542)),Dl={then:function(){}};function am(t){return t=t.status,t==="fulfilled"||t==="rejected"}function sm(t,n,a){switch(a=t[a],a===void 0?t.push(n):a!==n&&(n.then(mi,mi),n=a),n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,om(t),t;default:if(typeof n.status=="string")n.then(mi,mi);else{if(t=Yt,t!==null&&100<t.shellSuspendCounter)throw Error(s(482));t=n,t.status="pending",t.then(function(o){if(n.status==="pending"){var u=n;u.status="fulfilled",u.value=o}},function(o){if(n.status==="pending"){var u=n;u.status="rejected",u.reason=o}})}switch(n.status){case"fulfilled":return n.value;case"rejected":throw t=n.reason,om(t),t}throw ys=n,ar}}function Ms(t){try{var n=t._init;return n(t._payload)}catch(a){throw a!==null&&typeof a=="object"&&typeof a.then=="function"?(ys=a,ar):a}}var ys=null;function rm(){if(ys===null)throw Error(s(459));var t=ys;return ys=null,t}function om(t){if(t===ar||t===wl)throw Error(s(483))}var sr=null,fo=0;function Nl(t){var n=fo;return fo+=1,sr===null&&(sr=[]),sm(sr,t,n)}function ho(t,n){n=n.props.ref,t.ref=n!==void 0?n:null}function Ul(t,n){throw n.$$typeof===g?Error(s(525)):(t=Object.prototype.toString.call(n),Error(s(31,t==="[object Object]"?"object with keys {"+Object.keys(n).join(", ")+"}":t)))}function lm(t){function n(J,W){if(t){var le=J.deletions;le===null?(J.deletions=[W],J.flags|=16):le.push(W)}}function a(J,W){if(!t)return null;for(;W!==null;)n(J,W),W=W.sibling;return null}function o(J){for(var W=new Map;J!==null;)J.key!==null?W.set(J.key,J):W.set(J.index,J),J=J.sibling;return W}function u(J,W){return J=ta(J,W),J.index=0,J.sibling=null,J}function f(J,W,le){return J.index=le,t?(le=J.alternate,le!==null?(le=le.index,le<W?(J.flags|=67108866,W):le):(J.flags|=67108866,W)):(J.flags|=1048576,W)}function v(J){return t&&J.alternate===null&&(J.flags|=67108866),J}function R(J,W,le,Me){return W===null||W.tag!==6?(W=Pu(le,J.mode,Me),W.return=J,W):(W=u(W,le),W.return=J,W)}function G(J,W,le,Me){var Je=le.type;return Je===D?xe(J,W,le.props.children,Me,le.key):W!==null&&(W.elementType===Je||typeof Je=="object"&&Je!==null&&Je.$$typeof===T&&Ms(Je)===W.type)?(W=u(W,le.props),ho(W,le),W.return=J,W):(W=Tl(le.type,le.key,le.props,null,J.mode,Me),ho(W,le),W.return=J,W)}function ce(J,W,le,Me){return W===null||W.tag!==4||W.stateNode.containerInfo!==le.containerInfo||W.stateNode.implementation!==le.implementation?(W=Iu(le,J.mode,Me),W.return=J,W):(W=u(W,le.children||[]),W.return=J,W)}function xe(J,W,le,Me,Je){return W===null||W.tag!==7?(W=gs(le,J.mode,Me,Je),W.return=J,W):(W=u(W,le),W.return=J,W)}function Ee(J,W,le){if(typeof W=="string"&&W!==""||typeof W=="number"||typeof W=="bigint")return W=Pu(""+W,J.mode,le),W.return=J,W;if(typeof W=="object"&&W!==null){switch(W.$$typeof){case E:return le=Tl(W.type,W.key,W.props,null,J.mode,le),ho(le,W),le.return=J,le;case A:return W=Iu(W,J.mode,le),W.return=J,W;case T:return W=Ms(W),Ee(J,W,le)}if(ne(W)||j(W))return W=gs(W,J.mode,le,null),W.return=J,W;if(typeof W.then=="function")return Ee(J,Nl(W),le);if(W.$$typeof===O)return Ee(J,Rl(J,W),le);Ul(J,W)}return null}function de(J,W,le,Me){var Je=W!==null?W.key:null;if(typeof le=="string"&&le!==""||typeof le=="number"||typeof le=="bigint")return Je!==null?null:R(J,W,""+le,Me);if(typeof le=="object"&&le!==null){switch(le.$$typeof){case E:return le.key===Je?G(J,W,le,Me):null;case A:return le.key===Je?ce(J,W,le,Me):null;case T:return le=Ms(le),de(J,W,le,Me)}if(ne(le)||j(le))return Je!==null?null:xe(J,W,le,Me,null);if(typeof le.then=="function")return de(J,W,Nl(le),Me);if(le.$$typeof===O)return de(J,W,Rl(J,le),Me);Ul(J,le)}return null}function pe(J,W,le,Me,Je){if(typeof Me=="string"&&Me!==""||typeof Me=="number"||typeof Me=="bigint")return J=J.get(le)||null,R(W,J,""+Me,Je);if(typeof Me=="object"&&Me!==null){switch(Me.$$typeof){case E:return J=J.get(Me.key===null?le:Me.key)||null,G(W,J,Me,Je);case A:return J=J.get(Me.key===null?le:Me.key)||null,ce(W,J,Me,Je);case T:return Me=Ms(Me),pe(J,W,le,Me,Je)}if(ne(Me)||j(Me))return J=J.get(le)||null,xe(W,J,Me,Je,null);if(typeof Me.then=="function")return pe(J,W,le,Nl(Me),Je);if(Me.$$typeof===O)return pe(J,W,le,Rl(W,Me),Je);Ul(W,Me)}return null}function qe(J,W,le,Me){for(var Je=null,Rt=null,je=W,ct=W=0,St=null;je!==null&&ct<le.length;ct++){je.index>ct?(St=je,je=null):St=je.sibling;var Ct=de(J,je,le[ct],Me);if(Ct===null){je===null&&(je=St);break}t&&je&&Ct.alternate===null&&n(J,je),W=f(Ct,W,ct),Rt===null?Je=Ct:Rt.sibling=Ct,Rt=Ct,je=St}if(ct===le.length)return a(J,je),yt&&na(J,ct),Je;if(je===null){for(;ct<le.length;ct++)je=Ee(J,le[ct],Me),je!==null&&(W=f(je,W,ct),Rt===null?Je=je:Rt.sibling=je,Rt=je);return yt&&na(J,ct),Je}for(je=o(je);ct<le.length;ct++)St=pe(je,J,ct,le[ct],Me),St!==null&&(t&&St.alternate!==null&&je.delete(St.key===null?ct:St.key),W=f(St,W,ct),Rt===null?Je=St:Rt.sibling=St,Rt=St);return t&&je.forEach(function($a){return n(J,$a)}),yt&&na(J,ct),Je}function et(J,W,le,Me){if(le==null)throw Error(s(151));for(var Je=null,Rt=null,je=W,ct=W=0,St=null,Ct=le.next();je!==null&&!Ct.done;ct++,Ct=le.next()){je.index>ct?(St=je,je=null):St=je.sibling;var $a=de(J,je,Ct.value,Me);if($a===null){je===null&&(je=St);break}t&&je&&$a.alternate===null&&n(J,je),W=f($a,W,ct),Rt===null?Je=$a:Rt.sibling=$a,Rt=$a,je=St}if(Ct.done)return a(J,je),yt&&na(J,ct),Je;if(je===null){for(;!Ct.done;ct++,Ct=le.next())Ct=Ee(J,Ct.value,Me),Ct!==null&&(W=f(Ct,W,ct),Rt===null?Je=Ct:Rt.sibling=Ct,Rt=Ct);return yt&&na(J,ct),Je}for(je=o(je);!Ct.done;ct++,Ct=le.next())Ct=pe(je,J,ct,Ct.value,Me),Ct!==null&&(t&&Ct.alternate!==null&&je.delete(Ct.key===null?ct:Ct.key),W=f(Ct,W,ct),Rt===null?Je=Ct:Rt.sibling=Ct,Rt=Ct);return t&&je.forEach(function(qS){return n(J,qS)}),yt&&na(J,ct),Je}function Vt(J,W,le,Me){if(typeof le=="object"&&le!==null&&le.type===D&&le.key===null&&(le=le.props.children),typeof le=="object"&&le!==null){switch(le.$$typeof){case E:e:{for(var Je=le.key;W!==null;){if(W.key===Je){if(Je=le.type,Je===D){if(W.tag===7){a(J,W.sibling),Me=u(W,le.props.children),Me.return=J,J=Me;break e}}else if(W.elementType===Je||typeof Je=="object"&&Je!==null&&Je.$$typeof===T&&Ms(Je)===W.type){a(J,W.sibling),Me=u(W,le.props),ho(Me,le),Me.return=J,J=Me;break e}a(J,W);break}else n(J,W);W=W.sibling}le.type===D?(Me=gs(le.props.children,J.mode,Me,le.key),Me.return=J,J=Me):(Me=Tl(le.type,le.key,le.props,null,J.mode,Me),ho(Me,le),Me.return=J,J=Me)}return v(J);case A:e:{for(Je=le.key;W!==null;){if(W.key===Je)if(W.tag===4&&W.stateNode.containerInfo===le.containerInfo&&W.stateNode.implementation===le.implementation){a(J,W.sibling),Me=u(W,le.children||[]),Me.return=J,J=Me;break e}else{a(J,W);break}else n(J,W);W=W.sibling}Me=Iu(le,J.mode,Me),Me.return=J,J=Me}return v(J);case T:return le=Ms(le),Vt(J,W,le,Me)}if(ne(le))return qe(J,W,le,Me);if(j(le)){if(Je=j(le),typeof Je!="function")throw Error(s(150));return le=Je.call(le),et(J,W,le,Me)}if(typeof le.then=="function")return Vt(J,W,Nl(le),Me);if(le.$$typeof===O)return Vt(J,W,Rl(J,le),Me);Ul(J,le)}return typeof le=="string"&&le!==""||typeof le=="number"||typeof le=="bigint"?(le=""+le,W!==null&&W.tag===6?(a(J,W.sibling),Me=u(W,le),Me.return=J,J=Me):(a(J,W),Me=Pu(le,J.mode,Me),Me.return=J,J=Me),v(J)):a(J,W)}return function(J,W,le,Me){try{fo=0;var Je=Vt(J,W,le,Me);return sr=null,Je}catch(je){if(je===ar||je===wl)throw je;var Rt=ai(29,je,null,J.mode);return Rt.lanes=Me,Rt.return=J,Rt}}}var Es=lm(!0),cm=lm(!1),Ia=!1;function ju(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Zu(t,n){t=t.updateQueue,n.updateQueue===t&&(n.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,callbacks:null})}function za(t){return{lane:t,tag:0,payload:null,callback:null,next:null}}function Ba(t,n,a){var o=t.updateQueue;if(o===null)return null;if(o=o.shared,(Ut&2)!==0){var u=o.pending;return u===null?n.next=n:(n.next=u.next,u.next=n),o.pending=n,n=El(t),Yp(t,null,a),n}return yl(t,o,n,a),El(t)}function po(t,n,a){if(n=n.updateQueue,n!==null&&(n=n.shared,(a&4194048)!==0)){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,Xn(t,a)}}function Ku(t,n){var a=t.updateQueue,o=t.alternate;if(o!==null&&(o=o.updateQueue,a===o)){var u=null,f=null;if(a=a.firstBaseUpdate,a!==null){do{var v={lane:a.lane,tag:a.tag,payload:a.payload,callback:null,next:null};f===null?u=f=v:f=f.next=v,a=a.next}while(a!==null);f===null?u=f=n:f=f.next=n}else u=f=n;a={baseState:o.baseState,firstBaseUpdate:u,lastBaseUpdate:f,shared:o.shared,callbacks:o.callbacks},t.updateQueue=a;return}t=a.lastBaseUpdate,t===null?a.firstBaseUpdate=n:t.next=n,a.lastBaseUpdate=n}var Qu=!1;function mo(){if(Qu){var t=ir;if(t!==null)throw t}}function go(t,n,a,o){Qu=!1;var u=t.updateQueue;Ia=!1;var f=u.firstBaseUpdate,v=u.lastBaseUpdate,R=u.shared.pending;if(R!==null){u.shared.pending=null;var G=R,ce=G.next;G.next=null,v===null?f=ce:v.next=ce,v=G;var xe=t.alternate;xe!==null&&(xe=xe.updateQueue,R=xe.lastBaseUpdate,R!==v&&(R===null?xe.firstBaseUpdate=ce:R.next=ce,xe.lastBaseUpdate=G))}if(f!==null){var Ee=u.baseState;v=0,xe=ce=G=null,R=f;do{var de=R.lane&-536870913,pe=de!==R.lane;if(pe?(xt&de)===de:(o&de)===de){de!==0&&de===nr&&(Qu=!0),xe!==null&&(xe=xe.next={lane:0,tag:R.tag,payload:R.payload,callback:null,next:null});e:{var qe=t,et=R;de=n;var Vt=a;switch(et.tag){case 1:if(qe=et.payload,typeof qe=="function"){Ee=qe.call(Vt,Ee,de);break e}Ee=qe;break e;case 3:qe.flags=qe.flags&-65537|128;case 0:if(qe=et.payload,de=typeof qe=="function"?qe.call(Vt,Ee,de):qe,de==null)break e;Ee=S({},Ee,de);break e;case 2:Ia=!0}}de=R.callback,de!==null&&(t.flags|=64,pe&&(t.flags|=8192),pe=u.callbacks,pe===null?u.callbacks=[de]:pe.push(de))}else pe={lane:de,tag:R.tag,payload:R.payload,callback:R.callback,next:null},xe===null?(ce=xe=pe,G=Ee):xe=xe.next=pe,v|=de;if(R=R.next,R===null){if(R=u.shared.pending,R===null)break;pe=R,R=pe.next,pe.next=null,u.lastBaseUpdate=pe,u.shared.pending=null}}while(!0);xe===null&&(G=Ee),u.baseState=G,u.firstBaseUpdate=ce,u.lastBaseUpdate=xe,f===null&&(u.shared.lanes=0),ka|=v,t.lanes=v,t.memoizedState=Ee}}function um(t,n){if(typeof t!="function")throw Error(s(191,t));t.call(n)}function fm(t,n){var a=t.callbacks;if(a!==null)for(t.callbacks=null,t=0;t<a.length;t++)um(a[t],n)}var rr=C(null),Ll=C(0);function dm(t,n){t=ha,ee(Ll,t),ee(rr,n),ha=t|n.baseLanes}function Ju(){ee(Ll,ha),ee(rr,rr.current)}function $u(){ha=Ll.current,Y(rr),Y(Ll)}var si=C(null),Mi=null;function Fa(t){var n=t.alternate;ee(rn,rn.current&1),ee(si,t),Mi===null&&(n===null||rr.current!==null||n.memoizedState!==null)&&(Mi=t)}function ef(t){ee(rn,rn.current),ee(si,t),Mi===null&&(Mi=t)}function hm(t){t.tag===22?(ee(rn,rn.current),ee(si,t),Mi===null&&(Mi=t)):Ha()}function Ha(){ee(rn,rn.current),ee(si,si.current)}function ri(t){Y(si),Mi===t&&(Mi=null),Y(rn)}var rn=C(0);function Ol(t){for(var n=t;n!==null;){if(n.tag===13){var a=n.memoizedState;if(a!==null&&(a=a.dehydrated,a===null||od(a)||ld(a)))return n}else if(n.tag===19&&(n.memoizedProps.revealOrder==="forwards"||n.memoizedProps.revealOrder==="backwards"||n.memoizedProps.revealOrder==="unstable_legacy-backwards"||n.memoizedProps.revealOrder==="together")){if((n.flags&128)!==0)return n}else if(n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return null;n=n.return}n.sibling.return=n.return,n=n.sibling}return null}var sa=0,lt=null,Ht=null,dn=null,Pl=!1,or=!1,Ts=!1,Il=0,_o=0,lr=null,zx=0;function an(){throw Error(s(321))}function tf(t,n){if(n===null)return!1;for(var a=0;a<n.length&&a<t.length;a++)if(!ii(t[a],n[a]))return!1;return!0}function nf(t,n,a,o,u,f){return sa=f,lt=n,n.memoizedState=null,n.updateQueue=null,n.lanes=0,N.H=t===null||t.memoizedState===null?Km:vf,Ts=!1,f=a(o,u),Ts=!1,or&&(f=mm(n,a,o,u)),pm(t),f}function pm(t){N.H=So;var n=Ht!==null&&Ht.next!==null;if(sa=0,dn=Ht=lt=null,Pl=!1,_o=0,lr=null,n)throw Error(s(300));t===null||hn||(t=t.dependencies,t!==null&&Al(t)&&(hn=!0))}function mm(t,n,a,o){lt=t;var u=0;do{if(or&&(lr=null),_o=0,or=!1,25<=u)throw Error(s(301));if(u+=1,dn=Ht=null,t.updateQueue!=null){var f=t.updateQueue;f.lastEffect=null,f.events=null,f.stores=null,f.memoCache!=null&&(f.memoCache.index=0)}N.H=Qm,f=n(a,o)}while(or);return f}function Bx(){var t=N.H,n=t.useState()[0];return n=typeof n.then=="function"?vo(n):n,t=t.useState()[0],(Ht!==null?Ht.memoizedState:null)!==t&&(lt.flags|=1024),n}function af(){var t=Il!==0;return Il=0,t}function sf(t,n,a){n.updateQueue=t.updateQueue,n.flags&=-2053,t.lanes&=~a}function rf(t){if(Pl){for(t=t.memoizedState;t!==null;){var n=t.queue;n!==null&&(n.pending=null),t=t.next}Pl=!1}sa=0,dn=Ht=lt=null,or=!1,_o=Il=0,lr=null}function Fn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return dn===null?lt.memoizedState=dn=t:dn=dn.next=t,dn}function on(){if(Ht===null){var t=lt.alternate;t=t!==null?t.memoizedState:null}else t=Ht.next;var n=dn===null?lt.memoizedState:dn.next;if(n!==null)dn=n,Ht=t;else{if(t===null)throw lt.alternate===null?Error(s(467)):Error(s(310));Ht=t,t={memoizedState:Ht.memoizedState,baseState:Ht.baseState,baseQueue:Ht.baseQueue,queue:Ht.queue,next:null},dn===null?lt.memoizedState=dn=t:dn=dn.next=t}return dn}function zl(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function vo(t){var n=_o;return _o+=1,lr===null&&(lr=[]),t=sm(lr,t,n),n=lt,(dn===null?n.memoizedState:dn.next)===null&&(n=n.alternate,N.H=n===null||n.memoizedState===null?Km:vf),t}function Bl(t){if(t!==null&&typeof t=="object"){if(typeof t.then=="function")return vo(t);if(t.$$typeof===O)return Cn(t)}throw Error(s(438,String(t)))}function of(t){var n=null,a=lt.updateQueue;if(a!==null&&(n=a.memoCache),n==null){var o=lt.alternate;o!==null&&(o=o.updateQueue,o!==null&&(o=o.memoCache,o!=null&&(n={data:o.data.map(function(u){return u.slice()}),index:0})))}if(n==null&&(n={data:[],index:0}),a===null&&(a=zl(),lt.updateQueue=a),a.memoCache=n,a=n.data[n.index],a===void 0)for(a=n.data[n.index]=Array(t),o=0;o<t;o++)a[o]=X;return n.index++,a}function ra(t,n){return typeof n=="function"?n(t):n}function Fl(t){var n=on();return lf(n,Ht,t)}function lf(t,n,a){var o=t.queue;if(o===null)throw Error(s(311));o.lastRenderedReducer=a;var u=t.baseQueue,f=o.pending;if(f!==null){if(u!==null){var v=u.next;u.next=f.next,f.next=v}n.baseQueue=u=f,o.pending=null}if(f=t.baseState,u===null)t.memoizedState=f;else{n=u.next;var R=v=null,G=null,ce=n,xe=!1;do{var Ee=ce.lane&-536870913;if(Ee!==ce.lane?(xt&Ee)===Ee:(sa&Ee)===Ee){var de=ce.revertLane;if(de===0)G!==null&&(G=G.next={lane:0,revertLane:0,gesture:null,action:ce.action,hasEagerState:ce.hasEagerState,eagerState:ce.eagerState,next:null}),Ee===nr&&(xe=!0);else if((sa&de)===de){ce=ce.next,de===nr&&(xe=!0);continue}else Ee={lane:0,revertLane:ce.revertLane,gesture:null,action:ce.action,hasEagerState:ce.hasEagerState,eagerState:ce.eagerState,next:null},G===null?(R=G=Ee,v=f):G=G.next=Ee,lt.lanes|=de,ka|=de;Ee=ce.action,Ts&&a(f,Ee),f=ce.hasEagerState?ce.eagerState:a(f,Ee)}else de={lane:Ee,revertLane:ce.revertLane,gesture:ce.gesture,action:ce.action,hasEagerState:ce.hasEagerState,eagerState:ce.eagerState,next:null},G===null?(R=G=de,v=f):G=G.next=de,lt.lanes|=Ee,ka|=Ee;ce=ce.next}while(ce!==null&&ce!==n);if(G===null?v=f:G.next=R,!ii(f,t.memoizedState)&&(hn=!0,xe&&(a=ir,a!==null)))throw a;t.memoizedState=f,t.baseState=v,t.baseQueue=G,o.lastRenderedState=f}return u===null&&(o.lanes=0),[t.memoizedState,o.dispatch]}function cf(t){var n=on(),a=n.queue;if(a===null)throw Error(s(311));a.lastRenderedReducer=t;var o=a.dispatch,u=a.pending,f=n.memoizedState;if(u!==null){a.pending=null;var v=u=u.next;do f=t(f,v.action),v=v.next;while(v!==u);ii(f,n.memoizedState)||(hn=!0),n.memoizedState=f,n.baseQueue===null&&(n.baseState=f),a.lastRenderedState=f}return[f,o]}function gm(t,n,a){var o=lt,u=on(),f=yt;if(f){if(a===void 0)throw Error(s(407));a=a()}else a=n();var v=!ii((Ht||u).memoizedState,a);if(v&&(u.memoizedState=a,hn=!0),u=u.queue,df(xm.bind(null,o,u,t),[t]),u.getSnapshot!==n||v||dn!==null&&dn.memoizedState.tag&1){if(o.flags|=2048,cr(9,{destroy:void 0},vm.bind(null,o,u,a,n),null),Yt===null)throw Error(s(349));f||(sa&127)!==0||_m(o,n,a)}return a}function _m(t,n,a){t.flags|=16384,t={getSnapshot:n,value:a},n=lt.updateQueue,n===null?(n=zl(),lt.updateQueue=n,n.stores=[t]):(a=n.stores,a===null?n.stores=[t]:a.push(t))}function vm(t,n,a,o){n.value=a,n.getSnapshot=o,Sm(n)&&Mm(t)}function xm(t,n,a){return a(function(){Sm(n)&&Mm(t)})}function Sm(t){var n=t.getSnapshot;t=t.value;try{var a=n();return!ii(t,a)}catch{return!0}}function Mm(t){var n=ms(t,2);n!==null&&Qn(n,t,2)}function uf(t){var n=Fn();if(typeof t=="function"){var a=t;if(t=a(),Ts){Re(!0);try{a()}finally{Re(!1)}}}return n.memoizedState=n.baseState=t,n.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:t},n}function ym(t,n,a,o){return t.baseState=a,lf(t,Ht,typeof o=="function"?o:ra)}function Fx(t,n,a,o,u){if(Vl(t))throw Error(s(485));if(t=n.action,t!==null){var f={payload:u,action:t,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(v){f.listeners.push(v)}};N.T!==null?a(!0):f.isTransition=!1,o(f),a=n.pending,a===null?(f.next=n.pending=f,Em(n,f)):(f.next=a.next,n.pending=a.next=f)}}function Em(t,n){var a=n.action,o=n.payload,u=t.state;if(n.isTransition){var f=N.T,v={};N.T=v;try{var R=a(u,o),G=N.S;G!==null&&G(v,R),Tm(t,n,R)}catch(ce){ff(t,n,ce)}finally{f!==null&&v.types!==null&&(f.types=v.types),N.T=f}}else try{f=a(u,o),Tm(t,n,f)}catch(ce){ff(t,n,ce)}}function Tm(t,n,a){a!==null&&typeof a=="object"&&typeof a.then=="function"?a.then(function(o){bm(t,n,o)},function(o){return ff(t,n,o)}):bm(t,n,a)}function bm(t,n,a){n.status="fulfilled",n.value=a,Am(n),t.state=a,n=t.pending,n!==null&&(a=n.next,a===n?t.pending=null:(a=a.next,n.next=a,Em(t,a)))}function ff(t,n,a){var o=t.pending;if(t.pending=null,o!==null){o=o.next;do n.status="rejected",n.reason=a,Am(n),n=n.next;while(n!==o)}t.action=null}function Am(t){t=t.listeners;for(var n=0;n<t.length;n++)(0,t[n])()}function Rm(t,n){return n}function Cm(t,n){if(yt){var a=Yt.formState;if(a!==null){e:{var o=lt;if(yt){if(jt){t:{for(var u=jt,f=Si;u.nodeType!==8;){if(!f){u=null;break t}if(u=yi(u.nextSibling),u===null){u=null;break t}}f=u.data,u=f==="F!"||f==="F"?u:null}if(u){jt=yi(u.nextSibling),o=u.data==="F!";break e}}Oa(o)}o=!1}o&&(n=a[0])}}return a=Fn(),a.memoizedState=a.baseState=n,o={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Rm,lastRenderedState:n},a.queue=o,a=qm.bind(null,lt,o),o.dispatch=a,o=uf(!1),f=_f.bind(null,lt,!1,o.queue),o=Fn(),u={state:n,dispatch:null,action:t,pending:null},o.queue=u,a=Fx.bind(null,lt,u,f,a),u.dispatch=a,o.memoizedState=t,[n,a,!1]}function wm(t){var n=on();return Dm(n,Ht,t)}function Dm(t,n,a){if(n=lf(t,n,Rm)[0],t=Fl(ra)[0],typeof n=="object"&&n!==null&&typeof n.then=="function")try{var o=vo(n)}catch(v){throw v===ar?wl:v}else o=n;n=on();var u=n.queue,f=u.dispatch;return a!==n.memoizedState&&(lt.flags|=2048,cr(9,{destroy:void 0},Hx.bind(null,u,a),null)),[o,f,t]}function Hx(t,n){t.action=n}function Nm(t){var n=on(),a=Ht;if(a!==null)return Dm(n,a,t);on(),n=n.memoizedState,a=on();var o=a.queue.dispatch;return a.memoizedState=t,[n,o,!1]}function cr(t,n,a,o){return t={tag:t,create:a,deps:o,inst:n,next:null},n=lt.updateQueue,n===null&&(n=zl(),lt.updateQueue=n),a=n.lastEffect,a===null?n.lastEffect=t.next=t:(o=a.next,a.next=t,t.next=o,n.lastEffect=t),t}function Um(){return on().memoizedState}function Hl(t,n,a,o){var u=Fn();lt.flags|=t,u.memoizedState=cr(1|n,{destroy:void 0},a,o===void 0?null:o)}function Gl(t,n,a,o){var u=on();o=o===void 0?null:o;var f=u.memoizedState.inst;Ht!==null&&o!==null&&tf(o,Ht.memoizedState.deps)?u.memoizedState=cr(n,f,a,o):(lt.flags|=t,u.memoizedState=cr(1|n,f,a,o))}function Lm(t,n){Hl(8390656,8,t,n)}function df(t,n){Gl(2048,8,t,n)}function Gx(t){lt.flags|=4;var n=lt.updateQueue;if(n===null)n=zl(),lt.updateQueue=n,n.events=[t];else{var a=n.events;a===null?n.events=[t]:a.push(t)}}function Om(t){var n=on().memoizedState;return Gx({ref:n,nextImpl:t}),function(){if((Ut&2)!==0)throw Error(s(440));return n.impl.apply(void 0,arguments)}}function Pm(t,n){return Gl(4,2,t,n)}function Im(t,n){return Gl(4,4,t,n)}function zm(t,n){if(typeof n=="function"){t=t();var a=n(t);return function(){typeof a=="function"?a():n(null)}}if(n!=null)return t=t(),n.current=t,function(){n.current=null}}function Bm(t,n,a){a=a!=null?a.concat([t]):null,Gl(4,4,zm.bind(null,n,t),a)}function hf(){}function Fm(t,n){var a=on();n=n===void 0?null:n;var o=a.memoizedState;return n!==null&&tf(n,o[1])?o[0]:(a.memoizedState=[t,n],t)}function Hm(t,n){var a=on();n=n===void 0?null:n;var o=a.memoizedState;if(n!==null&&tf(n,o[1]))return o[0];if(o=t(),Ts){Re(!0);try{t()}finally{Re(!1)}}return a.memoizedState=[o,n],o}function pf(t,n,a){return a===void 0||(sa&1073741824)!==0&&(xt&261930)===0?t.memoizedState=n:(t.memoizedState=a,t=G0(),lt.lanes|=t,ka|=t,a)}function Gm(t,n,a,o){return ii(a,n)?a:rr.current!==null?(t=pf(t,a,o),ii(t,n)||(hn=!0),t):(sa&42)===0||(sa&1073741824)!==0&&(xt&261930)===0?(hn=!0,t.memoizedState=a):(t=G0(),lt.lanes|=t,ka|=t,n)}function Vm(t,n,a,o,u){var f=V.p;V.p=f!==0&&8>f?f:8;var v=N.T,R={};N.T=R,_f(t,!1,n,a);try{var G=u(),ce=N.S;if(ce!==null&&ce(R,G),G!==null&&typeof G=="object"&&typeof G.then=="function"){var xe=Ix(G,o);xo(t,n,xe,ci(t))}else xo(t,n,o,ci(t))}catch(Ee){xo(t,n,{then:function(){},status:"rejected",reason:Ee},ci())}finally{V.p=f,v!==null&&R.types!==null&&(v.types=R.types),N.T=v}}function Vx(){}function mf(t,n,a,o){if(t.tag!==5)throw Error(s(476));var u=km(t).queue;Vm(t,u,n,fe,a===null?Vx:function(){return Xm(t),a(o)})}function km(t){var n=t.memoizedState;if(n!==null)return n;n={memoizedState:fe,baseState:fe,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:fe},next:null};var a={};return n.next={memoizedState:a,baseState:a,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:ra,lastRenderedState:a},next:null},t.memoizedState=n,t=t.alternate,t!==null&&(t.memoizedState=n),n}function Xm(t){var n=km(t);n.next===null&&(n=t.alternate.memoizedState),xo(t,n.next.queue,{},ci())}function gf(){return Cn(Io)}function Wm(){return on().memoizedState}function Ym(){return on().memoizedState}function kx(t){for(var n=t.return;n!==null;){switch(n.tag){case 24:case 3:var a=ci();t=za(a);var o=Ba(n,t,a);o!==null&&(Qn(o,n,a),po(o,n,a)),n={cache:Xu()},t.payload=n;return}n=n.return}}function Xx(t,n,a){var o=ci();a={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null},Vl(t)?jm(n,a):(a=Lu(t,n,a,o),a!==null&&(Qn(a,t,o),Zm(a,n,o)))}function qm(t,n,a){var o=ci();xo(t,n,a,o)}function xo(t,n,a,o){var u={lane:o,revertLane:0,gesture:null,action:a,hasEagerState:!1,eagerState:null,next:null};if(Vl(t))jm(n,u);else{var f=t.alternate;if(t.lanes===0&&(f===null||f.lanes===0)&&(f=n.lastRenderedReducer,f!==null))try{var v=n.lastRenderedState,R=f(v,a);if(u.hasEagerState=!0,u.eagerState=R,ii(R,v))return yl(t,n,u,0),Yt===null&&Ml(),!1}catch{}if(a=Lu(t,n,u,o),a!==null)return Qn(a,t,o),Zm(a,n,o),!0}return!1}function _f(t,n,a,o){if(o={lane:2,revertLane:Zf(),gesture:null,action:o,hasEagerState:!1,eagerState:null,next:null},Vl(t)){if(n)throw Error(s(479))}else n=Lu(t,a,o,2),n!==null&&Qn(n,t,2)}function Vl(t){var n=t.alternate;return t===lt||n!==null&&n===lt}function jm(t,n){or=Pl=!0;var a=t.pending;a===null?n.next=n:(n.next=a.next,a.next=n),t.pending=n}function Zm(t,n,a){if((a&4194048)!==0){var o=n.lanes;o&=t.pendingLanes,a|=o,n.lanes=a,Xn(t,a)}}var So={readContext:Cn,use:Bl,useCallback:an,useContext:an,useEffect:an,useImperativeHandle:an,useLayoutEffect:an,useInsertionEffect:an,useMemo:an,useReducer:an,useRef:an,useState:an,useDebugValue:an,useDeferredValue:an,useTransition:an,useSyncExternalStore:an,useId:an,useHostTransitionStatus:an,useFormState:an,useActionState:an,useOptimistic:an,useMemoCache:an,useCacheRefresh:an};So.useEffectEvent=an;var Km={readContext:Cn,use:Bl,useCallback:function(t,n){return Fn().memoizedState=[t,n===void 0?null:n],t},useContext:Cn,useEffect:Lm,useImperativeHandle:function(t,n,a){a=a!=null?a.concat([t]):null,Hl(4194308,4,zm.bind(null,n,t),a)},useLayoutEffect:function(t,n){return Hl(4194308,4,t,n)},useInsertionEffect:function(t,n){Hl(4,2,t,n)},useMemo:function(t,n){var a=Fn();n=n===void 0?null:n;var o=t();if(Ts){Re(!0);try{t()}finally{Re(!1)}}return a.memoizedState=[o,n],o},useReducer:function(t,n,a){var o=Fn();if(a!==void 0){var u=a(n);if(Ts){Re(!0);try{a(n)}finally{Re(!1)}}}else u=n;return o.memoizedState=o.baseState=u,t={pending:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:u},o.queue=t,t=t.dispatch=Xx.bind(null,lt,t),[o.memoizedState,t]},useRef:function(t){var n=Fn();return t={current:t},n.memoizedState=t},useState:function(t){t=uf(t);var n=t.queue,a=qm.bind(null,lt,n);return n.dispatch=a,[t.memoizedState,a]},useDebugValue:hf,useDeferredValue:function(t,n){var a=Fn();return pf(a,t,n)},useTransition:function(){var t=uf(!1);return t=Vm.bind(null,lt,t.queue,!0,!1),Fn().memoizedState=t,[!1,t]},useSyncExternalStore:function(t,n,a){var o=lt,u=Fn();if(yt){if(a===void 0)throw Error(s(407));a=a()}else{if(a=n(),Yt===null)throw Error(s(349));(xt&127)!==0||_m(o,n,a)}u.memoizedState=a;var f={value:a,getSnapshot:n};return u.queue=f,Lm(xm.bind(null,o,f,t),[t]),o.flags|=2048,cr(9,{destroy:void 0},vm.bind(null,o,f,a,n),null),a},useId:function(){var t=Fn(),n=Yt.identifierPrefix;if(yt){var a=Gi,o=Hi;a=(o&~(1<<32-Ve(o)-1)).toString(32)+a,n="_"+n+"R_"+a,a=Il++,0<a&&(n+="H"+a.toString(32)),n+="_"}else a=zx++,n="_"+n+"r_"+a.toString(32)+"_";return t.memoizedState=n},useHostTransitionStatus:gf,useFormState:Cm,useActionState:Cm,useOptimistic:function(t){var n=Fn();n.memoizedState=n.baseState=t;var a={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return n.queue=a,n=_f.bind(null,lt,!0,a),a.dispatch=n,[t,n]},useMemoCache:of,useCacheRefresh:function(){return Fn().memoizedState=kx.bind(null,lt)},useEffectEvent:function(t){var n=Fn(),a={impl:t};return n.memoizedState=a,function(){if((Ut&2)!==0)throw Error(s(440));return a.impl.apply(void 0,arguments)}}},vf={readContext:Cn,use:Bl,useCallback:Fm,useContext:Cn,useEffect:df,useImperativeHandle:Bm,useInsertionEffect:Pm,useLayoutEffect:Im,useMemo:Hm,useReducer:Fl,useRef:Um,useState:function(){return Fl(ra)},useDebugValue:hf,useDeferredValue:function(t,n){var a=on();return Gm(a,Ht.memoizedState,t,n)},useTransition:function(){var t=Fl(ra)[0],n=on().memoizedState;return[typeof t=="boolean"?t:vo(t),n]},useSyncExternalStore:gm,useId:Wm,useHostTransitionStatus:gf,useFormState:wm,useActionState:wm,useOptimistic:function(t,n){var a=on();return ym(a,Ht,t,n)},useMemoCache:of,useCacheRefresh:Ym};vf.useEffectEvent=Om;var Qm={readContext:Cn,use:Bl,useCallback:Fm,useContext:Cn,useEffect:df,useImperativeHandle:Bm,useInsertionEffect:Pm,useLayoutEffect:Im,useMemo:Hm,useReducer:cf,useRef:Um,useState:function(){return cf(ra)},useDebugValue:hf,useDeferredValue:function(t,n){var a=on();return Ht===null?pf(a,t,n):Gm(a,Ht.memoizedState,t,n)},useTransition:function(){var t=cf(ra)[0],n=on().memoizedState;return[typeof t=="boolean"?t:vo(t),n]},useSyncExternalStore:gm,useId:Wm,useHostTransitionStatus:gf,useFormState:Nm,useActionState:Nm,useOptimistic:function(t,n){var a=on();return Ht!==null?ym(a,Ht,t,n):(a.baseState=t,[t,a.queue.dispatch])},useMemoCache:of,useCacheRefresh:Ym};Qm.useEffectEvent=Om;function xf(t,n,a,o){n=t.memoizedState,a=a(o,n),a=a==null?n:S({},n,a),t.memoizedState=a,t.lanes===0&&(t.updateQueue.baseState=a)}var Sf={enqueueSetState:function(t,n,a){t=t._reactInternals;var o=ci(),u=za(o);u.payload=n,a!=null&&(u.callback=a),n=Ba(t,u,o),n!==null&&(Qn(n,t,o),po(n,t,o))},enqueueReplaceState:function(t,n,a){t=t._reactInternals;var o=ci(),u=za(o);u.tag=1,u.payload=n,a!=null&&(u.callback=a),n=Ba(t,u,o),n!==null&&(Qn(n,t,o),po(n,t,o))},enqueueForceUpdate:function(t,n){t=t._reactInternals;var a=ci(),o=za(a);o.tag=2,n!=null&&(o.callback=n),n=Ba(t,o,a),n!==null&&(Qn(n,t,a),po(n,t,a))}};function Jm(t,n,a,o,u,f,v){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(o,f,v):n.prototype&&n.prototype.isPureReactComponent?!so(a,o)||!so(u,f):!0}function $m(t,n,a,o){t=n.state,typeof n.componentWillReceiveProps=="function"&&n.componentWillReceiveProps(a,o),typeof n.UNSAFE_componentWillReceiveProps=="function"&&n.UNSAFE_componentWillReceiveProps(a,o),n.state!==t&&Sf.enqueueReplaceState(n,n.state,null)}function bs(t,n){var a=n;if("ref"in n){a={};for(var o in n)o!=="ref"&&(a[o]=n[o])}if(t=t.defaultProps){a===n&&(a=S({},a));for(var u in t)a[u]===void 0&&(a[u]=t[u])}return a}function e0(t){Sl(t)}function t0(t){console.error(t)}function n0(t){Sl(t)}function kl(t,n){try{var a=t.onUncaughtError;a(n.value,{componentStack:n.stack})}catch(o){setTimeout(function(){throw o})}}function i0(t,n,a){try{var o=t.onCaughtError;o(a.value,{componentStack:a.stack,errorBoundary:n.tag===1?n.stateNode:null})}catch(u){setTimeout(function(){throw u})}}function Mf(t,n,a){return a=za(a),a.tag=3,a.payload={element:null},a.callback=function(){kl(t,n)},a}function a0(t){return t=za(t),t.tag=3,t}function s0(t,n,a,o){var u=a.type.getDerivedStateFromError;if(typeof u=="function"){var f=o.value;t.payload=function(){return u(f)},t.callback=function(){i0(n,a,o)}}var v=a.stateNode;v!==null&&typeof v.componentDidCatch=="function"&&(t.callback=function(){i0(n,a,o),typeof u!="function"&&(Xa===null?Xa=new Set([this]):Xa.add(this));var R=o.stack;this.componentDidCatch(o.value,{componentStack:R!==null?R:""})})}function Wx(t,n,a,o,u){if(a.flags|=32768,o!==null&&typeof o=="object"&&typeof o.then=="function"){if(n=a.alternate,n!==null&&tr(n,a,u,!0),a=si.current,a!==null){switch(a.tag){case 31:case 13:return Mi===null?tc():a.alternate===null&&sn===0&&(sn=3),a.flags&=-257,a.flags|=65536,a.lanes=u,o===Dl?a.flags|=16384:(n=a.updateQueue,n===null?a.updateQueue=new Set([o]):n.add(o),Yf(t,o,u)),!1;case 22:return a.flags|=65536,o===Dl?a.flags|=16384:(n=a.updateQueue,n===null?(n={transitions:null,markerInstances:null,retryQueue:new Set([o])},a.updateQueue=n):(a=n.retryQueue,a===null?n.retryQueue=new Set([o]):a.add(o)),Yf(t,o,u)),!1}throw Error(s(435,a.tag))}return Yf(t,o,u),tc(),!1}if(yt)return n=si.current,n!==null?((n.flags&65536)===0&&(n.flags|=256),n.flags|=65536,n.lanes=u,o!==Fu&&(t=Error(s(422),{cause:o}),lo(_i(t,a)))):(o!==Fu&&(n=Error(s(423),{cause:o}),lo(_i(n,a))),t=t.current.alternate,t.flags|=65536,u&=-u,t.lanes|=u,o=_i(o,a),u=Mf(t.stateNode,o,u),Ku(t,u),sn!==4&&(sn=2)),!1;var f=Error(s(520),{cause:o});if(f=_i(f,a),Co===null?Co=[f]:Co.push(f),sn!==4&&(sn=2),n===null)return!0;o=_i(o,a),a=n;do{switch(a.tag){case 3:return a.flags|=65536,t=u&-u,a.lanes|=t,t=Mf(a.stateNode,o,t),Ku(a,t),!1;case 1:if(n=a.type,f=a.stateNode,(a.flags&128)===0&&(typeof n.getDerivedStateFromError=="function"||f!==null&&typeof f.componentDidCatch=="function"&&(Xa===null||!Xa.has(f))))return a.flags|=65536,u&=-u,a.lanes|=u,u=a0(u),s0(u,t,a,o),Ku(a,u),!1}a=a.return}while(a!==null);return!1}var yf=Error(s(461)),hn=!1;function wn(t,n,a,o){n.child=t===null?cm(n,null,a,o):Es(n,t.child,a,o)}function r0(t,n,a,o,u){a=a.render;var f=n.ref;if("ref"in o){var v={};for(var R in o)R!=="ref"&&(v[R]=o[R])}else v=o;return xs(n),o=nf(t,n,a,v,f,u),R=af(),t!==null&&!hn?(sf(t,n,u),oa(t,n,u)):(yt&&R&&zu(n),n.flags|=1,wn(t,n,o,u),n.child)}function o0(t,n,a,o,u){if(t===null){var f=a.type;return typeof f=="function"&&!Ou(f)&&f.defaultProps===void 0&&a.compare===null?(n.tag=15,n.type=f,l0(t,n,f,o,u)):(t=Tl(a.type,null,o,n,n.mode,u),t.ref=n.ref,t.return=n,n.child=t)}if(f=t.child,!Df(t,u)){var v=f.memoizedProps;if(a=a.compare,a=a!==null?a:so,a(v,o)&&t.ref===n.ref)return oa(t,n,u)}return n.flags|=1,t=ta(f,o),t.ref=n.ref,t.return=n,n.child=t}function l0(t,n,a,o,u){if(t!==null){var f=t.memoizedProps;if(so(f,o)&&t.ref===n.ref)if(hn=!1,n.pendingProps=o=f,Df(t,u))(t.flags&131072)!==0&&(hn=!0);else return n.lanes=t.lanes,oa(t,n,u)}return Ef(t,n,a,o,u)}function c0(t,n,a,o){var u=o.children,f=t!==null?t.memoizedState:null;if(t===null&&n.stateNode===null&&(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),o.mode==="hidden"){if((n.flags&128)!==0){if(f=f!==null?f.baseLanes|a:a,t!==null){for(o=n.child=t.child,u=0;o!==null;)u=u|o.lanes|o.childLanes,o=o.sibling;o=u&~f}else o=0,n.child=null;return u0(t,n,f,a,o)}if((a&536870912)!==0)n.memoizedState={baseLanes:0,cachePool:null},t!==null&&Cl(n,f!==null?f.cachePool:null),f!==null?dm(n,f):Ju(),hm(n);else return o=n.lanes=536870912,u0(t,n,f!==null?f.baseLanes|a:a,a,o)}else f!==null?(Cl(n,f.cachePool),dm(n,f),Ha(),n.memoizedState=null):(t!==null&&Cl(n,null),Ju(),Ha());return wn(t,n,u,a),n.child}function Mo(t,n){return t!==null&&t.tag===22||n.stateNode!==null||(n.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),n.sibling}function u0(t,n,a,o,u){var f=Yu();return f=f===null?null:{parent:fn._currentValue,pool:f},n.memoizedState={baseLanes:a,cachePool:f},t!==null&&Cl(n,null),Ju(),hm(n),t!==null&&tr(t,n,o,!0),n.childLanes=u,null}function Xl(t,n){return n=Yl({mode:n.mode,children:n.children},t.mode),n.ref=t.ref,t.child=n,n.return=t,n}function f0(t,n,a){return Es(n,t.child,null,a),t=Xl(n,n.pendingProps),t.flags|=2,ri(n),n.memoizedState=null,t}function Yx(t,n,a){var o=n.pendingProps,u=(n.flags&128)!==0;if(n.flags&=-129,t===null){if(yt){if(o.mode==="hidden")return t=Xl(n,o),n.lanes=536870912,Mo(null,t);if(ef(n),(t=jt)?(t=Eg(t,Si),t=t!==null&&t.data==="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Ua!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},a=jp(t),a.return=n,n.child=a,Rn=n,jt=null)):t=null,t===null)throw Oa(n);return n.lanes=536870912,null}return Xl(n,o)}var f=t.memoizedState;if(f!==null){var v=f.dehydrated;if(ef(n),u)if(n.flags&256)n.flags&=-257,n=f0(t,n,a);else if(n.memoizedState!==null)n.child=t.child,n.flags|=128,n=null;else throw Error(s(558));else if(hn||tr(t,n,a,!1),u=(a&t.childLanes)!==0,hn||u){if(o=Yt,o!==null&&(v=ti(o,a),v!==0&&v!==f.retryLane))throw f.retryLane=v,ms(t,v),Qn(o,t,v),yf;tc(),n=f0(t,n,a)}else t=f.treeContext,jt=yi(v.nextSibling),Rn=n,yt=!0,La=null,Si=!1,t!==null&&Qp(n,t),n=Xl(n,o),n.flags|=4096;return n}return t=ta(t.child,{mode:o.mode,children:o.children}),t.ref=n.ref,n.child=t,t.return=n,t}function Wl(t,n){var a=n.ref;if(a===null)t!==null&&t.ref!==null&&(n.flags|=4194816);else{if(typeof a!="function"&&typeof a!="object")throw Error(s(284));(t===null||t.ref!==a)&&(n.flags|=4194816)}}function Ef(t,n,a,o,u){return xs(n),a=nf(t,n,a,o,void 0,u),o=af(),t!==null&&!hn?(sf(t,n,u),oa(t,n,u)):(yt&&o&&zu(n),n.flags|=1,wn(t,n,a,u),n.child)}function d0(t,n,a,o,u,f){return xs(n),n.updateQueue=null,a=mm(n,o,a,u),pm(t),o=af(),t!==null&&!hn?(sf(t,n,f),oa(t,n,f)):(yt&&o&&zu(n),n.flags|=1,wn(t,n,a,f),n.child)}function h0(t,n,a,o,u){if(xs(n),n.stateNode===null){var f=Qs,v=a.contextType;typeof v=="object"&&v!==null&&(f=Cn(v)),f=new a(o,f),n.memoizedState=f.state!==null&&f.state!==void 0?f.state:null,f.updater=Sf,n.stateNode=f,f._reactInternals=n,f=n.stateNode,f.props=o,f.state=n.memoizedState,f.refs={},ju(n),v=a.contextType,f.context=typeof v=="object"&&v!==null?Cn(v):Qs,f.state=n.memoizedState,v=a.getDerivedStateFromProps,typeof v=="function"&&(xf(n,a,v,o),f.state=n.memoizedState),typeof a.getDerivedStateFromProps=="function"||typeof f.getSnapshotBeforeUpdate=="function"||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(v=f.state,typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount(),v!==f.state&&Sf.enqueueReplaceState(f,f.state,null),go(n,o,f,u),mo(),f.state=n.memoizedState),typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!0}else if(t===null){f=n.stateNode;var R=n.memoizedProps,G=bs(a,R);f.props=G;var ce=f.context,xe=a.contextType;v=Qs,typeof xe=="object"&&xe!==null&&(v=Cn(xe));var Ee=a.getDerivedStateFromProps;xe=typeof Ee=="function"||typeof f.getSnapshotBeforeUpdate=="function",R=n.pendingProps!==R,xe||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(R||ce!==v)&&$m(n,f,o,v),Ia=!1;var de=n.memoizedState;f.state=de,go(n,o,f,u),mo(),ce=n.memoizedState,R||de!==ce||Ia?(typeof Ee=="function"&&(xf(n,a,Ee,o),ce=n.memoizedState),(G=Ia||Jm(n,a,G,o,de,ce,v))?(xe||typeof f.UNSAFE_componentWillMount!="function"&&typeof f.componentWillMount!="function"||(typeof f.componentWillMount=="function"&&f.componentWillMount(),typeof f.UNSAFE_componentWillMount=="function"&&f.UNSAFE_componentWillMount()),typeof f.componentDidMount=="function"&&(n.flags|=4194308)):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),n.memoizedProps=o,n.memoizedState=ce),f.props=o,f.state=ce,f.context=v,o=G):(typeof f.componentDidMount=="function"&&(n.flags|=4194308),o=!1)}else{f=n.stateNode,Zu(t,n),v=n.memoizedProps,xe=bs(a,v),f.props=xe,Ee=n.pendingProps,de=f.context,ce=a.contextType,G=Qs,typeof ce=="object"&&ce!==null&&(G=Cn(ce)),R=a.getDerivedStateFromProps,(ce=typeof R=="function"||typeof f.getSnapshotBeforeUpdate=="function")||typeof f.UNSAFE_componentWillReceiveProps!="function"&&typeof f.componentWillReceiveProps!="function"||(v!==Ee||de!==G)&&$m(n,f,o,G),Ia=!1,de=n.memoizedState,f.state=de,go(n,o,f,u),mo();var pe=n.memoizedState;v!==Ee||de!==pe||Ia||t!==null&&t.dependencies!==null&&Al(t.dependencies)?(typeof R=="function"&&(xf(n,a,R,o),pe=n.memoizedState),(xe=Ia||Jm(n,a,xe,o,de,pe,G)||t!==null&&t.dependencies!==null&&Al(t.dependencies))?(ce||typeof f.UNSAFE_componentWillUpdate!="function"&&typeof f.componentWillUpdate!="function"||(typeof f.componentWillUpdate=="function"&&f.componentWillUpdate(o,pe,G),typeof f.UNSAFE_componentWillUpdate=="function"&&f.UNSAFE_componentWillUpdate(o,pe,G)),typeof f.componentDidUpdate=="function"&&(n.flags|=4),typeof f.getSnapshotBeforeUpdate=="function"&&(n.flags|=1024)):(typeof f.componentDidUpdate!="function"||v===t.memoizedProps&&de===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&de===t.memoizedState||(n.flags|=1024),n.memoizedProps=o,n.memoizedState=pe),f.props=o,f.state=pe,f.context=G,o=xe):(typeof f.componentDidUpdate!="function"||v===t.memoizedProps&&de===t.memoizedState||(n.flags|=4),typeof f.getSnapshotBeforeUpdate!="function"||v===t.memoizedProps&&de===t.memoizedState||(n.flags|=1024),o=!1)}return f=o,Wl(t,n),o=(n.flags&128)!==0,f||o?(f=n.stateNode,a=o&&typeof a.getDerivedStateFromError!="function"?null:f.render(),n.flags|=1,t!==null&&o?(n.child=Es(n,t.child,null,u),n.child=Es(n,null,a,u)):wn(t,n,a,u),n.memoizedState=f.state,t=n.child):t=oa(t,n,u),t}function p0(t,n,a,o){return _s(),n.flags|=256,wn(t,n,a,o),n.child}var Tf={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function bf(t){return{baseLanes:t,cachePool:im()}}function Af(t,n,a){return t=t!==null?t.childLanes&~a:0,n&&(t|=li),t}function m0(t,n,a){var o=n.pendingProps,u=!1,f=(n.flags&128)!==0,v;if((v=f)||(v=t!==null&&t.memoizedState===null?!1:(rn.current&2)!==0),v&&(u=!0,n.flags&=-129),v=(n.flags&32)!==0,n.flags&=-33,t===null){if(yt){if(u?Fa(n):Ha(),(t=jt)?(t=Eg(t,Si),t=t!==null&&t.data!=="&"?t:null,t!==null&&(n.memoizedState={dehydrated:t,treeContext:Ua!==null?{id:Hi,overflow:Gi}:null,retryLane:536870912,hydrationErrors:null},a=jp(t),a.return=n,n.child=a,Rn=n,jt=null)):t=null,t===null)throw Oa(n);return ld(t)?n.lanes=32:n.lanes=536870912,null}var R=o.children;return o=o.fallback,u?(Ha(),u=n.mode,R=Yl({mode:"hidden",children:R},u),o=gs(o,u,a,null),R.return=n,o.return=n,R.sibling=o,n.child=R,o=n.child,o.memoizedState=bf(a),o.childLanes=Af(t,v,a),n.memoizedState=Tf,Mo(null,o)):(Fa(n),Rf(n,R))}var G=t.memoizedState;if(G!==null&&(R=G.dehydrated,R!==null)){if(f)n.flags&256?(Fa(n),n.flags&=-257,n=Cf(t,n,a)):n.memoizedState!==null?(Ha(),n.child=t.child,n.flags|=128,n=null):(Ha(),R=o.fallback,u=n.mode,o=Yl({mode:"visible",children:o.children},u),R=gs(R,u,a,null),R.flags|=2,o.return=n,R.return=n,o.sibling=R,n.child=o,Es(n,t.child,null,a),o=n.child,o.memoizedState=bf(a),o.childLanes=Af(t,v,a),n.memoizedState=Tf,n=Mo(null,o));else if(Fa(n),ld(R)){if(v=R.nextSibling&&R.nextSibling.dataset,v)var ce=v.dgst;v=ce,o=Error(s(419)),o.stack="",o.digest=v,lo({value:o,source:null,stack:null}),n=Cf(t,n,a)}else if(hn||tr(t,n,a,!1),v=(a&t.childLanes)!==0,hn||v){if(v=Yt,v!==null&&(o=ti(v,a),o!==0&&o!==G.retryLane))throw G.retryLane=o,ms(t,o),Qn(v,t,o),yf;od(R)||tc(),n=Cf(t,n,a)}else od(R)?(n.flags|=192,n.child=t.child,n=null):(t=G.treeContext,jt=yi(R.nextSibling),Rn=n,yt=!0,La=null,Si=!1,t!==null&&Qp(n,t),n=Rf(n,o.children),n.flags|=4096);return n}return u?(Ha(),R=o.fallback,u=n.mode,G=t.child,ce=G.sibling,o=ta(G,{mode:"hidden",children:o.children}),o.subtreeFlags=G.subtreeFlags&65011712,ce!==null?R=ta(ce,R):(R=gs(R,u,a,null),R.flags|=2),R.return=n,o.return=n,o.sibling=R,n.child=o,Mo(null,o),o=n.child,R=t.child.memoizedState,R===null?R=bf(a):(u=R.cachePool,u!==null?(G=fn._currentValue,u=u.parent!==G?{parent:G,pool:G}:u):u=im(),R={baseLanes:R.baseLanes|a,cachePool:u}),o.memoizedState=R,o.childLanes=Af(t,v,a),n.memoizedState=Tf,Mo(t.child,o)):(Fa(n),a=t.child,t=a.sibling,a=ta(a,{mode:"visible",children:o.children}),a.return=n,a.sibling=null,t!==null&&(v=n.deletions,v===null?(n.deletions=[t],n.flags|=16):v.push(t)),n.child=a,n.memoizedState=null,a)}function Rf(t,n){return n=Yl({mode:"visible",children:n},t.mode),n.return=t,t.child=n}function Yl(t,n){return t=ai(22,t,null,n),t.lanes=0,t}function Cf(t,n,a){return Es(n,t.child,null,a),t=Rf(n,n.pendingProps.children),t.flags|=2,n.memoizedState=null,t}function g0(t,n,a){t.lanes|=n;var o=t.alternate;o!==null&&(o.lanes|=n),Vu(t.return,n,a)}function wf(t,n,a,o,u,f){var v=t.memoizedState;v===null?t.memoizedState={isBackwards:n,rendering:null,renderingStartTime:0,last:o,tail:a,tailMode:u,treeForkCount:f}:(v.isBackwards=n,v.rendering=null,v.renderingStartTime=0,v.last=o,v.tail=a,v.tailMode=u,v.treeForkCount=f)}function _0(t,n,a){var o=n.pendingProps,u=o.revealOrder,f=o.tail;o=o.children;var v=rn.current,R=(v&2)!==0;if(R?(v=v&1|2,n.flags|=128):v&=1,ee(rn,v),wn(t,n,o,a),o=yt?oo:0,!R&&t!==null&&(t.flags&128)!==0)e:for(t=n.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&g0(t,a,n);else if(t.tag===19)g0(t,a,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===n)break e;for(;t.sibling===null;){if(t.return===null||t.return===n)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}switch(u){case"forwards":for(a=n.child,u=null;a!==null;)t=a.alternate,t!==null&&Ol(t)===null&&(u=a),a=a.sibling;a=u,a===null?(u=n.child,n.child=null):(u=a.sibling,a.sibling=null),wf(n,!1,u,a,f,o);break;case"backwards":case"unstable_legacy-backwards":for(a=null,u=n.child,n.child=null;u!==null;){if(t=u.alternate,t!==null&&Ol(t)===null){n.child=u;break}t=u.sibling,u.sibling=a,a=u,u=t}wf(n,!0,a,null,f,o);break;case"together":wf(n,!1,null,null,void 0,o);break;default:n.memoizedState=null}return n.child}function oa(t,n,a){if(t!==null&&(n.dependencies=t.dependencies),ka|=n.lanes,(a&n.childLanes)===0)if(t!==null){if(tr(t,n,a,!1),(a&n.childLanes)===0)return null}else return null;if(t!==null&&n.child!==t.child)throw Error(s(153));if(n.child!==null){for(t=n.child,a=ta(t,t.pendingProps),n.child=a,a.return=n;t.sibling!==null;)t=t.sibling,a=a.sibling=ta(t,t.pendingProps),a.return=n;a.sibling=null}return n.child}function Df(t,n){return(t.lanes&n)!==0?!0:(t=t.dependencies,!!(t!==null&&Al(t)))}function qx(t,n,a){switch(n.tag){case 3:me(n,n.stateNode.containerInfo),Pa(n,fn,t.memoizedState.cache),_s();break;case 27:case 5:$e(n);break;case 4:me(n,n.stateNode.containerInfo);break;case 10:Pa(n,n.type,n.memoizedProps.value);break;case 31:if(n.memoizedState!==null)return n.flags|=128,ef(n),null;break;case 13:var o=n.memoizedState;if(o!==null)return o.dehydrated!==null?(Fa(n),n.flags|=128,null):(a&n.child.childLanes)!==0?m0(t,n,a):(Fa(n),t=oa(t,n,a),t!==null?t.sibling:null);Fa(n);break;case 19:var u=(t.flags&128)!==0;if(o=(a&n.childLanes)!==0,o||(tr(t,n,a,!1),o=(a&n.childLanes)!==0),u){if(o)return _0(t,n,a);n.flags|=128}if(u=n.memoizedState,u!==null&&(u.rendering=null,u.tail=null,u.lastEffect=null),ee(rn,rn.current),o)break;return null;case 22:return n.lanes=0,c0(t,n,a,n.pendingProps);case 24:Pa(n,fn,t.memoizedState.cache)}return oa(t,n,a)}function v0(t,n,a){if(t!==null)if(t.memoizedProps!==n.pendingProps)hn=!0;else{if(!Df(t,a)&&(n.flags&128)===0)return hn=!1,qx(t,n,a);hn=(t.flags&131072)!==0}else hn=!1,yt&&(n.flags&1048576)!==0&&Kp(n,oo,n.index);switch(n.lanes=0,n.tag){case 16:e:{var o=n.pendingProps;if(t=Ms(n.elementType),n.type=t,typeof t=="function")Ou(t)?(o=bs(t,o),n.tag=1,n=h0(null,n,t,o,a)):(n.tag=0,n=Ef(null,n,t,o,a));else{if(t!=null){var u=t.$$typeof;if(u===w){n.tag=11,n=r0(null,n,t,o,a);break e}else if(u===F){n.tag=14,n=o0(null,n,t,o,a);break e}}throw n=Z(t)||t,Error(s(306,n,""))}}return n;case 0:return Ef(t,n,n.type,n.pendingProps,a);case 1:return o=n.type,u=bs(o,n.pendingProps),h0(t,n,o,u,a);case 3:e:{if(me(n,n.stateNode.containerInfo),t===null)throw Error(s(387));o=n.pendingProps;var f=n.memoizedState;u=f.element,Zu(t,n),go(n,o,null,a);var v=n.memoizedState;if(o=v.cache,Pa(n,fn,o),o!==f.cache&&ku(n,[fn],a,!0),mo(),o=v.element,f.isDehydrated)if(f={element:o,isDehydrated:!1,cache:v.cache},n.updateQueue.baseState=f,n.memoizedState=f,n.flags&256){n=p0(t,n,o,a);break e}else if(o!==u){u=_i(Error(s(424)),n),lo(u),n=p0(t,n,o,a);break e}else for(t=n.stateNode.containerInfo,t.nodeType===9?t=t.body:t=t.nodeName==="HTML"?t.ownerDocument.body:t,jt=yi(t.firstChild),Rn=n,yt=!0,La=null,Si=!0,a=cm(n,null,o,a),n.child=a;a;)a.flags=a.flags&-3|4096,a=a.sibling;else{if(_s(),o===u){n=oa(t,n,a);break e}wn(t,n,o,a)}n=n.child}return n;case 26:return Wl(t,n),t===null?(a=wg(n.type,null,n.pendingProps,null))?n.memoizedState=a:yt||(a=n.type,t=n.pendingProps,o=lc(Fe.current).createElement(a),o[ln]=n,o[An]=t,Dn(o,a,t),cn(o),n.stateNode=o):n.memoizedState=wg(n.type,t.memoizedProps,n.pendingProps,t.memoizedState),null;case 27:return $e(n),t===null&&yt&&(o=n.stateNode=Ag(n.type,n.pendingProps,Fe.current),Rn=n,Si=!0,u=jt,ja(n.type)?(cd=u,jt=yi(o.firstChild)):jt=u),wn(t,n,n.pendingProps.children,a),Wl(t,n),t===null&&(n.flags|=4194304),n.child;case 5:return t===null&&yt&&((u=o=jt)&&(o=ES(o,n.type,n.pendingProps,Si),o!==null?(n.stateNode=o,Rn=n,jt=yi(o.firstChild),Si=!1,u=!0):u=!1),u||Oa(n)),$e(n),u=n.type,f=n.pendingProps,v=t!==null?t.memoizedProps:null,o=f.children,ad(u,f)?o=null:v!==null&&ad(u,v)&&(n.flags|=32),n.memoizedState!==null&&(u=nf(t,n,Bx,null,null,a),Io._currentValue=u),Wl(t,n),wn(t,n,o,a),n.child;case 6:return t===null&&yt&&((t=a=jt)&&(a=TS(a,n.pendingProps,Si),a!==null?(n.stateNode=a,Rn=n,jt=null,t=!0):t=!1),t||Oa(n)),null;case 13:return m0(t,n,a);case 4:return me(n,n.stateNode.containerInfo),o=n.pendingProps,t===null?n.child=Es(n,null,o,a):wn(t,n,o,a),n.child;case 11:return r0(t,n,n.type,n.pendingProps,a);case 7:return wn(t,n,n.pendingProps,a),n.child;case 8:return wn(t,n,n.pendingProps.children,a),n.child;case 12:return wn(t,n,n.pendingProps.children,a),n.child;case 10:return o=n.pendingProps,Pa(n,n.type,o.value),wn(t,n,o.children,a),n.child;case 9:return u=n.type._context,o=n.pendingProps.children,xs(n),u=Cn(u),o=o(u),n.flags|=1,wn(t,n,o,a),n.child;case 14:return o0(t,n,n.type,n.pendingProps,a);case 15:return l0(t,n,n.type,n.pendingProps,a);case 19:return _0(t,n,a);case 31:return Yx(t,n,a);case 22:return c0(t,n,a,n.pendingProps);case 24:return xs(n),o=Cn(fn),t===null?(u=Yu(),u===null&&(u=Yt,f=Xu(),u.pooledCache=f,f.refCount++,f!==null&&(u.pooledCacheLanes|=a),u=f),n.memoizedState={parent:o,cache:u},ju(n),Pa(n,fn,u)):((t.lanes&a)!==0&&(Zu(t,n),go(n,null,null,a),mo()),u=t.memoizedState,f=n.memoizedState,u.parent!==o?(u={parent:o,cache:o},n.memoizedState=u,n.lanes===0&&(n.memoizedState=n.updateQueue.baseState=u),Pa(n,fn,o)):(o=f.cache,Pa(n,fn,o),o!==u.cache&&ku(n,[fn],a,!0))),wn(t,n,n.pendingProps.children,a),n.child;case 29:throw n.pendingProps}throw Error(s(156,n.tag))}function la(t){t.flags|=4}function Nf(t,n,a,o,u){if((n=(t.mode&32)!==0)&&(n=!1),n){if(t.flags|=16777216,(u&335544128)===u)if(t.stateNode.complete)t.flags|=8192;else if(W0())t.flags|=8192;else throw ys=Dl,qu}else t.flags&=-16777217}function x0(t,n){if(n.type!=="stylesheet"||(n.state.loading&4)!==0)t.flags&=-16777217;else if(t.flags|=16777216,!Og(n))if(W0())t.flags|=8192;else throw ys=Dl,qu}function ql(t,n){n!==null&&(t.flags|=4),t.flags&16384&&(n=t.tag!==22?Te():536870912,t.lanes|=n,hr|=n)}function yo(t,n){if(!yt)switch(t.tailMode){case"hidden":n=t.tail;for(var a=null;n!==null;)n.alternate!==null&&(a=n),n=n.sibling;a===null?t.tail=null:a.sibling=null;break;case"collapsed":a=t.tail;for(var o=null;a!==null;)a.alternate!==null&&(o=a),a=a.sibling;o===null?n||t.tail===null?t.tail=null:t.tail.sibling=null:o.sibling=null}}function Zt(t){var n=t.alternate!==null&&t.alternate.child===t.child,a=0,o=0;if(n)for(var u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags&65011712,o|=u.flags&65011712,u.return=t,u=u.sibling;else for(u=t.child;u!==null;)a|=u.lanes|u.childLanes,o|=u.subtreeFlags,o|=u.flags,u.return=t,u=u.sibling;return t.subtreeFlags|=o,t.childLanes=a,n}function jx(t,n,a){var o=n.pendingProps;switch(Bu(n),n.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Zt(n),null;case 1:return Zt(n),null;case 3:return a=n.stateNode,o=null,t!==null&&(o=t.memoizedState.cache),n.memoizedState.cache!==o&&(n.flags|=2048),aa(fn),be(),a.pendingContext&&(a.context=a.pendingContext,a.pendingContext=null),(t===null||t.child===null)&&(er(n)?la(n):t===null||t.memoizedState.isDehydrated&&(n.flags&256)===0||(n.flags|=1024,Hu())),Zt(n),null;case 26:var u=n.type,f=n.memoizedState;return t===null?(la(n),f!==null?(Zt(n),x0(n,f)):(Zt(n),Nf(n,u,null,o,a))):f?f!==t.memoizedState?(la(n),Zt(n),x0(n,f)):(Zt(n),n.flags&=-16777217):(t=t.memoizedProps,t!==o&&la(n),Zt(n),Nf(n,u,t,o,a)),null;case 27:if(Oe(n),a=Fe.current,u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&la(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Zt(n),null}t=ye.current,er(n)?Jp(n):(t=Ag(u,o,a),n.stateNode=t,la(n))}return Zt(n),null;case 5:if(Oe(n),u=n.type,t!==null&&n.stateNode!=null)t.memoizedProps!==o&&la(n);else{if(!o){if(n.stateNode===null)throw Error(s(166));return Zt(n),null}if(f=ye.current,er(n))Jp(n);else{var v=lc(Fe.current);switch(f){case 1:f=v.createElementNS("http://www.w3.org/2000/svg",u);break;case 2:f=v.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;default:switch(u){case"svg":f=v.createElementNS("http://www.w3.org/2000/svg",u);break;case"math":f=v.createElementNS("http://www.w3.org/1998/Math/MathML",u);break;case"script":f=v.createElement("div"),f.innerHTML="<script><\/script>",f=f.removeChild(f.firstChild);break;case"select":f=typeof o.is=="string"?v.createElement("select",{is:o.is}):v.createElement("select"),o.multiple?f.multiple=!0:o.size&&(f.size=o.size);break;default:f=typeof o.is=="string"?v.createElement(u,{is:o.is}):v.createElement(u)}}f[ln]=n,f[An]=o;e:for(v=n.child;v!==null;){if(v.tag===5||v.tag===6)f.appendChild(v.stateNode);else if(v.tag!==4&&v.tag!==27&&v.child!==null){v.child.return=v,v=v.child;continue}if(v===n)break e;for(;v.sibling===null;){if(v.return===null||v.return===n)break e;v=v.return}v.sibling.return=v.return,v=v.sibling}n.stateNode=f;e:switch(Dn(f,u,o),u){case"button":case"input":case"select":case"textarea":o=!!o.autoFocus;break e;case"img":o=!0;break e;default:o=!1}o&&la(n)}}return Zt(n),Nf(n,n.type,t===null?null:t.memoizedProps,n.pendingProps,a),null;case 6:if(t&&n.stateNode!=null)t.memoizedProps!==o&&la(n);else{if(typeof o!="string"&&n.stateNode===null)throw Error(s(166));if(t=Fe.current,er(n)){if(t=n.stateNode,a=n.memoizedProps,o=null,u=Rn,u!==null)switch(u.tag){case 27:case 5:o=u.memoizedProps}t[ln]=n,t=!!(t.nodeValue===a||o!==null&&o.suppressHydrationWarning===!0||mg(t.nodeValue,a)),t||Oa(n,!0)}else t=lc(t).createTextNode(o),t[ln]=n,n.stateNode=t}return Zt(n),null;case 31:if(a=n.memoizedState,t===null||t.memoizedState!==null){if(o=er(n),a!==null){if(t===null){if(!o)throw Error(s(318));if(t=n.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(s(557));t[ln]=n}else _s(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Zt(n),t=!1}else a=Hu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=a),t=!0;if(!t)return n.flags&256?(ri(n),n):(ri(n),null);if((n.flags&128)!==0)throw Error(s(558))}return Zt(n),null;case 13:if(o=n.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(u=er(n),o!==null&&o.dehydrated!==null){if(t===null){if(!u)throw Error(s(318));if(u=n.memoizedState,u=u!==null?u.dehydrated:null,!u)throw Error(s(317));u[ln]=n}else _s(),(n.flags&128)===0&&(n.memoizedState=null),n.flags|=4;Zt(n),u=!1}else u=Hu(),t!==null&&t.memoizedState!==null&&(t.memoizedState.hydrationErrors=u),u=!0;if(!u)return n.flags&256?(ri(n),n):(ri(n),null)}return ri(n),(n.flags&128)!==0?(n.lanes=a,n):(a=o!==null,t=t!==null&&t.memoizedState!==null,a&&(o=n.child,u=null,o.alternate!==null&&o.alternate.memoizedState!==null&&o.alternate.memoizedState.cachePool!==null&&(u=o.alternate.memoizedState.cachePool.pool),f=null,o.memoizedState!==null&&o.memoizedState.cachePool!==null&&(f=o.memoizedState.cachePool.pool),f!==u&&(o.flags|=2048)),a!==t&&a&&(n.child.flags|=8192),ql(n,n.updateQueue),Zt(n),null);case 4:return be(),t===null&&$f(n.stateNode.containerInfo),Zt(n),null;case 10:return aa(n.type),Zt(n),null;case 19:if(Y(rn),o=n.memoizedState,o===null)return Zt(n),null;if(u=(n.flags&128)!==0,f=o.rendering,f===null)if(u)yo(o,!1);else{if(sn!==0||t!==null&&(t.flags&128)!==0)for(t=n.child;t!==null;){if(f=Ol(t),f!==null){for(n.flags|=128,yo(o,!1),t=f.updateQueue,n.updateQueue=t,ql(n,t),n.subtreeFlags=0,t=a,a=n.child;a!==null;)qp(a,t),a=a.sibling;return ee(rn,rn.current&1|2),yt&&na(n,o.treeForkCount),n.child}t=t.sibling}o.tail!==null&&Ot()>Jl&&(n.flags|=128,u=!0,yo(o,!1),n.lanes=4194304)}else{if(!u)if(t=Ol(f),t!==null){if(n.flags|=128,u=!0,t=t.updateQueue,n.updateQueue=t,ql(n,t),yo(o,!0),o.tail===null&&o.tailMode==="hidden"&&!f.alternate&&!yt)return Zt(n),null}else 2*Ot()-o.renderingStartTime>Jl&&a!==536870912&&(n.flags|=128,u=!0,yo(o,!1),n.lanes=4194304);o.isBackwards?(f.sibling=n.child,n.child=f):(t=o.last,t!==null?t.sibling=f:n.child=f,o.last=f)}return o.tail!==null?(t=o.tail,o.rendering=t,o.tail=t.sibling,o.renderingStartTime=Ot(),t.sibling=null,a=rn.current,ee(rn,u?a&1|2:a&1),yt&&na(n,o.treeForkCount),t):(Zt(n),null);case 22:case 23:return ri(n),$u(),o=n.memoizedState!==null,t!==null?t.memoizedState!==null!==o&&(n.flags|=8192):o&&(n.flags|=8192),o?(a&536870912)!==0&&(n.flags&128)===0&&(Zt(n),n.subtreeFlags&6&&(n.flags|=8192)):Zt(n),a=n.updateQueue,a!==null&&ql(n,a.retryQueue),a=null,t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),o=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(o=n.memoizedState.cachePool.pool),o!==a&&(n.flags|=2048),t!==null&&Y(Ss),null;case 24:return a=null,t!==null&&(a=t.memoizedState.cache),n.memoizedState.cache!==a&&(n.flags|=2048),aa(fn),Zt(n),null;case 25:return null;case 30:return null}throw Error(s(156,n.tag))}function Zx(t,n){switch(Bu(n),n.tag){case 1:return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 3:return aa(fn),be(),t=n.flags,(t&65536)!==0&&(t&128)===0?(n.flags=t&-65537|128,n):null;case 26:case 27:case 5:return Oe(n),null;case 31:if(n.memoizedState!==null){if(ri(n),n.alternate===null)throw Error(s(340));_s()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 13:if(ri(n),t=n.memoizedState,t!==null&&t.dehydrated!==null){if(n.alternate===null)throw Error(s(340));_s()}return t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 19:return Y(rn),null;case 4:return be(),null;case 10:return aa(n.type),null;case 22:case 23:return ri(n),$u(),t!==null&&Y(Ss),t=n.flags,t&65536?(n.flags=t&-65537|128,n):null;case 24:return aa(fn),null;case 25:return null;default:return null}}function S0(t,n){switch(Bu(n),n.tag){case 3:aa(fn),be();break;case 26:case 27:case 5:Oe(n);break;case 4:be();break;case 31:n.memoizedState!==null&&ri(n);break;case 13:ri(n);break;case 19:Y(rn);break;case 10:aa(n.type);break;case 22:case 23:ri(n),$u(),t!==null&&Y(Ss);break;case 24:aa(fn)}}function Eo(t,n){try{var a=n.updateQueue,o=a!==null?a.lastEffect:null;if(o!==null){var u=o.next;a=u;do{if((a.tag&t)===t){o=void 0;var f=a.create,v=a.inst;o=f(),v.destroy=o}a=a.next}while(a!==u)}}catch(R){It(n,n.return,R)}}function Ga(t,n,a){try{var o=n.updateQueue,u=o!==null?o.lastEffect:null;if(u!==null){var f=u.next;o=f;do{if((o.tag&t)===t){var v=o.inst,R=v.destroy;if(R!==void 0){v.destroy=void 0,u=n;var G=a,ce=R;try{ce()}catch(xe){It(u,G,xe)}}}o=o.next}while(o!==f)}}catch(xe){It(n,n.return,xe)}}function M0(t){var n=t.updateQueue;if(n!==null){var a=t.stateNode;try{fm(n,a)}catch(o){It(t,t.return,o)}}}function y0(t,n,a){a.props=bs(t.type,t.memoizedProps),a.state=t.memoizedState;try{a.componentWillUnmount()}catch(o){It(t,n,o)}}function To(t,n){try{var a=t.ref;if(a!==null){switch(t.tag){case 26:case 27:case 5:var o=t.stateNode;break;case 30:o=t.stateNode;break;default:o=t.stateNode}typeof a=="function"?t.refCleanup=a(o):a.current=o}}catch(u){It(t,n,u)}}function Vi(t,n){var a=t.ref,o=t.refCleanup;if(a!==null)if(typeof o=="function")try{o()}catch(u){It(t,n,u)}finally{t.refCleanup=null,t=t.alternate,t!=null&&(t.refCleanup=null)}else if(typeof a=="function")try{a(null)}catch(u){It(t,n,u)}else a.current=null}function E0(t){var n=t.type,a=t.memoizedProps,o=t.stateNode;try{e:switch(n){case"button":case"input":case"select":case"textarea":a.autoFocus&&o.focus();break e;case"img":a.src?o.src=a.src:a.srcSet&&(o.srcset=a.srcSet)}}catch(u){It(t,t.return,u)}}function Uf(t,n,a){try{var o=t.stateNode;_S(o,t.type,a,n),o[An]=n}catch(u){It(t,t.return,u)}}function T0(t){return t.tag===5||t.tag===3||t.tag===26||t.tag===27&&ja(t.type)||t.tag===4}function Lf(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||T0(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.tag===27&&ja(t.type)||t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Of(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?(a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a).insertBefore(t,n):(n=a.nodeType===9?a.body:a.nodeName==="HTML"?a.ownerDocument.body:a,n.appendChild(t),a=a._reactRootContainer,a!=null||n.onclick!==null||(n.onclick=mi));else if(o!==4&&(o===27&&ja(t.type)&&(a=t.stateNode,n=null),t=t.child,t!==null))for(Of(t,n,a),t=t.sibling;t!==null;)Of(t,n,a),t=t.sibling}function jl(t,n,a){var o=t.tag;if(o===5||o===6)t=t.stateNode,n?a.insertBefore(t,n):a.appendChild(t);else if(o!==4&&(o===27&&ja(t.type)&&(a=t.stateNode),t=t.child,t!==null))for(jl(t,n,a),t=t.sibling;t!==null;)jl(t,n,a),t=t.sibling}function b0(t){var n=t.stateNode,a=t.memoizedProps;try{for(var o=t.type,u=n.attributes;u.length;)n.removeAttributeNode(u[0]);Dn(n,o,a),n[ln]=t,n[An]=a}catch(f){It(t,t.return,f)}}var ca=!1,pn=!1,Pf=!1,A0=typeof WeakSet=="function"?WeakSet:Set,yn=null;function Kx(t,n){if(t=t.containerInfo,nd=mc,t=Bp(t),Ru(t)){if("selectionStart"in t)var a={start:t.selectionStart,end:t.selectionEnd};else e:{a=(a=t.ownerDocument)&&a.defaultView||window;var o=a.getSelection&&a.getSelection();if(o&&o.rangeCount!==0){a=o.anchorNode;var u=o.anchorOffset,f=o.focusNode;o=o.focusOffset;try{a.nodeType,f.nodeType}catch{a=null;break e}var v=0,R=-1,G=-1,ce=0,xe=0,Ee=t,de=null;t:for(;;){for(var pe;Ee!==a||u!==0&&Ee.nodeType!==3||(R=v+u),Ee!==f||o!==0&&Ee.nodeType!==3||(G=v+o),Ee.nodeType===3&&(v+=Ee.nodeValue.length),(pe=Ee.firstChild)!==null;)de=Ee,Ee=pe;for(;;){if(Ee===t)break t;if(de===a&&++ce===u&&(R=v),de===f&&++xe===o&&(G=v),(pe=Ee.nextSibling)!==null)break;Ee=de,de=Ee.parentNode}Ee=pe}a=R===-1||G===-1?null:{start:R,end:G}}else a=null}a=a||{start:0,end:0}}else a=null;for(id={focusedElem:t,selectionRange:a},mc=!1,yn=n;yn!==null;)if(n=yn,t=n.child,(n.subtreeFlags&1028)!==0&&t!==null)t.return=n,yn=t;else for(;yn!==null;){switch(n=yn,f=n.alternate,t=n.flags,n.tag){case 0:if((t&4)!==0&&(t=n.updateQueue,t=t!==null?t.events:null,t!==null))for(a=0;a<t.length;a++)u=t[a],u.ref.impl=u.nextImpl;break;case 11:case 15:break;case 1:if((t&1024)!==0&&f!==null){t=void 0,a=n,u=f.memoizedProps,f=f.memoizedState,o=a.stateNode;try{var qe=bs(a.type,u);t=o.getSnapshotBeforeUpdate(qe,f),o.__reactInternalSnapshotBeforeUpdate=t}catch(et){It(a,a.return,et)}}break;case 3:if((t&1024)!==0){if(t=n.stateNode.containerInfo,a=t.nodeType,a===9)rd(t);else if(a===1)switch(t.nodeName){case"HEAD":case"HTML":case"BODY":rd(t);break;default:t.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((t&1024)!==0)throw Error(s(163))}if(t=n.sibling,t!==null){t.return=n.return,yn=t;break}yn=n.return}}function R0(t,n,a){var o=a.flags;switch(a.tag){case 0:case 11:case 15:fa(t,a),o&4&&Eo(5,a);break;case 1:if(fa(t,a),o&4)if(t=a.stateNode,n===null)try{t.componentDidMount()}catch(v){It(a,a.return,v)}else{var u=bs(a.type,n.memoizedProps);n=n.memoizedState;try{t.componentDidUpdate(u,n,t.__reactInternalSnapshotBeforeUpdate)}catch(v){It(a,a.return,v)}}o&64&&M0(a),o&512&&To(a,a.return);break;case 3:if(fa(t,a),o&64&&(t=a.updateQueue,t!==null)){if(n=null,a.child!==null)switch(a.child.tag){case 27:case 5:n=a.child.stateNode;break;case 1:n=a.child.stateNode}try{fm(t,n)}catch(v){It(a,a.return,v)}}break;case 27:n===null&&o&4&&b0(a);case 26:case 5:fa(t,a),n===null&&o&4&&E0(a),o&512&&To(a,a.return);break;case 12:fa(t,a);break;case 31:fa(t,a),o&4&&D0(t,a);break;case 13:fa(t,a),o&4&&N0(t,a),o&64&&(t=a.memoizedState,t!==null&&(t=t.dehydrated,t!==null&&(a=sS.bind(null,a),bS(t,a))));break;case 22:if(o=a.memoizedState!==null||ca,!o){n=n!==null&&n.memoizedState!==null||pn,u=ca;var f=pn;ca=o,(pn=n)&&!f?da(t,a,(a.subtreeFlags&8772)!==0):fa(t,a),ca=u,pn=f}break;case 30:break;default:fa(t,a)}}function C0(t){var n=t.alternate;n!==null&&(t.alternate=null,C0(n)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(n=t.stateNode,n!==null&&Ca(n)),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}var Qt=null,qn=!1;function ua(t,n,a){for(a=a.child;a!==null;)w0(t,n,a),a=a.sibling}function w0(t,n,a){if(ve&&typeof ve.onCommitFiberUnmount=="function")try{ve.onCommitFiberUnmount(_e,a)}catch{}switch(a.tag){case 26:pn||Vi(a,n),ua(t,n,a),a.memoizedState?a.memoizedState.count--:a.stateNode&&(a=a.stateNode,a.parentNode.removeChild(a));break;case 27:pn||Vi(a,n);var o=Qt,u=qn;ja(a.type)&&(Qt=a.stateNode,qn=!1),ua(t,n,a),Lo(a.stateNode),Qt=o,qn=u;break;case 5:pn||Vi(a,n);case 6:if(o=Qt,u=qn,Qt=null,ua(t,n,a),Qt=o,qn=u,Qt!==null)if(qn)try{(Qt.nodeType===9?Qt.body:Qt.nodeName==="HTML"?Qt.ownerDocument.body:Qt).removeChild(a.stateNode)}catch(f){It(a,n,f)}else try{Qt.removeChild(a.stateNode)}catch(f){It(a,n,f)}break;case 18:Qt!==null&&(qn?(t=Qt,Mg(t.nodeType===9?t.body:t.nodeName==="HTML"?t.ownerDocument.body:t,a.stateNode),Mr(t)):Mg(Qt,a.stateNode));break;case 4:o=Qt,u=qn,Qt=a.stateNode.containerInfo,qn=!0,ua(t,n,a),Qt=o,qn=u;break;case 0:case 11:case 14:case 15:Ga(2,a,n),pn||Ga(4,a,n),ua(t,n,a);break;case 1:pn||(Vi(a,n),o=a.stateNode,typeof o.componentWillUnmount=="function"&&y0(a,n,o)),ua(t,n,a);break;case 21:ua(t,n,a);break;case 22:pn=(o=pn)||a.memoizedState!==null,ua(t,n,a),pn=o;break;default:ua(t,n,a)}}function D0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null))){t=t.dehydrated;try{Mr(t)}catch(a){It(n,n.return,a)}}}function N0(t,n){if(n.memoizedState===null&&(t=n.alternate,t!==null&&(t=t.memoizedState,t!==null&&(t=t.dehydrated,t!==null))))try{Mr(t)}catch(a){It(n,n.return,a)}}function Qx(t){switch(t.tag){case 31:case 13:case 19:var n=t.stateNode;return n===null&&(n=t.stateNode=new A0),n;case 22:return t=t.stateNode,n=t._retryCache,n===null&&(n=t._retryCache=new A0),n;default:throw Error(s(435,t.tag))}}function Zl(t,n){var a=Qx(t);n.forEach(function(o){if(!a.has(o)){a.add(o);var u=rS.bind(null,t,o);o.then(u,u)}})}function jn(t,n){var a=n.deletions;if(a!==null)for(var o=0;o<a.length;o++){var u=a[o],f=t,v=n,R=v;e:for(;R!==null;){switch(R.tag){case 27:if(ja(R.type)){Qt=R.stateNode,qn=!1;break e}break;case 5:Qt=R.stateNode,qn=!1;break e;case 3:case 4:Qt=R.stateNode.containerInfo,qn=!0;break e}R=R.return}if(Qt===null)throw Error(s(160));w0(f,v,u),Qt=null,qn=!1,f=u.alternate,f!==null&&(f.return=null),u.return=null}if(n.subtreeFlags&13886)for(n=n.child;n!==null;)U0(n,t),n=n.sibling}var wi=null;function U0(t,n){var a=t.alternate,o=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:jn(n,t),Zn(t),o&4&&(Ga(3,t,t.return),Eo(3,t),Ga(5,t,t.return));break;case 1:jn(n,t),Zn(t),o&512&&(pn||a===null||Vi(a,a.return)),o&64&&ca&&(t=t.updateQueue,t!==null&&(o=t.callbacks,o!==null&&(a=t.shared.hiddenCallbacks,t.shared.hiddenCallbacks=a===null?o:a.concat(o))));break;case 26:var u=wi;if(jn(n,t),Zn(t),o&512&&(pn||a===null||Vi(a,a.return)),o&4){var f=a!==null?a.memoizedState:null;if(o=t.memoizedState,a===null)if(o===null)if(t.stateNode===null){e:{o=t.type,a=t.memoizedProps,u=u.ownerDocument||u;t:switch(o){case"title":f=u.getElementsByTagName("title")[0],(!f||f[Ra]||f[ln]||f.namespaceURI==="http://www.w3.org/2000/svg"||f.hasAttribute("itemprop"))&&(f=u.createElement(o),u.head.insertBefore(f,u.querySelector("head > title"))),Dn(f,o,a),f[ln]=t,cn(f),o=f;break e;case"link":var v=Ug("link","href",u).get(o+(a.href||""));if(v){for(var R=0;R<v.length;R++)if(f=v[R],f.getAttribute("href")===(a.href==null||a.href===""?null:a.href)&&f.getAttribute("rel")===(a.rel==null?null:a.rel)&&f.getAttribute("title")===(a.title==null?null:a.title)&&f.getAttribute("crossorigin")===(a.crossOrigin==null?null:a.crossOrigin)){v.splice(R,1);break t}}f=u.createElement(o),Dn(f,o,a),u.head.appendChild(f);break;case"meta":if(v=Ug("meta","content",u).get(o+(a.content||""))){for(R=0;R<v.length;R++)if(f=v[R],f.getAttribute("content")===(a.content==null?null:""+a.content)&&f.getAttribute("name")===(a.name==null?null:a.name)&&f.getAttribute("property")===(a.property==null?null:a.property)&&f.getAttribute("http-equiv")===(a.httpEquiv==null?null:a.httpEquiv)&&f.getAttribute("charset")===(a.charSet==null?null:a.charSet)){v.splice(R,1);break t}}f=u.createElement(o),Dn(f,o,a),u.head.appendChild(f);break;default:throw Error(s(468,o))}f[ln]=t,cn(f),o=f}t.stateNode=o}else Lg(u,t.type,t.stateNode);else t.stateNode=Ng(u,o,t.memoizedProps);else f!==o?(f===null?a.stateNode!==null&&(a=a.stateNode,a.parentNode.removeChild(a)):f.count--,o===null?Lg(u,t.type,t.stateNode):Ng(u,o,t.memoizedProps)):o===null&&t.stateNode!==null&&Uf(t,t.memoizedProps,a.memoizedProps)}break;case 27:jn(n,t),Zn(t),o&512&&(pn||a===null||Vi(a,a.return)),a!==null&&o&4&&Uf(t,t.memoizedProps,a.memoizedProps);break;case 5:if(jn(n,t),Zn(t),o&512&&(pn||a===null||Vi(a,a.return)),t.flags&32){u=t.stateNode;try{Bn(u,"")}catch(qe){It(t,t.return,qe)}}o&4&&t.stateNode!=null&&(u=t.memoizedProps,Uf(t,u,a!==null?a.memoizedProps:u)),o&1024&&(Pf=!0);break;case 6:if(jn(n,t),Zn(t),o&4){if(t.stateNode===null)throw Error(s(162));o=t.memoizedProps,a=t.stateNode;try{a.nodeValue=o}catch(qe){It(t,t.return,qe)}}break;case 3:if(fc=null,u=wi,wi=cc(n.containerInfo),jn(n,t),wi=u,Zn(t),o&4&&a!==null&&a.memoizedState.isDehydrated)try{Mr(n.containerInfo)}catch(qe){It(t,t.return,qe)}Pf&&(Pf=!1,L0(t));break;case 4:o=wi,wi=cc(t.stateNode.containerInfo),jn(n,t),Zn(t),wi=o;break;case 12:jn(n,t),Zn(t);break;case 31:jn(n,t),Zn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,Zl(t,o)));break;case 13:jn(n,t),Zn(t),t.child.flags&8192&&t.memoizedState!==null!=(a!==null&&a.memoizedState!==null)&&(Ql=Ot()),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,Zl(t,o)));break;case 22:u=t.memoizedState!==null;var G=a!==null&&a.memoizedState!==null,ce=ca,xe=pn;if(ca=ce||u,pn=xe||G,jn(n,t),pn=xe,ca=ce,Zn(t),o&8192)e:for(n=t.stateNode,n._visibility=u?n._visibility&-2:n._visibility|1,u&&(a===null||G||ca||pn||As(t)),a=null,n=t;;){if(n.tag===5||n.tag===26){if(a===null){G=a=n;try{if(f=G.stateNode,u)v=f.style,typeof v.setProperty=="function"?v.setProperty("display","none","important"):v.display="none";else{R=G.stateNode;var Ee=G.memoizedProps.style,de=Ee!=null&&Ee.hasOwnProperty("display")?Ee.display:null;R.style.display=de==null||typeof de=="boolean"?"":(""+de).trim()}}catch(qe){It(G,G.return,qe)}}}else if(n.tag===6){if(a===null){G=n;try{G.stateNode.nodeValue=u?"":G.memoizedProps}catch(qe){It(G,G.return,qe)}}}else if(n.tag===18){if(a===null){G=n;try{var pe=G.stateNode;u?yg(pe,!0):yg(G.stateNode,!1)}catch(qe){It(G,G.return,qe)}}}else if((n.tag!==22&&n.tag!==23||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break e;for(;n.sibling===null;){if(n.return===null||n.return===t)break e;a===n&&(a=null),n=n.return}a===n&&(a=null),n.sibling.return=n.return,n=n.sibling}o&4&&(o=t.updateQueue,o!==null&&(a=o.retryQueue,a!==null&&(o.retryQueue=null,Zl(t,a))));break;case 19:jn(n,t),Zn(t),o&4&&(o=t.updateQueue,o!==null&&(t.updateQueue=null,Zl(t,o)));break;case 30:break;case 21:break;default:jn(n,t),Zn(t)}}function Zn(t){var n=t.flags;if(n&2){try{for(var a,o=t.return;o!==null;){if(T0(o)){a=o;break}o=o.return}if(a==null)throw Error(s(160));switch(a.tag){case 27:var u=a.stateNode,f=Lf(t);jl(t,f,u);break;case 5:var v=a.stateNode;a.flags&32&&(Bn(v,""),a.flags&=-33);var R=Lf(t);jl(t,R,v);break;case 3:case 4:var G=a.stateNode.containerInfo,ce=Lf(t);Of(t,ce,G);break;default:throw Error(s(161))}}catch(xe){It(t,t.return,xe)}t.flags&=-3}n&4096&&(t.flags&=-4097)}function L0(t){if(t.subtreeFlags&1024)for(t=t.child;t!==null;){var n=t;L0(n),n.tag===5&&n.flags&1024&&n.stateNode.reset(),t=t.sibling}}function fa(t,n){if(n.subtreeFlags&8772)for(n=n.child;n!==null;)R0(t,n.alternate,n),n=n.sibling}function As(t){for(t=t.child;t!==null;){var n=t;switch(n.tag){case 0:case 11:case 14:case 15:Ga(4,n,n.return),As(n);break;case 1:Vi(n,n.return);var a=n.stateNode;typeof a.componentWillUnmount=="function"&&y0(n,n.return,a),As(n);break;case 27:Lo(n.stateNode);case 26:case 5:Vi(n,n.return),As(n);break;case 22:n.memoizedState===null&&As(n);break;case 30:As(n);break;default:As(n)}t=t.sibling}}function da(t,n,a){for(a=a&&(n.subtreeFlags&8772)!==0,n=n.child;n!==null;){var o=n.alternate,u=t,f=n,v=f.flags;switch(f.tag){case 0:case 11:case 15:da(u,f,a),Eo(4,f);break;case 1:if(da(u,f,a),o=f,u=o.stateNode,typeof u.componentDidMount=="function")try{u.componentDidMount()}catch(ce){It(o,o.return,ce)}if(o=f,u=o.updateQueue,u!==null){var R=o.stateNode;try{var G=u.shared.hiddenCallbacks;if(G!==null)for(u.shared.hiddenCallbacks=null,u=0;u<G.length;u++)um(G[u],R)}catch(ce){It(o,o.return,ce)}}a&&v&64&&M0(f),To(f,f.return);break;case 27:b0(f);case 26:case 5:da(u,f,a),a&&o===null&&v&4&&E0(f),To(f,f.return);break;case 12:da(u,f,a);break;case 31:da(u,f,a),a&&v&4&&D0(u,f);break;case 13:da(u,f,a),a&&v&4&&N0(u,f);break;case 22:f.memoizedState===null&&da(u,f,a),To(f,f.return);break;case 30:break;default:da(u,f,a)}n=n.sibling}}function If(t,n){var a=null;t!==null&&t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(a=t.memoizedState.cachePool.pool),t=null,n.memoizedState!==null&&n.memoizedState.cachePool!==null&&(t=n.memoizedState.cachePool.pool),t!==a&&(t!=null&&t.refCount++,a!=null&&co(a))}function zf(t,n){t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&co(t))}function Di(t,n,a,o){if(n.subtreeFlags&10256)for(n=n.child;n!==null;)O0(t,n,a,o),n=n.sibling}function O0(t,n,a,o){var u=n.flags;switch(n.tag){case 0:case 11:case 15:Di(t,n,a,o),u&2048&&Eo(9,n);break;case 1:Di(t,n,a,o);break;case 3:Di(t,n,a,o),u&2048&&(t=null,n.alternate!==null&&(t=n.alternate.memoizedState.cache),n=n.memoizedState.cache,n!==t&&(n.refCount++,t!=null&&co(t)));break;case 12:if(u&2048){Di(t,n,a,o),t=n.stateNode;try{var f=n.memoizedProps,v=f.id,R=f.onPostCommit;typeof R=="function"&&R(v,n.alternate===null?"mount":"update",t.passiveEffectDuration,-0)}catch(G){It(n,n.return,G)}}else Di(t,n,a,o);break;case 31:Di(t,n,a,o);break;case 13:Di(t,n,a,o);break;case 23:break;case 22:f=n.stateNode,v=n.alternate,n.memoizedState!==null?f._visibility&2?Di(t,n,a,o):bo(t,n):f._visibility&2?Di(t,n,a,o):(f._visibility|=2,ur(t,n,a,o,(n.subtreeFlags&10256)!==0||!1)),u&2048&&If(v,n);break;case 24:Di(t,n,a,o),u&2048&&zf(n.alternate,n);break;default:Di(t,n,a,o)}}function ur(t,n,a,o,u){for(u=u&&((n.subtreeFlags&10256)!==0||!1),n=n.child;n!==null;){var f=t,v=n,R=a,G=o,ce=v.flags;switch(v.tag){case 0:case 11:case 15:ur(f,v,R,G,u),Eo(8,v);break;case 23:break;case 22:var xe=v.stateNode;v.memoizedState!==null?xe._visibility&2?ur(f,v,R,G,u):bo(f,v):(xe._visibility|=2,ur(f,v,R,G,u)),u&&ce&2048&&If(v.alternate,v);break;case 24:ur(f,v,R,G,u),u&&ce&2048&&zf(v.alternate,v);break;default:ur(f,v,R,G,u)}n=n.sibling}}function bo(t,n){if(n.subtreeFlags&10256)for(n=n.child;n!==null;){var a=t,o=n,u=o.flags;switch(o.tag){case 22:bo(a,o),u&2048&&If(o.alternate,o);break;case 24:bo(a,o),u&2048&&zf(o.alternate,o);break;default:bo(a,o)}n=n.sibling}}var Ao=8192;function fr(t,n,a){if(t.subtreeFlags&Ao)for(t=t.child;t!==null;)P0(t,n,a),t=t.sibling}function P0(t,n,a){switch(t.tag){case 26:fr(t,n,a),t.flags&Ao&&t.memoizedState!==null&&zS(a,wi,t.memoizedState,t.memoizedProps);break;case 5:fr(t,n,a);break;case 3:case 4:var o=wi;wi=cc(t.stateNode.containerInfo),fr(t,n,a),wi=o;break;case 22:t.memoizedState===null&&(o=t.alternate,o!==null&&o.memoizedState!==null?(o=Ao,Ao=16777216,fr(t,n,a),Ao=o):fr(t,n,a));break;default:fr(t,n,a)}}function I0(t){var n=t.alternate;if(n!==null&&(t=n.child,t!==null)){n.child=null;do n=t.sibling,t.sibling=null,t=n;while(t!==null)}}function Ro(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];yn=o,B0(o,t)}I0(t)}if(t.subtreeFlags&10256)for(t=t.child;t!==null;)z0(t),t=t.sibling}function z0(t){switch(t.tag){case 0:case 11:case 15:Ro(t),t.flags&2048&&Ga(9,t,t.return);break;case 3:Ro(t);break;case 12:Ro(t);break;case 22:var n=t.stateNode;t.memoizedState!==null&&n._visibility&2&&(t.return===null||t.return.tag!==13)?(n._visibility&=-3,Kl(t)):Ro(t);break;default:Ro(t)}}function Kl(t){var n=t.deletions;if((t.flags&16)!==0){if(n!==null)for(var a=0;a<n.length;a++){var o=n[a];yn=o,B0(o,t)}I0(t)}for(t=t.child;t!==null;){switch(n=t,n.tag){case 0:case 11:case 15:Ga(8,n,n.return),Kl(n);break;case 22:a=n.stateNode,a._visibility&2&&(a._visibility&=-3,Kl(n));break;default:Kl(n)}t=t.sibling}}function B0(t,n){for(;yn!==null;){var a=yn;switch(a.tag){case 0:case 11:case 15:Ga(8,a,n);break;case 23:case 22:if(a.memoizedState!==null&&a.memoizedState.cachePool!==null){var o=a.memoizedState.cachePool.pool;o!=null&&o.refCount++}break;case 24:co(a.memoizedState.cache)}if(o=a.child,o!==null)o.return=a,yn=o;else e:for(a=t;yn!==null;){o=yn;var u=o.sibling,f=o.return;if(C0(o),o===a){yn=null;break e}if(u!==null){u.return=f,yn=u;break e}yn=f}}}var Jx={getCacheForType:function(t){var n=Cn(fn),a=n.data.get(t);return a===void 0&&(a=t(),n.data.set(t,a)),a},cacheSignal:function(){return Cn(fn).controller.signal}},$x=typeof WeakMap=="function"?WeakMap:Map,Ut=0,Yt=null,mt=null,xt=0,Pt=0,oi=null,Va=!1,dr=!1,Bf=!1,ha=0,sn=0,ka=0,Rs=0,Ff=0,li=0,hr=0,Co=null,Kn=null,Hf=!1,Ql=0,F0=0,Jl=1/0,$l=null,Xa=null,_n=0,Wa=null,pr=null,pa=0,Gf=0,Vf=null,H0=null,wo=0,kf=null;function ci(){return(Ut&2)!==0&&xt!==0?xt&-xt:N.T!==null?Zf():Kr()}function G0(){if(li===0)if((xt&536870912)===0||yt){var t=nt;nt<<=1,(nt&3932160)===0&&(nt=262144),li=t}else li=536870912;return t=si.current,t!==null&&(t.flags|=32),li}function Qn(t,n,a){(t===Yt&&(Pt===2||Pt===9)||t.cancelPendingCommit!==null)&&(mr(t,0),Ya(t,xt,li,!1)),We(t,a),((Ut&2)===0||t!==Yt)&&(t===Yt&&((Ut&2)===0&&(Rs|=a),sn===4&&Ya(t,xt,li,!1)),ki(t))}function V0(t,n,a){if((Ut&6)!==0)throw Error(s(327));var o=!a&&(n&127)===0&&(n&t.expiredLanes)===0||we(t,n),u=o?nS(t,n):Wf(t,n,!0),f=o;do{if(u===0){dr&&!o&&Ya(t,n,0,!1);break}else{if(a=t.current.alternate,f&&!eS(a)){u=Wf(t,n,!1),f=!1;continue}if(u===2){if(f=n,t.errorRecoveryDisabledLanes&f)var v=0;else v=t.pendingLanes&-536870913,v=v!==0?v:v&536870912?536870912:0;if(v!==0){n=v;e:{var R=t;u=Co;var G=R.current.memoizedState.isDehydrated;if(G&&(mr(R,v).flags|=256),v=Wf(R,v,!1),v!==2){if(Bf&&!G){R.errorRecoveryDisabledLanes|=f,Rs|=f,u=4;break e}f=Kn,Kn=u,f!==null&&(Kn===null?Kn=f:Kn.push.apply(Kn,f))}u=v}if(f=!1,u!==2)continue}}if(u===1){mr(t,0),Ya(t,n,0,!0);break}e:{switch(o=t,f=u,f){case 0:case 1:throw Error(s(345));case 4:if((n&4194048)!==n)break;case 6:Ya(o,n,li,!Va);break e;case 2:Kn=null;break;case 3:case 5:break;default:throw Error(s(329))}if((n&62914560)===n&&(u=Ql+300-Ot(),10<u)){if(Ya(o,n,li,!Va),Se(o,0,!0)!==0)break e;pa=n,o.timeoutHandle=xg(k0.bind(null,o,a,Kn,$l,Hf,n,li,Rs,hr,Va,f,"Throttled",-0,0),u);break e}k0(o,a,Kn,$l,Hf,n,li,Rs,hr,Va,f,null,-0,0)}}break}while(!0);ki(t)}function k0(t,n,a,o,u,f,v,R,G,ce,xe,Ee,de,pe){if(t.timeoutHandle=-1,Ee=n.subtreeFlags,Ee&8192||(Ee&16785408)===16785408){Ee={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:mi},P0(n,f,Ee);var qe=(f&62914560)===f?Ql-Ot():(f&4194048)===f?F0-Ot():0;if(qe=BS(Ee,qe),qe!==null){pa=f,t.cancelPendingCommit=qe(Q0.bind(null,t,n,f,a,o,u,v,R,G,xe,Ee,null,de,pe)),Ya(t,f,v,!ce);return}}Q0(t,n,f,a,o,u,v,R,G)}function eS(t){for(var n=t;;){var a=n.tag;if((a===0||a===11||a===15)&&n.flags&16384&&(a=n.updateQueue,a!==null&&(a=a.stores,a!==null)))for(var o=0;o<a.length;o++){var u=a[o],f=u.getSnapshot;u=u.value;try{if(!ii(f(),u))return!1}catch{return!1}}if(a=n.child,n.subtreeFlags&16384&&a!==null)a.return=n,n=a;else{if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return!0;n=n.return}n.sibling.return=n.return,n=n.sibling}}return!0}function Ya(t,n,a,o){n&=~Ff,n&=~Rs,t.suspendedLanes|=n,t.pingedLanes&=~n,o&&(t.warmLanes|=n),o=t.expirationTimes;for(var u=n;0<u;){var f=31-Ve(u),v=1<<f;o[f]=-1,u&=~v}a!==0&&bt(t,a,n)}function ec(){return(Ut&6)===0?(Do(0),!1):!0}function Xf(){if(mt!==null){if(Pt===0)var t=mt.return;else t=mt,ia=vs=null,rf(t),sr=null,fo=0,t=mt;for(;t!==null;)S0(t.alternate,t),t=t.return;mt=null}}function mr(t,n){var a=t.timeoutHandle;a!==-1&&(t.timeoutHandle=-1,SS(a)),a=t.cancelPendingCommit,a!==null&&(t.cancelPendingCommit=null,a()),pa=0,Xf(),Yt=t,mt=a=ta(t.current,null),xt=n,Pt=0,oi=null,Va=!1,dr=we(t,n),Bf=!1,hr=li=Ff=Rs=ka=sn=0,Kn=Co=null,Hf=!1,(n&8)!==0&&(n|=n&32);var o=t.entangledLanes;if(o!==0)for(t=t.entanglements,o&=n;0<o;){var u=31-Ve(o),f=1<<u;n|=t[u],o&=~f}return ha=n,Ml(),a}function X0(t,n){lt=null,N.H=So,n===ar||n===wl?(n=rm(),Pt=3):n===qu?(n=rm(),Pt=4):Pt=n===yf?8:n!==null&&typeof n=="object"&&typeof n.then=="function"?6:1,oi=n,mt===null&&(sn=1,kl(t,_i(n,t.current)))}function W0(){var t=si.current;return t===null?!0:(xt&4194048)===xt?Mi===null:(xt&62914560)===xt||(xt&536870912)!==0?t===Mi:!1}function Y0(){var t=N.H;return N.H=So,t===null?So:t}function q0(){var t=N.A;return N.A=Jx,t}function tc(){sn=4,Va||(xt&4194048)!==xt&&si.current!==null||(dr=!0),(ka&134217727)===0&&(Rs&134217727)===0||Yt===null||Ya(Yt,xt,li,!1)}function Wf(t,n,a){var o=Ut;Ut|=2;var u=Y0(),f=q0();(Yt!==t||xt!==n)&&($l=null,mr(t,n)),n=!1;var v=sn;e:do try{if(Pt!==0&&mt!==null){var R=mt,G=oi;switch(Pt){case 8:Xf(),v=6;break e;case 3:case 2:case 9:case 6:si.current===null&&(n=!0);var ce=Pt;if(Pt=0,oi=null,gr(t,R,G,ce),a&&dr){v=0;break e}break;default:ce=Pt,Pt=0,oi=null,gr(t,R,G,ce)}}tS(),v=sn;break}catch(xe){X0(t,xe)}while(!0);return n&&t.shellSuspendCounter++,ia=vs=null,Ut=o,N.H=u,N.A=f,mt===null&&(Yt=null,xt=0,Ml()),v}function tS(){for(;mt!==null;)j0(mt)}function nS(t,n){var a=Ut;Ut|=2;var o=Y0(),u=q0();Yt!==t||xt!==n?($l=null,Jl=Ot()+500,mr(t,n)):dr=we(t,n);e:do try{if(Pt!==0&&mt!==null){n=mt;var f=oi;t:switch(Pt){case 1:Pt=0,oi=null,gr(t,n,f,1);break;case 2:case 9:if(am(f)){Pt=0,oi=null,Z0(n);break}n=function(){Pt!==2&&Pt!==9||Yt!==t||(Pt=7),ki(t)},f.then(n,n);break e;case 3:Pt=7;break e;case 4:Pt=5;break e;case 7:am(f)?(Pt=0,oi=null,Z0(n)):(Pt=0,oi=null,gr(t,n,f,7));break;case 5:var v=null;switch(mt.tag){case 26:v=mt.memoizedState;case 5:case 27:var R=mt;if(v?Og(v):R.stateNode.complete){Pt=0,oi=null;var G=R.sibling;if(G!==null)mt=G;else{var ce=R.return;ce!==null?(mt=ce,nc(ce)):mt=null}break t}}Pt=0,oi=null,gr(t,n,f,5);break;case 6:Pt=0,oi=null,gr(t,n,f,6);break;case 8:Xf(),sn=6;break e;default:throw Error(s(462))}}iS();break}catch(xe){X0(t,xe)}while(!0);return ia=vs=null,N.H=o,N.A=u,Ut=a,mt!==null?0:(Yt=null,xt=0,Ml(),sn)}function iS(){for(;mt!==null&&!nn();)j0(mt)}function j0(t){var n=v0(t.alternate,t,ha);t.memoizedProps=t.pendingProps,n===null?nc(t):mt=n}function Z0(t){var n=t,a=n.alternate;switch(n.tag){case 15:case 0:n=d0(a,n,n.pendingProps,n.type,void 0,xt);break;case 11:n=d0(a,n,n.pendingProps,n.type.render,n.ref,xt);break;case 5:rf(n);default:S0(a,n),n=mt=qp(n,ha),n=v0(a,n,ha)}t.memoizedProps=t.pendingProps,n===null?nc(t):mt=n}function gr(t,n,a,o){ia=vs=null,rf(n),sr=null,fo=0;var u=n.return;try{if(Wx(t,u,n,a,xt)){sn=1,kl(t,_i(a,t.current)),mt=null;return}}catch(f){if(u!==null)throw mt=u,f;sn=1,kl(t,_i(a,t.current)),mt=null;return}n.flags&32768?(yt||o===1?t=!0:dr||(xt&536870912)!==0?t=!1:(Va=t=!0,(o===2||o===9||o===3||o===6)&&(o=si.current,o!==null&&o.tag===13&&(o.flags|=16384))),K0(n,t)):nc(n)}function nc(t){var n=t;do{if((n.flags&32768)!==0){K0(n,Va);return}t=n.return;var a=jx(n.alternate,n,ha);if(a!==null){mt=a;return}if(n=n.sibling,n!==null){mt=n;return}mt=n=t}while(n!==null);sn===0&&(sn=5)}function K0(t,n){do{var a=Zx(t.alternate,t);if(a!==null){a.flags&=32767,mt=a;return}if(a=t.return,a!==null&&(a.flags|=32768,a.subtreeFlags=0,a.deletions=null),!n&&(t=t.sibling,t!==null)){mt=t;return}mt=t=a}while(t!==null);sn=6,mt=null}function Q0(t,n,a,o,u,f,v,R,G){t.cancelPendingCommit=null;do ic();while(_n!==0);if((Ut&6)!==0)throw Error(s(327));if(n!==null){if(n===t.current)throw Error(s(177));if(f=n.lanes|n.childLanes,f|=Uu,Bt(t,a,f,v,R,G),t===Yt&&(mt=Yt=null,xt=0),pr=n,Wa=t,pa=a,Gf=f,Vf=u,H0=o,(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?(t.callbackNode=null,t.callbackPriority=0,oS(te,function(){return ng(),null})):(t.callbackNode=null,t.callbackPriority=0),o=(n.flags&13878)!==0,(n.subtreeFlags&13878)!==0||o){o=N.T,N.T=null,u=V.p,V.p=2,v=Ut,Ut|=4;try{Kx(t,n,a)}finally{Ut=v,V.p=u,N.T=o}}_n=1,J0(),$0(),eg()}}function J0(){if(_n===1){_n=0;var t=Wa,n=pr,a=(n.flags&13878)!==0;if((n.subtreeFlags&13878)!==0||a){a=N.T,N.T=null;var o=V.p;V.p=2;var u=Ut;Ut|=4;try{U0(n,t);var f=id,v=Bp(t.containerInfo),R=f.focusedElem,G=f.selectionRange;if(v!==R&&R&&R.ownerDocument&&zp(R.ownerDocument.documentElement,R)){if(G!==null&&Ru(R)){var ce=G.start,xe=G.end;if(xe===void 0&&(xe=ce),"selectionStart"in R)R.selectionStart=ce,R.selectionEnd=Math.min(xe,R.value.length);else{var Ee=R.ownerDocument||document,de=Ee&&Ee.defaultView||window;if(de.getSelection){var pe=de.getSelection(),qe=R.textContent.length,et=Math.min(G.start,qe),Vt=G.end===void 0?et:Math.min(G.end,qe);!pe.extend&&et>Vt&&(v=Vt,Vt=et,et=v);var J=Ip(R,et),W=Ip(R,Vt);if(J&&W&&(pe.rangeCount!==1||pe.anchorNode!==J.node||pe.anchorOffset!==J.offset||pe.focusNode!==W.node||pe.focusOffset!==W.offset)){var le=Ee.createRange();le.setStart(J.node,J.offset),pe.removeAllRanges(),et>Vt?(pe.addRange(le),pe.extend(W.node,W.offset)):(le.setEnd(W.node,W.offset),pe.addRange(le))}}}}for(Ee=[],pe=R;pe=pe.parentNode;)pe.nodeType===1&&Ee.push({element:pe,left:pe.scrollLeft,top:pe.scrollTop});for(typeof R.focus=="function"&&R.focus(),R=0;R<Ee.length;R++){var Me=Ee[R];Me.element.scrollLeft=Me.left,Me.element.scrollTop=Me.top}}mc=!!nd,id=nd=null}finally{Ut=u,V.p=o,N.T=a}}t.current=n,_n=2}}function $0(){if(_n===2){_n=0;var t=Wa,n=pr,a=(n.flags&8772)!==0;if((n.subtreeFlags&8772)!==0||a){a=N.T,N.T=null;var o=V.p;V.p=2;var u=Ut;Ut|=4;try{R0(t,n.alternate,n)}finally{Ut=u,V.p=o,N.T=a}}_n=3}}function eg(){if(_n===4||_n===3){_n=0,Q();var t=Wa,n=pr,a=pa,o=H0;(n.subtreeFlags&10256)!==0||(n.flags&10256)!==0?_n=5:(_n=0,pr=Wa=null,tg(t,t.pendingLanes));var u=t.pendingLanes;if(u===0&&(Xa=null),Zr(a),n=n.stateNode,ve&&typeof ve.onCommitFiberRoot=="function")try{ve.onCommitFiberRoot(_e,n,void 0,(n.current.flags&128)===128)}catch{}if(o!==null){n=N.T,u=V.p,V.p=2,N.T=null;try{for(var f=t.onRecoverableError,v=0;v<o.length;v++){var R=o[v];f(R.value,{componentStack:R.stack})}}finally{N.T=n,V.p=u}}(pa&3)!==0&&ic(),ki(t),u=t.pendingLanes,(a&261930)!==0&&(u&42)!==0?t===kf?wo++:(wo=0,kf=t):wo=0,Do(0)}}function tg(t,n){(t.pooledCacheLanes&=n)===0&&(n=t.pooledCache,n!=null&&(t.pooledCache=null,co(n)))}function ic(){return J0(),$0(),eg(),ng()}function ng(){if(_n!==5)return!1;var t=Wa,n=Gf;Gf=0;var a=Zr(pa),o=N.T,u=V.p;try{V.p=32>a?32:a,N.T=null,a=Vf,Vf=null;var f=Wa,v=pa;if(_n=0,pr=Wa=null,pa=0,(Ut&6)!==0)throw Error(s(331));var R=Ut;if(Ut|=4,z0(f.current),O0(f,f.current,v,a),Ut=R,Do(0,!1),ve&&typeof ve.onPostCommitFiberRoot=="function")try{ve.onPostCommitFiberRoot(_e,f)}catch{}return!0}finally{V.p=u,N.T=o,tg(t,n)}}function ig(t,n,a){n=_i(a,n),n=Mf(t.stateNode,n,2),t=Ba(t,n,2),t!==null&&(We(t,2),ki(t))}function It(t,n,a){if(t.tag===3)ig(t,t,a);else for(;n!==null;){if(n.tag===3){ig(n,t,a);break}else if(n.tag===1){var o=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof o.componentDidCatch=="function"&&(Xa===null||!Xa.has(o))){t=_i(a,t),a=a0(2),o=Ba(n,a,2),o!==null&&(s0(a,o,n,t),We(o,2),ki(o));break}}n=n.return}}function Yf(t,n,a){var o=t.pingCache;if(o===null){o=t.pingCache=new $x;var u=new Set;o.set(n,u)}else u=o.get(n),u===void 0&&(u=new Set,o.set(n,u));u.has(a)||(Bf=!0,u.add(a),t=aS.bind(null,t,n,a),n.then(t,t))}function aS(t,n,a){var o=t.pingCache;o!==null&&o.delete(n),t.pingedLanes|=t.suspendedLanes&a,t.warmLanes&=~a,Yt===t&&(xt&a)===a&&(sn===4||sn===3&&(xt&62914560)===xt&&300>Ot()-Ql?(Ut&2)===0&&mr(t,0):Ff|=a,hr===xt&&(hr=0)),ki(t)}function ag(t,n){n===0&&(n=Te()),t=ms(t,n),t!==null&&(We(t,n),ki(t))}function sS(t){var n=t.memoizedState,a=0;n!==null&&(a=n.retryLane),ag(t,a)}function rS(t,n){var a=0;switch(t.tag){case 31:case 13:var o=t.stateNode,u=t.memoizedState;u!==null&&(a=u.retryLane);break;case 19:o=t.stateNode;break;case 22:o=t.stateNode._retryCache;break;default:throw Error(s(314))}o!==null&&o.delete(n),ag(t,a)}function oS(t,n){return Mn(t,n)}var ac=null,_r=null,qf=!1,sc=!1,jf=!1,qa=0;function ki(t){t!==_r&&t.next===null&&(_r===null?ac=_r=t:_r=_r.next=t),sc=!0,qf||(qf=!0,cS())}function Do(t,n){if(!jf&&sc){jf=!0;do for(var a=!1,o=ac;o!==null;){if(t!==0){var u=o.pendingLanes;if(u===0)var f=0;else{var v=o.suspendedLanes,R=o.pingedLanes;f=(1<<31-Ve(42|t)+1)-1,f&=u&~(v&~R),f=f&201326741?f&201326741|1:f?f|2:0}f!==0&&(a=!0,lg(o,f))}else f=xt,f=Se(o,o===Yt?f:0,o.cancelPendingCommit!==null||o.timeoutHandle!==-1),(f&3)===0||we(o,f)||(a=!0,lg(o,f));o=o.next}while(a);jf=!1}}function lS(){sg()}function sg(){sc=qf=!1;var t=0;qa!==0&&xS()&&(t=qa);for(var n=Ot(),a=null,o=ac;o!==null;){var u=o.next,f=rg(o,n);f===0?(o.next=null,a===null?ac=u:a.next=u,u===null&&(_r=a)):(a=o,(t!==0||(f&3)!==0)&&(sc=!0)),o=u}_n!==0&&_n!==5||Do(t),qa!==0&&(qa=0)}function rg(t,n){for(var a=t.suspendedLanes,o=t.pingedLanes,u=t.expirationTimes,f=t.pendingLanes&-62914561;0<f;){var v=31-Ve(f),R=1<<v,G=u[v];G===-1?((R&a)===0||(R&o)!==0)&&(u[v]=Be(R,n)):G<=n&&(t.expiredLanes|=R),f&=~R}if(n=Yt,a=xt,a=Se(t,t===n?a:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o=t.callbackNode,a===0||t===n&&(Pt===2||Pt===9)||t.cancelPendingCommit!==null)return o!==null&&o!==null&&Xt(o),t.callbackNode=null,t.callbackPriority=0;if((a&3)===0||we(t,a)){if(n=a&-a,n===t.callbackPriority)return n;switch(o!==null&&Xt(o),Zr(a)){case 2:case 8:a=M;break;case 32:a=te;break;case 268435456:a=ge;break;default:a=te}return o=og.bind(null,t),a=Mn(a,o),t.callbackPriority=n,t.callbackNode=a,n}return o!==null&&o!==null&&Xt(o),t.callbackPriority=2,t.callbackNode=null,2}function og(t,n){if(_n!==0&&_n!==5)return t.callbackNode=null,t.callbackPriority=0,null;var a=t.callbackNode;if(ic()&&t.callbackNode!==a)return null;var o=xt;return o=Se(t,t===Yt?o:0,t.cancelPendingCommit!==null||t.timeoutHandle!==-1),o===0?null:(V0(t,o,n),rg(t,Ot()),t.callbackNode!=null&&t.callbackNode===a?og.bind(null,t):null)}function lg(t,n){if(ic())return null;V0(t,n,!0)}function cS(){MS(function(){(Ut&6)!==0?Mn(B,lS):sg()})}function Zf(){if(qa===0){var t=nr;t===0&&(t=Qe,Qe<<=1,(Qe&261888)===0&&(Qe=256)),qa=t}return qa}function cg(t){return t==null||typeof t=="symbol"||typeof t=="boolean"?null:typeof t=="function"?t:Ri(""+t)}function ug(t,n){var a=n.ownerDocument.createElement("input");return a.name=n.name,a.value=n.value,t.id&&a.setAttribute("form",t.id),n.parentNode.insertBefore(a,n),t=new FormData(t),a.parentNode.removeChild(a),t}function uS(t,n,a,o,u){if(n==="submit"&&a&&a.stateNode===u){var f=cg((u[An]||null).action),v=o.submitter;v&&(n=(n=v[An]||null)?cg(n.formAction):v.getAttribute("formAction"),n!==null&&(f=n,v=null));var R=new _l("action","action",null,o,u);t.push({event:R,listeners:[{instance:null,listener:function(){if(o.defaultPrevented){if(qa!==0){var G=v?ug(u,v):new FormData(u);mf(a,{pending:!0,data:G,method:u.method,action:f},null,G)}}else typeof f=="function"&&(R.preventDefault(),G=v?ug(u,v):new FormData(u),mf(a,{pending:!0,data:G,method:u.method,action:f},f,G))},currentTarget:u}]})}}for(var Kf=0;Kf<Nu.length;Kf++){var Qf=Nu[Kf],fS=Qf.toLowerCase(),dS=Qf[0].toUpperCase()+Qf.slice(1);Ci(fS,"on"+dS)}Ci(Gp,"onAnimationEnd"),Ci(Vp,"onAnimationIteration"),Ci(kp,"onAnimationStart"),Ci("dblclick","onDoubleClick"),Ci("focusin","onFocus"),Ci("focusout","onBlur"),Ci(Cx,"onTransitionRun"),Ci(wx,"onTransitionStart"),Ci(Dx,"onTransitionCancel"),Ci(Xp,"onTransitionEnd"),k("onMouseEnter",["mouseout","mouseover"]),k("onMouseLeave",["mouseout","mouseover"]),k("onPointerEnter",["pointerout","pointerover"]),k("onPointerLeave",["pointerout","pointerover"]),b("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),b("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),b("onBeforeInput",["compositionend","keypress","textInput","paste"]),b("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),b("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),b("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var No="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),hS=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(No));function fg(t,n){n=(n&4)!==0;for(var a=0;a<t.length;a++){var o=t[a],u=o.event;o=o.listeners;e:{var f=void 0;if(n)for(var v=o.length-1;0<=v;v--){var R=o[v],G=R.instance,ce=R.currentTarget;if(R=R.listener,G!==f&&u.isPropagationStopped())break e;f=R,u.currentTarget=ce;try{f(u)}catch(xe){Sl(xe)}u.currentTarget=null,f=G}else for(v=0;v<o.length;v++){if(R=o[v],G=R.instance,ce=R.currentTarget,R=R.listener,G!==f&&u.isPropagationStopped())break e;f=R,u.currentTarget=ce;try{f(u)}catch(xe){Sl(xe)}u.currentTarget=null,f=G}}}}function gt(t,n){var a=n[cs];a===void 0&&(a=n[cs]=new Set);var o=t+"__bubble";a.has(o)||(dg(n,t,2,!1),a.add(o))}function Jf(t,n,a){var o=0;n&&(o|=4),dg(a,t,o,n)}var rc="_reactListening"+Math.random().toString(36).slice(2);function $f(t){if(!t[rc]){t[rc]=!0,hl.forEach(function(a){a!=="selectionchange"&&(hS.has(a)||Jf(a,!1,t),Jf(a,!0,t))});var n=t.nodeType===9?t:t.ownerDocument;n===null||n[rc]||(n[rc]=!0,Jf("selectionchange",!1,n))}}function dg(t,n,a,o){switch(Gg(n)){case 2:var u=GS;break;case 8:u=VS;break;default:u=pd}a=u.bind(null,n,a,t),u=void 0,!vu||n!=="touchstart"&&n!=="touchmove"&&n!=="wheel"||(u=!0),o?u!==void 0?t.addEventListener(n,a,{capture:!0,passive:u}):t.addEventListener(n,a,!0):u!==void 0?t.addEventListener(n,a,{passive:u}):t.addEventListener(n,a,!1)}function ed(t,n,a,o,u){var f=o;if((n&1)===0&&(n&2)===0&&o!==null)e:for(;;){if(o===null)return;var v=o.tag;if(v===3||v===4){var R=o.stateNode.containerInfo;if(R===u)break;if(v===4)for(v=o.return;v!==null;){var G=v.tag;if((G===3||G===4)&&v.stateNode.containerInfo===u)return;v=v.return}for(;R!==null;){if(v=Ji(R),v===null)return;if(G=v.tag,G===5||G===6||G===26||G===27){o=f=v;continue e}R=R.parentNode}}o=o.return}_p(function(){var ce=f,xe=gu(a),Ee=[];e:{var de=Wp.get(t);if(de!==void 0){var pe=_l,qe=t;switch(t){case"keypress":if(ml(a)===0)break e;case"keydown":case"keyup":pe=rx;break;case"focusin":qe="focus",pe=yu;break;case"focusout":qe="blur",pe=yu;break;case"beforeblur":case"afterblur":pe=yu;break;case"click":if(a.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":pe=Sp;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":pe=jv;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":pe=cx;break;case Gp:case Vp:case kp:pe=Qv;break;case Xp:pe=fx;break;case"scroll":case"scrollend":pe=Yv;break;case"wheel":pe=hx;break;case"copy":case"cut":case"paste":pe=$v;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":pe=yp;break;case"toggle":case"beforetoggle":pe=mx}var et=(n&4)!==0,Vt=!et&&(t==="scroll"||t==="scrollend"),J=et?de!==null?de+"Capture":null:de;et=[];for(var W=ce,le;W!==null;){var Me=W;if(le=Me.stateNode,Me=Me.tag,Me!==5&&Me!==26&&Me!==27||le===null||J===null||(Me=Jr(W,J),Me!=null&&et.push(Uo(W,Me,le))),Vt)break;W=W.return}0<et.length&&(de=new pe(de,qe,null,a,xe),Ee.push({event:de,listeners:et}))}}if((n&7)===0){e:{if(de=t==="mouseover"||t==="pointerover",pe=t==="mouseout"||t==="pointerout",de&&a!==mu&&(qe=a.relatedTarget||a.fromElement)&&(Ji(qe)||qe[Wn]))break e;if((pe||de)&&(de=xe.window===xe?xe:(de=xe.ownerDocument)?de.defaultView||de.parentWindow:window,pe?(qe=a.relatedTarget||a.toElement,pe=ce,qe=qe?Ji(qe):null,qe!==null&&(Vt=c(qe),et=qe.tag,qe!==Vt||et!==5&&et!==27&&et!==6)&&(qe=null)):(pe=null,qe=ce),pe!==qe)){if(et=Sp,Me="onMouseLeave",J="onMouseEnter",W="mouse",(t==="pointerout"||t==="pointerover")&&(et=yp,Me="onPointerLeave",J="onPointerEnter",W="pointer"),Vt=pe==null?de:fs(pe),le=qe==null?de:fs(qe),de=new et(Me,W+"leave",pe,a,xe),de.target=Vt,de.relatedTarget=le,Me=null,Ji(xe)===ce&&(et=new et(J,W+"enter",qe,a,xe),et.target=le,et.relatedTarget=Vt,Me=et),Vt=Me,pe&&qe)t:{for(et=pS,J=pe,W=qe,le=0,Me=J;Me;Me=et(Me))le++;Me=0;for(var Je=W;Je;Je=et(Je))Me++;for(;0<le-Me;)J=et(J),le--;for(;0<Me-le;)W=et(W),Me--;for(;le--;){if(J===W||W!==null&&J===W.alternate){et=J;break t}J=et(J),W=et(W)}et=null}else et=null;pe!==null&&hg(Ee,de,pe,et,!1),qe!==null&&Vt!==null&&hg(Ee,Vt,qe,et,!0)}}e:{if(de=ce?fs(ce):window,pe=de.nodeName&&de.nodeName.toLowerCase(),pe==="select"||pe==="input"&&de.type==="file")var Rt=Dp;else if(Cp(de))if(Np)Rt=bx;else{Rt=Ex;var je=yx}else pe=de.nodeName,!pe||pe.toLowerCase()!=="input"||de.type!=="checkbox"&&de.type!=="radio"?ce&&pi(ce.elementType)&&(Rt=Dp):Rt=Tx;if(Rt&&(Rt=Rt(t,ce))){wp(Ee,Rt,a,xe);break e}je&&je(t,de,ce),t==="focusout"&&ce&&de.type==="number"&&ce.memoizedProps.value!=null&&gn(de,"number",de.value)}switch(je=ce?fs(ce):window,t){case"focusin":(Cp(je)||je.contentEditable==="true")&&(js=je,Cu=ce,ro=null);break;case"focusout":ro=Cu=js=null;break;case"mousedown":wu=!0;break;case"contextmenu":case"mouseup":case"dragend":wu=!1,Fp(Ee,a,xe);break;case"selectionchange":if(Rx)break;case"keydown":case"keyup":Fp(Ee,a,xe)}var ct;if(Tu)e:{switch(t){case"compositionstart":var St="onCompositionStart";break e;case"compositionend":St="onCompositionEnd";break e;case"compositionupdate":St="onCompositionUpdate";break e}St=void 0}else qs?Ap(t,a)&&(St="onCompositionEnd"):t==="keydown"&&a.keyCode===229&&(St="onCompositionStart");St&&(Ep&&a.locale!=="ko"&&(qs||St!=="onCompositionStart"?St==="onCompositionEnd"&&qs&&(ct=vp()):(Na=xe,xu="value"in Na?Na.value:Na.textContent,qs=!0)),je=oc(ce,St),0<je.length&&(St=new Mp(St,t,null,a,xe),Ee.push({event:St,listeners:je}),ct?St.data=ct:(ct=Rp(a),ct!==null&&(St.data=ct)))),(ct=_x?vx(t,a):xx(t,a))&&(St=oc(ce,"onBeforeInput"),0<St.length&&(je=new Mp("onBeforeInput","beforeinput",null,a,xe),Ee.push({event:je,listeners:St}),je.data=ct)),uS(Ee,t,ce,a,xe)}fg(Ee,n)})}function Uo(t,n,a){return{instance:t,listener:n,currentTarget:a}}function oc(t,n){for(var a=n+"Capture",o=[];t!==null;){var u=t,f=u.stateNode;if(u=u.tag,u!==5&&u!==26&&u!==27||f===null||(u=Jr(t,a),u!=null&&o.unshift(Uo(t,u,f)),u=Jr(t,n),u!=null&&o.push(Uo(t,u,f))),t.tag===3)return o;t=t.return}return[]}function pS(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5&&t.tag!==27);return t||null}function hg(t,n,a,o,u){for(var f=n._reactName,v=[];a!==null&&a!==o;){var R=a,G=R.alternate,ce=R.stateNode;if(R=R.tag,G!==null&&G===o)break;R!==5&&R!==26&&R!==27||ce===null||(G=ce,u?(ce=Jr(a,f),ce!=null&&v.unshift(Uo(a,ce,G))):u||(ce=Jr(a,f),ce!=null&&v.push(Uo(a,ce,G)))),a=a.return}v.length!==0&&t.push({event:n,listeners:v})}var mS=/\r\n?/g,gS=/\u0000|\uFFFD/g;function pg(t){return(typeof t=="string"?t:""+t).replace(mS,`
`).replace(gS,"")}function mg(t,n){return n=pg(n),pg(t)===n}function Gt(t,n,a,o,u,f){switch(a){case"children":typeof o=="string"?n==="body"||n==="textarea"&&o===""||Bn(t,o):(typeof o=="number"||typeof o=="bigint")&&n!=="body"&&Bn(t,""+o);break;case"className":Le(t,"class",o);break;case"tabIndex":Le(t,"tabindex",o);break;case"dir":case"role":case"viewBox":case"width":case"height":Le(t,a,o);break;case"style":Kt(t,o,f);break;case"data":if(n!=="object"){Le(t,"data",o);break}case"src":case"href":if(o===""&&(n!=="a"||a!=="href")){t.removeAttribute(a);break}if(o==null||typeof o=="function"||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Ri(""+o),t.setAttribute(a,o);break;case"action":case"formAction":if(typeof o=="function"){t.setAttribute(a,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof f=="function"&&(a==="formAction"?(n!=="input"&&Gt(t,n,"name",u.name,u,null),Gt(t,n,"formEncType",u.formEncType,u,null),Gt(t,n,"formMethod",u.formMethod,u,null),Gt(t,n,"formTarget",u.formTarget,u,null)):(Gt(t,n,"encType",u.encType,u,null),Gt(t,n,"method",u.method,u,null),Gt(t,n,"target",u.target,u,null)));if(o==null||typeof o=="symbol"||typeof o=="boolean"){t.removeAttribute(a);break}o=Ri(""+o),t.setAttribute(a,o);break;case"onClick":o!=null&&(t.onclick=mi);break;case"onScroll":o!=null&&gt("scroll",t);break;case"onScrollEnd":o!=null&&gt("scrollend",t);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"multiple":t.multiple=o&&typeof o!="function"&&typeof o!="symbol";break;case"muted":t.muted=o&&typeof o!="function"&&typeof o!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(o==null||typeof o=="function"||typeof o=="boolean"||typeof o=="symbol"){t.removeAttribute("xlink:href");break}a=Ri(""+o),t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",a);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""+o):t.removeAttribute(a);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":o&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,""):t.removeAttribute(a);break;case"capture":case"download":o===!0?t.setAttribute(a,""):o!==!1&&o!=null&&typeof o!="function"&&typeof o!="symbol"?t.setAttribute(a,o):t.removeAttribute(a);break;case"cols":case"rows":case"size":case"span":o!=null&&typeof o!="function"&&typeof o!="symbol"&&!isNaN(o)&&1<=o?t.setAttribute(a,o):t.removeAttribute(a);break;case"rowSpan":case"start":o==null||typeof o=="function"||typeof o=="symbol"||isNaN(o)?t.removeAttribute(a):t.setAttribute(a,o);break;case"popover":gt("beforetoggle",t),gt("toggle",t),ke(t,"popover",o);break;case"xlinkActuate":He(t,"http://www.w3.org/1999/xlink","xlink:actuate",o);break;case"xlinkArcrole":He(t,"http://www.w3.org/1999/xlink","xlink:arcrole",o);break;case"xlinkRole":He(t,"http://www.w3.org/1999/xlink","xlink:role",o);break;case"xlinkShow":He(t,"http://www.w3.org/1999/xlink","xlink:show",o);break;case"xlinkTitle":He(t,"http://www.w3.org/1999/xlink","xlink:title",o);break;case"xlinkType":He(t,"http://www.w3.org/1999/xlink","xlink:type",o);break;case"xmlBase":He(t,"http://www.w3.org/XML/1998/namespace","xml:base",o);break;case"xmlLang":He(t,"http://www.w3.org/XML/1998/namespace","xml:lang",o);break;case"xmlSpace":He(t,"http://www.w3.org/XML/1998/namespace","xml:space",o);break;case"is":ke(t,"is",o);break;case"innerText":case"textContent":break;default:(!(2<a.length)||a[0]!=="o"&&a[0]!=="O"||a[1]!=="n"&&a[1]!=="N")&&(a=Ft.get(a)||a,ke(t,a,o))}}function td(t,n,a,o,u,f){switch(a){case"style":Kt(t,o,f);break;case"dangerouslySetInnerHTML":if(o!=null){if(typeof o!="object"||!("__html"in o))throw Error(s(61));if(a=o.__html,a!=null){if(u.children!=null)throw Error(s(60));t.innerHTML=a}}break;case"children":typeof o=="string"?Bn(t,o):(typeof o=="number"||typeof o=="bigint")&&Bn(t,""+o);break;case"onScroll":o!=null&&gt("scroll",t);break;case"onScrollEnd":o!=null&&gt("scrollend",t);break;case"onClick":o!=null&&(t.onclick=mi);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!Qr.hasOwnProperty(a))e:{if(a[0]==="o"&&a[1]==="n"&&(u=a.endsWith("Capture"),n=a.slice(2,u?a.length-7:void 0),f=t[An]||null,f=f!=null?f[a]:null,typeof f=="function"&&t.removeEventListener(n,f,u),typeof o=="function")){typeof f!="function"&&f!==null&&(a in t?t[a]=null:t.hasAttribute(a)&&t.removeAttribute(a)),t.addEventListener(n,o,u);break e}a in t?t[a]=o:o===!0?t.setAttribute(a,""):ke(t,a,o)}}}function Dn(t,n,a){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":gt("error",t),gt("load",t);var o=!1,u=!1,f;for(f in a)if(a.hasOwnProperty(f)){var v=a[f];if(v!=null)switch(f){case"src":o=!0;break;case"srcSet":u=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Gt(t,n,f,v,a,null)}}u&&Gt(t,n,"srcSet",a.srcSet,a,null),o&&Gt(t,n,"src",a.src,a,null);return;case"input":gt("invalid",t);var R=f=v=u=null,G=null,ce=null;for(o in a)if(a.hasOwnProperty(o)){var xe=a[o];if(xe!=null)switch(o){case"name":u=xe;break;case"type":v=xe;break;case"checked":G=xe;break;case"defaultChecked":ce=xe;break;case"value":f=xe;break;case"defaultValue":R=xe;break;case"children":case"dangerouslySetInnerHTML":if(xe!=null)throw Error(s(137,n));break;default:Gt(t,n,o,xe,a,null)}}Xe(t,f,R,G,ce,v,u,!1);return;case"select":gt("invalid",t),o=v=f=null;for(u in a)if(a.hasOwnProperty(u)&&(R=a[u],R!=null))switch(u){case"value":f=R;break;case"defaultValue":v=R;break;case"multiple":o=R;default:Gt(t,n,u,R,a,null)}n=f,a=v,t.multiple=!!o,n!=null?ft(t,!!o,n,!1):a!=null&&ft(t,!!o,a,!0);return;case"textarea":gt("invalid",t),f=u=o=null;for(v in a)if(a.hasOwnProperty(v)&&(R=a[v],R!=null))switch(v){case"value":o=R;break;case"defaultValue":u=R;break;case"children":f=R;break;case"dangerouslySetInnerHTML":if(R!=null)throw Error(s(91));break;default:Gt(t,n,v,R,a,null)}ni(t,o,u,f);return;case"option":for(G in a)a.hasOwnProperty(G)&&(o=a[G],o!=null)&&(G==="selected"?t.selected=o&&typeof o!="function"&&typeof o!="symbol":Gt(t,n,G,o,a,null));return;case"dialog":gt("beforetoggle",t),gt("toggle",t),gt("cancel",t),gt("close",t);break;case"iframe":case"object":gt("load",t);break;case"video":case"audio":for(o=0;o<No.length;o++)gt(No[o],t);break;case"image":gt("error",t),gt("load",t);break;case"details":gt("toggle",t);break;case"embed":case"source":case"link":gt("error",t),gt("load",t);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(ce in a)if(a.hasOwnProperty(ce)&&(o=a[ce],o!=null))switch(ce){case"children":case"dangerouslySetInnerHTML":throw Error(s(137,n));default:Gt(t,n,ce,o,a,null)}return;default:if(pi(n)){for(xe in a)a.hasOwnProperty(xe)&&(o=a[xe],o!==void 0&&td(t,n,xe,o,a,void 0));return}}for(R in a)a.hasOwnProperty(R)&&(o=a[R],o!=null&&Gt(t,n,R,o,a,null))}function _S(t,n,a,o){switch(n){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var u=null,f=null,v=null,R=null,G=null,ce=null,xe=null;for(pe in a){var Ee=a[pe];if(a.hasOwnProperty(pe)&&Ee!=null)switch(pe){case"checked":break;case"value":break;case"defaultValue":G=Ee;default:o.hasOwnProperty(pe)||Gt(t,n,pe,null,o,Ee)}}for(var de in o){var pe=o[de];if(Ee=a[de],o.hasOwnProperty(de)&&(pe!=null||Ee!=null))switch(de){case"type":f=pe;break;case"name":u=pe;break;case"checked":ce=pe;break;case"defaultChecked":xe=pe;break;case"value":v=pe;break;case"defaultValue":R=pe;break;case"children":case"dangerouslySetInnerHTML":if(pe!=null)throw Error(s(137,n));break;default:pe!==Ee&&Gt(t,n,de,pe,o,Ee)}}un(t,v,R,G,ce,xe,f,u);return;case"select":pe=v=R=de=null;for(f in a)if(G=a[f],a.hasOwnProperty(f)&&G!=null)switch(f){case"value":break;case"multiple":pe=G;default:o.hasOwnProperty(f)||Gt(t,n,f,null,o,G)}for(u in o)if(f=o[u],G=a[u],o.hasOwnProperty(u)&&(f!=null||G!=null))switch(u){case"value":de=f;break;case"defaultValue":R=f;break;case"multiple":v=f;default:f!==G&&Gt(t,n,u,f,o,G)}n=R,a=v,o=pe,de!=null?ft(t,!!a,de,!1):!!o!=!!a&&(n!=null?ft(t,!!a,n,!0):ft(t,!!a,a?[]:"",!1));return;case"textarea":pe=de=null;for(R in a)if(u=a[R],a.hasOwnProperty(R)&&u!=null&&!o.hasOwnProperty(R))switch(R){case"value":break;case"children":break;default:Gt(t,n,R,null,o,u)}for(v in o)if(u=o[v],f=a[v],o.hasOwnProperty(v)&&(u!=null||f!=null))switch(v){case"value":de=u;break;case"defaultValue":pe=u;break;case"children":break;case"dangerouslySetInnerHTML":if(u!=null)throw Error(s(91));break;default:u!==f&&Gt(t,n,v,u,o,f)}zn(t,de,pe);return;case"option":for(var qe in a)de=a[qe],a.hasOwnProperty(qe)&&de!=null&&!o.hasOwnProperty(qe)&&(qe==="selected"?t.selected=!1:Gt(t,n,qe,null,o,de));for(G in o)de=o[G],pe=a[G],o.hasOwnProperty(G)&&de!==pe&&(de!=null||pe!=null)&&(G==="selected"?t.selected=de&&typeof de!="function"&&typeof de!="symbol":Gt(t,n,G,de,o,pe));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var et in a)de=a[et],a.hasOwnProperty(et)&&de!=null&&!o.hasOwnProperty(et)&&Gt(t,n,et,null,o,de);for(ce in o)if(de=o[ce],pe=a[ce],o.hasOwnProperty(ce)&&de!==pe&&(de!=null||pe!=null))switch(ce){case"children":case"dangerouslySetInnerHTML":if(de!=null)throw Error(s(137,n));break;default:Gt(t,n,ce,de,o,pe)}return;default:if(pi(n)){for(var Vt in a)de=a[Vt],a.hasOwnProperty(Vt)&&de!==void 0&&!o.hasOwnProperty(Vt)&&td(t,n,Vt,void 0,o,de);for(xe in o)de=o[xe],pe=a[xe],!o.hasOwnProperty(xe)||de===pe||de===void 0&&pe===void 0||td(t,n,xe,de,o,pe);return}}for(var J in a)de=a[J],a.hasOwnProperty(J)&&de!=null&&!o.hasOwnProperty(J)&&Gt(t,n,J,null,o,de);for(Ee in o)de=o[Ee],pe=a[Ee],!o.hasOwnProperty(Ee)||de===pe||de==null&&pe==null||Gt(t,n,Ee,de,o,pe)}function gg(t){switch(t){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function vS(){if(typeof performance.getEntriesByType=="function"){for(var t=0,n=0,a=performance.getEntriesByType("resource"),o=0;o<a.length;o++){var u=a[o],f=u.transferSize,v=u.initiatorType,R=u.duration;if(f&&R&&gg(v)){for(v=0,R=u.responseEnd,o+=1;o<a.length;o++){var G=a[o],ce=G.startTime;if(ce>R)break;var xe=G.transferSize,Ee=G.initiatorType;xe&&gg(Ee)&&(G=G.responseEnd,v+=xe*(G<R?1:(R-ce)/(G-ce)))}if(--o,n+=8*(f+v)/(u.duration/1e3),t++,10<t)break}}if(0<t)return n/t/1e6}return navigator.connection&&(t=navigator.connection.downlink,typeof t=="number")?t:5}var nd=null,id=null;function lc(t){return t.nodeType===9?t:t.ownerDocument}function _g(t){switch(t){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function vg(t,n){if(t===0)switch(n){case"svg":return 1;case"math":return 2;default:return 0}return t===1&&n==="foreignObject"?0:t}function ad(t,n){return t==="textarea"||t==="noscript"||typeof n.children=="string"||typeof n.children=="number"||typeof n.children=="bigint"||typeof n.dangerouslySetInnerHTML=="object"&&n.dangerouslySetInnerHTML!==null&&n.dangerouslySetInnerHTML.__html!=null}var sd=null;function xS(){var t=window.event;return t&&t.type==="popstate"?t===sd?!1:(sd=t,!0):(sd=null,!1)}var xg=typeof setTimeout=="function"?setTimeout:void 0,SS=typeof clearTimeout=="function"?clearTimeout:void 0,Sg=typeof Promise=="function"?Promise:void 0,MS=typeof queueMicrotask=="function"?queueMicrotask:typeof Sg<"u"?function(t){return Sg.resolve(null).then(t).catch(yS)}:xg;function yS(t){setTimeout(function(){throw t})}function ja(t){return t==="head"}function Mg(t,n){var a=n,o=0;do{var u=a.nextSibling;if(t.removeChild(a),u&&u.nodeType===8)if(a=u.data,a==="/$"||a==="/&"){if(o===0){t.removeChild(u),Mr(n);return}o--}else if(a==="$"||a==="$?"||a==="$~"||a==="$!"||a==="&")o++;else if(a==="html")Lo(t.ownerDocument.documentElement);else if(a==="head"){a=t.ownerDocument.head,Lo(a);for(var f=a.firstChild;f;){var v=f.nextSibling,R=f.nodeName;f[Ra]||R==="SCRIPT"||R==="STYLE"||R==="LINK"&&f.rel.toLowerCase()==="stylesheet"||a.removeChild(f),f=v}}else a==="body"&&Lo(t.ownerDocument.body);a=u}while(a);Mr(n)}function yg(t,n){var a=t;t=0;do{var o=a.nextSibling;if(a.nodeType===1?n?(a._stashedDisplay=a.style.display,a.style.display="none"):(a.style.display=a._stashedDisplay||"",a.getAttribute("style")===""&&a.removeAttribute("style")):a.nodeType===3&&(n?(a._stashedText=a.nodeValue,a.nodeValue=""):a.nodeValue=a._stashedText||""),o&&o.nodeType===8)if(a=o.data,a==="/$"){if(t===0)break;t--}else a!=="$"&&a!=="$?"&&a!=="$~"&&a!=="$!"||t++;a=o}while(a)}function rd(t){var n=t.firstChild;for(n&&n.nodeType===10&&(n=n.nextSibling);n;){var a=n;switch(n=n.nextSibling,a.nodeName){case"HTML":case"HEAD":case"BODY":rd(a),Ca(a);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(a.rel.toLowerCase()==="stylesheet")continue}t.removeChild(a)}}function ES(t,n,a,o){for(;t.nodeType===1;){var u=a;if(t.nodeName.toLowerCase()!==n.toLowerCase()){if(!o&&(t.nodeName!=="INPUT"||t.type!=="hidden"))break}else if(o){if(!t[Ra])switch(n){case"meta":if(!t.hasAttribute("itemprop"))break;return t;case"link":if(f=t.getAttribute("rel"),f==="stylesheet"&&t.hasAttribute("data-precedence"))break;if(f!==u.rel||t.getAttribute("href")!==(u.href==null||u.href===""?null:u.href)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin)||t.getAttribute("title")!==(u.title==null?null:u.title))break;return t;case"style":if(t.hasAttribute("data-precedence"))break;return t;case"script":if(f=t.getAttribute("src"),(f!==(u.src==null?null:u.src)||t.getAttribute("type")!==(u.type==null?null:u.type)||t.getAttribute("crossorigin")!==(u.crossOrigin==null?null:u.crossOrigin))&&f&&t.hasAttribute("async")&&!t.hasAttribute("itemprop"))break;return t;default:return t}}else if(n==="input"&&t.type==="hidden"){var f=u.name==null?null:""+u.name;if(u.type==="hidden"&&t.getAttribute("name")===f)return t}else return t;if(t=yi(t.nextSibling),t===null)break}return null}function TS(t,n,a){if(n==="")return null;for(;t.nodeType!==3;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!a||(t=yi(t.nextSibling),t===null))return null;return t}function Eg(t,n){for(;t.nodeType!==8;)if((t.nodeType!==1||t.nodeName!=="INPUT"||t.type!=="hidden")&&!n||(t=yi(t.nextSibling),t===null))return null;return t}function od(t){return t.data==="$?"||t.data==="$~"}function ld(t){return t.data==="$!"||t.data==="$?"&&t.ownerDocument.readyState!=="loading"}function bS(t,n){var a=t.ownerDocument;if(t.data==="$~")t._reactRetry=n;else if(t.data!=="$?"||a.readyState!=="loading")n();else{var o=function(){n(),a.removeEventListener("DOMContentLoaded",o)};a.addEventListener("DOMContentLoaded",o),t._reactRetry=o}}function yi(t){for(;t!=null;t=t.nextSibling){var n=t.nodeType;if(n===1||n===3)break;if(n===8){if(n=t.data,n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"||n==="F!"||n==="F")break;if(n==="/$"||n==="/&")return null}}return t}var cd=null;function Tg(t){t=t.nextSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="/$"||a==="/&"){if(n===0)return yi(t.nextSibling);n--}else a!=="$"&&a!=="$!"&&a!=="$?"&&a!=="$~"&&a!=="&"||n++}t=t.nextSibling}return null}function bg(t){t=t.previousSibling;for(var n=0;t;){if(t.nodeType===8){var a=t.data;if(a==="$"||a==="$!"||a==="$?"||a==="$~"||a==="&"){if(n===0)return t;n--}else a!=="/$"&&a!=="/&"||n++}t=t.previousSibling}return null}function Ag(t,n,a){switch(n=lc(a),t){case"html":if(t=n.documentElement,!t)throw Error(s(452));return t;case"head":if(t=n.head,!t)throw Error(s(453));return t;case"body":if(t=n.body,!t)throw Error(s(454));return t;default:throw Error(s(451))}}function Lo(t){for(var n=t.attributes;n.length;)t.removeAttributeNode(n[0]);Ca(t)}var Ei=new Map,Rg=new Set;function cc(t){return typeof t.getRootNode=="function"?t.getRootNode():t.nodeType===9?t:t.ownerDocument}var ma=V.d;V.d={f:AS,r:RS,D:CS,C:wS,L:DS,m:NS,X:LS,S:US,M:OS};function AS(){var t=ma.f(),n=ec();return t||n}function RS(t){var n=$i(t);n!==null&&n.tag===5&&n.type==="form"?Xm(n):ma.r(t)}var vr=typeof document>"u"?null:document;function Cg(t,n,a){var o=vr;if(o&&typeof n=="string"&&n){var u=ut(n);u='link[rel="'+t+'"][href="'+u+'"]',typeof a=="string"&&(u+='[crossorigin="'+a+'"]'),Rg.has(u)||(Rg.add(u),t={rel:t,crossOrigin:a,href:n},o.querySelector(u)===null&&(n=o.createElement("link"),Dn(n,"link",t),cn(n),o.head.appendChild(n)))}}function CS(t){ma.D(t),Cg("dns-prefetch",t,null)}function wS(t,n){ma.C(t,n),Cg("preconnect",t,n)}function DS(t,n,a){ma.L(t,n,a);var o=vr;if(o&&t&&n){var u='link[rel="preload"][as="'+ut(n)+'"]';n==="image"&&a&&a.imageSrcSet?(u+='[imagesrcset="'+ut(a.imageSrcSet)+'"]',typeof a.imageSizes=="string"&&(u+='[imagesizes="'+ut(a.imageSizes)+'"]')):u+='[href="'+ut(t)+'"]';var f=u;switch(n){case"style":f=xr(t);break;case"script":f=Sr(t)}Ei.has(f)||(t=S({rel:"preload",href:n==="image"&&a&&a.imageSrcSet?void 0:t,as:n},a),Ei.set(f,t),o.querySelector(u)!==null||n==="style"&&o.querySelector(Oo(f))||n==="script"&&o.querySelector(Po(f))||(n=o.createElement("link"),Dn(n,"link",t),cn(n),o.head.appendChild(n)))}}function NS(t,n){ma.m(t,n);var a=vr;if(a&&t){var o=n&&typeof n.as=="string"?n.as:"script",u='link[rel="modulepreload"][as="'+ut(o)+'"][href="'+ut(t)+'"]',f=u;switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":f=Sr(t)}if(!Ei.has(f)&&(t=S({rel:"modulepreload",href:t},n),Ei.set(f,t),a.querySelector(u)===null)){switch(o){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(a.querySelector(Po(f)))return}o=a.createElement("link"),Dn(o,"link",t),cn(o),a.head.appendChild(o)}}}function US(t,n,a){ma.S(t,n,a);var o=vr;if(o&&t){var u=wa(o).hoistableStyles,f=xr(t);n=n||"default";var v=u.get(f);if(!v){var R={loading:0,preload:null};if(v=o.querySelector(Oo(f)))R.loading=5;else{t=S({rel:"stylesheet",href:t,"data-precedence":n},a),(a=Ei.get(f))&&ud(t,a);var G=v=o.createElement("link");cn(G),Dn(G,"link",t),G._p=new Promise(function(ce,xe){G.onload=ce,G.onerror=xe}),G.addEventListener("load",function(){R.loading|=1}),G.addEventListener("error",function(){R.loading|=2}),R.loading|=4,uc(v,n,o)}v={type:"stylesheet",instance:v,count:1,state:R},u.set(f,v)}}}function LS(t,n){ma.X(t,n);var a=vr;if(a&&t){var o=wa(a).hoistableScripts,u=Sr(t),f=o.get(u);f||(f=a.querySelector(Po(u)),f||(t=S({src:t,async:!0},n),(n=Ei.get(u))&&fd(t,n),f=a.createElement("script"),cn(f),Dn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function OS(t,n){ma.M(t,n);var a=vr;if(a&&t){var o=wa(a).hoistableScripts,u=Sr(t),f=o.get(u);f||(f=a.querySelector(Po(u)),f||(t=S({src:t,async:!0,type:"module"},n),(n=Ei.get(u))&&fd(t,n),f=a.createElement("script"),cn(f),Dn(f,"link",t),a.head.appendChild(f)),f={type:"script",instance:f,count:1,state:null},o.set(u,f))}}function wg(t,n,a,o){var u=(u=Fe.current)?cc(u):null;if(!u)throw Error(s(446));switch(t){case"meta":case"title":return null;case"style":return typeof a.precedence=="string"&&typeof a.href=="string"?(n=xr(a.href),a=wa(u).hoistableStyles,o=a.get(n),o||(o={type:"style",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};case"link":if(a.rel==="stylesheet"&&typeof a.href=="string"&&typeof a.precedence=="string"){t=xr(a.href);var f=wa(u).hoistableStyles,v=f.get(t);if(v||(u=u.ownerDocument||u,v={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},f.set(t,v),(f=u.querySelector(Oo(t)))&&!f._p&&(v.instance=f,v.state.loading=5),Ei.has(t)||(a={rel:"preload",as:"style",href:a.href,crossOrigin:a.crossOrigin,integrity:a.integrity,media:a.media,hrefLang:a.hrefLang,referrerPolicy:a.referrerPolicy},Ei.set(t,a),f||PS(u,t,a,v.state))),n&&o===null)throw Error(s(528,""));return v}if(n&&o!==null)throw Error(s(529,""));return null;case"script":return n=a.async,a=a.src,typeof a=="string"&&n&&typeof n!="function"&&typeof n!="symbol"?(n=Sr(a),a=wa(u).hoistableScripts,o=a.get(n),o||(o={type:"script",instance:null,count:0,state:null},a.set(n,o)),o):{type:"void",instance:null,count:0,state:null};default:throw Error(s(444,t))}}function xr(t){return'href="'+ut(t)+'"'}function Oo(t){return'link[rel="stylesheet"]['+t+"]"}function Dg(t){return S({},t,{"data-precedence":t.precedence,precedence:null})}function PS(t,n,a,o){t.querySelector('link[rel="preload"][as="style"]['+n+"]")?o.loading=1:(n=t.createElement("link"),o.preload=n,n.addEventListener("load",function(){return o.loading|=1}),n.addEventListener("error",function(){return o.loading|=2}),Dn(n,"link",a),cn(n),t.head.appendChild(n))}function Sr(t){return'[src="'+ut(t)+'"]'}function Po(t){return"script[async]"+t}function Ng(t,n,a){if(n.count++,n.instance===null)switch(n.type){case"style":var o=t.querySelector('style[data-href~="'+ut(a.href)+'"]');if(o)return n.instance=o,cn(o),o;var u=S({},a,{"data-href":a.href,"data-precedence":a.precedence,href:null,precedence:null});return o=(t.ownerDocument||t).createElement("style"),cn(o),Dn(o,"style",u),uc(o,a.precedence,t),n.instance=o;case"stylesheet":u=xr(a.href);var f=t.querySelector(Oo(u));if(f)return n.state.loading|=4,n.instance=f,cn(f),f;o=Dg(a),(u=Ei.get(u))&&ud(o,u),f=(t.ownerDocument||t).createElement("link"),cn(f);var v=f;return v._p=new Promise(function(R,G){v.onload=R,v.onerror=G}),Dn(f,"link",o),n.state.loading|=4,uc(f,a.precedence,t),n.instance=f;case"script":return f=Sr(a.src),(u=t.querySelector(Po(f)))?(n.instance=u,cn(u),u):(o=a,(u=Ei.get(f))&&(o=S({},a),fd(o,u)),t=t.ownerDocument||t,u=t.createElement("script"),cn(u),Dn(u,"link",o),t.head.appendChild(u),n.instance=u);case"void":return null;default:throw Error(s(443,n.type))}else n.type==="stylesheet"&&(n.state.loading&4)===0&&(o=n.instance,n.state.loading|=4,uc(o,a.precedence,t));return n.instance}function uc(t,n,a){for(var o=a.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),u=o.length?o[o.length-1]:null,f=u,v=0;v<o.length;v++){var R=o[v];if(R.dataset.precedence===n)f=R;else if(f!==u)break}f?f.parentNode.insertBefore(t,f.nextSibling):(n=a.nodeType===9?a.head:a,n.insertBefore(t,n.firstChild))}function ud(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.title==null&&(t.title=n.title)}function fd(t,n){t.crossOrigin==null&&(t.crossOrigin=n.crossOrigin),t.referrerPolicy==null&&(t.referrerPolicy=n.referrerPolicy),t.integrity==null&&(t.integrity=n.integrity)}var fc=null;function Ug(t,n,a){if(fc===null){var o=new Map,u=fc=new Map;u.set(a,o)}else u=fc,o=u.get(a),o||(o=new Map,u.set(a,o));if(o.has(t))return o;for(o.set(t,null),a=a.getElementsByTagName(t),u=0;u<a.length;u++){var f=a[u];if(!(f[Ra]||f[ln]||t==="link"&&f.getAttribute("rel")==="stylesheet")&&f.namespaceURI!=="http://www.w3.org/2000/svg"){var v=f.getAttribute(n)||"";v=t+v;var R=o.get(v);R?R.push(f):o.set(v,[f])}}return o}function Lg(t,n,a){t=t.ownerDocument||t,t.head.insertBefore(a,n==="title"?t.querySelector("head > title"):null)}function IS(t,n,a){if(a===1||n.itemProp!=null)return!1;switch(t){case"meta":case"title":return!0;case"style":if(typeof n.precedence!="string"||typeof n.href!="string"||n.href==="")break;return!0;case"link":if(typeof n.rel!="string"||typeof n.href!="string"||n.href===""||n.onLoad||n.onError)break;return n.rel==="stylesheet"?(t=n.disabled,typeof n.precedence=="string"&&t==null):!0;case"script":if(n.async&&typeof n.async!="function"&&typeof n.async!="symbol"&&!n.onLoad&&!n.onError&&n.src&&typeof n.src=="string")return!0}return!1}function Og(t){return!(t.type==="stylesheet"&&(t.state.loading&3)===0)}function zS(t,n,a,o){if(a.type==="stylesheet"&&(typeof o.media!="string"||matchMedia(o.media).matches!==!1)&&(a.state.loading&4)===0){if(a.instance===null){var u=xr(o.href),f=n.querySelector(Oo(u));if(f){n=f._p,n!==null&&typeof n=="object"&&typeof n.then=="function"&&(t.count++,t=dc.bind(t),n.then(t,t)),a.state.loading|=4,a.instance=f,cn(f);return}f=n.ownerDocument||n,o=Dg(o),(u=Ei.get(u))&&ud(o,u),f=f.createElement("link"),cn(f);var v=f;v._p=new Promise(function(R,G){v.onload=R,v.onerror=G}),Dn(f,"link",o),a.instance=f}t.stylesheets===null&&(t.stylesheets=new Map),t.stylesheets.set(a,n),(n=a.state.preload)&&(a.state.loading&3)===0&&(t.count++,a=dc.bind(t),n.addEventListener("load",a),n.addEventListener("error",a))}}var dd=0;function BS(t,n){return t.stylesheets&&t.count===0&&pc(t,t.stylesheets),0<t.count||0<t.imgCount?function(a){var o=setTimeout(function(){if(t.stylesheets&&pc(t,t.stylesheets),t.unsuspend){var f=t.unsuspend;t.unsuspend=null,f()}},6e4+n);0<t.imgBytes&&dd===0&&(dd=62500*vS());var u=setTimeout(function(){if(t.waitingForImages=!1,t.count===0&&(t.stylesheets&&pc(t,t.stylesheets),t.unsuspend)){var f=t.unsuspend;t.unsuspend=null,f()}},(t.imgBytes>dd?50:800)+n);return t.unsuspend=a,function(){t.unsuspend=null,clearTimeout(o),clearTimeout(u)}}:null}function dc(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)pc(this,this.stylesheets);else if(this.unsuspend){var t=this.unsuspend;this.unsuspend=null,t()}}}var hc=null;function pc(t,n){t.stylesheets=null,t.unsuspend!==null&&(t.count++,hc=new Map,n.forEach(FS,t),hc=null,dc.call(t))}function FS(t,n){if(!(n.state.loading&4)){var a=hc.get(t);if(a)var o=a.get(null);else{a=new Map,hc.set(t,a);for(var u=t.querySelectorAll("link[data-precedence],style[data-precedence]"),f=0;f<u.length;f++){var v=u[f];(v.nodeName==="LINK"||v.getAttribute("media")!=="not all")&&(a.set(v.dataset.precedence,v),o=v)}o&&a.set(null,o)}u=n.instance,v=u.getAttribute("data-precedence"),f=a.get(v)||o,f===o&&a.set(null,u),a.set(v,u),this.count++,o=dc.bind(this),u.addEventListener("load",o),u.addEventListener("error",o),f?f.parentNode.insertBefore(u,f.nextSibling):(t=t.nodeType===9?t.head:t,t.insertBefore(u,t.firstChild)),n.state.loading|=4}}var Io={$$typeof:O,Provider:null,Consumer:null,_currentValue:fe,_currentValue2:fe,_threadCount:0};function HS(t,n,a,o,u,f,v,R,G){this.tag=1,this.containerInfo=t,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Ze(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Ze(0),this.hiddenUpdates=Ze(null),this.identifierPrefix=o,this.onUncaughtError=u,this.onCaughtError=f,this.onRecoverableError=v,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=G,this.incompleteTransitions=new Map}function Pg(t,n,a,o,u,f,v,R,G,ce,xe,Ee){return t=new HS(t,n,a,v,G,ce,xe,Ee,R),n=1,f===!0&&(n|=24),f=ai(3,null,null,n),t.current=f,f.stateNode=t,n=Xu(),n.refCount++,t.pooledCache=n,n.refCount++,f.memoizedState={element:o,isDehydrated:a,cache:n},ju(f),t}function Ig(t){return t?(t=Qs,t):Qs}function zg(t,n,a,o,u,f){u=Ig(u),o.context===null?o.context=u:o.pendingContext=u,o=za(n),o.payload={element:a},f=f===void 0?null:f,f!==null&&(o.callback=f),a=Ba(t,o,n),a!==null&&(Qn(a,t,n),po(a,t,n))}function Bg(t,n){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var a=t.retryLane;t.retryLane=a!==0&&a<n?a:n}}function hd(t,n){Bg(t,n),(t=t.alternate)&&Bg(t,n)}function Fg(t){if(t.tag===13||t.tag===31){var n=ms(t,67108864);n!==null&&Qn(n,t,67108864),hd(t,67108864)}}function Hg(t){if(t.tag===13||t.tag===31){var n=ci();n=jr(n);var a=ms(t,n);a!==null&&Qn(a,t,n),hd(t,n)}}var mc=!0;function GS(t,n,a,o){var u=N.T;N.T=null;var f=V.p;try{V.p=2,pd(t,n,a,o)}finally{V.p=f,N.T=u}}function VS(t,n,a,o){var u=N.T;N.T=null;var f=V.p;try{V.p=8,pd(t,n,a,o)}finally{V.p=f,N.T=u}}function pd(t,n,a,o){if(mc){var u=md(o);if(u===null)ed(t,n,o,gc,a),Vg(t,o);else if(XS(u,t,n,a,o))o.stopPropagation();else if(Vg(t,o),n&4&&-1<kS.indexOf(t)){for(;u!==null;){var f=$i(u);if(f!==null)switch(f.tag){case 3:if(f=f.stateNode,f.current.memoizedState.isDehydrated){var v=Ce(f.pendingLanes);if(v!==0){var R=f;for(R.pendingLanes|=2,R.entangledLanes|=2;v;){var G=1<<31-Ve(v);R.entanglements[1]|=G,v&=~G}ki(f),(Ut&6)===0&&(Jl=Ot()+500,Do(0))}}break;case 31:case 13:R=ms(f,2),R!==null&&Qn(R,f,2),ec(),hd(f,2)}if(f=md(o),f===null&&ed(t,n,o,gc,a),f===u)break;u=f}u!==null&&o.stopPropagation()}else ed(t,n,o,null,a)}}function md(t){return t=gu(t),gd(t)}var gc=null;function gd(t){if(gc=null,t=Ji(t),t!==null){var n=c(t);if(n===null)t=null;else{var a=n.tag;if(a===13){if(t=d(n),t!==null)return t;t=null}else if(a===31){if(t=p(n),t!==null)return t;t=null}else if(a===3){if(n.stateNode.current.memoizedState.isDehydrated)return n.tag===3?n.stateNode.containerInfo:null;t=null}else n!==t&&(t=null)}}return gc=t,null}function Gg(t){switch(t){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(Dt()){case B:return 2;case M:return 8;case te:case ue:return 32;case ge:return 268435456;default:return 32}default:return 32}}var _d=!1,Za=null,Ka=null,Qa=null,zo=new Map,Bo=new Map,Ja=[],kS="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function Vg(t,n){switch(t){case"focusin":case"focusout":Za=null;break;case"dragenter":case"dragleave":Ka=null;break;case"mouseover":case"mouseout":Qa=null;break;case"pointerover":case"pointerout":zo.delete(n.pointerId);break;case"gotpointercapture":case"lostpointercapture":Bo.delete(n.pointerId)}}function Fo(t,n,a,o,u,f){return t===null||t.nativeEvent!==f?(t={blockedOn:n,domEventName:a,eventSystemFlags:o,nativeEvent:f,targetContainers:[u]},n!==null&&(n=$i(n),n!==null&&Fg(n)),t):(t.eventSystemFlags|=o,n=t.targetContainers,u!==null&&n.indexOf(u)===-1&&n.push(u),t)}function XS(t,n,a,o,u){switch(n){case"focusin":return Za=Fo(Za,t,n,a,o,u),!0;case"dragenter":return Ka=Fo(Ka,t,n,a,o,u),!0;case"mouseover":return Qa=Fo(Qa,t,n,a,o,u),!0;case"pointerover":var f=u.pointerId;return zo.set(f,Fo(zo.get(f)||null,t,n,a,o,u)),!0;case"gotpointercapture":return f=u.pointerId,Bo.set(f,Fo(Bo.get(f)||null,t,n,a,o,u)),!0}return!1}function kg(t){var n=Ji(t.target);if(n!==null){var a=c(n);if(a!==null){if(n=a.tag,n===13){if(n=d(a),n!==null){t.blockedOn=n,Xs(t.priority,function(){Hg(a)});return}}else if(n===31){if(n=p(a),n!==null){t.blockedOn=n,Xs(t.priority,function(){Hg(a)});return}}else if(n===3&&a.stateNode.current.memoizedState.isDehydrated){t.blockedOn=a.tag===3?a.stateNode.containerInfo:null;return}}}t.blockedOn=null}function _c(t){if(t.blockedOn!==null)return!1;for(var n=t.targetContainers;0<n.length;){var a=md(t.nativeEvent);if(a===null){a=t.nativeEvent;var o=new a.constructor(a.type,a);mu=o,a.target.dispatchEvent(o),mu=null}else return n=$i(a),n!==null&&Fg(n),t.blockedOn=a,!1;n.shift()}return!0}function Xg(t,n,a){_c(t)&&a.delete(n)}function WS(){_d=!1,Za!==null&&_c(Za)&&(Za=null),Ka!==null&&_c(Ka)&&(Ka=null),Qa!==null&&_c(Qa)&&(Qa=null),zo.forEach(Xg),Bo.forEach(Xg)}function vc(t,n){t.blockedOn===n&&(t.blockedOn=null,_d||(_d=!0,r.unstable_scheduleCallback(r.unstable_NormalPriority,WS)))}var xc=null;function Wg(t){xc!==t&&(xc=t,r.unstable_scheduleCallback(r.unstable_NormalPriority,function(){xc===t&&(xc=null);for(var n=0;n<t.length;n+=3){var a=t[n],o=t[n+1],u=t[n+2];if(typeof o!="function"){if(gd(o||a)===null)continue;break}var f=$i(a);f!==null&&(t.splice(n,3),n-=3,mf(f,{pending:!0,data:u,method:a.method,action:o},o,u))}}))}function Mr(t){function n(G){return vc(G,t)}Za!==null&&vc(Za,t),Ka!==null&&vc(Ka,t),Qa!==null&&vc(Qa,t),zo.forEach(n),Bo.forEach(n);for(var a=0;a<Ja.length;a++){var o=Ja[a];o.blockedOn===t&&(o.blockedOn=null)}for(;0<Ja.length&&(a=Ja[0],a.blockedOn===null);)kg(a),a.blockedOn===null&&Ja.shift();if(a=(t.ownerDocument||t).$$reactFormReplay,a!=null)for(o=0;o<a.length;o+=3){var u=a[o],f=a[o+1],v=u[An]||null;if(typeof f=="function")v||Wg(a);else if(v){var R=null;if(f&&f.hasAttribute("formAction")){if(u=f,v=f[An]||null)R=v.formAction;else if(gd(u)!==null)continue}else R=v.action;typeof R=="function"?a[o+1]=R:(a.splice(o,3),o-=3),Wg(a)}}}function Yg(){function t(f){f.canIntercept&&f.info==="react-transition"&&f.intercept({handler:function(){return new Promise(function(v){return u=v})},focusReset:"manual",scroll:"manual"})}function n(){u!==null&&(u(),u=null),o||setTimeout(a,20)}function a(){if(!o&&!navigation.transition){var f=navigation.currentEntry;f&&f.url!=null&&navigation.navigate(f.url,{state:f.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var o=!1,u=null;return navigation.addEventListener("navigate",t),navigation.addEventListener("navigatesuccess",n),navigation.addEventListener("navigateerror",n),setTimeout(a,100),function(){o=!0,navigation.removeEventListener("navigate",t),navigation.removeEventListener("navigatesuccess",n),navigation.removeEventListener("navigateerror",n),u!==null&&(u(),u=null)}}}function vd(t){this._internalRoot=t}Sc.prototype.render=vd.prototype.render=function(t){var n=this._internalRoot;if(n===null)throw Error(s(409));var a=n.current,o=ci();zg(a,o,t,n,null,null)},Sc.prototype.unmount=vd.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var n=t.containerInfo;zg(t.current,2,null,t,null,null),ec(),n[Wn]=null}};function Sc(t){this._internalRoot=t}Sc.prototype.unstable_scheduleHydration=function(t){if(t){var n=Kr();t={blockedOn:null,target:t,priority:n};for(var a=0;a<Ja.length&&n!==0&&n<Ja[a].priority;a++);Ja.splice(a,0,t),a===0&&kg(t)}};var qg=e.version;if(qg!=="19.2.0")throw Error(s(527,qg,"19.2.0"));V.findDOMNode=function(t){var n=t._reactInternals;if(n===void 0)throw typeof t.render=="function"?Error(s(188)):(t=Object.keys(t).join(","),Error(s(268,t)));return t=h(n),t=t!==null?x(t):null,t=t===null?null:t.stateNode,t};var YS={bundleType:0,version:"19.2.0",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.2.0"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Mc=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Mc.isDisabled&&Mc.supportsFiber)try{_e=Mc.inject(YS),ve=Mc}catch{}}return Go.createRoot=function(t,n){if(!l(t))throw Error(s(299));var a=!1,o="",u=e0,f=t0,v=n0;return n!=null&&(n.unstable_strictMode===!0&&(a=!0),n.identifierPrefix!==void 0&&(o=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(v=n.onRecoverableError)),n=Pg(t,1,!1,null,null,a,o,null,u,f,v,Yg),t[Wn]=n.current,$f(t),new vd(n)},Go.hydrateRoot=function(t,n,a){if(!l(t))throw Error(s(299));var o=!1,u="",f=e0,v=t0,R=n0,G=null;return a!=null&&(a.unstable_strictMode===!0&&(o=!0),a.identifierPrefix!==void 0&&(u=a.identifierPrefix),a.onUncaughtError!==void 0&&(f=a.onUncaughtError),a.onCaughtError!==void 0&&(v=a.onCaughtError),a.onRecoverableError!==void 0&&(R=a.onRecoverableError),a.formState!==void 0&&(G=a.formState)),n=Pg(t,1,!0,n,a??null,o,u,G,f,v,R,Yg),n.context=Ig(null),a=n.current,o=ci(),o=jr(o),u=za(o),u.callback=null,Ba(a,u,o),a=o,n.current.lanes=a,We(n,a),ki(n),t[Wn]=n.current,$f(t),new Sc(n)},Go.version="19.2.0",Go}var i_;function aM(){if(i_)return Md.exports;i_=1;function r(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(r)}catch(e){console.error(e)}}return r(),Md.exports=iM(),Md.exports}var sM=aM();const Kh="186",rM=0,a_=1,oM=2,Yc=1,lM=2,Jo=3,Hs=0,Vn=1,Oi=2,Ea=0,el=1,s_=2,r_=3,o_=4,cM=5,Br=100,uM=101,fM=102,dM=103,hM=104,pM=200,mM=201,gM=202,_M=203,rv=204,ov=205,vM=206,xM=207,SM=208,MM=209,yM=210,EM=211,TM=212,bM=213,AM=214,rh=0,oh=1,lh=2,nl=3,ch=4,uh=5,fh=6,dh=7,lv=0,RM=1,CM=2,Zi=0,cv=1,uv=2,fv=3,Qh=4,dv=5,hv=6,pv=7,mv=300,Gs=301,Vr=302,bd=303,Ad=304,cu=306,hh=1e3,ya=1001,ph=1002,Un=1003,wM=1004,yc=1005,In=1006,Rd=1007,Is=1008,hi=1009,gv=1010,_v=1011,il=1012,Jh=1013,Ki=1014,qi=1015,Qi=1016,$h=1017,ep=1018,al=1020,vv=35902,xv=35899,Sv=1021,Mv=1022,Ii=1023,Aa=1026,zs=1027,yv=1028,tp=1029,Vs=1030,np=1031,ip=1033,qc=33776,jc=33777,Zc=33778,Kc=33779,mh=35840,gh=35841,_h=35842,vh=35843,xh=36196,Sh=37492,Mh=37496,yh=37488,Eh=37489,$c=37490,Th=37491,bh=37808,Ah=37809,Rh=37810,Ch=37811,wh=37812,Dh=37813,Nh=37814,Uh=37815,Lh=37816,Oh=37817,Ph=37818,Ih=37819,zh=37820,Bh=37821,Fh=36492,Hh=36494,Gh=36495,Vh=36283,kh=36284,eu=36285,Xh=36286,DM=3200,Wh=0,NM=1,os="",di="srgb",tu="srgb-linear",nu="linear",zt="srgb",Cd=7680,UM=519,LM=512,OM=513,PM=514,ap=515,IM=516,zM=517,sp=518,BM=519,FM=35044,HM=35048,l_="300 es",ji=2e3,sl=2001;function GM(r){for(let e=r.length-1;e>=0;--e)if(r[e]>=65535)return!0;return!1}function iu(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function VM(){const r=iu("canvas");return r.style.display="block",r}const c_={};function u_(...r){const e="THREE."+r.shift();console.log(e,...r)}function Ev(r){const e=r[0];if(typeof e=="string"&&e.startsWith("TSL:")){const i=r[1];i&&i.isStackTrace?r[0]+=" "+i.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function tt(...r){r=Ev(r);const e="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.warn(i.getError(e)):console.warn(e,...r)}}function wt(...r){r=Ev(r);const e="THREE."+r.shift();{const i=r[0];i&&i.isStackTrace?console.error(i.getError(e)):console.error(e,...r)}}function Hr(...r){const e=r.join(" ");e in c_||(c_[e]=!0,tt(...r))}function kM(r,e,i){return new Promise(function(s,l){function c(){switch(r.clientWaitSync(e,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:l();break;case r.TIMEOUT_EXPIRED:setTimeout(c,i);break;default:s()}}setTimeout(c,i)})}const XM={[rh]:oh,[lh]:fh,[ch]:dh,[nl]:uh,[oh]:rh,[fh]:lh,[dh]:ch,[uh]:nl};class ks{addEventListener(e,i){this._listeners===void 0&&(this._listeners={});const s=this._listeners;s[e]===void 0&&(s[e]=[]),s[e].indexOf(i)===-1&&s[e].push(i)}hasEventListener(e,i){const s=this._listeners;return s===void 0?!1:s[e]!==void 0&&s[e].indexOf(i)!==-1}removeEventListener(e,i){const s=this._listeners;if(s===void 0)return;const l=s[e];if(l!==void 0){const c=l.indexOf(i);c!==-1&&l.splice(c,1)}}dispatchEvent(e){const i=this._listeners;if(i===void 0)return;const s=i[e.type];if(s!==void 0){e.target=this;const l=s.slice(0);for(let c=0,d=l.length;c<d;c++)l[c].call(this,e);e.target=null}}}const On=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],wd=Math.PI/180,Yh=180/Math.PI;function ol(){const r=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0,s=Math.random()*4294967295|0;return(On[r&255]+On[r>>8&255]+On[r>>16&255]+On[r>>24&255]+"-"+On[e&255]+On[e>>8&255]+"-"+On[e>>16&15|64]+On[e>>24&255]+"-"+On[i&63|128]+On[i>>8&255]+"-"+On[i>>16&255]+On[i>>24&255]+On[s&255]+On[s>>8&255]+On[s>>16&255]+On[s>>24&255]).toLowerCase()}function Tt(r,e,i){return Math.max(e,Math.min(i,r))}function WM(r,e){return(r%e+e)%e}function Dd(r,e,i){return(1-i)*r+i*e}function Vo(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:case Uint8ClampedArray:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Jn(r,e){switch(e.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const fp=class fp{constructor(e=0,i=0){this.x=e,this.y=i}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,i){return this.x=e,this.y=i,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const i=this.x,s=this.y,l=e.elements;return this.x=l[0]*i+l[3]*s+l[6],this.y=l[1]*i+l[4]*s+l[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,i){return this.x=Tt(this.x,e.x,i.x),this.y=Tt(this.y,e.y,i.y),this}clampScalar(e,i){return this.x=Tt(this.x,e,i),this.y=Tt(this.y,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Tt(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(Tt(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y;return i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this}rotateAround(e,i){const s=Math.cos(i),l=Math.sin(i),c=this.x-e.x,d=this.y-e.y;return this.x=c*s-d*l+e.x,this.y=c*l+d*s+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};fp.prototype.isVector2=!0;let _t=fp;class Xr{constructor(e=0,i=0,s=0,l=1){this.isQuaternion=!0,this._x=e,this._y=i,this._z=s,this._w=l}static slerpFlat(e,i,s,l,c,d,p){let m=s[l+0],h=s[l+1],x=s[l+2],S=s[l+3],g=c[d+0],E=c[d+1],A=c[d+2],D=c[d+3];if(S!==D||m!==g||h!==E||x!==A){let y=m*g+h*E+x*A+S*D;y<0&&(g=-g,E=-E,A=-A,D=-D,y=-y);let _=1-p;if(y<.9995){const I=Math.acos(y),O=Math.sin(I);_=Math.sin(_*I)/O,p=Math.sin(p*I)/O,m=m*_+g*p,h=h*_+E*p,x=x*_+A*p,S=S*_+D*p}else{m=m*_+g*p,h=h*_+E*p,x=x*_+A*p,S=S*_+D*p;const I=1/Math.sqrt(m*m+h*h+x*x+S*S);m*=I,h*=I,x*=I,S*=I}}e[i]=m,e[i+1]=h,e[i+2]=x,e[i+3]=S}static multiplyQuaternionsFlat(e,i,s,l,c,d){const p=s[l],m=s[l+1],h=s[l+2],x=s[l+3],S=c[d],g=c[d+1],E=c[d+2],A=c[d+3];return e[i]=p*A+x*S+m*E-h*g,e[i+1]=m*A+x*g+h*S-p*E,e[i+2]=h*A+x*E+p*g-m*S,e[i+3]=x*A-p*S-m*g-h*E,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,i,s,l){return this._x=e,this._y=i,this._z=s,this._w=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,i=!0){const s=e._x,l=e._y,c=e._z,d=e._order,p=Math.cos,m=Math.sin,h=p(s/2),x=p(l/2),S=p(c/2),g=m(s/2),E=m(l/2),A=m(c/2);switch(d){case"XYZ":this._x=g*x*S+h*E*A,this._y=h*E*S-g*x*A,this._z=h*x*A+g*E*S,this._w=h*x*S-g*E*A;break;case"YXZ":this._x=g*x*S+h*E*A,this._y=h*E*S-g*x*A,this._z=h*x*A-g*E*S,this._w=h*x*S+g*E*A;break;case"ZXY":this._x=g*x*S-h*E*A,this._y=h*E*S+g*x*A,this._z=h*x*A+g*E*S,this._w=h*x*S-g*E*A;break;case"ZYX":this._x=g*x*S-h*E*A,this._y=h*E*S+g*x*A,this._z=h*x*A-g*E*S,this._w=h*x*S+g*E*A;break;case"YZX":this._x=g*x*S+h*E*A,this._y=h*E*S+g*x*A,this._z=h*x*A-g*E*S,this._w=h*x*S-g*E*A;break;case"XZY":this._x=g*x*S-h*E*A,this._y=h*E*S-g*x*A,this._z=h*x*A+g*E*S,this._w=h*x*S+g*E*A;break;default:tt("Quaternion: .setFromEuler() encountered an unknown order: "+d)}return i===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,i){const s=i/2,l=Math.sin(s);return this._x=e.x*l,this._y=e.y*l,this._z=e.z*l,this._w=Math.cos(s),this._onChangeCallback(),this}setFromRotationMatrix(e){const i=e.elements,s=i[0],l=i[4],c=i[8],d=i[1],p=i[5],m=i[9],h=i[2],x=i[6],S=i[10],g=s+p+S;if(g>0){const E=.5/Math.sqrt(g+1);this._w=.25/E,this._x=(x-m)*E,this._y=(c-h)*E,this._z=(d-l)*E}else if(s>p&&s>S){const E=2*Math.sqrt(1+s-p-S);this._w=(x-m)/E,this._x=.25*E,this._y=(l+d)/E,this._z=(c+h)/E}else if(p>S){const E=2*Math.sqrt(1+p-s-S);this._w=(c-h)/E,this._x=(l+d)/E,this._y=.25*E,this._z=(m+x)/E}else{const E=2*Math.sqrt(1+S-s-p);this._w=(d-l)/E,this._x=(c+h)/E,this._y=(m+x)/E,this._z=.25*E}return this._onChangeCallback(),this}setFromUnitVectors(e,i){let s=e.dot(i)+1;return s<1e-8?(s=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=s):(this._x=0,this._y=-e.z,this._z=e.y,this._w=s)):(this._x=e.y*i.z-e.z*i.y,this._y=e.z*i.x-e.x*i.z,this._z=e.x*i.y-e.y*i.x,this._w=s),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Tt(this.dot(e),-1,1)))}rotateTowards(e,i){const s=this.angleTo(e);if(s===0)return this;const l=Math.min(1,i/s);return this.slerp(e,l),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,i){const s=e._x,l=e._y,c=e._z,d=e._w,p=i._x,m=i._y,h=i._z,x=i._w;return this._x=s*x+d*p+l*h-c*m,this._y=l*x+d*m+c*p-s*h,this._z=c*x+d*h+s*m-l*p,this._w=d*x-s*p-l*m-c*h,this._onChangeCallback(),this}slerp(e,i){let s=e._x,l=e._y,c=e._z,d=e._w,p=this.dot(e);p<0&&(s=-s,l=-l,c=-c,d=-d,p=-p);let m=1-i;if(p<.9995){const h=Math.acos(p),x=Math.sin(h);m=Math.sin(m*h)/x,i=Math.sin(i*h)/x,this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+d*i,this._onChangeCallback()}else this._x=this._x*m+s*i,this._y=this._y*m+l*i,this._z=this._z*m+c*i,this._w=this._w*m+d*i,this.normalize();return this}slerpQuaternions(e,i,s){return this.copy(e).slerp(i,s)}random(){const e=2*Math.PI*Math.random(),i=2*Math.PI*Math.random(),s=Math.random(),l=Math.sqrt(1-s),c=Math.sqrt(s);return this.set(l*Math.sin(e),l*Math.cos(e),c*Math.sin(i),c*Math.cos(i))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,i=0){return this._x=e[i],this._y=e[i+1],this._z=e[i+2],this._w=e[i+3],this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._w,e}fromBufferAttribute(e,i){return this._x=e.getX(i),this._y=e.getY(i),this._z=e.getZ(i),this._w=e.getW(i),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const dp=class dp{constructor(e=0,i=0,s=0){this.x=e,this.y=i,this.z=s}set(e,i,s){return s===void 0&&(s=this.z),this.x=e,this.y=i,this.z=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,i){return this.x=e.x*i.x,this.y=e.y*i.y,this.z=e.z*i.z,this}applyEuler(e){return this.applyQuaternion(f_.setFromEuler(e))}applyAxisAngle(e,i){return this.applyQuaternion(f_.setFromAxisAngle(e,i))}applyMatrix3(e){const i=this.x,s=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[3]*s+c[6]*l,this.y=c[1]*i+c[4]*s+c[7]*l,this.z=c[2]*i+c[5]*s+c[8]*l,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,c=e.elements,d=1/(c[3]*i+c[7]*s+c[11]*l+c[15]);return this.x=(c[0]*i+c[4]*s+c[8]*l+c[12])*d,this.y=(c[1]*i+c[5]*s+c[9]*l+c[13])*d,this.z=(c[2]*i+c[6]*s+c[10]*l+c[14])*d,this}applyQuaternion(e){const i=this.x,s=this.y,l=this.z,c=e.x,d=e.y,p=e.z,m=e.w,h=2*(d*l-p*s),x=2*(p*i-c*l),S=2*(c*s-d*i);return this.x=i+m*h+d*S-p*x,this.y=s+m*x+p*h-c*S,this.z=l+m*S+c*x-d*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const i=this.x,s=this.y,l=this.z,c=e.elements;return this.x=c[0]*i+c[4]*s+c[8]*l,this.y=c[1]*i+c[5]*s+c[9]*l,this.z=c[2]*i+c[6]*s+c[10]*l,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,i){return this.x=Tt(this.x,e.x,i.x),this.y=Tt(this.y,e.y,i.y),this.z=Tt(this.z,e.z,i.z),this}clampScalar(e,i){return this.x=Tt(this.x,e,i),this.y=Tt(this.y,e,i),this.z=Tt(this.z,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Tt(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,i){const s=e.x,l=e.y,c=e.z,d=i.x,p=i.y,m=i.z;return this.x=l*m-c*p,this.y=c*d-s*m,this.z=s*p-l*d,this}projectOnVector(e){const i=e.lengthSq();if(i===0)return this.set(0,0,0);const s=e.dot(this)/i;return this.copy(e).multiplyScalar(s)}projectOnPlane(e){return Nd.copy(this).projectOnVector(e),this.sub(Nd)}reflect(e){return this.sub(Nd.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const i=Math.sqrt(this.lengthSq()*e.lengthSq());if(i===0)return Math.PI/2;const s=this.dot(e)/i;return Math.acos(Tt(s,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const i=this.x-e.x,s=this.y-e.y,l=this.z-e.z;return i*i+s*s+l*l}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,i,s){const l=Math.sin(i)*e;return this.x=l*Math.sin(s),this.y=Math.cos(i)*e,this.z=l*Math.cos(s),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,i,s){return this.x=e*Math.sin(i),this.y=s,this.z=e*Math.cos(i),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this}setFromMatrixScale(e){const i=this.setFromMatrixColumn(e,0).length(),s=this.setFromMatrixColumn(e,1).length(),l=this.setFromMatrixColumn(e,2).length();return this.x=i,this.y=s,this.z=l,this}setFromMatrixColumn(e,i){return this.fromArray(e.elements,i*4)}setFromMatrix3Column(e,i){return this.fromArray(e.elements,i*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,i=Math.random()*2-1,s=Math.sqrt(1-i*i);return this.x=s*Math.cos(e),this.y=i,this.z=s*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};dp.prototype.isVector3=!0;let $=dp;const Nd=new $,f_=new Xr,hp=class hp{constructor(e,i,s,l,c,d,p,m,h){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,i,s,l,c,d,p,m,h)}set(e,i,s,l,c,d,p,m,h){const x=this.elements;return x[0]=e,x[1]=l,x[2]=p,x[3]=i,x[4]=c,x[5]=m,x[6]=s,x[7]=d,x[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],this}extractBasis(e,i,s){return e.setFromMatrix3Column(this,0),i.setFromMatrix3Column(this,1),s.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const i=e.elements;return this.set(i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,c=this.elements,d=s[0],p=s[3],m=s[6],h=s[1],x=s[4],S=s[7],g=s[2],E=s[5],A=s[8],D=l[0],y=l[3],_=l[6],I=l[1],O=l[4],w=l[7],U=l[2],P=l[5],F=l[8];return c[0]=d*D+p*I+m*U,c[3]=d*y+p*O+m*P,c[6]=d*_+p*w+m*F,c[1]=h*D+x*I+S*U,c[4]=h*y+x*O+S*P,c[7]=h*_+x*w+S*F,c[2]=g*D+E*I+A*U,c[5]=g*y+E*O+A*P,c[8]=g*_+E*w+A*F,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[3]*=e,i[6]*=e,i[1]*=e,i[4]*=e,i[7]*=e,i[2]*=e,i[5]*=e,i[8]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],d=e[4],p=e[5],m=e[6],h=e[7],x=e[8];return i*d*x-i*p*h-s*c*x+s*p*m+l*c*h-l*d*m}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],d=e[4],p=e[5],m=e[6],h=e[7],x=e[8],S=x*d-p*h,g=p*m-x*c,E=h*c-d*m,A=i*S+s*g+l*E;if(A===0)return this.set(0,0,0,0,0,0,0,0,0);const D=1/A;return e[0]=S*D,e[1]=(l*h-x*s)*D,e[2]=(p*s-l*d)*D,e[3]=g*D,e[4]=(x*i-l*m)*D,e[5]=(l*c-p*i)*D,e[6]=E*D,e[7]=(s*m-h*i)*D,e[8]=(d*i-s*c)*D,this}transpose(){let e;const i=this.elements;return e=i[1],i[1]=i[3],i[3]=e,e=i[2],i[2]=i[6],i[6]=e,e=i[5],i[5]=i[7],i[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const i=this.elements;return e[0]=i[0],e[1]=i[3],e[2]=i[6],e[3]=i[1],e[4]=i[4],e[5]=i[7],e[6]=i[2],e[7]=i[5],e[8]=i[8],this}setUvTransform(e,i,s,l,c,d,p){const m=Math.cos(c),h=Math.sin(c);return this.set(s*m,s*h,-s*(m*d+h*p)+d+e,-l*h,l*m,-l*(-h*d+m*p)+p+i,0,0,1),this}scale(e,i){return Hr("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ud.makeScale(e,i)),this}rotate(e){return Hr("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ud.makeRotation(-e)),this}translate(e,i){return Hr("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ud.makeTranslation(e,i)),this}makeTranslation(e,i){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,i,0,0,1),this}makeRotation(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,s,i,0,0,0,1),this}makeScale(e,i){return this.set(e,0,0,0,i,0,0,0,1),this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<9;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<9;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e}clone(){return new this.constructor().fromArray(this.elements)}};hp.prototype.isMatrix3=!0;let st=hp;const Ud=new st,d_=new st().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),h_=new st().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function YM(){const r={enabled:!0,workingColorSpace:tu,spaces:{},convert:function(l,c,d){return this.enabled===!1||c===d||!c||!d||(this.spaces[c].transfer===zt&&(l.r=Ta(l.r),l.g=Ta(l.g),l.b=Ta(l.b)),this.spaces[c].primaries!==this.spaces[d].primaries&&(l.applyMatrix3(this.spaces[c].toXYZ),l.applyMatrix3(this.spaces[d].fromXYZ)),this.spaces[d].transfer===zt&&(l.r=Gr(l.r),l.g=Gr(l.g),l.b=Gr(l.b))),l},workingToColorSpace:function(l,c){return this.convert(l,this.workingColorSpace,c)},colorSpaceToWorking:function(l,c){return this.convert(l,c,this.workingColorSpace)},getPrimaries:function(l){return this.spaces[l].primaries},getTransfer:function(l){return l===os?nu:this.spaces[l].transfer},getToneMappingMode:function(l){return this.spaces[l].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(l,c=this.workingColorSpace){return l.fromArray(this.spaces[c].luminanceCoefficients)},define:function(l){Object.assign(this.spaces,l)},_getMatrix:function(l,c,d){return l.copy(this.spaces[c].toXYZ).multiply(this.spaces[d].fromXYZ)},_getDrawingBufferColorSpace:function(l){return this.spaces[l].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(l=this.workingColorSpace){return this.spaces[l].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(l,c){return Hr("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(l,c)},toWorkingColorSpace:function(l,c){return Hr("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(l,c)}},e=[.64,.33,.3,.6,.15,.06],i=[.2126,.7152,.0722],s=[.3127,.329];return r.define({[tu]:{primaries:e,whitePoint:s,transfer:nu,toXYZ:d_,fromXYZ:h_,luminanceCoefficients:i,workingColorSpaceConfig:{unpackColorSpace:di},outputColorSpaceConfig:{drawingBufferColorSpace:di}},[di]:{primaries:e,whitePoint:s,transfer:zt,toXYZ:d_,fromXYZ:h_,luminanceCoefficients:i,outputColorSpaceConfig:{drawingBufferColorSpace:di}}}),r}const Et=YM();function Ta(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Gr(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let yr;class qM{static getDataURL(e,i="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let s;if(e instanceof HTMLCanvasElement)s=e;else{yr===void 0&&(yr=iu("canvas")),yr.width=e.width,yr.height=e.height;const l=yr.getContext("2d");e instanceof ImageData?l.putImageData(e,0,0):l.drawImage(e,0,0,e.width,e.height),s=yr}return s.toDataURL(i)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const i=iu("canvas");i.width=e.width,i.height=e.height;const s=i.getContext("2d");s.drawImage(e,0,0,e.width,e.height);const l=s.getImageData(0,0,e.width,e.height),c=l.data;for(let d=0;d<c.length;d++)c[d]=Ta(c[d]/255)*255;return s.putImageData(l,0,0),i}else if(e.data){const i=e.data.slice(0);for(let s=0;s<i.length;s++)i instanceof Uint8Array||i instanceof Uint8ClampedArray?i[s]=Math.floor(Ta(i[s]/255)*255):i[s]=Ta(i[s]);return{data:i,width:e.width,height:e.height}}else return tt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let jM=0;class rp{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:jM++}),this.uuid=ol(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const i=this.data;return typeof HTMLVideoElement<"u"&&i instanceof HTMLVideoElement?e.set(i.videoWidth,i.videoHeight,0):typeof VideoFrame<"u"&&i instanceof VideoFrame?e.set(i.displayWidth,i.displayHeight,0):i!==null?e.set(i.width,i.height,i.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const s={uuid:this.uuid,url:""},l=this.data;if(l!==null){let c;if(Array.isArray(l)){c=[];for(let d=0,p=l.length;d<p;d++)l[d].isDataTexture?c.push(Ld(l[d].image)):c.push(Ld(l[d]))}else c=Ld(l);s.url=c}return i||(e.images[this.uuid]=s),s}}function Ld(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?qM.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(tt("Texture: Unable to serialize Texture."),{})}let ZM=0;const Od=new $;class kn extends ks{constructor(e=kn.DEFAULT_IMAGE,i=kn.DEFAULT_MAPPING,s=ya,l=ya,c=In,d=Is,p=Ii,m=hi,h=kn.DEFAULT_ANISOTROPY,x=os){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ZM++}),this.uuid=ol(),this.name="",this.source=new rp(e),this.mipmaps=[],this.mapping=i,this.channel=0,this.wrapS=s,this.wrapT=l,this.magFilter=c,this.minFilter=d,this.anisotropy=h,this.format=p,this.internalFormat=null,this.type=m,this.offset=new _t(0,0),this.repeat=new _t(1,1),this.center=new _t(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new st,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=x,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Od).x}get height(){return this.source.getSize(Od).y}get depth(){return this.source.getSize(Od).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const i in e){const s=e[i];if(s===void 0){tt(`Texture.setValues(): parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){tt(`Texture.setValues(): property '${i}' does not exist.`);continue}l&&s&&l.isVector2&&s.isVector2||l&&s&&l.isVector3&&s.isVector3||l&&s&&l.isMatrix3&&s.isMatrix3?l.copy(s):this[i]=s}}toJSON(e){const i=e===void 0||typeof e=="string";if(!i&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const s={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(s.userData=this.userData),i||(e.textures[this.uuid]=s),s}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==mv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case hh:e.x=e.x-Math.floor(e.x);break;case ya:e.x=e.x<0?0:1;break;case ph:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case hh:e.y=e.y-Math.floor(e.y);break;case ya:e.y=e.y<0?0:1;break;case ph:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}kn.DEFAULT_IMAGE=null;kn.DEFAULT_MAPPING=mv;kn.DEFAULT_ANISOTROPY=1;const pp=class pp{constructor(e=0,i=0,s=0,l=1){this.x=e,this.y=i,this.z=s,this.w=l}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,i,s,l){return this.x=e,this.y=i,this.z=s,this.w=l,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,i){switch(e){case 0:this.x=i;break;case 1:this.y=i;break;case 2:this.z=i;break;case 3:this.w=i;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,i){return this.x=e.x+i.x,this.y=e.y+i.y,this.z=e.z+i.z,this.w=e.w+i.w,this}addScaledVector(e,i){return this.x+=e.x*i,this.y+=e.y*i,this.z+=e.z*i,this.w+=e.w*i,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,i){return this.x=e.x-i.x,this.y=e.y-i.y,this.z=e.z-i.z,this.w=e.w-i.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const i=this.x,s=this.y,l=this.z,c=this.w,d=e.elements;return this.x=d[0]*i+d[4]*s+d[8]*l+d[12]*c,this.y=d[1]*i+d[5]*s+d[9]*l+d[13]*c,this.z=d[2]*i+d[6]*s+d[10]*l+d[14]*c,this.w=d[3]*i+d[7]*s+d[11]*l+d[15]*c,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const i=Math.sqrt(1-e.w*e.w);return i<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/i,this.y=e.y/i,this.z=e.z/i),this}setAxisAngleFromRotationMatrix(e){let i,s,l,c;const m=e.elements,h=m[0],x=m[4],S=m[8],g=m[1],E=m[5],A=m[9],D=m[2],y=m[6],_=m[10];if(Math.abs(x-g)<.01&&Math.abs(S-D)<.01&&Math.abs(A-y)<.01){if(Math.abs(x+g)<.1&&Math.abs(S+D)<.1&&Math.abs(A+y)<.1&&Math.abs(h+E+_-3)<.1)return this.set(1,0,0,0),this;i=Math.PI;const O=(h+1)/2,w=(E+1)/2,U=(_+1)/2,P=(x+g)/4,F=(S+D)/4,T=(A+y)/4;return O>w&&O>U?O<.01?(s=0,l=.707106781,c=.707106781):(s=Math.sqrt(O),l=P/s,c=F/s):w>U?w<.01?(s=.707106781,l=0,c=.707106781):(l=Math.sqrt(w),s=P/l,c=T/l):U<.01?(s=.707106781,l=.707106781,c=0):(c=Math.sqrt(U),s=F/c,l=T/c),this.set(s,l,c,i),this}let I=Math.sqrt((y-A)*(y-A)+(S-D)*(S-D)+(g-x)*(g-x));return Math.abs(I)<.001&&(I=1),this.x=(y-A)/I,this.y=(S-D)/I,this.z=(g-x)/I,this.w=Math.acos((h+E+_-1)/2),this}setFromMatrixPosition(e){const i=e.elements;return this.x=i[12],this.y=i[13],this.z=i[14],this.w=i[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,i){return this.x=Tt(this.x,e.x,i.x),this.y=Tt(this.y,e.y,i.y),this.z=Tt(this.z,e.z,i.z),this.w=Tt(this.w,e.w,i.w),this}clampScalar(e,i){return this.x=Tt(this.x,e,i),this.y=Tt(this.y,e,i),this.z=Tt(this.z,e,i),this.w=Tt(this.w,e,i),this}clampLength(e,i){const s=this.length();return this.divideScalar(s||1).multiplyScalar(Tt(s,e,i))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,i){return this.x+=(e.x-this.x)*i,this.y+=(e.y-this.y)*i,this.z+=(e.z-this.z)*i,this.w+=(e.w-this.w)*i,this}lerpVectors(e,i,s){return this.x=e.x+(i.x-e.x)*s,this.y=e.y+(i.y-e.y)*s,this.z=e.z+(i.z-e.z)*s,this.w=e.w+(i.w-e.w)*s,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,i=0){return this.x=e[i],this.y=e[i+1],this.z=e[i+2],this.w=e[i+3],this}toArray(e=[],i=0){return e[i]=this.x,e[i+1]=this.y,e[i+2]=this.z,e[i+3]=this.w,e}fromBufferAttribute(e,i){return this.x=e.getX(i),this.y=e.getY(i),this.z=e.getZ(i),this.w=e.getW(i),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};pp.prototype.isVector4=!0;let Jt=pp;class KM extends ks{constructor(e=1,i=1,s={}){super(),s=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:In,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},s),this.isRenderTarget=!0,this.width=e,this.height=i,this.depth=s.depth,this.scissor=new Jt(0,0,e,i),this.scissorTest=!1,this.viewport=new Jt(0,0,e,i),this.textures=[];const l={width:e,height:i,depth:s.depth},c=new kn(l),d=s.count;for(let p=0;p<d;p++)this.textures[p]=c.clone(),this.textures[p].isRenderTargetTexture=!0,this.textures[p].renderTarget=this;this._setTextureOptions(s),this.depthBuffer=s.depthBuffer,this.stencilBuffer=s.stencilBuffer,this.resolveColorBuffer=s.resolveColorBuffer,this.resolveDepthBuffer=s.resolveDepthBuffer,this.resolveStencilBuffer=s.resolveStencilBuffer,this.storeMultisampledColorBuffer=s.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=s.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=s.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=s.depthTexture,this.samples=s.samples,this.multiview=s.multiview,this.useArrayDepthTexture=s.useArrayDepthTexture}_setTextureOptions(e={}){const i={minFilter:In,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(i.mapping=e.mapping),e.wrapS!==void 0&&(i.wrapS=e.wrapS),e.wrapT!==void 0&&(i.wrapT=e.wrapT),e.wrapR!==void 0&&(i.wrapR=e.wrapR),e.magFilter!==void 0&&(i.magFilter=e.magFilter),e.minFilter!==void 0&&(i.minFilter=e.minFilter),e.format!==void 0&&(i.format=e.format),e.type!==void 0&&(i.type=e.type),e.anisotropy!==void 0&&(i.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(i.colorSpace=e.colorSpace),e.flipY!==void 0&&(i.flipY=e.flipY),e.generateMipmaps!==void 0&&(i.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(i.internalFormat=e.internalFormat);for(let s=0;s<this.textures.length;s++)this.textures[s].setValues(i)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,i,s=1){if(this.width!==e||this.height!==i||this.depth!==s){this.width=e,this.height=i,this.depth=s;for(let l=0,c=this.textures.length;l<c;l++)this.textures[l].image.width=e,this.textures[l].image.height=i,this.textures[l].image.depth=s,this.textures[l].isData3DTexture!==!0&&(this.textures[l].isArrayTexture=this.textures[l].image.depth>1);this.dispose()}this.viewport.set(0,0,e,i),this.scissor.set(0,0,e,i)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,s=e.textures.length;i<s;i++){this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0,this.textures[i].renderTarget=this;const l=Object.assign({},e.textures[i].image);this.textures[i].source=new rp(l)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const i=e.depthTexture.clone();i.renderTarget=null,this.depthTexture=i}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zi extends KM{constructor(e=1,i=1,s={}){super(e,i,s),this.isWebGLRenderTarget=!0}}class Tv extends kn{constructor(e=null,i=1,s=1,l=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=Un,this.minFilter=Un,this.wrapR=ya,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class QM extends kn{constructor(e=null,i=1,s=1,l=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:i,height:s,depth:l},this.magFilter=Un,this.minFilter=Un,this.wrapR=ya,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const lu=class lu{constructor(e,i,s,l,c,d,p,m,h,x,S,g,E,A,D,y){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,i,s,l,c,d,p,m,h,x,S,g,E,A,D,y)}set(e,i,s,l,c,d,p,m,h,x,S,g,E,A,D,y){const _=this.elements;return _[0]=e,_[4]=i,_[8]=s,_[12]=l,_[1]=c,_[5]=d,_[9]=p,_[13]=m,_[2]=h,_[6]=x,_[10]=S,_[14]=g,_[3]=E,_[7]=A,_[11]=D,_[15]=y,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new lu().fromArray(this.elements)}copy(e){const i=this.elements,s=e.elements;return i[0]=s[0],i[1]=s[1],i[2]=s[2],i[3]=s[3],i[4]=s[4],i[5]=s[5],i[6]=s[6],i[7]=s[7],i[8]=s[8],i[9]=s[9],i[10]=s[10],i[11]=s[11],i[12]=s[12],i[13]=s[13],i[14]=s[14],i[15]=s[15],this}copyPosition(e){const i=this.elements,s=e.elements;return i[12]=s[12],i[13]=s[13],i[14]=s[14],this}setFromMatrix3(e){const i=e.elements;return this.set(i[0],i[3],i[6],0,i[1],i[4],i[7],0,i[2],i[5],i[8],0,0,0,0,1),this}extractBasis(e,i,s){return this.determinantAffine()===0?(e.set(1,0,0),i.set(0,1,0),s.set(0,0,1),this):(e.setFromMatrixColumn(this,0),i.setFromMatrixColumn(this,1),s.setFromMatrixColumn(this,2),this)}makeBasis(e,i,s){return this.set(e.x,i.x,s.x,0,e.y,i.y,s.y,0,e.z,i.z,s.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const i=this.elements,s=e.elements,l=1/Er.setFromMatrixColumn(e,0).length(),c=1/Er.setFromMatrixColumn(e,1).length(),d=1/Er.setFromMatrixColumn(e,2).length();return i[0]=s[0]*l,i[1]=s[1]*l,i[2]=s[2]*l,i[3]=0,i[4]=s[4]*c,i[5]=s[5]*c,i[6]=s[6]*c,i[7]=0,i[8]=s[8]*d,i[9]=s[9]*d,i[10]=s[10]*d,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromEuler(e){const i=this.elements,s=e.x,l=e.y,c=e.z,d=Math.cos(s),p=Math.sin(s),m=Math.cos(l),h=Math.sin(l),x=Math.cos(c),S=Math.sin(c);if(e.order==="XYZ"){const g=d*x,E=d*S,A=p*x,D=p*S;i[0]=m*x,i[4]=-m*S,i[8]=h,i[1]=E+A*h,i[5]=g-D*h,i[9]=-p*m,i[2]=D-g*h,i[6]=A+E*h,i[10]=d*m}else if(e.order==="YXZ"){const g=m*x,E=m*S,A=h*x,D=h*S;i[0]=g+D*p,i[4]=A*p-E,i[8]=d*h,i[1]=d*S,i[5]=d*x,i[9]=-p,i[2]=E*p-A,i[6]=D+g*p,i[10]=d*m}else if(e.order==="ZXY"){const g=m*x,E=m*S,A=h*x,D=h*S;i[0]=g-D*p,i[4]=-d*S,i[8]=A+E*p,i[1]=E+A*p,i[5]=d*x,i[9]=D-g*p,i[2]=-d*h,i[6]=p,i[10]=d*m}else if(e.order==="ZYX"){const g=d*x,E=d*S,A=p*x,D=p*S;i[0]=m*x,i[4]=A*h-E,i[8]=g*h+D,i[1]=m*S,i[5]=D*h+g,i[9]=E*h-A,i[2]=-h,i[6]=p*m,i[10]=d*m}else if(e.order==="YZX"){const g=d*m,E=d*h,A=p*m,D=p*h;i[0]=m*x,i[4]=D-g*S,i[8]=A*S+E,i[1]=S,i[5]=d*x,i[9]=-p*x,i[2]=-h*x,i[6]=E*S+A,i[10]=g-D*S}else if(e.order==="XZY"){const g=d*m,E=d*h,A=p*m,D=p*h;i[0]=m*x,i[4]=-S,i[8]=h*x,i[1]=g*S+D,i[5]=d*x,i[9]=E*S-A,i[2]=A*S-E,i[6]=p*x,i[10]=D*S+g}return i[3]=0,i[7]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,this}makeRotationFromQuaternion(e){return this.compose(JM,e,$M)}lookAt(e,i,s){const l=this.elements;return ui.subVectors(e,i),ui.lengthSq()===0&&(ui.z=1),ui.normalize(),es.crossVectors(s,ui),es.lengthSq()===0&&(Math.abs(s.z)===1?ui.x+=1e-4:ui.z+=1e-4,ui.normalize(),es.crossVectors(s,ui)),es.normalize(),Ec.crossVectors(ui,es),l[0]=es.x,l[4]=Ec.x,l[8]=ui.x,l[1]=es.y,l[5]=Ec.y,l[9]=ui.y,l[2]=es.z,l[6]=Ec.z,l[10]=ui.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,i){const s=e.elements,l=i.elements,c=this.elements,d=s[0],p=s[4],m=s[8],h=s[12],x=s[1],S=s[5],g=s[9],E=s[13],A=s[2],D=s[6],y=s[10],_=s[14],I=s[3],O=s[7],w=s[11],U=s[15],P=l[0],F=l[4],T=l[8],z=l[12],X=l[1],K=l[5],j=l[9],oe=l[13],Z=l[2],ne=l[6],N=l[10],V=l[14],fe=l[3],se=l[7],H=l[11],C=l[15];return c[0]=d*P+p*X+m*Z+h*fe,c[4]=d*F+p*K+m*ne+h*se,c[8]=d*T+p*j+m*N+h*H,c[12]=d*z+p*oe+m*V+h*C,c[1]=x*P+S*X+g*Z+E*fe,c[5]=x*F+S*K+g*ne+E*se,c[9]=x*T+S*j+g*N+E*H,c[13]=x*z+S*oe+g*V+E*C,c[2]=A*P+D*X+y*Z+_*fe,c[6]=A*F+D*K+y*ne+_*se,c[10]=A*T+D*j+y*N+_*H,c[14]=A*z+D*oe+y*V+_*C,c[3]=I*P+O*X+w*Z+U*fe,c[7]=I*F+O*K+w*ne+U*se,c[11]=I*T+O*j+w*N+U*H,c[15]=I*z+O*oe+w*V+U*C,this}multiplyScalar(e){const i=this.elements;return i[0]*=e,i[4]*=e,i[8]*=e,i[12]*=e,i[1]*=e,i[5]*=e,i[9]*=e,i[13]*=e,i[2]*=e,i[6]*=e,i[10]*=e,i[14]*=e,i[3]*=e,i[7]*=e,i[11]*=e,i[15]*=e,this}determinant(){const e=this.elements,i=e[0],s=e[4],l=e[8],c=e[12],d=e[1],p=e[5],m=e[9],h=e[13],x=e[2],S=e[6],g=e[10],E=e[14],A=e[3],D=e[7],y=e[11],_=e[15],I=m*E-h*g,O=p*E-h*S,w=p*g-m*S,U=d*E-h*x,P=d*g-m*x,F=d*S-p*x;return i*(D*I-y*O+_*w)-s*(A*I-y*U+_*P)+l*(A*O-D*U+_*F)-c*(A*w-D*P+y*F)}determinantAffine(){const e=this.elements,i=e[0],s=e[4],l=e[8],c=e[1],d=e[5],p=e[9],m=e[2],h=e[6],x=e[10];return i*(d*x-p*h)-s*(c*x-p*m)+l*(c*h-d*m)}transpose(){const e=this.elements;let i;return i=e[1],e[1]=e[4],e[4]=i,i=e[2],e[2]=e[8],e[8]=i,i=e[6],e[6]=e[9],e[9]=i,i=e[3],e[3]=e[12],e[12]=i,i=e[7],e[7]=e[13],e[13]=i,i=e[11],e[11]=e[14],e[14]=i,this}setPosition(e,i,s){const l=this.elements;return e.isVector3?(l[12]=e.x,l[13]=e.y,l[14]=e.z):(l[12]=e,l[13]=i,l[14]=s),this}invert(){const e=this.elements,i=e[0],s=e[1],l=e[2],c=e[3],d=e[4],p=e[5],m=e[6],h=e[7],x=e[8],S=e[9],g=e[10],E=e[11],A=e[12],D=e[13],y=e[14],_=e[15],I=i*p-s*d,O=i*m-l*d,w=i*h-c*d,U=s*m-l*p,P=s*h-c*p,F=l*h-c*m,T=x*D-S*A,z=x*y-g*A,X=x*_-E*A,K=S*y-g*D,j=S*_-E*D,oe=g*_-E*y,Z=I*oe-O*j+w*K+U*X-P*z+F*T;if(Z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const ne=1/Z;return e[0]=(p*oe-m*j+h*K)*ne,e[1]=(l*j-s*oe-c*K)*ne,e[2]=(D*F-y*P+_*U)*ne,e[3]=(g*P-S*F-E*U)*ne,e[4]=(m*X-d*oe-h*z)*ne,e[5]=(i*oe-l*X+c*z)*ne,e[6]=(y*w-A*F-_*O)*ne,e[7]=(x*F-g*w+E*O)*ne,e[8]=(d*j-p*X+h*T)*ne,e[9]=(s*X-i*j-c*T)*ne,e[10]=(A*P-D*w+_*I)*ne,e[11]=(S*w-x*P-E*I)*ne,e[12]=(p*z-d*K-m*T)*ne,e[13]=(i*K-s*z+l*T)*ne,e[14]=(D*O-A*U-y*I)*ne,e[15]=(x*U-S*O+g*I)*ne,this}scale(e){const i=this.elements,s=e.x,l=e.y,c=e.z;return i[0]*=s,i[4]*=l,i[8]*=c,i[1]*=s,i[5]*=l,i[9]*=c,i[2]*=s,i[6]*=l,i[10]*=c,i[3]*=s,i[7]*=l,i[11]*=c,this}getMaxScaleOnAxis(){const e=this.elements,i=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],s=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],l=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(i,s,l))}makeTranslation(e,i,s){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,i,0,0,1,s,0,0,0,1),this}makeRotationX(e){const i=Math.cos(e),s=Math.sin(e);return this.set(1,0,0,0,0,i,-s,0,0,s,i,0,0,0,0,1),this}makeRotationY(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,0,s,0,0,1,0,0,-s,0,i,0,0,0,0,1),this}makeRotationZ(e){const i=Math.cos(e),s=Math.sin(e);return this.set(i,-s,0,0,s,i,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,i){const s=Math.cos(i),l=Math.sin(i),c=1-s,d=e.x,p=e.y,m=e.z,h=c*d,x=c*p;return this.set(h*d+s,h*p-l*m,h*m+l*p,0,h*p+l*m,x*p+s,x*m-l*d,0,h*m-l*p,x*m+l*d,c*m*m+s,0,0,0,0,1),this}makeScale(e,i,s){return this.set(e,0,0,0,0,i,0,0,0,0,s,0,0,0,0,1),this}makeShear(e,i,s,l,c,d){return this.set(1,s,c,0,e,1,d,0,i,l,1,0,0,0,0,1),this}compose(e,i,s){const l=this.elements,c=i._x,d=i._y,p=i._z,m=i._w,h=c+c,x=d+d,S=p+p,g=c*h,E=c*x,A=c*S,D=d*x,y=d*S,_=p*S,I=m*h,O=m*x,w=m*S,U=s.x,P=s.y,F=s.z;return l[0]=(1-(D+_))*U,l[1]=(E+w)*U,l[2]=(A-O)*U,l[3]=0,l[4]=(E-w)*P,l[5]=(1-(g+_))*P,l[6]=(y+I)*P,l[7]=0,l[8]=(A+O)*F,l[9]=(y-I)*F,l[10]=(1-(g+D))*F,l[11]=0,l[12]=e.x,l[13]=e.y,l[14]=e.z,l[15]=1,this}decompose(e,i,s){const l=this.elements;e.x=l[12],e.y=l[13],e.z=l[14];const c=this.determinantAffine();if(c===0)return s.set(1,1,1),i.identity(),this;let d=Er.set(l[0],l[1],l[2]).length();const p=Er.set(l[4],l[5],l[6]).length(),m=Er.set(l[8],l[9],l[10]).length();c<0&&(d=-d),Ni.copy(this);const h=1/d,x=1/p,S=1/m;return Ni.elements[0]*=h,Ni.elements[1]*=h,Ni.elements[2]*=h,Ni.elements[4]*=x,Ni.elements[5]*=x,Ni.elements[6]*=x,Ni.elements[8]*=S,Ni.elements[9]*=S,Ni.elements[10]*=S,i.setFromRotationMatrix(Ni),s.x=d,s.y=p,s.z=m,this}makePerspective(e,i,s,l,c,d,p=ji,m=!1){const h=this.elements,x=2*c/(i-e),S=2*c/(s-l),g=(i+e)/(i-e),E=(s+l)/(s-l);let A,D;if(m)A=c/(d-c),D=d*c/(d-c);else if(p===ji)A=-(d+c)/(d-c),D=-2*d*c/(d-c);else if(p===sl)A=-d/(d-c),D=-d*c/(d-c);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+p);return h[0]=x,h[4]=0,h[8]=g,h[12]=0,h[1]=0,h[5]=S,h[9]=E,h[13]=0,h[2]=0,h[6]=0,h[10]=A,h[14]=D,h[3]=0,h[7]=0,h[11]=-1,h[15]=0,this}makeOrthographic(e,i,s,l,c,d,p=ji,m=!1){const h=this.elements,x=2/(i-e),S=2/(s-l),g=-(i+e)/(i-e),E=-(s+l)/(s-l);let A,D;if(m)A=1/(d-c),D=d/(d-c);else if(p===ji)A=-2/(d-c),D=-(d+c)/(d-c);else if(p===sl)A=-1/(d-c),D=-c/(d-c);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+p);return h[0]=x,h[4]=0,h[8]=0,h[12]=g,h[1]=0,h[5]=S,h[9]=0,h[13]=E,h[2]=0,h[6]=0,h[10]=A,h[14]=D,h[3]=0,h[7]=0,h[11]=0,h[15]=1,this}equals(e){const i=this.elements,s=e.elements;for(let l=0;l<16;l++)if(i[l]!==s[l])return!1;return!0}fromArray(e,i=0){for(let s=0;s<16;s++)this.elements[s]=e[s+i];return this}toArray(e=[],i=0){const s=this.elements;return e[i]=s[0],e[i+1]=s[1],e[i+2]=s[2],e[i+3]=s[3],e[i+4]=s[4],e[i+5]=s[5],e[i+6]=s[6],e[i+7]=s[7],e[i+8]=s[8],e[i+9]=s[9],e[i+10]=s[10],e[i+11]=s[11],e[i+12]=s[12],e[i+13]=s[13],e[i+14]=s[14],e[i+15]=s[15],e}};lu.prototype.isMatrix4=!0;let $t=lu;const Er=new $,Ni=new $t,JM=new $(0,0,0),$M=new $(1,1,1),es=new $,Ec=new $,ui=new $,p_=new $t,m_=new Xr;class ls{constructor(e=0,i=0,s=0,l=ls.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=i,this._z=s,this._order=l}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,i,s,l=this._order){return this._x=e,this._y=i,this._z=s,this._order=l,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,i=this._order,s=!0){const l=e.elements,c=l[0],d=l[4],p=l[8],m=l[1],h=l[5],x=l[9],S=l[2],g=l[6],E=l[10];switch(i){case"XYZ":this._y=Math.asin(Tt(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(-x,E),this._z=Math.atan2(-d,c)):(this._x=Math.atan2(g,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Tt(x,-1,1)),Math.abs(x)<.9999999?(this._y=Math.atan2(p,E),this._z=Math.atan2(m,h)):(this._y=Math.atan2(-S,c),this._z=0);break;case"ZXY":this._x=Math.asin(Tt(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-S,E),this._z=Math.atan2(-d,h)):(this._y=0,this._z=Math.atan2(m,c));break;case"ZYX":this._y=Math.asin(-Tt(S,-1,1)),Math.abs(S)<.9999999?(this._x=Math.atan2(g,E),this._z=Math.atan2(m,c)):(this._x=0,this._z=Math.atan2(-d,h));break;case"YZX":this._z=Math.asin(Tt(m,-1,1)),Math.abs(m)<.9999999?(this._x=Math.atan2(-x,h),this._y=Math.atan2(-S,c)):(this._x=0,this._y=Math.atan2(p,E));break;case"XZY":this._z=Math.asin(-Tt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(g,h),this._y=Math.atan2(p,c)):(this._x=Math.atan2(-x,E),this._y=0);break;default:tt("Euler: .setFromRotationMatrix() encountered an unknown order: "+i)}return this._order=i,s===!0&&this._onChangeCallback(),this}setFromQuaternion(e,i,s){return p_.makeRotationFromQuaternion(e),this.setFromRotationMatrix(p_,i,s)}setFromVector3(e,i=this._order){return this.set(e.x,e.y,e.z,i)}reorder(e){return m_.setFromEuler(this),this.setFromQuaternion(m_,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],i=0){return e[i]=this._x,e[i+1]=this._y,e[i+2]=this._z,e[i+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ls.DEFAULT_ORDER="XYZ";class bv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ey=0;const g_=new $,Tr=new Xr,ga=new $t,Tc=new $,ko=new $,ty=new $,ny=new Xr,__=new $(1,0,0),v_=new $(0,1,0),x_=new $(0,0,1),S_={type:"added"},iy={type:"removed"},br={type:"childadded",child:null},Pd={type:"childremoved",child:null};class bn extends ks{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ey++}),this.uuid=ol(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bn.DEFAULT_UP.clone();const e=new $,i=new ls,s=new Xr,l=new $(1,1,1);function c(){s.setFromEuler(i,!1)}function d(){i.setFromQuaternion(s,void 0,!1)}i._onChange(c),s._onChange(d),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:i},quaternion:{configurable:!0,enumerable:!0,value:s},scale:{configurable:!0,enumerable:!0,value:l},modelViewMatrix:{value:new $t},normalMatrix:{value:new st}}),this.matrix=new $t,this.matrixWorld=new $t,this.matrixAutoUpdate=bn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,i){this.quaternion.setFromAxisAngle(e,i)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,i){return Tr.setFromAxisAngle(e,i),this.quaternion.multiply(Tr),this}rotateOnWorldAxis(e,i){return Tr.setFromAxisAngle(e,i),this.quaternion.premultiply(Tr),this}rotateX(e){return this.rotateOnAxis(__,e)}rotateY(e){return this.rotateOnAxis(v_,e)}rotateZ(e){return this.rotateOnAxis(x_,e)}translateOnAxis(e,i){return g_.copy(e).applyQuaternion(this.quaternion),this.position.add(g_.multiplyScalar(i)),this}translateX(e){return this.translateOnAxis(__,e)}translateY(e){return this.translateOnAxis(v_,e)}translateZ(e){return this.translateOnAxis(x_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ga.copy(this.matrixWorld).invert())}lookAt(e,i,s){e.isVector3?Tc.copy(e):Tc.set(e,i,s);const l=this.parent;this.updateWorldMatrix(!0,!1),ko.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ga.lookAt(ko,Tc,this.up):ga.lookAt(Tc,ko,this.up),this.quaternion.setFromRotationMatrix(ga),l&&(ga.extractRotation(l.matrixWorld),Tr.setFromRotationMatrix(ga),this.quaternion.premultiply(Tr.invert()))}add(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.add(arguments[i]);return this}return e===this?(wt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(S_),br.child=e,this.dispatchEvent(br),br.child=null):wt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let s=0;s<arguments.length;s++)this.remove(arguments[s]);return this}const i=this.children.indexOf(e);return i!==-1&&(e.parent=null,this.children.splice(i,1),e.dispatchEvent(iy),Pd.child=e,this.dispatchEvent(Pd),Pd.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ga.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ga.multiply(e.parent.matrixWorld)),e.applyMatrix4(ga),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(S_),br.child=e,this.dispatchEvent(br),br.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,i){if(this[e]===i)return this;for(let s=0,l=this.children.length;s<l;s++){const d=this.children[s].getObjectByProperty(e,i);if(d!==void 0)return d}}getObjectsByProperty(e,i,s=[]){this[e]===i&&s.push(this);const l=this.children;for(let c=0,d=l.length;c<d;c++)l[c].getObjectsByProperty(e,i,s);return s}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ko,e,ty),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ko,ny,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const i=this.matrixWorld.elements;return e.set(i[8],i[9],i[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].traverseVisible(e)}traverseAncestors(e){const i=this.parent;i!==null&&(e(i),i.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const i=e.x,s=e.y,l=e.z,c=this.matrix.elements;c[12]+=i-c[0]*i-c[4]*s-c[8]*l,c[13]+=s-c[1]*i-c[5]*s-c[9]*l,c[14]+=l-c[2]*i-c[6]*s-c[10]*l}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const i=this.children;for(let s=0,l=i.length;s<l;s++)i[s].updateMatrixWorld(e)}updateWorldMatrix(e,i,s=!1){const l=this.parent;if(e===!0&&l!==null&&l.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||s)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,s=!0),i===!0){const c=this.children;for(let d=0,p=c.length;d<p;d++)c[d].updateWorldMatrix(!1,!0,s)}}toJSON(e){const i=e===void 0||typeof e=="string",s={};i&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},s.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const l={};l.uuid=this.uuid,l.type=this.type,l.name=this.name,l.castShadow=this.castShadow,l.receiveShadow=this.receiveShadow,l.visible=this.visible,l.frustumCulled=this.frustumCulled,l.renderOrder=this.renderOrder,l.static=this.static,l.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(l.userData=this.userData),l.layers=this.layers.mask,l.matrix=this.matrix.toArray(),l.up=this.up.toArray(),this.pivot!==null&&(l.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(l.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(l.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(l.type="InstancedMesh",l.count=this.count,l.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(l.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(l.type="BatchedMesh",l.perObjectFrustumCulled=this.perObjectFrustumCulled,l.sortObjects=this.sortObjects,l.drawRanges=this._drawRanges,l.reservedRanges=this._reservedRanges,l.geometryInfo=this._geometryInfo.map(p=>({...p,boundingBox:p.boundingBox?p.boundingBox.toJSON():void 0,boundingSphere:p.boundingSphere?p.boundingSphere.toJSON():void 0})),l.instanceInfo=this._instanceInfo.map(p=>({...p})),l.availableInstanceIds=this._availableInstanceIds.slice(),l.availableGeometryIds=this._availableGeometryIds.slice(),l.nextIndexStart=this._nextIndexStart,l.nextVertexStart=this._nextVertexStart,l.geometryCount=this._geometryCount,l.maxInstanceCount=this._maxInstanceCount,l.maxVertexCount=this._maxVertexCount,l.maxIndexCount=this._maxIndexCount,l.geometryInitialized=this._geometryInitialized,l.matricesTexture=this._matricesTexture.toJSON(e),l.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(l.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(l.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(l.boundingBox=this.boundingBox.toJSON()));function c(p,m){return p[m.uuid]===void 0&&(p[m.uuid]=m.toJSON(e)),m.uuid}if(this.isScene)this.background&&(this.background.isColor?l.background=this.background.toJSON():this.background.isTexture&&(l.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(l.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){l.geometry=c(e.geometries,this.geometry);const p=this.geometry.parameters;if(p!==void 0&&p.shapes!==void 0){const m=p.shapes;if(Array.isArray(m))for(let h=0,x=m.length;h<x;h++){const S=m[h];c(e.shapes,S)}else c(e.shapes,m)}}if(this.isSkinnedMesh&&(l.bindMode=this.bindMode,l.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(c(e.skeletons,this.skeleton),l.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const p=[];for(let m=0,h=this.material.length;m<h;m++)p.push(c(e.materials,this.material[m]));l.material=p}else l.material=c(e.materials,this.material);if(this.children.length>0){l.children=[];for(let p=0;p<this.children.length;p++)l.children.push(this.children[p].toJSON(e).object)}if(this.animations.length>0){l.animations=[];for(let p=0;p<this.animations.length;p++){const m=this.animations[p];l.animations.push(c(e.animations,m))}}if(i){const p=d(e.geometries),m=d(e.materials),h=d(e.textures),x=d(e.images),S=d(e.shapes),g=d(e.skeletons),E=d(e.animations),A=d(e.nodes);p.length>0&&(s.geometries=p),m.length>0&&(s.materials=m),h.length>0&&(s.textures=h),x.length>0&&(s.images=x),S.length>0&&(s.shapes=S),g.length>0&&(s.skeletons=g),E.length>0&&(s.animations=E),A.length>0&&(s.nodes=A)}return s.object=l,s;function d(p){const m=[];for(const h in p){const x=p[h];delete x.metadata,m.push(x)}return m}}clone(e){return new this.constructor().copy(this,e)}copy(e,i=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),i===!0)for(let s=0;s<e.children.length;s++){const l=e.children[s];this.add(l.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}bn.DEFAULT_UP=new $(0,1,0);bn.DEFAULT_MATRIX_AUTO_UPDATE=!0;bn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Bs extends bn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ay={type:"move"};class Id{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bs,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bs,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new $,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new $),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bs,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new $,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new $,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const i=this._hand;if(i)for(const s of e.hand.values())this._getHandJoint(i,s)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,i,s){let l=null,c=null,d=null;const p=this._targetRay,m=this._grip,h=this._hand;if(e&&i.session.visibilityState!=="visible-blurred"){if(h&&e.hand){d=!0;for(const D of e.hand.values()){const y=i.getJointPose(D,s),_=this._getHandJoint(h,D);y!==null&&(_.matrix.fromArray(y.transform.matrix),_.matrix.decompose(_.position,_.rotation,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=y.radius),_.visible=y!==null}const x=h.joints["index-finger-tip"],S=h.joints["thumb-tip"],g=x.position.distanceTo(S.position),E=.02,A=.005;h.inputState.pinching&&g>E+A?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&g<=E-A&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else m!==null&&e.gripSpace&&(c=i.getPose(e.gripSpace,s),c!==null&&(m.matrix.fromArray(c.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,c.linearVelocity?(m.hasLinearVelocity=!0,m.linearVelocity.copy(c.linearVelocity)):m.hasLinearVelocity=!1,c.angularVelocity?(m.hasAngularVelocity=!0,m.angularVelocity.copy(c.angularVelocity)):m.hasAngularVelocity=!1,m.eventsEnabled&&m.dispatchEvent({type:"gripUpdated",data:e,target:this})));p!==null&&(l=i.getPose(e.targetRaySpace,s),l===null&&c!==null&&(l=c),l!==null&&(p.matrix.fromArray(l.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,l.linearVelocity?(p.hasLinearVelocity=!0,p.linearVelocity.copy(l.linearVelocity)):p.hasLinearVelocity=!1,l.angularVelocity?(p.hasAngularVelocity=!0,p.angularVelocity.copy(l.angularVelocity)):p.hasAngularVelocity=!1,this.dispatchEvent(ay)))}return p!==null&&(p.visible=l!==null),m!==null&&(m.visible=c!==null),h!==null&&(h.visible=d!==null),this}_getHandJoint(e,i){if(e.joints[i.jointName]===void 0){const s=new Bs;s.matrixAutoUpdate=!1,s.visible=!1,e.joints[i.jointName]=s,e.add(s)}return e.joints[i.jointName]}}const Av={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},ts={h:0,s:0,l:0},bc={h:0,s:0,l:0};function zd(r,e,i){return i<0&&(i+=1),i>1&&(i-=1),i<1/6?r+(e-r)*6*i:i<1/2?e:i<2/3?r+(e-r)*6*(2/3-i):r}class Mt{constructor(e,i,s){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,i,s)}set(e,i,s){if(i===void 0&&s===void 0){const l=e;l&&l.isColor?this.copy(l):typeof l=="number"?this.setHex(l):typeof l=="string"&&this.setStyle(l)}else this.setRGB(e,i,s);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,i=di){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Et.colorSpaceToWorking(this,i),this}setRGB(e,i,s,l=Et.workingColorSpace){return this.r=e,this.g=i,this.b=s,Et.colorSpaceToWorking(this,l),this}setHSL(e,i,s,l=Et.workingColorSpace){if(e=WM(e,1),i=Tt(i,0,1),s=Tt(s,0,1),i===0)this.r=this.g=this.b=s;else{const c=s<=.5?s*(1+i):s+i-s*i,d=2*s-c;this.r=zd(d,c,e+1/3),this.g=zd(d,c,e),this.b=zd(d,c,e-1/3)}return Et.colorSpaceToWorking(this,l),this}setStyle(e,i=di){function s(c){c!==void 0&&parseFloat(c)<1&&tt("Color: Alpha component of "+e+" will be ignored.")}let l;if(l=/^(\w+)\(([^\)]*)\)/.exec(e)){let c;const d=l[1],p=l[2];switch(d){case"rgb":case"rgba":if(c=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setRGB(Math.min(255,parseInt(c[1],10))/255,Math.min(255,parseInt(c[2],10))/255,Math.min(255,parseInt(c[3],10))/255,i);if(c=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setRGB(Math.min(100,parseInt(c[1],10))/100,Math.min(100,parseInt(c[2],10))/100,Math.min(100,parseInt(c[3],10))/100,i);break;case"hsl":case"hsla":if(c=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(p))return s(c[4]),this.setHSL(parseFloat(c[1])/360,parseFloat(c[2])/100,parseFloat(c[3])/100,i);break;default:tt("Color: Unknown color model "+e)}}else if(l=/^\#([A-Fa-f\d]+)$/.exec(e)){const c=l[1],d=c.length;if(d===3)return this.setRGB(parseInt(c.charAt(0),16)/15,parseInt(c.charAt(1),16)/15,parseInt(c.charAt(2),16)/15,i);if(d===6)return this.setHex(parseInt(c,16),i);tt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,i);return this}setColorName(e,i=di){const s=Av[e.toLowerCase()];return s!==void 0?this.setHex(s,i):tt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ta(e.r),this.g=Ta(e.g),this.b=Ta(e.b),this}copyLinearToSRGB(e){return this.r=Gr(e.r),this.g=Gr(e.g),this.b=Gr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=di){return Et.workingToColorSpace(Pn.copy(this),e),Math.round(Tt(Pn.r*255,0,255))*65536+Math.round(Tt(Pn.g*255,0,255))*256+Math.round(Tt(Pn.b*255,0,255))}getHexString(e=di){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,i=Et.workingColorSpace){Et.workingToColorSpace(Pn.copy(this),i);const s=Pn.r,l=Pn.g,c=Pn.b,d=Math.max(s,l,c),p=Math.min(s,l,c);let m,h;const x=(p+d)/2;if(p===d)m=0,h=0;else{const S=d-p;switch(h=x<=.5?S/(d+p):S/(2-d-p),d){case s:m=(l-c)/S+(l<c?6:0);break;case l:m=(c-s)/S+2;break;case c:m=(s-l)/S+4;break}m/=6}return e.h=m,e.s=h,e.l=x,e}getRGB(e,i=Et.workingColorSpace){return Et.workingToColorSpace(Pn.copy(this),i),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=di){Et.workingToColorSpace(Pn.copy(this),e);const i=Pn.r,s=Pn.g,l=Pn.b;return e!==di?`color(${e} ${i.toFixed(3)} ${s.toFixed(3)} ${l.toFixed(3)})`:`rgb(${Math.round(i*255)},${Math.round(s*255)},${Math.round(l*255)})`}offsetHSL(e,i,s){return this.getHSL(ts),this.setHSL(ts.h+e,ts.s+i,ts.l+s)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,i){return this.r=e.r+i.r,this.g=e.g+i.g,this.b=e.b+i.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,i){return this.r+=(e.r-this.r)*i,this.g+=(e.g-this.g)*i,this.b+=(e.b-this.b)*i,this}lerpColors(e,i,s){return this.r=e.r+(i.r-e.r)*s,this.g=e.g+(i.g-e.g)*s,this.b=e.b+(i.b-e.b)*s,this}lerpHSL(e,i){this.getHSL(ts),e.getHSL(bc);const s=Dd(ts.h,bc.h,i),l=Dd(ts.s,bc.s,i),c=Dd(ts.l,bc.l,i);return this.setHSL(s,l,c),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const i=this.r,s=this.g,l=this.b,c=e.elements;return this.r=c[0]*i+c[3]*s+c[6]*l,this.g=c[1]*i+c[4]*s+c[7]*l,this.b=c[2]*i+c[5]*s+c[8]*l,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,i=0){return this.r=e[i],this.g=e[i+1],this.b=e[i+2],this}toArray(e=[],i=0){return e[i]=this.r,e[i+1]=this.g,e[i+2]=this.b,e}fromBufferAttribute(e,i){return this.r=e.getX(i),this.g=e.getY(i),this.b=e.getZ(i),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Pn=new Mt;Mt.NAMES=Av;class op{constructor(e,i=25e-5){this.isFogExp2=!0,this.name="",this.color=new Mt(e),this.density=i}clone(){return new op(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class sy extends bn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ls,this.environmentIntensity=1,this.environmentRotation=new ls,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,i){return super.copy(e,i),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const i=super.toJSON(e);return this.fog!==null&&(i.object.fog=this.fog.toJSON()),i.object.backgroundBlurriness=this.backgroundBlurriness,i.object.backgroundIntensity=this.backgroundIntensity,i.object.backgroundRotation=this.backgroundRotation.toArray(),i.object.environmentIntensity=this.environmentIntensity,i.object.environmentRotation=this.environmentRotation.toArray(),i}}const Ui=new $,_a=new $,Bd=new $,va=new $,Ar=new $,Rr=new $,M_=new $,Fd=new $,Hd=new $,Gd=new $,Vd=new Jt,kd=new Jt,Xd=new Jt;class Pi{constructor(e=new $,i=new $,s=new $){this.a=e,this.b=i,this.c=s}static getNormal(e,i,s,l){l.subVectors(s,i),Ui.subVectors(e,i),l.cross(Ui);const c=l.lengthSq();return c>0?l.multiplyScalar(1/Math.sqrt(c)):l.set(0,0,0)}static getBarycoord(e,i,s,l,c){Ui.subVectors(l,i),_a.subVectors(s,i),Bd.subVectors(e,i);const d=Ui.dot(Ui),p=Ui.dot(_a),m=Ui.dot(Bd),h=_a.dot(_a),x=_a.dot(Bd),S=d*h-p*p;if(S===0)return c.set(0,0,0),null;const g=1/S,E=(h*m-p*x)*g,A=(d*x-p*m)*g;return c.set(1-E-A,A,E)}static containsPoint(e,i,s,l){return this.getBarycoord(e,i,s,l,va)===null?!1:va.x>=0&&va.y>=0&&va.x+va.y<=1}static getInterpolation(e,i,s,l,c,d,p,m){return this.getBarycoord(e,i,s,l,va)===null?(m.x=0,m.y=0,"z"in m&&(m.z=0),"w"in m&&(m.w=0),null):(m.setScalar(0),m.addScaledVector(c,va.x),m.addScaledVector(d,va.y),m.addScaledVector(p,va.z),m)}static getInterpolatedAttribute(e,i,s,l,c,d){return Vd.setScalar(0),kd.setScalar(0),Xd.setScalar(0),Vd.fromBufferAttribute(e,i),kd.fromBufferAttribute(e,s),Xd.fromBufferAttribute(e,l),d.setScalar(0),d.addScaledVector(Vd,c.x),d.addScaledVector(kd,c.y),d.addScaledVector(Xd,c.z),d}static isFrontFacing(e,i,s,l){return Ui.subVectors(s,i),_a.subVectors(e,i),Ui.cross(_a).dot(l)<0}set(e,i,s){return this.a.copy(e),this.b.copy(i),this.c.copy(s),this}setFromPointsAndIndices(e,i,s,l){return this.a.copy(e[i]),this.b.copy(e[s]),this.c.copy(e[l]),this}setFromAttributeAndIndices(e,i,s,l){return this.a.fromBufferAttribute(e,i),this.b.fromBufferAttribute(e,s),this.c.fromBufferAttribute(e,l),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ui.subVectors(this.c,this.b),_a.subVectors(this.a,this.b),Ui.cross(_a).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Pi.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,i){return Pi.getBarycoord(e,this.a,this.b,this.c,i)}getInterpolation(e,i,s,l,c){return Pi.getInterpolation(e,this.a,this.b,this.c,i,s,l,c)}containsPoint(e){return Pi.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Pi.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,i){const s=this.a,l=this.b,c=this.c;let d,p;Ar.subVectors(l,s),Rr.subVectors(c,s),Fd.subVectors(e,s);const m=Ar.dot(Fd),h=Rr.dot(Fd);if(m<=0&&h<=0)return i.copy(s);Hd.subVectors(e,l);const x=Ar.dot(Hd),S=Rr.dot(Hd);if(x>=0&&S<=x)return i.copy(l);const g=m*S-x*h;if(g<=0&&m>=0&&x<=0)return d=m/(m-x),i.copy(s).addScaledVector(Ar,d);Gd.subVectors(e,c);const E=Ar.dot(Gd),A=Rr.dot(Gd);if(A>=0&&E<=A)return i.copy(c);const D=E*h-m*A;if(D<=0&&h>=0&&A<=0)return p=h/(h-A),i.copy(s).addScaledVector(Rr,p);const y=x*A-E*S;if(y<=0&&S-x>=0&&E-A>=0)return M_.subVectors(c,l),p=(S-x)/(S-x+(E-A)),i.copy(l).addScaledVector(M_,p);const _=1/(y+D+g);return d=D*_,p=g*_,i.copy(s).addScaledVector(Ar,d).addScaledVector(Rr,p)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class ll{constructor(e=new $(1/0,1/0,1/0),i=new $(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=i}set(e,i){return this.min.copy(e),this.max.copy(i),this}setFromArray(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i+=3)this.expandByPoint(Li.fromArray(e,i));return this}setFromBufferAttribute(e){this.makeEmpty();for(let i=0,s=e.count;i<s;i++)this.expandByPoint(Li.fromBufferAttribute(e,i));return this}setFromPoints(e){this.makeEmpty();for(let i=0,s=e.length;i<s;i++)this.expandByPoint(e[i]);return this}setFromCenterAndSize(e,i){const s=Li.copy(i).multiplyScalar(.5);return this.min.copy(e).sub(s),this.max.copy(e).add(s),this}setFromObject(e,i=!1){return this.makeEmpty(),this.expandByObject(e,i)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,i=!1){e.updateWorldMatrix(!1,!1);const s=e.geometry;if(s!==void 0){const c=s.getAttribute("position");if(i===!0&&c!==void 0&&e.isInstancedMesh!==!0)for(let d=0,p=c.count;d<p;d++)e.isMesh===!0?e.getVertexPosition(d,Li):Li.fromBufferAttribute(c,d),Li.applyMatrix4(e.matrixWorld),this.expandByPoint(Li);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ac.copy(e.boundingBox)):(s.boundingBox===null&&s.computeBoundingBox(),Ac.copy(s.boundingBox)),Ac.applyMatrix4(e.matrixWorld),this.union(Ac)}const l=e.children;for(let c=0,d=l.length;c<d;c++)this.expandByObject(l[c],i);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,i){return i.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Li),Li.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let i,s;return e.normal.x>0?(i=e.normal.x*this.min.x,s=e.normal.x*this.max.x):(i=e.normal.x*this.max.x,s=e.normal.x*this.min.x),e.normal.y>0?(i+=e.normal.y*this.min.y,s+=e.normal.y*this.max.y):(i+=e.normal.y*this.max.y,s+=e.normal.y*this.min.y),e.normal.z>0?(i+=e.normal.z*this.min.z,s+=e.normal.z*this.max.z):(i+=e.normal.z*this.max.z,s+=e.normal.z*this.min.z),i<=-e.constant&&s>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Xo),Rc.subVectors(this.max,Xo),Cr.subVectors(e.a,Xo),wr.subVectors(e.b,Xo),Dr.subVectors(e.c,Xo),ns.subVectors(wr,Cr),is.subVectors(Dr,wr),Cs.subVectors(Cr,Dr);let i=[0,-ns.z,ns.y,0,-is.z,is.y,0,-Cs.z,Cs.y,ns.z,0,-ns.x,is.z,0,-is.x,Cs.z,0,-Cs.x,-ns.y,ns.x,0,-is.y,is.x,0,-Cs.y,Cs.x,0];return!Wd(i,Cr,wr,Dr,Rc)||(i=[1,0,0,0,1,0,0,0,1],!Wd(i,Cr,wr,Dr,Rc))?!1:(Cc.crossVectors(ns,is),i=[Cc.x,Cc.y,Cc.z],Wd(i,Cr,wr,Dr,Rc))}clampPoint(e,i){return i.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Li).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Li).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(xa[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),xa[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),xa[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),xa[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),xa[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),xa[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),xa[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),xa[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(xa),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const xa=[new $,new $,new $,new $,new $,new $,new $,new $],Li=new $,Ac=new ll,Cr=new $,wr=new $,Dr=new $,ns=new $,is=new $,Cs=new $,Xo=new $,Rc=new $,Cc=new $,ws=new $;function Wd(r,e,i,s,l){for(let c=0,d=r.length-3;c<=d;c+=3){ws.fromArray(r,c);const p=l.x*Math.abs(ws.x)+l.y*Math.abs(ws.y)+l.z*Math.abs(ws.z),m=e.dot(ws),h=i.dot(ws),x=s.dot(ws);if(Math.max(-Math.max(m,h,x),Math.min(m,h,x))>p)return!1}return!0}const mn=new $,wc=new _t;let ry=0;class ba extends ks{constructor(e,i,s=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:ry++}),this.name="",this.array=e,this.itemSize=i,this.count=e!==void 0?e.length/i:0,this.normalized=s,this.usage=FM,this.updateRanges=[],this.gpuType=qi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,i){this.updateRanges.push({start:e,count:i})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,i,s){e*=this.itemSize,s*=i.itemSize;for(let l=0,c=this.itemSize;l<c;l++)this.array[e+l]=i.array[s+l];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let i=0,s=this.count;i<s;i++)wc.fromBufferAttribute(this,i),wc.applyMatrix3(e),this.setXY(i,wc.x,wc.y);else if(this.itemSize===3)for(let i=0,s=this.count;i<s;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix3(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyMatrix4(e){for(let i=0,s=this.count;i<s;i++)mn.fromBufferAttribute(this,i),mn.applyMatrix4(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let i=0,s=this.count;i<s;i++)mn.fromBufferAttribute(this,i),mn.applyNormalMatrix(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let i=0,s=this.count;i<s;i++)mn.fromBufferAttribute(this,i),mn.transformDirection(e),this.setXYZ(i,mn.x,mn.y,mn.z);return this}set(e,i=0){return this.array.set(e,i),this}getComponent(e,i){let s=this.array[e*this.itemSize+i];return this.normalized&&(s=Vo(s,this.array)),s}setComponent(e,i,s){return this.normalized&&(s=Jn(s,this.array)),this.array[e*this.itemSize+i]=s,this}getX(e){let i=this.array[e*this.itemSize];return this.normalized&&(i=Vo(i,this.array)),i}setX(e,i){return this.normalized&&(i=Jn(i,this.array)),this.array[e*this.itemSize]=i,this}getY(e){let i=this.array[e*this.itemSize+1];return this.normalized&&(i=Vo(i,this.array)),i}setY(e,i){return this.normalized&&(i=Jn(i,this.array)),this.array[e*this.itemSize+1]=i,this}getZ(e){let i=this.array[e*this.itemSize+2];return this.normalized&&(i=Vo(i,this.array)),i}setZ(e,i){return this.normalized&&(i=Jn(i,this.array)),this.array[e*this.itemSize+2]=i,this}getW(e){let i=this.array[e*this.itemSize+3];return this.normalized&&(i=Vo(i,this.array)),i}setW(e,i){return this.normalized&&(i=Jn(i,this.array)),this.array[e*this.itemSize+3]=i,this}setXY(e,i,s){return e*=this.itemSize,this.normalized&&(i=Jn(i,this.array),s=Jn(s,this.array)),this.array[e+0]=i,this.array[e+1]=s,this}setXYZ(e,i,s,l){return e*=this.itemSize,this.normalized&&(i=Jn(i,this.array),s=Jn(s,this.array),l=Jn(l,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this}setXYZW(e,i,s,l,c){return e*=this.itemSize,this.normalized&&(i=Jn(i,this.array),s=Jn(s,this.array),l=Jn(l,this.array),c=Jn(c,this.array)),this.array[e+0]=i,this.array[e+1]=s,this.array[e+2]=l,this.array[e+3]=c,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Rv extends ba{constructor(e,i,s){super(new Uint16Array(e),i,s)}}class Cv extends ba{constructor(e,i,s){super(new Uint32Array(e),i,s)}}class vn extends ba{constructor(e,i,s){super(new Float32Array(e),i,s)}}const oy=new ll,Wo=new $,Yd=new $;class uu{constructor(e=new $,i=-1){this.isSphere=!0,this.center=e,this.radius=i}set(e,i){return this.center.copy(e),this.radius=i,this}setFromPoints(e,i){const s=this.center;i!==void 0?s.copy(i):oy.setFromPoints(e).getCenter(s);let l=0;for(let c=0,d=e.length;c<d;c++)l=Math.max(l,s.distanceToSquared(e[c]));return this.radius=Math.sqrt(l),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const i=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=i*i}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,i){const s=this.center.distanceToSquared(e);return i.copy(e),s>this.radius*this.radius&&(i.sub(this.center).normalize(),i.multiplyScalar(this.radius).add(this.center)),i}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wo.subVectors(e,this.center);const i=Wo.lengthSq();if(i>this.radius*this.radius){const s=Math.sqrt(i),l=(s-this.radius)*.5;this.center.addScaledVector(Wo,l/s),this.radius+=l}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Yd.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wo.copy(e.center).add(Yd)),this.expandByPoint(Wo.copy(e.center).sub(Yd))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let ly=0;const Ti=new $t,qd=new bn,Nr=new $,fi=new ll,Yo=new ll,En=new $;class ei extends ks{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ly++}),this.uuid=ol(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(GM(e)?Cv:Rv)(e,1):this.index=e,this}setIndirect(e,i=0){return this.indirect=e,this.indirectOffset=i,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,i){return this.attributes[e]=i,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,i,s=0){this.groups.push({start:e,count:i,materialIndex:s})}clearGroups(){this.groups=[]}setDrawRange(e,i){this.drawRange.start=e,this.drawRange.count=i}applyMatrix4(e){const i=this.attributes.position;i!==void 0&&(i.applyMatrix4(e),i.needsUpdate=!0);const s=this.attributes.normal;if(s!==void 0){const c=new st().getNormalMatrix(e);s.applyNormalMatrix(c),s.needsUpdate=!0}const l=this.attributes.tangent;return l!==void 0&&(l.transformDirection(e),l.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ti.makeRotationFromQuaternion(e),this.applyMatrix4(Ti),this}rotateX(e){return Ti.makeRotationX(e),this.applyMatrix4(Ti),this}rotateY(e){return Ti.makeRotationY(e),this.applyMatrix4(Ti),this}rotateZ(e){return Ti.makeRotationZ(e),this.applyMatrix4(Ti),this}translate(e,i,s){return Ti.makeTranslation(e,i,s),this.applyMatrix4(Ti),this}scale(e,i,s){return Ti.makeScale(e,i,s),this.applyMatrix4(Ti),this}lookAt(e){return qd.lookAt(e),qd.updateMatrix(),this.applyMatrix4(qd.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Nr).negate(),this.translate(Nr.x,Nr.y,Nr.z),this}setFromPoints(e){const i=this.getAttribute("position");if(i===void 0){const s=[];for(let l=0,c=e.length;l<c;l++){const d=e[l];s.push(d.x,d.y,d.z||0)}this.setAttribute("position",new vn(s,3))}else{const s=Math.min(e.length,i.count);for(let l=0;l<s;l++){const c=e[l];i.setXYZ(l,c.x,c.y,c.z||0)}e.length>i.count&&tt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),i.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ll);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){wt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new $(-1/0,-1/0,-1/0),new $(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),i)for(let s=0,l=i.length;s<l;s++){const c=i[s];fi.setFromBufferAttribute(c),this.morphTargetsRelative?(En.addVectors(this.boundingBox.min,fi.min),this.boundingBox.expandByPoint(En),En.addVectors(this.boundingBox.max,fi.max),this.boundingBox.expandByPoint(En)):(this.boundingBox.expandByPoint(fi.min),this.boundingBox.expandByPoint(fi.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&wt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new uu);const e=this.attributes.position,i=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){wt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new $,1/0);return}if(e){const s=this.boundingSphere.center;if(fi.setFromBufferAttribute(e),i)for(let c=0,d=i.length;c<d;c++){const p=i[c];Yo.setFromBufferAttribute(p),this.morphTargetsRelative?(En.addVectors(fi.min,Yo.min),fi.expandByPoint(En),En.addVectors(fi.max,Yo.max),fi.expandByPoint(En)):(fi.expandByPoint(Yo.min),fi.expandByPoint(Yo.max))}fi.getCenter(s);let l=0;for(let c=0,d=e.count;c<d;c++)En.fromBufferAttribute(e,c),l=Math.max(l,s.distanceToSquared(En));if(i)for(let c=0,d=i.length;c<d;c++){const p=i[c],m=this.morphTargetsRelative;for(let h=0,x=p.count;h<x;h++)En.fromBufferAttribute(p,h),m&&(Nr.fromBufferAttribute(e,h),En.add(Nr)),l=Math.max(l,s.distanceToSquared(En))}this.boundingSphere.radius=Math.sqrt(l),isNaN(this.boundingSphere.radius)&&wt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,i=this.attributes;if(e===null||i.position===void 0||i.normal===void 0||i.uv===void 0){wt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const s=i.position,l=i.normal,c=i.uv;let d=this.getAttribute("tangent");(d===void 0||d.count!==s.count)&&(d=new ba(new Float32Array(4*s.count),4),this.setAttribute("tangent",d));const p=[],m=[];for(let T=0;T<s.count;T++)p[T]=new $,m[T]=new $;const h=new $,x=new $,S=new $,g=new _t,E=new _t,A=new _t,D=new $,y=new $;function _(T,z,X){h.fromBufferAttribute(s,T),x.fromBufferAttribute(s,z),S.fromBufferAttribute(s,X),g.fromBufferAttribute(c,T),E.fromBufferAttribute(c,z),A.fromBufferAttribute(c,X),x.sub(h),S.sub(h),E.sub(g),A.sub(g);const K=1/(E.x*A.y-A.x*E.y);isFinite(K)&&(D.copy(x).multiplyScalar(A.y).addScaledVector(S,-E.y).multiplyScalar(K),y.copy(S).multiplyScalar(E.x).addScaledVector(x,-A.x).multiplyScalar(K),p[T].add(D),p[z].add(D),p[X].add(D),m[T].add(y),m[z].add(y),m[X].add(y))}let I=this.groups;I.length===0&&(I=[{start:0,count:e.count}]);for(let T=0,z=I.length;T<z;++T){const X=I[T],K=X.start,j=X.count;for(let oe=K,Z=K+j;oe<Z;oe+=3)_(e.getX(oe+0),e.getX(oe+1),e.getX(oe+2))}const O=new $,w=new $,U=new $,P=new $;function F(T){U.fromBufferAttribute(l,T),P.copy(U);const z=p[T];O.copy(z),O.sub(U.multiplyScalar(U.dot(z))).normalize(),w.crossVectors(P,z);const K=w.dot(m[T])<0?-1:1;d.setXYZW(T,O.x,O.y,O.z,K)}for(let T=0,z=I.length;T<z;++T){const X=I[T],K=X.start,j=X.count;for(let oe=K,Z=K+j;oe<Z;oe+=3)F(e.getX(oe+0)),F(e.getX(oe+1)),F(e.getX(oe+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,i=this.getAttribute("position");if(i!==void 0){let s=this.getAttribute("normal");if(s===void 0||s.count!==i.count)s=new ba(new Float32Array(i.count*3),3),this.setAttribute("normal",s);else for(let g=0,E=s.count;g<E;g++)s.setXYZ(g,0,0,0);const l=new $,c=new $,d=new $,p=new $,m=new $,h=new $,x=new $,S=new $;if(e)for(let g=0,E=e.count;g<E;g+=3){const A=e.getX(g+0),D=e.getX(g+1),y=e.getX(g+2);l.fromBufferAttribute(i,A),c.fromBufferAttribute(i,D),d.fromBufferAttribute(i,y),x.subVectors(d,c),S.subVectors(l,c),x.cross(S),p.fromBufferAttribute(s,A),m.fromBufferAttribute(s,D),h.fromBufferAttribute(s,y),p.add(x),m.add(x),h.add(x),s.setXYZ(A,p.x,p.y,p.z),s.setXYZ(D,m.x,m.y,m.z),s.setXYZ(y,h.x,h.y,h.z)}else for(let g=0,E=i.count;g<E;g+=3)l.fromBufferAttribute(i,g+0),c.fromBufferAttribute(i,g+1),d.fromBufferAttribute(i,g+2),x.subVectors(d,c),S.subVectors(l,c),x.cross(S),s.setXYZ(g+0,x.x,x.y,x.z),s.setXYZ(g+1,x.x,x.y,x.z),s.setXYZ(g+2,x.x,x.y,x.z);this.normalizeNormals(),s.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let i=0,s=e.count;i<s;i++)En.fromBufferAttribute(e,i),En.normalize(),e.setXYZ(i,En.x,En.y,En.z)}toNonIndexed(){function e(p,m){const h=p.array,x=p.itemSize,S=p.normalized,g=new h.constructor(m.length*x);let E=0,A=0;for(let D=0,y=m.length;D<y;D++){p.isInterleavedBufferAttribute?E=m[D]*p.data.stride+p.offset:E=m[D]*x;for(let _=0;_<x;_++)g[A++]=h[E++]}return new ba(g,x,S)}if(this.index===null)return tt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const i=new ei,s=this.index.array,l=this.attributes;for(const p in l){const m=l[p],h=e(m,s);i.setAttribute(p,h)}const c=this.morphAttributes;for(const p in c){const m=[],h=c[p];for(let x=0,S=h.length;x<S;x++){const g=h[x],E=e(g,s);m.push(E)}i.morphAttributes[p]=m}i.morphTargetsRelative=this.morphTargetsRelative;const d=this.groups;for(let p=0,m=d.length;p<m;p++){const h=d[p];i.addGroup(h.start,h.count,h.materialIndex)}return i}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const m=this.parameters;for(const h in m)m[h]!==void 0&&(e[h]=m[h]);return e}e.data={attributes:{}};const i=this.index;i!==null&&(e.data.index={type:i.array.constructor.name,array:Array.prototype.slice.call(i.array)});const s=this.attributes;for(const m in s){const h=s[m];e.data.attributes[m]=h.toJSON(e.data)}const l={};let c=!1;for(const m in this.morphAttributes){const h=this.morphAttributes[m],x=[];for(let S=0,g=h.length;S<g;S++){const E=h[S];x.push(E.toJSON(e.data))}x.length>0&&(l[m]=x,c=!0)}c&&(e.data.morphAttributes=l,e.data.morphTargetsRelative=this.morphTargetsRelative);const d=this.groups;d.length>0&&(e.data.groups=JSON.parse(JSON.stringify(d)));const p=this.boundingSphere;return p!==null&&(e.data.boundingSphere=p.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const i={};this.name=e.name;const s=e.index;s!==null&&this.setIndex(s.clone());const l=e.attributes;for(const h in l){const x=l[h];this.setAttribute(h,x.clone(i))}const c=e.morphAttributes;for(const h in c){const x=[],S=c[h];for(let g=0,E=S.length;g<E;g++)x.push(S[g].clone(i));this.morphAttributes[h]=x}this.morphTargetsRelative=e.morphTargetsRelative;const d=e.groups;for(let h=0,x=d.length;h<x;h++){const S=d[h];this.addGroup(S.start,S.count,S.materialIndex)}const p=e.boundingBox;p!==null&&(this.boundingBox=p.clone());const m=e.boundingSphere;return m!==null&&(this.boundingSphere=m.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const jd=new $,cy=new $,uy=new st;class rs{constructor(e=new $(1,0,0),i=0){this.isPlane=!0,this.normal=e,this.constant=i}set(e,i){return this.normal.copy(e),this.constant=i,this}setComponents(e,i,s,l){return this.normal.set(e,i,s),this.constant=l,this}setFromNormalAndCoplanarPoint(e,i){return this.normal.copy(e),this.constant=-i.dot(this.normal),this}setFromCoplanarPoints(e,i,s){const l=jd.subVectors(s,i).cross(cy.subVectors(e,i)).normalize();return this.setFromNormalAndCoplanarPoint(l,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,i){return i.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,i,s=!0){const l=e.delta(jd),c=this.normal.dot(l);if(c===0)return this.distanceToPoint(e.start)===0?i.copy(e.start):null;const d=-(e.start.dot(this.normal)+this.constant)/c;return s===!0&&(d<0||d>1)?null:i.copy(e.start).addScaledVector(l,d)}intersectsLine(e){const i=this.distanceToPoint(e.start),s=this.distanceToPoint(e.end);return i<0&&s>0||s<0&&i>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,i){const s=i||uy.getNormalMatrix(e),l=this.coplanarPoint(jd).applyMatrix4(e),c=this.normal.applyMatrix3(s).normalize();return this.constant=-l.dot(c),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let fy=0;class Wr extends ks{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:fy++}),this.uuid=ol(),this.name="",this.type="Material",this.blending=el,this.side=Hs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rv,this.blendDst=ov,this.blendEquation=Br,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Mt(0,0,0),this.blendAlpha=0,this.depthFunc=nl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=UM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Cd,this.stencilZFail=Cd,this.stencilZPass=Cd,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const i in e){const s=e[i];if(s===void 0){tt(`Material: parameter '${i}' has value of undefined.`);continue}const l=this[i];if(l===void 0){tt(`Material: '${i}' is not a property of THREE.${this.type}.`);continue}l&&l.isColor?l.set(s):l&&l.isVector2&&s&&s.isVector2||l&&l.isEuler&&s&&s.isEuler||l&&l.isVector3&&s&&s.isVector3?l.copy(s):this[i]=s}}toJSON(e){const i=e===void 0||typeof e=="string";i&&(e={textures:{},images:{}});const s={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};s.uuid=this.uuid,s.type=this.type,s.blending=this.blending,s.side=this.side,s.shadowSide=this.shadowSide,s.vertexColors=this.vertexColors,s.opacity=this.opacity,s.transparent=this.transparent,s.blendSrc=this.blendSrc,s.blendDst=this.blendDst,s.blendEquation=this.blendEquation,s.blendSrcAlpha=this.blendSrcAlpha,s.blendDstAlpha=this.blendDstAlpha,s.blendEquationAlpha=this.blendEquationAlpha,s.blendColor=this.blendColor.getHex(),s.blendAlpha=this.blendAlpha,s.depthFunc=this.depthFunc,s.depthTest=this.depthTest,s.depthWrite=this.depthWrite,s.colorWrite=this.colorWrite,s.clipIntersection=this.clipIntersection,s.clipShadows=this.clipShadows,s.stencilWriteMask=this.stencilWriteMask,s.stencilFunc=this.stencilFunc,s.stencilRef=this.stencilRef,s.stencilFuncMask=this.stencilFuncMask,s.stencilFail=this.stencilFail,s.stencilZFail=this.stencilZFail,s.stencilZPass=this.stencilZPass,s.stencilWrite=this.stencilWrite,s.polygonOffset=this.polygonOffset,s.polygonOffsetFactor=this.polygonOffsetFactor,s.polygonOffsetUnits=this.polygonOffsetUnits,s.dithering=this.dithering,s.alphaTest=this.alphaTest,s.alphaHash=this.alphaHash,s.alphaToCoverage=this.alphaToCoverage,s.premultipliedAlpha=this.premultipliedAlpha,s.forceSinglePass=this.forceSinglePass,s.allowOverride=this.allowOverride,s.visible=this.visible,s.toneMapped=this.toneMapped,s.name=this.name,this.color&&this.color.isColor&&(s.color=this.color.getHex()),this.roughness!==void 0&&(s.roughness=this.roughness),this.metalness!==void 0&&(s.metalness=this.metalness),this.sheen!==void 0&&(s.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(s.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(s.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(s.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(s.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(s.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(s.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(s.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(s.shininess=this.shininess),this.clearcoat!==void 0&&(s.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(s.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(s.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(s.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(s.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,s.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(s.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(s.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(s.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(s.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(s.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(s.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(s.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(s.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(s.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(s.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(s.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(s.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(s.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(s.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(s.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(s.lightMap=this.lightMap.toJSON(e).uuid,s.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(s.aoMap=this.aoMap.toJSON(e).uuid,s.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(s.bumpMap=this.bumpMap.toJSON(e).uuid,s.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(s.normalMap=this.normalMap.toJSON(e).uuid,s.normalMapType=this.normalMapType,s.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(s.displacementMap=this.displacementMap.toJSON(e).uuid,s.displacementScale=this.displacementScale,s.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(s.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(s.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(s.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(s.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(s.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(s.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(s.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(s.combine=this.combine)),this.envMapRotation!==void 0&&(s.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(s.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(s.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(s.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(s.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(s.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(s.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(s.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(s.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(s.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(s.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(s.size=this.size),this.sizeAttenuation!==void 0&&(s.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(s.clippingPlanes=this.clippingPlanes.map(c=>c.toJSON())),this.rotation!==void 0&&(s.rotation=this.rotation),this.depthPacking!==void 0&&(s.depthPacking=this.depthPacking),this.linewidth!==void 0&&(s.linewidth=this.linewidth),this.linecap!==void 0&&(s.linecap=this.linecap),this.linejoin!==void 0&&(s.linejoin=this.linejoin),this.dashSize!==void 0&&(s.dashSize=this.dashSize),this.gapSize!==void 0&&(s.gapSize=this.gapSize),this.scale!==void 0&&(s.scale=this.scale),this.wireframe!==void 0&&(s.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(s.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(s.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(s.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(s.flatShading=this.flatShading),this.fog!==void 0&&(s.fog=this.fog),Object.keys(this.userData).length>0&&(s.userData=this.userData);function l(c){const d=[];for(const p in c){const m=c[p];delete m.metadata,d.push(m)}return d}if(i){const c=l(e.textures),d=l(e.images);c.length>0&&(s.textures=c),d.length>0&&(s.images=d)}return s}fromJSON(e,i){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Mt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(s=>new rs().fromJSON(s))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=i[e.map]||null),e.matcap!==void 0&&(this.matcap=i[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=i[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=i[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=i[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let s=e.normalScale;Array.isArray(s)===!1&&(s=[s,s]),this.normalScale=new _t().fromArray(s)}return e.displacementMap!==void 0&&(this.displacementMap=i[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=i[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=i[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=i[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=i[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=i[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=i[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=i[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=i[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=i[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=i[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=i[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=i[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=i[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new _t().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=i[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=i[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=i[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=i[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=i[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=i[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=i[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const i=e.clippingPlanes;let s=null;if(i!==null){const l=i.length;s=new Array(l);for(let c=0;c!==l;++c)s[c]=i[c].clone()}return this.clippingPlanes=s,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Sa=new $,Zd=new $,Dc=new $,Nc=new $;class wv{constructor(e=new $,i=new $(0,0,-1)){this.origin=e,this.direction=i}set(e,i){return this.origin.copy(e),this.direction.copy(i),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,i){return i.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sa)),this}closestPointToPoint(e,i){i.subVectors(e,this.origin);const s=i.dot(this.direction);return s<0?i.copy(this.origin):i.copy(this.origin).addScaledVector(this.direction,s)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const i=Sa.subVectors(e,this.origin).dot(this.direction);return i<0?this.origin.distanceToSquared(e):(Sa.copy(this.origin).addScaledVector(this.direction,i),Sa.distanceToSquared(e))}distanceSqToSegment(e,i,s,l){Zd.copy(e).add(i).multiplyScalar(.5),Dc.copy(i).sub(e).normalize(),Nc.copy(this.origin).sub(Zd);const c=e.distanceTo(i)*.5,d=-this.direction.dot(Dc),p=Nc.dot(this.direction),m=-Nc.dot(Dc),h=Nc.lengthSq(),x=Math.abs(1-d*d);let S,g,E,A;if(x>0)if(S=d*m-p,g=d*p-m,A=c*x,S>=0)if(g>=-A)if(g<=A){const D=1/x;S*=D,g*=D,E=S*(S+d*g+2*p)+g*(d*S+g+2*m)+h}else g=c,S=Math.max(0,-(d*g+p)),E=-S*S+g*(g+2*m)+h;else g=-c,S=Math.max(0,-(d*g+p)),E=-S*S+g*(g+2*m)+h;else g<=-A?(S=Math.max(0,-(-d*c+p)),g=S>0?-c:Math.min(Math.max(-c,-m),c),E=-S*S+g*(g+2*m)+h):g<=A?(S=0,g=Math.min(Math.max(-c,-m),c),E=g*(g+2*m)+h):(S=Math.max(0,-(d*c+p)),g=S>0?c:Math.min(Math.max(-c,-m),c),E=-S*S+g*(g+2*m)+h);else g=d>0?-c:c,S=Math.max(0,-(d*g+p)),E=-S*S+g*(g+2*m)+h;return s&&s.copy(this.origin).addScaledVector(this.direction,S),l&&l.copy(Zd).addScaledVector(Dc,g),E}intersectSphere(e,i){if(e.radius<0)return null;Sa.subVectors(e.center,this.origin);const s=Sa.dot(this.direction),l=Sa.dot(Sa)-s*s,c=e.radius*e.radius;if(l>c)return null;const d=Math.sqrt(c-l),p=s-d,m=s+d;return m<0?null:p<0?this.at(m,i):this.at(p,i)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const i=e.normal.dot(this.direction);if(i===0)return e.distanceToPoint(this.origin)===0?0:null;const s=-(this.origin.dot(e.normal)+e.constant)/i;return s>=0?s:null}intersectPlane(e,i){const s=this.distanceToPlane(e);return s===null?null:this.at(s,i)}intersectsPlane(e){const i=e.distanceToPoint(this.origin);return i===0||e.normal.dot(this.direction)*i<0}intersectBox(e,i){let s,l,c,d,p,m;const h=1/this.direction.x,x=1/this.direction.y,S=1/this.direction.z,g=this.origin;return h>=0?(s=(e.min.x-g.x)*h,l=(e.max.x-g.x)*h):(s=(e.max.x-g.x)*h,l=(e.min.x-g.x)*h),x>=0?(c=(e.min.y-g.y)*x,d=(e.max.y-g.y)*x):(c=(e.max.y-g.y)*x,d=(e.min.y-g.y)*x),s>d||c>l||((c>s||isNaN(s))&&(s=c),(d<l||isNaN(l))&&(l=d),S>=0?(p=(e.min.z-g.z)*S,m=(e.max.z-g.z)*S):(p=(e.max.z-g.z)*S,m=(e.min.z-g.z)*S),s>m||p>l)||((p>s||s!==s)&&(s=p),(m<l||l!==l)&&(l=m),l<0)?null:this.at(s>=0?s:l,i)}intersectsBox(e){return this.intersectBox(e,Sa)!==null}intersectTriangle(e,i,s,l,c){const d=this.origin,p=this.direction,m=p.x,h=p.y,x=p.z,S=e.x-d.x,g=e.y-d.y,E=e.z-d.z,A=i.x-d.x,D=i.y-d.y,y=i.z-d.z,_=s.x-d.x,I=s.y-d.y,O=s.z-d.z,w=Math.abs(m),U=Math.abs(h),P=Math.abs(x);let F,T,z,X,K,j,oe,Z,ne,N,V,fe;if(w>=U&&w>=P?(z=m,j=S,ne=A,fe=_,m>=0?(F=h,T=x,X=g,K=E,oe=D,Z=y,N=I,V=O):(F=x,T=h,X=E,K=g,oe=y,Z=D,N=O,V=I)):U>=P?(z=h,j=g,ne=D,fe=I,h>=0?(F=x,T=m,X=E,K=S,oe=y,Z=A,N=O,V=_):(F=m,T=x,X=S,K=E,oe=A,Z=y,N=_,V=O)):(z=x,j=E,ne=y,fe=O,x>=0?(F=m,T=h,X=S,K=g,oe=A,Z=D,N=_,V=I):(F=h,T=m,X=g,K=S,oe=D,Z=A,N=I,V=_)),z===0)return null;const se=F/z,H=T/z,C=1/z,Y=X-se*j,ee=K-H*j,ye=oe-se*ne,De=Z-H*ne,Fe=N-se*fe,re=V-H*fe,me=Fe*De-re*ye,be=Y*re-ee*Fe,$e=ye*ee-De*Y;if(l){if(me<0||be<0||$e<0)return null}else if((me<0||be<0||$e<0)&&(me>0||be>0||$e>0))return null;const Oe=me+be+$e;if(Oe===0)return null;const ot=C*(me*j+be*ne+$e*fe);return(Oe>0?ot<0:ot>0)?null:this.at(ot/Oe,c)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class fu extends Wr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Mt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ls,this.combine=lv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const y_=new $t,Ds=new wv,Uc=new uu,E_=new $,Lc=new $,Oc=new $,Pc=new $,Kd=new $,Ic=new $,T_=new $,zc=new $;class Tn extends bn{constructor(e=new ei,i=new fu){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,d=l.length;c<d;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}getVertexPosition(e,i){const s=this.geometry,l=s.attributes.position,c=s.morphAttributes.position,d=s.morphTargetsRelative;i.fromBufferAttribute(l,e);const p=this.morphTargetInfluences;if(c&&p){Ic.set(0,0,0);for(let m=0,h=c.length;m<h;m++){const x=p[m],S=c[m];x!==0&&(Kd.fromBufferAttribute(S,e),d?Ic.addScaledVector(Kd,x):Ic.addScaledVector(Kd.sub(i),x))}i.add(Ic)}return i}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,i){const s=this.geometry,l=this.material,c=this.matrixWorld;l!==void 0&&(s.boundingSphere===null&&s.computeBoundingSphere(),Uc.copy(s.boundingSphere),Uc.applyMatrix4(c),Ds.copy(e.ray).recast(e.near),!(Uc.containsPoint(Ds.origin)===!1&&(Ds.intersectSphere(Uc,E_)===null||Ds.origin.distanceToSquared(E_)>(e.far-e.near)**2))&&(y_.copy(c).invert(),Ds.copy(e.ray).applyMatrix4(y_),!(s.boundingBox!==null&&Ds.intersectsBox(s.boundingBox)===!1)&&this._computeIntersections(e,i,Ds)))}_computeIntersections(e,i,s){let l;const c=this.geometry,d=this.material,p=c.index,m=c.attributes.position,h=c.attributes.uv,x=c.attributes.uv1,S=c.attributes.normal,g=c.groups,E=c.drawRange;if(p!==null)if(Array.isArray(d))for(let A=0,D=g.length;A<D;A++){const y=g[A],_=d[y.materialIndex],I=Math.max(y.start,E.start),O=Math.min(p.count,Math.min(y.start+y.count,E.start+E.count));for(let w=I,U=O;w<U;w+=3){const P=p.getX(w),F=p.getX(w+1),T=p.getX(w+2);l=Bc(this,_,e,s,h,x,S,P,F,T),l&&(l.faceIndex=Math.floor(w/3),l.face.materialIndex=y.materialIndex,i.push(l))}}else{const A=Math.max(0,E.start),D=Math.min(p.count,E.start+E.count);for(let y=A,_=D;y<_;y+=3){const I=p.getX(y),O=p.getX(y+1),w=p.getX(y+2);l=Bc(this,d,e,s,h,x,S,I,O,w),l&&(l.faceIndex=Math.floor(y/3),i.push(l))}}else if(m!==void 0)if(Array.isArray(d))for(let A=0,D=g.length;A<D;A++){const y=g[A],_=d[y.materialIndex],I=Math.max(y.start,E.start),O=Math.min(m.count,Math.min(y.start+y.count,E.start+E.count));for(let w=I,U=O;w<U;w+=3){const P=w,F=w+1,T=w+2;l=Bc(this,_,e,s,h,x,S,P,F,T),l&&(l.faceIndex=Math.floor(w/3),l.face.materialIndex=y.materialIndex,i.push(l))}}else{const A=Math.max(0,E.start),D=Math.min(m.count,E.start+E.count);for(let y=A,_=D;y<_;y+=3){const I=y,O=y+1,w=y+2;l=Bc(this,d,e,s,h,x,S,I,O,w),l&&(l.faceIndex=Math.floor(y/3),i.push(l))}}}}function dy(r,e,i,s,l,c,d,p){let m;if(e.side===Vn?m=s.intersectTriangle(d,c,l,!0,p):m=s.intersectTriangle(l,c,d,e.side===Hs,p),m===null)return null;zc.copy(p),zc.applyMatrix4(r.matrixWorld);const h=i.ray.origin.distanceTo(zc);return h<i.near||h>i.far?null:{distance:h,point:zc.clone(),object:r}}function Bc(r,e,i,s,l,c,d,p,m,h){r.getVertexPosition(p,Lc),r.getVertexPosition(m,Oc),r.getVertexPosition(h,Pc);const x=dy(r,e,i,s,Lc,Oc,Pc,T_);if(x){const S=new $;Pi.getBarycoord(T_,Lc,Oc,Pc,S),l&&(x.uv=Pi.getInterpolatedAttribute(l,p,m,h,S,new _t)),c&&(x.uv1=Pi.getInterpolatedAttribute(c,p,m,h,S,new _t)),d&&(x.normal=Pi.getInterpolatedAttribute(d,p,m,h,S,new $),x.normal.dot(s.direction)>0&&x.normal.multiplyScalar(-1));const g={a:p,b:m,c:h,normal:new $,materialIndex:0};Pi.getNormal(Lc,Oc,Pc,g.normal),x.face=g,x.barycoord=S}return x}class hy extends kn{constructor(e=null,i=1,s=1,l,c,d,p,m,h=Un,x=Un,S,g){super(null,d,p,m,h,x,l,c,S,g),this.isDataTexture=!0,this.image={data:e,width:i,height:s},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Ns=new uu,py=new _t(.5,.5),Fc=new $;class lp{constructor(e=new rs,i=new rs,s=new rs,l=new rs,c=new rs,d=new rs){this.planes=[e,i,s,l,c,d]}set(e,i,s,l,c,d){const p=this.planes;return p[0].copy(e),p[1].copy(i),p[2].copy(s),p[3].copy(l),p[4].copy(c),p[5].copy(d),this}copy(e){const i=this.planes;for(let s=0;s<6;s++)i[s].copy(e.planes[s]);return this}setFromProjectionMatrix(e,i=ji,s=!1){const l=this.planes,c=e.elements,d=c[0],p=c[1],m=c[2],h=c[3],x=c[4],S=c[5],g=c[6],E=c[7],A=c[8],D=c[9],y=c[10],_=c[11],I=c[12],O=c[13],w=c[14],U=c[15];if(l[0].setComponents(h-d,E-x,_-A,U-I).normalize(),l[1].setComponents(h+d,E+x,_+A,U+I).normalize(),l[2].setComponents(h+p,E+S,_+D,U+O).normalize(),l[3].setComponents(h-p,E-S,_-D,U-O).normalize(),s)l[4].setComponents(m,g,y,w).normalize(),l[5].setComponents(h-m,E-g,_-y,U-w).normalize();else if(l[4].setComponents(h-m,E-g,_-y,U-w).normalize(),i===ji)l[5].setComponents(h+m,E+g,_+y,U+w).normalize();else if(i===sl)l[5].setComponents(m,g,y,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+i);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Ns.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const i=e.geometry;i.boundingSphere===null&&i.computeBoundingSphere(),Ns.copy(i.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Ns)}intersectsSprite(e){Ns.center.set(0,0,0);const i=py.distanceTo(e.center);return Ns.radius=.7071067811865476+i,Ns.applyMatrix4(e.matrixWorld),this.intersectsSphere(Ns)}intersectsSphere(e){const i=this.planes,s=e.center,l=-e.radius;for(let c=0;c<6;c++)if(i[c].distanceToPoint(s)<l)return!1;return!0}intersectsBox(e){const i=this.planes;for(let s=0;s<6;s++){const l=i[s];if(Fc.x=l.normal.x>0?e.max.x:e.min.x,Fc.y=l.normal.y>0?e.max.y:e.min.y,Fc.z=l.normal.z>0?e.max.z:e.min.z,l.distanceToPoint(Fc)<0)return!1}return!0}containsPoint(e){const i=this.planes;for(let s=0;s<6;s++)if(i[s].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Dv extends Wr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Mt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const au=new $,su=new $,b_=new $t,qo=new wv,Hc=new uu,Qd=new $,A_=new $;class my extends bn{constructor(e=new ei,i=new Dv){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=i,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,i){return super.copy(e,i),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,s=[0];for(let l=1,c=i.count;l<c;l++)au.fromBufferAttribute(i,l-1),su.fromBufferAttribute(i,l),s[l]=s[l-1],s[l]+=au.distanceTo(su);e.setAttribute("lineDistance",new vn(s,1))}else tt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,i){const s=this.geometry,l=this.matrixWorld,c=e.params.Line.threshold,d=s.drawRange;if(s.boundingSphere===null&&s.computeBoundingSphere(),Hc.copy(s.boundingSphere),Hc.applyMatrix4(l),Hc.radius+=c,e.ray.intersectsSphere(Hc)===!1)return;b_.copy(l).invert(),qo.copy(e.ray).applyMatrix4(b_);const p=c/((this.scale.x+this.scale.y+this.scale.z)/3),m=p*p,h=this.isLineSegments?2:1,x=s.index,g=s.attributes.position;if(x!==null){const E=Math.max(0,d.start),A=Math.min(x.count,d.start+d.count);for(let D=E,y=A-1;D<y;D+=h){const _=x.getX(D),I=x.getX(D+1),O=Gc(this,e,qo,m,_,I,D);O&&i.push(O)}if(this.isLineLoop){const D=x.getX(A-1),y=x.getX(E),_=Gc(this,e,qo,m,D,y,A-1);_&&i.push(_)}}else{const E=Math.max(0,d.start),A=Math.min(g.count,d.start+d.count);for(let D=E,y=A-1;D<y;D+=h){const _=Gc(this,e,qo,m,D,D+1,D);_&&i.push(_)}if(this.isLineLoop){const D=Gc(this,e,qo,m,A-1,E,A-1);D&&i.push(D)}}}updateMorphTargets(){const i=this.geometry.morphAttributes,s=Object.keys(i);if(s.length>0){const l=i[s[0]];if(l!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let c=0,d=l.length;c<d;c++){const p=l[c].name||String(c);this.morphTargetInfluences.push(0),this.morphTargetDictionary[p]=c}}}}}function Gc(r,e,i,s,l,c,d){const p=r.geometry.attributes.position;if(au.fromBufferAttribute(p,l),su.fromBufferAttribute(p,c),i.distanceSqToSegment(au,su,Qd,A_)>s)return;Qd.applyMatrix4(r.matrixWorld);const h=e.ray.origin.distanceTo(Qd);if(!(h<e.near||h>e.far))return{distance:h,point:A_.clone().applyMatrix4(r.matrixWorld),index:d,face:null,faceIndex:null,barycoord:null,object:r}}const R_=new $,C_=new $;class gy extends my{constructor(e,i){super(e,i),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const i=e.attributes.position,s=[];for(let l=0,c=i.count;l<c;l+=2)R_.fromBufferAttribute(i,l),C_.fromBufferAttribute(i,l+1),s[l]=l===0?0:s[l-1],s[l+1]=s[l]+R_.distanceTo(C_);e.setAttribute("lineDistance",new vn(s,1))}else tt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Nv extends kn{constructor(e=[],i=Gs,s,l,c,d,p,m,h,x){super(e,i,s,l,c,d,p,m,h,x),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class rl extends kn{constructor(e,i,s=Ki,l,c,d,p=Un,m=Un,h,x=Aa,S=1){if(x!==Aa&&x!==zs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const g={width:e,height:i,depth:S};super(g,l,c,d,p,m,x,s,h),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new rp(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const i=super.toJSON(e);return i.compareFunction=this.compareFunction,i}}class _y extends rl{constructor(e,i=Ki,s=Gs,l,c,d=Un,p=Un,m,h=Aa){const x={width:e,height:e,depth:1},S=[x,x,x,x,x,x];super(e,e,i,s,l,c,d,p,m,h),this.image=S,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class Uv extends kn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Yr extends ei{constructor(e=1,i=1,s=1,l=1,c=1,d=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:i,depth:s,widthSegments:l,heightSegments:c,depthSegments:d};const p=this;l=Math.floor(l),c=Math.floor(c),d=Math.floor(d);const m=[],h=[],x=[],S=[];let g=0,E=0;A("z","y","x",-1,-1,s,i,e,d,c,0),A("z","y","x",1,-1,s,i,-e,d,c,1),A("x","z","y",1,1,e,s,i,l,d,2),A("x","z","y",1,-1,e,s,-i,l,d,3),A("x","y","z",1,-1,e,i,s,l,c,4),A("x","y","z",-1,-1,e,i,-s,l,c,5),this.setIndex(m),this.setAttribute("position",new vn(h,3)),this.setAttribute("normal",new vn(x,3)),this.setAttribute("uv",new vn(S,2));function A(D,y,_,I,O,w,U,P,F,T,z){const X=w/F,K=U/T,j=w/2,oe=U/2,Z=P/2,ne=F+1,N=T+1;let V=0,fe=0;const se=new $;for(let H=0;H<N;H++){const C=H*K-oe;for(let Y=0;Y<ne;Y++){const ee=Y*X-j;se[D]=ee*I,se[y]=C*O,se[_]=Z,h.push(se.x,se.y,se.z),se[D]=0,se[y]=0,se[_]=P>0?1:-1,x.push(se.x,se.y,se.z),S.push(Y/F),S.push(1-H/T),V+=1}}for(let H=0;H<T;H++)for(let C=0;C<F;C++){const Y=g+C+ne*H,ee=g+C+ne*(H+1),ye=g+(C+1)+ne*(H+1),De=g+(C+1)+ne*H;m.push(Y,ee,De),m.push(ee,ye,De),fe+=6}p.addGroup(E,fe,z),E+=fe,g+=V}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Yr(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class cl extends ei{constructor(e=1,i=1,s=1,l=32,c=1,d=!1,p=0,m=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:i,height:s,radialSegments:l,heightSegments:c,openEnded:d,thetaStart:p,thetaLength:m};const h=this;l=Math.floor(l),c=Math.floor(c);const x=[],S=[],g=[],E=[];let A=0;const D=[],y=s/2;let _=0;I(),d===!1&&(e>0&&O(!0),i>0&&O(!1)),this.setIndex(x),this.setAttribute("position",new vn(S,3)),this.setAttribute("normal",new vn(g,3)),this.setAttribute("uv",new vn(E,2));function I(){const w=new $,U=new $;let P=0;const F=(i-e)/s;for(let T=0;T<=c;T++){const z=[],X=T/c,K=X*(i-e)+e;for(let j=0;j<=l;j++){const oe=j/l,Z=oe*m+p,ne=Math.sin(Z),N=Math.cos(Z);U.x=K*ne,U.y=-X*s+y,U.z=K*N,S.push(U.x,U.y,U.z),w.set(ne,F,N).normalize(),g.push(w.x,w.y,w.z),E.push(oe,1-X),z.push(A++)}D.push(z)}for(let T=0;T<l;T++)for(let z=0;z<c;z++){const X=D[z][T],K=D[z+1][T],j=D[z+1][T+1],oe=D[z][T+1];(e>0||z!==0)&&(x.push(X,K,oe),P+=3),(i>0||z!==c-1)&&(x.push(K,j,oe),P+=3)}h.addGroup(_,P,0),_+=P}function O(w){const U=A,P=new _t,F=new $;let T=0;const z=w===!0?e:i,X=w===!0?1:-1;for(let j=1;j<=l;j++)S.push(0,y*X,0),g.push(0,X,0),E.push(.5,.5),A++;const K=A;for(let j=0;j<=l;j++){const Z=j/l*m+p,ne=Math.cos(Z),N=Math.sin(Z);F.x=z*N,F.y=y*X,F.z=z*ne,S.push(F.x,F.y,F.z),g.push(0,X,0),P.x=ne*.5+.5,P.y=N*.5*X+.5,E.push(P.x,P.y),A++}for(let j=0;j<l;j++){const oe=U+j,Z=K+j;w===!0?x.push(Z,Z+1,oe):x.push(Z+1,Z,oe),T+=3}h.addGroup(_,T,w===!0?1:2),_+=T}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new cl(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class cp extends cl{constructor(e=1,i=1,s=32,l=1,c=!1,d=0,p=Math.PI*2){super(0,e,i,s,l,c,d,p),this.type="ConeGeometry",this.parameters={radius:e,height:i,radialSegments:s,heightSegments:l,openEnded:c,thetaStart:d,thetaLength:p}}static fromJSON(e){return new cp(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ul extends ei{constructor(e=1,i=1,s=1,l=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:i,widthSegments:s,heightSegments:l};const c=e/2,d=i/2,p=Math.floor(s),m=Math.floor(l),h=p+1,x=m+1,S=e/p,g=i/m,E=[],A=[],D=[],y=[];for(let _=0;_<x;_++){const I=_*g-d;for(let O=0;O<h;O++){const w=O*S-c;A.push(w,-I,0),D.push(0,0,1),y.push(O/p),y.push(1-_/m)}}for(let _=0;_<m;_++)for(let I=0;I<p;I++){const O=I+h*_,w=I+h*(_+1),U=I+1+h*(_+1),P=I+1+h*_;E.push(O,w,P),E.push(w,U,P)}this.setIndex(E),this.setAttribute("position",new vn(A,3)),this.setAttribute("normal",new vn(D,3)),this.setAttribute("uv",new vn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ul(e.width,e.height,e.widthSegments,e.heightSegments)}}class du extends ei{constructor(e=1,i=32,s=16,l=0,c=Math.PI*2,d=0,p=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:i,heightSegments:s,phiStart:l,phiLength:c,thetaStart:d,thetaLength:p},i=Math.max(3,Math.floor(i)),s=Math.max(2,Math.floor(s));const m=Math.min(d+p,Math.PI);let h=0;const x=[],S=new $,g=new $,E=[],A=[],D=[],y=[];for(let _=0;_<=s;_++){const I=[],O=_/s,w=d+O*p,U=e*Math.cos(w),P=Math.sqrt(e*e-U*U);let F=0;_===0&&d===0?F=.5/i:_===s&&m===Math.PI&&(F=-.5/i);for(let T=0;T<=i;T++){const z=T/i,X=l+z*c;S.x=-P*Math.cos(X),S.y=U,S.z=P*Math.sin(X),A.push(S.x,S.y,S.z),g.copy(S).normalize(),D.push(g.x,g.y,g.z),y.push(z+F,1-O),I.push(h++)}x.push(I)}for(let _=0;_<s;_++)for(let I=0;I<i;I++){const O=x[_][I+1],w=x[_][I],U=x[_+1][I],P=x[_+1][I+1];(_!==0||d>0)&&E.push(O,w,P),(_!==s-1||m<Math.PI)&&E.push(w,U,P)}this.setIndex(E),this.setAttribute("position",new vn(A,3)),this.setAttribute("normal",new vn(D,3)),this.setAttribute("uv",new vn(y,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new du(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}function kr(r){const e={};for(const i in r){e[i]={};for(const s in r[i]){const l=r[i][s];if(w_(l))l.isRenderTargetTexture?(tt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[i][s]=null):e[i][s]=l.clone();else if(Array.isArray(l))if(w_(l[0])){const c=[];for(let d=0,p=l.length;d<p;d++)c[d]=l[d].clone();e[i][s]=c}else e[i][s]=l.slice();else e[i][s]=l}}return e}function Hn(r){const e={};for(let i=0;i<r.length;i++){const s=kr(r[i]);for(const l in s)e[l]=s[l]}return e}function w_(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function vy(r){const e=[];for(let i=0;i<r.length;i++)e.push(r[i].clone());return e}function Lv(r){const e=r.getRenderTarget();return e===null?r.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Et.workingColorSpace}const xy={clone:kr,merge:Hn};var Sy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,My=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Ai extends Wr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sy,this.fragmentShader=My,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=kr(e.uniforms),this.uniformsGroups=vy(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const i=super.toJSON(e);i.glslVersion=this.glslVersion,i.uniforms={};for(const l in this.uniforms){const d=this.uniforms[l].value;d&&d.isTexture?i.uniforms[l]={type:"t",value:d.toJSON(e).uuid}:d&&d.isColor?i.uniforms[l]={type:"c",value:d.getHex()}:d&&d.isVector2?i.uniforms[l]={type:"v2",value:d.toArray()}:d&&d.isVector3?i.uniforms[l]={type:"v3",value:d.toArray()}:d&&d.isVector4?i.uniforms[l]={type:"v4",value:d.toArray()}:d&&d.isMatrix3?i.uniforms[l]={type:"m3",value:d.toArray()}:d&&d.isMatrix4?i.uniforms[l]={type:"m4",value:d.toArray()}:i.uniforms[l]={value:d}}Object.keys(this.defines).length>0&&(i.defines=this.defines),i.vertexShader=this.vertexShader,i.fragmentShader=this.fragmentShader,i.lights=this.lights,i.clipping=this.clipping;const s={};for(const l in this.extensions)this.extensions[l]===!0&&(s[l]=!0);return Object.keys(s).length>0&&(i.extensions=s),i}fromJSON(e,i){if(super.fromJSON(e,i),e.uniforms!==void 0)for(const s in e.uniforms){const l=e.uniforms[s];switch(this.uniforms[s]={},l.type){case"t":this.uniforms[s].value=i[l.value]||null;break;case"c":this.uniforms[s].value=new Mt().setHex(l.value);break;case"v2":this.uniforms[s].value=new _t().fromArray(l.value);break;case"v3":this.uniforms[s].value=new $().fromArray(l.value);break;case"v4":this.uniforms[s].value=new Jt().fromArray(l.value);break;case"m3":this.uniforms[s].value=new st().fromArray(l.value);break;case"m4":this.uniforms[s].value=new $t().fromArray(l.value);break;default:this.uniforms[s].value=l.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const s in e.extensions)this.extensions[s]=e.extensions[s];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class yy extends Ai{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Ey extends Wr{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Mt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Mt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Wh,this.normalScale=new _t(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ls,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ty extends Wr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=DM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class by extends Wr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Ov extends bn{constructor(e,i=1){super(),this.isLight=!0,this.type="Light",this.color=new Mt(e),this.intensity=i}copy(e,i){return super.copy(e,i),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const i=super.toJSON(e);return i.object.color=this.color.getHex(),i.object.intensity=this.intensity,i}}class Ay extends Ov{constructor(e,i,s){super(e,s),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(bn.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Mt(i)}copy(e,i){return super.copy(e,i),this.groundColor.copy(e.groundColor),this}toJSON(e){const i=super.toJSON(e);return i.object.groundColor=this.groundColor.getHex(),i}}const Jd=new $t,D_=new $,N_=new $;class Ry{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new _t(512,512),this.mapType=hi,this.map=null,this.mapPass=null,this.matrix=new $t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lp,this._frameExtents=new _t(1,1),this._viewportCount=1,this._viewports=[new Jt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const i=this.camera;D_.setFromMatrixPosition(e.matrixWorld),i.position.copy(D_),N_.setFromMatrixPosition(e.target.matrixWorld),i.lookAt(N_),i.updateMatrixWorld(),this._updateMatrix(i,this.matrix,this._frustum)}_updateMatrix(e,i,s,l){Jd.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),s.setFromProjectionMatrix(Jd,e.coordinateSystem,e.reversedDepth);const c=this._frameExtents,d=l?l.z/c.x:1,p=l?l.w/c.y:1,m=l?l.x/c.x:0,h=l?l.y/c.y:0;e.coordinateSystem===sl||e.reversedDepth?i.set(.5*d,0,0,.5*d+m,0,.5*p,0,.5*p+h,0,0,1,0,0,0,0,1):i.set(.5*d,0,0,.5*d+m,0,.5*p,0,.5*p+h,0,0,.5,.5,0,0,0,1),i.multiply(Jd)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Vc=new $,kc=new Xr,Xi=new $;class Pv extends bn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new $t,this.projectionMatrix=new $t,this.projectionMatrixInverse=new $t,this.coordinateSystem=ji,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,i){return super.copy(e,i),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Vc,kc,Xi),Xi.x===1&&Xi.y===1&&Xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vc,kc,Xi.set(1,1,1)).invert()}updateWorldMatrix(e,i,s=!1){super.updateWorldMatrix(e,i,s),this.matrixWorld.decompose(Vc,kc,Xi),Xi.x===1&&Xi.y===1&&Xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Vc,kc,Xi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const as=new $,U_=new _t,L_=new _t;class bi extends Pv{constructor(e=50,i=1,s=.1,l=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=s,this.far=l,this.focus=10,this.aspect=i,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const i=.5*this.getFilmHeight()/e;this.fov=Yh*2*Math.atan(i),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(wd*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Yh*2*Math.atan(Math.tan(wd*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,i,s){as.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(as.x,as.y).multiplyScalar(-e/as.z),as.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),s.set(as.x,as.y).multiplyScalar(-e/as.z)}getViewSize(e,i){return this.getViewBounds(e,U_,L_),i.subVectors(L_,U_)}setViewOffset(e,i,s,l,c,d){this.aspect=e/i,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let i=e*Math.tan(wd*.5*this.fov)/this.zoom,s=2*i,l=this.aspect*s,c=-.5*l;const d=this.view;if(this.view!==null&&this.view.enabled){const m=d.fullWidth,h=d.fullHeight;c+=d.offsetX*l/m,i-=d.offsetY*s/h,l*=d.width/m,s*=d.height/h}const p=this.filmOffset;p!==0&&(c+=e*p/this.getFilmWidth()),this.projectionMatrix.makePerspective(c,c+l,i,i-s,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.fov=this.fov,i.object.zoom=this.zoom,i.object.near=this.near,i.object.far=this.far,i.object.focus=this.focus,i.object.aspect=this.aspect,this.view!==null&&(i.object.view=Object.assign({},this.view)),i.object.filmGauge=this.filmGauge,i.object.filmOffset=this.filmOffset,i}}class up extends Pv{constructor(e=-1,i=1,s=1,l=-1,c=.1,d=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=i,this.top=s,this.bottom=l,this.near=c,this.far=d,this.updateProjectionMatrix()}copy(e,i){return super.copy(e,i),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,i,s,l,c,d){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=i,this.view.offsetX=s,this.view.offsetY=l,this.view.width=c,this.view.height=d,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),i=(this.top-this.bottom)/(2*this.zoom),s=(this.right+this.left)/2,l=(this.top+this.bottom)/2;let c=s-e,d=s+e,p=l+i,m=l-i;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,x=(this.top-this.bottom)/this.view.fullHeight/this.zoom;c+=h*this.view.offsetX,d=c+h*this.view.width,p-=x*this.view.offsetY,m=p-x*this.view.height}this.projectionMatrix.makeOrthographic(c,d,p,m,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const i=super.toJSON(e);return i.object.zoom=this.zoom,i.object.left=this.left,i.object.right=this.right,i.object.top=this.top,i.object.bottom=this.bottom,i.object.near=this.near,i.object.far=this.far,this.view!==null&&(i.object.view=Object.assign({},this.view)),i}}class Cy extends Ry{constructor(){super(new up(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class wy extends Ov{constructor(e,i){super(e,i),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bn.DEFAULT_UP),this.updateMatrix(),this.target=new bn,this.shadow=new Cy}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const i=super.toJSON(e);return i.object.shadow=this.shadow.toJSON(),i.object.target=this.target.uuid,i}}const Ur=-90,Lr=1;class Dy extends bn{constructor(e,i,s){super(),this.type="CubeCamera",this.renderTarget=s,this.coordinateSystem=null,this.activeMipmapLevel=0;const l=new bi(Ur,Lr,e,i);l.layers=this.layers,this.add(l);const c=new bi(Ur,Lr,e,i);c.layers=this.layers,this.add(c);const d=new bi(Ur,Lr,e,i);d.layers=this.layers,this.add(d);const p=new bi(Ur,Lr,e,i);p.layers=this.layers,this.add(p);const m=new bi(Ur,Lr,e,i);m.layers=this.layers,this.add(m);const h=new bi(Ur,Lr,e,i);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,i=this.children.concat(),[s,l,c,d,p,m]=i;for(const h of i)this.remove(h);if(e===ji)s.up.set(0,1,0),s.lookAt(1,0,0),l.up.set(0,1,0),l.lookAt(-1,0,0),c.up.set(0,0,-1),c.lookAt(0,1,0),d.up.set(0,0,1),d.lookAt(0,-1,0),p.up.set(0,1,0),p.lookAt(0,0,1),m.up.set(0,1,0),m.lookAt(0,0,-1);else if(e===sl)s.up.set(0,-1,0),s.lookAt(-1,0,0),l.up.set(0,-1,0),l.lookAt(1,0,0),c.up.set(0,0,1),c.lookAt(0,1,0),d.up.set(0,0,-1),d.lookAt(0,-1,0),p.up.set(0,-1,0),p.lookAt(0,0,1),m.up.set(0,-1,0),m.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of i)this.add(h),h.updateMatrixWorld()}update(e,i){this.parent===null&&this.updateMatrixWorld();const{renderTarget:s,activeMipmapLevel:l}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[c,d,p,m,h,x]=this.children,S=e.getRenderTarget(),g=e.getActiveCubeFace(),E=e.getActiveMipmapLevel(),A=e.xr.enabled;e.xr.enabled=!1;const D=s.texture.generateMipmaps;s.texture.generateMipmaps=!1;let y=!1;e.isWebGLRenderer===!0?y=e.state.buffers.depth.getReversed():y=e.reversedDepthBuffer,e.setRenderTarget(s,0,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,c),e.setRenderTarget(s,1,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,d),e.setRenderTarget(s,2,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,p),e.setRenderTarget(s,3,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,m),e.setRenderTarget(s,4,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,h),s.texture.generateMipmaps=D,e.setRenderTarget(s,5,l),y&&e.autoClear===!1&&e.clearDepth(),e.render(i,x),e.setRenderTarget(S,g,E),e.xr.enabled=A,s.texture.needsPMREMUpdate=!0}}class Ny extends bi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const mp=class mp{constructor(e,i,s,l){this.elements=[1,0,0,1],e!==void 0&&this.set(e,i,s,l)}identity(){return this.set(1,0,0,1),this}fromArray(e,i=0){for(let s=0;s<4;s++)this.elements[s]=e[s+i];return this}set(e,i,s,l){const c=this.elements;return c[0]=e,c[2]=i,c[1]=s,c[3]=l,this}};mp.prototype.isMatrix2=!0;let O_=mp;function P_(r,e,i,s){const l=Uy(s);switch(i){case Sv:return r*e;case yv:return r*e/l.components*l.byteLength;case tp:return r*e/l.components*l.byteLength;case Vs:return r*e*2/l.components*l.byteLength;case np:return r*e*2/l.components*l.byteLength;case Mv:return r*e*3/l.components*l.byteLength;case Ii:return r*e*4/l.components*l.byteLength;case ip:return r*e*4/l.components*l.byteLength;case qc:case jc:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Zc:case Kc:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case gh:case vh:return Math.max(r,16)*Math.max(e,8)/4;case mh:case _h:return Math.max(r,8)*Math.max(e,8)/2;case xh:case Sh:case yh:case Eh:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*8;case Mh:case $c:case Th:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case bh:return Math.floor((r+3)/4)*Math.floor((e+3)/4)*16;case Ah:return Math.floor((r+4)/5)*Math.floor((e+3)/4)*16;case Rh:return Math.floor((r+4)/5)*Math.floor((e+4)/5)*16;case Ch:return Math.floor((r+5)/6)*Math.floor((e+4)/5)*16;case wh:return Math.floor((r+5)/6)*Math.floor((e+5)/6)*16;case Dh:return Math.floor((r+7)/8)*Math.floor((e+4)/5)*16;case Nh:return Math.floor((r+7)/8)*Math.floor((e+5)/6)*16;case Uh:return Math.floor((r+7)/8)*Math.floor((e+7)/8)*16;case Lh:return Math.floor((r+9)/10)*Math.floor((e+4)/5)*16;case Oh:return Math.floor((r+9)/10)*Math.floor((e+5)/6)*16;case Ph:return Math.floor((r+9)/10)*Math.floor((e+7)/8)*16;case Ih:return Math.floor((r+9)/10)*Math.floor((e+9)/10)*16;case zh:return Math.floor((r+11)/12)*Math.floor((e+9)/10)*16;case Bh:return Math.floor((r+11)/12)*Math.floor((e+11)/12)*16;case Fh:case Hh:case Gh:return Math.ceil(r/4)*Math.ceil(e/4)*16;case Vh:case kh:return Math.ceil(r/4)*Math.ceil(e/4)*8;case eu:case Xh:return Math.ceil(r/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${i} format.`)}function Uy(r){switch(r){case hi:case gv:return{byteLength:1,components:1};case il:case _v:case Qi:return{byteLength:2,components:1};case $h:case ep:return{byteLength:2,components:4};case Ki:case Jh:case qi:return{byteLength:4,components:1};case vv:case xv:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Kh}}));typeof window<"u"&&(window.__THREE__?tt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Kh);function Iv(){let r=null,e=!1,i=null,s=null;function l(c,d){s=r.requestAnimationFrame(l),i(c,d)}return{start:function(){e!==!0&&i!==null&&r!==null&&(s=r.requestAnimationFrame(l),e=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(s),e=!1},setAnimationLoop:function(c){i=c},setContext:function(c){r=c}}}function Ly(r){const e=new WeakMap;function i(p,m){const h=p.array,x=p.usage,S=h.byteLength,g=r.createBuffer();r.bindBuffer(m,g),r.bufferData(m,h,x),p.onUploadCallback();let E;if(h instanceof Float32Array)E=r.FLOAT;else if(typeof Float16Array<"u"&&h instanceof Float16Array)E=r.HALF_FLOAT;else if(h instanceof Uint16Array)p.isFloat16BufferAttribute?E=r.HALF_FLOAT:E=r.UNSIGNED_SHORT;else if(h instanceof Int16Array)E=r.SHORT;else if(h instanceof Uint32Array)E=r.UNSIGNED_INT;else if(h instanceof Int32Array)E=r.INT;else if(h instanceof Int8Array)E=r.BYTE;else if(h instanceof Uint8Array)E=r.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)E=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:g,type:E,bytesPerElement:h.BYTES_PER_ELEMENT,version:p.version,size:S}}function s(p,m,h){const x=m.array,S=m.updateRanges;if(r.bindBuffer(h,p),S.length===0)r.bufferSubData(h,0,x);else{S.sort((E,A)=>E.start-A.start);let g=0;for(let E=1;E<S.length;E++){const A=S[g],D=S[E];D.start<=A.start+A.count+1?A.count=Math.max(A.count,D.start+D.count-A.start):(++g,S[g]=D)}S.length=g+1;for(let E=0,A=S.length;E<A;E++){const D=S[E];r.bufferSubData(h,D.start*x.BYTES_PER_ELEMENT,x,D.start,D.count)}m.clearUpdateRanges()}m.onUploadCallback()}function l(p){return p.isInterleavedBufferAttribute&&(p=p.data),e.get(p)}function c(p){p.isInterleavedBufferAttribute&&(p=p.data);const m=e.get(p);m&&(r.deleteBuffer(m.buffer),e.delete(p))}function d(p,m){if(p.isInterleavedBufferAttribute&&(p=p.data),p.isGLBufferAttribute){const x=e.get(p);(!x||x.version<p.version)&&e.set(p,{buffer:p.buffer,type:p.type,bytesPerElement:p.elementSize,version:p.version});return}const h=e.get(p);if(h===void 0)e.set(p,i(p,m));else if(h.version<p.version){if(h.size!==p.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(h.buffer,p,m),h.version=p.version}}return{get:l,remove:c,update:d}}var Oy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Py=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Iy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,By=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Fy=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Gy=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Vy=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,ky=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Xy=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Wy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Yy=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,qy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,jy=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Zy=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ky=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Qy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Jy=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$y=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,eE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,tE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,nE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,iE=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,aE=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,sE=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,rE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,oE=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,lE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,cE=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,uE="gl_FragColor = linearToOutputTexel( gl_FragColor );",fE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,dE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,hE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,pE=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,mE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,gE=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,_E=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,vE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,SE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,ME=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,yE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,EE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,TE=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bE=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,AE=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,RE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,CE=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,DE=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,NE=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,UE=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,LE=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,OE=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,PE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,IE=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,zE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,BE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,FE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,HE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,GE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,VE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,kE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,XE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,WE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,YE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,jE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ZE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,KE=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,QE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,JE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,$E=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,eT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,tT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,nT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,iT=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,aT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,sT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,rT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,oT=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,lT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,cT=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,uT=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,fT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,dT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,hT=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,pT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,mT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,gT=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,_T=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,vT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,xT=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ST=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,MT=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,yT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,ET=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,TT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,AT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,RT=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,CT=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,wT=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,DT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,NT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,UT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,LT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const OT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,PT=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,IT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zT=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,BT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,FT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,GT=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,VT=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,kT=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,XT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,WT=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,YT=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,qT=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,jT=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ZT=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,KT=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,QT=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,JT=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,$T=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eb=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,tb=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,nb=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ib=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ab=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,sb=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rb=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ob=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,lb=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,cb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ub=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,db=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,hb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,dt={alphahash_fragment:Oy,alphahash_pars_fragment:Py,alphamap_fragment:Iy,alphamap_pars_fragment:zy,alphatest_fragment:By,alphatest_pars_fragment:Fy,aomap_fragment:Hy,aomap_pars_fragment:Gy,batching_pars_vertex:Vy,batching_vertex:ky,begin_vertex:Xy,beginnormal_vertex:Wy,bsdfs:Yy,iridescence_fragment:qy,bumpmap_pars_fragment:jy,clipping_planes_fragment:Zy,clipping_planes_pars_fragment:Ky,clipping_planes_pars_vertex:Qy,clipping_planes_vertex:Jy,color_fragment:$y,color_pars_fragment:eE,color_pars_vertex:tE,color_vertex:nE,common:iE,cube_uv_reflection_fragment:aE,defaultnormal_vertex:sE,displacementmap_pars_vertex:rE,displacementmap_vertex:oE,emissivemap_fragment:lE,emissivemap_pars_fragment:cE,colorspace_fragment:uE,colorspace_pars_fragment:fE,envmap_fragment:dE,envmap_common_pars_fragment:hE,envmap_pars_fragment:pE,envmap_pars_vertex:mE,envmap_physical_pars_fragment:AE,envmap_vertex:gE,fog_vertex:_E,fog_pars_vertex:vE,fog_fragment:xE,fog_pars_fragment:SE,gradientmap_pars_fragment:ME,lightmap_pars_fragment:yE,lights_lambert_fragment:EE,lights_lambert_pars_fragment:TE,lights_pars_begin:bE,lights_toon_fragment:RE,lights_toon_pars_fragment:CE,lights_phong_fragment:wE,lights_phong_pars_fragment:DE,lights_physical_fragment:NE,lights_physical_pars_fragment:UE,lights_fragment_begin:LE,lights_fragment_maps:OE,lights_fragment_end:PE,lightprobes_pars_fragment:IE,logdepthbuf_fragment:zE,logdepthbuf_pars_fragment:BE,logdepthbuf_pars_vertex:FE,logdepthbuf_vertex:HE,map_fragment:GE,map_pars_fragment:VE,map_particle_fragment:kE,map_particle_pars_fragment:XE,metalnessmap_fragment:WE,metalnessmap_pars_fragment:YE,morphinstance_vertex:qE,morphcolor_vertex:jE,morphnormal_vertex:ZE,morphtarget_pars_vertex:KE,morphtarget_vertex:QE,normal_fragment_begin:JE,normal_fragment_maps:$E,normal_pars_fragment:eT,normal_pars_vertex:tT,normal_vertex:nT,normalmap_pars_fragment:iT,clearcoat_normal_fragment_begin:aT,clearcoat_normal_fragment_maps:sT,clearcoat_pars_fragment:rT,iridescence_pars_fragment:oT,opaque_fragment:lT,packing:cT,premultiplied_alpha_fragment:uT,project_vertex:fT,dithering_fragment:dT,dithering_pars_fragment:hT,roughnessmap_fragment:pT,roughnessmap_pars_fragment:mT,shadowmap_pars_fragment:gT,shadowmap_pars_vertex:_T,shadowmap_vertex:vT,shadowmask_pars_fragment:xT,skinbase_vertex:ST,skinning_pars_vertex:MT,skinning_vertex:yT,skinnormal_vertex:ET,specularmap_fragment:TT,specularmap_pars_fragment:bT,tonemapping_fragment:AT,tonemapping_pars_fragment:RT,transmission_fragment:CT,transmission_pars_fragment:wT,uv_pars_fragment:DT,uv_pars_vertex:NT,uv_vertex:UT,worldpos_vertex:LT,background_vert:OT,background_frag:PT,backgroundCube_vert:IT,backgroundCube_frag:zT,cube_vert:BT,cube_frag:FT,depth_vert:HT,depth_frag:GT,distance_vert:VT,distance_frag:kT,equirect_vert:XT,equirect_frag:WT,linedashed_vert:YT,linedashed_frag:qT,meshbasic_vert:jT,meshbasic_frag:ZT,meshlambert_vert:KT,meshlambert_frag:QT,meshmatcap_vert:JT,meshmatcap_frag:$T,meshnormal_vert:eb,meshnormal_frag:tb,meshphong_vert:nb,meshphong_frag:ib,meshphysical_vert:ab,meshphysical_frag:sb,meshtoon_vert:rb,meshtoon_frag:ob,points_vert:lb,points_frag:cb,shadow_vert:ub,shadow_frag:fb,sprite_vert:db,sprite_frag:hb},ze={common:{diffuse:{value:new Mt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new st},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new st}},envmap:{envMap:{value:null},envMapRotation:{value:new st},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new st}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new st}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new st},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new st},normalScale:{value:new _t(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new st},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new st}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new st}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new st}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Mt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new $},probesMax:{value:new $},probesResolution:{value:new $}},points:{diffuse:{value:new Mt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0},uvTransform:{value:new st}},sprite:{diffuse:{value:new Mt(16777215)},opacity:{value:1},center:{value:new _t(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new st},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0}}},Yi={basic:{uniforms:Hn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.fog]),vertexShader:dt.meshbasic_vert,fragmentShader:dt.meshbasic_frag},lambert:{uniforms:Hn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new Mt(0)},envMapIntensity:{value:1}}]),vertexShader:dt.meshlambert_vert,fragmentShader:dt.meshlambert_frag},phong:{uniforms:Hn([ze.common,ze.specularmap,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,ze.lights,{emissive:{value:new Mt(0)},specular:{value:new Mt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:dt.meshphong_vert,fragmentShader:dt.meshphong_frag},standard:{uniforms:Hn([ze.common,ze.envmap,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.roughnessmap,ze.metalnessmap,ze.fog,ze.lights,{emissive:{value:new Mt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag},toon:{uniforms:Hn([ze.common,ze.aomap,ze.lightmap,ze.emissivemap,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.gradientmap,ze.fog,ze.lights,{emissive:{value:new Mt(0)}}]),vertexShader:dt.meshtoon_vert,fragmentShader:dt.meshtoon_frag},matcap:{uniforms:Hn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,ze.fog,{matcap:{value:null}}]),vertexShader:dt.meshmatcap_vert,fragmentShader:dt.meshmatcap_frag},points:{uniforms:Hn([ze.points,ze.fog]),vertexShader:dt.points_vert,fragmentShader:dt.points_frag},dashed:{uniforms:Hn([ze.common,ze.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:dt.linedashed_vert,fragmentShader:dt.linedashed_frag},depth:{uniforms:Hn([ze.common,ze.displacementmap]),vertexShader:dt.depth_vert,fragmentShader:dt.depth_frag},normal:{uniforms:Hn([ze.common,ze.bumpmap,ze.normalmap,ze.displacementmap,{opacity:{value:1}}]),vertexShader:dt.meshnormal_vert,fragmentShader:dt.meshnormal_frag},sprite:{uniforms:Hn([ze.sprite,ze.fog]),vertexShader:dt.sprite_vert,fragmentShader:dt.sprite_frag},background:{uniforms:{uvTransform:{value:new st},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:dt.background_vert,fragmentShader:dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new st}},vertexShader:dt.backgroundCube_vert,fragmentShader:dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:dt.cube_vert,fragmentShader:dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:dt.equirect_vert,fragmentShader:dt.equirect_frag},distance:{uniforms:Hn([ze.common,ze.displacementmap,{referencePosition:{value:new $},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:dt.distance_vert,fragmentShader:dt.distance_frag},shadow:{uniforms:Hn([ze.lights,ze.fog,{color:{value:new Mt(0)},opacity:{value:1}}]),vertexShader:dt.shadow_vert,fragmentShader:dt.shadow_frag}};Yi.physical={uniforms:Hn([Yi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new st},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new st},clearcoatNormalScale:{value:new _t(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new st},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new st},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new st},sheen:{value:0},sheenColor:{value:new Mt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new st},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new st},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new st},transmissionSamplerSize:{value:new _t},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new st},attenuationDistance:{value:0},attenuationColor:{value:new Mt(0)},specularColor:{value:new Mt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new st},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new st},anisotropyVector:{value:new _t},anisotropyMap:{value:null},anisotropyMapTransform:{value:new st}}]),vertexShader:dt.meshphysical_vert,fragmentShader:dt.meshphysical_frag};const Xc={r:0,b:0,g:0},pb=new $t,zv=new st;zv.set(-1,0,0,0,1,0,0,0,1);function mb(r,e,i,s,l,c){const d=new Mt(0);let p=l===!0?0:1,m,h,x=null,S=0,g=null;function E(I){let O=I.isScene===!0?I.background:null;if(O&&O.isTexture){const w=I.backgroundBlurriness>0;O=e.get(O,w)}return O}function A(I){let O=!1;const w=E(I);w===null?y(d,p):w&&w.isColor&&(y(w,1),O=!0);const U=r.xr.getEnvironmentBlendMode();U==="additive"?i.buffers.color.setClear(0,0,0,1,c):U==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,c),(r.autoClear||O)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function D(I,O){const w=E(O);w&&(w.isCubeTexture||w.mapping===cu)?(h===void 0&&(h=new Tn(new Yr(1,1,1),new Ai({name:"BackgroundCubeMaterial",uniforms:kr(Yi.backgroundCube.uniforms),vertexShader:Yi.backgroundCube.vertexShader,fragmentShader:Yi.backgroundCube.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(U,P,F){this.matrixWorld.copyPosition(F.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),h.material.uniforms.envMap.value=w,h.material.uniforms.backgroundBlurriness.value=O.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=O.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(pb.makeRotationFromEuler(O.backgroundRotation)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&h.material.uniforms.backgroundRotation.value.premultiply(zv),h.material.toneMapped=Et.getTransfer(w.colorSpace)!==zt,(x!==w||S!==w.version||g!==r.toneMapping)&&(h.material.needsUpdate=!0,x=w,S=w.version,g=r.toneMapping),h.layers.enableAll(),I.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(m===void 0&&(m=new Tn(new ul(2,2),new Ai({name:"BackgroundMaterial",uniforms:kr(Yi.background.uniforms),vertexShader:Yi.background.vertexShader,fragmentShader:Yi.background.fragmentShader,side:Hs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),m.geometry.deleteAttribute("normal"),Object.defineProperty(m.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(m)),m.material.uniforms.t2D.value=w,m.material.uniforms.backgroundIntensity.value=O.backgroundIntensity,m.material.toneMapped=Et.getTransfer(w.colorSpace)!==zt,w.matrixAutoUpdate===!0&&w.updateMatrix(),m.material.uniforms.uvTransform.value.copy(w.matrix),(x!==w||S!==w.version||g!==r.toneMapping)&&(m.material.needsUpdate=!0,x=w,S=w.version,g=r.toneMapping),m.layers.enableAll(),I.unshift(m,m.geometry,m.material,0,0,null))}function y(I,O){I.getRGB(Xc,Lv(r)),i.buffers.color.setClear(Xc.r,Xc.g,Xc.b,O,c)}function _(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),m!==void 0&&(m.geometry.dispose(),m.material.dispose(),m=void 0)}return{getClearColor:function(){return d},setClearColor:function(I,O=1){d.set(I),p=O,y(d,p)},getClearAlpha:function(){return p},setClearAlpha:function(I){p=I,y(d,p)},render:A,addToRenderList:D,dispose:_}}function gb(r,e){const i=r.getParameter(r.MAX_VERTEX_ATTRIBS),s={},l=g(null);let c=l,d=!1;function p(K,j,oe,Z,ne){let N=!1;const V=S(K,Z,oe,j);c!==V&&(c=V,h(c.object)),N=E(K,Z,oe,ne),N&&A(K,Z,oe,ne),ne!==null&&e.update(ne,r.ELEMENT_ARRAY_BUFFER),(N||d)&&(d=!1,w(K,j,oe,Z),ne!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,e.get(ne).buffer))}function m(){return r.createVertexArray()}function h(K){return r.bindVertexArray(K)}function x(K){return r.deleteVertexArray(K)}function S(K,j,oe,Z){const ne=Z.wireframe===!0;let N=s[j.id];N===void 0&&(N={},s[j.id]=N);const V=K.isInstancedMesh===!0?K.id:0;let fe=N[V];fe===void 0&&(fe={},N[V]=fe);let se=fe[oe.id];se===void 0&&(se={},fe[oe.id]=se);let H=se[ne];return H===void 0&&(H=g(m()),se[ne]=H),H}function g(K){const j=[],oe=[],Z=[];for(let ne=0;ne<i;ne++)j[ne]=0,oe[ne]=0,Z[ne]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:j,enabledAttributes:oe,attributeDivisors:Z,object:K,attributes:{},index:null}}function E(K,j,oe,Z){const ne=c.attributes,N=j.attributes;let V=0;const fe=oe.getAttributes();for(const se in fe)if(fe[se].location>=0){const C=ne[se];let Y=N[se];if(Y===void 0&&(se==="instanceMatrix"&&K.instanceMatrix&&(Y=K.instanceMatrix),se==="instanceColor"&&K.instanceColor&&(Y=K.instanceColor)),C===void 0||C.attribute!==Y||Y&&C.data!==Y.data)return!0;V++}return c.attributesNum!==V||c.index!==Z}function A(K,j,oe,Z){const ne={},N=j.attributes;let V=0;const fe=oe.getAttributes();for(const se in fe)if(fe[se].location>=0){let C=N[se];C===void 0&&(se==="instanceMatrix"&&K.instanceMatrix&&(C=K.instanceMatrix),se==="instanceColor"&&K.instanceColor&&(C=K.instanceColor));const Y={};Y.attribute=C,C&&C.data&&(Y.data=C.data),ne[se]=Y,V++}c.attributes=ne,c.attributesNum=V,c.index=Z}function D(){const K=c.newAttributes;for(let j=0,oe=K.length;j<oe;j++)K[j]=0}function y(K){_(K,0)}function _(K,j){const oe=c.newAttributes,Z=c.enabledAttributes,ne=c.attributeDivisors;oe[K]=1,Z[K]===0&&(r.enableVertexAttribArray(K),Z[K]=1),ne[K]!==j&&(r.vertexAttribDivisor(K,j),ne[K]=j)}function I(){const K=c.newAttributes,j=c.enabledAttributes;for(let oe=0,Z=j.length;oe<Z;oe++)j[oe]!==K[oe]&&(r.disableVertexAttribArray(oe),j[oe]=0)}function O(K,j,oe,Z,ne,N,V){V===!0?r.vertexAttribIPointer(K,j,oe,ne,N):r.vertexAttribPointer(K,j,oe,Z,ne,N)}function w(K,j,oe,Z){D();const ne=Z.attributes,N=oe.getAttributes(),V=j.defaultAttributeValues;for(const fe in N){const se=N[fe];if(se.location>=0){let H=ne[fe];if(H===void 0&&(fe==="instanceMatrix"&&K.instanceMatrix&&(H=K.instanceMatrix),fe==="instanceColor"&&K.instanceColor&&(H=K.instanceColor)),H!==void 0){const C=H.normalized,Y=H.itemSize,ee=e.get(H);if(ee===void 0)continue;const ye=ee.buffer,De=ee.type,Fe=ee.bytesPerElement,re=De===r.INT||De===r.UNSIGNED_INT||H.gpuType===Jh;if(H.isInterleavedBufferAttribute){const me=H.data,be=me.stride,$e=H.offset;if(me.isInstancedInterleavedBuffer){for(let Oe=0;Oe<se.locationSize;Oe++)_(se.location+Oe,me.meshPerAttribute);K.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=me.meshPerAttribute*me.count)}else for(let Oe=0;Oe<se.locationSize;Oe++)y(se.location+Oe);r.bindBuffer(r.ARRAY_BUFFER,ye);for(let Oe=0;Oe<se.locationSize;Oe++)O(se.location+Oe,Y/se.locationSize,De,C,be*Fe,($e+Y/se.locationSize*Oe)*Fe,re)}else{if(H.isInstancedBufferAttribute){for(let me=0;me<se.locationSize;me++)_(se.location+me,H.meshPerAttribute);K.isInstancedMesh!==!0&&Z._maxInstanceCount===void 0&&(Z._maxInstanceCount=H.meshPerAttribute*H.count)}else for(let me=0;me<se.locationSize;me++)y(se.location+me);r.bindBuffer(r.ARRAY_BUFFER,ye);for(let me=0;me<se.locationSize;me++)O(se.location+me,Y/se.locationSize,De,C,Y*Fe,Y/se.locationSize*me*Fe,re)}}else if(V!==void 0){const C=V[fe];if(C!==void 0)switch(C.length){case 2:r.vertexAttrib2fv(se.location,C);break;case 3:r.vertexAttrib3fv(se.location,C);break;case 4:r.vertexAttrib4fv(se.location,C);break;default:r.vertexAttrib1fv(se.location,C)}}}}I()}function U(){z();for(const K in s){const j=s[K];for(const oe in j){const Z=j[oe];for(const ne in Z){const N=Z[ne];for(const V in N)x(N[V].object),delete N[V];delete Z[ne]}}delete s[K]}}function P(K){if(s[K.id]===void 0)return;const j=s[K.id];for(const oe in j){const Z=j[oe];for(const ne in Z){const N=Z[ne];for(const V in N)x(N[V].object),delete N[V];delete Z[ne]}}delete s[K.id]}function F(K){for(const j in s){const oe=s[j];for(const Z in oe){const ne=oe[Z];if(ne[K.id]===void 0)continue;const N=ne[K.id];for(const V in N)x(N[V].object),delete N[V];delete ne[K.id]}}}function T(K){for(const j in s){const oe=s[j],Z=K.isInstancedMesh===!0?K.id:0,ne=oe[Z];if(ne!==void 0){for(const N in ne){const V=ne[N];for(const fe in V)x(V[fe].object),delete V[fe];delete ne[N]}delete oe[Z],Object.keys(oe).length===0&&delete s[j]}}}function z(){X(),d=!0,c!==l&&(c=l,h(c.object))}function X(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:p,reset:z,resetDefaultState:X,dispose:U,releaseStatesOfGeometry:P,releaseStatesOfObject:T,releaseStatesOfProgram:F,initAttributes:D,enableAttribute:y,disableUnusedAttributes:I}}function _b(r,e,i){let s;function l(m){s=m}function c(m,h){r.drawArrays(s,m,h),i.update(h,s,1)}function d(m,h,x){x!==0&&(r.drawArraysInstanced(s,m,h,x),i.update(h,s,x))}function p(m,h,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(s,m,0,h,0,x);let g=0;for(let E=0;E<x;E++)g+=h[E];i.update(g,s,1)}this.setMode=l,this.render=c,this.renderInstances=d,this.renderMultiDraw=p}function vb(r,e,i,s){let l;function c(){if(l!==void 0)return l;if(e.has("EXT_texture_filter_anisotropic")===!0){const F=e.get("EXT_texture_filter_anisotropic");l=r.getParameter(F.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else l=0;return l}function d(F){return!(F!==Ii&&s.convert(F)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function p(F){const T=F===Qi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(F!==hi&&F!==qi&&!T&&s.convert(F)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE))}function m(F){if(F==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";F="mediump"}return F==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=i.precision!==void 0?i.precision:"highp";const x=m(h);x!==h&&(tt("WebGLRenderer:",h,"not supported, using",x,"instead."),h=x);const S=i.logarithmicDepthBuffer===!0,g=i.reversedDepthBuffer===!0&&e.has("EXT_clip_control");i.reversedDepthBuffer===!0&&g===!1&&tt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const E=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),A=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),D=r.getParameter(r.MAX_TEXTURE_SIZE),y=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),_=r.getParameter(r.MAX_VERTEX_ATTRIBS),I=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),O=r.getParameter(r.MAX_VARYING_VECTORS),w=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),U=r.getParameter(r.MAX_SAMPLES),P=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:c,getMaxPrecision:m,textureFormatReadable:d,textureTypeReadable:p,precision:h,logarithmicDepthBuffer:S,reversedDepthBuffer:g,maxTextures:E,maxVertexTextures:A,maxTextureSize:D,maxCubemapSize:y,maxAttributes:_,maxVertexUniforms:I,maxVaryings:O,maxFragmentUniforms:w,maxSamples:U,samples:P}}function xb(r){const e=this;let i=null,s=0,l=!1,c=!1;const d=new rs,p=new st,m={value:null,needsUpdate:!1};this.uniform=m,this.numPlanes=0,this.numIntersection=0,this.init=function(S,g){const E=S.length!==0||g||s!==0||l;return l=g,s=S.length,E},this.beginShadows=function(){c=!0,x(null)},this.endShadows=function(){c=!1},this.setGlobalState=function(S,g){i=x(S,g,0)},this.setState=function(S,g,E){const A=S.clippingPlanes,D=S.clipIntersection,y=S.clipShadows,_=r.get(S);if(!l||A===null||A.length===0||c&&!y)c?x(null):h();else{const I=c?0:s,O=I*4;let w=_.clippingState||null;m.value=w,w=x(A,g,O,E);for(let U=0;U!==O;++U)w[U]=i[U];_.clippingState=w,this.numIntersection=D?this.numPlanes:0,this.numPlanes+=I}};function h(){m.value!==i&&(m.value=i,m.needsUpdate=s>0),e.numPlanes=s,e.numIntersection=0}function x(S,g,E,A){const D=S!==null?S.length:0;let y=null;if(D!==0){if(y=m.value,A!==!0||y===null){const _=E+D*4,I=g.matrixWorldInverse;p.getNormalMatrix(I),(y===null||y.length<_)&&(y=new Float32Array(_));for(let O=0,w=E;O!==D;++O,w+=4)d.copy(S[O]).applyMatrix4(I,p),d.normal.toArray(y,w),y[w+3]=d.constant}m.value=y,m.needsUpdate=!0}return e.numPlanes=D,e.numIntersection=0,y}}const Fr=4,Sb=6,Mb=20,yb=256,jo=new up,I_=new Mt;let $d=null,eh=0,th=0,nh=!1;const Eb=new $,Us=new $;class z_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,i=0,s=.1,l=100,c={}){const{size:d=256,position:p=Eb}=c;$d=this._renderer.getRenderTarget(),eh=this._renderer.getActiveCubeFace(),th=this._renderer.getActiveMipmapLevel(),nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(d);const m=this._allocateTargets();return m.depthBuffer=!0,this._sceneToCubeUV(e,s,l,m,p),i>0&&this._blur(m,0,0,i),this._applyPMREM(m),this._cleanup(m),m}fromEquirectangular(e,i=null){return this._fromTexture(e,i)}fromCubemap(e,i=null){return this._fromTexture(e,i)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=H_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=F_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget($d,eh,th),this._renderer.xr.enabled=nh,e.scissorTest=!1,Or(e,0,0,e.width,e.height)}_fromTexture(e,i){e.mapping===Gs||e.mapping===Vr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),$d=this._renderer.getRenderTarget(),eh=this._renderer.getActiveCubeFace(),th=this._renderer.getActiveMipmapLevel(),nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const s=i||this._allocateTargets();return this._textureToCubeUV(e,s),this._applyPMREM(s),this._cleanup(s),s}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),i=4*this._cubeSize,s={magFilter:In,minFilter:In,generateMipmaps:!1,type:Qi,format:Ii,colorSpace:tu,depthBuffer:!1},l=B_(e,i,s);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==i){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=B_(e,i,s);const{_lodMax:c}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Tb(c)),this._blurMaterial=Ab(c,e,i),this._ggxMaterial=bb(c,e,i)}return l}_compileMaterial(e){const i=new Tn(new ei,e);this._renderer.compile(i,jo)}_sceneToCubeUV(e,i,s,l,c){const m=new bi(90,1,i,s),h=[1,-1,1,1,1,1],x=[1,1,1,-1,-1,-1],S=this._renderer,g=S.autoClear,E=S.toneMapping;S.getClearColor(I_),S.toneMapping=Zi,S.autoClear=!1,S.state.buffers.depth.getReversed()&&(S.setRenderTarget(l),S.clearDepth(),S.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Tn(new Yr,new fu({name:"PMREM.Background",side:Vn,depthWrite:!1,depthTest:!1})));const D=this._backgroundBox,y=D.material;let _=!1;const I=e.background;I?I.isColor&&(y.color.copy(I),e.background=null,_=!0):(y.color.copy(I_),_=!0);for(let O=0;O<6;O++){const w=O%3;w===0?(m.up.set(0,h[O],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x+x[O],c.y,c.z)):w===1?(m.up.set(0,0,h[O]),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y+x[O],c.z)):(m.up.set(0,h[O],0),m.position.set(c.x,c.y,c.z),m.lookAt(c.x,c.y,c.z+x[O]));const U=this._cubeSize;Or(l,w*U,O>2?U:0,U,U),S.setRenderTarget(l),_&&S.render(D,m),S.render(e,m)}S.toneMapping=E,S.autoClear=g,e.background=I}_textureToCubeUV(e,i){const s=this._renderer,l=e.mapping===Gs||e.mapping===Vr;l?(this._cubemapMaterial===null&&(this._cubemapMaterial=H_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=F_());const c=l?this._cubemapMaterial:this._equirectMaterial,d=this._lodMeshes[0];d.material=c;const p=c.uniforms;p.envMap.value=e;const m=this._cubeSize;Or(i,0,0,3*m,2*m),s.setRenderTarget(i),s.render(d,jo)}_applyPMREM(e){const i=this._renderer,s=i.autoClear;i.autoClear=!1;const l=this._lodMeshes.length;for(let c=1;c<l;c++)this._applyGGXFilter(e,c-1,c);i.autoClear=s}_applyGGXFilter(e,i,s){const l=this._renderer,c=this._pingPongRenderTarget,d=this._ggxMaterial,p=this._lodMeshes[s];p.material=d;const m=d.uniforms,h=s/(this._lodMeshes.length-1),x=i/(this._lodMeshes.length-1),S=Math.sqrt(h*h-x*x),g=h*1.25,E=S*g,{_lodMax:A}=this,D=this._sizeLods[s],y=3*D*(s>A-Fr?s-A+Fr:0),_=4*(this._cubeSize-D);m.envMap.value=e.texture,m.roughness.value=E,m.mipInt.value=A-i,Or(c,y,_,3*D,2*D),l.setRenderTarget(c),l.render(p,jo),m.envMap.value=c.texture,m.roughness.value=0,m.mipInt.value=A-s,Or(e,y,_,3*D,2*D),l.setRenderTarget(e),l.render(p,jo)}_blur(e,i,s,l){const c=this._pingPongRenderTarget,d=Math.min(l,Math.PI)/Math.SQRT2;this._blurPass(e,c,i,s,d),this._blurPass(c,e,s,s,d)}_blurPass(e,i,s,l,c){const d=this._renderer,p=this._blurMaterial,m=this._lodMeshes[l];m.material=p;const h=p.uniforms;h.envMap.value=e.texture,h.sigma.value=c,h.mipInt.value=this._lodMax-s;const x=this._sizeLods[l],S=3*x*(l>this._lodMax-Fr?l-this._lodMax+Fr:0),g=4*(this._cubeSize-x);Or(i,S,g,3*x,2*x),d.setRenderTarget(i),d.render(m,jo)}}function Tb(r){const e=[],i=[];let s=r;const l=r-Fr+1+Sb;for(let c=0;c<l;c++){const d=Math.pow(2,s);e.push(d);const p=1/(d-2),m=-p,h=1+p,x=[m,m,h,m,h,h,m,m,h,h,m,h],S=6,g=6,E=3,A=new Float32Array(E*g*S),D=new Float32Array(E*g*S);for(let _=0;_<S;_++){const I=_%3*2/3-1,O=_>2?0:-1,w=[I,O,0,I+2/3,O,0,I+2/3,O+1,0,I,O,0,I+2/3,O+1,0,I,O+1,0];A.set(w,E*g*_);for(let U=0;U<g;U++){const P=x[U*2]*2-1,F=x[U*2+1]*2-1;_===0?Us.set(1,F,P):_===1?Us.set(-P,1,-F):_===2?Us.set(-P,F,1):_===3?Us.set(-1,F,-P):_===4?Us.set(-P,-1,F):Us.set(P,F,-1),Us.toArray(D,(_*g+U)*E)}}const y=new ei;y.setAttribute("position",new ba(A,E)),y.setAttribute("outputDirection",new ba(D,E)),i.push(new Tn(y,null)),s>Fr&&s--}return{lodMeshes:i,sizeLods:e}}function B_(r,e,i){const s=new zi(r,e,i);return s.texture.mapping=cu,s.texture.name="PMREM.cubeUv",s.scissorTest=!0,s}function Or(r,e,i,s,l){r.viewport.set(e,i,s,l),r.scissor.set(e,i,s,l)}function bb(r,e,i){return new Ai({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:yb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:hu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ea,depthTest:!1,depthWrite:!1})}function Ab(r,e,i){return new Ai({name:"SphericalGaussianBlur",defines:{SAMPLES:Mb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/i,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:hu(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Ea,depthTest:!1,depthWrite:!1})}function F_(){return new Ai({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ea,depthTest:!1,depthWrite:!1})}function H_(){return new Ai({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hu(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ea,depthTest:!1,depthWrite:!1})}function hu(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class Bv extends zi{constructor(e=1,i={}){super(e,e,i),this.isWebGLCubeRenderTarget=!0;const s={width:e,height:e,depth:1},l=[s,s,s,s,s,s];this.texture=new Nv(l),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,i){this.texture.type=i.type,this.texture.colorSpace=i.colorSpace,this.texture.generateMipmaps=i.generateMipmaps,this.texture.minFilter=i.minFilter,this.texture.magFilter=i.magFilter;const s={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},l=new Yr(5,5,5),c=new Ai({name:"CubemapFromEquirect",uniforms:kr(s.uniforms),vertexShader:s.vertexShader,fragmentShader:s.fragmentShader,side:Vn,blending:Ea});c.uniforms.tEquirect.value=i;const d=new Tn(l,c),p=i.minFilter;return i.minFilter===Is&&(i.minFilter=In),new Dy(1,10,this).update(e,d),i.minFilter=p,d.geometry.dispose(),d.material.dispose(),this}clear(e,i=!0,s=!0,l=!0){const c=e.getRenderTarget();for(let d=0;d<6;d++)e.setRenderTarget(this,d),e.clear(i,s,l);e.setRenderTarget(c)}}function Rb(r){let e=new WeakMap,i=new WeakMap,s=null;function l(g,E=!1){return g==null?null:E?d(g):c(g)}function c(g){if(g&&g.isTexture){const E=g.mapping;if(E===bd||E===Ad)if(e.has(g)){const A=e.get(g).texture;return p(A,g.mapping)}else{const A=g.image;if(A&&A.height>0){const D=new Bv(A.height);return D.fromEquirectangularTexture(r,g),e.set(g,D),g.addEventListener("dispose",h),p(D.texture,g.mapping)}else return null}}return g}function d(g){if(g&&g.isTexture){const E=g.mapping,A=E===bd||E===Ad,D=E===Gs||E===Vr;if(A||D){let y=i.get(g);const _=y!==void 0?y.texture.pmremVersion:0;if(g.isRenderTargetTexture&&g.pmremVersion!==_)return s===null&&(s=new z_(r)),y=A?s.fromEquirectangular(g,y):s.fromCubemap(g,y),y.texture.pmremVersion=g.pmremVersion,i.set(g,y),y.texture;if(y!==void 0)return y.texture;{const I=g.image;return A&&I&&I.height>0||D&&I&&m(I)?(s===null&&(s=new z_(r)),y=A?s.fromEquirectangular(g):s.fromCubemap(g),y.texture.pmremVersion=g.pmremVersion,i.set(g,y),g.addEventListener("dispose",x),y.texture):null}}}return g}function p(g,E){return E===bd?g.mapping=Gs:E===Ad&&(g.mapping=Vr),g}function m(g){let E=0;const A=6;for(let D=0;D<A;D++)g[D]!==void 0&&E++;return E===A}function h(g){const E=g.target;E.removeEventListener("dispose",h);const A=e.get(E);A!==void 0&&(e.delete(E),A.dispose())}function x(g){const E=g.target;E.removeEventListener("dispose",x);const A=i.get(E);A!==void 0&&(i.delete(E),A.dispose())}function S(){e=new WeakMap,i=new WeakMap,s!==null&&(s.dispose(),s=null)}return{get:l,dispose:S}}function Cb(r){const e={};function i(s){if(e[s]!==void 0)return e[s];const l=r.getExtension(s);return e[s]=l,l}return{has:function(s){return i(s)!==null},init:function(){i("EXT_color_buffer_float"),i("WEBGL_clip_cull_distance"),i("OES_texture_float_linear"),i("EXT_color_buffer_half_float"),i("WEBGL_multisampled_render_to_texture"),i("WEBGL_render_shared_exponent")},get:function(s){const l=i(s);return l===null&&Hr("WebGLRenderer: "+s+" extension not supported."),l}}}function wb(r,e,i,s){const l={},c=new WeakMap;function d(S){const g=S.target;g.index!==null&&e.remove(g.index);for(const A in g.attributes)e.remove(g.attributes[A]);g.removeEventListener("dispose",d),delete l[g.id];const E=c.get(g);E&&(e.remove(E),c.delete(g)),s.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,i.memory.geometries--}function p(S,g){return l[g.id]===!0||(g.addEventListener("dispose",d),l[g.id]=!0,i.memory.geometries++),g}function m(S){const g=S.attributes;for(const E in g)e.update(g[E],r.ARRAY_BUFFER)}function h(S){const g=[],E=S.index,A=S.attributes.position;let D=0;if(A===void 0)return;if(E!==null){const I=E.array;D=E.version;for(let O=0,w=I.length;O<w;O+=3){const U=I[O+0],P=I[O+1],F=I[O+2];g.push(U,P,P,F,F,U)}}else{const I=A.array;D=A.version;for(let O=0,w=I.length/3-1;O<w;O+=3){const U=O+0,P=O+1,F=O+2;g.push(U,P,P,F,F,U)}}const y=new(A.count>=65535?Cv:Rv)(g,1);y.version=D;const _=c.get(S);_&&e.remove(_),c.set(S,y)}function x(S){const g=c.get(S);if(g){const E=S.index;E!==null&&g.version<E.version&&h(S)}else h(S);return c.get(S)}return{get:p,update:m,getWireframeAttribute:x}}function Db(r,e,i){let s;function l(S){s=S}let c,d;function p(S){c=S.type,d=S.bytesPerElement}function m(S,g){r.drawElements(s,g,c,S*d),i.update(g,s,1)}function h(S,g,E){E!==0&&(r.drawElementsInstanced(s,g,c,S*d,E),i.update(g,s,E))}function x(S,g,E){if(E===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(s,g,0,c,S,0,E);let D=0;for(let y=0;y<E;y++)D+=g[y];i.update(D,s,1)}this.setMode=l,this.setIndex=p,this.render=m,this.renderInstances=h,this.renderMultiDraw=x}function Nb(r){const e={geometries:0,textures:0},i={frame:0,calls:0,triangles:0,points:0,lines:0};function s(c,d,p){switch(i.calls++,d){case r.TRIANGLES:i.triangles+=p*(c/3);break;case r.LINES:i.lines+=p*(c/2);break;case r.LINE_STRIP:i.lines+=p*(c-1);break;case r.LINE_LOOP:i.lines+=p*c;break;case r.POINTS:i.points+=p*c;break;default:wt("WebGLInfo: Unknown draw mode:",d);break}}function l(){i.calls=0,i.triangles=0,i.points=0,i.lines=0}return{memory:e,render:i,programs:null,autoReset:!0,reset:l,update:s}}function Ub(r,e,i){const s=new WeakMap,l=new Jt;function c(d,p,m){const h=d.morphTargetInfluences,x=p.morphAttributes.position||p.morphAttributes.normal||p.morphAttributes.color,S=x!==void 0?x.length:0;let g=s.get(p);if(g===void 0||g.count!==S){let X=function(){T.dispose(),s.delete(p),p.removeEventListener("dispose",X)};var E=X;g!==void 0&&g.texture.dispose();const A=p.morphAttributes.position!==void 0,D=p.morphAttributes.normal!==void 0,y=p.morphAttributes.color!==void 0,_=p.morphAttributes.position||[],I=p.morphAttributes.normal||[],O=p.morphAttributes.color||[];let w=0;A===!0&&(w=1),D===!0&&(w=2),y===!0&&(w=3);let U=p.attributes.position.count*w,P=1;U>e.maxTextureSize&&(P=Math.ceil(U/e.maxTextureSize),U=e.maxTextureSize);const F=new Float32Array(U*P*4*S),T=new Tv(F,U,P,S);T.type=qi,T.needsUpdate=!0;const z=w*4;for(let K=0;K<S;K++){const j=_[K],oe=I[K],Z=O[K],ne=U*P*4*K;for(let N=0;N<j.count;N++){const V=N*z;A===!0&&(l.fromBufferAttribute(j,N),F[ne+V+0]=l.x,F[ne+V+1]=l.y,F[ne+V+2]=l.z,F[ne+V+3]=0),D===!0&&(l.fromBufferAttribute(oe,N),F[ne+V+4]=l.x,F[ne+V+5]=l.y,F[ne+V+6]=l.z,F[ne+V+7]=0),y===!0&&(l.fromBufferAttribute(Z,N),F[ne+V+8]=l.x,F[ne+V+9]=l.y,F[ne+V+10]=l.z,F[ne+V+11]=Z.itemSize===4?l.w:1)}}g={count:S,texture:T,size:new _t(U,P)},s.set(p,g),p.addEventListener("dispose",X)}if(d.isInstancedMesh===!0&&d.morphTexture!==null)m.getUniforms().setValue(r,"morphTexture",d.morphTexture,i);else{let A=0;for(let y=0;y<h.length;y++)A+=h[y];const D=p.morphTargetsRelative?1:1-A;m.getUniforms().setValue(r,"morphTargetBaseInfluence",D),m.getUniforms().setValue(r,"morphTargetInfluences",h)}m.getUniforms().setValue(r,"morphTargetsTexture",g.texture,i),m.getUniforms().setValue(r,"morphTargetsTextureSize",g.size)}return{update:c}}function Lb(r,e,i,s,l){let c=new WeakMap;function d(h){const x=l.render.frame,S=h.geometry,g=e.get(h,S);if(c.get(g)!==x&&(e.update(g),c.set(g,x)),h.isInstancedMesh&&(h.hasEventListener("dispose",m)===!1&&h.addEventListener("dispose",m),c.get(h)!==x&&(i.update(h.instanceMatrix,r.ARRAY_BUFFER),h.instanceColor!==null&&i.update(h.instanceColor,r.ARRAY_BUFFER),c.set(h,x))),h.isSkinnedMesh){const E=h.skeleton;c.get(E)!==x&&(E.update(),c.set(E,x))}return g}function p(){c=new WeakMap}function m(h){const x=h.target;x.removeEventListener("dispose",m),s.releaseStatesOfObject(x),i.remove(x.instanceMatrix),x.instanceColor!==null&&i.remove(x.instanceColor)}return{update:d,dispose:p}}const Ob={[cv]:"LINEAR_TONE_MAPPING",[uv]:"REINHARD_TONE_MAPPING",[fv]:"CINEON_TONE_MAPPING",[Qh]:"ACES_FILMIC_TONE_MAPPING",[hv]:"AGX_TONE_MAPPING",[pv]:"NEUTRAL_TONE_MAPPING",[dv]:"CUSTOM_TONE_MAPPING"};function Pb(r,e,i,s,l,c){const d=new zi(e,i,{type:r,depthBuffer:l,stencilBuffer:c,samples:s?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let p=null,m=null;const h=new ei;h.setAttribute("position",new vn([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new vn([0,2,0,0,2,0],2));const x=new yy({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),S=new Tn(h,x),g=new up(-1,1,1,-1,0,1);let E=null,A=null,D=!1,y,_=null,I=[],O=!1;this.setSize=function(w,U){d.setSize(w,U),p!==null&&p.setSize(w,U),m!==null&&m.setSize(w,U);for(let P=0;P<I.length;P++){const F=I[P];F.setSize&&F.setSize(w,U)}},this.setEffects=function(w){I=w,O=I.length>0&&I[0].isRenderPass===!0;const U=d.width,P=d.height;I.length>0&&p===null&&(p=new zi(U,P,{type:Qi,depthBuffer:!1,stencilBuffer:!1}),m=new zi(U,P,{type:Qi,depthBuffer:!1,stencilBuffer:!1}));for(let F=0;F<I.length;F++){const T=I[F];T.setSize&&T.setSize(U,P)}},this.begin=function(w,U){if(D||w.toneMapping===Zi&&I.length===0)return!1;if(_=U,U!==null){const P=U.width,F=U.height;(d.width!==P||d.height!==F)&&this.setSize(P,F)}return O===!1&&w.setRenderTarget(d),y=w.toneMapping,w.toneMapping=Zi,!0},this.hasRenderPass=function(){return O},this.end=function(w,U){w.toneMapping=y,D=!0;let P=d,F=p;for(let T=0;T<I.length;T++){const z=I[T];z.enabled!==!1&&(z.render(w,F,P,U),z.needsSwap!==!1&&(P=F,F=F===p?m:p))}if(E!==w.outputColorSpace||A!==w.toneMapping){E=w.outputColorSpace,A=w.toneMapping,x.defines={},Et.getTransfer(E)===zt&&(x.defines.SRGB_TRANSFER="");const T=Ob[A];T&&(x.defines[T]=""),x.needsUpdate=!0}x.uniforms.tDiffuse.value=P.texture,w.setRenderTarget(_),w.render(S,g),_=null,D=!1},this.isCompositing=function(){return D},this.dispose=function(){d.dispose(),p!==null&&p.dispose(),m!==null&&m.dispose(),h.dispose(),x.dispose()}}const Fv=new kn,qh=new rl(1,1),Hv=new Tv,Gv=new QM,Vv=new Nv,G_=[],V_=[],k_=new Float32Array(16),X_=new Float32Array(9),W_=new Float32Array(4);function qr(r,e,i){const s=r[0];if(s<=0||s>0)return r;const l=e*i;let c=G_[l];if(c===void 0&&(c=new Float32Array(l),G_[l]=c),e!==0){s.toArray(c,0);for(let d=1,p=0;d!==e;++d)p+=i,r[d].toArray(c,p)}return c}function xn(r,e){if(r.length!==e.length)return!1;for(let i=0,s=r.length;i<s;i++)if(r[i]!==e[i])return!1;return!0}function Sn(r,e){for(let i=0,s=e.length;i<s;i++)r[i]=e[i]}function pu(r,e){let i=V_[e];i===void 0&&(i=new Int32Array(e),V_[e]=i);for(let s=0;s!==e;++s)i[s]=r.allocateTextureUnit();return i}function Ib(r,e){const i=this.cache;i[0]!==e&&(r.uniform1f(this.addr,e),i[0]=e)}function zb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2f(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(xn(i,e))return;r.uniform2fv(this.addr,e),Sn(i,e)}}function Bb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3f(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else if(e.r!==void 0)(i[0]!==e.r||i[1]!==e.g||i[2]!==e.b)&&(r.uniform3f(this.addr,e.r,e.g,e.b),i[0]=e.r,i[1]=e.g,i[2]=e.b);else{if(xn(i,e))return;r.uniform3fv(this.addr,e),Sn(i,e)}}function Fb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4f(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(xn(i,e))return;r.uniform4fv(this.addr,e),Sn(i,e)}}function Hb(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(xn(i,e))return;r.uniformMatrix2fv(this.addr,!1,e),Sn(i,e)}else{if(xn(i,s))return;W_.set(s),r.uniformMatrix2fv(this.addr,!1,W_),Sn(i,s)}}function Gb(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(xn(i,e))return;r.uniformMatrix3fv(this.addr,!1,e),Sn(i,e)}else{if(xn(i,s))return;X_.set(s),r.uniformMatrix3fv(this.addr,!1,X_),Sn(i,s)}}function Vb(r,e){const i=this.cache,s=e.elements;if(s===void 0){if(xn(i,e))return;r.uniformMatrix4fv(this.addr,!1,e),Sn(i,e)}else{if(xn(i,s))return;k_.set(s),r.uniformMatrix4fv(this.addr,!1,k_),Sn(i,s)}}function kb(r,e){const i=this.cache;i[0]!==e&&(r.uniform1i(this.addr,e),i[0]=e)}function Xb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2i(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(xn(i,e))return;r.uniform2iv(this.addr,e),Sn(i,e)}}function Wb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3i(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(xn(i,e))return;r.uniform3iv(this.addr,e),Sn(i,e)}}function Yb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4i(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(xn(i,e))return;r.uniform4iv(this.addr,e),Sn(i,e)}}function qb(r,e){const i=this.cache;i[0]!==e&&(r.uniform1ui(this.addr,e),i[0]=e)}function jb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y)&&(r.uniform2ui(this.addr,e.x,e.y),i[0]=e.x,i[1]=e.y);else{if(xn(i,e))return;r.uniform2uiv(this.addr,e),Sn(i,e)}}function Zb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z)&&(r.uniform3ui(this.addr,e.x,e.y,e.z),i[0]=e.x,i[1]=e.y,i[2]=e.z);else{if(xn(i,e))return;r.uniform3uiv(this.addr,e),Sn(i,e)}}function Kb(r,e){const i=this.cache;if(e.x!==void 0)(i[0]!==e.x||i[1]!==e.y||i[2]!==e.z||i[3]!==e.w)&&(r.uniform4ui(this.addr,e.x,e.y,e.z,e.w),i[0]=e.x,i[1]=e.y,i[2]=e.z,i[3]=e.w);else{if(xn(i,e))return;r.uniform4uiv(this.addr,e),Sn(i,e)}}function Qb(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l);let c;this.type===r.SAMPLER_2D_SHADOW?(qh.compareFunction=i.isReversedDepthBuffer()?sp:ap,c=qh):c=Fv,i.setTexture2D(e||c,l)}function Jb(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture3D(e||Gv,l)}function $b(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTextureCube(e||Vv,l)}function eA(r,e,i){const s=this.cache,l=i.allocateTextureUnit();s[0]!==l&&(r.uniform1i(this.addr,l),s[0]=l),i.setTexture2DArray(e||Hv,l)}function tA(r){switch(r){case 5126:return Ib;case 35664:return zb;case 35665:return Bb;case 35666:return Fb;case 35674:return Hb;case 35675:return Gb;case 35676:return Vb;case 5124:case 35670:return kb;case 35667:case 35671:return Xb;case 35668:case 35672:return Wb;case 35669:case 35673:return Yb;case 5125:return qb;case 36294:return jb;case 36295:return Zb;case 36296:return Kb;case 35678:case 36198:case 36298:case 36306:case 35682:return Qb;case 35679:case 36299:case 36307:return Jb;case 35680:case 36300:case 36308:case 36293:return $b;case 36289:case 36303:case 36311:case 36292:return eA}}function nA(r,e){r.uniform1fv(this.addr,e)}function iA(r,e){const i=qr(e,this.size,2);r.uniform2fv(this.addr,i)}function aA(r,e){const i=qr(e,this.size,3);r.uniform3fv(this.addr,i)}function sA(r,e){const i=qr(e,this.size,4);r.uniform4fv(this.addr,i)}function rA(r,e){const i=qr(e,this.size,4);r.uniformMatrix2fv(this.addr,!1,i)}function oA(r,e){const i=qr(e,this.size,9);r.uniformMatrix3fv(this.addr,!1,i)}function lA(r,e){const i=qr(e,this.size,16);r.uniformMatrix4fv(this.addr,!1,i)}function cA(r,e){r.uniform1iv(this.addr,e)}function uA(r,e){r.uniform2iv(this.addr,e)}function fA(r,e){r.uniform3iv(this.addr,e)}function dA(r,e){r.uniform4iv(this.addr,e)}function hA(r,e){r.uniform1uiv(this.addr,e)}function pA(r,e){r.uniform2uiv(this.addr,e)}function mA(r,e){r.uniform3uiv(this.addr,e)}function gA(r,e){r.uniform4uiv(this.addr,e)}function _A(r,e,i){const s=this.cache,l=e.length,c=pu(i,l);xn(s,c)||(r.uniform1iv(this.addr,c),Sn(s,c));let d;this.type===r.SAMPLER_2D_SHADOW?d=qh:d=Fv;for(let p=0;p!==l;++p)i.setTexture2D(e[p]||d,c[p])}function vA(r,e,i){const s=this.cache,l=e.length,c=pu(i,l);xn(s,c)||(r.uniform1iv(this.addr,c),Sn(s,c));for(let d=0;d!==l;++d)i.setTexture3D(e[d]||Gv,c[d])}function xA(r,e,i){const s=this.cache,l=e.length,c=pu(i,l);xn(s,c)||(r.uniform1iv(this.addr,c),Sn(s,c));for(let d=0;d!==l;++d)i.setTextureCube(e[d]||Vv,c[d])}function SA(r,e,i){const s=this.cache,l=e.length,c=pu(i,l);xn(s,c)||(r.uniform1iv(this.addr,c),Sn(s,c));for(let d=0;d!==l;++d)i.setTexture2DArray(e[d]||Hv,c[d])}function MA(r){switch(r){case 5126:return nA;case 35664:return iA;case 35665:return aA;case 35666:return sA;case 35674:return rA;case 35675:return oA;case 35676:return lA;case 5124:case 35670:return cA;case 35667:case 35671:return uA;case 35668:case 35672:return fA;case 35669:case 35673:return dA;case 5125:return hA;case 36294:return pA;case 36295:return mA;case 36296:return gA;case 35678:case 36198:case 36298:case 36306:case 35682:return _A;case 35679:case 36299:case 36307:return vA;case 35680:case 36300:case 36308:case 36293:return xA;case 36289:case 36303:case 36311:case 36292:return SA}}class yA{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.setValue=tA(i.type)}}class EA{constructor(e,i,s){this.id=e,this.addr=s,this.cache=[],this.type=i.type,this.size=i.size,this.setValue=MA(i.type)}}class TA{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,i,s){const l=this.seq;for(let c=0,d=l.length;c!==d;++c){const p=l[c];p.setValue(e,i[p.id],s)}}}const ih=/(\w+)(\])?(\[|\.)?/g;function Y_(r,e){r.seq.push(e),r.map[e.id]=e}function bA(r,e,i){const s=r.name,l=s.length;for(ih.lastIndex=0;;){const c=ih.exec(s),d=ih.lastIndex;let p=c[1];const m=c[2]==="]",h=c[3];if(m&&(p=p|0),h===void 0||h==="["&&d+2===l){Y_(i,h===void 0?new yA(p,r,e):new EA(p,r,e));break}else{let S=i.map[p];S===void 0&&(S=new TA(p),Y_(i,S)),i=S}}}class Qc{constructor(e,i){this.seq=[],this.map={};const s=e.getProgramParameter(i,e.ACTIVE_UNIFORMS);for(let d=0;d<s;++d){const p=e.getActiveUniform(i,d),m=e.getUniformLocation(i,p.name);bA(p,m,this)}const l=[],c=[];for(const d of this.seq)d.type===e.SAMPLER_2D_SHADOW||d.type===e.SAMPLER_CUBE_SHADOW||d.type===e.SAMPLER_2D_ARRAY_SHADOW?l.push(d):c.push(d);l.length>0&&(this.seq=l.concat(c))}setValue(e,i,s,l){const c=this.map[i];c!==void 0&&c.setValue(e,s,l)}setOptional(e,i,s){const l=i[s];l!==void 0&&this.setValue(e,s,l)}static upload(e,i,s,l){for(let c=0,d=i.length;c!==d;++c){const p=i[c],m=s[p.id];m.needsUpdate!==!1&&p.setValue(e,m.value,l)}}static seqWithValue(e,i){const s=[];for(let l=0,c=e.length;l!==c;++l){const d=e[l];d.id in i&&s.push(d)}return s}}function q_(r,e,i){const s=r.createShader(e);return r.shaderSource(s,i),r.compileShader(s),s}const AA=37297;let RA=0;function CA(r,e){const i=r.split(`
`),s=[],l=Math.max(e-6,0),c=Math.min(e+6,i.length);for(let d=l;d<c;d++){const p=d+1;s.push(`${p===e?">":" "} ${p}: ${i[d]}`)}return s.join(`
`)}const j_=new st;function wA(r){Et._getMatrix(j_,Et.workingColorSpace,r);const e=`mat3( ${j_.elements.map(i=>i.toFixed(4))} )`;switch(Et.getTransfer(r)){case nu:return[e,"LinearTransferOETF"];case zt:return[e,"sRGBTransferOETF"];default:return tt("WebGLProgram: Unsupported color space: ",r),[e,"LinearTransferOETF"]}}function Z_(r,e,i){const s=r.getShaderParameter(e,r.COMPILE_STATUS),c=(r.getShaderInfoLog(e)||"").trim();if(s&&c==="")return"";const d=/ERROR: 0:(\d+)/.exec(c);if(d){const p=parseInt(d[1]);return i.toUpperCase()+`

`+c+`

`+CA(r.getShaderSource(e),p)}else return c}function DA(r,e){const i=wA(e);return[`vec4 ${r}( vec4 value ) {`,`	return ${i[1]}( vec4( value.rgb * ${i[0]}, value.a ) );`,"}"].join(`
`)}const NA={[cv]:"Linear",[uv]:"Reinhard",[fv]:"Cineon",[Qh]:"ACESFilmic",[hv]:"AgX",[pv]:"Neutral",[dv]:"Custom"};function UA(r,e){const i=NA[e];return i===void 0?(tt("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+i+"ToneMapping( color ); }"}const Wc=new $;function LA(){Et.getLuminanceCoefficients(Wc);const r=Wc.x.toFixed(4),e=Wc.y.toFixed(4),i=Wc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${e}, ${i} );`,"	return dot( weights, rgb );","}"].join(`
`)}function OA(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter($o).join(`
`)}function PA(r){const e=[];for(const i in r){const s=r[i];s!==!1&&e.push("#define "+i+" "+s)}return e.join(`
`)}function IA(r,e){const i={},s=r.getProgramParameter(e,r.ACTIVE_ATTRIBUTES);for(let l=0;l<s;l++){const c=r.getActiveAttrib(e,l),d=c.name;let p=1;c.type===r.FLOAT_MAT2&&(p=2),c.type===r.FLOAT_MAT3&&(p=3),c.type===r.FLOAT_MAT4&&(p=4),i[d]={type:c.type,location:r.getAttribLocation(e,d),locationSize:p}}return i}function $o(r){return r!==""}function K_(r,e){const i=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return r.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,i).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Q_(r,e){return r.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const zA=/^[ \t]*#include +<([\w\d./]+)>/gm;function jh(r){return r.replace(zA,FA)}const BA=new Map;function FA(r,e){let i=dt[e];if(i===void 0){const s=BA.get(e);if(s!==void 0)i=dt[s],tt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,s);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return jh(i)}const HA=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function J_(r){return r.replace(HA,GA)}function GA(r,e,i,s){let l="";for(let c=parseInt(e);c<parseInt(i);c++)l+=s.replace(/\[\s*i\s*\]/g,"[ "+c+" ]").replace(/UNROLLED_LOOP_INDEX/g,c);return l}function $_(r){let e=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?e+=`
#define HIGH_PRECISION`:r.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const VA={[Yc]:"SHADOWMAP_TYPE_PCF",[Jo]:"SHADOWMAP_TYPE_VSM"};function kA(r){return VA[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const XA={[Gs]:"ENVMAP_TYPE_CUBE",[Vr]:"ENVMAP_TYPE_CUBE",[cu]:"ENVMAP_TYPE_CUBE_UV"};function WA(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":XA[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const YA={[Vr]:"ENVMAP_MODE_REFRACTION"};function qA(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":YA[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const jA={[lv]:"ENVMAP_BLENDING_MULTIPLY",[RM]:"ENVMAP_BLENDING_MIX",[CM]:"ENVMAP_BLENDING_ADD"};function ZA(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":jA[r.combine]||"ENVMAP_BLENDING_NONE"}function KA(r){const e=r.envMapCubeUVHeight;if(e===null)return null;const i=Math.log2(e)-2,s=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,i),112)),texelHeight:s,maxMip:i}}function QA(r,e,i,s){const l=r.getContext(),c=i.defines;let d=i.vertexShader,p=i.fragmentShader;const m=kA(i),h=WA(i),x=qA(i),S=ZA(i),g=KA(i),E=OA(i),A=PA(c),D=l.createProgram();let y,_,I=i.glslVersion?"#version "+i.glslVersion+`
`:"";i.isRawShaderMaterial?(y=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A].filter($o).join(`
`),y.length>0&&(y+=`
`),_=["#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A].filter($o).join(`
`),_.length>0&&(_+=`
`)):(y=[$_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A,i.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",i.batching?"#define USE_BATCHING":"",i.batchingColor?"#define USE_BATCHING_COLOR":"",i.instancing?"#define USE_INSTANCING":"",i.instancingColor?"#define USE_INSTANCING_COLOR":"",i.instancingMorph?"#define USE_INSTANCING_MORPH":"",i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.map?"#define USE_MAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+x:"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.displacementMap?"#define USE_DISPLACEMENTMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.mapUv?"#define MAP_UV "+i.mapUv:"",i.alphaMapUv?"#define ALPHAMAP_UV "+i.alphaMapUv:"",i.lightMapUv?"#define LIGHTMAP_UV "+i.lightMapUv:"",i.aoMapUv?"#define AOMAP_UV "+i.aoMapUv:"",i.emissiveMapUv?"#define EMISSIVEMAP_UV "+i.emissiveMapUv:"",i.bumpMapUv?"#define BUMPMAP_UV "+i.bumpMapUv:"",i.normalMapUv?"#define NORMALMAP_UV "+i.normalMapUv:"",i.displacementMapUv?"#define DISPLACEMENTMAP_UV "+i.displacementMapUv:"",i.metalnessMapUv?"#define METALNESSMAP_UV "+i.metalnessMapUv:"",i.roughnessMapUv?"#define ROUGHNESSMAP_UV "+i.roughnessMapUv:"",i.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+i.anisotropyMapUv:"",i.clearcoatMapUv?"#define CLEARCOATMAP_UV "+i.clearcoatMapUv:"",i.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+i.clearcoatNormalMapUv:"",i.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+i.clearcoatRoughnessMapUv:"",i.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+i.iridescenceMapUv:"",i.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+i.iridescenceThicknessMapUv:"",i.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+i.sheenColorMapUv:"",i.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+i.sheenRoughnessMapUv:"",i.specularMapUv?"#define SPECULARMAP_UV "+i.specularMapUv:"",i.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+i.specularColorMapUv:"",i.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+i.specularIntensityMapUv:"",i.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+i.transmissionMapUv:"",i.thicknessMapUv?"#define THICKNESSMAP_UV "+i.thicknessMapUv:"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexNormals?"#define HAS_NORMAL":"",i.vertexColors?"#define USE_COLOR":"",i.vertexAlphas?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.flatShading?"#define FLAT_SHADED":"",i.skinning?"#define USE_SKINNING":"",i.morphTargets?"#define USE_MORPHTARGETS":"",i.morphNormals&&i.flatShading===!1?"#define USE_MORPHNORMALS":"",i.morphColors?"#define USE_MORPHCOLORS":"",i.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+i.morphTextureStride:"",i.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+i.morphTargetsCount:"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.sizeAttenuation?"#define USE_SIZEATTENUATION":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter($o).join(`
`),_=[$_(i),"#define SHADER_TYPE "+i.shaderType,"#define SHADER_NAME "+i.shaderName,A,i.useFog&&i.fog?"#define USE_FOG":"",i.useFog&&i.fogExp2?"#define FOG_EXP2":"",i.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",i.map?"#define USE_MAP":"",i.matcap?"#define USE_MATCAP":"",i.envMap?"#define USE_ENVMAP":"",i.envMap?"#define "+h:"",i.envMap?"#define "+x:"",i.envMap?"#define "+S:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",i.lightMap?"#define USE_LIGHTMAP":"",i.aoMap?"#define USE_AOMAP":"",i.bumpMap?"#define USE_BUMPMAP":"",i.normalMap?"#define USE_NORMALMAP":"",i.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",i.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",i.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",i.emissiveMap?"#define USE_EMISSIVEMAP":"",i.anisotropy?"#define USE_ANISOTROPY":"",i.anisotropyMap?"#define USE_ANISOTROPYMAP":"",i.clearcoat?"#define USE_CLEARCOAT":"",i.clearcoatMap?"#define USE_CLEARCOATMAP":"",i.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",i.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",i.dispersion?"#define USE_DISPERSION":"",i.retroreflection?"#define USE_RETROREFLECTION":"",i.iridescence?"#define USE_IRIDESCENCE":"",i.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",i.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",i.specularMap?"#define USE_SPECULARMAP":"",i.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",i.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",i.roughnessMap?"#define USE_ROUGHNESSMAP":"",i.metalnessMap?"#define USE_METALNESSMAP":"",i.alphaMap?"#define USE_ALPHAMAP":"",i.alphaTest?"#define USE_ALPHATEST":"",i.alphaHash?"#define USE_ALPHAHASH":"",i.sheen?"#define USE_SHEEN":"",i.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",i.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",i.transmission?"#define USE_TRANSMISSION":"",i.transmissionMap?"#define USE_TRANSMISSIONMAP":"",i.thicknessMap?"#define USE_THICKNESSMAP":"",i.vertexTangents&&i.flatShading===!1?"#define USE_TANGENT":"",i.vertexColors||i.instancingColor?"#define USE_COLOR":"",i.vertexAlphas||i.batchingColor?"#define USE_COLOR_ALPHA":"",i.vertexUv1s?"#define USE_UV1":"",i.vertexUv2s?"#define USE_UV2":"",i.vertexUv3s?"#define USE_UV3":"",i.pointsUvs?"#define USE_POINTS_UV":"",i.gradientMap?"#define USE_GRADIENTMAP":"",i.flatShading?"#define FLAT_SHADED":"",i.doubleSided?"#define DOUBLE_SIDED":"",i.flipSided?"#define FLIP_SIDED":"",i.shadowMapEnabled?"#define USE_SHADOWMAP":"",i.shadowMapEnabled?"#define "+m:"",i.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",i.numLightProbes>0?"#define USE_LIGHT_PROBES":"",i.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",i.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",i.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",i.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",i.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",i.toneMapping!==Zi?"#define TONE_MAPPING":"",i.toneMapping!==Zi?dt.tonemapping_pars_fragment:"",i.toneMapping!==Zi?UA("toneMapping",i.toneMapping):"",i.dithering?"#define DITHERING":"",i.opaque?"#define OPAQUE":"",dt.colorspace_pars_fragment,DA("linearToOutputTexel",i.outputColorSpace),LA(),i.useDepthPacking?"#define DEPTH_PACKING "+i.depthPacking:"",`
`].filter($o).join(`
`)),d=jh(d),d=K_(d,i),d=Q_(d,i),p=jh(p),p=K_(p,i),p=Q_(p,i),d=J_(d),p=J_(p),i.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,y=[E,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+y,_=["#define varying in",i.glslVersion===l_?"":"layout(location = 0) out highp vec4 pc_fragColor;",i.glslVersion===l_?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+_);const O=I+y+d,w=I+_+p,U=q_(l,l.VERTEX_SHADER,O),P=q_(l,l.FRAGMENT_SHADER,w);l.attachShader(D,U),l.attachShader(D,P),i.index0AttributeName!==void 0?l.bindAttribLocation(D,0,i.index0AttributeName):i.hasPositionAttribute===!0&&l.bindAttribLocation(D,0,"position"),l.linkProgram(D);function F(K){if(r.debug.checkShaderErrors){const j=l.getProgramInfoLog(D)||"",oe=l.getShaderInfoLog(U)||"",Z=l.getShaderInfoLog(P)||"",ne=j.trim(),N=oe.trim(),V=Z.trim();let fe=!0,se=!0;if(l.getProgramParameter(D,l.LINK_STATUS)===!1)if(fe=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(l,D,U,P);else{const H=Z_(l,U,"vertex"),C=Z_(l,P,"fragment");wt("WebGLProgram: Shader Error "+l.getError()+" - VALIDATE_STATUS "+l.getProgramParameter(D,l.VALIDATE_STATUS)+`

Material Name: `+K.name+`
Material Type: `+K.type+`

Program Info Log: `+ne+`
`+H+`
`+C)}else ne!==""?tt("WebGLProgram: Program Info Log:",ne):(N===""||V==="")&&(se=!1);se&&(K.diagnostics={runnable:fe,programLog:ne,vertexShader:{log:N,prefix:y},fragmentShader:{log:V,prefix:_}})}l.deleteShader(U),l.deleteShader(P),T=new Qc(l,D),z=IA(l,D)}let T;this.getUniforms=function(){return T===void 0&&F(this),T};let z;this.getAttributes=function(){return z===void 0&&F(this),z};let X=i.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return X===!1&&(X=l.getProgramParameter(D,AA)),X},this.destroy=function(){s.releaseStatesOfProgram(this),l.deleteProgram(D),this.program=void 0},this.type=i.shaderType,this.name=i.shaderName,this.id=RA++,this.cacheKey=e,this.usedTimes=1,this.program=D,this.vertexShader=U,this.fragmentShader=P,this}let JA=0;class $A{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,i,s){const l=this._getShaderCacheForMaterial(e);return l.has(i)===!1&&(l.add(i),i.usedTimes++),l.has(s)===!1&&(l.add(s),s.usedTimes++),this}remove(e){const i=this.materialCache.get(e);for(const s of i)s.usedTimes--,s.usedTimes===0&&this.shaderCache.delete(s.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const i=this.materialCache;let s=i.get(e);return s===void 0&&(s=new Set,i.set(e,s)),s}_getShaderStage(e){const i=this.shaderCache;let s=i.get(e);return s===void 0&&(s=new e1(e),i.set(e,s)),s}}class e1{constructor(e){this.id=JA++,this.code=e,this.usedTimes=0}}function t1(r){return r===Vs||r===$c||r===eu}function n1(r,e,i,s,l,c){const d=new bv,p=new $A,m=new Set,h=[],x=new Map,S=s.logarithmicDepthBuffer;let g=s.precision;const E={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function A(T){return m.add(T),T===0?"uv":`uv${T}`}function D(T,z,X,K,j,oe){const Z=K.fog,ne=j.geometry,N=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?K.environment:null,V=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap,fe=e.get(T.envMap||N,V),se=fe&&fe.mapping===cu?fe.image.height:null,H=E[T.type];T.precision!==null&&(g=s.getMaxPrecision(T.precision),g!==T.precision&&tt("WebGLProgram.getParameters:",T.precision,"not supported, using",g,"instead."));const C=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,Y=C!==void 0?C.length:0;let ee=0;ne.morphAttributes.position!==void 0&&(ee=1),ne.morphAttributes.normal!==void 0&&(ee=2),ne.morphAttributes.color!==void 0&&(ee=3);let ye,De,Fe,re;if(H){const Bt=Yi[H];ye=Bt.vertexShader,De=Bt.fragmentShader}else{ye=T.vertexShader,De=T.fragmentShader;const Bt=p.getVertexShaderStage(T),bt=p.getFragmentShaderStage(T);p.update(T,Bt,bt),Fe=Bt.id,re=bt.id}const me=r.getRenderTarget(),be=r.state.buffers.depth.getReversed(),$e=j.isInstancedMesh===!0,Oe=j.isBatchedMesh===!0,ot=!!T.map,en=!!T.matcap,it=!!fe,vt=!!T.aoMap,Lt=!!T.lightMap,pt=!!T.bumpMap&&T.wireframe===!1,kt=!!T.normalMap,tn=!!T.displacementMap,Mn=!!T.emissiveMap,Xt=!!T.metalnessMap,nn=!!T.roughnessMap,Q=T.anisotropy>0,Ot=T.clearcoat>0,Dt=T.dispersion>0,B=T.retroreflectivity>0,M=T.iridescence>0,te=T.sheen>0,ue=T.transmission>0,ge=Q&&!!T.anisotropyMap,Ae=Ot&&!!T.clearcoatMap,Ne=Ot&&!!T.clearcoatNormalMap,_e=Ot&&!!T.clearcoatRoughnessMap,ve=M&&!!T.iridescenceMap,Re=M&&!!T.iridescenceThicknessMap,Ve=te&&!!T.sheenColorMap,Pe=te&&!!T.sheenRoughnessMap,Ue=!!T.specularMap,Ke=!!T.specularColorMap,Qe=!!T.specularIntensityMap,nt=ue&&!!T.transmissionMap,q=ue&&!!T.thicknessMap,Ce=!!T.gradientMap,Se=!!T.alphaMap,we=T.alphaTest>0,Be=!!T.alphaHash,Te=!!T.extensions;let Ze=Zi;T.toneMapped&&(me===null||me.isXRRenderTarget===!0)&&(Ze=r.toneMapping);const We={shaderID:H,shaderType:T.type,shaderName:T.name,vertexShader:ye,fragmentShader:De,defines:T.defines,customVertexShaderID:Fe,customFragmentShaderID:re,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:g,batching:Oe,batchingColor:Oe&&j._colorsTexture!==null,instancing:$e,instancingColor:$e&&j.instanceColor!==null,instancingMorph:$e&&j.morphTexture!==null,outputColorSpace:me===null?r.outputColorSpace:me.isXRRenderTarget===!0?me.texture.colorSpace:Et.workingColorSpace,alphaToCoverage:!!T.alphaToCoverage,map:ot,matcap:en,envMap:it,envMapMode:it&&fe.mapping,envMapCubeUVHeight:se,aoMap:vt,lightMap:Lt,bumpMap:pt,normalMap:kt,displacementMap:tn,emissiveMap:Mn,normalMapObjectSpace:kt&&T.normalMapType===NM,normalMapTangentSpace:kt&&T.normalMapType===Wh,packedNormalMap:kt&&T.normalMapType===Wh&&t1(T.normalMap.format),metalnessMap:Xt,roughnessMap:nn,anisotropy:Q,anisotropyMap:ge,clearcoat:Ot,clearcoatMap:Ae,clearcoatNormalMap:Ne,clearcoatRoughnessMap:_e,dispersion:Dt,retroreflection:B,iridescence:M,iridescenceMap:ve,iridescenceThicknessMap:Re,sheen:te,sheenColorMap:Ve,sheenRoughnessMap:Pe,specularMap:Ue,specularColorMap:Ke,specularIntensityMap:Qe,transmission:ue,transmissionMap:nt,thicknessMap:q,gradientMap:Ce,opaque:T.transparent===!1&&T.blending===el&&T.alphaToCoverage===!1,alphaMap:Se,alphaTest:we,alphaHash:Be,combine:T.combine,mapUv:ot&&A(T.map.channel),aoMapUv:vt&&A(T.aoMap.channel),lightMapUv:Lt&&A(T.lightMap.channel),bumpMapUv:pt&&A(T.bumpMap.channel),normalMapUv:kt&&A(T.normalMap.channel),displacementMapUv:tn&&A(T.displacementMap.channel),emissiveMapUv:Mn&&A(T.emissiveMap.channel),metalnessMapUv:Xt&&A(T.metalnessMap.channel),roughnessMapUv:nn&&A(T.roughnessMap.channel),anisotropyMapUv:ge&&A(T.anisotropyMap.channel),clearcoatMapUv:Ae&&A(T.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&A(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:_e&&A(T.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&A(T.iridescenceMap.channel),iridescenceThicknessMapUv:Re&&A(T.iridescenceThicknessMap.channel),sheenColorMapUv:Ve&&A(T.sheenColorMap.channel),sheenRoughnessMapUv:Pe&&A(T.sheenRoughnessMap.channel),specularMapUv:Ue&&A(T.specularMap.channel),specularColorMapUv:Ke&&A(T.specularColorMap.channel),specularIntensityMapUv:Qe&&A(T.specularIntensityMap.channel),transmissionMapUv:nt&&A(T.transmissionMap.channel),thicknessMapUv:q&&A(T.thicknessMap.channel),alphaMapUv:Se&&A(T.alphaMap.channel),vertexTangents:!!ne.attributes.tangent&&(kt||Q),vertexNormals:!!ne.attributes.normal,vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,pointsUvs:j.isPoints===!0&&!!ne.attributes.uv&&(ot||Se),fog:!!Z,useFog:T.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:T.wireframe===!1&&(T.flatShading===!0||ne.attributes.normal===void 0&&kt===!1&&(T.isMeshLambertMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isMeshPhysicalMaterial)),sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:S,reversedDepthBuffer:be,skinning:j.isSkinnedMesh===!0,hasPositionAttribute:ne.attributes.position!==void 0,morphTargets:ne.morphAttributes.position!==void 0,morphNormals:ne.morphAttributes.normal!==void 0,morphColors:ne.morphAttributes.color!==void 0,morphTargetsCount:Y,morphTextureStride:ee,numSunLights:z.sun.length,numDirLights:z.directional.length,numPointLights:z.point.length,numSpotLights:z.spot.length,numSpotLightMaps:z.spotLightMap.length,numRectAreaLights:z.rectArea.length,numHemiLights:z.hemi.length,numSunLightShadows:z.sunShadowMap.length,numDirLightShadows:z.directionalShadowMap.length,numPointLightShadows:z.pointShadowMap.length,numSpotLightShadows:z.spotShadowMap.length,numSpotLightShadowsWithMaps:z.numSpotLightShadowsWithMaps,numLightProbes:z.numLightProbes,numLightProbeGrids:oe.length,numClippingPlanes:c.numPlanes,numClipIntersection:c.numIntersection,dithering:T.dithering,shadowMapEnabled:r.shadowMap.enabled&&X.length>0,shadowMapType:r.shadowMap.type,toneMapping:Ze,decodeVideoTexture:ot&&T.map.isVideoTexture===!0&&Et.getTransfer(T.map.colorSpace)===zt,decodeVideoTextureEmissive:Mn&&T.emissiveMap.isVideoTexture===!0&&Et.getTransfer(T.emissiveMap.colorSpace)===zt,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Oi,flipSided:T.side===Vn,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:Te&&T.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Te&&T.extensions.multiDraw===!0||Oe)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return We.vertexUv1s=m.has(1),We.vertexUv2s=m.has(2),We.vertexUv3s=m.has(3),m.clear(),We}function y(T){const z=[];if(T.shaderID?z.push(T.shaderID):(z.push(T.customVertexShaderID),z.push(T.customFragmentShaderID)),T.defines!==void 0)for(const X in T.defines)z.push(X),z.push(T.defines[X]);return T.isRawShaderMaterial===!1&&(_(z,T),I(z,T),z.push(r.outputColorSpace)),z.push(T.customProgramCacheKey),z.join()}function _(T,z){T.push(z.precision),T.push(z.outputColorSpace),T.push(z.envMapMode),T.push(z.envMapCubeUVHeight),T.push(z.mapUv),T.push(z.alphaMapUv),T.push(z.lightMapUv),T.push(z.aoMapUv),T.push(z.bumpMapUv),T.push(z.normalMapUv),T.push(z.displacementMapUv),T.push(z.emissiveMapUv),T.push(z.metalnessMapUv),T.push(z.roughnessMapUv),T.push(z.anisotropyMapUv),T.push(z.clearcoatMapUv),T.push(z.clearcoatNormalMapUv),T.push(z.clearcoatRoughnessMapUv),T.push(z.iridescenceMapUv),T.push(z.iridescenceThicknessMapUv),T.push(z.sheenColorMapUv),T.push(z.sheenRoughnessMapUv),T.push(z.specularMapUv),T.push(z.specularColorMapUv),T.push(z.specularIntensityMapUv),T.push(z.transmissionMapUv),T.push(z.thicknessMapUv),T.push(z.combine),T.push(z.fogExp2),T.push(z.sizeAttenuation),T.push(z.morphTargetsCount),T.push(z.morphAttributeCount),T.push(z.numSunLights),T.push(z.numDirLights),T.push(z.numPointLights),T.push(z.numSpotLights),T.push(z.numSpotLightMaps),T.push(z.numHemiLights),T.push(z.numRectAreaLights),T.push(z.numSunLightShadows),T.push(z.numDirLightShadows),T.push(z.numPointLightShadows),T.push(z.numSpotLightShadows),T.push(z.numSpotLightShadowsWithMaps),T.push(z.numLightProbes),T.push(z.shadowMapType),T.push(z.toneMapping),T.push(z.numClippingPlanes),T.push(z.numClipIntersection),T.push(z.depthPacking)}function I(T,z){d.disableAll(),z.instancing&&d.enable(0),z.instancingColor&&d.enable(1),z.instancingMorph&&d.enable(2),z.matcap&&d.enable(3),z.envMap&&d.enable(4),z.normalMapObjectSpace&&d.enable(5),z.normalMapTangentSpace&&d.enable(6),z.clearcoat&&d.enable(7),z.iridescence&&d.enable(8),z.alphaTest&&d.enable(9),z.vertexColors&&d.enable(10),z.vertexAlphas&&d.enable(11),z.vertexUv1s&&d.enable(12),z.vertexUv2s&&d.enable(13),z.vertexUv3s&&d.enable(14),z.vertexTangents&&d.enable(15),z.anisotropy&&d.enable(16),z.alphaHash&&d.enable(17),z.batching&&d.enable(18),z.dispersion&&d.enable(19),z.retroreflection&&d.enable(24),z.batchingColor&&d.enable(20),z.gradientMap&&d.enable(21),z.packedNormalMap&&d.enable(22),z.vertexNormals&&d.enable(23),T.push(d.mask),d.disableAll(),z.fog&&d.enable(0),z.useFog&&d.enable(1),z.flatShading&&d.enable(2),z.logarithmicDepthBuffer&&d.enable(3),z.reversedDepthBuffer&&d.enable(4),z.skinning&&d.enable(5),z.morphTargets&&d.enable(6),z.morphNormals&&d.enable(7),z.morphColors&&d.enable(8),z.premultipliedAlpha&&d.enable(9),z.shadowMapEnabled&&d.enable(10),z.doubleSided&&d.enable(11),z.flipSided&&d.enable(12),z.useDepthPacking&&d.enable(13),z.dithering&&d.enable(14),z.transmission&&d.enable(15),z.sheen&&d.enable(16),z.opaque&&d.enable(17),z.pointsUvs&&d.enable(18),z.decodeVideoTexture&&d.enable(19),z.decodeVideoTextureEmissive&&d.enable(20),z.alphaToCoverage&&d.enable(21),z.numLightProbeGrids>0&&d.enable(22),z.hasPositionAttribute&&d.enable(23),T.push(d.mask)}function O(T){const z=E[T.type];let X;if(z){const K=Yi[z];X=xy.clone(K.uniforms)}else X=T.uniforms;return X}function w(T,z){let X=x.get(z);return X!==void 0?++X.usedTimes:(X=new QA(r,z,T,l),h.push(X),x.set(z,X)),X}function U(T){if(--T.usedTimes===0){const z=h.indexOf(T);h[z]=h[h.length-1],h.pop(),x.delete(T.cacheKey),T.destroy()}}function P(T){p.remove(T)}function F(){p.dispose()}return{getParameters:D,getProgramCacheKey:y,getUniforms:O,acquireProgram:w,releaseProgram:U,releaseShaderCache:P,programs:h,dispose:F}}function i1(){let r=new WeakMap;function e(d){return r.has(d)}function i(d){let p=r.get(d);return p===void 0&&(p={},r.set(d,p)),p}function s(d){r.delete(d)}function l(d,p,m){r.get(d)[p]=m}function c(){r=new WeakMap}return{has:e,get:i,remove:s,update:l,dispose:c}}function a1(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.material.id!==e.material.id?r.material.id-e.material.id:r.materialVariant!==e.materialVariant?r.materialVariant-e.materialVariant:r.z!==e.z?r.z-e.z:r.id-e.id}function ev(r,e){return r.groupOrder!==e.groupOrder?r.groupOrder-e.groupOrder:r.renderOrder!==e.renderOrder?r.renderOrder-e.renderOrder:r.z!==e.z?e.z-r.z:r.id-e.id}function tv(){const r=[];let e=0;const i=[],s=[],l=[];function c(){e=0,i.length=0,s.length=0,l.length=0}function d(g){let E=0;return g.isInstancedMesh&&(E+=2),g.isSkinnedMesh&&(E+=1),E}function p(g,E,A,D,y,_){let I=r[e];return I===void 0?(I={id:g.id,object:g,geometry:E,material:A,materialVariant:d(g),groupOrder:D,renderOrder:g.renderOrder,z:y,group:_},r[e]=I):(I.id=g.id,I.object=g,I.geometry=E,I.material=A,I.materialVariant=d(g),I.groupOrder=D,I.renderOrder=g.renderOrder,I.z=y,I.group=_),e++,I}function m(g,E,A,D,y,_,I){I.reversedDepth===!0&&(y=-y);const O=p(g,E,A,D,y,_);A.transmission>0?s.push(O):A.transparent===!0?l.push(O):i.push(O)}function h(g,E,A,D,y,_){const I=p(g,E,A,D,y,_);A.transmission>0?s.unshift(I):A.transparent===!0?l.unshift(I):i.unshift(I)}function x(g,E){i.length>1&&i.sort(g||a1),s.length>1&&s.sort(E||ev),l.length>1&&l.sort(E||ev)}function S(){for(let g=e,E=r.length;g<E;g++){const A=r[g];if(A.id===null)break;A.id=null,A.object=null,A.geometry=null,A.material=null,A.group=null}}return{opaque:i,transmissive:s,transparent:l,init:c,push:m,unshift:h,finish:S,sort:x}}function s1(){let r=new WeakMap;function e(s,l){const c=r.get(s);let d;return c===void 0?(d=new tv,r.set(s,[d])):l>=c.length?(d=new tv,c.push(d)):d=c[l],d}function i(){r=new WeakMap}return{get:e,dispose:i}}function r1(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let i;switch(e.type){case"SunLight":case"DirectionalLight":i={direction:new $,color:new Mt};break;case"SpotLight":i={position:new $,direction:new $,color:new Mt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":i={position:new $,color:new Mt,distance:0,decay:0};break;case"HemisphereLight":i={direction:new $,skyColor:new Mt,groundColor:new Mt};break;case"RectAreaLight":i={color:new Mt,position:new $,halfWidth:new $,halfHeight:new $};break}return r[e.id]=i,i}}}function o1(){const r={};return{get:function(e){if(r[e.id]!==void 0)return r[e.id];let i;switch(e.type){case"SunLight":case"DirectionalLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"SpotLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t};break;case"PointLight":i={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new _t,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[e.id]=i,i}}}let l1=0;function c1(r,e){return(e.castShadow?2:0)-(r.castShadow?2:0)+(e.map?1:0)-(r.map?1:0)}function u1(r){const e=new r1,i=o1(),s={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)s.probe.push(new $);const l=new $,c=new $t,d=new $t;function p(h){let x=0,S=0,g=0;for(let j=0;j<9;j++)s.probe[j].set(0,0,0);let E=0,A=0,D=0,y=0,_=0,I=0,O=0,w=0,U=0,P=0,F=0,T=0,z=0,X=0;h.sort(c1);for(let j=0,oe=h.length;j<oe;j++){const Z=h[j],ne=Z.color,N=Z.intensity,V=Z.distance;let fe=null;if(Z.shadow&&Z.shadow.map&&(Z.shadow.map.texture.format===Vs?fe=Z.shadow.map.texture:fe=Z.shadow.map.depthTexture||Z.shadow.map.texture),Z.isAmbientLight)x+=ne.r*N,S+=ne.g*N,g+=ne.b*N;else if(Z.isLightProbe){for(let se=0;se<9;se++)s.probe[se].addScaledVector(Z.sh.coefficients[se],N);X++}else if(Z.isSunLight){const se=e.get(Z);if(se.color.copy(Z.color).multiplyScalar(Z.intensity),Z.castShadow){const H=Z.shadow,C=i.get(Z);C.shadowIntensity=H.intensity,C.shadowBias=H.bias,C.shadowNormalBias=H.normalBias,C.shadowRadius=H.radius,C.shadowMapSize.copy(H.mapSize).multiply(H.getFrameExtents()),s.sunShadow[A]=C,s.sunShadowMap[A]=fe;const Y=H.getViewportCount();for(let ee=0;ee<Y;ee++)s.sunShadowMatrix[D+ee]=H.getMatrix(ee),s.sunShadowCascade[D+ee]=H._cascadeData[ee];D+=Y,A++}s.sun[E]=se,E++}else if(Z.isDirectionalLight){const se=e.get(Z);if(se.color.copy(Z.color).multiplyScalar(Z.intensity),Z.castShadow){const H=Z.shadow,C=i.get(Z);C.shadowIntensity=H.intensity,C.shadowBias=H.bias,C.shadowNormalBias=H.normalBias,C.shadowRadius=H.radius,C.shadowMapSize=H.mapSize,s.directionalShadow[y]=C,s.directionalShadowMap[y]=fe,s.directionalShadowMatrix[y]=Z.shadow.matrix,U++}s.directional[y]=se,y++}else if(Z.isSpotLight){const se=e.get(Z);se.position.setFromMatrixPosition(Z.matrixWorld),se.color.copy(ne).multiplyScalar(N),se.distance=V,se.coneCos=Math.cos(Z.angle),se.penumbraCos=Math.cos(Z.angle*(1-Z.penumbra)),se.decay=Z.decay,s.spot[I]=se;const H=Z.shadow;if(Z.map&&(s.spotLightMap[T]=Z.map,T++,H.updateMatrices(Z),Z.castShadow&&z++),s.spotLightMatrix[I]=H.matrix,Z.castShadow){const C=i.get(Z);C.shadowIntensity=H.intensity,C.shadowBias=H.bias,C.shadowNormalBias=H.normalBias,C.shadowRadius=H.radius,C.shadowMapSize=H.mapSize,s.spotShadow[I]=C,s.spotShadowMap[I]=fe,F++}I++}else if(Z.isRectAreaLight){const se=e.get(Z);se.color.copy(ne).multiplyScalar(N),se.halfWidth.set(Z.width*.5,0,0),se.halfHeight.set(0,Z.height*.5,0),s.rectArea[O]=se,O++}else if(Z.isPointLight){const se=e.get(Z);if(se.color.copy(Z.color).multiplyScalar(Z.intensity),se.distance=Z.distance,se.decay=Z.decay,Z.castShadow){const H=Z.shadow,C=i.get(Z);C.shadowIntensity=H.intensity,C.shadowBias=H.bias,C.shadowNormalBias=H.normalBias,C.shadowRadius=H.radius,C.shadowMapSize=H.mapSize,C.shadowCameraNear=H.camera.near,C.shadowCameraFar=H.camera.far,s.pointShadow[_]=C,s.pointShadowMap[_]=fe,s.pointShadowMatrix[_]=Z.shadow.matrix,P++}s.point[_]=se,_++}else if(Z.isHemisphereLight){const se=e.get(Z);se.skyColor.copy(Z.color).multiplyScalar(N),se.groundColor.copy(Z.groundColor).multiplyScalar(N),s.hemi[w]=se,w++}}O>0&&(r.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=ze.LTC_FLOAT_1,s.rectAreaLTC2=ze.LTC_FLOAT_2):(s.rectAreaLTC1=ze.LTC_HALF_1,s.rectAreaLTC2=ze.LTC_HALF_2)),s.ambient[0]=x,s.ambient[1]=S,s.ambient[2]=g;const K=s.hash;(K.sunLength!==E||K.directionalLength!==y||K.pointLength!==_||K.spotLength!==I||K.rectAreaLength!==O||K.hemiLength!==w||K.numSunShadows!==A||K.numDirectionalShadows!==U||K.numPointShadows!==P||K.numSpotShadows!==F||K.numSpotMaps!==T||K.numLightProbes!==X)&&(s.sun.length=E,s.directional.length=y,s.spot.length=I,s.rectArea.length=O,s.point.length=_,s.hemi.length=w,s.sunShadow.length=A,s.sunShadowMap.length=A,s.sunShadowMatrix.length=D,s.sunShadowCascade.length=D,s.directionalShadow.length=U,s.directionalShadowMap.length=U,s.directionalShadowMatrix.length=U,s.pointShadow.length=P,s.pointShadowMap.length=P,s.pointShadowMatrix.length=P,s.spotShadow.length=F,s.spotShadowMap.length=F,s.spotLightMatrix.length=F+T-z,s.spotLightMap.length=T,s.numSpotLightShadowsWithMaps=z,s.numLightProbes=X,K.sunLength=E,K.directionalLength=y,K.pointLength=_,K.spotLength=I,K.rectAreaLength=O,K.hemiLength=w,K.numSunShadows=A,K.numDirectionalShadows=U,K.numPointShadows=P,K.numSpotShadows=F,K.numSpotMaps=T,K.numLightProbes=X,s.version=l1++)}function m(h,x){let S=0,g=0,E=0,A=0,D=0,y=0;const _=x.matrixWorldInverse;for(let I=0,O=h.length;I<O;I++){const w=h[I];if(w.isSunLight){const U=s.sun[S];U.direction.setFromMatrixPosition(w.matrixWorld),U.direction.transformDirection(_),S++}else if(w.isDirectionalLight){const U=s.directional[g];U.direction.setFromMatrixPosition(w.matrixWorld),l.setFromMatrixPosition(w.target.matrixWorld),U.direction.sub(l),U.direction.transformDirection(_),g++}else if(w.isSpotLight){const U=s.spot[A];U.position.setFromMatrixPosition(w.matrixWorld),U.position.applyMatrix4(_),U.direction.setFromMatrixPosition(w.matrixWorld),l.setFromMatrixPosition(w.target.matrixWorld),U.direction.sub(l),U.direction.transformDirection(_),A++}else if(w.isRectAreaLight){const U=s.rectArea[D];U.position.setFromMatrixPosition(w.matrixWorld),U.position.applyMatrix4(_),d.identity(),c.copy(w.matrixWorld),c.premultiply(_),d.extractRotation(c),U.halfWidth.set(w.width*.5,0,0),U.halfHeight.set(0,w.height*.5,0),U.halfWidth.applyMatrix4(d),U.halfHeight.applyMatrix4(d),D++}else if(w.isPointLight){const U=s.point[E];U.position.setFromMatrixPosition(w.matrixWorld),U.position.applyMatrix4(_),E++}else if(w.isHemisphereLight){const U=s.hemi[y];U.direction.setFromMatrixPosition(w.matrixWorld),U.direction.transformDirection(_),y++}}}return{setup:p,setupView:m,state:s}}function nv(r){const e=new u1(r),i=[],s=[],l=[];function c(g){S.camera=g,i.length=0,s.length=0,l.length=0}function d(g){i.push(g)}function p(g){s.push(g)}function m(g){l.push(g)}function h(){e.setup(i)}function x(g){e.setupView(i,g)}const S={lightsArray:i,shadowsArray:s,lightProbeGridArray:l,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:c,state:S,setupLights:h,setupLightsView:x,pushLight:d,pushShadow:p,pushLightProbeGrid:m}}function f1(r){let e=new WeakMap;function i(l,c=0){const d=e.get(l);let p;return d===void 0?(p=new nv(r),e.set(l,[p])):c>=d.length?(p=new nv(r),d.push(p)):p=d[c],p}function s(){e=new WeakMap}return{get:i,dispose:s}}const d1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,h1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,p1=[new $(1,0,0),new $(-1,0,0),new $(0,1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1)],m1=[new $(0,-1,0),new $(0,-1,0),new $(0,0,1),new $(0,0,-1),new $(0,-1,0),new $(0,-1,0)],iv=new $t,Zo=new $,ah=new $;function g1(r,e,i){let s=new lp;const l=new _t,c=new _t,d=new Jt,p=new Ty,m=new by,h={},x=i.maxTextureSize,S={[Hs]:Vn,[Vn]:Hs,[Oi]:Oi},g=new Ai({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new _t},radius:{value:4}},vertexShader:d1,fragmentShader:h1}),E=g.clone();E.defines.HORIZONTAL_PASS=1;const A=new ei;A.setAttribute("position",new ba(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const D=new Tn(A,g),y=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yc;let _=this.type;this.render=function(P,F,T){if(y.enabled===!1||y.autoUpdate===!1&&y.needsUpdate===!1||P.length===0)return;this.type===lM&&(tt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Yc);const z=r.getRenderTarget(),X=r.getActiveCubeFace(),K=r.getActiveMipmapLevel(),j=r.state;j.setBlending(Ea),j.buffers.depth.getReversed()===!0?j.buffers.color.setClear(0,0,0,0):j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);const oe=_!==this.type;oe&&F.traverse(function(Z){Z.material&&(Array.isArray(Z.material)?Z.material.forEach(ne=>ne.needsUpdate=!0):Z.material.needsUpdate=!0)});for(let Z=0,ne=P.length;Z<ne;Z++){const N=P[Z],V=N.shadow;if(V===void 0){tt("WebGLShadowMap:",N,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;l.copy(V.mapSize);const fe=V.getFrameExtents();l.multiply(fe),c.copy(V.mapSize),(l.x>x||l.y>x)&&(l.x>x&&(c.x=Math.floor(x/fe.x),l.x=c.x*fe.x,V.mapSize.x=c.x),l.y>x&&(c.y=Math.floor(x/fe.y),l.y=c.y*fe.y,V.mapSize.y=c.y));const se=r.state.buffers.depth.getReversed();if(V.camera._reversedDepth=se,V.map===null||oe===!0){if(V.map!==null&&(V.map.depthTexture!==null&&(V.map.depthTexture.dispose(),V.map.depthTexture=null),V.map.dispose()),this.type===Jo){if(N.isPointLight){tt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}V.map=new zi(l.x,l.y,{format:Vs,type:Qi,minFilter:In,magFilter:In,generateMipmaps:!1}),V.map.texture.name=N.name+".shadowMap",V.map.depthTexture=new rl(l.x,l.y,qi),V.map.depthTexture.name=N.name+".shadowMapDepth",V.map.depthTexture.format=Aa,V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Un,V.map.depthTexture.magFilter=Un}else N.isPointLight?(V.map=new Bv(l.x),V.map.depthTexture=new _y(l.x,Ki)):(V.map=new zi(l.x,l.y),V.map.depthTexture=new rl(l.x,l.y,Ki)),V.map.depthTexture.name=N.name+".shadowMap",V.map.depthTexture.format=Aa,this.type===Yc?(V.map.depthTexture.compareFunction=se?sp:ap,V.map.depthTexture.minFilter=In,V.map.depthTexture.magFilter=In):(V.map.depthTexture.compareFunction=null,V.map.depthTexture.minFilter=Un,V.map.depthTexture.magFilter=Un);V.camera.updateProjectionMatrix()}V.map.isWebGLCubeRenderTarget!==!0&&(V.map.width!==l.x||V.map.height!==l.y)&&V.map.setSize(l.x,l.y);const H=V.map.isWebGLCubeRenderTarget?6:V.getViewportCount();N.isPointLight!==!0&&V.updateMatrices(N,T);for(let C=0;C<H;C++){const Y=V.getCamera(C);if(N.isPointLight){const ee=V.camera,ye=V.matrix,De=N.distance||ee.far;De!==ee.far&&(ee.far=De,ee.updateProjectionMatrix()),Zo.setFromMatrixPosition(N.matrixWorld),ee.position.copy(Zo),ah.copy(ee.position),ah.add(p1[C]),ee.up.copy(m1[C]),ee.lookAt(ah),ee.updateMatrixWorld(),ye.makeTranslation(-Zo.x,-Zo.y,-Zo.z),iv.multiplyMatrices(ee.projectionMatrix,ee.matrixWorldInverse),V._frustum.setFromProjectionMatrix(iv,ee.coordinateSystem,ee.reversedDepth)}if(V.map.isWebGLCubeRenderTarget)r.setRenderTarget(V.map,C),r.clear();else{C===0&&(r.setRenderTarget(V.map),r.clear());const ee=V.getViewport(C);d.set(c.x*ee.x,c.y*ee.y,c.x*ee.z,c.y*ee.w),j.viewport(d)}s=V.getFrustum(C),w(F,T,Y,N,this.type)}V.isPointLightShadow!==!0&&this.type===Jo&&I(V,T),V.needsUpdate=!1}_=this.type,y.needsUpdate=!1,r.setRenderTarget(z,X,K)};function I(P,F){const T=e.update(D);g.defines.VSM_SAMPLES!==P.blurSamples&&(g.defines.VSM_SAMPLES=P.blurSamples,E.defines.VSM_SAMPLES=P.blurSamples,g.needsUpdate=!0,E.needsUpdate=!0),P.mapPass===null?P.mapPass=new zi(l.x,l.y,{format:Vs,type:Qi}):(P.mapPass.width!==P.map.width||P.mapPass.height!==P.map.height)&&P.mapPass.setSize(P.map.width,P.map.height),g.uniforms.shadow_pass.value=P.map.depthTexture,g.uniforms.resolution.value.set(P.map.width,P.map.height),g.uniforms.radius.value=P.radius,r.setRenderTarget(P.mapPass),r.clear(),r.renderBufferDirect(F,null,T,g,D,null),E.uniforms.shadow_pass.value=P.mapPass.texture,E.uniforms.resolution.value.set(P.map.width,P.map.height),E.uniforms.radius.value=P.radius,r.setRenderTarget(P.map),r.clear(),r.renderBufferDirect(F,null,T,E,D,null)}function O(P,F,T,z){let X=null;const K=T.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(K!==void 0)X=K;else if(X=T.isPointLight===!0?m:p,r.localClippingEnabled&&F.clipShadows===!0&&Array.isArray(F.clippingPlanes)&&F.clippingPlanes.length!==0||F.displacementMap&&F.displacementScale!==0||F.alphaMap&&F.alphaTest>0||F.map&&F.alphaTest>0||F.alphaToCoverage===!0){const j=X.uuid,oe=F.uuid;let Z=h[j];Z===void 0&&(Z={},h[j]=Z);let ne=Z[oe];ne===void 0&&(ne=X.clone(),Z[oe]=ne,F.addEventListener("dispose",U)),X=ne}if(X.visible=F.visible,X.wireframe=F.wireframe,z===Jo?X.side=F.shadowSide!==null?F.shadowSide:F.side:X.side=F.shadowSide!==null?F.shadowSide:S[F.side],X.alphaMap=F.alphaMap,X.alphaTest=F.alphaToCoverage===!0?.5:F.alphaTest,X.map=F.map,X.clipShadows=F.clipShadows,X.clippingPlanes=F.clippingPlanes,X.clipIntersection=F.clipIntersection,X.displacementMap=F.displacementMap,X.displacementScale=F.displacementScale,X.displacementBias=F.displacementBias,X.wireframeLinewidth=F.wireframeLinewidth,X.linewidth=F.linewidth,T.isPointLight===!0&&X.isMeshDistanceMaterial===!0){const j=r.properties.get(X);j.light=T}return X}function w(P,F,T,z,X){if(P.visible===!1)return;if(P.layers.test(F.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&X===Jo)&&(!P.frustumCulled||P.intersectsFrustum(s))){P.modelViewMatrix.multiplyMatrices(T.matrixWorldInverse,P.matrixWorld);const oe=e.update(P),Z=P.material;if(Array.isArray(Z)){const ne=oe.groups;for(let N=0,V=ne.length;N<V;N++){const fe=ne[N],se=Z[fe.materialIndex];if(se&&se.visible){const H=O(P,se,z,X);P.onBeforeShadow(r,P,F,T,oe,H,fe),r.renderBufferDirect(T,null,oe,H,P,fe),P.onAfterShadow(r,P,F,T,oe,H,fe)}}}else if(Z.visible){const ne=O(P,Z,z,X);P.onBeforeShadow(r,P,F,T,oe,ne,null),r.renderBufferDirect(T,null,oe,ne,P,null),P.onAfterShadow(r,P,F,T,oe,ne,null)}}const j=P.children;for(let oe=0,Z=j.length;oe<Z;oe++)w(j[oe],F,T,z,X)}function U(P){P.target.removeEventListener("dispose",U);for(const T in h){const z=h[T],X=P.target.uuid;X in z&&(z[X].dispose(),delete z[X])}}}function _1(r,e){function i(){let q=!1;const Ce=new Jt;let Se=null;const we=new Jt(0,0,0,0);return{setMask:function(Be){Se!==Be&&!q&&(r.colorMask(Be,Be,Be,Be),Se=Be)},setLocked:function(Be){q=Be},setClear:function(Be,Te,Ze,We,Bt){Bt===!0&&(Be*=We,Te*=We,Ze*=We),Ce.set(Be,Te,Ze,We),we.equals(Ce)===!1&&(r.clearColor(Be,Te,Ze,We),we.copy(Ce))},reset:function(){q=!1,Se=null,we.set(-1,0,0,0)}}}function s(){let q=!1,Ce=!1,Se=null,we=null,Be=null;return{setReversed:function(Te){if(Ce!==Te){const Ze=e.get("EXT_clip_control");Te?Ze.clipControlEXT(Ze.LOWER_LEFT_EXT,Ze.ZERO_TO_ONE_EXT):Ze.clipControlEXT(Ze.LOWER_LEFT_EXT,Ze.NEGATIVE_ONE_TO_ONE_EXT),Ce=Te;const We=Be;Be=null,this.setClear(We)}},getReversed:function(){return Ce},setTest:function(Te){Te?me(r.DEPTH_TEST):be(r.DEPTH_TEST)},setMask:function(Te){Se!==Te&&!q&&(r.depthMask(Te),Se=Te)},setFunc:function(Te){if(Ce&&(Te=XM[Te]),we!==Te){switch(Te){case rh:r.depthFunc(r.NEVER);break;case oh:r.depthFunc(r.ALWAYS);break;case lh:r.depthFunc(r.LESS);break;case nl:r.depthFunc(r.LEQUAL);break;case ch:r.depthFunc(r.EQUAL);break;case uh:r.depthFunc(r.GEQUAL);break;case fh:r.depthFunc(r.GREATER);break;case dh:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}we=Te}},setLocked:function(Te){q=Te},setClear:function(Te){Be!==Te&&(Be=Te,Ce&&(Te=1-Te),r.clearDepth(Te))},reset:function(){q=!1,Se=null,we=null,Be=null,Ce=!1}}}function l(){let q=!1,Ce=null,Se=null,we=null,Be=null,Te=null,Ze=null,We=null,Bt=null;return{setTest:function(bt){q||(bt?me(r.STENCIL_TEST):be(r.STENCIL_TEST))},setMask:function(bt){Ce!==bt&&!q&&(r.stencilMask(bt),Ce=bt)},setFunc:function(bt,Xn,ti){(Se!==bt||we!==Xn||Be!==ti)&&(r.stencilFunc(bt,Xn,ti),Se=bt,we=Xn,Be=ti)},setOp:function(bt,Xn,ti){(Te!==bt||Ze!==Xn||We!==ti)&&(r.stencilOp(bt,Xn,ti),Te=bt,Ze=Xn,We=ti)},setLocked:function(bt){q=bt},setClear:function(bt){Bt!==bt&&(r.clearStencil(bt),Bt=bt)},reset:function(){q=!1,Ce=null,Se=null,we=null,Be=null,Te=null,Ze=null,We=null,Bt=null}}}const c=new i,d=new s,p=new l,m=new WeakMap,h=new WeakMap;let x={},S={},g={},E=new WeakMap,A=[],D=null,y=!1,_=null,I=null,O=null,w=null,U=null,P=null,F=null,T=new Mt(0,0,0),z=0,X=!1,K=null,j=null,oe=null,Z=null,ne=null;const N=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let V=!1,fe=0;const se=r.getParameter(r.VERSION);se.indexOf("WebGL")!==-1?(fe=parseFloat(/^WebGL (\d)/.exec(se)[1]),V=fe>=1):se.indexOf("OpenGL ES")!==-1&&(fe=parseFloat(/^OpenGL ES (\d)/.exec(se)[1]),V=fe>=2);let H=null,C={};const Y=r.getParameter(r.SCISSOR_BOX),ee=r.getParameter(r.VIEWPORT),ye=new Jt().fromArray(Y),De=new Jt().fromArray(ee);function Fe(q,Ce,Se,we){const Be=new Uint8Array(4),Te=r.createTexture();r.bindTexture(q,Te),r.texParameteri(q,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(q,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let Ze=0;Ze<Se;Ze++)q===r.TEXTURE_3D||q===r.TEXTURE_2D_ARRAY?r.texImage3D(Ce,0,r.RGBA,1,1,we,0,r.RGBA,r.UNSIGNED_BYTE,Be):r.texImage2D(Ce+Ze,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,Be);return Te}const re={};re[r.TEXTURE_2D]=Fe(r.TEXTURE_2D,r.TEXTURE_2D,1),re[r.TEXTURE_CUBE_MAP]=Fe(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[r.TEXTURE_2D_ARRAY]=Fe(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),re[r.TEXTURE_3D]=Fe(r.TEXTURE_3D,r.TEXTURE_3D,1,1),c.setClear(0,0,0,1),d.setClear(1),p.setClear(0),me(r.DEPTH_TEST),d.setFunc(nl),pt(!1),kt(a_),me(r.CULL_FACE),vt(Ea);function me(q){x[q]!==!0&&(r.enable(q),x[q]=!0)}function be(q){x[q]!==!1&&(r.disable(q),x[q]=!1)}function $e(q,Ce){return g[q]!==Ce?(r.bindFramebuffer(q,Ce),g[q]=Ce,q===r.DRAW_FRAMEBUFFER&&(g[r.FRAMEBUFFER]=Ce),q===r.FRAMEBUFFER&&(g[r.DRAW_FRAMEBUFFER]=Ce),!0):!1}function Oe(q,Ce){let Se=A,we=!1;if(q){Se=E.get(Ce),Se===void 0&&(Se=[],E.set(Ce,Se));const Be=q.textures;if(Se.length!==Be.length||Se[0]!==r.COLOR_ATTACHMENT0){for(let Te=0,Ze=Be.length;Te<Ze;Te++)Se[Te]=r.COLOR_ATTACHMENT0+Te;Se.length=Be.length,we=!0}}else Se[0]!==r.BACK&&(Se[0]=r.BACK,we=!0);we&&r.drawBuffers(Se)}function ot(q){return D!==q?(r.useProgram(q),D=q,!0):!1}const en={[Br]:r.FUNC_ADD,[uM]:r.FUNC_SUBTRACT,[fM]:r.FUNC_REVERSE_SUBTRACT};en[dM]=r.MIN,en[hM]=r.MAX;const it={[pM]:r.ZERO,[mM]:r.ONE,[gM]:r.SRC_COLOR,[rv]:r.SRC_ALPHA,[yM]:r.SRC_ALPHA_SATURATE,[SM]:r.DST_COLOR,[vM]:r.DST_ALPHA,[_M]:r.ONE_MINUS_SRC_COLOR,[ov]:r.ONE_MINUS_SRC_ALPHA,[MM]:r.ONE_MINUS_DST_COLOR,[xM]:r.ONE_MINUS_DST_ALPHA,[EM]:r.CONSTANT_COLOR,[TM]:r.ONE_MINUS_CONSTANT_COLOR,[bM]:r.CONSTANT_ALPHA,[AM]:r.ONE_MINUS_CONSTANT_ALPHA};function vt(q,Ce,Se,we,Be,Te,Ze,We,Bt,bt){if(q===Ea){y===!0&&(be(r.BLEND),y=!1);return}if(y===!1&&(me(r.BLEND),y=!0),q!==cM){if(q!==_||bt!==X){if((I!==Br||U!==Br)&&(r.blendEquation(r.FUNC_ADD),I=Br,U=Br),bt)switch(q){case el:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case s_:r.blendFunc(r.ONE,r.ONE);break;case r_:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case o_:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:wt("WebGLState: Invalid blending: ",q);break}else switch(q){case el:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case s_:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case r_:wt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case o_:wt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:wt("WebGLState: Invalid blending: ",q);break}O=null,w=null,P=null,F=null,T.set(0,0,0),z=0,_=q,X=bt}return}Be=Be||Ce,Te=Te||Se,Ze=Ze||we,(Ce!==I||Be!==U)&&(r.blendEquationSeparate(en[Ce],en[Be]),I=Ce,U=Be),(Se!==O||we!==w||Te!==P||Ze!==F)&&(r.blendFuncSeparate(it[Se],it[we],it[Te],it[Ze]),O=Se,w=we,P=Te,F=Ze),(We.equals(T)===!1||Bt!==z)&&(r.blendColor(We.r,We.g,We.b,Bt),T.copy(We),z=Bt),_=q,X=!1}function Lt(q,Ce){q.side===Oi?be(r.CULL_FACE):me(r.CULL_FACE);let Se=q.side===Vn;Ce&&(Se=!Se),pt(Se),q.blending===el&&q.transparent===!1?vt(Ea):vt(q.blending,q.blendEquation,q.blendSrc,q.blendDst,q.blendEquationAlpha,q.blendSrcAlpha,q.blendDstAlpha,q.blendColor,q.blendAlpha,q.premultipliedAlpha),d.setFunc(q.depthFunc),d.setTest(q.depthTest),d.setMask(q.depthWrite),c.setMask(q.colorWrite);const we=q.stencilWrite;p.setTest(we),we&&(p.setMask(q.stencilWriteMask),p.setFunc(q.stencilFunc,q.stencilRef,q.stencilFuncMask),p.setOp(q.stencilFail,q.stencilZFail,q.stencilZPass)),Mn(q.polygonOffset,q.polygonOffsetFactor,q.polygonOffsetUnits),q.alphaToCoverage===!0?me(r.SAMPLE_ALPHA_TO_COVERAGE):be(r.SAMPLE_ALPHA_TO_COVERAGE)}function pt(q){K!==q&&(q?r.frontFace(r.CW):r.frontFace(r.CCW),K=q)}function kt(q){q!==rM?(me(r.CULL_FACE),q!==j&&(q===a_?r.cullFace(r.BACK):q===oM?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):be(r.CULL_FACE),j=q}function tn(q){q!==oe&&(V&&r.lineWidth(q),oe=q)}function Mn(q,Ce,Se){q?(me(r.POLYGON_OFFSET_FILL),(Z!==Ce||ne!==Se)&&(Z=Ce,ne=Se,d.getReversed()&&(Ce=-Ce),r.polygonOffset(Ce,Se))):be(r.POLYGON_OFFSET_FILL)}function Xt(q){q?me(r.SCISSOR_TEST):be(r.SCISSOR_TEST)}function nn(q){q===void 0&&(q=r.TEXTURE0+N-1),H!==q&&(r.activeTexture(q),H=q)}function Q(q,Ce,Se){Se===void 0&&(H===null?Se=r.TEXTURE0+N-1:Se=H);let we=C[Se];we===void 0&&(we={type:void 0,texture:void 0},C[Se]=we),(we.type!==q||we.texture!==Ce)&&(H!==Se&&(r.activeTexture(Se),H=Se),r.bindTexture(q,Ce||re[q]),we.type=q,we.texture=Ce)}function Ot(){const q=C[H];q!==void 0&&q.type!==void 0&&(r.bindTexture(q.type,null),q.type=void 0,q.texture=void 0)}function Dt(){try{r.compressedTexImage2D(...arguments)}catch(q){wt("WebGLState:",q)}}function B(){try{r.compressedTexImage3D(...arguments)}catch(q){wt("WebGLState:",q)}}function M(){try{r.texSubImage2D(...arguments)}catch(q){wt("WebGLState:",q)}}function te(){try{r.texSubImage3D(...arguments)}catch(q){wt("WebGLState:",q)}}function ue(){try{r.compressedTexSubImage2D(...arguments)}catch(q){wt("WebGLState:",q)}}function ge(){try{r.compressedTexSubImage3D(...arguments)}catch(q){wt("WebGLState:",q)}}function Ae(){try{r.texStorage2D(...arguments)}catch(q){wt("WebGLState:",q)}}function Ne(){try{r.texStorage3D(...arguments)}catch(q){wt("WebGLState:",q)}}function _e(){try{r.texImage2D(...arguments)}catch(q){wt("WebGLState:",q)}}function ve(){try{r.texImage3D(...arguments)}catch(q){wt("WebGLState:",q)}}function Re(q){return S[q]!==void 0?S[q]:r.getParameter(q)}function Ve(q,Ce){S[q]!==Ce&&(r.pixelStorei(q,Ce),S[q]=Ce)}function Pe(q){ye.equals(q)===!1&&(r.scissor(q.x,q.y,q.z,q.w),ye.copy(q))}function Ue(q){De.equals(q)===!1&&(r.viewport(q.x,q.y,q.z,q.w),De.copy(q))}function Ke(q,Ce){let Se=h.get(Ce);Se===void 0&&(Se=new WeakMap,h.set(Ce,Se));let we=Se.get(q);we===void 0&&(we=r.getUniformBlockIndex(Ce,q.name),Se.set(q,we))}function Qe(q,Ce){const we=h.get(Ce).get(q);m.get(Ce)!==we&&(r.uniformBlockBinding(Ce,we,q.__bindingPointIndex),m.set(Ce,we))}function nt(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),d.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),x={},S={},H=null,C={},g={},E=new WeakMap,A=[],D=null,y=!1,_=null,I=null,O=null,w=null,U=null,P=null,F=null,T=new Mt(0,0,0),z=0,X=!1,K=null,j=null,oe=null,Z=null,ne=null,ye.set(0,0,r.canvas.width,r.canvas.height),De.set(0,0,r.canvas.width,r.canvas.height),c.reset(),d.reset(),p.reset()}return{buffers:{color:c,depth:d,stencil:p},enable:me,disable:be,bindFramebuffer:$e,drawBuffers:Oe,useProgram:ot,setBlending:vt,setMaterial:Lt,setFlipSided:pt,setCullFace:kt,setLineWidth:tn,setPolygonOffset:Mn,setScissorTest:Xt,activeTexture:nn,bindTexture:Q,unbindTexture:Ot,compressedTexImage2D:Dt,compressedTexImage3D:B,texImage2D:_e,texImage3D:ve,pixelStorei:Ve,getParameter:Re,updateUBOMapping:Ke,uniformBlockBinding:Qe,texStorage2D:Ae,texStorage3D:Ne,texSubImage2D:M,texSubImage3D:te,compressedTexSubImage2D:ue,compressedTexSubImage3D:ge,scissor:Pe,viewport:Ue,reset:nt}}function v1(r,e,i,s,l,c,d){const p=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,m=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new _t,x=new WeakMap,S=new Set;let g;const E=new WeakMap;let A=!1;try{A=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function D(B,M){return A?new OffscreenCanvas(B,M):iu("canvas")}function y(B,M,te){let ue=1;const ge=Dt(B);if((ge.width>te||ge.height>te)&&(ue=te/Math.max(ge.width,ge.height)),ue<1)if(typeof HTMLImageElement<"u"&&B instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&B instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&B instanceof ImageBitmap||typeof VideoFrame<"u"&&B instanceof VideoFrame){const Ae=Math.floor(ue*ge.width),Ne=Math.floor(ue*ge.height);g===void 0&&(g=D(Ae,Ne));const _e=M?D(Ae,Ne):g;return _e.width=Ae,_e.height=Ne,_e.getContext("2d").drawImage(B,0,0,Ae,Ne),tt("WebGLRenderer: Texture has been resized from ("+ge.width+"x"+ge.height+") to ("+Ae+"x"+Ne+")."),_e}else return"data"in B&&tt("WebGLRenderer: Image in DataTexture is too big ("+ge.width+"x"+ge.height+")."),B;return B}function _(B){return B.generateMipmaps}function I(B){r.generateMipmap(B)}function O(B){return B.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:B.isWebGL3DRenderTarget?r.TEXTURE_3D:B.isWebGLArrayRenderTarget||B.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function w(B,M,te,ue,ge,Ae=!1){if(B!==null){if(r[B]!==void 0)return r[B];tt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+B+"'")}let Ne;ue&&(Ne=e.get("EXT_texture_norm16"),Ne||tt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let _e=M;if(M===r.RED&&(te===r.FLOAT&&(_e=r.R32F),te===r.HALF_FLOAT&&(_e=r.R16F),te===r.UNSIGNED_BYTE&&(_e=r.R8),te===r.UNSIGNED_SHORT&&Ne&&(_e=Ne.R16_EXT),te===r.SHORT&&Ne&&(_e=Ne.R16_SNORM_EXT)),M===r.RED_INTEGER&&(te===r.UNSIGNED_BYTE&&(_e=r.R8UI),te===r.UNSIGNED_SHORT&&(_e=r.R16UI),te===r.UNSIGNED_INT&&(_e=r.R32UI),te===r.BYTE&&(_e=r.R8I),te===r.SHORT&&(_e=r.R16I),te===r.INT&&(_e=r.R32I)),M===r.RG&&(te===r.FLOAT&&(_e=r.RG32F),te===r.HALF_FLOAT&&(_e=r.RG16F),te===r.UNSIGNED_BYTE&&(_e=r.RG8),te===r.UNSIGNED_SHORT&&Ne&&(_e=Ne.RG16_EXT),te===r.SHORT&&Ne&&(_e=Ne.RG16_SNORM_EXT)),M===r.RG_INTEGER&&(te===r.UNSIGNED_BYTE&&(_e=r.RG8UI),te===r.UNSIGNED_SHORT&&(_e=r.RG16UI),te===r.UNSIGNED_INT&&(_e=r.RG32UI),te===r.BYTE&&(_e=r.RG8I),te===r.SHORT&&(_e=r.RG16I),te===r.INT&&(_e=r.RG32I)),M===r.RGB_INTEGER&&(te===r.UNSIGNED_BYTE&&(_e=r.RGB8UI),te===r.UNSIGNED_SHORT&&(_e=r.RGB16UI),te===r.UNSIGNED_INT&&(_e=r.RGB32UI),te===r.BYTE&&(_e=r.RGB8I),te===r.SHORT&&(_e=r.RGB16I),te===r.INT&&(_e=r.RGB32I)),M===r.RGBA_INTEGER&&(te===r.UNSIGNED_BYTE&&(_e=r.RGBA8UI),te===r.UNSIGNED_SHORT&&(_e=r.RGBA16UI),te===r.UNSIGNED_INT&&(_e=r.RGBA32UI),te===r.BYTE&&(_e=r.RGBA8I),te===r.SHORT&&(_e=r.RGBA16I),te===r.INT&&(_e=r.RGBA32I)),M===r.RGB&&(te===r.UNSIGNED_SHORT&&Ne&&(_e=Ne.RGB16_EXT),te===r.SHORT&&Ne&&(_e=Ne.RGB16_SNORM_EXT),te===r.UNSIGNED_INT_5_9_9_9_REV&&(_e=r.RGB9_E5),te===r.UNSIGNED_INT_10F_11F_11F_REV&&(_e=r.R11F_G11F_B10F)),M===r.RGBA){const ve=Ae?nu:Et.getTransfer(ge);te===r.FLOAT&&(_e=r.RGBA32F),te===r.HALF_FLOAT&&(_e=r.RGBA16F),te===r.UNSIGNED_BYTE&&(_e=ve===zt?r.SRGB8_ALPHA8:r.RGBA8),te===r.UNSIGNED_SHORT&&Ne&&(_e=Ne.RGBA16_EXT),te===r.SHORT&&Ne&&(_e=Ne.RGBA16_SNORM_EXT),te===r.UNSIGNED_SHORT_4_4_4_4&&(_e=r.RGBA4),te===r.UNSIGNED_SHORT_5_5_5_1&&(_e=r.RGB5_A1)}return(_e===r.R16F||_e===r.R32F||_e===r.RG16F||_e===r.RG32F||_e===r.RGBA16F||_e===r.RGBA32F)&&e.get("EXT_color_buffer_float"),_e}function U(B,M){let te;return B?M===null||M===Ki||M===al?te=r.DEPTH24_STENCIL8:M===qi?te=r.DEPTH32F_STENCIL8:M===il&&(te=r.DEPTH24_STENCIL8,tt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===Ki||M===al?te=r.DEPTH_COMPONENT24:M===qi?te=r.DEPTH_COMPONENT32F:M===il&&(te=r.DEPTH_COMPONENT16),te}function P(B,M){return _(B)===!0||B.isFramebufferTexture&&B.minFilter!==Un&&B.minFilter!==In?Math.log2(Math.max(M.width,M.height))+1:B.mipmaps!==void 0&&B.mipmaps.length>0?B.mipmaps.length:B.isCompressedTexture&&Array.isArray(B.image)?M.mipmaps.length:1}function F(B){const M=B.target;M.removeEventListener("dispose",F),z(M),M.isVideoTexture&&x.delete(M),M.isHTMLTexture&&S.delete(M)}function T(B){const M=B.target;M.removeEventListener("dispose",T),K(M)}function z(B){const M=s.get(B);if(M.__webglInit===void 0)return;const te=B.source,ue=E.get(te);if(ue){const ge=ue[M.__cacheKey];ge.usedTimes--,ge.usedTimes===0&&X(B),Object.keys(ue).length===0&&E.delete(te)}s.remove(B)}function X(B){const M=s.get(B);r.deleteTexture(M.__webglTexture);const te=B.source,ue=E.get(te);delete ue[M.__cacheKey],d.memory.textures--}function K(B){const M=s.get(B);if(B.depthTexture&&(B.depthTexture.dispose(),s.remove(B.depthTexture)),B.isWebGLCubeRenderTarget)for(let ue=0;ue<6;ue++){if(Array.isArray(M.__webglFramebuffer[ue]))for(let ge=0;ge<M.__webglFramebuffer[ue].length;ge++)r.deleteFramebuffer(M.__webglFramebuffer[ue][ge]);else r.deleteFramebuffer(M.__webglFramebuffer[ue]);M.__webglDepthbuffer&&r.deleteRenderbuffer(M.__webglDepthbuffer[ue])}else{if(Array.isArray(M.__webglFramebuffer))for(let ue=0;ue<M.__webglFramebuffer.length;ue++)r.deleteFramebuffer(M.__webglFramebuffer[ue]);else r.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&r.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&r.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let ue=0;ue<M.__webglColorRenderbuffer.length;ue++)M.__webglColorRenderbuffer[ue]&&r.deleteRenderbuffer(M.__webglColorRenderbuffer[ue]);M.__webglDepthRenderbuffer&&r.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const te=B.textures;for(let ue=0,ge=te.length;ue<ge;ue++){const Ae=s.get(te[ue]);Ae.__webglTexture&&(r.deleteTexture(Ae.__webglTexture),d.memory.textures--),s.remove(te[ue])}s.remove(B)}let j=0;function oe(){j=0}function Z(){return j}function ne(B){j=B}function N(){const B=j;return B>=l.maxTextures&&tt("WebGLTextures: Trying to use "+(B+1)+" texture units while this GPU supports only "+l.maxTextures),j+=1,B}function V(B){const M=[];return M.push(B.wrapS),M.push(B.wrapT),M.push(B.wrapR||0),M.push(B.magFilter),M.push(B.minFilter),M.push(B.anisotropy),M.push(B.internalFormat),M.push(B.format),M.push(B.type),M.push(B.generateMipmaps),M.push(B.premultiplyAlpha),M.push(B.flipY),M.push(B.unpackAlignment),M.push(B.colorSpace),M.join()}function fe(B,M){const te=s.get(B);if(B.isVideoTexture&&Q(B),B.isRenderTargetTexture===!1&&B.isExternalTexture!==!0&&B.version>0&&te.__version!==B.version){const ue=B.image;if(ue===null)tt("WebGLRenderer: Texture marked for update but no image data found.");else if(ue.complete===!1)tt("WebGLRenderer: Texture marked for update but image is incomplete");else{be(te,B,M);return}}else B.isExternalTexture&&(te.__webglTexture=B.sourceTexture?B.sourceTexture:null);i.bindTexture(r.TEXTURE_2D,te.__webglTexture,r.TEXTURE0+M)}function se(B,M){const te=s.get(B);if(B.isRenderTargetTexture===!1&&B.version>0&&te.__version!==B.version){be(te,B,M);return}else B.isExternalTexture&&(te.__webglTexture=B.sourceTexture?B.sourceTexture:null);i.bindTexture(r.TEXTURE_2D_ARRAY,te.__webglTexture,r.TEXTURE0+M)}function H(B,M){const te=s.get(B);if(B.isRenderTargetTexture===!1&&B.version>0&&te.__version!==B.version){be(te,B,M);return}i.bindTexture(r.TEXTURE_3D,te.__webglTexture,r.TEXTURE0+M)}function C(B,M){const te=s.get(B);if(B.isCubeDepthTexture!==!0&&B.version>0&&te.__version!==B.version){$e(te,B,M);return}i.bindTexture(r.TEXTURE_CUBE_MAP,te.__webglTexture,r.TEXTURE0+M)}const Y={[hh]:r.REPEAT,[ya]:r.CLAMP_TO_EDGE,[ph]:r.MIRRORED_REPEAT},ee={[Un]:r.NEAREST,[wM]:r.NEAREST_MIPMAP_NEAREST,[yc]:r.NEAREST_MIPMAP_LINEAR,[In]:r.LINEAR,[Rd]:r.LINEAR_MIPMAP_NEAREST,[Is]:r.LINEAR_MIPMAP_LINEAR},ye={[LM]:r.NEVER,[BM]:r.ALWAYS,[OM]:r.LESS,[ap]:r.LEQUAL,[PM]:r.EQUAL,[sp]:r.GEQUAL,[IM]:r.GREATER,[zM]:r.NOTEQUAL};function De(B,M){if(M.type===qi&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===In||M.magFilter===Rd||M.magFilter===yc||M.magFilter===Is||M.minFilter===In||M.minFilter===Rd||M.minFilter===yc||M.minFilter===Is)&&tt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(B,r.TEXTURE_WRAP_S,Y[M.wrapS]),r.texParameteri(B,r.TEXTURE_WRAP_T,Y[M.wrapT]),(B===r.TEXTURE_3D||B===r.TEXTURE_2D_ARRAY)&&r.texParameteri(B,r.TEXTURE_WRAP_R,Y[M.wrapR]),r.texParameteri(B,r.TEXTURE_MAG_FILTER,ee[M.magFilter]),r.texParameteri(B,r.TEXTURE_MIN_FILTER,ee[M.minFilter]),M.compareFunction&&(r.texParameteri(B,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(B,r.TEXTURE_COMPARE_FUNC,ye[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Un||M.minFilter!==yc&&M.minFilter!==Is||M.type===qi&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||s.get(M).__currentAnisotropy){const te=e.get("EXT_texture_filter_anisotropic");r.texParameterf(B,te.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,l.getMaxAnisotropy())),s.get(M).__currentAnisotropy=M.anisotropy}}}function Fe(B,M){let te=!1;B.__webglInit===void 0&&(B.__webglInit=!0,M.addEventListener("dispose",F));const ue=M.source;let ge=E.get(ue);ge===void 0&&(ge={},E.set(ue,ge));const Ae=V(M);if(Ae!==B.__cacheKey){ge[Ae]===void 0&&(ge[Ae]={texture:r.createTexture(),usedTimes:0},d.memory.textures++,te=!0),ge[Ae].usedTimes++;const Ne=ge[B.__cacheKey];Ne!==void 0&&(ge[B.__cacheKey].usedTimes--,Ne.usedTimes===0&&X(M)),B.__cacheKey=Ae,B.__webglTexture=ge[Ae].texture}return te}function re(B,M,te){return Math.floor(Math.floor(B/te)/M)}function me(B,M,te,ue){const Ae=B.updateRanges;if(Ae.length===0)i.texSubImage2D(r.TEXTURE_2D,0,0,0,M.width,M.height,te,ue,M.data);else{Ae.sort((Ve,Pe)=>Ve.start-Pe.start);let Ne=0;for(let Ve=1;Ve<Ae.length;Ve++){const Pe=Ae[Ne],Ue=Ae[Ve],Ke=Pe.start+Pe.count,Qe=re(Ue.start,M.width,4),nt=re(Pe.start,M.width,4);Ue.start<=Ke+1&&Qe===nt&&re(Ue.start+Ue.count-1,M.width,4)===Qe?Pe.count=Math.max(Pe.count,Ue.start+Ue.count-Pe.start):(++Ne,Ae[Ne]=Ue)}Ae.length=Ne+1;const _e=i.getParameter(r.UNPACK_ROW_LENGTH),ve=i.getParameter(r.UNPACK_SKIP_PIXELS),Re=i.getParameter(r.UNPACK_SKIP_ROWS);i.pixelStorei(r.UNPACK_ROW_LENGTH,M.width);for(let Ve=0,Pe=Ae.length;Ve<Pe;Ve++){const Ue=Ae[Ve],Ke=Math.floor(Ue.start/4),Qe=Math.ceil(Ue.count/4),nt=Ke%M.width,q=Math.floor(Ke/M.width),Ce=Qe,Se=1;i.pixelStorei(r.UNPACK_SKIP_PIXELS,nt),i.pixelStorei(r.UNPACK_SKIP_ROWS,q),i.texSubImage2D(r.TEXTURE_2D,0,nt,q,Ce,Se,te,ue,M.data)}B.clearUpdateRanges(),i.pixelStorei(r.UNPACK_ROW_LENGTH,_e),i.pixelStorei(r.UNPACK_SKIP_PIXELS,ve),i.pixelStorei(r.UNPACK_SKIP_ROWS,Re)}}function be(B,M,te){let ue=r.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(ue=r.TEXTURE_2D_ARRAY),M.isData3DTexture&&(ue=r.TEXTURE_3D);const ge=Fe(B,M),Ae=M.source;i.bindTexture(ue,B.__webglTexture,r.TEXTURE0+te);const Ne=s.get(Ae);if(Ae.version!==Ne.__version||ge===!0){if(i.activeTexture(r.TEXTURE0+te),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const Se=Et.getPrimaries(Et.workingColorSpace),we=M.colorSpace===os?null:Et.getPrimaries(M.colorSpace),Be=M.colorSpace===os||Se===we?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Be)}i.pixelStorei(r.UNPACK_ALIGNMENT,M.unpackAlignment);let ve=y(M.image,!1,l.maxTextureSize);ve=Ot(M,ve);const Re=c.convert(M.format,M.colorSpace),Ve=c.convert(M.type);let Pe=w(M.internalFormat,Re,Ve,M.normalized,M.colorSpace,M.isVideoTexture);De(ue,M);let Ue;const Ke=M.mipmaps,Qe=M.isVideoTexture!==!0,nt=Ne.__version===void 0||ge===!0,q=Ae.dataReady,Ce=P(M,ve);if(M.isDepthTexture)Pe=U(M.format===zs,M.type),nt&&(Qe?i.texStorage2D(r.TEXTURE_2D,1,Pe,ve.width,ve.height):i.texImage2D(r.TEXTURE_2D,0,Pe,ve.width,ve.height,0,Re,Ve,null));else if(M.isDataTexture)if(Ke.length>0){Qe&&nt&&i.texStorage2D(r.TEXTURE_2D,Ce,Pe,Ke[0].width,Ke[0].height);for(let Se=0,we=Ke.length;Se<we;Se++)Ue=Ke[Se],Qe?q&&i.texSubImage2D(r.TEXTURE_2D,Se,0,0,Ue.width,Ue.height,Re,Ve,Ue.data):i.texImage2D(r.TEXTURE_2D,Se,Pe,Ue.width,Ue.height,0,Re,Ve,Ue.data);M.generateMipmaps=!1}else Qe?(nt&&i.texStorage2D(r.TEXTURE_2D,Ce,Pe,ve.width,ve.height),q&&me(M,ve,Re,Ve)):i.texImage2D(r.TEXTURE_2D,0,Pe,ve.width,ve.height,0,Re,Ve,ve.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){Qe&&nt&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ce,Pe,Ke[0].width,Ke[0].height,ve.depth);for(let Se=0,we=Ke.length;Se<we;Se++)if(Ue=Ke[Se],M.format!==Ii)if(Re!==null)if(Qe){if(q)if(M.layerUpdates.size>0){const Be=P_(Ue.width,Ue.height,M.format,M.type);for(const Te of M.layerUpdates){const Ze=Ue.data.subarray(Te*Be/Ue.data.BYTES_PER_ELEMENT,(Te+1)*Be/Ue.data.BYTES_PER_ELEMENT);i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Se,0,0,Te,Ue.width,Ue.height,1,Re,Ze)}}else i.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Se,0,0,0,Ue.width,Ue.height,ve.depth,Re,Ue.data)}else i.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Se,Pe,Ue.width,Ue.height,ve.depth,0,Ue.data,0,0);else tt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Qe?q&&i.texSubImage3D(r.TEXTURE_2D_ARRAY,Se,0,0,0,Ue.width,Ue.height,ve.depth,Re,Ve,Ue.data):i.texImage3D(r.TEXTURE_2D_ARRAY,Se,Pe,Ue.width,Ue.height,ve.depth,0,Re,Ve,Ue.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{Qe&&nt&&i.texStorage2D(r.TEXTURE_2D,Ce,Pe,Ke[0].width,Ke[0].height);for(let Se=0,we=Ke.length;Se<we;Se++)Ue=Ke[Se],M.format!==Ii?Re!==null?Qe?q&&i.compressedTexSubImage2D(r.TEXTURE_2D,Se,0,0,Ue.width,Ue.height,Re,Ue.data):i.compressedTexImage2D(r.TEXTURE_2D,Se,Pe,Ue.width,Ue.height,0,Ue.data):tt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Qe?q&&i.texSubImage2D(r.TEXTURE_2D,Se,0,0,Ue.width,Ue.height,Re,Ve,Ue.data):i.texImage2D(r.TEXTURE_2D,Se,Pe,Ue.width,Ue.height,0,Re,Ve,Ue.data)}else if(M.isDataArrayTexture)if(Qe){if(nt&&i.texStorage3D(r.TEXTURE_2D_ARRAY,Ce,Pe,ve.width,ve.height,ve.depth),q)if(M.layerUpdates.size>0){const Se=P_(ve.width,ve.height,M.format,M.type);for(const we of M.layerUpdates){const Be=ve.data.subarray(we*Se/ve.data.BYTES_PER_ELEMENT,(we+1)*Se/ve.data.BYTES_PER_ELEMENT);i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,we,ve.width,ve.height,1,Re,Ve,Be)}M.clearLayerUpdates()}else i.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,ve.width,ve.height,ve.depth,Re,Ve,ve.data)}else i.texImage3D(r.TEXTURE_2D_ARRAY,0,Pe,ve.width,ve.height,ve.depth,0,Re,Ve,ve.data);else if(M.isData3DTexture)Qe?(nt&&i.texStorage3D(r.TEXTURE_3D,Ce,Pe,ve.width,ve.height,ve.depth),q&&i.texSubImage3D(r.TEXTURE_3D,0,0,0,0,ve.width,ve.height,ve.depth,Re,Ve,ve.data)):i.texImage3D(r.TEXTURE_3D,0,Pe,ve.width,ve.height,ve.depth,0,Re,Ve,ve.data);else if(M.isFramebufferTexture){if(nt)if(Qe)i.texStorage2D(r.TEXTURE_2D,Ce,Pe,ve.width,ve.height);else{let Se=ve.width,we=ve.height;for(let Be=0;Be<Ce;Be++)i.texImage2D(r.TEXTURE_2D,Be,Pe,Se,we,0,Re,Ve,null),Se>>=1,we>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in r){const Se=r.canvas;if(Se.hasAttribute("layoutsubtree")||Se.setAttribute("layoutsubtree","true"),ve.parentNode!==Se){Se.appendChild(ve),S.add(M),Se.onpaint=we=>{const Be=we.changedElements;for(const Te of S)Be.includes(Te.image)&&(Te.needsUpdate=!0)},Se.requestPaint();return}if(r.texElementImage2D.length===3)r.texElementImage2D(r.TEXTURE_2D,r.RGBA8,ve);else{const Be=r.RGBA,Te=r.RGBA,Ze=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,0,Be,Te,Ze,ve)}r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(Ke.length>0){if(Qe&&nt){const Se=Dt(Ke[0]);i.texStorage2D(r.TEXTURE_2D,Ce,Pe,Se.width,Se.height)}for(let Se=0,we=Ke.length;Se<we;Se++)Ue=Ke[Se],Qe?q&&i.texSubImage2D(r.TEXTURE_2D,Se,0,0,Re,Ve,Ue):i.texImage2D(r.TEXTURE_2D,Se,Pe,Re,Ve,Ue);M.generateMipmaps=!1}else if(Qe){if(nt){const Se=Dt(ve);i.texStorage2D(r.TEXTURE_2D,Ce,Pe,Se.width,Se.height)}q&&i.texSubImage2D(r.TEXTURE_2D,0,0,0,Re,Ve,ve)}else i.texImage2D(r.TEXTURE_2D,0,Pe,Re,Ve,ve);_(M)&&I(ue),Ne.__version=Ae.version,M.onUpdate&&M.onUpdate(M)}B.__version=M.version}function $e(B,M,te){if(M.image.length!==6)return;const ue=Fe(B,M),ge=M.source;i.bindTexture(r.TEXTURE_CUBE_MAP,B.__webglTexture,r.TEXTURE0+te);const Ae=s.get(ge);if(ge.version!==Ae.__version||ue===!0){i.activeTexture(r.TEXTURE0+te);const Ne=Et.getPrimaries(Et.workingColorSpace),_e=M.colorSpace===os?null:Et.getPrimaries(M.colorSpace),ve=M.colorSpace===os||Ne===_e?r.NONE:r.BROWSER_DEFAULT_WEBGL;i.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(r.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const Re=M.isCompressedTexture||M.image[0].isCompressedTexture,Ve=M.image[0]&&M.image[0].isDataTexture,Pe=[];for(let Te=0;Te<6;Te++)!Re&&!Ve?Pe[Te]=y(M.image[Te],!0,l.maxCubemapSize):Pe[Te]=Ve?M.image[Te].image:M.image[Te],Pe[Te]=Ot(M,Pe[Te]);const Ue=Pe[0],Ke=c.convert(M.format,M.colorSpace),Qe=c.convert(M.type),nt=w(M.internalFormat,Ke,Qe,M.normalized,M.colorSpace),q=M.isVideoTexture!==!0,Ce=Ae.__version===void 0||ue===!0,Se=ge.dataReady;let we=P(M,Ue);De(r.TEXTURE_CUBE_MAP,M);let Be;if(Re){q&&Ce&&i.texStorage2D(r.TEXTURE_CUBE_MAP,we,nt,Ue.width,Ue.height);for(let Te=0;Te<6;Te++){Be=Pe[Te].mipmaps;for(let Ze=0;Ze<Be.length;Ze++){const We=Be[Ze];M.format!==Ii?Ke!==null?q?Se&&i.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze,0,0,We.width,We.height,Ke,We.data):i.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze,nt,We.width,We.height,0,We.data):tt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):q?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze,0,0,We.width,We.height,Ke,Qe,We.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze,nt,We.width,We.height,0,Ke,Qe,We.data)}}}else{if(Be=M.mipmaps,q&&Ce){Be.length>0&&we++;const Te=Dt(Pe[0]);i.texStorage2D(r.TEXTURE_CUBE_MAP,we,nt,Te.width,Te.height)}for(let Te=0;Te<6;Te++)if(Ve){q?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,Pe[Te].width,Pe[Te].height,Ke,Qe,Pe[Te].data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,nt,Pe[Te].width,Pe[Te].height,0,Ke,Qe,Pe[Te].data);for(let Ze=0;Ze<Be.length;Ze++){const Bt=Be[Ze].image[Te].image;q?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze+1,0,0,Bt.width,Bt.height,Ke,Qe,Bt.data):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze+1,nt,Bt.width,Bt.height,0,Ke,Qe,Bt.data)}}else{q?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,0,0,Ke,Qe,Pe[Te]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,0,nt,Ke,Qe,Pe[Te]);for(let Ze=0;Ze<Be.length;Ze++){const We=Be[Ze];q?Se&&i.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze+1,0,0,Ke,Qe,We.image[Te]):i.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Te,Ze+1,nt,Ke,Qe,We.image[Te])}}}_(M)&&I(r.TEXTURE_CUBE_MAP),Ae.__version=ge.version,M.onUpdate&&M.onUpdate(M)}B.__version=M.version}function Oe(B,M,te,ue,ge,Ae){const Ne=c.convert(te.format,te.colorSpace),_e=c.convert(te.type),ve=w(te.internalFormat,Ne,_e,te.normalized,te.colorSpace),Re=s.get(M),Ve=s.get(te);if(Ve.__renderTarget=M,!Re.__hasExternalTextures){const Pe=Math.max(1,M.width>>Ae),Ue=Math.max(1,M.height>>Ae);ge===r.TEXTURE_3D||ge===r.TEXTURE_2D_ARRAY?i.texImage3D(ge,Ae,ve,Pe,Ue,M.depth,0,Ne,_e,null):i.texImage2D(ge,Ae,ve,Pe,Ue,0,Ne,_e,null)}i.bindFramebuffer(r.FRAMEBUFFER,B),nn(M)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ue,ge,Ve.__webglTexture,0,Xt(M)):(ge===r.TEXTURE_2D||ge>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&ge<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,ue,ge,Ve.__webglTexture,Ae),i.bindFramebuffer(r.FRAMEBUFFER,null)}function ot(B,M,te){if(r.bindRenderbuffer(r.RENDERBUFFER,B),M.depthBuffer){const ue=M.depthTexture,ge=ue&&ue.isDepthTexture?ue.type:null,Ae=U(M.stencilBuffer,ge),Ne=M.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;nn(M)?p.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Xt(M),Ae,M.width,M.height):te?r.renderbufferStorageMultisample(r.RENDERBUFFER,Xt(M),Ae,M.width,M.height):r.renderbufferStorage(r.RENDERBUFFER,Ae,M.width,M.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Ne,r.RENDERBUFFER,B)}else{const ue=M.textures;for(let ge=0;ge<ue.length;ge++){const Ae=ue[ge],Ne=c.convert(Ae.format,Ae.colorSpace),_e=c.convert(Ae.type),ve=w(Ae.internalFormat,Ne,_e,Ae.normalized,Ae.colorSpace);nn(M)?p.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Xt(M),ve,M.width,M.height):te?r.renderbufferStorageMultisample(r.RENDERBUFFER,Xt(M),ve,M.width,M.height):r.renderbufferStorage(r.RENDERBUFFER,ve,M.width,M.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function en(B,M,te){const ue=M.isWebGLCubeRenderTarget===!0;if(i.bindFramebuffer(r.FRAMEBUFFER,B),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const ge=s.get(M.depthTexture);if(ge.__renderTarget=M,(!ge.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),ue){if(ge.__webglInit===void 0&&(ge.__webglInit=!0,M.depthTexture.addEventListener("dispose",F)),ge.__webglTexture===void 0){ge.__webglTexture=r.createTexture(),i.bindTexture(r.TEXTURE_CUBE_MAP,ge.__webglTexture),De(r.TEXTURE_CUBE_MAP,M.depthTexture);const Re=c.convert(M.depthTexture.format),Ve=c.convert(M.depthTexture.type);let Pe;M.depthTexture.format===Aa?Pe=r.DEPTH_COMPONENT24:M.depthTexture.format===zs&&(Pe=r.DEPTH24_STENCIL8);for(let Ue=0;Ue<6;Ue++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+Ue,0,Pe,M.width,M.height,0,Re,Ve,null)}}else fe(M.depthTexture,0);const Ae=ge.__webglTexture,Ne=Xt(M),_e=ue?r.TEXTURE_CUBE_MAP_POSITIVE_X+te:r.TEXTURE_2D,ve=M.depthTexture.format===zs?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(M.depthTexture.format===Aa)nn(M)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ve,_e,Ae,0,Ne):r.framebufferTexture2D(r.FRAMEBUFFER,ve,_e,Ae,0);else if(M.depthTexture.format===zs)nn(M)?p.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,ve,_e,Ae,0,Ne):r.framebufferTexture2D(r.FRAMEBUFFER,ve,_e,Ae,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function it(B){const M=s.get(B),te=B.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==B.depthTexture){const ue=B.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),ue){const ge=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,ue.removeEventListener("dispose",ge)};ue.addEventListener("dispose",ge),M.__depthDisposeCallback=ge}M.__boundDepthTexture=ue}if(B.depthTexture&&!M.__autoAllocateDepthBuffer)if(te)for(let ue=0;ue<6;ue++)en(M.__webglFramebuffer[ue],B,ue);else{const ue=B.texture.mipmaps;ue&&ue.length>0?en(M.__webglFramebuffer[0],B,0):en(M.__webglFramebuffer,B,0)}else if(te){M.__webglDepthbuffer=[];for(let ue=0;ue<6;ue++)if(i.bindFramebuffer(r.FRAMEBUFFER,M.__webglFramebuffer[ue]),M.__webglDepthbuffer[ue]===void 0)M.__webglDepthbuffer[ue]=r.createRenderbuffer(),ot(M.__webglDepthbuffer[ue],B,!1);else{const ge=B.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ae=M.__webglDepthbuffer[ue];r.bindRenderbuffer(r.RENDERBUFFER,Ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,ge,r.RENDERBUFFER,Ae)}}else{const ue=B.texture.mipmaps;if(ue&&ue.length>0?i.bindFramebuffer(r.FRAMEBUFFER,M.__webglFramebuffer[0]):i.bindFramebuffer(r.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=r.createRenderbuffer(),ot(M.__webglDepthbuffer,B,!1);else{const ge=B.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ae=M.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,Ae),r.framebufferRenderbuffer(r.FRAMEBUFFER,ge,r.RENDERBUFFER,Ae)}}i.bindFramebuffer(r.FRAMEBUFFER,null)}function vt(B,M,te){const ue=s.get(B);M!==void 0&&Oe(ue.__webglFramebuffer,B,B.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),te!==void 0&&it(B)}function Lt(B){const M=B.texture,te=s.get(B),ue=s.get(M);B.addEventListener("dispose",T);const ge=B.textures,Ae=B.isWebGLCubeRenderTarget===!0,Ne=ge.length>1;if(Ne||(ue.__webglTexture===void 0&&(ue.__webglTexture=r.createTexture()),ue.__version=M.version,d.memory.textures++),Ae){te.__webglFramebuffer=[];for(let _e=0;_e<6;_e++)if(M.mipmaps&&M.mipmaps.length>0){te.__webglFramebuffer[_e]=[];for(let ve=0;ve<M.mipmaps.length;ve++)te.__webglFramebuffer[_e][ve]=r.createFramebuffer()}else te.__webglFramebuffer[_e]=r.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){te.__webglFramebuffer=[];for(let _e=0;_e<M.mipmaps.length;_e++)te.__webglFramebuffer[_e]=r.createFramebuffer()}else te.__webglFramebuffer=r.createFramebuffer();if(Ne)for(let _e=0,ve=ge.length;_e<ve;_e++){const Re=s.get(ge[_e]);Re.__webglTexture===void 0&&(Re.__webglTexture=r.createTexture(),d.memory.textures++)}if(B.samples>0&&nn(B)===!1){te.__webglMultisampledFramebuffer=r.createFramebuffer(),te.__webglColorRenderbuffer=[],i.bindFramebuffer(r.FRAMEBUFFER,te.__webglMultisampledFramebuffer);for(let _e=0;_e<ge.length;_e++){const ve=ge[_e];te.__webglColorRenderbuffer[_e]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,te.__webglColorRenderbuffer[_e]);const Re=c.convert(ve.format,ve.colorSpace),Ve=c.convert(ve.type),Pe=w(ve.internalFormat,Re,Ve,ve.normalized,ve.colorSpace,B.isXRRenderTarget===!0),Ue=Xt(B);r.renderbufferStorageMultisample(r.RENDERBUFFER,Ue,Pe,B.width,B.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+_e,r.RENDERBUFFER,te.__webglColorRenderbuffer[_e])}r.bindRenderbuffer(r.RENDERBUFFER,null),B.depthBuffer&&(te.__webglDepthRenderbuffer=r.createRenderbuffer(),ot(te.__webglDepthRenderbuffer,B,!0)),i.bindFramebuffer(r.FRAMEBUFFER,null)}}if(Ae){i.bindTexture(r.TEXTURE_CUBE_MAP,ue.__webglTexture),De(r.TEXTURE_CUBE_MAP,M);for(let _e=0;_e<6;_e++)if(M.mipmaps&&M.mipmaps.length>0)for(let ve=0;ve<M.mipmaps.length;ve++)Oe(te.__webglFramebuffer[_e][ve],B,M,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,ve);else Oe(te.__webglFramebuffer[_e],B,M,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0);_(M)&&I(r.TEXTURE_CUBE_MAP),i.unbindTexture()}else if(Ne){for(let _e=0,ve=ge.length;_e<ve;_e++){const Re=ge[_e],Ve=s.get(Re);let Pe=r.TEXTURE_2D;(B.isWebGL3DRenderTarget||B.isWebGLArrayRenderTarget)&&(Pe=B.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(Pe,Ve.__webglTexture),De(Pe,Re),Oe(te.__webglFramebuffer,B,Re,r.COLOR_ATTACHMENT0+_e,Pe,0),_(Re)&&I(Pe)}i.unbindTexture()}else{let _e=r.TEXTURE_2D;if((B.isWebGL3DRenderTarget||B.isWebGLArrayRenderTarget)&&(_e=B.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),i.bindTexture(_e,ue.__webglTexture),De(_e,M),M.mipmaps&&M.mipmaps.length>0)for(let ve=0;ve<M.mipmaps.length;ve++)Oe(te.__webglFramebuffer[ve],B,M,r.COLOR_ATTACHMENT0,_e,ve);else Oe(te.__webglFramebuffer,B,M,r.COLOR_ATTACHMENT0,_e,0);_(M)&&I(_e),i.unbindTexture()}B.depthBuffer&&it(B)}function pt(B){const M=B.textures;for(let te=0,ue=M.length;te<ue;te++){const ge=M[te];if(_(ge)){const Ae=O(B),Ne=s.get(ge).__webglTexture;i.bindTexture(Ae,Ne),I(Ae),i.unbindTexture()}}}const kt=[],tn=[];function Mn(B){if(B.samples>0){if(nn(B)===!1){const M=B.textures,te=B.width,ue=B.height;let ge=r.COLOR_BUFFER_BIT;const Ae=B.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Ne=s.get(B),_e=M.length>1;if(_e)for(let Re=0;Re<M.length;Re++)i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.RENDERBUFFER,null),i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.TEXTURE_2D,null,0);i.bindFramebuffer(r.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);const ve=B.texture.mipmaps;ve&&ve.length>0?i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let Re=0;Re<M.length;Re++){if(B.resolveDepthBuffer&&(B.depthBuffer&&(ge|=r.DEPTH_BUFFER_BIT),B.stencilBuffer&&B.resolveStencilBuffer&&(ge|=r.STENCIL_BUFFER_BIT)),_e){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Ne.__webglColorRenderbuffer[Re]);const Ve=s.get(M[Re]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Ve,0)}r.blitFramebuffer(0,0,te,ue,0,0,te,ue,ge,r.NEAREST),m===!0&&(kt.length=0,tn.length=0,kt.push(r.COLOR_ATTACHMENT0+Re),B.depthBuffer&&B.storeMultisampledDepthBuffer===!1&&(kt.push(Ae),tn.push(Ae),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,tn)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,kt))}if(i.bindFramebuffer(r.READ_FRAMEBUFFER,null),i.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),_e)for(let Re=0;Re<M.length;Re++){i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.RENDERBUFFER,Ne.__webglColorRenderbuffer[Re]);const Ve=s.get(M[Re]).__webglTexture;i.bindFramebuffer(r.FRAMEBUFFER,Ne.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Re,r.TEXTURE_2D,Ve,0)}i.bindFramebuffer(r.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(B.depthBuffer&&B.storeMultisampledDepthBuffer===!1&&m){const M=B.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[M])}}}function Xt(B){return Math.min(l.maxSamples,B.samples)}function nn(B){const M=s.get(B);return B.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function Q(B){const M=d.render.frame;x.get(B)!==M&&(x.set(B,M),B.update())}function Ot(B,M){const te=B.colorSpace,ue=B.format,ge=B.type;return B.isCompressedTexture===!0||B.isVideoTexture===!0||te!==tu&&te!==os&&(Et.getTransfer(te)===zt?(ue!==Ii||ge!==hi)&&tt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):wt("WebGLTextures: Unsupported texture color space:",te)),M}function Dt(B){return typeof HTMLImageElement<"u"&&B instanceof HTMLImageElement?(h.width=B.naturalWidth||B.width,h.height=B.naturalHeight||B.height):typeof VideoFrame<"u"&&B instanceof VideoFrame?(h.width=B.displayWidth,h.height=B.displayHeight):(h.width=B.width,h.height=B.height),h}this.allocateTextureUnit=N,this.resetTextureUnits=oe,this.getTextureUnits=Z,this.setTextureUnits=ne,this.setTexture2D=fe,this.setTexture2DArray=se,this.setTexture3D=H,this.setTextureCube=C,this.rebindTextures=vt,this.setupRenderTarget=Lt,this.updateRenderTargetMipmap=pt,this.updateMultisampleRenderTarget=Mn,this.setupDepthRenderbuffer=it,this.setupFrameBufferTexture=Oe,this.useMultisampledRTT=nn,this.isReversedDepthBuffer=function(){return i.buffers.depth.getReversed()}}function x1(r,e){function i(s,l=os){let c;const d=Et.getTransfer(l);if(s===hi)return r.UNSIGNED_BYTE;if(s===$h)return r.UNSIGNED_SHORT_4_4_4_4;if(s===ep)return r.UNSIGNED_SHORT_5_5_5_1;if(s===vv)return r.UNSIGNED_INT_5_9_9_9_REV;if(s===xv)return r.UNSIGNED_INT_10F_11F_11F_REV;if(s===gv)return r.BYTE;if(s===_v)return r.SHORT;if(s===il)return r.UNSIGNED_SHORT;if(s===Jh)return r.INT;if(s===Ki)return r.UNSIGNED_INT;if(s===qi)return r.FLOAT;if(s===Qi)return r.HALF_FLOAT;if(s===Sv)return r.ALPHA;if(s===Mv)return r.RGB;if(s===Ii)return r.RGBA;if(s===Aa)return r.DEPTH_COMPONENT;if(s===zs)return r.DEPTH_STENCIL;if(s===yv)return r.RED;if(s===tp)return r.RED_INTEGER;if(s===Vs)return r.RG;if(s===np)return r.RG_INTEGER;if(s===ip)return r.RGBA_INTEGER;if(s===qc||s===jc||s===Zc||s===Kc)if(d===zt)if(c=e.get("WEBGL_compressed_texture_s3tc_srgb"),c!==null){if(s===qc)return c.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===jc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===Zc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===Kc)return c.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(c=e.get("WEBGL_compressed_texture_s3tc"),c!==null){if(s===qc)return c.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===jc)return c.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===Zc)return c.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===Kc)return c.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===mh||s===gh||s===_h||s===vh)if(c=e.get("WEBGL_compressed_texture_pvrtc"),c!==null){if(s===mh)return c.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===gh)return c.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===_h)return c.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===vh)return c.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===xh||s===Sh||s===Mh||s===yh||s===Eh||s===$c||s===Th)if(c=e.get("WEBGL_compressed_texture_etc"),c!==null){if(s===xh||s===Sh)return d===zt?c.COMPRESSED_SRGB8_ETC2:c.COMPRESSED_RGB8_ETC2;if(s===Mh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:c.COMPRESSED_RGBA8_ETC2_EAC;if(s===yh)return c.COMPRESSED_R11_EAC;if(s===Eh)return c.COMPRESSED_SIGNED_R11_EAC;if(s===$c)return c.COMPRESSED_RG11_EAC;if(s===Th)return c.COMPRESSED_SIGNED_RG11_EAC}else return null;if(s===bh||s===Ah||s===Rh||s===Ch||s===wh||s===Dh||s===Nh||s===Uh||s===Lh||s===Oh||s===Ph||s===Ih||s===zh||s===Bh)if(c=e.get("WEBGL_compressed_texture_astc"),c!==null){if(s===bh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:c.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Ah)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:c.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===Rh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:c.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Ch)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:c.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===wh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:c.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Dh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:c.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===Nh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:c.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Uh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:c.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Lh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:c.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===Oh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:c.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Ph)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:c.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===Ih)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:c.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===zh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:c.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Bh)return d===zt?c.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:c.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===Fh||s===Hh||s===Gh)if(c=e.get("EXT_texture_compression_bptc"),c!==null){if(s===Fh)return d===zt?c.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:c.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Hh)return c.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===Gh)return c.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===Vh||s===kh||s===eu||s===Xh)if(c=e.get("EXT_texture_compression_rgtc"),c!==null){if(s===Vh)return c.COMPRESSED_RED_RGTC1_EXT;if(s===kh)return c.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===eu)return c.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===Xh)return c.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===al?r.UNSIGNED_INT_24_8:r[s]!==void 0?r[s]:null}return{convert:i}}const S1=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,M1=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class y1{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,i){if(this.texture===null){const s=new Uv(e.texture);(e.depthNear!==i.depthNear||e.depthFar!==i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const i=e.cameras[0].viewport,s=new Ai({vertexShader:S1,fragmentShader:M1,uniforms:{depthColor:{value:this.texture},depthWidth:{value:i.z},depthHeight:{value:i.w}}});this.mesh=new Tn(new ul(20,20),s)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class E1 extends ks{constructor(e,i){super();const s=this;let l=null,c=1,d=null,p="local-floor",m=1,h=null,x=null,S=null,g=null,E=null,A=null;const D=typeof XRWebGLBinding<"u",y=new y1,_={},I=i.getContextAttributes();let O=null,w=null;const U=[],P=[],F=new _t;let T=null,z=null;const X=new bi;X.viewport=new Jt;const K=new bi;K.viewport=new Jt;const j=[X,K],oe=new Ny;let Z=null,ne=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(re){let me=U[re];return me===void 0&&(me=new Id,U[re]=me),me.getTargetRaySpace()},this.getControllerGrip=function(re){let me=U[re];return me===void 0&&(me=new Id,U[re]=me),me.getGripSpace()},this.getHand=function(re){let me=U[re];return me===void 0&&(me=new Id,U[re]=me),me.getHandSpace()};function N(re){const me=P.indexOf(re.inputSource);if(me===-1)return;const be=U[me];be!==void 0&&(be.update(re.inputSource,re.frame,h||d),be.dispatchEvent({type:re.type,data:re.inputSource}))}function V(){l.removeEventListener("select",N),l.removeEventListener("selectstart",N),l.removeEventListener("selectend",N),l.removeEventListener("squeeze",N),l.removeEventListener("squeezestart",N),l.removeEventListener("squeezeend",N),l.removeEventListener("end",V),l.removeEventListener("inputsourceschange",fe);for(let re=0;re<U.length;re++){const me=P[re];me!==null&&(P[re]=null,U[re].disconnect(me))}Z=null,ne=null,y.reset();for(const re in _)delete _[re];if(e.setRenderTarget(O),E=null,g=null,S=null,l=null,w=null,Fe.stop(),s.isPresenting=!1,e.setPixelRatio(T),e.setSize(F.width,F.height,!1),z!==null){const re=z.camera;re.fov=z.fov,re.zoom=z.zoom,re.updateProjectionMatrix(),z=null}s.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(re){c=re,s.isPresenting===!0&&tt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(re){p=re,s.isPresenting===!0&&tt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||d},this.setReferenceSpace=function(re){h=re},this.getBaseLayer=function(){return g!==null?g:E},this.getBinding=function(){return S===null&&D&&(S=new XRWebGLBinding(l,i)),S},this.getFrame=function(){return A},this.getSession=function(){return l},this.setSession=async function(re){if(l=re,l!==null){if(O=e.getRenderTarget(),l.addEventListener("select",N),l.addEventListener("selectstart",N),l.addEventListener("selectend",N),l.addEventListener("squeeze",N),l.addEventListener("squeezestart",N),l.addEventListener("squeezeend",N),l.addEventListener("end",V),l.addEventListener("inputsourceschange",fe),I.xrCompatible!==!0&&await i.makeXRCompatible(),T=e.getPixelRatio(),e.getSize(F),D&&"createProjectionLayer"in XRWebGLBinding.prototype){let be=null,$e=null,Oe=null;I.depth&&(Oe=I.stencil?i.DEPTH24_STENCIL8:i.DEPTH_COMPONENT24,be=I.stencil?zs:Aa,$e=I.stencil?al:Ki);const ot={colorFormat:i.RGBA8,depthFormat:Oe,scaleFactor:c};S=this.getBinding(),g=S.createProjectionLayer(ot),l.updateRenderState({layers:[g]}),e.setPixelRatio(1),e.setSize(g.textureWidth,g.textureHeight,!1),w=new zi(g.textureWidth,g.textureHeight,{format:Ii,type:hi,depthTexture:new rl(g.textureWidth,g.textureHeight,$e,void 0,void 0,void 0,void 0,void 0,void 0,be),stencilBuffer:I.stencil,colorSpace:e.outputColorSpace,samples:I.antialias?4:0,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1,storeMultisampledDepthBuffer:g.ignoreDepthValues===!1,storeMultisampledStencilBuffer:g.ignoreDepthValues===!1})}else{const be={antialias:I.antialias,alpha:!0,depth:I.depth,stencil:I.stencil,framebufferScaleFactor:c};E=new XRWebGLLayer(l,i,be),l.updateRenderState({baseLayer:E}),e.setPixelRatio(1),e.setSize(E.framebufferWidth,E.framebufferHeight,!1),w=new zi(E.framebufferWidth,E.framebufferHeight,{format:Ii,type:hi,colorSpace:e.outputColorSpace,stencilBuffer:I.stencil,resolveDepthBuffer:E.ignoreDepthValues===!1,resolveStencilBuffer:E.ignoreDepthValues===!1,storeMultisampledDepthBuffer:E.ignoreDepthValues===!1,storeMultisampledStencilBuffer:E.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(m),h=null,d=await l.requestReferenceSpace(p),Fe.setContext(l),Fe.start(),s.isPresenting=!0,s.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(l!==null)return l.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function fe(re){for(let me=0;me<re.removed.length;me++){const be=re.removed[me],$e=P.indexOf(be);$e>=0&&(P[$e]=null,U[$e].disconnect(be))}for(let me=0;me<re.added.length;me++){const be=re.added[me];let $e=P.indexOf(be);if($e===-1){for(let ot=0;ot<U.length;ot++)if(ot>=P.length){P.push(be),$e=ot;break}else if(P[ot]===null){P[ot]=be,$e=ot;break}if($e===-1)break}const Oe=U[$e];Oe&&Oe.connect(be)}}const se=new $,H=new $;function C(re,me,be){se.setFromMatrixPosition(me.matrixWorld),H.setFromMatrixPosition(be.matrixWorld);const $e=se.distanceTo(H),Oe=me.projectionMatrix.elements,ot=be.projectionMatrix.elements,en=Oe[14]/(Oe[10]-1),it=Oe[14]/(Oe[10]+1),vt=(Oe[9]+1)/Oe[5],Lt=(Oe[9]-1)/Oe[5],pt=(Oe[8]-1)/Oe[0],kt=(ot[8]+1)/ot[0],tn=en*pt,Mn=en*kt,Xt=$e/(-pt+kt),nn=Xt*-pt;if(me.matrixWorld.decompose(re.position,re.quaternion,re.scale),re.translateX(nn),re.translateZ(Xt),re.matrixWorld.compose(re.position,re.quaternion,re.scale),re.matrixWorldInverse.copy(re.matrixWorld).invert(),Oe[10]===-1)re.projectionMatrix.copy(me.projectionMatrix),re.projectionMatrixInverse.copy(me.projectionMatrixInverse);else{const Q=en+Xt,Ot=it+Xt,Dt=tn-nn,B=Mn+($e-nn),M=vt*it/Ot*Q,te=Lt*it/Ot*Q;re.projectionMatrix.makePerspective(Dt,B,M,te,Q,Ot),re.projectionMatrixInverse.copy(re.projectionMatrix).invert()}}function Y(re,me){me===null?re.matrixWorld.copy(re.matrix):re.matrixWorld.multiplyMatrices(me.matrixWorld,re.matrix),re.matrixWorldInverse.copy(re.matrixWorld).invert()}this.updateCamera=function(re){if(l===null)return;let me=re.near,be=re.far;y.texture!==null&&(y.depthNear>0&&(me=y.depthNear),y.depthFar>0&&(be=y.depthFar)),oe.near=K.near=X.near=me,oe.far=K.far=X.far=be,(Z!==oe.near||ne!==oe.far)&&(l.updateRenderState({depthNear:oe.near,depthFar:oe.far}),Z=oe.near,ne=oe.far),oe.layers.mask=re.layers.mask|6,X.layers.mask=oe.layers.mask&-5,K.layers.mask=oe.layers.mask&-3;const $e=re.parent,Oe=oe.cameras;Y(oe,$e);for(let ot=0;ot<Oe.length;ot++)Y(Oe[ot],$e);Oe.length===2?C(oe,X,K):oe.projectionMatrix.copy(X.projectionMatrix),z===null&&re.isPerspectiveCamera&&(z={camera:re,fov:re.fov,zoom:re.zoom}),ee(re,oe,$e)};function ee(re,me,be){be===null?re.matrix.copy(me.matrixWorld):(re.matrix.copy(be.matrixWorld),re.matrix.invert(),re.matrix.multiply(me.matrixWorld)),re.matrix.decompose(re.position,re.quaternion,re.scale),re.updateMatrixWorld(!0),re.projectionMatrix.copy(me.projectionMatrix),re.projectionMatrixInverse.copy(me.projectionMatrixInverse),re.isPerspectiveCamera&&(re.fov=Yh*2*Math.atan(1/re.projectionMatrix.elements[5]),re.zoom=1)}this.getCamera=function(){return oe},this.getFoveation=function(){if(!(g===null&&E===null))return m},this.setFoveation=function(re){m=re,g!==null&&(g.fixedFoveation=re),E!==null&&E.fixedFoveation!==void 0&&(E.fixedFoveation=re)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(oe)},this.getCameraTexture=function(re){return _[re]};let ye=null;function De(re,me){if(x=me.getViewerPose(h||d),A=me,x!==null){const be=x.views;E!==null&&(e.setRenderTargetFramebuffer(w,E.framebuffer),e.setRenderTarget(w));let $e=!1;be.length!==oe.cameras.length&&(oe.cameras.length=0,$e=!0);for(let it=0;it<be.length;it++){const vt=be[it];let Lt=null;if(E!==null)Lt=E.getViewport(vt);else{const kt=S.getViewSubImage(g,vt);Lt=kt.viewport,it===0&&(e.setRenderTargetTextures(w,kt.colorTexture,kt.depthStencilTexture),e.setRenderTarget(w))}let pt=j[it];pt===void 0&&(pt=new bi,pt.layers.enable(it),pt.viewport=new Jt,j[it]=pt),pt.matrix.fromArray(vt.transform.matrix),pt.matrix.decompose(pt.position,pt.quaternion,pt.scale),pt.projectionMatrix.fromArray(vt.projectionMatrix),pt.projectionMatrixInverse.copy(pt.projectionMatrix).invert(),pt.viewport.set(Lt.x,Lt.y,Lt.width,Lt.height),it===0&&(oe.matrix.copy(pt.matrix),oe.matrix.decompose(oe.position,oe.quaternion,oe.scale)),$e===!0&&oe.cameras.push(pt)}const Oe=l.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&l.depthUsage=="gpu-optimized"&&D){S=s.getBinding();const it=S.getDepthInformation(be[0]);it&&it.isValid&&it.texture&&y.init(it,l.renderState)}if(Oe&&Oe.includes("camera-access")&&D){e.state.unbindTexture(),S=s.getBinding();for(let it=0;it<be.length;it++){const vt=be[it].camera;if(vt){let Lt=_[vt];Lt||(Lt=new Uv,_[vt]=Lt);const pt=S.getCameraImage(vt);Lt.sourceTexture=pt}}}}for(let be=0;be<U.length;be++){const $e=P[be],Oe=U[be];$e!==null&&Oe!==void 0&&Oe.update($e,me,h||d)}ye&&ye(re,me),me.detectedPlanes&&s.dispatchEvent({type:"planesdetected",data:me}),A=null}const Fe=new Iv;Fe.setAnimationLoop(De),this.setAnimationLoop=function(re){ye=re},this.dispose=function(){}}}const T1=new $t,kv=new st;kv.set(-1,0,0,0,1,0,0,0,1);function b1(r,e){function i(y,_){y.matrixAutoUpdate===!0&&y.updateMatrix(),_.value.copy(y.matrix)}function s(y,_){_.color.getRGB(y.fogColor.value,Lv(r)),_.isFog?(y.fogNear.value=_.near,y.fogFar.value=_.far):_.isFogExp2&&(y.fogDensity.value=_.density)}function l(y,_,I,O,w){_.isNodeMaterial?_.uniformsNeedUpdate=!1:_.isMeshBasicMaterial?c(y,_):_.isMeshLambertMaterial?(c(y,_),_.envMap&&(y.envMapIntensity.value=_.envMapIntensity)):_.isMeshToonMaterial?(c(y,_),S(y,_)):_.isMeshPhongMaterial?(c(y,_),x(y,_),_.envMap&&(y.envMapIntensity.value=_.envMapIntensity)):_.isMeshStandardMaterial?(c(y,_),g(y,_),_.isMeshPhysicalMaterial&&E(y,_,w)):_.isMeshMatcapMaterial?(c(y,_),A(y,_)):_.isMeshDepthMaterial?c(y,_):_.isMeshDistanceMaterial?(c(y,_),D(y,_)):_.isMeshNormalMaterial?c(y,_):_.isLineBasicMaterial?(d(y,_),_.isLineDashedMaterial&&p(y,_)):_.isPointsMaterial?m(y,_,I,O):_.isSpriteMaterial?h(y,_):_.isShadowMaterial?(y.color.value.copy(_.color),y.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function c(y,_){y.opacity.value=_.opacity,_.color&&y.diffuse.value.copy(_.color),_.emissive&&y.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(y.map.value=_.map,i(_.map,y.mapTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,i(_.alphaMap,y.alphaMapTransform)),_.bumpMap&&(y.bumpMap.value=_.bumpMap,i(_.bumpMap,y.bumpMapTransform),y.bumpScale.value=_.bumpScale,_.side===Vn&&(y.bumpScale.value*=-1)),_.normalMap&&(y.normalMap.value=_.normalMap,i(_.normalMap,y.normalMapTransform),y.normalScale.value.copy(_.normalScale),_.side===Vn&&y.normalScale.value.negate()),_.displacementMap&&(y.displacementMap.value=_.displacementMap,i(_.displacementMap,y.displacementMapTransform),y.displacementScale.value=_.displacementScale,y.displacementBias.value=_.displacementBias),_.emissiveMap&&(y.emissiveMap.value=_.emissiveMap,i(_.emissiveMap,y.emissiveMapTransform)),_.specularMap&&(y.specularMap.value=_.specularMap,i(_.specularMap,y.specularMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest);const I=e.get(_),O=I.envMap,w=I.envMapRotation;O&&(y.envMap.value=O,y.envMapRotation.value.setFromMatrix4(T1.makeRotationFromEuler(w)).transpose(),O.isCubeTexture&&O.isRenderTargetTexture===!1&&y.envMapRotation.value.premultiply(kv),y.reflectivity.value=_.reflectivity,y.ior.value=_.ior,y.refractionRatio.value=_.refractionRatio),_.lightMap&&(y.lightMap.value=_.lightMap,y.lightMapIntensity.value=_.lightMapIntensity,i(_.lightMap,y.lightMapTransform)),_.aoMap&&(y.aoMap.value=_.aoMap,y.aoMapIntensity.value=_.aoMapIntensity,i(_.aoMap,y.aoMapTransform))}function d(y,_){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,_.map&&(y.map.value=_.map,i(_.map,y.mapTransform))}function p(y,_){y.dashSize.value=_.dashSize,y.totalSize.value=_.dashSize+_.gapSize,y.scale.value=_.scale}function m(y,_,I,O){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,y.size.value=_.size*I,y.scale.value=O*.5,_.map&&(y.map.value=_.map,i(_.map,y.uvTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,i(_.alphaMap,y.alphaMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest)}function h(y,_){y.diffuse.value.copy(_.color),y.opacity.value=_.opacity,y.rotation.value=_.rotation,_.map&&(y.map.value=_.map,i(_.map,y.mapTransform)),_.alphaMap&&(y.alphaMap.value=_.alphaMap,i(_.alphaMap,y.alphaMapTransform)),_.alphaTest>0&&(y.alphaTest.value=_.alphaTest)}function x(y,_){y.specular.value.copy(_.specular),y.shininess.value=Math.max(_.shininess,1e-4)}function S(y,_){_.gradientMap&&(y.gradientMap.value=_.gradientMap)}function g(y,_){y.metalness.value=_.metalness,_.metalnessMap&&(y.metalnessMap.value=_.metalnessMap,i(_.metalnessMap,y.metalnessMapTransform)),y.roughness.value=_.roughness,_.roughnessMap&&(y.roughnessMap.value=_.roughnessMap,i(_.roughnessMap,y.roughnessMapTransform)),_.envMap&&(y.envMapIntensity.value=_.envMapIntensity)}function E(y,_,I){y.ior.value=_.ior,_.sheen>0&&(y.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),y.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(y.sheenColorMap.value=_.sheenColorMap,i(_.sheenColorMap,y.sheenColorMapTransform)),_.sheenRoughnessMap&&(y.sheenRoughnessMap.value=_.sheenRoughnessMap,i(_.sheenRoughnessMap,y.sheenRoughnessMapTransform))),_.clearcoat>0&&(y.clearcoat.value=_.clearcoat,y.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(y.clearcoatMap.value=_.clearcoatMap,i(_.clearcoatMap,y.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(y.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,i(_.clearcoatRoughnessMap,y.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(y.clearcoatNormalMap.value=_.clearcoatNormalMap,i(_.clearcoatNormalMap,y.clearcoatNormalMapTransform),y.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===Vn&&y.clearcoatNormalScale.value.negate())),_.dispersion>0&&(y.dispersion.value=_.dispersion),_.retroreflectivity>0&&(y.retroreflectivity.value=_.retroreflectivity),_.iridescence>0&&(y.iridescence.value=_.iridescence,y.iridescenceIOR.value=_.iridescenceIOR,y.iridescenceThicknessMinimum.value=_.iridescenceThicknessRange[0],y.iridescenceThicknessMaximum.value=_.iridescenceThicknessRange[1],_.iridescenceMap&&(y.iridescenceMap.value=_.iridescenceMap,i(_.iridescenceMap,y.iridescenceMapTransform)),_.iridescenceThicknessMap&&(y.iridescenceThicknessMap.value=_.iridescenceThicknessMap,i(_.iridescenceThicknessMap,y.iridescenceThicknessMapTransform))),_.transmission>0&&(y.transmission.value=_.transmission,y.transmissionSamplerMap.value=I.texture,y.transmissionSamplerSize.value.set(I.width,I.height),_.transmissionMap&&(y.transmissionMap.value=_.transmissionMap,i(_.transmissionMap,y.transmissionMapTransform)),y.thickness.value=_.thickness,_.thicknessMap&&(y.thicknessMap.value=_.thicknessMap,i(_.thicknessMap,y.thicknessMapTransform)),y.attenuationDistance.value=_.attenuationDistance,y.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(y.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(y.anisotropyMap.value=_.anisotropyMap,i(_.anisotropyMap,y.anisotropyMapTransform))),y.specularIntensity.value=_.specularIntensity,y.specularColor.value.copy(_.specularColor),_.specularColorMap&&(y.specularColorMap.value=_.specularColorMap,i(_.specularColorMap,y.specularColorMapTransform)),_.specularIntensityMap&&(y.specularIntensityMap.value=_.specularIntensityMap,i(_.specularIntensityMap,y.specularIntensityMapTransform))}function A(y,_){_.matcap&&(y.matcap.value=_.matcap)}function D(y,_){const I=e.get(_).light;y.referencePosition.value.setFromMatrixPosition(I.matrixWorld),y.nearDistance.value=I.shadow.camera.near,y.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:s,refreshMaterialUniforms:l}}function A1(r,e,i,s){let l={},c={},d=[];const p=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function m(w,U){const P=U.program;s.uniformBlockBinding(w,P)}function h(w,U){let P=l[w.id];P===void 0&&(y(w),P=x(w),l[w.id]=P,w.addEventListener("dispose",I));const F=U.program;s.updateUBOMapping(w,F);const T=e.render.frame;c[w.id]!==T&&(g(w),c[w.id]=T)}function x(w){const U=S();w.__bindingPointIndex=U;const P=r.createBuffer(),F=w.__size,T=w.usage;return r.bindBuffer(r.UNIFORM_BUFFER,P),r.bufferData(r.UNIFORM_BUFFER,F,T),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,U,P),P}function S(){for(let w=0;w<p;w++)if(d.indexOf(w)===-1)return d.push(w),w;return wt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(w){const U=l[w.id],P=w.uniforms,F=w.__cache;r.bindBuffer(r.UNIFORM_BUFFER,U);for(let T=0,z=P.length;T<z;T++){const X=P[T];if(Array.isArray(X))for(let K=0,j=X.length;K<j;K++)E(X[K],T,K,F);else E(X,T,0,F)}r.bindBuffer(r.UNIFORM_BUFFER,null)}function E(w,U,P,F){if(D(w,U,P,F)===!0){const T=w.__offset,z=w.value;if(Array.isArray(z)){let X=0;for(let K=0;K<z.length;K++){const j=z[K],oe=_(j);A(j,w.__data,X),typeof j!="number"&&typeof j!="boolean"&&!j.isMatrix3&&!ArrayBuffer.isView(j)&&(X+=oe.storage/Float32Array.BYTES_PER_ELEMENT)}}else A(z,w.__data,0);r.bufferSubData(r.UNIFORM_BUFFER,T,w.__data)}}function A(w,U,P){typeof w=="number"||typeof w=="boolean"?U[0]=w:w.isMatrix3?(U[0]=w.elements[0],U[1]=w.elements[1],U[2]=w.elements[2],U[3]=0,U[4]=w.elements[3],U[5]=w.elements[4],U[6]=w.elements[5],U[7]=0,U[8]=w.elements[6],U[9]=w.elements[7],U[10]=w.elements[8],U[11]=0):ArrayBuffer.isView(w)?U.set(new w.constructor(w.buffer,w.byteOffset,U.length)):w.toArray(U,P)}function D(w,U,P,F){const T=w.value,z=U+"_"+P;if(F[z]===void 0)return typeof T=="number"||typeof T=="boolean"?F[z]=T:ArrayBuffer.isView(T)?F[z]=T.slice():F[z]=T.clone(),!0;{const X=F[z];if(typeof T=="number"||typeof T=="boolean"){if(X!==T)return F[z]=T,!0}else{if(ArrayBuffer.isView(T))return!0;if(X.equals(T)===!1)return X.copy(T),!0}}return!1}function y(w){const U=w.uniforms;let P=0;const F=16;for(let z=0,X=U.length;z<X;z++){const K=Array.isArray(U[z])?U[z]:[U[z]];for(let j=0,oe=K.length;j<oe;j++){const Z=K[j],ne=Array.isArray(Z.value)?Z.value:[Z.value];for(let N=0,V=ne.length;N<V;N++){const fe=ne[N],se=_(fe),H=P%F,C=H%se.boundary,Y=H+C;P+=C,Y!==0&&F-Y<se.storage&&(P+=F-Y),Z.__data=new Float32Array(se.storage/Float32Array.BYTES_PER_ELEMENT),Z.__offset=P,P+=se.storage}}}const T=P%F;return T>0&&(P+=F-T),w.__size=P,w.__cache={},this}function _(w){const U={boundary:0,storage:0};return typeof w=="number"||typeof w=="boolean"?(U.boundary=4,U.storage=4):w.isVector2?(U.boundary=8,U.storage=8):w.isVector3||w.isColor?(U.boundary=16,U.storage=12):w.isVector4?(U.boundary=16,U.storage=16):w.isMatrix3?(U.boundary=48,U.storage=48):w.isMatrix4?(U.boundary=64,U.storage=64):w.isTexture?tt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(w)?(U.boundary=16,U.storage=w.byteLength):tt("WebGLRenderer: Unsupported uniform value type.",w),U}function I(w){const U=w.target;U.removeEventListener("dispose",I);const P=d.indexOf(U.__bindingPointIndex);d.splice(P,1),r.deleteBuffer(l[U.id]),delete l[U.id],delete c[U.id]}function O(){for(const w in l)r.deleteBuffer(l[w]);d=[],l={},c={}}return{bind:m,update:h,dispose:O}}const R1=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Wi=null;function C1(){return Wi===null&&(Wi=new hy(R1,16,16,Vs,Qi),Wi.name="DFG_LUT",Wi.minFilter=In,Wi.magFilter=In,Wi.wrapS=ya,Wi.wrapT=ya,Wi.generateMipmaps=!1,Wi.needsUpdate=!0),Wi}class w1{constructor(e={}){const{canvas:i=VM(),context:s=null,depth:l=!0,stencil:c=!1,alpha:d=!1,antialias:p=!1,premultipliedAlpha:m=!0,preserveDrawingBuffer:h=!1,powerPreference:x="default",failIfMajorPerformanceCaveat:S=!1,reversedDepthBuffer:g=!1,outputBufferType:E=hi}=e;this.isWebGLRenderer=!0;let A;if(s!==null){if(typeof WebGLRenderingContext<"u"&&s instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");A=s.getContextAttributes().alpha}else A=d;const D=E,y=new Set([ip,np,tp]),_=new Set([hi,Ki,il,al,$h,ep]),I=new Uint32Array(4),O=new Int32Array(4),w=new $;let U=null,P=null;const F=[],T=[];let z=null;this.domElement=i,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const X=this;let K=!1,j=null,oe=null,Z=null,ne=null;this._outputColorSpace=di;let N=0,V=0,fe=null,se=-1,H=null;const C=new Jt,Y=new Jt;let ee=null;const ye=new Mt(0);let De=0,Fe=i.width,re=i.height,me=1,be=null,$e=null;const Oe=new Jt(0,0,Fe,re),ot=new Jt(0,0,Fe,re);let en=!1;const it=new lp;let vt=!1,Lt=!1;const pt=new $t,kt=new $,tn=new Jt,Mn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Xt=!1;function nn(){return fe===null?me:1}let Q=s;function Ot(b,k){return i.getContext(b,k)}let Dt,B,M,te,ue,ge,Ae,Ne,_e,ve,Re,Ve,Pe,Ue,Ke,Qe,nt,q,Ce,Se,we,Be,Te;try{const b={alpha:!0,depth:l,stencil:c,antialias:p,premultipliedAlpha:m,preserveDrawingBuffer:h,powerPreference:x,failIfMajorPerformanceCaveat:S};if("setAttribute"in i&&i.setAttribute("data-engine",`three.js r${Kh}`),i.addEventListener("webglcontextlost",Bt,!1),i.addEventListener("webglcontextrestored",bt,!1),i.addEventListener("webglcontextcreationerror",Xn,!1),Q===null){const k="webgl2";if(Q=Ot(k,b),Q===null)throw Ot(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ze()}catch(b){throw i.removeEventListener("webglcontextlost",Bt,!1),i.removeEventListener("webglcontextrestored",bt,!1),i.removeEventListener("webglcontextcreationerror",Xn,!1),wt("WebGLRenderer: "+b.message),b}function Ze(){Dt=new Cb(Q),Dt.init(),we=new x1(Q,Dt),B=new vb(Q,Dt,e,we),M=new _1(Q,Dt),B.reversedDepthBuffer&&g&&M.buffers.depth.setReversed(!0),oe=Q.createFramebuffer(),Z=Q.createFramebuffer(),ne=Q.createFramebuffer(),te=new Nb(Q),ue=new i1,ge=new v1(Q,Dt,M,ue,B,we,te),Ae=new Rb(X),Ne=new Ly(Q),Be=new gb(Q,Ne),_e=new wb(Q,Ne,te,Be),ve=new Lb(Q,_e,Ne,Be,te),q=new Ub(Q,B,ge),Ke=new xb(ue),Re=new n1(X,Ae,Dt,B,Be,Ke),Ve=new b1(X,ue),Pe=new s1,Ue=new f1(Dt),nt=new mb(X,Ae,M,ve,A,m),Qe=new g1(X,ve,B),Te=new A1(Q,te,B,M),Ce=new _b(Q,Dt,te),Se=new Db(Q,Dt,te),te.programs=Re.programs,X.capabilities=B,X.extensions=Dt,X.properties=ue,X.renderLists=Pe,X.shadowMap=Qe,X.state=M,X.info=te}D!==hi&&(z=new Pb(D,i.width,i.height,p,l,c));const We=new E1(X,Q);this.xr=We,this.getContext=function(){return Q},this.getContextAttributes=function(){return Q.getContextAttributes()},this.forceContextLoss=function(){const b=Dt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Dt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return me},this.setPixelRatio=function(b){b!==void 0&&(me=b,this.setSize(Fe,re,!1))},this.getSize=function(b){return b.set(Fe,re)},this.setSize=function(b,k,he=!0){if(We.isPresenting){tt("WebGLRenderer: Can't change size while VR device is presenting.");return}Fe=b,re=k,i.width=Math.floor(b*me),i.height=Math.floor(k*me),he===!0&&(i.style.width=b+"px",i.style.height=k+"px"),z!==null&&z.setSize(i.width,i.height),this.setViewport(0,0,b,k)},this.getDrawingBufferSize=function(b){return b.set(Fe*me,re*me).floor()},this.setDrawingBufferSize=function(b,k,he){Fe=b,re=k,me=he,i.width=Math.floor(b*he),i.height=Math.floor(k*he),this.setViewport(0,0,b,k)},this.setEffects=function(b){if(D===hi){wt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let k=0;k<b.length;k++)if(b[k].isOutputPass===!0){tt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}z.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(C)},this.getViewport=function(b){return b.copy(Oe)},this.setViewport=function(b,k,he,ie){b.isVector4?Oe.set(b.x,b.y,b.z,b.w):Oe.set(b,k,he,ie),M.viewport(C.copy(Oe).multiplyScalar(me).round())},this.getScissor=function(b){return b.copy(ot)},this.setScissor=function(b,k,he,ie){b.isVector4?ot.set(b.x,b.y,b.z,b.w):ot.set(b,k,he,ie),M.scissor(Y.copy(ot).multiplyScalar(me).round())},this.getScissorTest=function(){return en},this.setScissorTest=function(b){M.setScissorTest(en=b)},this.setOpaqueSort=function(b){be=b},this.setTransparentSort=function(b){$e=b},this.getClearColor=function(b){return b.copy(nt.getClearColor())},this.setClearColor=function(){nt.setClearColor(...arguments)},this.getClearAlpha=function(){return nt.getClearAlpha()},this.setClearAlpha=function(){nt.setClearAlpha(...arguments)},this.clear=function(b=!0,k=!0,he=!0){let ie=0;if(b){let ae=!1;if(fe!==null){const Ie=fe.texture.format;ae=y.has(Ie)}if(ae){const Ie=fe.texture.type,ke=_.has(Ie),Le=nt.getClearColor(),He=nt.getClearAlpha(),Ge=Le.r,rt=Le.g,ht=Le.b;ke?(I[0]=Ge,I[1]=rt,I[2]=ht,I[3]=He,Q.clearBufferuiv(Q.COLOR,0,I)):(O[0]=Ge,O[1]=rt,O[2]=ht,O[3]=He,Q.clearBufferiv(Q.COLOR,0,O))}else ie|=Q.COLOR_BUFFER_BIT}k&&(ie|=Q.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),he&&(ie|=Q.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),ie!==0&&Q.clear(ie)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),j=b},this.dispose=function(){i.removeEventListener("webglcontextlost",Bt,!1),i.removeEventListener("webglcontextrestored",bt,!1),i.removeEventListener("webglcontextcreationerror",Xn,!1),nt.dispose(),Pe.dispose(),Ue.dispose(),ue.dispose(),Ae.dispose(),ve.dispose(),Be.dispose(),Te.dispose(),Re.dispose(),We.dispose(),We.removeEventListener("sessionstart",ln),We.removeEventListener("sessionend",An),Wn.stop()};function Bt(b){b.preventDefault(),u_("WebGLRenderer: Context Lost."),K=!0}function bt(){u_("WebGLRenderer: Context Restored."),K=!1;const b=te.autoReset,k=Qe.enabled,he=Qe.autoUpdate,ie=Qe.needsUpdate,ae=Qe.type;Ze(),te.autoReset=b,Qe.enabled=k,Qe.autoUpdate=he,Qe.needsUpdate=ie,Qe.type=ae}function Xn(b){wt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function ti(b){const k=b.target;k.removeEventListener("dispose",ti),jr(k)}function jr(b){Zr(b),ue.remove(b)}function Zr(b){const k=ue.get(b).programs;k!==void 0&&(k.forEach(function(he){Re.releaseProgram(he)}),b.isShaderMaterial&&Re.releaseShaderCache(b))}this.renderBufferDirect=function(b,k,he,ie,ae,Ie){k===null&&(k=Mn);const ke=ae.isMesh&&ae.matrixWorld.determinantAffine()<0,Le=wa(b,k,he,ie,ae);M.setMaterial(ie,ke);let He=he.index,Ge=1;if(ie.wireframe===!0){if(He=_e.getWireframeAttribute(he),He===void 0)return;Ge=2}const rt=he.drawRange,ht=he.attributes.position;let Ye=rt.start*Ge,At=(rt.start+rt.count)*Ge;Ie!==null&&(Ye=Math.max(Ye,Ie.start*Ge),At=Math.min(At,(Ie.start+Ie.count)*Ge)),He!==null?(Ye=Math.max(Ye,0),At=Math.min(At,He.count)):ht!=null&&(Ye=Math.max(Ye,0),At=Math.min(At,ht.count));const qt=At-Ye;if(qt<0||qt===1/0)return;Be.setup(ae,ie,Le,he,He);let Wt,ut=Ce;if(He!==null&&(Wt=Ne.get(He),ut=Se,ut.setIndex(Wt)),ae.isMesh)ie.wireframe===!0?(M.setLineWidth(ie.wireframeLinewidth*nn()),ut.setMode(Q.LINES)):ut.setMode(Q.TRIANGLES);else if(ae.isLine){let un=ie.linewidth;un===void 0&&(un=1),M.setLineWidth(un*nn()),ae.isLineSegments?ut.setMode(Q.LINES):ae.isLineLoop?ut.setMode(Q.LINE_LOOP):ut.setMode(Q.LINE_STRIP)}else ae.isPoints?ut.setMode(Q.POINTS):ae.isSprite&&ut.setMode(Q.TRIANGLES);if(ae.isBatchedMesh)if(Dt.get("WEBGL_multi_draw"))ut.renderMultiDraw(ae._multiDrawStarts,ae._multiDrawCounts,ae._multiDrawCount);else{const un=ae._multiDrawStarts,Xe=ae._multiDrawCounts,gn=ae._multiDrawCount,ft=He?Ne.get(He).bytesPerElement:1,zn=ue.get(ie).currentProgram.getUniforms();for(let ni=0;ni<gn;ni++)zn.setValue(Q,"_gl_DrawID",ni),ut.render(un[ni]/ft,Xe[ni])}else if(ae.isInstancedMesh)ut.renderInstances(Ye,qt,ae.count);else if(he.isInstancedBufferGeometry){const un=he._maxInstanceCount!==void 0?he._maxInstanceCount:1/0,Xe=Math.min(he.instanceCount,un);ut.renderInstances(Ye,qt,Xe)}else ut.render(Ye,qt)};function Kr(b,k,he,ie){j!==null&&b.isNodeMaterial&&j.setObject(ie,b),vt===!0&&Ke.setState(b,he,!1),b.transparent===!0&&b.side===Oi&&b.forceSinglePass===!1?(b.side=Vn,b.needsUpdate=!0,Ca(b,k,ie),b.side=Hs,b.needsUpdate=!0,Ca(b,k,ie),b.side=Oi):Ca(b,k,ie)}this.compile=function(b,k,he=null){he===null&&(he=b),j!==null&&j.renderStart(b,k,he),P=Ue.get(he),P.init(k),T.push(P),he.traverseVisible(function(ae){ae.isLight&&ae.layers.test(k.layers)&&(P.pushLight(ae),ae.castShadow&&P.pushShadow(ae))}),b!==he&&b.traverseVisible(function(ae){ae.isLight&&ae.layers.test(k.layers)&&(P.pushLight(ae),ae.castShadow&&P.pushShadow(ae))}),P.setupLights(),j!==null&&j.updateLights(P.state.lightsArray),Lt=this.localClippingEnabled,vt=Ke.init(this.clippingPlanes,Lt),vt===!0&&Ke.setGlobalState(this.clippingPlanes,k),j!==null&&Qe.render(P.state.shadowsArray,he,k);const ie=new Set;return b.traverse(function(ae){if(!(ae.isMesh||ae.isPoints||ae.isLine||ae.isSprite))return;const Ie=ae.material;if(Ie)if(Array.isArray(Ie))for(let ke=0;ke<Ie.length;ke++){const Le=Ie[ke];Kr(Le,he,k,ae),ie.add(Le)}else Kr(Ie,he,k,ae),ie.add(Ie)}),P=T.pop(),j!==null&&j.renderEnd(),ie},this.compileAsync=function(b,k,he=null){const ie=this.compile(b,k,he);return new Promise(ae=>{function Ie(){if(ie.forEach(function(ke){const He=ue.get(ke).currentProgram;(He===void 0||He.isReady())&&ie.delete(ke)}),ie.size===0){ae(b);return}setTimeout(Ie,10)}Dt.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let Xs=null;function Bi(b){Xs&&Xs(b)}function ln(){Wn.stop()}function An(){Wn.start()}const Wn=new Iv;Wn.setAnimationLoop(Bi),typeof self<"u"&&Wn.setContext(self),this.setAnimationLoop=function(b){Xs=b,We.setAnimationLoop(b),b===null?Wn.stop():Wn.start()},We.addEventListener("sessionstart",ln),We.addEventListener("sessionend",An),this.render=function(b,k){if(k!==void 0&&k.isCamera!==!0){wt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(K===!0)return;j!==null&&j.renderStart(b,k);const he=We.enabled===!0&&We.isPresenting===!0,ie=z!==null&&(fe===null||he)&&z.begin(X,fe);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),We.enabled===!0&&We.isPresenting===!0&&(z===null||z.isCompositing()===!1)&&(We.cameraAutoUpdate===!0&&We.updateCamera(k),k=We.getCamera()),b.isScene===!0&&b.onBeforeRender(X,b,k,fe),P=Ue.get(b,T.length),P.init(k),P.state.textureUnits=ge.getTextureUnits(),T.push(P),pt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),it.setFromProjectionMatrix(pt,ji,k.reversedDepth),Lt=this.localClippingEnabled,vt=Ke.init(this.clippingPlanes,Lt),U=Pe.get(b,F.length),U.init(),F.push(U),We.enabled===!0&&We.isPresenting===!0){const ke=X.xr.getDepthSensingMesh();ke!==null&&cs(ke,k,-1/0,X.sortObjects)}cs(b,k,0,X.sortObjects),U.finish(),j!==null&&j.updateLights(P.state.lightsArray),X.sortObjects===!0&&U.sort(be,$e),Xt=We.enabled===!1||We.isPresenting===!1||We.hasDepthSensing()===!1,Xt&&nt.addToRenderList(U,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),vt===!0&&Ke.beginShadows();const ae=P.state.shadowsArray;if(Qe.render(ae,b,k),vt===!0&&Ke.endShadows(),(ie&&z.hasRenderPass())===!1){const ke=U.opaque,Le=U.transmissive;if(P.setupLights(),k.isArrayCamera){const He=k.cameras;if(Le.length>0)for(let Ge=0,rt=He.length;Ge<rt;Ge++){const ht=He[Ge];dl(ke,Le,b,ht)}Xt&&nt.render(b);for(let Ge=0,rt=He.length;Ge<rt;Ge++){const ht=He[Ge];fl(U,b,ht,ht.viewport)}}else Le.length>0&&dl(ke,Le,b,k),Xt&&nt.render(b),fl(U,b,k)}fe!==null&&V===0&&(ge.updateMultisampleRenderTarget(fe),ge.updateRenderTargetMipmap(fe)),ie&&z.end(X),b.isScene===!0&&b.onAfterRender(X,b,k),Be.resetDefaultState(),se=-1,H=null,T.pop(),T.length>0?(P=T[T.length-1],ge.setTextureUnits(P.state.textureUnits),vt===!0&&Ke.setGlobalState(X.clippingPlanes,P.state.camera)):P=null,F.pop(),F.length>0?U=F[F.length-1]:U=null,j!==null&&j.renderEnd()};function cs(b,k,he,ie){if(b.visible===!1)return;if(b.layers.test(k.layers)){if(b.isGroup)he=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(k);else if(b.isLightProbeGrid)P.pushLightProbeGrid(b);else if(b.isLight)P.pushLight(b),b.castShadow&&P.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(it)){ie&&tn.setFromMatrixPosition(b.matrixWorld).applyMatrix4(pt);const ke=ve.update(b),Le=b.material;Le.visible&&U.push(b,ke,Le,he,tn.z,null,k)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(it))){const ke=ve.update(b),Le=b.material;if(ie&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),tn.copy(b.boundingSphere.center)):(ke.boundingSphere===null&&ke.computeBoundingSphere(),tn.copy(ke.boundingSphere.center)),tn.applyMatrix4(b.matrixWorld).applyMatrix4(pt)),Array.isArray(Le)){const He=ke.groups;for(let Ge=0,rt=He.length;Ge<rt;Ge++){const ht=He[Ge],Ye=Le[ht.materialIndex];Ye&&Ye.visible&&U.push(b,ke,Ye,he,tn.z,ht,k)}}else Le.visible&&U.push(b,ke,Le,he,tn.z,null,k)}}const Ie=b.children;for(let ke=0,Le=Ie.length;ke<Le;ke++)cs(Ie[ke],k,he,ie)}function fl(b,k,he,ie){const{opaque:ae,transmissive:Ie,transparent:ke}=b;P.setupLightsView(he),vt===!0&&Ke.setGlobalState(X.clippingPlanes,he),ie&&M.viewport(C.copy(ie)),ae.length>0&&us(ae,k,he),Ie.length>0&&us(Ie,k,he),ke.length>0&&us(ke,k,he),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function dl(b,k,he,ie){if((he.isScene===!0?he.overrideMaterial:null)!==null)return;if(P.state.transmissionRenderTarget[ie.id]===void 0){const Ye=Dt.has("EXT_color_buffer_half_float")||Dt.has("EXT_color_buffer_float");P.state.transmissionRenderTarget[ie.id]=new zi(1,1,{generateMipmaps:!0,type:Ye?Qi:hi,minFilter:Is,samples:Math.max(4,B.samples),stencilBuffer:c,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Et.workingColorSpace})}const Ie=P.state.transmissionRenderTarget[ie.id],ke=ie.viewport||C;Ie.setSize(ke.z*X.transmissionResolutionScale,ke.w*X.transmissionResolutionScale);const Le=X.getRenderTarget(),He=X.getActiveCubeFace(),Ge=X.getActiveMipmapLevel();X.setRenderTarget(Ie),X.getClearColor(ye),De=X.getClearAlpha(),De<1&&X.setClearColor(16777215,.5),X.clear(),Xt&&nt.render(he);const rt=X.toneMapping;X.toneMapping=Zi;const ht=ie.viewport;if(ie.viewport!==void 0&&(ie.viewport=void 0),P.setupLightsView(ie),vt===!0&&Ke.setGlobalState(X.clippingPlanes,ie),us(b,he,ie),ge.updateMultisampleRenderTarget(Ie),ge.updateRenderTargetMipmap(Ie),Dt.has("WEBGL_multisampled_render_to_texture")===!1){let Ye=!1;for(let At=0,qt=k.length;At<qt;At++){const Wt=k[At],{object:ut,geometry:un,material:Xe,group:gn}=Wt;if(Xe.side===Oi&&ut.layers.test(ie.layers)){const ft=Xe.side;Xe.side=Vn,Xe.needsUpdate=!0,Ra(ut,he,ie,un,Xe,gn),Xe.side=ft,Xe.needsUpdate=!0,Ye=!0}}Ye===!0&&(ge.updateMultisampleRenderTarget(Ie),ge.updateRenderTargetMipmap(Ie))}X.setRenderTarget(Le,He,Ge),X.setClearColor(ye,De),ht!==void 0&&(ie.viewport=ht),X.toneMapping=rt}function us(b,k,he){const ie=k.isScene===!0?k.overrideMaterial:null;for(let ae=0,Ie=b.length;ae<Ie;ae++){const ke=b[ae],{object:Le,geometry:He,group:Ge}=ke;let rt=ke.material;rt.allowOverride===!0&&ie!==null&&(rt=ie),Le.layers.test(he.layers)&&Ra(Le,k,he,He,rt,Ge)}}function Ra(b,k,he,ie,ae,Ie){j!==null&&ae.isNodeMaterial&&j.setObject(b,ae),b.onBeforeRender(X,k,he,ie,ae,Ie),b.modelViewMatrix.multiplyMatrices(he.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),ae.onBeforeRender(X,k,he,ie,b,Ie),ae.transparent===!0&&ae.side===Oi&&ae.forceSinglePass===!1?(ae.side=Vn,ae.needsUpdate=!0,X.renderBufferDirect(he,k,ie,ae,b,Ie),ae.side=Hs,ae.needsUpdate=!0,X.renderBufferDirect(he,k,ie,ae,b,Ie),ae.side=Oi):X.renderBufferDirect(he,k,ie,ae,b,Ie),b.onAfterRender(X,k,he,ie,ae,Ie)}function Ca(b,k,he){k.isScene!==!0&&(k=Mn);const ie=ue.get(b),ae=P.state.lights,Ie=P.state.shadowsArray,ke=ae.state.version,Le=Re.getParameters(b,ae.state,Ie,k,he,P.state.lightProbeGridArray),He=Re.getProgramCacheKey(Le);let Ge=ie.programs;ie.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?k.environment:null,ie.fog=k.fog;const rt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;ie.envMap=Ae.get(b.envMap||ie.environment,rt),ie.envMapRotation=ie.environment!==null&&b.envMap===null?k.environmentRotation:b.envMapRotation,Ge===void 0&&(b.addEventListener("dispose",ti),Ge=new Map,ie.programs=Ge);let ht=Ge.get(He);if(ht!==void 0){if(ie.currentProgram===ht&&ie.lightsStateVersion===ke)return $i(b,Le),ht}else Le.uniforms=Re.getUniforms(b),j!==null&&b.isNodeMaterial&&j.build(b,he,Le),b.onBeforeCompile(Le,X),ht=Re.acquireProgram(Le,He),Ge.set(He,ht),ie.uniforms=Le.uniforms;const Ye=ie.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ye.clippingPlanes=Ke.uniform),$i(b,Le),ie.needsLights=hl(b),ie.lightsStateVersion=ke,ie.needsLights&&(Ye.ambientLightColor.value=ae.state.ambient,Ye.lightProbe.value=ae.state.probe,Ye.sunLights.value=ae.state.sun,Ye.sunLightShadows.value=ae.state.sunShadow,Ye.directionalLights.value=ae.state.directional,Ye.directionalLightShadows.value=ae.state.directionalShadow,Ye.spotLights.value=ae.state.spot,Ye.spotLightShadows.value=ae.state.spotShadow,Ye.rectAreaLights.value=ae.state.rectArea,Ye.ltc_1.value=ae.state.rectAreaLTC1,Ye.ltc_2.value=ae.state.rectAreaLTC2,Ye.pointLights.value=ae.state.point,Ye.pointLightShadows.value=ae.state.pointShadow,Ye.hemisphereLights.value=ae.state.hemi,Ye.sunShadowMatrix.value=ae.state.sunShadowMatrix,Ye.sunShadowCascade.value=ae.state.sunShadowCascade,Ye.directionalShadowMatrix.value=ae.state.directionalShadowMatrix,Ye.spotLightMatrix.value=ae.state.spotLightMatrix,Ye.spotLightMap.value=ae.state.spotLightMap,Ye.pointShadowMatrix.value=ae.state.pointShadowMatrix),ie.lightProbeGrid=P.state.lightProbeGridArray.length>0,ie.currentProgram=ht,ie.uniformsList=null,ht}function Ji(b){if(b.uniformsList===null){const k=b.currentProgram.getUniforms();b.uniformsList=Qc.seqWithValue(k.seq,b.uniforms)}return b.uniformsList}function $i(b,k){const he=ue.get(b);he.outputColorSpace=k.outputColorSpace,he.batching=k.batching,he.batchingColor=k.batchingColor,he.instancing=k.instancing,he.instancingColor=k.instancingColor,he.instancingMorph=k.instancingMorph,he.skinning=k.skinning,he.morphTargets=k.morphTargets,he.morphNormals=k.morphNormals,he.morphColors=k.morphColors,he.morphTargetsCount=k.morphTargetsCount,he.numClippingPlanes=k.numClippingPlanes,he.numIntersection=k.numClipIntersection,he.vertexAlphas=k.vertexAlphas,he.vertexTangents=k.vertexTangents,he.toneMapping=k.toneMapping}function fs(b,k){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;w.setFromMatrixPosition(k.matrixWorld);for(let he=0,ie=b.length;he<ie;he++){const ae=b[he];if(ae.texture!==null&&ae.boundingBox.containsPoint(w))return ae}return null}function wa(b,k,he,ie,ae){k.isScene!==!0&&(k=Mn),ge.resetTextureUnits();const Ie=k.fog,ke=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial?k.environment:null,Le=fe===null?X.outputColorSpace:fe.isXRRenderTarget===!0?fe.texture.colorSpace:Et.workingColorSpace,He=ie.isMeshStandardMaterial||ie.isMeshLambertMaterial&&!ie.envMap||ie.isMeshPhongMaterial&&!ie.envMap,Ge=Ae.get(ie.envMap||ke,He),rt=ie.vertexColors===!0&&!!he.attributes.color&&he.attributes.color.itemSize===4,ht=!!he.attributes.tangent&&(!!ie.normalMap||ie.anisotropy>0),Ye=!!he.morphAttributes.position,At=!!he.morphAttributes.normal,qt=!!he.morphAttributes.color;let Wt=Zi;ie.toneMapped&&(fe===null||fe.isXRRenderTarget===!0)&&(Wt=X.toneMapping);const ut=he.morphAttributes.position||he.morphAttributes.normal||he.morphAttributes.color,un=ut!==void 0?ut.length:0,Xe=ue.get(ie),gn=P.state.lights;if(vt===!0&&(Lt===!0||b!==H)){const Ft=b===H&&ie.id===se;Ke.setState(ie,b,Ft)}let ft=!1;ie.version===Xe.__version?(Xe.needsLights&&Xe.lightsStateVersion!==gn.state.version||Xe.outputColorSpace!==Le||ae.isBatchedMesh&&Xe.batching===!1||!ae.isBatchedMesh&&Xe.batching===!0||ae.isBatchedMesh&&Xe.batchingColor===!0&&ae._colorsTexture===null||ae.isBatchedMesh&&Xe.batchingColor===!1&&ae._colorsTexture!==null||ae.isInstancedMesh&&Xe.instancing===!1||!ae.isInstancedMesh&&Xe.instancing===!0||ae.isSkinnedMesh&&Xe.skinning===!1||!ae.isSkinnedMesh&&Xe.skinning===!0||ae.isInstancedMesh&&Xe.instancingColor===!0&&ae.instanceColor===null||ae.isInstancedMesh&&Xe.instancingColor===!1&&ae.instanceColor!==null||ae.isInstancedMesh&&Xe.instancingMorph===!0&&ae.morphTexture===null||ae.isInstancedMesh&&Xe.instancingMorph===!1&&ae.morphTexture!==null||Xe.envMap!==Ge||ie.fog===!0&&Xe.fog!==Ie||Xe.numClippingPlanes!==void 0&&(Xe.numClippingPlanes!==Ke.numPlanes||Xe.numIntersection!==Ke.numIntersection)||Xe.vertexAlphas!==rt||Xe.vertexTangents!==ht||Xe.morphTargets!==Ye||Xe.morphNormals!==At||Xe.morphColors!==qt||Xe.toneMapping!==Wt||Xe.morphTargetsCount!==un||!!Xe.lightProbeGrid!=P.state.lightProbeGridArray.length>0)&&(ft=!0):(ft=!0,Xe.__version=ie.version);let zn=Xe.currentProgram;ft===!0&&(zn=Ca(ie,k,ae),j&&ie.isNodeMaterial&&j.onUpdateProgram(ie,zn,Xe));let ni=!1,Bn=!1,Da=!1;const Nt=zn.getUniforms(),Kt=Xe.uniforms;if(M.useProgram(zn.program)&&(ni=!0,Bn=!0,Da=!0),ie.id!==se&&(se=ie.id,Bn=!0),Xe.needsLights){const Ft=fs(P.state.lightProbeGridArray,ae);Xe.lightProbeGrid!==Ft&&(Xe.lightProbeGrid=Ft,Bn=!0)}if(ni||H!==b){M.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Nt.setValue(Q,"projectionMatrix",b.projectionMatrix),Nt.setValue(Q,"viewMatrix",b.matrixWorldInverse);const Fi=Nt.map.cameraPosition;Fi!==void 0&&Fi.setValue(Q,kt.setFromMatrixPosition(b.matrixWorld)),B.logarithmicDepthBuffer&&Nt.setValue(Q,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(ie.isMeshPhongMaterial||ie.isMeshToonMaterial||ie.isMeshLambertMaterial||ie.isMeshBasicMaterial||ie.isMeshStandardMaterial||ie.isShaderMaterial)&&Nt.setValue(Q,"isOrthographic",b.isOrthographicCamera===!0),H!==b&&(H=b,Bn=!0,Da=!0)}if(Xe.needsLights&&(gn.state.sunShadowMap.length>0&&Nt.setValue(Q,"sunShadowMap",gn.state.sunShadowMap,ge),gn.state.directionalShadowMap.length>0&&Nt.setValue(Q,"directionalShadowMap",gn.state.directionalShadowMap,ge),gn.state.spotShadowMap.length>0&&Nt.setValue(Q,"spotShadowMap",gn.state.spotShadowMap,ge),gn.state.pointShadowMap.length>0&&Nt.setValue(Q,"pointShadowMap",gn.state.pointShadowMap,ge)),ae.isSkinnedMesh){Nt.setOptional(Q,ae,"bindMatrix"),Nt.setOptional(Q,ae,"bindMatrixInverse");const Ft=ae.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),Nt.setValue(Q,"boneTexture",Ft.boneTexture,ge))}ae.isBatchedMesh&&(Nt.setOptional(Q,ae,"batchingTexture"),Nt.setValue(Q,"batchingTexture",ae._matricesTexture,ge),Nt.setOptional(Q,ae,"batchingIdTexture"),Nt.setValue(Q,"batchingIdTexture",ae._indirectTexture,ge),Nt.setOptional(Q,ae,"batchingColorTexture"),ae._colorsTexture!==null&&Nt.setValue(Q,"batchingColorTexture",ae._colorsTexture,ge));const pi=he.morphAttributes;if((pi.position!==void 0||pi.normal!==void 0||pi.color!==void 0)&&q.update(ae,he,zn),(Bn||Xe.receiveShadow!==ae.receiveShadow)&&(Xe.receiveShadow=ae.receiveShadow,Nt.setValue(Q,"receiveShadow",ae.receiveShadow)),(ie.isMeshStandardMaterial||ie.isMeshLambertMaterial||ie.isMeshPhongMaterial)&&ie.envMap===null&&k.environment!==null&&(Kt.envMapIntensity.value=k.environmentIntensity),Kt.dfgLUT!==void 0&&(Kt.dfgLUT.value=C1()),Bn){if(Nt.setValue(Q,"toneMappingExposure",X.toneMappingExposure),Xe.needsLights&&cn(Kt,Da),Ie&&ie.fog===!0&&Ve.refreshFogUniforms(Kt,Ie),Ve.refreshMaterialUniforms(Kt,ie,me,re,P.state.transmissionRenderTarget[b.id]),Xe.needsLights&&Xe.lightProbeGrid){const Ft=Xe.lightProbeGrid;Kt.probesSH.value=Ft.texture,Kt.probesMin.value.copy(Ft.boundingBox.min),Kt.probesMax.value.copy(Ft.boundingBox.max),Kt.probesResolution.value.copy(Ft.resolution)}Qc.upload(Q,Ji(Xe),Kt,ge)}if(ie.isShaderMaterial&&ie.uniformsNeedUpdate===!0&&(Qc.upload(Q,Ji(Xe),Kt,ge),ie.uniformsNeedUpdate=!1),ie.isSpriteMaterial&&Nt.setValue(Q,"center",ae.center),Nt.setValue(Q,"modelViewMatrix",ae.modelViewMatrix),Nt.setValue(Q,"normalMatrix",ae.normalMatrix),Nt.setValue(Q,"modelMatrix",ae.matrixWorld),ie.uniformsGroups!==void 0){const Ft=ie.uniformsGroups;for(let Fi=0,Ri=Ft.length;Fi<Ri;Fi++){const mi=Ft[Fi];Te.update(mi,zn),Te.bind(mi,zn)}}return zn}function cn(b,k){b.ambientLightColor.needsUpdate=k,b.lightProbe.needsUpdate=k,b.sunLights.needsUpdate=k,b.sunLightShadows.needsUpdate=k,b.directionalLights.needsUpdate=k,b.directionalLightShadows.needsUpdate=k,b.pointLights.needsUpdate=k,b.pointLightShadows.needsUpdate=k,b.spotLights.needsUpdate=k,b.spotLightShadows.needsUpdate=k,b.rectAreaLights.needsUpdate=k,b.hemisphereLights.needsUpdate=k}function hl(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return N},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return fe},this.setRenderTargetTextures=function(b,k,he){const ie=ue.get(b);ie.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,ie.__autoAllocateDepthBuffer===!1&&(ie.__useRenderToTexture=!1),ue.get(b.texture).__webglTexture=k,ue.get(b.depthTexture).__webglTexture=ie.__autoAllocateDepthBuffer?void 0:he,ie.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,k){const he=ue.get(b);he.__webglFramebuffer=k,he.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(b,k=0,he=0){fe=b,N=k,V=he;let ie=null,ae=!1,Ie=!1;if(b){const Le=ue.get(b);if(Le.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(Q.FRAMEBUFFER,Le.__webglFramebuffer),C.copy(b.viewport),Y.copy(b.scissor),ee=b.scissorTest,M.viewport(C),M.scissor(Y),M.setScissorTest(ee),se=-1;return}else if(Le.__webglFramebuffer===void 0)ge.setupRenderTarget(b);else if(Le.__hasExternalTextures)ge.rebindTextures(b,ue.get(b.texture).__webglTexture,ue.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const rt=b.depthTexture;if(Le.__boundDepthTexture!==rt){if(rt!==null&&ue.has(rt)&&(b.width!==rt.image.width||b.height!==rt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ge.setupDepthRenderbuffer(b)}}const He=b.texture;(He.isData3DTexture||He.isDataArrayTexture||He.isCompressedArrayTexture)&&(Ie=!0);const Ge=ue.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ge[k])?ie=Ge[k][he]:ie=Ge[k],ae=!0):b.samples>0&&ge.useMultisampledRTT(b)===!1?ie=ue.get(b).__webglMultisampledFramebuffer:Array.isArray(Ge)?ie=Ge[he]:ie=Ge,C.copy(b.viewport),Y.copy(b.scissor),ee=b.scissorTest}else C.copy(Oe).multiplyScalar(me).floor(),Y.copy(ot).multiplyScalar(me).floor(),ee=en;if(he!==0&&(ie=oe),M.bindFramebuffer(Q.FRAMEBUFFER,ie)&&M.drawBuffers(b,ie),M.viewport(C),M.scissor(Y),M.setScissorTest(ee),ae){const Le=ue.get(b.texture);Q.framebufferTexture2D(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_CUBE_MAP_POSITIVE_X+k,Le.__webglTexture,he)}else if(Ie){const Le=k;for(let He=0;He<b.textures.length;He++){const Ge=ue.get(b.textures[He]);Q.framebufferTextureLayer(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0+He,Ge.__webglTexture,he,Le)}}else if(b!==null&&he!==0){const Le=ue.get(b.texture);Q.framebufferTexture2D(Q.FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_2D,Le.__webglTexture,he)}se=-1};function Qr(b){const k=ue.get(b);return(k.__readFormat!==b.format||k.__readType!==b.type)&&(k.__readFormat=b.format,k.__readType=b.type,k.__formatReadable=B.textureFormatReadable(b.format),k.__typeReadable=B.textureTypeReadable(b.type)),k}this.readRenderTargetPixels=function(b,k,he,ie,ae,Ie,ke,Le=0){if(!(b&&b.isWebGLRenderTarget)){wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let He=ue.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ke!==void 0&&(He=He[ke]),He){M.bindFramebuffer(Q.FRAMEBUFFER,He);try{const Ge=b.textures[Le],rt=Ge.format,ht=Ge.type;b.textures.length>1&&Q.readBuffer(Q.COLOR_ATTACHMENT0+Le);const Ye=Qr(Ge);if(Ye.__formatReadable===!1){wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ye.__typeReadable===!1){wt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=b.width-ie&&he>=0&&he<=b.height-ae&&Q.readPixels(k,he,ie,ae,we.convert(rt),we.convert(ht),Ie)}finally{const Ge=fe!==null?ue.get(fe).__webglFramebuffer:null;M.bindFramebuffer(Q.FRAMEBUFFER,Ge)}}},this.readRenderTargetPixelsAsync=async function(b,k,he,ie,ae,Ie,ke,Le=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let He=ue.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ke!==void 0&&(He=He[ke]),He)if(k>=0&&k<=b.width-ie&&he>=0&&he<=b.height-ae){M.bindFramebuffer(Q.FRAMEBUFFER,He);const Ge=b.textures[Le],rt=Ge.format,ht=Ge.type;b.textures.length>1&&Q.readBuffer(Q.COLOR_ATTACHMENT0+Le);const Ye=Qr(Ge);if(Ye.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ye.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const At=Q.createBuffer();Q.bindBuffer(Q.PIXEL_PACK_BUFFER,At),Q.bufferData(Q.PIXEL_PACK_BUFFER,Ie.byteLength,Q.STREAM_READ),Q.readPixels(k,he,ie,ae,we.convert(rt),we.convert(ht),0),Q.bindBuffer(Q.PIXEL_PACK_BUFFER,null);const qt=fe!==null?ue.get(fe).__webglFramebuffer:null;M.bindFramebuffer(Q.FRAMEBUFFER,qt);const Wt=Q.fenceSync(Q.SYNC_GPU_COMMANDS_COMPLETE,0);return Q.flush(),await kM(Q,Wt,4),Q.bindBuffer(Q.PIXEL_PACK_BUFFER,At),Q.getBufferSubData(Q.PIXEL_PACK_BUFFER,0,Ie),Q.bindBuffer(Q.PIXEL_PACK_BUFFER,null),Q.deleteBuffer(At),Q.deleteSync(Wt),Ie}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,k=null,he=0){const ie=Math.pow(2,-he),ae=Math.floor(b.image.width*ie),Ie=Math.floor(b.image.height*ie),ke=k!==null?k.x:0,Le=k!==null?k.y:0;ge.setTexture2D(b,0),Q.copyTexSubImage2D(Q.TEXTURE_2D,he,0,0,ke,Le,ae,Ie),M.unbindTexture()},this.copyTextureToTexture=function(b,k,he=null,ie=null,ae=0,Ie=0){let ke,Le,He,Ge,rt,ht,Ye,At,qt;const Wt=b.isCompressedTexture?b.mipmaps[Ie]:b.image;if(he!==null)ke=he.max.x-he.min.x,Le=he.max.y-he.min.y,He=he.isBox3?he.max.z-he.min.z:1,Ge=he.min.x,rt=he.min.y,ht=he.isBox3?he.min.z:0;else{const Kt=Math.pow(2,-ae);ke=Math.floor(Wt.width*Kt),Le=Math.floor(Wt.height*Kt),b.isDataArrayTexture?He=Wt.depth:b.isData3DTexture?He=Math.floor(Wt.depth*Kt):He=1,Ge=0,rt=0,ht=0}ie!==null?(Ye=ie.x,At=ie.y,qt=ie.z):(Ye=0,At=0,qt=0);const ut=we.convert(k.format),un=we.convert(k.type);let Xe;k.isData3DTexture?(ge.setTexture3D(k,0),Xe=Q.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(ge.setTexture2DArray(k,0),Xe=Q.TEXTURE_2D_ARRAY):(ge.setTexture2D(k,0),Xe=Q.TEXTURE_2D),M.activeTexture(Q.TEXTURE0),M.pixelStorei(Q.UNPACK_FLIP_Y_WEBGL,k.flipY),M.pixelStorei(Q.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),M.pixelStorei(Q.UNPACK_ALIGNMENT,k.unpackAlignment);const gn=M.getParameter(Q.UNPACK_ROW_LENGTH),ft=M.getParameter(Q.UNPACK_IMAGE_HEIGHT),zn=M.getParameter(Q.UNPACK_SKIP_PIXELS),ni=M.getParameter(Q.UNPACK_SKIP_ROWS),Bn=M.getParameter(Q.UNPACK_SKIP_IMAGES);M.pixelStorei(Q.UNPACK_ROW_LENGTH,Wt.width),M.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,Wt.height),M.pixelStorei(Q.UNPACK_SKIP_PIXELS,Ge),M.pixelStorei(Q.UNPACK_SKIP_ROWS,rt),M.pixelStorei(Q.UNPACK_SKIP_IMAGES,ht);const Da=b.isDataArrayTexture||b.isData3DTexture,Nt=k.isDataArrayTexture||k.isData3DTexture;if(b.isDepthTexture){const Kt=ue.get(b),pi=ue.get(k),Ft=ue.get(Kt.__renderTarget),Fi=ue.get(pi.__renderTarget);M.bindFramebuffer(Q.READ_FRAMEBUFFER,Ft.__webglFramebuffer),M.bindFramebuffer(Q.DRAW_FRAMEBUFFER,Fi.__webglFramebuffer);for(let Ri=0;Ri<He;Ri++)Da&&(Q.framebufferTextureLayer(Q.READ_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,ue.get(b).__webglTexture,ae,ht+Ri),Q.framebufferTextureLayer(Q.DRAW_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,ue.get(k).__webglTexture,Ie,qt+Ri)),Q.blitFramebuffer(Ge,rt,ke,Le,Ye,At,ke,Le,Q.DEPTH_BUFFER_BIT,Q.NEAREST);M.bindFramebuffer(Q.READ_FRAMEBUFFER,null),M.bindFramebuffer(Q.DRAW_FRAMEBUFFER,null)}else if(ae!==0||b.isRenderTargetTexture||ue.has(b)){const Kt=ue.get(b),pi=ue.get(k);M.bindFramebuffer(Q.READ_FRAMEBUFFER,Z),M.bindFramebuffer(Q.DRAW_FRAMEBUFFER,ne);for(let Ft=0;Ft<He;Ft++)Da?Q.framebufferTextureLayer(Q.READ_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Kt.__webglTexture,ae,ht+Ft):Q.framebufferTexture2D(Q.READ_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_2D,Kt.__webglTexture,ae),Nt?Q.framebufferTextureLayer(Q.DRAW_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,pi.__webglTexture,Ie,qt+Ft):Q.framebufferTexture2D(Q.DRAW_FRAMEBUFFER,Q.COLOR_ATTACHMENT0,Q.TEXTURE_2D,pi.__webglTexture,Ie),ae!==0?Q.blitFramebuffer(Ge,rt,ke,Le,Ye,At,ke,Le,Q.COLOR_BUFFER_BIT,Q.NEAREST):Nt?Q.copyTexSubImage3D(Xe,Ie,Ye,At,qt+Ft,Ge,rt,ke,Le):Q.copyTexSubImage2D(Xe,Ie,Ye,At,Ge,rt,ke,Le);M.bindFramebuffer(Q.READ_FRAMEBUFFER,null),M.bindFramebuffer(Q.DRAW_FRAMEBUFFER,null)}else Nt?b.isDataTexture||b.isData3DTexture?Q.texSubImage3D(Xe,Ie,Ye,At,qt,ke,Le,He,ut,un,Wt.data):k.isCompressedArrayTexture?Q.compressedTexSubImage3D(Xe,Ie,Ye,At,qt,ke,Le,He,ut,Wt.data):Q.texSubImage3D(Xe,Ie,Ye,At,qt,ke,Le,He,ut,un,Wt):b.isDataTexture?Q.texSubImage2D(Q.TEXTURE_2D,Ie,Ye,At,ke,Le,ut,un,Wt.data):b.isCompressedTexture?Q.compressedTexSubImage2D(Q.TEXTURE_2D,Ie,Ye,At,Wt.width,Wt.height,ut,Wt.data):Q.texSubImage2D(Q.TEXTURE_2D,Ie,Ye,At,ke,Le,ut,un,Wt);M.pixelStorei(Q.UNPACK_ROW_LENGTH,gn),M.pixelStorei(Q.UNPACK_IMAGE_HEIGHT,ft),M.pixelStorei(Q.UNPACK_SKIP_PIXELS,zn),M.pixelStorei(Q.UNPACK_SKIP_ROWS,ni),M.pixelStorei(Q.UNPACK_SKIP_IMAGES,Bn),Ie===0&&k.generateMipmaps&&Q.generateMipmap(Xe),M.unbindTexture()},this.initRenderTarget=function(b){ue.get(b).__webglFramebuffer===void 0&&ge.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?ge.setTextureCube(b,0):b.isData3DTexture?ge.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?ge.setTexture2DArray(b,0):ge.setTexture2D(b,0),M.unbindTexture()},this.resetState=function(){N=0,V=0,fe=null,M.reset(),Be.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ji}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const i=this.getContext();i.drawingBufferColorSpace=Et._getDrawingBufferColorSpace(e),i.unpackColorSpace=Et._getUnpackColorSpace()}}const tl=.514444,Ma=Math.PI/180,$n=(r,e,i)=>Math.min(i,Math.max(e,r)),Fs=r=>(r%360+360)%360,Xv=(r,e)=>(r-e+540)%360-180,ru=(r,e)=>Fs(Math.atan2(e.x-r.x,-(e.z-r.z))/Ma),ou=(r,e)=>Math.hypot(r.x-e.x,r.z-e.z),Ps=[{id:"first-light",name:"FIRST LIGHT",subtitle:"Intercept a merchant convoy at dawn",time:"05:42",objective:6200,escortSkill:.6,description:"Three freighters are passing across your bow. Find the solution, launch, then evade the destroyer."},{id:"black-water",name:"BLACK WATER",subtitle:"Undercover at midnight",time:"01:16",objective:5e3,escortSkill:.78,description:"A dim night horizon. Sound matters more than sight; survive an aggressive escort search."},{id:"iron-ring",name:"IRON RING",subtitle:"A heavily defended transport group",time:"06:04",objective:12e3,escortSkill:1,description:"High-value ships, two alert escorts, limited time. Patience and stealth are rewarded."}];function Jc(r,e=1){return{x:Math.sin(r*Ma)*e,z:-Math.cos(r*Ma)*e}}function sh(r,e,i){return r+$n(e-r,-i,i)}function av(r,e,i){return Fs(r+$n(Xv(e,r),-i,i))}function Pr(r){let e=r.rng|0;return e^=e<<13,e^=e>>>17,e^=e<<5,r.rng=e,(e>>>0)/4294967296}function Gn(r,e){r.logs.unshift(e),r.logs.length=Math.min(12,r.logs.length)}function D1(r="first-light",e=19430312){const i=Ps.find(c=>c.id===r)||Ps[0],s={x:0,z:0,heading:75,orderedHeading:75,speed:3.5,orderedSpeed:3.5,depth:45,orderedDepth:45,hull:100,battery:98,torpedoes:12,tubes:[0,0,0,0],quiet:!1,mast:1,mastTarget:1,scopeYaw:75,scopePitch:0,zoom:2,gyro:0,selectedTube:0},l=[];for(let c=0;c<3;c++)l.push({id:"M"+(c+1),name:["AKAGI MARU","HOKUTO MARU","SHINSEI MARU"][c],kind:"merchant",x:1730+c*520,z:-460+c%2*165,heading:270,speed:9.2+c*.45,length:[146,131,167][c],health:100,tonnage:[6800,5300,7900][c],sunk:!1,search:0,cooldown:0,wake:0});return l.push({id:"E1",name:"ESCORT ONE",kind:"escort",x:2450,z:-930,heading:250,speed:15,length:107,health:100,tonnage:1650,sunk:!1,search:0,cooldown:24,wake:0}),i.escortSkill>=1&&l.push({id:"E2",name:"ESCORT TWO",kind:"escort",x:1550,z:-1450,heading:235,speed:16,length:100,health:100,tonnage:1650,sunk:!1,search:0,cooldown:30,wake:0}),{player:s,ships:l,weapons:[],impacts:[],mission:i,elapsed:0,clockMinutes:i.time==="01:16"?76:i.time==="06:04"?364:342,paused:!1,speedFactor:1,status:"running",tonnage:0,shots:0,hits:0,alerts:0,logs:["CONVOY REPORTED. MAKE READY FOR ACTION."],seed:e,nextId:1,selectedShip:"M1",station:"scope",missionEnded:!1,rng:e}}function Ir(r,e){const i=r.player;if(e.type==="STATION"){r.station=e.value;return}if(e.type==="PAUSE"){r.paused=!r.paused;return}if(r.status==="running")switch(e.type){case"HEADING":i.orderedHeading=Fs(e.value);break;case"SPEED":i.orderedSpeed=$n(e.value,0,20);break;case"DEPTH":i.orderedDepth=$n(e.value,0,400),i.orderedDepth>55&&(i.mastTarget=0);break;case"SCOPE_YAW":i.scopeYaw=Fs(e.value);break;case"SCOPE_PITCH":i.scopePitch=$n(e.value,-21,23);break;case"ZOOM":i.zoom=$n(e.value,1,6);break;case"GYRO":i.gyro=$n(e.value,-55,55);break;case"MAST":if(e.value>0&&i.depth>58){Gn(r,"TOO DEEP — RISE TO PERISCOPE DEPTH FIRST");break}i.mastTarget=$n(e.value,0,1),Gn(r,e.value>0?"RAISING PERISCOPE MAST":"LOWERING PERISCOPE MAST");break;case"TUBE":i.selectedTube=$n(Math.round(e.value),0,3);break;case"FACTOR":r.speedFactor=[1,4,12].includes(e.value)?e.value:1;break;case"QUIET":i.quiet=!i.quiet,i.quiet&&(i.orderedSpeed=Math.min(3,i.orderedSpeed)),Gn(r,i.quiet?"SILENT RUNNING":"NORMAL RUNNING");break;case"REPAIR":i.hull=$n(i.hull+6,0,100),Gn(r,"DAMAGE PARTY REPORTS REPAIRS");break;case"SOLVE":{const s=r.ships.find(l=>l.id===r.selectedShip&&!l.sunk);if(s){const l=N1(i,s);l&&(i.gyro=$n(Xv(l.bearing,i.scopeYaw),-55,55),Gn(r,"TDC LEAD SOLUTION "+l.bearing.toFixed(1)+"°"))}break}case"FIRE":{const s=i.selectedTube;if(i.torpedoes<=0||i.tubes[s]>0){Gn(r,"TUBE "+(s+1)+" UNAVAILABLE");break}if(i.depth>95){Gn(r,"TOO DEEP TO FIRE");break}const l=Fs(i.scopeYaw+i.gyro);r.weapons.push({x:i.x,z:i.z,heading:l,speed:43,age:0,tube:s}),i.tubes[s]=28,i.torpedoes--,r.shots++,r.alerts=1,r.speedFactor=1,Gn(r,"TUBE "+(s+1)+" — TORPEDO AWAY, BEARING "+l.toFixed(0)+"°");break}}}function N1(r,e,i=43){const s=Jc(e.heading,e.speed*tl),l={x:e.x-r.x,z:e.z-r.z},c=i*tl,d=s.x*s.x+s.z*s.z-c*c,p=2*(l.x*s.x+l.z*s.z),m=l.x*l.x+l.z*l.z,h=p*p-4*d*m;if(h<0||Math.abs(d)<1e-10)return null;const S=[(-p+Math.sqrt(h))/(2*d),(-p-Math.sqrt(h))/(2*d)].filter(g=>g>0).sort((g,E)=>g-E)[0];return Number.isFinite(S)?{bearing:Fs(Math.atan2(l.x+s.x*S,-(l.z+s.z*S))/Ma),seconds:S}:null}function U1(r,e=1/30){if(r.paused||r.status!=="running")return;const i=r.player;r.elapsed+=e,r.clockMinutes+=e/60,i.heading=av(i.heading,i.orderedHeading,3.5*e),i.speed=sh(i.speed,i.quiet?Math.min(3,i.orderedSpeed):i.orderedSpeed,1.8*e),i.depth=sh(i.depth,i.orderedDepth,8*e),i.depth>58&&(i.mastTarget=0),i.mast=sh(i.mast,i.mastTarget,.33*e);const s=Jc(i.heading,i.speed*tl);i.x+=s.x*e,i.z+=s.z*e,i.battery=$n(i.battery-(i.depth>15?.013+.026*(i.speed/13)**2:-.008)*e,0,100);for(let l=0;l<4;l++)i.tubes[l]=Math.max(0,i.tubes[l]-e);for(const l of r.ships){if(l.sunk)continue;if(l.kind==="escort"&&r.alerts){const d=ou(l,i);l.heading=av(l.heading,ru(l,i)+(Pr(r)-.5)*(i.quiet?36:12),r.mission.escortSkill*2*e),l.speed=17+r.mission.escortSkill*4,l.cooldown-=e,d<530&&l.cooldown<=0&&(l.cooldown=14+Pr(r)*10,r.impacts.push({x:i.x+(Pr(r)-.5)*145,z:i.z+(Pr(r)-.5)*145,age:0,type:"charge"}),d<185&&Pr(r)>.4?(i.hull=$n(i.hull-(12+Pr(r)*14),0,100),Gn(r,"DEPTH CHARGE — HULL DAMAGE")):Gn(r,"DEPTH CHARGES — CLOSE ABOARD"),r.speedFactor=1)}const c=Jc(l.heading,l.speed*tl);l.x+=c.x*e,l.z+=c.z*e,l.wake+=e}for(const l of r.weapons){const c=Jc(l.heading,l.speed*tl);l.x+=c.x*e,l.z+=c.z*e,l.age+=e;for(const d of r.ships)if(!d.sunk&&ou(l,d)<Math.max(19,d.length*.32)){d.health-=110,l.age=1e3,r.hits++,r.impacts.push({x:d.x,z:d.z,age:0,type:"torpedo"}),Gn(r,"IMPACT — "+d.name),d.health<=0&&(d.sunk=!0,r.tonnage+=d.tonnage,Gn(r,d.name+" SINKING · "+d.tonnage+" GRT"));break}}r.weapons=r.weapons.filter(l=>l.age<270),r.impacts.forEach(l=>l.age+=e),r.impacts=r.impacts.filter(l=>l.age<7),r.alerts&&(r.alerts=Math.max(0,r.alerts-e/(i.quiet?110:150))),i.hull<=0?(r.status="lost",Gn(r,"SUBMARINE LOST")):r.tonnage>=r.mission.objective&&!r.alerts?(r.status="won",Gn(r,"MISSION COMPLETE — ESCAPED ENEMY ESCORTS")):r.elapsed>1600&&(r.status=r.tonnage>=r.mission.objective?"won":"finished",Gn(r,"PATROL RECALLED"))}function L1(r){return r.ships.filter(e=>!e.sunk).map(e=>({id:e.id,name:e.name,type:e.kind,bearing:ru(r.player,e),range:ou(r.player,e),speed:e.speed})).sort((e,i)=>e.range-i.range)}function Ls(r){return Math.round(Fs(r)).toString().padStart(3,"0")+"°"}function O1(r){const e=Math.floor(r.clockMinutes/60)%24,i=Math.floor(r.clockMinutes%60);return String(e).padStart(2,"0")+":"+String(i).padStart(2,"0")}const P1=["uniform float uTime; varying vec3 vWorld; varying float vWave;","float wave(vec2 p){return sin(p.x*.021+p.y*.011+uTime*1.14)*.55+sin(p.y*.035-p.x*.009-uTime*.86)*.35+sin((p.x+p.y)*.092+uTime*2.05)*.10;}","void main(){vec3 p=position;p.y+=wave(p.xz);vec4 w=modelMatrix*vec4(p,1.);vWorld=w.xyz;vWave=p.y;gl_Position=projectionMatrix*viewMatrix*w;}"].join(`
`),I1=["precision highp float; uniform float uTime; uniform vec3 uEye; uniform vec3 uSun; uniform float uNight; varying vec3 vWorld; varying float vWave;","float wv(vec2 p){return sin(p.x*.021+p.y*.011+uTime*1.14)*.55+sin(p.y*.035-p.x*.009-uTime*.86)*.35+sin((p.x+p.y)*.092+uTime*2.05)*.10;}","void main(){vec2 p=vWorld.xz;float e=.25;vec3 n=normalize(vec3((wv(p-vec2(e,0.))-wv(p+vec2(e,0.)))/(e*2.),1.,(wv(p-vec2(0.,e))-wv(p+vec2(0.,e)))/(e*2.)));","vec3 toEye=normalize(uEye-vWorld);vec3 sun=normalize(uSun);float ndl=max(0.,dot(n,sun));","float glint=pow(max(0.,dot(reflect(-sun,n),toEye)),56.)*1.9+pow(max(0.,dot(reflect(-sun,n),toEye)),230.)*2.4;","float fresnel=pow(1.-max(0.,dot(n,toEye)),2.);float deep=.18+.08*sin(p.x*.014+p.y*.022+uTime*.4);","vec3 dark=mix(vec3(.012,.055,.086),vec3(.038,.14,.19),clamp(ndl*.5+deep,0.,1.));","vec3 col=mix(dark,vec3(.13,.24,.29),fresnel*.56);col+=vec3(1.,.55,.31)*glint*(1.-uNight*.72);","float foam=smoothstep(.75,1.1,abs(vWave))*.07;col+=vec3(.26,.43,.48)*foam;","float dist=distance(vWorld.xz,uEye.xz);float fog=1.-exp(-dist*.00028);","col=mix(col,mix(vec3(.56,.50,.48),vec3(.16,.27,.35),uNight),fog*.72);","col=mix(col,col*.33,uNight*.68);gl_FragColor=vec4(col,1.);}"].join(`
`),z1="varying vec3 vDir;void main(){vDir=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",B1=["precision highp float;varying vec3 vDir;uniform vec3 uSun;uniform float uNight;","float noise(vec2 p){return sin(p.x*4.1+sin(p.y*2.8))*sin(p.y*3.8+cos(p.x*3.2));}","void main(){vec3 d=normalize(vDir);float h=clamp(d.y*2.,0.,1.);","vec3 horizon=mix(vec3(.84,.48,.32),vec3(.44,.54,.62),smoothstep(.03,.60,d.y));","vec3 zenith=vec3(.055,.12,.22);vec3 sky=mix(horizon,zenith,smoothstep(.12,.96,d.y));","float cloud=noise(d.xz*9.+d.y*4.)*.5+noise(d.xz*24.)*.25+noise(d.xz*53.)*.12;","float cloudBand=smoothstep(.12,.35,cloud)*(.6-smoothstep(.36,.88,d.y)*.35);","sky=mix(sky,vec3(.14,.18,.25),cloudBand*.65);","float s=dot(d,normalize(uSun));float sun=pow(max(0.,s),4500.);float halo=pow(max(0.,s),34.);","sky+=vec3(1.,.58,.31)*halo*.65+vec3(1.,.82,.59)*sun*1.3;","vec3 night= mix(vec3(.025,.048,.078),vec3(.006,.015,.032),h);","sky=mix(sky,night,uNight);gl_FragColor=vec4(sky,1.);}"].join(`
`);function zr(r,e=.15,i=.78){return new Ey({color:r,metalness:e,roughness:i,flatShading:!1})}function ss(r,e,i,s,l,c,d,p){const m=new Tn(new Yr(e,i,s),p);return m.position.set(l,c,d),r.add(m),m}function Ko(r,e,i,s,l,c,d,p){const m=new Tn(new cl(e,i,s,10),p);return m.position.set(l,c,d),r.add(m),m}function Os(r,e,i,s,l){const c=e.clone().add(i).multiplyScalar(.5),d=i.clone().sub(e),p=new Tn(new cl(s,s,d.length(),6),l);p.position.copy(c),p.quaternion.setFromUnitVectors(new $(0,1,0),d.normalize()),r.add(p)}function F1(r){const e=new Bs;e.name=r.name;const i=zr(r.kind==="merchant"?3161669:4608346,.28,.66),s=zr(1648427,.17,.78),l=zr(4999749,.15,.85),c=zr(9277840,.12,.72),d=zr(7499867,.36,.62),p=zr(1778215,.05,.87),m=r.length,h=r.kind==="merchant"?19:11,x=-m*.5,S=m*.5,g=[[-.5,.05],[-.44,.7],[-.31,1],[-.03,1],[.25,.97],[.43,.77],[.5,.42]],E=[],A=[];for(const[_,I]of g){const O=_*m,w=h*I*.5;E.push(-w,5,O,w,5,O,-w,-4.8,O,w,-4.8,O)}for(let _=0;_<g.length-1;_++){const I=_*4,O=I+4;A.push(I,O,I+2,I+2,O,O+2,I+1,I+3,O+1,I+3,O+3,O+1,I,O,I+1,I+1,O,O+1,I+2,I+3,O+2,I+3,O+3,O+2)}const D=new ei;D.setAttribute("position",new vn(E,3)),D.setIndex(A),D.computeVertexNormals();const y=new Tn(D,i);y.material.side=Oi,e.add(y),ss(e,h*.86,.7,m*.76,0,5.4,0,l);for(const _ of[-m*.25,-m*.06,m*.13])ss(e,h*.78,.9,m*.12,0,6,_,s),ss(e,h*.7,.25,m*.13,0,6.55,_,d);ss(e,h*.77,7,m*.16,0,9.2,m*.31,c),ss(e,h*.52,4,m*.08,0,14,m*.31,c),ss(e,h*.68,.8,m*.18,0,16.35,m*.31,s);for(let _ of[-1,1])for(let I=0;I<4;I++)ss(e,.18,1,1.6,_*h*.29,12.5,m*(.26+I*.028),p);Ko(e,2.2,2.55,10,0,21,m*.39,i),Ko(e,2.23,2.23,2,0,26.6,m*.39,p);for(const _ of[-m*.3,m*.18])Os(e,new $(0,5.9,_),new $(0,32,_),.32,d),Os(e,new $(-h*.46,22,_),new $(h*.46,22,_),.22,d),Os(e,new $(0,32,_),new $(h*.46,6,_-12),.06,p),Os(e,new $(0,32,_),new $(-h*.46,6,_+12),.06,p);for(const _ of[-m*.18,m*.07])Ko(e,1.1,1.2,5,0,8,_,d),Os(e,new $(0,10,_),new $(h*.43,18,_+17),.23,d);for(const _ of[-1,1]){const I=_*h*.46;for(let O=x+m*.12;O<S-m*.1;O+=6)Os(e,new $(I,6,O),new $(I,8.1,O),.075,c);Os(e,new $(I,8.1,x+m*.12),new $(I,8.1,S-m*.1),.055,c)}return r.kind==="escort"&&(ss(e,h*.7,3,m*.2,0,8,-m*.1,i),Ko(e,3,3,3,0,8,-m*.34,i),Ko(e,3,3,3,0,8,m*.35,i)),e}function H1(){const r=new ei;r.setAttribute("position",new vn(new Float32Array(720),3).setUsage(HM));const e=new Dv({color:11981004,transparent:!0,opacity:.55,depthWrite:!1});return new gy(r,e)}function G1(){const r=new Bs,e=new fu({color:2371641,transparent:!0,opacity:.15,depthWrite:!1});for(let i=0;i<8;i++){const s=new Tn(new du(1,8,6),e.clone());s.scale.setScalar(2+i*.5),r.add(s)}return r}class V1{constructor(e){this.container=e,this.renderer=new w1({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65)),this.renderer.outputColorSpace=di,this.renderer.toneMapping=Qh,this.renderer.toneMappingExposure=1.2,this.renderer.setClearColor(1120807,1),this.renderer.domElement.className="ocean-canvas",e.appendChild(this.renderer.domElement),this.scene.fog=new op(8358802,34e-5),this.scene.add(new Ay(10930144,3750975,2.1));const i=new wy(16760196,2.7);i.position.copy(this.sun.clone().multiplyScalar(2800)),this.scene.add(i),this.skyUniforms={uSun:{value:this.sun},uNight:{value:0}},this.sky=new Tn(new du(7800,40,22),new Ai({uniforms:this.skyUniforms,vertexShader:z1,fragmentShader:B1,side:Vn,depthWrite:!1,fog:!1})),this.sky.frustumCulled=!1,this.scene.add(this.sky),this.waterUniforms={uTime:{value:0},uEye:{value:new $},uSun:{value:this.sun},uNight:{value:0}};const s=new ul(1e4,1e4,180,180);s.rotateX(-Math.PI/2),this.water=new Tn(s,new Ai({uniforms:this.waterUniforms,vertexShader:P1,fragmentShader:I1,side:Oi,depthWrite:!0})),this.water.frustumCulled=!1,this.scene.add(this.water),this.observer=new ResizeObserver(()=>this.resize()),this.observer.observe(e),this.resize()}container;scene=new sy;camera=new bi(16,1,.15,1e4);renderer;water;sky;ships=new Map;splashes=new Map;sun=new $(.94,.075,-.32).normalize();lastW=0;lastH=0;observer;time=0;waterUniforms;skyUniforms;resize(){const e=this.container.clientWidth,i=this.container.clientHeight;e<2||i<2||e===this.lastW&&i===this.lastH||(this.lastW=e,this.lastH=i,this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,i,!1))}syncShips(e){for(const i of e.ships){let s=this.ships.get(i.id);if(!s){const h=F1(i);this.scene.add(h);const x=H1();this.scene.add(x);const S=G1();this.scene.add(S),s={group:h,wake:x,smoke:S},this.ships.set(i.id,s)}if(s.group.visible=!i.sunk,s.wake.visible=!i.sunk,s.smoke.visible=!i.sunk&&i.kind==="merchant",i.sunk)continue;const l=Math.sin(this.time*.66+i.x*.003)*.56+Math.sin(this.time*1.12+i.z*.003)*.31;s.group.position.set(i.x,l,i.z),s.group.rotation.set(Math.sin(this.time*.39+i.x)*.011,-i.heading*Ma,Math.sin(this.time*.65+i.z)*.021);const c=s.wake.geometry.getAttribute("position"),d=new _t(Math.sin(i.heading*Ma),-Math.cos(i.heading*Ma)),p=new _t(-d.y,d.x);for(let h=0;h<120;h++){const x=6+h*1.65,S=2+x*.15,g=h%2?1:-1,E=Math.sin(this.time*.65+h*.78)*2.1,A=i.x-d.x*(i.length*.5+x)+p.x*(g*S+E),D=i.z-d.y*(i.length*.5+x)+p.y*(g*S+E);c.setXYZ(h*2,A,.28+Math.sin(this.time+h)*.15,D),c.setXYZ(h*2+1,A-d.x*2.5,.24,D-d.y*2.5)}c.needsUpdate=!0,s.wake.geometry.computeBoundingSphere(),s.smoke.position.set(i.x+d.x*i.length*.39,0,i.z+d.y*i.length*.39);let m=0;for(const h of s.smoke.children){const x=(this.time*.4+m/8)%1;h.position.set(-d.x*x*22,27+x*48,-d.y*x*22),h.scale.setScalar(2+x*9),m++}}}syncImpacts(e){for(const[i,s]of this.splashes)e.impacts[i]||(this.scene.remove(s),this.splashes.delete(i));e.impacts.forEach((i,s)=>{let l=this.splashes.get(s);if(!l){l=new Bs;for(let d=0;d<11;d++){const p=new Tn(new cp(.8,4.5,5),new fu({color:d%2?16755282:14145997,transparent:!0,opacity:.8}));p.position.set(Math.sin(d*2.4)*4,2,Math.cos(d*1.7)*3),l.add(p)}this.scene.add(l),this.splashes.set(s,l)}l.position.set(i.x,0,i.z);const c=1+i.age*2.3;l.scale.set(c,Math.max(.12,1-i.age/5)*c,c)})}render(e,i){this.time+=Math.min(i,.07);const s=e.player,l=e.mission.id==="black-water"?1:0;this.waterUniforms.uTime.value=this.time,this.waterUniforms.uNight.value=l,this.skyUniforms.uNight.value=l;const c=-2.8+5.8*s.mast;this.camera.position.set(s.x,c,s.z);const d=s.scopeYaw*Ma,p=s.scopePitch*Ma;this.camera.lookAt(s.x+Math.cos(p)*Math.sin(d)*200,c+Math.sin(p)*200,s.z-Math.cos(p)*Math.cos(d)*200),this.camera.fov=$n(26/s.zoom,4.33,26),this.camera.updateProjectionMatrix(),this.sky.position.set(s.x,0,s.z),this.water.position.set(s.x,0,s.z),this.waterUniforms.uEye.value.copy(this.camera.position),this.syncShips(e),this.syncImpacts(e),this.resize(),this.renderer.render(this.scene,this.camera)}dispose(){this.observer.disconnect(),this.renderer.dispose(),this.renderer.domElement.remove(),this.water.geometry.dispose(),this.water.material.dispose(),this.sky.geometry.dispose(),this.sky.material.dispose();for(const e of this.ships.values())e.group.traverse(i=>{i instanceof Tn&&(i.geometry.dispose(),(Array.isArray(i.material)?i.material:[i.material]).forEach(l=>l.dispose()))}),e.wake.geometry.dispose(),e.wake.material.dispose()}}const Wv="deep-current-3d-save-v1";function Qo(r){try{localStorage.setItem(Wv,JSON.stringify(r))}catch{}}function sv(){try{const r=JSON.parse(localStorage.getItem(Wv)||"null");return r?.player&&r.ships&&r.mission?r:null}catch{return null}}function k1({name:r}){return r==="scope"?L.jsx("span",{className:"station-symbol",children:"⊕"}):r==="map"?L.jsx("span",{className:"station-symbol",children:"⌖"}):r==="sonar"?L.jsx("span",{className:"station-symbol",children:"◉"}):L.jsx("span",{className:"station-symbol",children:"⌁"})}function X1(){const[r,e]=Nn.useState("menu"),[i,s]=Nn.useState(Ps[0].id),[l,c]=Nn.useState(null),[d,p]=Nn.useState(""),[m,h]=Nn.useState(!0),[,x]=Nn.useState(0),S=Nn.useRef(null),g=Nn.useRef(null),E=Nn.useRef(null),A=Nn.useRef(null),D=Nn.useRef(null),y=Nn.useRef(0),[_,I]=Nn.useState(!1),O=S.current||l;function w(H=380,C=.08){if(m)try{D.current||(D.current=new AudioContext);const Y=D.current;Y.resume();const ee=Y.createOscillator(),ye=Y.createGain();ee.type="triangle",ee.frequency.setValueAtTime(H,Y.currentTime),ye.gain.setValueAtTime(1e-4,Y.currentTime),ye.gain.exponentialRampToValueAtTime(.035,Y.currentTime+.012),ye.gain.exponentialRampToValueAtTime(1e-4,Y.currentTime+C),ee.connect(ye),ye.connect(Y.destination),ee.start(),ee.stop(Y.currentTime+C+.02)}catch{}}function U(H){const C=S.current;C&&(Ir(C,H),x(Y=>Y+1),H.type==="FIRE"?w(130,.34):H.type==="MAST"?w(260,.16):H.type!=="SCOPE_YAW"&&H.type!=="SCOPE_PITCH"&&w(410,.045))}function P(H=i){const C=D1(H,19430312);S.current=C,c(C),p(""),e("game"),x(Y=>Y+1)}function F(){const H=sv();H&&(H.paused=!1,S.current=H,c(H),p(""),e("game"))}Nn.useEffect(()=>{if(r!=="game"||!S.current||!g.current)return;const H=g.current;let C;try{C=new V1(H),E.current=C,p("")}catch(me){p("3D rendering could not start: "+(me instanceof Error?me.message:"WebGL unavailable")+". Try current Chrome, Safari, or Edge with graphics acceleration enabled.");return}let Y=performance.now(),ee=0,ye=0,De=0,Fe=S.current?.logs.length||0;const re=me=>{const be=S.current;if(!be)return;const $e=Math.min((me-Y)/1e3,.075);if(Y=me,!be.paused&&be.status==="running"){ee+=$e*be.speedFactor;let Oe=0;for(;ee>=1/30&&Oe<90;)U1(be,1/30),ee-=1/30,Oe++;Oe>=90&&(ee=0)}C.render(be,$e),me-ye>130&&(ye=me,x(Oe=>Oe+1),be.logs.length>Fe&&(Fe=be.logs.length,w(275,.1)),be.status!=="running"&&!be.missionEnded&&(be.missionEnded=!0,Qo(be),e("result"))),me-De>15e3&&(De=me,Qo(be)),y.current=requestAnimationFrame(re)};return y.current=requestAnimationFrame(re),()=>{cancelAnimationFrame(y.current),E.current=null,C.dispose(),Qo(S.current||l)}},[r,l]),Nn.useEffect(()=>{if(r!=="game")return;function H(C){if(C.target?.tagName==="INPUT")return;const Y=S.current;if(!Y)return;let ee=null;const ye=Y.player;switch(C.key.toLowerCase()){case"arrowleft":ee={type:"SCOPE_YAW",value:ye.scopeYaw-1.6};break;case"arrowright":ee={type:"SCOPE_YAW",value:ye.scopeYaw+1.6};break;case"arrowup":ee={type:"SCOPE_PITCH",value:ye.scopePitch+1.1};break;case"arrowdown":ee={type:"SCOPE_PITCH",value:ye.scopePitch-1.1};break;case"q":ee={type:"ZOOM",value:ye.zoom+.5};break;case"e":ee={type:"ZOOM",value:ye.zoom-.5};break;case"w":ee={type:"SPEED",value:ye.orderedSpeed+1};break;case"s":ee={type:"SPEED",value:ye.orderedSpeed-1};break;case"a":ee={type:"HEADING",value:ye.orderedHeading-5};break;case"d":ee={type:"HEADING",value:ye.orderedHeading+5};break;case"z":ee={type:"DEPTH",value:ye.orderedDepth+15};break;case"x":ee={type:"DEPTH",value:ye.orderedDepth-15};break;case"r":ee={type:"MAST",value:1};break;case"f":ee={type:"MAST",value:0};break;case" ":ee={type:"FIRE"};break;case"1":ee={type:"STATION",value:"scope"};break;case"2":ee={type:"STATION",value:"map"};break;case"3":ee={type:"STATION",value:"sonar"};break;case"4":ee={type:"STATION",value:"damage"};break;case"escape":ee={type:"PAUSE"};break}ee&&(C.preventDefault(),Ir(Y,ee),x(De=>De+1))}return document.addEventListener("keydown",H),()=>document.removeEventListener("keydown",H)},[r]),Nn.useEffect(()=>{const H=()=>{document.hidden&&S.current&&(S.current.paused=!0,Qo(S.current))};return document.addEventListener("visibilitychange",H),()=>document.removeEventListener("visibilitychange",H)},[]);function T(H){!O||O.station!=="scope"||(A.current={x:H.clientX,y:H.clientY,id:H.pointerId},H.currentTarget.setPointerCapture(H.pointerId))}function z(H){if(!A.current||!O||O.station!=="scope")return;const C=H.clientX-A.current.x,Y=H.clientY-A.current.y;Ir(O,{type:"SCOPE_YAW",value:O.player.scopeYaw+C*.115/Math.sqrt(O.player.zoom)}),Ir(O,{type:"SCOPE_PITCH",value:O.player.scopePitch-Y*.1/Math.sqrt(O.player.zoom)}),A.current={x:H.clientX,y:H.clientY,id:H.pointerId},x(ee=>ee+1)}function X(){A.current=null}function K(H){!O||O.station!=="scope"||(Ir(O,{type:"ZOOM",value:O.player.zoom+(H.deltaY<0?.3:-.3)}),x(C=>C+1))}const j=O?.ships.find(H=>H.id===O.selectedShip&&!H.sunk)||null,oe=O?L1(O):[],Z=j&&O?Math.round(ou(O.player,j)/.9144):0,ne=j&&O?Ls(ru(O.player,j)):"---",N=O?.player,V=O?O1(O):"05:42",fe=N?N.torpedoes<=0?"EMPTY":N.tubes[N.selectedTube]>0?"RELOADING":"READY":"READY",se=N?N.mast>.94?"RAISED":N.mast<.06?"SUBMERGED":"MOVING":"";return L.jsx(L.Fragment,{children:L.jsxs("div",{className:"app",children:[r==="menu"&&L.jsxs("section",{className:"menu",children:[L.jsxs("div",{className:"menu-nav",children:[L.jsx("span",{className:"eyebrow",children:"MICROPROSE-ERA TACTICS · MODERN 3D WORLD"}),L.jsx("span",{className:"build-label",children:"CINEMATIC 3D · BUILD 0.5"})]}),L.jsxs("div",{className:"menu-content",children:[L.jsx("div",{className:"menu-overline",children:"A NEW SUBMARINE SIMULATION"}),L.jsx("h1",{children:"DEEP CURRENT"}),L.jsx("div",{className:"title-underline"}),L.jsx("h2",{children:"PACIFIC PATROL"}),L.jsx("p",{children:"Take command beneath the Pacific. Watch the horizon. Plot your attack. Survive the hunt."}),L.jsxs("button",{className:"hero-button",id:"start-button",onClick:()=>{e("brief"),w(480,.14)},children:["BEGIN PATROL ",L.jsx("span",{children:"→"})]}),sv()&&L.jsx("button",{className:"ghost-button",onClick:F,children:"CONTINUE SAVED PATROL"}),L.jsxs("p",{className:"menu-note",children:["REAL-TIME 3D OCEAN & SHIPS ",L.jsx("b",{children:"·"})," FULL PERISCOPE AIMING ",L.jsx("b",{children:"·"})," NO DOWNLOAD"]})]}),L.jsxs("div",{className:"menu-bottom",children:[L.jsx("span",{children:"1943 · THE PACIFIC"}),L.jsx("span",{children:"AN ORIGINAL NAVAL GAME"})]})]}),r==="brief"&&L.jsxs("section",{className:"brief-screen",children:[L.jsxs("header",{className:"brief-top",children:[L.jsx("button",{onClick:()=>e("menu"),children:"← BACK"}),L.jsx("b",{children:"COMMAND BRIEFING"}),L.jsx("span",{children:"TACTICAL OPERATIONS / PACIFIC"})]}),L.jsxs("div",{className:"brief-inner",children:[L.jsx("span",{className:"eyebrow amber",children:"SELECT A PATROL"}),L.jsx("h1",{children:"YOUR ORDERS, CAPTAIN"}),L.jsx("p",{children:"The sea will not wait. Choose an engagement to begin your patrol."}),L.jsx("div",{className:"mission-grid",children:Ps.map((H,C)=>L.jsxs("button",{className:"mission-tile "+(i===H.id?"active":""),onClick:()=>s(H.id),children:[L.jsxs("span",{children:["PATROL 0",C+1]}),L.jsx("strong",{children:H.name}),L.jsx("small",{children:H.subtitle}),L.jsxs("em",{children:[H.objective.toLocaleString()," GRT TARGET"]})]},H.id))}),L.jsxs("div",{className:"brief-objectives",children:[L.jsx("h3",{children:"OPERATIONAL INTELLIGENCE"}),L.jsx("p",{children:Ps.find(H=>H.id===i)?.description}),L.jsxs("div",{className:"brief-line",children:[L.jsx("span",{children:"SCENARIO"}),L.jsx("b",{children:Ps.find(H=>H.id===i)?.name})]}),L.jsxs("div",{className:"brief-line",children:[L.jsx("span",{children:"TIME AT STATION"}),L.jsxs("b",{children:[Ps.find(H=>H.id===i)?.time," LOCAL"]})]})]}),L.jsxs("button",{className:"hero-button",id:"launch",onClick:()=>P(),children:["LAUNCH PATROL ",L.jsx("span",{children:"→"})]})]})]}),(r==="game"||r==="result")&&O&&N&&L.jsxs("section",{className:"game-shell",children:[L.jsxs("header",{className:"game-top",children:[L.jsxs("div",{className:"brand",children:[L.jsx("span",{children:"DEEP CURRENT"}),L.jsx("small",{children:"PACIFIC PATROL"})]}),L.jsxs("div",{className:"location",children:[L.jsx("span",{className:"eyebrow",children:"SECTOR 07 / PACIFIC"}),L.jsx("b",{children:O.mission.name})]}),L.jsxs("div",{className:"top-stats",children:[L.jsx("span",{children:"MAR 12, 1943"}),L.jsx("b",{children:V}),L.jsx("span",{className:"alert-indicator "+(O.alerts?"danger":""),children:O.alerts?"ESCORT ALERT":"NO ALERT"})]}),L.jsx("button",{className:"top-icon",onClick:()=>U({type:"PAUSE"}),children:O.paused?"▶ RESUME":"Ⅱ PAUSE"}),L.jsx("button",{className:"top-icon",onClick:()=>{Qo(O),e("menu")},children:"SAVE / EXIT"})]}),L.jsxs("div",{className:"play-layout",children:[L.jsxs("aside",{className:"station-rail",children:[L.jsx("div",{className:"rail-head",children:"BATTLE STATIONS"}),["scope","map","sonar","damage"].map(H=>L.jsxs("button",{className:"station-tab "+(O.station===H?"on":""),onClick:()=>U({type:"STATION",value:H}),children:[L.jsx(k1,{name:H}),L.jsx("span",{children:H==="scope"?"PERISCOPE":H==="map"?"TACTICAL MAP":H==="sonar"?"HYDROPHONES":"SHIP STATUS"}),L.jsx("small",{children:H==="scope"?"01":H==="map"?"02":H==="sonar"?"03":"04"})]},H)),L.jsx("div",{className:"rail-spacer"}),L.jsx("div",{className:"rail-caption",children:"USS NIGHTFALL"}),L.jsxs("div",{className:"rail-metric",children:[L.jsx("span",{children:"HEADING"}),L.jsx("b",{children:Ls(N.heading)})]}),L.jsxs("div",{className:"rail-metric",children:[L.jsx("span",{children:"SPEED"}),L.jsxs("b",{children:[N.speed.toFixed(1)," KTS"]})]}),L.jsxs("div",{className:"rail-metric",children:[L.jsx("span",{children:"DEPTH"}),L.jsxs("b",{children:[N.depth.toFixed(0)," FT"]})]}),L.jsx("div",{className:"rail-note",children:"ONE WORLD. NO ARCADE FILTERS."})]}),L.jsxs("main",{className:"middle",children:[L.jsxs("div",{className:"view-head",children:[L.jsxs("span",{children:[L.jsx("i",{className:"live-dot"})," ",O.station==="scope"?"OPTICAL PERISCOPE":O.station==="map"?"NAVIGATION CHART":O.station==="sonar"?"PASSIVE HYDROPHONES":"SYSTEM CONDITION"]}),L.jsx("span",{children:O.station==="scope"?"OPTICS LIVE · "+N.zoom.toFixed(1)+"×":"WORLD TIME "+V})]}),L.jsxs("div",{className:"view-frame",onPointerDown:T,onPointerMove:z,onPointerUp:X,onPointerCancel:X,onWheel:K,children:[L.jsx("div",{className:"webgl-host",ref:g}),O.station==="scope"&&L.jsxs("div",{className:"scope-overlay",children:[L.jsx("div",{className:"scope-mask scope-mask-left"}),L.jsx("div",{className:"scope-mask scope-mask-right"}),L.jsx("div",{className:"reticle reticle-h"}),L.jsx("div",{className:"reticle reticle-v"}),L.jsx("div",{className:"reticle-center"}),L.jsx("div",{className:"reticle-top",children:"340   350   000   010   020"}),L.jsxs("span",{className:"scope-bearing",children:["BEARING ",Ls(N.scopeYaw)]}),L.jsxs("span",{className:"scope-pitch",children:["ELEV ",N.scopePitch>0?"+":"",N.scopePitch.toFixed(1),"°"]}),L.jsxs("span",{className:"scope-zoom",children:[N.zoom.toFixed(1),"× OPTICAL"]}),N.mast<.94&&L.jsxs("div",{className:"submerged-overlay",children:[se,L.jsx("small",{children:N.mastTarget?"RAISING OPTICS":"OPTICS BELOW SURFACE"})]})]}),O.station==="map"&&L.jsxs("div",{className:"overlay-station chart",children:[L.jsxs("div",{className:"overlay-heading",children:[L.jsx("span",{children:"CONTACT PLOT"}),L.jsx("span",{children:"GRID 50 NM · TRUE NORTH ↑"})]}),L.jsxs("svg",{viewBox:"0 0 900 540",preserveAspectRatio:"xMidYMid meet",children:[L.jsx("defs",{children:L.jsx("pattern",{id:"gridmap",width:"56",height:"56",patternUnits:"userSpaceOnUse",children:L.jsx("path",{d:"M56 0H0V56",fill:"none",stroke:"#4b7b88",strokeOpacity:".23"})})}),L.jsx("rect",{width:"900",height:"540",fill:"url(#gridmap)"}),L.jsx("circle",{cx:"450",cy:"270",r:"130",className:"map-ring"}),L.jsx("circle",{cx:"450",cy:"270",r:"250",className:"map-ring"}),L.jsx("path",{d:"M450 0V540 M0 270H900",className:"map-axis"}),L.jsx("path",{d:"M450 262l-11 24h22Z",fill:"#e3bd7e",transform:"rotate("+N.heading+",450,270)"}),O.ships.filter(H=>!H.sunk).map(H=>{const C=450+(H.x-N.x)*.14,Y=270+(H.z-N.z)*.14;return L.jsxs("g",{children:[L.jsx("path",{d:"M0 -12L6 10L0 6L-6 10Z",transform:"translate("+C+","+Y+") rotate("+H.heading+")",fill:H.kind==="escort"?"#db8c77":"#82c9c2"}),L.jsx("text",{x:C+12,y:Y-10,fill:"#c9d7d3",fontSize:"13",children:H.id})]},H.id)})]}),L.jsxs("span",{className:"chart-footer",children:["YOUR SUBMARINE ▲ / CONTACTS ◇ · ",O.ships.filter(H=>!H.sunk).length," TRACKS"]})]}),O.station==="sonar"&&L.jsxs("div",{className:"overlay-station sonar",children:[L.jsxs("div",{className:"overlay-heading",children:[L.jsx("span",{children:"HYDROPHONE ARRAY / PASSIVE"}),L.jsx("span",{children:"SONAR ROOM"})]}),L.jsxs("svg",{viewBox:"0 0 900 540",children:[L.jsx("circle",{cx:"450",cy:"270",r:"226",className:"sonar-ring"}),L.jsx("circle",{cx:"450",cy:"270",r:"175",className:"sonar-ring"}),L.jsx("circle",{cx:"450",cy:"270",r:"120",className:"sonar-ring"}),L.jsx("circle",{cx:"450",cy:"270",r:"65",className:"sonar-ring"}),L.jsx("path",{d:"M450 35V505M215 270H685",className:"sonar-axis"}),L.jsx("path",{d:"M450 262l-9 18h18Z",fill:"#95d7b4"}),oe.map(H=>{const C=H.bearing*Math.PI/180,Y=Math.min(220,H.range*.06+35),ee=450+Math.sin(C)*Y,ye=270-Math.cos(C)*Y;return L.jsxs("g",{children:[L.jsx("circle",{cx:ee,cy:ye,r:H.type==="escort"?9:6,fill:H.type==="escort"?"#d69a83":"#8cf0b8",opacity:".87"}),L.jsx("circle",{cx:ee,cy:ye,r:"15",fill:"none",stroke:"#8cf0b8",strokeOpacity:".32"}),L.jsx("text",{x:ee+16,y:ye-8,fill:"#a7d5c5",fontSize:"13",children:Ls(H.bearing)})]},H.id)})]}),L.jsx("span",{className:"chart-footer",children:"BEARING PLOTS ARE ESTIMATES · PASSIVE LISTENING"})]}),O.station==="damage"&&L.jsxs("div",{className:"overlay-station damage",children:[L.jsxs("div",{className:"overlay-heading",children:[L.jsx("span",{children:"SHIP'S CONDITION"}),L.jsx("span",{children:"DAMAGE CONTROL"})]}),L.jsxs("div",{className:"damage-grid",children:[L.jsxs("div",{children:[L.jsx("span",{children:"HULL INTEGRITY"}),L.jsxs("strong",{children:[Math.round(N.hull),"%"]}),L.jsx("div",{className:"bar",children:L.jsx("i",{style:{width:N.hull+"%"}})})]}),L.jsxs("div",{children:[L.jsx("span",{children:"BATTERY REMAINING"}),L.jsxs("strong",{children:[Math.round(N.battery),"%"]}),L.jsx("div",{className:"bar",children:L.jsx("i",{style:{width:N.battery+"%"}})})]}),L.jsxs("div",{children:[L.jsx("span",{children:"TORPEDO INVENTORY"}),L.jsxs("strong",{children:[N.torpedoes," / 12"]})]}),L.jsxs("div",{children:[L.jsx("span",{children:"PERISCOPE MAST"}),L.jsx("strong",{children:se})]}),L.jsxs("div",{children:[L.jsx("span",{children:"COMPARTMENTS"}),L.jsx("strong",{children:N.hull<40?"FLOODING":"SECURE"})]}),L.jsxs("div",{children:[L.jsx("span",{children:"ENEMY CONTACT"}),L.jsx("strong",{children:O.alerts?"HIGH ALERT":"UNDETECTED"})]})]}),L.jsx("button",{className:"metal-button",onClick:()=>U({type:"REPAIR"}),children:"DISPATCH DAMAGE PARTY"})]}),d&&L.jsx("div",{className:"render-error",children:d}),O.paused&&r==="game"&&L.jsxs("div",{className:"paused-overlay",children:[L.jsx("h2",{children:"PAUSED"}),L.jsx("button",{className:"hero-button",onClick:()=>U({type:"PAUSE"}),children:"RESUME PATROL"})]})]}),L.jsxs("div",{className:"optic-controls",children:[L.jsxs("div",{className:"control-label",children:["PERISCOPE OPTICS ",L.jsx("small",{children:"DRAG TO LOOK IN BOTH DIRECTIONS"})]}),L.jsxs("div",{className:"micro-group",children:[L.jsx("button",{onClick:()=>U({type:"SCOPE_YAW",value:N.scopeYaw-3}),children:"←"}),L.jsx("button",{onClick:()=>U({type:"SCOPE_PITCH",value:N.scopePitch+2}),children:"↑"}),L.jsx("button",{onClick:()=>U({type:"SCOPE_PITCH",value:N.scopePitch-2}),children:"↓"}),L.jsx("button",{onClick:()=>U({type:"SCOPE_YAW",value:N.scopeYaw+3}),children:"→"})]}),L.jsx("div",{className:"control-label righted",children:"ZOOM"}),L.jsxs("div",{className:"micro-group",children:[L.jsx("button",{onClick:()=>U({type:"ZOOM",value:N.zoom-.5}),children:"−"}),L.jsxs("span",{children:[N.zoom.toFixed(1),"×"]}),L.jsx("button",{onClick:()=>U({type:"ZOOM",value:N.zoom+.5}),children:"+"})]})]}),L.jsxs("div",{className:"lower-console",children:[L.jsxs("div",{className:"console-segment",children:[L.jsxs("div",{className:"mini-label",children:["PERISCOPE MAST ",L.jsx("span",{children:se})]}),L.jsxs("div",{className:"button-pair",children:[L.jsx("button",{className:N.mastTarget>0?"active":"",onClick:()=>U({type:"MAST",value:1}),children:"↑ RAISE"}),L.jsx("button",{className:N.mastTarget===0?"active":"",onClick:()=>U({type:"MAST",value:0}),children:"↓ LOWER"})]})]}),L.jsxs("div",{className:"console-segment",children:[L.jsxs("div",{className:"mini-label",children:["SUBMARINE DEPTH ",L.jsxs("span",{children:[N.depth.toFixed(0)," FT"]})]}),L.jsxs("div",{className:"button-pair",children:[L.jsx("button",{onClick:()=>U({type:"DEPTH",value:N.orderedDepth-15}),children:"↑ RISE"}),L.jsx("button",{onClick:()=>U({type:"DEPTH",value:N.orderedDepth+15}),children:"↓ DIVE"})]})]}),L.jsxs("div",{className:"console-segment",children:[L.jsxs("div",{className:"mini-label",children:["SPEED ORDER ",L.jsxs("span",{children:[N.orderedSpeed.toFixed(0)," KTS"]})]}),L.jsxs("div",{className:"button-pair",children:[L.jsx("button",{onClick:()=>U({type:"SPEED",value:N.orderedSpeed-1}),children:"− SLOW"}),L.jsx("button",{onClick:()=>U({type:"SPEED",value:N.orderedSpeed+1}),children:"+ AHEAD"})]})]}),L.jsxs("div",{className:"console-segment",children:[L.jsxs("div",{className:"mini-label",children:["HEADING ORDER ",L.jsx("span",{children:Ls(N.orderedHeading)})]}),L.jsxs("div",{className:"button-pair",children:[L.jsx("button",{onClick:()=>U({type:"HEADING",value:N.orderedHeading-5}),children:"← PORT"}),L.jsx("button",{onClick:()=>U({type:"HEADING",value:N.orderedHeading+5}),children:"STARBOARD →"})]})]})]})]}),L.jsxs("aside",{className:"target-panel",children:[L.jsxs("div",{className:"target-title",children:["TARGET DATA ",L.jsx("span",{className:"live-dot"})]}),L.jsx("div",{className:"target-silhouette",children:L.jsxs("svg",{viewBox:"0 0 200 70",children:[L.jsx("path",{d:"M20 44L174 44L166 57L31 57Z",fill:"#9fa9a3"}),L.jsx("path",{d:"M113 44V25H152V44M123 25V17H141V25M81 44V13M63 44V20M45 44V31M161 44V20",fill:"none",stroke:"#a7ada5",strokeWidth:"2"}),L.jsx("rect",{x:"91",y:"36",width:"20",height:"8",fill:"#adb0a7"})]})}),L.jsxs("div",{className:"data-line",children:[L.jsx("span",{children:"CLASS"}),L.jsx("b",{children:j?j.kind==="merchant"?"MERCHANT":"DESTROYER":"NO CONTACT"})]}),L.jsxs("div",{className:"data-line",children:[L.jsx("span",{children:"RANGE"}),L.jsxs("b",{children:[Z.toLocaleString()," ",L.jsx("small",{children:"YD"})]})]}),L.jsxs("div",{className:"data-line",children:[L.jsx("span",{children:"BEARING"}),L.jsx("b",{children:ne})]}),L.jsxs("div",{className:"data-line",children:[L.jsx("span",{children:"COURSE"}),L.jsx("b",{children:j?Ls(j.heading):"---"})]}),L.jsxs("div",{className:"data-line",children:[L.jsx("span",{children:"SPEED"}),L.jsxs("b",{children:[j?j.speed.toFixed(0):"--"," ",L.jsx("small",{children:"KTS"})]})]}),L.jsxs("div",{className:"data-line",children:[L.jsx("span",{children:"NAME"}),L.jsx("b",{className:"small-value",children:j?.name||"UNKNOWN"})]}),L.jsx("button",{className:"next-contact",onClick:()=>{if(!O)return;const H=O.ships.filter(ee=>!ee.sunk),C=H.findIndex(ee=>ee.id===O.selectedShip),Y=H[(C+1)%H.length];Y&&(O.selectedShip=Y.id,Ir(O,{type:"SCOPE_YAW",value:ru(N,Y)}),x(ee=>ee+1))},children:"◈ NEXT CONTACT"}),L.jsxs("div",{className:"compass-panel",children:[L.jsxs("div",{className:"compass-circle",children:[L.jsxs("div",{className:"compass-ticks",children:["N",L.jsx("br",{}),L.jsx("span",{children:"E      W"}),L.jsx("br",{}),"S"]}),L.jsx("div",{className:"needle",style:{transform:"rotate("+N.scopeYaw+"deg)"}}),L.jsx("div",{className:"compass-degree",children:Ls(N.scopeYaw)})]}),L.jsx("div",{className:"compass-caption",children:"TRUE PERISCOPE BEARING"})]}),L.jsxs("div",{className:"weapons",children:[L.jsxs("div",{className:"target-title",children:["TORPEDO CONTROL ",L.jsx("span",{children:"MARK 14"})]}),L.jsxs("div",{className:"mini-label",children:["GYRO OFFSET ",L.jsxs("span",{children:[N.gyro>=0?"+":"",Math.round(N.gyro),"°"]})]}),L.jsxs("div",{className:"button-pair",children:[L.jsx("button",{onClick:()=>U({type:"GYRO",value:N.gyro-1}),children:"− 1°"}),L.jsx("button",{onClick:()=>U({type:"GYRO",value:N.gyro+1}),children:"+ 1°"})]}),L.jsx("button",{className:"solve-button",onClick:()=>U({type:"SOLVE"}),children:"⌖ COMPUTE LEAD"}),L.jsxs("div",{className:"mini-label",children:["TORPEDO TUBES ",L.jsxs("span",{children:[N.torpedoes," REMAIN"]})]}),L.jsx("div",{className:"tubes",children:N.tubes.map((H,C)=>L.jsx("button",{className:(N.selectedTube===C?"active ":"")+(H===0?"ready":"reloading"),onClick:()=>U({type:"TUBE",value:C}),children:C+1},C))}),L.jsxs("div",{className:"tube-ready "+(fe==="READY"?"is-ready":""),children:["TUBE ",N.selectedTube+1,": ",fe]}),L.jsxs("button",{className:"fire-button",id:"fire",disabled:fe!=="READY",onClick:()=>U({type:"FIRE"}),children:[L.jsx("span",{children:"FIRE TORPEDO"}),L.jsx("small",{children:"SPACE / CLICK"})]})]})]})]}),L.jsxs("footer",{className:"game-bottom",children:[L.jsxs("div",{children:[L.jsx("span",{className:"green-signal",children:"●"})," ",O.logs[0]||"STANDING BY"]}),L.jsxs("div",{className:"footer-actions",children:[L.jsx("button",{onClick:()=>U({type:"QUIET"}),className:N.quiet?"is-silent":"",children:N.quiet?"◉ SILENT RUNNING":"○ QUIET RUNNING"}),L.jsxs("button",{onClick:()=>U({type:"FACTOR",value:O.speedFactor===1?4:O.speedFactor===4?12:1}),children:[O.speedFactor,"× TIME"]}),L.jsx("button",{onClick:()=>I(H=>!H),children:"CONTROLS ?"}),L.jsx("button",{onClick:()=>h(H=>!H),children:m?"♫ ON":"♫ OFF"})]})]}),_&&L.jsxs("div",{className:"help-card",children:[L.jsx("button",{onClick:()=>I(!1),children:"✕"}),L.jsx("h3",{children:"BRIDGE CONTROLS"}),L.jsx("p",{children:"Drag the ocean to look left, right, up or down. Wheel or ± zoom. Raise/lower the optical mast independently of diving the submarine. W/S speed · A/D helm · Z/X dive/rise · R/F mast · SPACE torpedo."})]})]}),r==="result"&&O&&L.jsx("div",{className:"result-screen",children:L.jsxs("div",{className:"result-box",children:[L.jsx("span",{className:"eyebrow",children:"PATROL REPORT"}),L.jsx("h1",{children:O.status==="won"?"MISSION COMPLETE":O.status==="lost"?"SUBMARINE LOST":"PATROL RECALLED"}),L.jsxs("div",{className:"result-stats",children:[L.jsxs("div",{children:[L.jsx("span",{children:"TONNAGE"}),L.jsx("b",{children:O.tonnage.toLocaleString()})]}),L.jsxs("div",{children:[L.jsx("span",{children:"HITS / SHOTS"}),L.jsxs("b",{children:[O.hits," / ",O.shots]})]}),L.jsxs("div",{children:[L.jsx("span",{children:"HULL"}),L.jsxs("b",{children:[O.player.hull.toFixed(0),"%"]})]})]}),L.jsx("button",{className:"hero-button",onClick:()=>{e("brief"),S.current=null,c(null)},children:"NEW PATROL →"})]})})]})})}sM.createRoot(document.getElementById("root")).render(L.jsx(JS.StrictMode,{children:L.jsx(X1,{})}));
