(()=>{function h(t,e){let r=Object.entries(e).map(([n,o])=>`${n}=${Array.isArray(o)?o.join(","):o}`).join("&");return`${t}?${encodeURI(r)}`}function y(t,e=500){let r;return(...n)=>{clearTimeout(r),r=setTimeout(()=>{t(...n)},e)}}function w(t,e="long"){let r=new Date(t),n={weekday:e},o;e==="long"?o={hour:"numeric",minute:"numeric",hour12:!0}:o={hour:"numeric",hour12:!0};let a=new Intl.DateTimeFormat("en-US",n).format(r),i=new Intl.DateTimeFormat("en-US",o).format(r);return{dayOfWeek:a,time:i}}async function k(t){let e=h("https://geocoding-api.open-meteo.com/v1/search",{count:5,name:t}),r=await fetch(e,{mode:"cors"});if(!r.ok)throw new Error("Failed to fetch locations.");let{results:n}=await r.json();if(n)return n.map(o=>({coordinates:{lon:o.longitude,lat:o.latitude},displayName:o.name+(o.admin1?`, ${o.admin1}`:""),country:o.country}));throw new Error("Location not recognized. Try a different name.")}async function M(t,e=!0){let r={latitude:t.lat,longitude:t.lon,timezone:"auto",forecast_hours:8,forecast_days:8,current:["temperature_2m","apparent_temperature","weather_code","precipitation","relative_humidity_2m","wind_speed_10m","is_day"],hourly:["temperature_2m","precipitation_probability","weather_code","is_day"],daily:["weather_code","temperature_2m_max","temperature_2m_min","precipitation_probability_max"]};e||(r.temperature_unit="fahrenheit",r.wind_speed_unit="mph",r.precipitation_unit="inch");let n=h("https://api.open-meteo.com/v1/forecast",r),o=await fetch(n,{mode:"cors"});if(!o.ok)throw new Error("Failed to fetch weather data.");let{current:a,current_units:i,hourly:s,daily:d}=await o.json();return{current:{dateTime:a.time,temperature:Math.round(a.temperature_2m),temperatureUnit:i.temperature_2m,apparentTemp:`${Math.round(a.apparent_temperature)}${i.apparent_temperature}`,precipitation:a.precipitation===0?"Clear":`${a.precipitation} ${i.precipitation}`,humidity:`${a.relative_humidity_2m}${i.relative_humidity_2m}`,wind:`${a.wind_speed_10m} ${i.wind_speed_10m}`,weatherCode:a.weather_code,weatherCondition:Z(a.weather_code),isDay:!!a.is_day},hourly:s.time.map((m,c)=>({time:m,temperature:Math.round(s.temperature_2m[c]),weatherCode:s.weather_code[c],precipitation:s.precipitation_probability[c],isDay:s.is_day[c]})),daily:d.time.map((m,c)=>({date:m,temperature:{min:Math.round(d.temperature_2m_min[c]),max:Math.round(d.temperature_2m_max[c])},precipitation:d.precipitation_probability_max[c],weatherCode:d.weather_code[c]}))}}function Z(t){return{0:"Clear sky",1:"Mainly clear",2:"Partly cloudy",3:"Overcast",45:"Fog",48:"Depositing rime fog",51:"Light drizzle",53:"Moderate drizzle",55:"Dense drizzle",56:"Light freezing drizzle",57:"Dense freezing drizzle",61:"Slight rain",63:"Moderate rain",65:"Heavy rain",66:"Light freezing rain",67:"Heavy freezing rain",71:"Slight snow fall",73:"Moderate snow fall",75:"Heavy snow fall",77:"Snow grains",80:"Slight rain showers",81:"Moderate rain showers",82:"Violent rain showers",85:"Slight snow showers",86:"Heavy snow showers",95:"Thunderstorm",96:"Thunderstorm with slight hail",99:"Thunderstorm with heavy hail"}[t]}async function b(){let t=await fetch("https://get.geojs.io/v1/ip/geo.json",{mode:"cors"});if(!t.ok)throw new Error("Failed to fetch IP location.");let e=await t.json();return{coordinates:{lat:e.latitude,lon:e.longitude},displayName:`${e.city}, ${e.region}`}}async function D(t,e){let r=h("https://nominatim.openstreetmap.org/reverse",{format:"jsonv2",lat:t,lon:e}),n=await fetch(r,{mode:"cors"});if(!n.ok)throw new Error("Failed to fetch address.");let{display_name:o}=await n.json();return o.split(",",2).join()}var z=document.querySelector("#forecast"),S=document.querySelector(".weather .time");function j(){S.textContent="",z.classList.add("hidden")}function ee(){z.classList.remove("hidden")}function _(t){let e=document.querySelector(".weather .location");e.textContent=t}function N(t){let e={temperature:document.querySelector(".current .temperature .value"),temperatureUnit:document.querySelector(".current .temperature .unit"),apparentTemp:document.querySelector(".current .apparent .value"),precipitation:document.querySelector(".current .precipitation .value"),humidity:document.querySelector(".current .humidity .value"),wind:document.querySelector(".current .wind .value"),weatherCondition:document.querySelector(".current .condition")};ee();for(let a in e)e[a].textContent=t[a];let{dayOfWeek:r,time:n}=w(t.dateTime);S.textContent=`${r} ${n}`,document.querySelector(".current .weather-icon").replaceChildren(B(t.weatherCode,{isDay:t.isDay})),document.documentElement.dataset.theme=t.isDay?"day":"night"}function L(t,e,r){return{start:()=>{t.classList.add("loader"),e&&e()},stop:()=>{t.classList.remove("loader"),r&&r()}}}var v=L(document.querySelector(".weather .loader-container"),j);function C(t){j(),S.textContent=t}function R(t,e){let r=document.querySelector(t);return n=>{let o=u(e,["heading"]),a=document.createElement("ul");a.classList.add("modules");for(let i of n){let s=te(i);a.append(s)}r.replaceChildren(o,a)}}var P=R("#forecast .hourly","Hourly"),W=R("#forecast .daily","This Week");function te({weatherCode:t,temperature:e,precipitation:r,isDay:n,date:o,time:a}){let i=document.createElement("li"),s=u("",["weather-icon"],"div");s.replaceChildren(B(t,{isDay:n}));let d=w(o||a,"short"),m=u(o?d.dayOfWeek:d.time,["day-time"]),c=u("",["temperature"],"div");if(Object.hasOwn(e,"max")&&Object.hasOwn(e,"min")){let g=u(`${e.max}\xB0`,["max"],"span"),Y=u(`${e.min}\xB0`,["min"],"span");c.append(g,Y)}else{let g=u(`${e}\xB0`,["temperature"]);c.append(g)}let X=re(r);return i.append(s,m,c,X),i}function re(t){let e=u("",["precipitation"]);if(!t)return e;let r=u("",["icon"],"span"),n=O("svg",{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"}),o=O("path",{d:"M7 .565c4.667 6.09 7 10.423 7 13a7 7 0 1 1-14 0c0-2.577 2.333-6.91 7-13"});e.appendChild(r).appendChild(n).appendChild(o);let a=u(`${t}%`,["value"],"span");return e.append(a),e}function B(t,e={}){let{isDay:r=!0,fill:n=!1}=e,o={0:r?100:150,1:r?102:152,2:r?103:153,3:104,45:501,48:514,51:305,53:309,55:307,56:2214,57:2214,61:305,63:306,65:307,66:313,67:313,71:400,73:401,75:402,77:499,80:314,81:315,82:316,85:408,86:410,95:302,96:304,99:304},a=document.createElement("i"),i=`qi-${o[t]}`;return n&&(i+="-fill"),a.classList.add("icon",i),a}function O(t,e){let n=document.createElementNS("http://www.w3.org/2000/svg",t);for(let o in e)n.setAttribute(o,e[o]);return n}function u(t,e=[],r="p"){let n=document.createElement(r);return t&&(n.textContent=t),e.length&&n.classList.add(...e),n}var U=document.querySelector("#search"),x=document.querySelector("#search-bar"),H=document.querySelector(".search-results"),E=document.querySelector(".search-results .results"),I=document.querySelector("#precise-location");function oe(t,e=null){let r=document.createElement("li");return r.textContent=t,e&&(r.classList.add("search-item"),r.tabIndex=0,r.addEventListener("click",()=>{x.value="",E.replaceChildren(),T(),e()}),r.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),r.click())})),r}function q(t){let e=t.map(r=>oe(r.text,r.handler));E.replaceChildren(...e)}var $=L(U.querySelector(".loader-container"));function A(t){let e=r=>{E.replaceChildren();let{value:n}=r.target;n&&t(n)};x.addEventListener("input",y(e))}function T(){H.classList.add("hidden"),I.classList.add("hidden"),document.removeEventListener("click",J)}function ae(){H.classList.remove("hidden"),I.classList.remove("hidden"),document.addEventListener("click",J)}function J(t){U.contains(t.target)||T()}function V(t,e){let r=()=>{T(),navigator.geolocation.getCurrentPosition(t,e,{timeout:6e3})};I.addEventListener("click",r)}x.addEventListener("focus",ae);var f,l=!0,ce={displayName:"Manila, Metro Manila",coordinates:{lon:120.9822,lat:14.6042}};async function se(t){$.start();try{let e=await k(t),r=ue(e);q(r)}catch(e){q([{text:e.message}])}$.stop()}function ue(t){return t.map(e=>({text:`${e.displayName}, ${e.country}`,handler(){p(e)}}))}function p(t){f=t,_(f.displayName),G(),localStorage.setItem("location",JSON.stringify(f))}async function G(t=f.coordinates){v.start();try{let e=await M(t,l);N(e.current);let[,...r]=e.hourly;P(r);let[,...n]=e.daily;W(n)}catch(e){C(e.message),console.error(e)}v.stop()}async function K({coords:t}){let{longitude:e,latitude:r}=t,n=await D(r,e);p({displayName:n,coordinates:{lon:e,lat:r}})}async function de(){try{let t=await b();p(t)}catch(t){console.error(t.message),p(ce)}}async function le(){let t=localStorage.getItem("isMetric");l=t?JSON.parse(t):!0,Q();let e=localStorage.getItem("location");if(!e){navigator.geolocation.getCurrentPosition(K,de,{timeout:5e3});return}p(JSON.parse(e))}var F=document.querySelector(".toggle-unit"),me=y(()=>{localStorage.setItem("isMetric",JSON.stringify(l)),G()},300);function Q(){let t=F.querySelector(".metric"),e=F.querySelector(".imperial");t.classList.toggle("active",l),e.classList.toggle("active",!l)}function pe(){l=!l,Q(),me()}F.addEventListener("click",pe);A(se);V(K,t=>{_(""),C(t.message),console.warn(`ERROR(${t.code}): ${t.message}`)});document.addEventListener("DOMContentLoaded",le);})();
