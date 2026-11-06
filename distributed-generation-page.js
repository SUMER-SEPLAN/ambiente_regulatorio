"use strict";

function initDistributedGenerationReveal(){
  const items=document.querySelectorAll(".gd-reveal");
  if(!items.length)return;
  if(!("IntersectionObserver"in window)||matchMedia("(prefers-reduced-motion: reduce)").matches){
    items.forEach(item=>item.classList.add("is-visible"));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },{threshold:.08,rootMargin:"0px 0px -7% 0px"});
  items.forEach(item=>observer.observe(item));
}

function initDistributedGenerationParticipation(){
  const section=document.querySelector(".gd-modalities");
  const flow=document.querySelector(".gd-participation-flow");
  if(!section||!flow)return;
  const steps=[...flow.querySelectorAll(":scope > li")];
  const reduceMotion=matchMedia("(prefers-reduced-motion: reduce)").matches;
  flow.classList.add("is-participation-motion");
  if(reduceMotion||!("IntersectionObserver"in window)){
    flow.style.setProperty("--participation-progress","1");
    steps.forEach(step=>step.classList.add("is-marker-visible","is-step-visible"));
    return;
  }
  let frame=0;
  let restartArmed=false;
  let lastScrollY=scrollY;
  let cascadeTimer=0;
  const revealStep=step=>{
    step.classList.add("is-marker-visible");
    setTimeout(()=>step.classList.add("is-step-visible"),90);
  };
  const replay=()=>{
    clearTimeout(cascadeTimer);
    cascadeTimer=0;
    flow.style.setProperty("--participation-progress","0");
    steps.forEach(step=>step.classList.remove("is-marker-visible","is-step-visible"));
    requestAnimationFrame(update);
  };
  const update=()=>{
    frame=0;
    const rect=flow.getBoundingClientRect();
    const sectionRect=section.getBoundingClientRect();
    const scrollingUp=scrollY<lastScrollY;
    lastScrollY=scrollY;
    if(sectionRect.top<-80)restartArmed=true;
    if(restartArmed&&scrollingUp&&sectionRect.top>=0&&sectionRect.top<=innerHeight*.35){
      restartArmed=false;
      replay();
      return;
    }
    const guide=innerHeight*.84;
    const lineTop=21;
    const drawable=Math.max(1,rect.height-73);
    const painted=Math.max(0,Math.min(drawable,guide-rect.top-lineTop));
    flow.style.setProperty("--participation-progress",(painted/drawable).toFixed(4));
    if(cascadeTimer)return;
    const index=steps.findIndex(step=>!step.classList.contains("is-marker-visible"));
    if(index<0)return;
    const step=steps[index];
    const marker=step.querySelector(".gd-participation-flow__marker");
    const markerRect=marker.getBoundingClientRect();
    const firstReady=index===0&&rect.top<=innerHeight*.82;
    if(firstReady||markerRect.top+markerRect.height*.5<=guide){
      revealStep(step);
      cascadeTimer=setTimeout(()=>{
        cascadeTimer=0;
        schedule();
      },190);
    }
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
  addEventListener("scroll",schedule,{passive:true});
  addEventListener("resize",schedule,{passive:true});
  schedule();
}

function initSharedOrganizationReveal(){
  const section=document.querySelector(".gd-shared-organization");
  const items=[...document.querySelectorAll(".gd-shared-organization__forms article")];
  if(!section||!items.length)return;
  if(!("IntersectionObserver"in window)||matchMedia("(prefers-reduced-motion: reduce)").matches){
    items.forEach(item=>item.classList.add("is-visible"));
    return;
  }
  let restartArmed=false;
  let lastScrollY=scrollY;
  let replayTimers=[];
  const replay=()=>{
    replayTimers.forEach(clearTimeout);
    replayTimers=[];
    items.forEach(item=>item.classList.remove("is-visible"));
    requestAnimationFrame(()=>items.forEach((item,index)=>{
      replayTimers.push(setTimeout(()=>item.classList.add("is-visible"),index*170));
    }));
  };
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const index=items.indexOf(entry.target);
      setTimeout(()=>entry.target.classList.add("is-visible"),Math.max(0,index)*80);
      observer.unobserve(entry.target);
    });
  },{threshold:.18,rootMargin:"0px 0px -6% 0px"});
  items.forEach(item=>observer.observe(item));
  addEventListener("scroll",()=>{
    const rect=section.getBoundingClientRect();
    const scrollingUp=scrollY<lastScrollY;
    lastScrollY=scrollY;
    if(rect.top<-80)restartArmed=true;
    if(restartArmed&&scrollingUp&&rect.top>=0&&rect.top<=innerHeight*.35){
      restartArmed=false;
      replay();
    }
  },{passive:true});
}

initDistributedGenerationReveal();
initDistributedGenerationParticipation();
initSharedOrganizationReveal();
