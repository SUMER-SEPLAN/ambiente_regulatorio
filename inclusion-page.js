"use strict";
document.querySelectorAll(".inclusion-card__summary").forEach((button)=>{button.addEventListener("click",()=>{const card=button.closest(".inclusion-card");const detail=document.getElementById(button.getAttribute("aria-controls"));const willOpen=button.getAttribute("aria-expanded")!=="true";button.setAttribute("aria-expanded",String(willOpen));detail.hidden=!willOpen;card.classList.toggle("is-open",willOpen)})});
const inclusionRevealItems=document.querySelectorAll(".inclusion-reveal");if("IntersectionObserver" in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){const inclusionRevealObserver=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(!entry.isIntersecting)return;entry.target.classList.add("is-visible");inclusionRevealObserver.unobserve(entry.target)})},{threshold:.12});inclusionRevealItems.forEach((item)=>inclusionRevealObserver.observe(item))}else inclusionRevealItems.forEach((item)=>item.classList.add("is-visible"));

const inclusionRoute=document.querySelector(".inclusion-route");
if(inclusionRoute){
  const routeArticles=[...inclusionRoute.querySelectorAll("article")];
  const reduceRouteMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
  inclusionRoute.classList.add("inclusion-route-motion");
  if(reduceRouteMotion){
    inclusionRoute.style.setProperty("--route-progress","1");
    routeArticles.forEach((article)=>article.classList.add("is-number-visible","is-name-visible","is-content-visible"));
  }else{
    const revealTimers=new Set();
    const later=(callback,delay)=>{const timer=setTimeout(()=>{revealTimers.delete(timer);callback()},delay);revealTimers.add(timer)};
    const revealRouteArticle=(article)=>{
      article.classList.add("is-number-visible");
      later(()=>article.classList.add("is-name-visible"),70);
      later(()=>article.classList.add("is-content-visible"),150);
    };
    const resetInclusionRoute=()=>{
      revealTimers.forEach(clearTimeout);
      revealTimers.clear();
      routeArticles.forEach((article)=>article.classList.remove("is-number-visible","is-name-visible","is-content-visible"));
    };
    let routeFrame=0;
    const updateInclusionRoute=()=>{
      routeFrame=0;
      const routeRect=inclusionRoute.getBoundingClientRect();
      const routeTop=38;
      const routeGuide=innerHeight*.86;
      if(scrollY<=24){
        inclusionRoute.style.setProperty("--route-progress","0");
        resetInclusionRoute();
        return;
      }
      const drawable=Math.max(1,routeRect.height-76);
      const paintedLength=Math.max(0,Math.min(drawable,routeGuide-routeRect.top-routeTop));
      const progress=paintedLength/drawable;
      inclusionRoute.style.setProperty("--route-progress",progress.toFixed(4));
      routeArticles.forEach((article,index)=>{
        if(article.classList.contains("is-number-visible"))return;
        const marker=article.querySelector(".inclusion-route__marker");
        const markerCenter=marker.getBoundingClientRect().top+marker.getBoundingClientRect().height*.5;
        const firstCardReady=index===0&&routeRect.top<=innerHeight*.82;
        if(firstCardReady||markerCenter<=routeGuide){
          revealRouteArticle(article);
        }
      });
    };
    const scheduleInclusionRoute=()=>{if(!routeFrame)routeFrame=requestAnimationFrame(updateInclusionRoute)};
    addEventListener("scroll",scheduleInclusionRoute,{passive:true});
    addEventListener("resize",scheduleInclusionRoute,{passive:true});
    scheduleInclusionRoute();
  }
}

const inclusionTable=document.querySelector("#tema-normas");
const inclusionScrollbar=document.querySelector("#inclusion-table-scrollbar");
const inclusionScrollbarThumb=document.querySelector("#inclusion-table-scrollbar-thumb");
function updateInclusionScrollbar(){if(!inclusionTable||!inclusionScrollbar||!inclusionScrollbarThumb)return;const maximum=Math.max(0,inclusionTable.scrollHeight-inclusionTable.clientHeight);const track=inclusionScrollbar.clientHeight;const ratio=inclusionTable.clientHeight/inclusionTable.scrollHeight;const thumbHeight=Math.max(56,track*ratio);const travel=Math.max(0,track-thumbHeight);const position=maximum?inclusionTable.scrollTop/maximum*travel:0;inclusionScrollbar.hidden=maximum<=1;inclusionScrollbarThumb.style.height=`${thumbHeight}px`;inclusionScrollbarThumb.style.transform=`translateY(${position}px)`;inclusionScrollbar.setAttribute("aria-valuenow",String(maximum?Math.round(inclusionTable.scrollTop/maximum*100):0))}
if(inclusionTable&&inclusionScrollbar&&inclusionScrollbarThumb){let drag=null;const scrollFromPointer=(clientY,offset)=>{const rect=inclusionScrollbar.getBoundingClientRect();const height=inclusionScrollbarThumb.getBoundingClientRect().height;const travel=Math.max(1,rect.height-height);const position=Math.max(0,Math.min(travel,clientY-rect.top-offset));const maximum=Math.max(0,inclusionTable.scrollHeight-inclusionTable.clientHeight);inclusionTable.scrollTop=position/travel*maximum};inclusionTable.addEventListener("scroll",updateInclusionScrollbar,{passive:true});inclusionScrollbar.addEventListener("pointerdown",event=>{const thumbRect=inclusionScrollbarThumb.getBoundingClientRect();const onThumb=event.clientY>=thumbRect.top&&event.clientY<=thumbRect.bottom;drag={id:event.pointerId,offset:onThumb?event.clientY-thumbRect.top:thumbRect.height/2};inclusionScrollbar.setPointerCapture(event.pointerId);scrollFromPointer(event.clientY,drag.offset)});inclusionScrollbar.addEventListener("pointermove",event=>{if(drag&&drag.id===event.pointerId)scrollFromPointer(event.clientY,drag.offset)});const finish=event=>{if(!drag||drag.id!==event.pointerId)return;drag=null;if(inclusionScrollbar.hasPointerCapture(event.pointerId))inclusionScrollbar.releasePointerCapture(event.pointerId)};inclusionScrollbar.addEventListener("pointerup",finish);inclusionScrollbar.addEventListener("pointercancel",finish);inclusionScrollbar.addEventListener("keydown",event=>{if(!["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"].includes(event.key))return;event.preventDefault();const step=event.key.startsWith("Page")?inclusionTable.clientHeight*.8:48;if(event.key==="Home")inclusionTable.scrollTop=0;else if(event.key==="End")inclusionTable.scrollTop=inclusionTable.scrollHeight;else inclusionTable.scrollTop+=(event.key==="ArrowUp"||event.key==="PageUp")?-step:step});new ResizeObserver(updateInclusionScrollbar).observe(inclusionTable);setTimeout(updateInclusionScrollbar,0)}
