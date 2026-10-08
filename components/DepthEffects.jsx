'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function DepthEffects(){
 const pathname=usePathname();
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)'),cleanups=new Map();
  const setup=()=>{
   for(const [card,cleanup] of cleanups)if(!card.isConnected){cleanup();cleanups.delete(card);}
   document.querySelectorAll('[data-depth], .product-card, .warehouse-region, .about-visual, .model-card').forEach(card=>{
    if(cleanups.has(card))return;card.classList.add('depth-card');let frame;
    const reset=()=>{cancelAnimationFrame(frame);card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');card.classList.remove('depth-active');};
    const move=e=>{if(reduced.matches||!fine.matches)return;const r=card.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(e.clientX-r.left)/r.width*2-1)),y=Math.max(-1,Math.min(1,(e.clientY-r.top)/r.height*2-1));cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{card.style.setProperty('--rx',(-y*5).toFixed(2)+'deg');card.style.setProperty('--ry',(x*6).toFixed(2)+'deg');card.style.setProperty('--glow-x',(x*50+50)+'%');card.style.setProperty('--glow-y',(y*50+50)+'%');card.classList.add('depth-active');});};
    card.addEventListener('pointermove',move);card.addEventListener('pointerleave',reset);card.addEventListener('pointercancel',reset);card.addEventListener('blur',reset,true);reduced.addEventListener('change',reset);
    cleanups.set(card,()=>{reset();card.removeEventListener('pointermove',move);card.removeEventListener('pointerleave',reset);card.removeEventListener('pointercancel',reset);card.removeEventListener('blur',reset,true);reduced.removeEventListener('change',reset);});
   });
  };
  setup();const observer=new MutationObserver(setup);const main=document.querySelector('main');if(main)observer.observe(main,{childList:true,subtree:true});return()=>{observer.disconnect();cleanups.forEach(fn=>fn());};
 },[pathname]);return null;
}
