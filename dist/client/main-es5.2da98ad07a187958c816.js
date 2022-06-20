!function(){function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function n(e,n,r){return n&&t(e.prototype,n),r&&t(e,r),e}(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{0:function(e,t,n){e.exports=n("jbcS")},"AC+j":function(e,t,n){"use strict";var r,o,a,i,c;n.r(t),n.d(t,"Language",function(){return a}),n.d(t,"ViewType",function(){return c}),n.d(t,"Layout",function(){return i}),n.d(t,"Direction",function(){return o}),n.d(t,"Color",function(){return r}),function(e){e.Darkgray="darkgray",e.Darkblue="darkblue",e.Darkred="darkred",e.Darkgreen="darkgreen"}(r||(r={})),function(e){e.HORIZONTAL="HORIZONTAL",e.VERTICAL="VERTICAL"}(o||(o={})),function(e){e.en="English",e["en-US"]="English (American English)",e["en-GB"]="English (British English\u3001UK English)",e["en-CA"]="English (Canadian English)",e["en-AU"]="English (Australian English)",e.fr="French",e.de="German",e.it="Italian",e.ja="\u65e5\u672c\u8a9e",e.ko="Korean",e.pt="Portuguese",e.ru="Russian"}(a||(a={})),function(e){e.SCREENING_EVENT_SERIES="screeningEventSeries",e.START_DATE="startDate"}(i||(i={})),function(e){e.Cinema="cinema",e.Event="event"}(c||(c={}))},ADXf:function(e,t,n){"use strict";n.d(t,"a",function(){return a});var r=n("TVqg"),o={production:!1,APP_TITLE:"SMART THEATER",PRIMARY_COLOR:"steelblue",VIEW_TYPE:"event",GTM_ID:"",ANALYTICS_ID:"",STORAGE_NAME:""===Object(r.getProject)().projectId?"SIGNAGE-STATE":"".concat(Object(r.getProject)().projectId.toUpperCase(),"-SIGNAGE-STATE"),STORAGE_TYPE:"localStorage",BASE_URL:"/root",LANGUAGE:["ja"],PURCHASE_SCHEDULE_SORT:"screeningEventSeries",PURCHASE_SCHEDULE_STATUS_THRESHOLD_VALUE:"30",PURCHASE_SCHEDULE_STATUS_THRESHOLD_UNIT:"%",AUTOPLAY_DELAY_TIME:"60000",UPDATE_DELAY_TIME:"180000"};function a(){return Object.assign(Object.assign(Object.assign(Object.assign({},o),{STORAGE_NAME:""===Object(r.getProject)().projectId?"SIGNAGE-STATE":"".concat(Object(r.getProject)().projectId.toUpperCase(),"-SIGNAGE-STATE")}),window.environment),{production:null!==document.querySelector("body.production")})}},HOUK:function(t,r,o){"use strict";o.r(r),o.d(r,"Purchase",function(){return a}),o.d(r,"Util",function(){return h}),o.d(r,"Translate",function(){return i});var a={};o.r(a),o.d(a,"screeningEvents2ScreeningEventSeries",function(){return u});var i={};o.r(i),o.d(i,"CustomTranslateHttpLoader",function(){return E}),o.d(i,"getTranslateModuleConfig",function(){return b});var c=o("ADXf"),s=o("f5zA");function u(e){var t=Object(c.a)(),n=[],r=e.screeningEvents,o=e.now;return r.forEach(function(e){var r=n.find(function(n){return"screeningEventSeries"===t.PURCHASE_SCHEDULE_SORT?n.screeningEvent.superEvent.id===e.superEvent.id:n.screeningEvent.location.branchCode===e.location.branchCode}),a=new s.a({screeningEvent:e,now:o});void 0===r?n.push({screeningEvent:e,data:[a]}):r.data.push(a)}),n}var d=o("tk/3"),l=o("sYmb"),f=o("PE4B"),p=o("wd/R"),j=o("cp0P"),v=o("LRne"),m=o("JIr8"),g=o("lJxs"),h=o("TVqg"),E=function(){function t(n){e(this,t),this.http=n}return n(t,[{key:"getTranslation",value:function(e){var t=this,n=".json?date=".concat(p().toISOString()),r=["/default/i18n/common/".concat(e).concat(n),"/default/i18n/".concat(Object(c.a)().VIEW_TYPE,"/").concat(e).concat(n),"".concat(Object(h.getProject)().storageUrl.application,"/i18n/").concat(e).concat(n)];return Object(j.a)(r.map(function(e){return t.http.get(e).pipe(Object(m.a)(function(e){return console.error(e),Object(v.a)({})}))})).pipe(Object(g.a)(function(e){return e.reduce(function(e,t){return f(e,t)})}))}}]),t}();function b(){return{loader:{provide:l.a,useClass:E,deps:[d.a]}}}},RnhZ:function(e,t,n){var r={"./af":"K/tc","./af.js":"K/tc","./ar":"jnO4","./ar-dz":"o1bE","./ar-dz.js":"o1bE","./ar-kw":"Qj4J","./ar-kw.js":"Qj4J","./ar-ly":"HP3h","./ar-ly.js":"HP3h","./ar-ma":"CoRJ","./ar-ma.js":"CoRJ","./ar-sa":"gjCT","./ar-sa.js":"gjCT","./ar-tn":"bYM6","./ar-tn.js":"bYM6","./ar.js":"jnO4","./az":"SFxW","./az.js":"SFxW","./be":"H8ED","./be.js":"H8ED","./bg":"hKrs","./bg.js":"hKrs","./bm":"p/rL","./bm.js":"p/rL","./bn":"kEOa","./bn.js":"kEOa","./bo":"0mo+","./bo.js":"0mo+","./br":"aIdf","./br.js":"aIdf","./bs":"JVSJ","./bs.js":"JVSJ","./ca":"1xZ4","./ca.js":"1xZ4","./cs":"PA2r","./cs.js":"PA2r","./cv":"A+xa","./cv.js":"A+xa","./cy":"l5ep","./cy.js":"l5ep","./da":"DxQv","./da.js":"DxQv","./de":"tGlX","./de-at":"s+uk","./de-at.js":"s+uk","./de-ch":"u3GI","./de-ch.js":"u3GI","./de.js":"tGlX","./dv":"WYrj","./dv.js":"WYrj","./el":"jUeY","./el.js":"jUeY","./en-SG":"zavE","./en-SG.js":"zavE","./en-au":"Dmvi","./en-au.js":"Dmvi","./en-ca":"OIYi","./en-ca.js":"OIYi","./en-gb":"Oaa7","./en-gb.js":"Oaa7","./en-ie":"4dOw","./en-ie.js":"4dOw","./en-il":"czMo","./en-il.js":"czMo","./en-nz":"b1Dy","./en-nz.js":"b1Dy","./eo":"Zduo","./eo.js":"Zduo","./es":"iYuL","./es-do":"CjzT","./es-do.js":"CjzT","./es-us":"Vclq","./es-us.js":"Vclq","./es.js":"iYuL","./et":"7BjC","./et.js":"7BjC","./eu":"D/JM","./eu.js":"D/JM","./fa":"jfSC","./fa.js":"jfSC","./fi":"gekB","./fi.js":"gekB","./fo":"ByF4","./fo.js":"ByF4","./fr":"nyYc","./fr-ca":"2fjn","./fr-ca.js":"2fjn","./fr-ch":"Dkky","./fr-ch.js":"Dkky","./fr.js":"nyYc","./fy":"cRix","./fy.js":"cRix","./ga":"USCx","./ga.js":"USCx","./gd":"9rRi","./gd.js":"9rRi","./gl":"iEDd","./gl.js":"iEDd","./gom-latn":"DKr+","./gom-latn.js":"DKr+","./gu":"4MV3","./gu.js":"4MV3","./he":"x6pH","./he.js":"x6pH","./hi":"3E1r","./hi.js":"3E1r","./hr":"S6ln","./hr.js":"S6ln","./hu":"WxRl","./hu.js":"WxRl","./hy-am":"1rYy","./hy-am.js":"1rYy","./id":"UDhR","./id.js":"UDhR","./is":"BVg3","./is.js":"BVg3","./it":"bpih","./it-ch":"bxKX","./it-ch.js":"bxKX","./it.js":"bpih","./ja":"B55N","./ja.js":"B55N","./jv":"tUCv","./jv.js":"tUCv","./ka":"IBtZ","./ka.js":"IBtZ","./kk":"bXm7","./kk.js":"bXm7","./km":"6B0Y","./km.js":"6B0Y","./kn":"PpIw","./kn.js":"PpIw","./ko":"Ivi+","./ko.js":"Ivi+","./ku":"JCF/","./ku.js":"JCF/","./ky":"lgnt","./ky.js":"lgnt","./lb":"RAwQ","./lb.js":"RAwQ","./lo":"sp3z","./lo.js":"sp3z","./lt":"JvlW","./lt.js":"JvlW","./lv":"uXwI","./lv.js":"uXwI","./me":"KTz0","./me.js":"KTz0","./mi":"aIsn","./mi.js":"aIsn","./mk":"aQkU","./mk.js":"aQkU","./ml":"AvvY","./ml.js":"AvvY","./mn":"lYtQ","./mn.js":"lYtQ","./mr":"Ob0Z","./mr.js":"Ob0Z","./ms":"6+QB","./ms-my":"ZAMP","./ms-my.js":"ZAMP","./ms.js":"6+QB","./mt":"G0Uy","./mt.js":"G0Uy","./my":"honF","./my.js":"honF","./nb":"bOMt","./nb.js":"bOMt","./ne":"OjkT","./ne.js":"OjkT","./nl":"+s0g","./nl-be":"2ykv","./nl-be.js":"2ykv","./nl.js":"+s0g","./nn":"uEye","./nn.js":"uEye","./pa-in":"8/+R","./pa-in.js":"8/+R","./pl":"jVdC","./pl.js":"jVdC","./pt":"8mBD","./pt-br":"0tRk","./pt-br.js":"0tRk","./pt.js":"8mBD","./ro":"lyxo","./ro.js":"lyxo","./ru":"lXzo","./ru.js":"lXzo","./sd":"Z4QM","./sd.js":"Z4QM","./se":"//9w","./se.js":"//9w","./si":"7aV9","./si.js":"7aV9","./sk":"e+ae","./sk.js":"e+ae","./sl":"gVVK","./sl.js":"gVVK","./sq":"yPMs","./sq.js":"yPMs","./sr":"zx6S","./sr-cyrl":"E+lV","./sr-cyrl.js":"E+lV","./sr.js":"zx6S","./ss":"Ur1D","./ss.js":"Ur1D","./sv":"X709","./sv.js":"X709","./sw":"dNwA","./sw.js":"dNwA","./ta":"PeUW","./ta.js":"PeUW","./te":"XLvN","./te.js":"XLvN","./tet":"V2x9","./tet.js":"V2x9","./tg":"Oxv6","./tg.js":"Oxv6","./th":"EOgW","./th.js":"EOgW","./tl-ph":"Dzi0","./tl-ph.js":"Dzi0","./tlh":"z3Vd","./tlh.js":"z3Vd","./tr":"DoHr","./tr.js":"DoHr","./tzl":"z1FC","./tzl.js":"z1FC","./tzm":"wQk9","./tzm-latn":"tT3J","./tzm-latn.js":"tT3J","./tzm.js":"wQk9","./ug-cn":"YRex","./ug-cn.js":"YRex","./uk":"raLr","./uk.js":"raLr","./ur":"UpQW","./ur.js":"UpQW","./uz":"Loxo","./uz-latn":"AQ68","./uz-latn.js":"AQ68","./uz.js":"Loxo","./vi":"KSF8","./vi.js":"KSF8","./x-pseudo":"/X5v","./x-pseudo.js":"/X5v","./yo":"fzPg","./yo.js":"fzPg","./zh-cn":"XDpg","./zh-cn.js":"XDpg","./zh-hk":"SatO","./zh-hk.js":"SatO","./zh-tw":"kOpN","./zh-tw.js":"kOpN"};function o(e){var t=a(e);return n(t)}function a(e){if(!n.o(r,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return r[e]}o.keys=function(){return Object.keys(r)},o.resolve=a,e.exports=o,o.id="RnhZ"},TVqg:function(e,t,n){"use strict";n.r(t),n.d(t,"formatTelephone",function(){return i}),n.d(t,"toFull",function(){return c}),n.d(t,"toHalf",function(){return s}),n.d(t,"retry",function(){return u}),n.d(t,"sleep",function(){return d}),n.d(t,"iOSDatepickerTapBugFix",function(){return l}),n.d(t,"string2blob",function(){return f}),n.d(t,"getParameter",function(){return p}),n.d(t,"getProject",function(){return j}),n.d(t,"getExternalData",function(){return v}),n.d(t,"isFile",function(){return m}),n.d(t,"deepCopy",function(){return g}),n.d(t,"changeViewport",function(){return h}),n.d(t,"resetViewport",function(){return E}),n.d(t,"nextDateWatchman",function(){return b});var r=n("PoRY"),o=n("AC+j"),a=function(e,t,n,r){return new(n||(n=Promise))(function(o,a){function i(e){try{s(r.next(e))}catch(t){a(t)}}function c(e){try{s(r.throw(e))}catch(t){a(t)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(i,c)}s((r=r.apply(e,t||[])).next())})};function i(e,t){if(void 0===e)return"";var n=new RegExp(/^\+/).test(e)?r.b(e):r.b(e,"JP");return t=void 0===t?"International":t,r.a(n,t).replace(/\s/g,"")}function c(e){return e.replace(/[A-Za-z0-9]/g,function(e){return String.fromCharCode(e.charCodeAt(0)+65248)})}function s(e){return e.replace(/[\uff21-\uff3a\uff41-\uff5a\uff10-\uff19]/g,function(e){return String.fromCharCode(e.charCodeAt(0)-65248)})}function u(e){return a(this,void 0,void 0,regeneratorRuntime.mark(function t(){var n,r=this;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=0,t.abrupt("return",new Promise(function(t,o){return a(r,void 0,void 0,regeneratorRuntime.mark(function r(){var i,c,s=this;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return i=function r(){setTimeout(function(){return a(s,void 0,void 0,regeneratorRuntime.mark(function a(){var i;return regeneratorRuntime.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:return n++,a.prev=1,a.next=4,e.process();case 4:i=a.sent,t(i),a.next=13;break;case 8:if(a.prev=8,a.t0=a.catch(1),!(n>=e.limit)){a.next=12;break}return a.abrupt("return",void o(a.t0));case 12:r();case 13:case"end":return a.stop()}},a,null,[[1,8]])}))},e.interval)},r.prev=1,r.next=4,e.process();case 4:c=r.sent,t(c),r.next=11;break;case 8:r.prev=8,r.t0=r.catch(1),i();case 11:case"end":return r.stop()}},r,null,[[1,8]])}))}));case 2:case"end":return t.stop()}},t)}))}function d(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:500;return a(this,void 0,void 0,regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",new Promise(function(t){setTimeout(function(){t()},e)}));case 1:case"end":return t.stop()}},t)}))}function l(e,t){var n=e.dayHoverHandler;e.dayHoverHandler=function(e){var r=e.cell;return e.isHovered&&navigator.platform&&/iPad|iPhone|iPod/.test(navigator.platform)&&"ontouchstart"in window&&t.forEach(function(e){return e._datepickerRef.instance.daySelectHandler(r)}),n(e)}}function f(e,t){var n=new Uint8Array([239,187,191]);return new Blob([n,e],t)}function p(){for(var e={},t=location.search.replace("?","").split("&"),n=0;n<t.length;n++){var r=t[n].split("="),o=r[0],a=r[1];o&&a&&(e[o]=a)}return e}function j(){var e=sessionStorage.getItem("PROJECT"),t={projectId:"",projectName:"",storageUrl:{common:"",application:""}};return null===e||""===e?t:Object.assign(Object.assign({},t),JSON.parse(e))}function v(){var e=sessionStorage.getItem("EXTERNAL");return null===e||""===e?{}:JSON.parse(e)}function m(e){return a(this,void 0,void 0,regeneratorRuntime.mark(function t(){return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch(e,{method:"GET",cache:"no-cache",headers:{"Content-Type":"charset=utf-8"}});case 2:return t.abrupt("return",t.sent.ok);case 3:case"end":return t.stop()}},t)}))}function g(e){return JSON.parse(JSON.stringify(e))}function h(e){var t=e.direction,n=t===o.Direction.HORIZONTAL?1920:1080,r=t===o.Direction.HORIZONTAL?1080:1920,a={width:window.innerWidth/n,height:window.innerHeight/r},i=a.width<a.height?a.width:a.height,c=document.body;c.style.transform="scale(".concat(i,")"),c.style.opacity="1",c.style.width="".concat(n,"px"),c.style.height="".concat(r,"px"),c.setAttribute("data-scale",String(i)),document.documentElement.style.fontSize=t===o.Direction.HORIZONTAL?"30px":"20px"}function E(){document.body.style.transform="scale(1)"}function b(e){var t=new Date;console.log("\u65e5\u4ed8\u5909\u66f4\u30c1\u30a7\u30c3\u30af ",t.getDate(),e.getDate()),t.getDate()===e.getDate()?setTimeout(b,3e5,t):(console.log("\u65e5\u4ed8\u5909\u66f4\u691c\u77e5\u3001\u753b\u9762\u3092\u66f4\u65b0\u3057\u307e\u3059\u3002"),setTimeout(function(){location.reload()},15e3))}},f5zA:function(t,r,o){"use strict";o.d(r,"a",function(){return c});var a=o("wd/R"),i=o("ADXf"),c=function(){function t(n){e(this,t),this.screeningEvent=n.screeningEvent,this.now=void 0===n.now?a().toDate():n.now}return n(t,[{key:"isSales",value:function(e){var t=this.screeningEvent.offers;if(void 0===t)return!1;var n=!1,r=a(this.now).unix(),o=a(t.validFrom).unix(),i=a(t.validThrough).unix();switch(e){case"start":n=!(o<r);break;case"end":n=!(i>r);break;default:n=o<r&&i>r}return n}},{key:"isSeatStatus",value:function(e){var t=this.screeningEvent,n=Object(i.a)(),r=void 0===t.workPerformed||void 0===t.workPerformed.additionalProperty?void 0:t.workPerformed.additionalProperty.find(function(e){return"limitSeatNumber"===e.name}),o=t.remainingAttendeeCapacity,a=t.maximumAttendeeCapacity;if(void 0===o||void 0===a)return void 0===e;void 0!==r&&a>Number(r.value)&&(o=o<a-Number(r.value)?0:o-(a-Number(r.value)),a=Number(r.value));var c=!1,s=n.PURCHASE_SCHEDULE_STATUS_THRESHOLD_UNIT,u=Number(n.PURCHASE_SCHEDULE_STATUS_THRESHOLD_VALUE);if("%"===s){switch(e){case"success":c=0!==o&&Math.floor(o/a*100)>=u;break;case"warning":c=0!==o&&Math.floor(o/a*100)<u&&o>0;break;case"danger":c=0===o||o>a}return c}if("count"===s){switch(e){case"success":c=0!==o&&o>=u;break;case"warning":c=0!==o&&o<u&&o>0;break;case"danger":c=0===o}return c}return!1}},{key:"isTicketedSeat",value:function(){var e=this.screeningEvent;return void 0!==e.offers&&void 0!==e.offers.itemOffered.serviceOutput&&void 0!==e.offers.itemOffered.serviceOutput.reservedTicket&&void 0!==e.offers.itemOffered.serviceOutput.reservedTicket.ticketedSeat}},{key:"isInfinitetock",value:function(){return void 0===this.screeningEvent.maximumAttendeeCapacity}}]),t}()},jbcS:function(e,t,n){"use strict";n.r(t);var r=n("fXoL"),o=n("a3Wg"),a=(n("yLV6"),n("LpSC"),n("f0Wu")),i=n("U9ZV"),c=n("HOUK"),s=n("ADXf"),u=function(e,t,n,r){return new(n||(n=Promise))(function(o,a){function i(e){try{s(r.next(e))}catch(t){a(t)}}function c(e){try{s(r.throw(e))}catch(t){a(t)}}function s(e){var t;e.done?o(e.value):(t=e.value,t instanceof n?t:new n(function(e){e(t)})).then(i,c)}s((r=r.apply(e,t||[])).next())})};(function(){return u(this,void 0,void 0,regeneratorRuntime.mark(function e(){var t,n,o,d;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return a.tz.setDefault("Asia/Tokyo"),a.locale("ja"),Object(i.a)("ja",i.t),t=c.Util.getParameter(),Object.keys(t).length>0&&sessionStorage.setItem("EXTERNAL",JSON.stringify(Object.assign(Object.assign({},t),{project:void 0,dateFormat:void 0===t.dateFormat?void 0:decodeURIComponent(t.dateFormat)}))),void 0!==t.projectId&&sessionStorage.removeItem("PROJECT"),n=void 0===t.projectId?""===c.Util.getProject().projectId?void 0:c.Util.getProject().projectId:t.projectId,o=void 0===t.projectName?""===c.Util.getProject().projectName?void 0:c.Util.getProject().projectName:t.projectName,e.next=7,function(e){return u(this,void 0,void 0,regeneratorRuntime.mark(function t(){var n,r,o,a,i,c;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,fetch("/api/project",{method:"POST",cache:"no-cache",headers:{"Content-Type":"application/json; charset=utf-8"}});case 2:if((n=t.sent).ok){t.next=5;break}throw new Error(JSON.stringify({status:n.status,statusText:n.statusText}));case 5:return t.next=7,n.json();case 7:return r=t.sent,o=void 0!==r.projectId?r.projectId:void 0!==e.projectId?e.projectId:"",a=void 0!==r.projectName?r.projectName:void 0!==e.projectName?e.projectName:"",i=void 0===r.projectId&&void 0===r.projectName?""!==a?{application:"".concat(r.storageUrl.application,"/").concat(o,"-").concat(a),common:"".concat(r.storageUrl.common,"/").concat(o,"-").concat(a)}:{application:"".concat(r.storageUrl.application,"/").concat(o),common:"".concat(r.storageUrl.common,"/").concat(o)}:r.storageUrl,sessionStorage.setItem("PROJECT",JSON.stringify({projectId:o,projectName:a,storageUrl:i,env:r.env,gtmId:r.gtmId,analyticsId:r.analyticsId,gmoTokenUrl:r.gmoTokenUrl,sonyTokenUrl:r.sonyTokenUrl})),c=document.createElement("script"),t.abrupt("return",(c.src=r.gmoTokenUrl,document.body.appendChild(c),document.body.classList.add(r.env),r));case 14:case"end":return t.stop()}},t)}))}({projectId:n,projectName:o});case 7:if(d=e.sent,e.t0=void 0!==c.Util.getProject().storageUrl.application,!e.t0){e.next=13;break}return e.next=12,function(e){return u(this,void 0,void 0,regeneratorRuntime.mark(function t(){var n,o,i,d,l,f,p,j,v;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.storageUrl,o=e.gtmId,i=e.analyticsId,d=a().toISOString(),t.next=6,fetch("".concat(n,"/js/environment.js?=date").concat(d),{method:"GET",cache:"no-cache",headers:{"Content-Type":"application/json; charset=utf-8"}});case 6:if(!(l=t.sent).ok){t.next=15;break}return t.t0=window,t.next=11,l.text();case 11:t.t1=t.sent,t.t0.eval.call(t.t0,t.t1),t.next=16;break;case 15:window.environment={};case 16:return f=window.environment,p=f.GTM_ID,j=f.ANALYTICS_ID,window.environment.GTM_ID=void 0!==p&&""!==p||void 0===o?p:o,window.environment.ANALYTICS_ID=void 0!==j&&""!==j||void 0===i?j:i,v=Object(s.a)(),document.title=v.APP_TITLE,t.next=22,function(e){var t=e.primaryColor,n=document.createElement("style");n.id="applyColor",n.innerHTML="\n.btn-primary,\n.btn-outline-primary:hover,\nheader::after,\n.wrapper .bg-primary { background-color: ".concat(t," !important; }\n\n.btn-primary,\n.btn-outline-primary,\n.wrapper .border-primary { border-color: ").concat(t," !important; }\n\n.btn-outline-primary,\n.wrapper .text-primary { color: ").concat(t," !important; }\n    "),document.head.appendChild(n)}({primaryColor:v.PRIMARY_COLOR});case 22:return t.next=24,function(e){return u(this,void 0,void 0,regeneratorRuntime.mark(function t(){var n,r,o;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.storageUrl,r=a().toISOString(),(o=document.createElement("link")).rel="stylesheet",t.next=4,c.Util.isFile("".concat(n,"/css/style.css?=date").concat(r));case 4:if(!t.sent){t.next=8;break}t.t0="".concat(n,"/css/style.css?=date").concat(r),t.next=9;break;case 8:t.t0="/default/css/style.css?=date".concat(r);case 9:o.href=t.t0,document.head.appendChild(o);case 11:case"end":return t.stop()}},t)}))}({storageUrl:n});case 24:return t.next=26,function(e){return u(this,void 0,void 0,regeneratorRuntime.mark(function t(){var n,r;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.storageUrl,(r=document.createElement("link")).rel="icon",r.type='image/x-icon"',t.next=5,c.Util.isFile("".concat(n,"/favicon.ico"));case 5:if(!t.sent){t.next=9;break}t.t0="".concat(n,"/favicon.ico"),t.next=10;break;case 9:t.t0="/default/favicon.ico";case 10:r.href=t.t0,document.head.appendChild(r);case 12:case"end":return t.stop()}},t)}))}({storageUrl:n});case 26:!function(e){var t=e.id;void 0!==t&&""!==t&&function(e,t,n,r,o){e[r]=e[r]||[],e[r].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var a=t.getElementsByTagName(n)[0],i=t.createElement(n);i.async=!0,i.src="https://www.googletagmanager.com/gtm.js?id="+o,a.parentNode.insertBefore(i,a)}(window,document,"script","dataLayer",t)}({id:v.GTM_ID}),v.production&&Object(r.qb)();case 28:case"end":return t.stop()}},t)}))}({storageUrl:c.Util.getProject().storageUrl.application,gtmId:d.gtmId,analyticsId:d.analyticsId});case 12:c.Util.nextDateWatchman(new Date);case 13:case"end":return e.stop()}},e)}))})().then(function(){return u(void 0,void 0,void 0,regeneratorRuntime.mark(function e(){var t,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.e(6).then(n.bind(null,"aJAS"));case 2:t=e.sent,r=t.AppModule,Object(o.a)().bootstrapModule(r);case 5:case"end":return e.stop()}},e)}))}).catch(function(e){console.error(e);var t=e.message||JSON.stringify(e);document.body.innerHTML='\n        <div class="d-flex align-items-center justify-content-center h-100 px-5">'.concat(t,"</div>\n        ")})},zn8P:function(e,t){function n(e){return Promise.resolve().then(function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t})}n.keys=function(){return[]},n.resolve=n,e.exports=n,n.id="zn8P"}},[[0,0,5]]])}();