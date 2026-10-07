(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function t(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=t(a);fetch(a.href,i)}})();class _{constructor(){this.enabled=!0,this.ctx=null}init(){if(!this.ctx){const e=window.AudioContext||window.webkitAudioContext;e&&(this.ctx=new e)}this.ctx&&this.ctx.state==="suspended"&&this.ctx.resume()}toggle(){return this.enabled=!this.enabled,this.enabled}pop(e=520){if(!this.enabled||(this.init(),!this.ctx))return;const t=this.ctx.createOscillator(),s=this.ctx.createGain();t.type="sine";const a=this.ctx.currentTime;t.frequency.setValueAtTime(e,a),t.frequency.exponentialRampToValueAtTime(e*2.2,a+.08),s.gain.setValueAtTime(.25,a),s.gain.exponentialRampToValueAtTime(.001,a+.09),t.connect(s),s.connect(this.ctx.destination),t.start(a),t.stop(a+.09)}boing(){if(!this.enabled||(this.init(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createGain(),s=this.ctx.currentTime;e.type="triangle",e.frequency.setValueAtTime(220,s),e.frequency.linearRampToValueAtTime(480,s+.08),e.frequency.linearRampToValueAtTime(260,s+.16),e.frequency.linearRampToValueAtTime(540,s+.24),t.gain.setValueAtTime(.2,s),t.gain.exponentialRampToValueAtTime(.001,s+.28),e.connect(t),t.connect(this.ctx.destination),e.start(s),e.stop(s+.28)}sparkle(){if(!this.enabled||(this.init(),!this.ctx))return;const e=[659.25,783.99,987.77,1318.51,1567.98],t=this.ctx.currentTime;e.forEach((s,a)=>{const i=this.ctx.createOscillator(),r=this.ctx.createGain(),o=t+a*.045;i.type="sine",i.frequency.setValueAtTime(s,o),r.gain.setValueAtTime(.12,o),r.gain.exponentialRampToValueAtTime(.001,o+.18),i.connect(r),r.connect(this.ctx.destination),i.start(o),i.stop(o+.19)})}tick(){if(!this.enabled||(this.init(),!this.ctx))return;const e=this.ctx.createOscillator(),t=this.ctx.createGain(),s=this.ctx.currentTime;e.type="sine",e.frequency.setValueAtTime(800,s),e.frequency.exponentialRampToValueAtTime(300,s+.03),t.gain.setValueAtTime(.15,s),t.gain.exponentialRampToValueAtTime(.001,s+.03),e.connect(t),t.connect(this.ctx.destination),e.start(s),e.stop(s+.03)}pageTurn(){if(!this.enabled||(this.init(),!this.ctx))return;const e=this.ctx.sampleRate*.15,t=this.ctx.createBuffer(1,e,this.ctx.sampleRate),s=t.getChannelData(0);for(let o=0;o<e;o++)s[o]=(Math.random()*2-1)*Math.exp(-o/(e*.25));const a=this.ctx.createBufferSource();a.buffer=t;const i=this.ctx.createBiquadFilter();i.type="bandpass",i.frequency.setValueAtTime(1400,this.ctx.currentTime),i.Q.setValueAtTime(1.5,this.ctx.currentTime);const r=this.ctx.createGain();r.gain.setValueAtTime(.18,this.ctx.currentTime),r.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.15),a.connect(i),i.connect(r),r.connect(this.ctx.destination),a.start()}win(){if(!this.enabled||(this.init(),!this.ctx))return;const e=[{f:523.25,d:.1,t:0},{f:659.25,d:.1,t:.1},{f:783.99,d:.1,t:.2},{f:1046.5,d:.35,t:.3}],t=this.ctx.currentTime;e.forEach(s=>{const a=this.ctx.createOscillator(),i=this.ctx.createGain(),r=t+s.t;a.type="triangle",a.frequency.setValueAtTime(s.f,r),i.gain.setValueAtTime(.2,r),i.gain.exponentialRampToValueAtTime(.001,r+s.d),a.connect(i),i.connect(this.ctx.destination),a.start(r),a.stop(r+s.d)})}}const l=new _;class Q{constructor(){this.enabled=!0,this.cursorEl=null,this.particles=[],this.lastX=0,this.lastY=0,this.throttleTime=0,this.colors=["#FF80AB","#FFD54F","#4DD0E1","#81C784","#BA68C8","#FFAB91"],this.shapes=["★","✦","♥","●","✿"],this.init()}init(){this.cursorEl=document.createElement("div"),this.cursorEl.className="custom-wand-cursor",this.cursorEl.innerHTML=`
      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 27L22 12" stroke="#4A3B32" stroke-width="4.5" stroke-linecap="round"/>
        <path d="M7 27L22 12" stroke="#FFD166" stroke-width="3" stroke-linecap="round"/>
        <!-- Star Tip -->
        <polygon points="24,4 26.5,10 32,10.5 27.5,14.5 29,20 24,16.5 19,20 20.5,14.5 16,10.5 21.5,10" fill="#FF5E7E" stroke="#3D2C2E" stroke-width="1.8" stroke-linejoin="round"/>
        <circle cx="24" cy="12.5" r="2" fill="#FFE5EC"/>
      </svg>
    `,document.body.appendChild(this.cursorEl),this.canvas=document.createElement("canvas"),this.canvas.className="magic-particles-canvas",this.ctx=this.canvas.getContext("2d"),document.body.appendChild(this.canvas),this.resize(),window.addEventListener("resize",()=>this.resize()),window.addEventListener("mousemove",e=>this.onMouseMove(e)),window.addEventListener("mousedown",e=>this.onMouseDown(e)),document.addEventListener("mouseleave",()=>{this.cursorEl.style.opacity="0"}),document.addEventListener("mouseenter",()=>{this.cursorEl.style.opacity="1"}),this.animate()}resize(){this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight}onMouseMove(e){if(!this.enabled)return;this.cursorEl.style.transform=`translate3d(${e.clientX-6}px, ${e.clientY-6}px, 0)`;const t=performance.now(),s=Math.hypot(e.clientX-this.lastX,e.clientY-this.lastY);t-this.throttleTime>25&&s>6&&(this.throttleTime=t,this.spawnStardust(e.clientX,e.clientY,1+Math.min(s/25,2))),this.lastX=e.clientX,this.lastY=e.clientY}onMouseDown(e){this.enabled&&(this.burstSparkles(e.clientX,e.clientY,10),this.cursorEl.classList.add("wand-cast"),setTimeout(()=>this.cursorEl.classList.remove("wand-cast"),180))}spawnStardust(e,t,s){for(let a=0;a<s;a++)this.particles.push({x:e+(Math.random()*12-6),y:t+(Math.random()*12-6),vx:(Math.random()*2-1)*.8,vy:(Math.random()*2-.5)*.8+.4,size:Math.random()*10+7,color:this.colors[Math.floor(Math.random()*this.colors.length)],shape:this.shapes[Math.floor(Math.random()*this.shapes.length)],rotation:Math.random()*Math.PI*2,vRot:Math.random()*.2-.1,alpha:1,life:1,decay:Math.random()*.03+.02})}burstSparkles(e,t,s=12){for(let a=0;a<s;a++){const i=Math.PI*2*a/s+(Math.random()*.4-.2),r=Math.random()*4+2.5;this.particles.push({x:e,y:t,vx:Math.cos(i)*r,vy:Math.sin(i)*r,size:Math.random()*12+10,color:this.colors[Math.floor(Math.random()*this.colors.length)],shape:this.shapes[Math.floor(Math.random()*this.shapes.length)],rotation:Math.random()*Math.PI*2,vRot:Math.random()*.3-.15,alpha:1,life:1,decay:Math.random()*.025+.02})}}animate(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);for(let e=this.particles.length-1;e>=0;e--){const t=this.particles[e];if(t.x+=t.vx,t.y+=t.vy,t.rotation+=t.vRot,t.life-=t.decay,t.alpha=Math.max(0,t.life),t.life<=0){this.particles.splice(e,1);continue}this.ctx.save(),this.ctx.translate(t.x,t.y),this.ctx.rotate(t.rotation),this.ctx.globalAlpha=t.alpha,this.ctx.fillStyle=t.color,this.ctx.font=`${t.size}px 'Comic Neue', cursive, sans-serif`,this.ctx.textAlign="center",this.ctx.textBaseline="middle",this.ctx.fillText(t.shape,0,0),this.ctx.restore()}requestAnimationFrame(()=>this.animate())}toggle(){return this.enabled=!this.enabled,this.cursorEl.style.display=this.enabled?"block":"none",this.canvas.style.display=this.enabled?"block":"none",document.body.classList.toggle("default-cursor",!this.enabled),this.enabled}}class z{constructor(e){this.container=e,this.speechEl=null,this.svgEl=null,this.pupils=[],this.quotes=["Welcome, Super Teacher! Let's make learning magical! ✨","Peek inside the Flipbooks to see real worksheet pages! 📖","Spin the Prize Wheel in the Fun Zone for sweet discounts! 🎡","Drag and pack a bundle to save 25% today! 🎒","Teachers & Moms are real-life superheroes! 💕","Bloop! Click me anytime for a smile! 🖍️"],this.quoteIndex=0,this.render(),this.initInteractions()}render(){this.container.innerHTML=`
      <div class="mascot-wrapper">
        <!-- Speech Bubble -->
        <div class="mascot-speech-bubble" id="mascotBubble">
          <span class="speech-text">Welcome, Super Teacher! Let's make learning magical! ✨</span>
          <div class="bubble-arrow"></div>
        </div>

        <!-- SVG Animated Teacher Mom -->
        <div class="mascot-svg-wrap" id="mascotArt">
          <svg class="teacher-mom-svg" viewBox="0 0 460 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Floaty Educational Bubbles from Tablet -->
            <g class="floaty-letters">
              <g class="float-item float-item-1">
                <circle cx="340" cy="140" r="18" fill="#FFE5EC" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="340" y="146" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="16" fill="#FF5E7E">1</text>
              </g>
              <g class="float-item float-item-2">
                <circle cx="380" cy="110" r="20" fill="#E8F8F5" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="380" y="117" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="18" fill="#3AAFA9">A</text>
              </g>
              <g class="float-item float-item-3">
                <circle cx="410" cy="155" r="17" fill="#FEF9E7" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="410" y="161" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="16" fill="#F39C12">2</text>
              </g>
              <g class="float-item float-item-4">
                <circle cx="365" cy="190" r="19" fill="#EBF5FB" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="365" y="196" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="16" fill="#3498DB">B</text>
              </g>
              <g class="float-item float-item-5">
                <circle cx="430" cy="205" r="16" fill="#F4ECF7" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="430" y="211" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="15" fill="#8E44AD">3</text>
              </g>
              <g class="float-item float-item-6">
                <circle cx="320" cy="180" r="15" fill="#FDEDEC" stroke="#3D2C2E" stroke-width="2.5"/>
                <text x="320" y="185" text-anchor="middle" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#E74C3C">C</text>
              </g>
            </g>

            <!-- Hair Back Bun -->
            <circle cx="210" cy="130" r="52" fill="#5A3828" stroke="#3D2C2E" stroke-width="4"/>
            <!-- Hair Scrunchie -->
            <circle cx="210" cy="140" r="28" fill="#FF80AB" stroke="#3D2C2E" stroke-width="3"/>
            <!-- Loose Wisps / Bun Doodles -->
            <path d="M185 100 Q 210 80 235 105" stroke="#3D2C2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>

            <!-- Torso / Teal Shirt -->
            <path d="M125 380 Q 140 330 220 330 Q 300 330 315 380 L 325 510 L 115 510 Z" fill="#64DFDF" stroke="#3D2C2E" stroke-width="4"/>
            
            <!-- Apron (Soft Salmon Pink) -->
            <path d="M150 360 C 170 350 270 350 290 360 L 305 510 L 135 510 Z" fill="#FFB7B2" stroke="#3D2C2E" stroke-width="4"/>
            <path d="M170 345 L 165 370" stroke="#3D2C2E" stroke-width="3" stroke-linecap="round"/>
            <path d="M270 345 L 275 370" stroke="#3D2C2E" stroke-width="3" stroke-linecap="round"/>

            <!-- Apron Pocket -->
            <rect x="180" y="420" width="80" height="65" rx="10" fill="#FF8A80" stroke="#3D2C2E" stroke-width="3.5"/>
            <!-- Cute Ruler & Pencil in Pocket -->
            <rect x="195" y="395" width="12" height="35" rx="2" fill="#FFE082" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(-10 195 395)"/>
            <rect x="235" y="390" width="10" height="40" rx="2" fill="#80D8FF" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(12 235 390)"/>

            <!-- Neck -->
            <rect x="200" y="300" width="40" height="40" rx="10" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>

            <!-- Head / Face -->
            <ellipse cx="220" cy="245" rx="66" ry="72" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="4"/>

            <!-- Ears -->
            <ellipse cx="152" cy="248" rx="12" ry="16" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>
            <ellipse cx="288" cy="248" rx="12" ry="16" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>
            <!-- Heart Earrings -->
            <path d="M150 262 C148 259 144 260 144 263 C144 266 150 271 150 271 C150 271 156 266 156 263 C156 260 152 259 150 262 Z" fill="#FF4081"/>
            <path d="M290 262 C288 259 284 260 284 263 C284 266 290 271 290 271 C290 271 296 266 296 263 C296 260 292 259 290 262 Z" fill="#FF4081"/>

            <!-- Hair Front & Bangs -->
            <path d="M152 220 C 160 170 280 170 288 220 C 270 195 240 195 220 205 C 200 195 170 195 152 220 Z" fill="#5A3828" stroke="#3D2C2E" stroke-width="4"/>
            <!-- Left Side Hair Lock -->
            <path d="M155 210 Q 148 270 162 290" fill="none" stroke="#5A3828" stroke-width="8" stroke-linecap="round"/>
            <path d="M155 210 Q 148 270 162 290" fill="none" stroke="#3D2C2E" stroke-width="3.5" stroke-linecap="round"/>
            <!-- Right Side Hair Lock -->
            <path d="M285 210 Q 292 270 278 290" fill="none" stroke="#5A3828" stroke-width="8" stroke-linecap="round"/>
            <path d="M285 210 Q 292 270 278 290" fill="none" stroke="#3D2C2E" stroke-width="3.5" stroke-linecap="round"/>

            <!-- Eyebrows -->
            <path d="M180 208 Q 195 200 208 208" stroke="#3D2C2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            <path d="M232 208 Q 245 200 260 208" stroke="#3D2C2E" stroke-width="3.5" fill="none" stroke-linecap="round"/>

            <!-- Glasses Frame -->
            <g class="mascot-glasses">
              <!-- Left Rim -->
              <circle cx="194" cy="235" r="23" fill="#FFFFFF" fill-opacity="0.3" stroke="#3D2C2E" stroke-width="4.5"/>
              <!-- Right Rim -->
              <circle cx="246" cy="235" r="23" fill="#FFFFFF" fill-opacity="0.3" stroke="#3D2C2E" stroke-width="4.5"/>
              <!-- Bridge -->
              <path d="M217 232 Q 220 228 223 232" stroke="#3D2C2E" stroke-width="4.5" fill="none" stroke-linecap="round"/>
            </g>

            <!-- Eyes & Pupils (Pupils react to mouse) -->
            <g class="mascot-eyes">
              <!-- Left Eye -->
              <ellipse cx="194" cy="235" rx="9" ry="12" fill="#FFFFFF"/>
              <ellipse class="pupil-left" cx="194" cy="235" rx="6.5" ry="8.5" fill="#3D2C2E"/>
              <circle cx="192" cy="231" r="2.5" fill="#FFFFFF"/>
              <circle cx="196" cy="238" r="1.2" fill="#FFFFFF"/>

              <!-- Right Eye -->
              <ellipse cx="246" cy="235" rx="9" ry="12" fill="#FFFFFF"/>
              <ellipse class="pupil-right" cx="246" cy="235" rx="6.5" ry="8.5" fill="#3D2C2E"/>
              <circle cx="244" cy="231" r="2.5" fill="#FFFFFF"/>
              <circle cx="248" cy="238" r="1.2" fill="#FFFFFF"/>
            </g>

            <!-- Rosy Cheeks Blush -->
            <ellipse cx="170" cy="256" rx="10" ry="6" fill="#FF8A80" fill-opacity="0.6"/>
            <ellipse cx="270" cy="256" rx="10" ry="6" fill="#FF8A80" fill-opacity="0.6"/>

            <!-- Nose -->
            <path d="M220 244 Q 223 249 219 251" stroke="#3D2C2E" stroke-width="2.5" fill="none" stroke-linecap="round"/>

            <!-- Smile Mouth -->
            <g class="mascot-mouth">
              <path d="M208 262 Q 220 274 232 262" stroke="#3D2C2E" stroke-width="3.5" fill="#FF5252" stroke-linecap="round"/>
            </g>

            <!-- Left Arm holding Tablet -->
            <g class="arm-tablet">
              <path d="M140 370 Q 165 425 210 425" stroke="#FDD9B5" stroke-width="22" stroke-linecap="round" fill="none"/>
              <path d="M140 370 Q 165 425 210 425" stroke="#3D2C2E" stroke-width="28" stroke-linecap="round" fill="none" style="z-index:-1"/>
              
              <!-- Tablet Device (Silver / Lilac with Cute Apple/Heart) -->
              <g class="tablet-group" transform="rotate(-14 240 400)">
                <rect x="200" y="340" width="85" height="120" rx="12" fill="#E0E6ED" stroke="#3D2C2E" stroke-width="4"/>
                <rect x="206" y="346" width="73" height="108" rx="8" fill="#FFFFFF"/>
                <!-- Tablet Screen Graphic -->
                <circle cx="242" cy="400" r="14" fill="#FFE5EC"/>
                <path d="M242 393 C239 390 234 391 234 395 C234 399 242 405 242 405 C242 405 250 399 250 395 C250 391 245 390 242 393 Z" fill="#FF4081"/>
                <line x1="216" y1="365" x2="268" y2="365" stroke="#B0BEC5" stroke-width="3" stroke-linecap="round"/>
                <line x1="216" y1="375" x2="250" y2="375" stroke="#CFD8DC" stroke-width="3" stroke-linecap="round"/>
              </g>

              <!-- Hand Fingers gripping tablet -->
              <ellipse cx="230" cy="410" rx="9" ry="7" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3"/>
              <ellipse cx="236" cy="415" rx="8" ry="6" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3"/>
            </g>

            <!-- Right Arm / Hand (Gesturing & Waving towards Explore Button) -->
            <g class="arm-waving" id="mascotWavingArm">
              <path d="M295 370 Q 340 340 380 320" stroke="#FDD9B5" stroke-width="22" stroke-linecap="round" fill="none"/>
              <!-- Cute Open Hand with fingers gesturing -->
              <g transform="translate(375, 305)">
                <circle cx="16" cy="16" r="13" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="3.5"/>
                <!-- Fingers -->
                <ellipse cx="14" cy="4" rx="4.5" ry="7" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
                <ellipse cx="23" cy="6" rx="4.5" ry="7.5" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
                <ellipse cx="30" cy="12" rx="4" ry="7" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
                <ellipse cx="5" cy="14" rx="4.5" ry="6" fill="#FDD9B5" stroke="#3D2C2E" stroke-width="2.5"/>
              </g>
            </g>
          </svg>
        </div>
      </div>
    `,this.speechEl=this.container.querySelector(".speech-text"),this.pupils=[this.container.querySelector(".pupil-left"),this.container.querySelector(".pupil-right")]}initInteractions(){const e=this.container.querySelector(".mascot-svg-wrap");e&&(e.addEventListener("click",()=>{l.sparkle(),this.cheer(),this.nextQuote();const t=e.getBoundingClientRect();this.showerConfetti(t.left+t.width/2,t.top+t.height/3)}),window.addEventListener("mousemove",t=>{if(!this.pupils[0]||!this.pupils[1])return;const s=e.getBoundingClientRect(),a=s.left+s.width*.48,i=s.top+s.height*.45,r=(t.clientX-a)/window.innerWidth,o=(t.clientY-i)/window.innerHeight,n=Math.max(-3.5,Math.min(3.5,r*10)),c=Math.max(-3.5,Math.min(3.5,o*10));this.pupils[0].style.transform=`translate(${n}px, ${c}px)`,this.pupils[1].style.transform=`translate(${n}px, ${c}px)`}),setInterval(()=>{this.nextQuote()},12e3))}nextQuote(){this.quoteIndex=(this.quoteIndex+1)%this.quotes.length,this.say(this.quotes[this.quoteIndex])}say(e){if(!this.speechEl)return;const t=this.container.querySelector("#mascotBubble");t&&(t.classList.add("pop-change"),setTimeout(()=>{this.speechEl.textContent=e,t.classList.remove("pop-change")},150))}cheer(e){l.boing();const t=this.container.querySelector(".mascot-svg-wrap");t&&(t.classList.add("mascot-cheering"),setTimeout(()=>t.classList.remove("mascot-cheering"),800)),e&&this.say(e)}showerConfetti(e,t,s=40){const a=["#FF4081","#FFD54F","#4DD0E1","#7C4DFF","#69F0AE","#FF6E40"],i=document.body;for(let r=0;r<s;r++){const o=document.createElement("div");o.className="digital-confetti-piece";const n=a[Math.floor(Math.random()*a.length)],c=Math.random()*9+6,h=Math.random()>.5;o.style.left=`${e}px`,o.style.top=`${t}px`,o.style.width=`${c}px`,o.style.height=`${h?c:c*1.5}px`,o.style.backgroundColor=n,o.style.borderRadius=h?"50%":"3px";const u=Math.random()*360*(Math.PI/180),v=Math.random()*260+100,y=Math.cos(u)*v,m=Math.sin(u)*v-120,b=Math.random()*720-360;o.style.setProperty("--tx",`${y}px`),o.style.setProperty("--ty",`${m}px`),o.style.setProperty("--rot",`${b}deg`),i.appendChild(o),setTimeout(()=>{o.remove()},1100)}}}const O="teachermom_catalog_v2",N="teachermom_reviews_v2",G="teachermom_admin_settings_v2",P="teachermom_admin_auth_v2",W="teachermom_users_v2",B="teachermom_user_session_v2",H="teachermom_mailing_list_v2",M="teachermomroxy3@gmail.com",U=[{id:"caps-gr1-phonics-t1",title:"Grade 1 Phonics Fun Pack 🎒",subtitle:"Sound Families & Sight Words",subject:"English (HL)",grade:"Grade 1",gradeTag:"1st",curriculum:"CAPS",term:"Term 1",year:"2026",price:95,currency:"R",locked:!0,rating:5,reviews:320,colorTheme:"#FFE5EC",badgeColor:"#FF80AB",tag:"#1 Bestseller ⭐",faceType:"backpack",description:"Comprehensive single sounds, blending flashcards, handwriting paths, and vowel family workbooks.",sampleImages:["https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80"]},{id:"caps-gr1-math-t1",title:"Grade 1 Math Mania Workbook ✏️",subtitle:"Numbers, Operations & Relationships",subject:"Mathematics",grade:"Grade 1",gradeTag:"1st",curriculum:"CAPS",term:"Term 1",year:"2026",price:85,currency:"R",locked:!0,rating:5,reviews:280,colorTheme:"#E0F7FA",badgeColor:"#4DD0E1",tag:"Math Winner 🔥",faceType:"happy-eyes",description:"40 pages of CAPS-aligned number sense, ten-frames, counting in 1s & 2s, and playful math story mats.",sampleImages:["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"]},{id:"caps-gr2-spelling-t1",title:"Grade 2 Spelling Stars & Phonics ⭐",subtitle:"Blends, Digraphs & Word Lists",subject:"English (HL)",grade:"Grade 2",gradeTag:"2nd",curriculum:"CAPS",term:"Term 1",year:"2026",price:90,currency:"R",locked:!0,rating:4.9,reviews:190,colorTheme:"#FFF3E0",badgeColor:"#FFA726",tag:"Classroom Hit 💛",faceType:"sticky-smile",description:"Weekly spelling lists, phoneme frames, dictation sentences, and fun sticky-note word hunt puzzles.",sampleImages:[]},{id:"caps-grr-lifeskills-t1",title:"Grade R Early Learning Bundle 🍼",subtitle:"Fine Motor & Visual Perception",subject:"Life Skills",grade:"Grade R",gradeTag:"pre-k",curriculum:"CAPS",term:"Term 1",year:"2026",price:75,currency:"R",locked:!0,rating:4.9,reviews:110,colorTheme:"#F3E5F5",badgeColor:"#BA68C8",tag:"Foundation Phase ✨",faceType:"wink-eyes",description:"Gross and fine motor cutting exercises, color sorting, pattern matching, and healthy habits posters.",sampleImages:[]},{id:"caps-gr3-math-t1",title:"Grade 3 Mental Math & Word Problems 🔢",subtitle:"Times Tables & Place Value",subject:"Mathematics",grade:"Grade 3",gradeTag:"3rd",curriculum:"CAPS",term:"Term 1",year:"2026",price:95,currency:"R",locked:!0,rating:4.8,reviews:164,colorTheme:"#E8F5E9",badgeColor:"#81C784",tag:"Teacher Pick 🌿",faceType:"lion-face",description:"Daily 5-minute mental math drills, skip counting tables up to 100, and two-step word problem mats.",sampleImages:[]},{id:"cambridge-early-reading",title:"Early Reader Comprehension Quest 🦁",subtitle:"Guided Reading & Vocabulary",subject:"Reading & Literacy",grade:"Grade 1",gradeTag:"1st",curriculum:"Cambridge / IEB",term:"Term 1",year:"2026",price:80,currency:"R",locked:!0,rating:4.8,reviews:88,colorTheme:"#FFF9C4",badgeColor:"#FDD835",tag:"Top Rated 📚",faceType:"hero-wink",description:"Illustrated short stories with multiple choice questions, draw-your-answer prompts, and vocabulary flashcards.",sampleImages:[]}],D=[{id:"rev-prinsloo",resourceId:"caps-gr1-phonics-t1",resourceTitle:"Grade 1 Phonics Fun Pack 🎒",author:"Mrs. Rachel Prinsloo",role:"Grade 1 Teacher, Bloemfontein",avatar:"👩‍🏫",rating:5,text:"TeacherMom's Educational resources are amazing!! Not only do they follow the ATP's to a T, the pictures are vibrant and my learners absolutely love the activities! The teachers guides also make my life so much easier",date:"2026-03-15",featured:!0},{id:"rev-lerato",resourceId:"caps-gr1-math-t1",resourceTitle:"Grade 1 Math Mania Workbook ✏️",author:"Mrs. Lerato Molefe",role:"Foundation Phase Teacher, Johannesburg",avatar:"🌸",rating:5,text:"The CAPS alignment is spot on! The learners enjoy the playful characters and my planning time on Sunday evenings has been cut in half. Highly recommended!",date:"2026-03-22",featured:!1},{id:"rev-chantelle",resourceId:"caps-grr-lifeskills-t1",resourceTitle:"Grade R Early Learning Bundle 🍼",author:"Chantelle van der Merwe",role:"Homeschooling Mom, Pretoria",avatar:"💖",rating:5,text:"Tactile, engaging, and no tears at the work table. The sample preview gave me total confidence before purchasing via WhatsApp. Quick delivery and lovely support!",date:"2026-04-02",featured:!1},{id:"rev-anneri",resourceId:"caps-gr2-spelling-t1",resourceTitle:"Grade 2 Spelling Stars & Phonics ⭐",author:"Anneri Botha",role:"Grade 2 Educator, Durbanville",avatar:"⭐",rating:5,text:"My second graders are obsessed with the sticky note phoneme maps. Thank you Roxy for such creative, high quality workbooks!",date:"2026-04-05",featured:!1}],V=[{id:"user-prinsloo",name:"Mrs. Rachel Prinsloo",email:"rachel.prinsloo@bloemschool.co.za",role:"Grade 1 Teacher, Bloemfontein",avatar:"👩‍🏫",provider:"google",mailingList:!0,createdAt:"2026-03-01"},{id:"user-lerato",name:"Mrs. Lerato Molefe",email:"lerato.molefe@jhbschool.co.za",role:"Foundation Phase Teacher, Johannesburg",avatar:"🌸",provider:"custom",mailingList:!0,createdAt:"2026-03-10"}],Y=[{email:"rachel.prinsloo@bloemschool.co.za",name:"Mrs. Rachel Prinsloo",role:"Grade 1 Teacher, Bloemfontein",optedIn:!0,date:"2026-03-01"},{email:"lerato.molefe@jhbschool.co.za",name:"Mrs. Lerato Molefe",role:"Foundation Phase Teacher, Johannesburg",optedIn:!0,date:"2026-03-10"},{email:"chantelle.vdm@gmail.com",name:"Chantelle van der Merwe",role:"Homeschooling Mom, Pretoria",optedIn:!0,date:"2026-04-02"}];class J{constructor(){this.listeners=[]}getResources(){try{const e=localStorage.getItem(O);if(e)return JSON.parse(e)}catch(e){console.warn("Could not read from localStorage",e)}return this.saveResources(U),U}saveResources(e){try{localStorage.setItem(O,JSON.stringify(e)),this.notifyListeners()}catch(t){console.error("Failed to save resources",t)}}addResource(e){const t=this.getResources(),s={...e,id:e.id||`res-${Date.now()}`,locked:!0,currency:e.currency||"R",rating:parseFloat(e.rating)||5,reviews:parseInt(e.reviews,10)||1,colorTheme:e.colorTheme||"#FFE5EC",badgeColor:e.badgeColor||"#FF80AB",tag:e.tag||"New Resource ✨",faceType:e.faceType||"happy-eyes",sampleImages:e.sampleImages||[]};return t.unshift(s),this.saveResources(t),s}deleteResource(e){const t=this.getResources().filter(s=>s.id!==e);this.saveResources(t)}rateResource(e,t,s=null){const a=this.getResources(),i=a.find(u=>u.id===e);if(!i)return null;const r=parseFloat(i.rating)||5,o=parseInt(i.reviews,10)||1,n=r*o+t,c=o+1,h=Math.round(n/c*10)/10;if(i.rating=h,i.reviews=c,this.saveResources(a),s){const u=this.getCurrentUser();this.addReview({resourceId:e,resourceTitle:i.title,rating:t,author:s.author||(u==null?void 0:u.name)||"Verified Educator",role:s.role||(u==null?void 0:u.role)||"Teacher / Parent",userId:(u==null?void 0:u.id)||"",userEmail:(u==null?void 0:u.email)||"",provider:(u==null?void 0:u.provider)||"custom",verified:!0,...s})}return i}getBestsellers(e=3){return[...this.getResources()].sort((s,a)=>{const i=(parseFloat(a.rating)||0)*Math.log10((parseInt(a.reviews,10)||1)+9),r=(parseFloat(s.rating)||0)*Math.log10((parseInt(s.reviews,10)||1)+9);return i-r}).slice(0,e)}getReviews(){try{const e=localStorage.getItem(N);if(e)return JSON.parse(e)}catch{}return this.saveReviews(D),D}saveReviews(e){try{localStorage.setItem(N,JSON.stringify(e)),this.notifyListeners()}catch(t){console.error("Failed to save reviews",t)}}addReview(e){const t=this.getReviews(),s={id:e.id||`rev-${Date.now()}`,resourceId:e.resourceId||"",resourceTitle:e.resourceTitle||"Educational Resource",author:e.author||"Super Educator",role:e.role||"Teacher",avatar:e.avatar||"👩‍🏫",rating:parseInt(e.rating,10)||5,text:e.text||"",date:e.date||new Date().toISOString().split("T")[0],userId:e.userId||"",userEmail:e.userEmail||"",provider:e.provider||"custom",verified:e.verified!==!1,featured:!1};return t.unshift(s),this.saveReviews(t),s}setFeaturedReview(e){const t=this.getReviews();t.forEach(s=>{s.featured=s.id===e}),this.saveReviews(t)}getFeaturedReview(){const e=this.getReviews();return e.find(s=>s.featured===!0)||e[0]||D[0]}deleteReview(e){const t=this.getReviews().filter(s=>s.id!==e);t.length>0&&!t.some(s=>s.featured)&&(t[0].featured=!0),this.saveReviews(t)}getStats(){const e=this.getResources(),t=this.getReviews(),s=e.reduce((c,h)=>c+(parseFloat(h.rating)||5),0),a=e.length>0?(s/e.length).toFixed(1):"5.0",i=e.length,r=i>=6?`${200+(i-6)}+`:`${i}+`;return{happyTeachers:`${((16e3+t.length*45)/1e3).toFixed(0)}k+`,resourcesCount:r,rawResourcesCount:i,averageRating:`${a}★`,rawAverageRating:parseFloat(a)}}subscribe(e){return this.listeners.push(e),()=>{this.listeners=this.listeners.filter(t=>t!==e)}}notifyListeners(){this.listeners.forEach(e=>e())}getSettings(){const e={whatsappNumber:"0608316086",emailAddress:M,currencySymbol:"R",bankingDetails:`TeacherMom Resources
Bank: First National Bank (FNB)
Account: 62000000000
Branch: 250655`};try{const t=localStorage.getItem(G);if(t){const s=JSON.parse(t);return(!s.whatsappNumber||s.whatsappNumber==="+27821234567")&&(s.whatsappNumber="0608316086",this.saveSettings(s)),{...e,...s}}}catch{}return e}saveSettings(e){try{localStorage.setItem(G,JSON.stringify(e))}catch{}}isAdminLoggedIn(){try{const e=localStorage.getItem(P);if(!e)return!1;const t=JSON.parse(e);return t.email===M&&t.loggedIn===!0}catch{return!1}}loginAdmin(e,t){return e.trim().toLowerCase()===M.toLowerCase()?(localStorage.setItem(P,JSON.stringify({email:M,loggedIn:!0,loginTime:Date.now()})),{success:!0}):{success:!1,error:`Access Denied: Only ${M} is authorized to access this administration panel.`}}logoutAdmin(){localStorage.removeItem(P)}generateInvoiceNumber(){const e=new Date().getFullYear(),t=Math.floor(1e3+Math.random()*9e3);return`TM-${e}-${t}`}getUsers(){try{const e=localStorage.getItem(W);if(e)return JSON.parse(e)}catch{}return this.saveUsers(V),V}saveUsers(e){try{localStorage.setItem(W,JSON.stringify(e)),this.notifyListeners()}catch{}}getCurrentUser(){try{const e=localStorage.getItem(B);if(e)return JSON.parse(e)}catch{}return null}loginWithGoogle(e=null){var i;const t=this.getUsers(),s=((i=e==null?void 0:e.email)==null?void 0:i.toLowerCase().trim())||"teacher.mom.guest@gmail.com";let a=t.find(r=>r.email.toLowerCase()===s);return a?(a.provider="google",e!=null&&e.name&&(a.name=e.name),e!=null&&e.role&&(a.role=e.role),(e==null?void 0:e.mailingList)!==void 0&&(a.mailingList=e.mailingList),this.saveUsers(t)):(a={id:`usr-${Date.now()}`,name:(e==null?void 0:e.name)||"Verified Google Educator",email:s,role:(e==null?void 0:e.role)||"Foundation Phase Teacher",avatar:(e==null?void 0:e.avatar)||"👩‍🏫",provider:"google",mailingList:(e==null?void 0:e.mailingList)!==!1,createdAt:new Date().toISOString()},t.push(a),this.saveUsers(t)),localStorage.setItem(B,JSON.stringify(a)),a.mailingList&&this.setMailingListStatus(a.email,!0,{name:a.name,role:a.role}),this.notifyListeners(),{success:!0,user:a}}registerCustomUser({name:e,email:t,password:s,role:a,city:i,mailingList:r=!0}){const o=this.getUsers(),n=t.toLowerCase().trim();if(o.some(h=>h.email.toLowerCase()===n))return{success:!1,error:"An account with this email already exists. Please sign in instead!"};const c={id:`usr-${Date.now()}`,name:e.trim(),email:n,password:s,role:a?`${a}${i?", "+i:""}`:i||"Educator / Parent",avatar:"👩‍🏫",provider:"custom",mailingList:!!r,createdAt:new Date().toISOString()};return o.push(c),this.saveUsers(o),localStorage.setItem(B,JSON.stringify(c)),c.mailingList?this.setMailingListStatus(c.email,!0,{name:c.name,role:c.role}):this.setMailingListStatus(c.email,!1,{name:c.name,role:c.role}),this.notifyListeners(),{success:!0,user:c}}loginCustomUser(e,t){const s=this.getUsers(),a=e.toLowerCase().trim(),i=s.find(r=>r.email.toLowerCase()===a);return i?i.password&&i.password!==t?{success:!1,error:"Incorrect password. Please try again."}:(localStorage.setItem(B,JSON.stringify(i)),this.notifyListeners(),{success:!0,user:i}):{success:!1,error:"No account found with this email. Please register first!"}}logoutUser(){localStorage.removeItem(B),this.notifyListeners()}getMailingList(){try{const e=localStorage.getItem(H);if(e)return JSON.parse(e)}catch{}return this.saveMailingList(Y),Y}saveMailingList(e){try{localStorage.setItem(H,JSON.stringify(e)),this.notifyListeners()}catch{}}setMailingListStatus(e,t,s={}){const a=this.getMailingList(),i=e.toLowerCase().trim(),r=a.find(n=>n.email.toLowerCase()===i);r?(r.optedIn=!!t,r.date=new Date().toISOString().split("T")[0],s.name&&(r.name=s.name),s.role&&(r.role=s.role)):a.push({email:i,name:s.name||"TeacherMom VIP",role:s.role||"Educator / Parent",optedIn:!!t,date:new Date().toISOString().split("T")[0]}),this.saveMailingList(a);const o=this.getCurrentUser();return o&&o.email.toLowerCase()===i&&(o.mailingList=!!t,localStorage.setItem(B,JSON.stringify(o))),this.notifyListeners(),{email:i,optedIn:!!t}}isSubscribed(e){if(!e)return!1;const t=e.toLowerCase().trim(),a=this.getMailingList().find(i=>i.email.toLowerCase()===t);return a?a.optedIn===!0:!1}}const p=new J;class K{constructor(e,t={}){this.container=document.getElementById(e),this.options=t,this.resources=p.getResources(),this.filteredResources=[...this.resources],this.currentIndex=0,this.itemsPerPage=4,this.onAddToCart=t.onAddToCart||(()=>{}),this.onOpenFlipbook=t.onOpenFlipbook||(()=>{}),this.onBuyResource=t.onBuyResource||(()=>{}),this.onRateResource=t.onRateResource||(()=>{}),this.unsubscribe=p.subscribe(()=>{this.resources=p.getResources(),this.filterByGrade(this.currentGradeFilter||"all")}),this.checkItemsPerPage(),window.addEventListener("resize",()=>{this.checkItemsPerPage(),this.render()}),this.render()}checkItemsPerPage(){window.innerWidth<640?this.itemsPerPage=1:window.innerWidth<960?this.itemsPerPage=2:window.innerWidth<1280?this.itemsPerPage=3:this.itemsPerPage=4}filterByGrade(e){this.currentGradeFilter=e,!e||e==="all"?this.filteredResources=[...this.resources]:this.filteredResources=this.resources.filter(t=>t.gradeTag===e||t.gradeTag==="all"),this.currentIndex=0,this.render()}filterByQuery(e){const t=e.trim().toLowerCase();t?this.filteredResources=this.resources.filter(s=>s.title.toLowerCase().includes(t)||s.subtitle&&s.subtitle.toLowerCase().includes(t)||s.grade&&s.grade.toLowerCase().includes(t)||s.subject&&s.subject.toLowerCase().includes(t)||s.curriculum&&s.curriculum.toLowerCase().includes(t)||s.term&&s.term.toLowerCase().includes(t)||s.year&&s.year.toLowerCase().includes(t)||s.description&&s.description.toLowerCase().includes(t)):this.filteredResources=[...this.resources],this.currentIndex=0,this.render()}next(){l.pop(600);const e=Math.max(0,this.filteredResources.length-this.itemsPerPage);this.currentIndex<e?this.currentIndex++:this.currentIndex=0,this.updatePosition()}prev(){if(l.pop(500),this.currentIndex>0)this.currentIndex--;else{const e=Math.max(0,this.filteredResources.length-this.itemsPerPage);this.currentIndex=e}this.updatePosition()}updatePosition(){const e=this.container.querySelector(".carousel-track"),t=this.container.querySelectorAll(".dot-indicator");if(!e)return;const s=e.firstElementChild?e.firstElementChild.getBoundingClientRect().width+20:280;e.style.transform=`translateX(-${this.currentIndex*s}px)`,t.forEach((a,i)=>{a.classList.toggle("active",i===this.currentIndex)})}render(){if(!this.container)return;if(this.filteredResources.length===0){this.container.innerHTML=`
        <div class="empty-resources-state">
          <div class="empty-doodle">🎨 ✏️</div>
          <h3>No resources found matching filter</h3>
          <p>Try searching for "CAPS", "Mathematics", "Grade 1", or choose "All Grades"!</p>
          <button class="bubble-pill-btn btn-mint reset-filter-btn">Show All Resources</button>
        </div>
      `;const a=this.container.querySelector(".reset-filter-btn");a&&a.addEventListener("click",()=>{this.filterByGrade("all"),document.querySelectorAll(".grade-sticker-pill").forEach(r=>r.classList.remove("active"));const i=document.querySelector('.grade-sticker-pill[data-grade="all"]');i&&i.classList.add("active")});return}const e=this.filteredResources.map(a=>this.createCardHtml(a)).join(""),t=Math.max(1,this.filteredResources.length-this.itemsPerPage+1),s=Array.from({length:t}).map((a,i)=>`
      <button class="dot-indicator ${i===this.currentIndex?"active":""}" data-index="${i}" aria-label="Go to slide ${i+1}"></button>
    `).join("");this.container.innerHTML=`
      <div class="carousel-wrapper">
        <button class="carousel-nav-btn prev-btn" aria-label="Previous resources">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <div class="carousel-viewport">
          <div class="carousel-track">
            ${e}
          </div>
        </div>

        <button class="carousel-nav-btn next-btn" aria-label="Next resources">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      <div class="carousel-dots-container">
        ${s}
      </div>
    `,this.attachCardEvents()}createCardHtml(e){const s=`${e.currency||"R"}${parseFloat(e.price).toFixed(2)}`,a=e.sampleImages&&e.sampleImages.length>0;return`
      <div class="resource-card" data-id="${e.id}" style="--theme-color: ${e.colorTheme||"#FFE5EC"}; --badge-color: ${e.badgeColor||"#FF80AB"}">
        
        <!-- Top Tags: Curriculum, Grade, & Locked Badge -->
        <div class="card-top-bar">
          <div class="card-badges-group">
            <span class="card-curriculum-badge">${e.curriculum||"CAPS"}</span>
            <span class="card-grade-badge">${e.grade}</span>
          </div>
          <span class="card-locked-badge" title="Digital files unlocked upon verified payment">🔒 Locked</span>
        </div>

        <!-- Kawaii Animated Mascot or Sample Preview Centerpiece -->
        <div class="card-mascot-box">
          ${a?`
            <div class="card-uploaded-preview">
              <img src="${e.sampleImages[0]}" alt="${e.title} sample" class="card-sample-img" />
              <div class="sample-watermark-overlay">SAMPLE PREVIEW</div>
            </div>
          `:this.getFaceSvg(e)}
        </div>

        <!-- Resource Information -->
        <div class="card-content">
          <h4 class="card-title">${e.title}</h4>
          
          <!-- Metadata Pill Row: Subject, Term & Year -->
          <div class="card-meta-tags-row">
            <span class="meta-pill subject-pill">📚 ${e.subject||"All Subjects"}</span>
            <span class="meta-pill term-pill">📅 ${e.term||"Term 1"} (${e.year||"2026"})</span>
          </div>

          <p class="card-subtitle">${e.subtitle||e.description||""}</p>

          <div class="card-rating">
            <span class="star-icons">★★★★★</span>
            <span class="rating-val">${e.rating||5} (${e.reviews||42})</span>
            <button class="rate-trigger-pill" data-id="${e.id}" title="Rate & review this resource">⭐ Rate</button>
          </div>

          <div class="card-price-row">
            <div class="price-wrap">
              <span class="card-price">${s}</span>
              <span class="price-sub">EFT / WhatsApp</span>
            </div>
            <span class="sample-only-pill">Samples Only 👁️</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="card-actions">
          <button class="preview-flip-btn" data-id="${e.id}" title="View sample pages in the interactive flipbook">
            <span class="flip-icon">📖</span> Samples
          </button>
          <button class="buy-now-btn" data-id="${e.id}" title="Get unique reference number and order via WhatsApp/Email">
            <span class="cart-icon">🛒</span> Buy Now
          </button>
        </div>
      </div>
    `}getFaceSvg(e){return e.faceType==="backpack"?`
        <svg class="kawaii-face-svg" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="10" width="45" height="55" rx="8" fill="#FFCCD5" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(-12 20 10)"/>
          <text x="35" y="42" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#3D2C2E" transform="rotate(-12 20 10)">aa</text>
          
          <rect x="58" y="8" width="45" height="55" rx="8" fill="#FFF275" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(2 58 8)"/>
          <text x="74" y="38" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#3D2C2E">ab</text>

          <rect x="98" y="14" width="45" height="55" rx="8" fill="#A8DADC" stroke="#3D2C2E" stroke-width="2.5" transform="rotate(14 98 14)"/>
          <text x="110" y="44" font-family="'Fredoka', sans-serif" font-weight="bold" font-size="14" fill="#3D2C2E" transform="rotate(14 98 14)">ac</text>

          <rect x="42" y="38" width="76" height="74" rx="18" fill="#FF8DA1" stroke="#3D2C2E" stroke-width="3"/>
          <path d="M60 38 Q 80 20 100 38" stroke="#3D2C2E" stroke-width="3" fill="none"/>
          <rect x="52" y="74" width="56" height="30" rx="8" fill="#FFA6B7" stroke="#3D2C2E" stroke-width="2.5"/>
          <circle class="card-eye eye-l" cx="66" cy="56" r="4.5" fill="#3D2C2E"/>
          <circle class="card-eye eye-r" cx="94" cy="56" r="4.5" fill="#3D2C2E"/>
          <circle cx="67.5" cy="54.5" r="1.5" fill="#FFFFFF"/>
          <circle cx="95.5" cy="54.5" r="1.5" fill="#FFFFFF"/>
          <ellipse cx="58" cy="62" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
          <ellipse cx="102" cy="62" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
          <path class="card-mouth" d="M75 62 Q 80 68 85 62" stroke="#3D2C2E" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        </svg>
      `:e.faceType==="sticky-smile"?`
        <svg class="kawaii-face-svg" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 18 H118 L138 38 V102 H22 Z" fill="#FFE082" stroke="#3D2C2E" stroke-width="3.5"/>
          <path d="M118 18 V38 H138 Z" fill="#FFD54F" stroke="#3D2C2E" stroke-width="3"/>
          <ellipse class="card-eye eye-l" cx="60" cy="56" rx="8" ry="10" fill="#3D2C2E"/>
          <ellipse class="card-eye eye-r" cx="100" cy="56" rx="8" ry="10" fill="#3D2C2E"/>
          <circle cx="58" cy="52" r="3" fill="#FFFFFF"/>
          <circle cx="98" cy="52" r="3" fill="#FFFFFF"/>
          <ellipse cx="46" cy="66" rx="6" ry="3.5" fill="#FF7043" opacity="0.6"/>
          <ellipse cx="114" cy="66" rx="6" ry="3.5" fill="#FF7043" opacity="0.6"/>
          <path class="card-mouth" d="M72 64 Q 80 76 88 64" stroke="#3D2C2E" stroke-width="2.8" stroke-linecap="round" fill="none"/>
          <path d="M77 69 Q 80 75 83 69 Z" fill="#FF5252"/>
        </svg>
      `:`
      <svg class="kawaii-face-svg" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="12" width="124" height="96" rx="20" fill="#B2EBF2" stroke="#3D2C2E" stroke-width="3.5"/>
        <g transform="translate(112, 18) rotate(35)">
          <rect x="0" y="0" width="8" height="24" rx="2" fill="#FFE082" stroke="#3D2C2E" stroke-width="2"/>
          <polygon points="0,0 8,0 4,-8" fill="#FFAB91" stroke="#3D2C2E" stroke-width="1.5"/>
        </g>
        <ellipse class="card-eye eye-l" cx="58" cy="52" rx="10" ry="14" fill="#3D2C2E"/>
        <ellipse class="card-eye eye-r" cx="102" cy="52" rx="10" ry="14" fill="#3D2C2E"/>
        <circle cx="56" cy="46" r="4" fill="#FFFFFF"/>
        <circle cx="61" cy="56" r="2" fill="#FFFFFF"/>
        <circle cx="100" cy="46" r="4" fill="#FFFFFF"/>
        <circle cx="105" cy="56" r="2" fill="#FFFFFF"/>
        <ellipse cx="44" cy="64" rx="7" ry="4" fill="#FF80AB" opacity="0.7"/>
        <ellipse cx="116" cy="64" rx="7" ry="4" fill="#FF80AB" opacity="0.7"/>
        <path class="card-mouth" d="M72 64 Q 80 78 88 64 Z" fill="#E91E63" stroke="#3D2C2E" stroke-width="2.5"/>
      </svg>
    `}attachCardEvents(){const e=this.container.querySelector(".prev-btn"),t=this.container.querySelector(".next-btn");e&&e.addEventListener("click",()=>this.prev()),t&&t.addEventListener("click",()=>this.next()),this.container.querySelectorAll(".dot-indicator").forEach(n=>{n.addEventListener("click",c=>{l.pop(550),this.currentIndex=parseInt(c.target.dataset.index,10),this.updatePosition()})}),this.container.querySelectorAll(".buy-now-btn").forEach(n=>{n.addEventListener("click",c=>{const h=c.currentTarget.dataset.id,u=this.resources.find(v=>v.id===h);u&&this.onBuyResource(u)})}),this.container.querySelectorAll(".preview-flip-btn").forEach(n=>{n.addEventListener("click",c=>{const h=c.currentTarget.dataset.id,u=this.resources.find(v=>v.id===h);u&&(l.pageTurn(),this.onOpenFlipbook(u))})}),this.container.querySelectorAll(".rate-trigger-pill").forEach(n=>{n.addEventListener("click",c=>{c.stopPropagation();const h=c.currentTarget.dataset.id,u=this.resources.find(v=>v.id===h);u&&(l.pop(650),this.onRateResource(u))})}),this.container.querySelectorAll(".resource-card").forEach(n=>{n.addEventListener("mouseenter",()=>{n.classList.add("card-winking")}),n.addEventListener("mouseleave",()=>{n.classList.remove("card-winking")})})}}class X{constructor(e={}){this.onSearch=e.onSearch||(()=>{}),this.onGradeSelect=e.onGradeSelect||(()=>{}),this.searchInput=document.getElementById("searchGradeInput"),this.searchBuddy=document.getElementById("searchBuddySvg"),this.searchWrap=document.querySelector(".search-bar-wrap"),this.gradePills=document.querySelectorAll(".grade-sticker-pill"),this.init()}init(){this.searchInput&&(this.searchInput.addEventListener("focus",()=>{l.pop(650),this.searchWrap&&this.searchWrap.classList.add("search-active-squash"),this.animateBuddy("excited")}),this.searchInput.addEventListener("blur",()=>{this.searchWrap&&this.searchWrap.classList.remove("search-active-squash"),this.animateBuddy("idle")}),this.searchInput.addEventListener("input",e=>{const t=e.target.value;this.animateBuddy(t.length>0?"searching":"idle"),this.onSearch(t)})),this.gradePills.forEach(e=>{e.addEventListener("click",t=>{const s=e.dataset.grade;l.pop(580),this.gradePills.forEach(a=>a.classList.remove("active")),e.classList.add("active"),e.classList.add("pill-popped"),setTimeout(()=>e.classList.remove("pill-popped"),300),this.onGradeSelect(s)})}),setInterval(()=>{document.activeElement!==this.searchInput&&this.blinkBuddy()},4500)}animateBuddy(e){if(!this.searchBuddy)return;const t=this.searchBuddy.querySelector(".buddy-pupil-l"),s=this.searchBuddy.querySelector(".buddy-pupil-r"),a=this.searchBuddy.querySelector(".buddy-mouth");e==="searching"?(t&&s&&(t.setAttribute("cx","24"),s.setAttribute("cx","36")),a&&a.setAttribute("d","M 26 28 Q 30 32 34 28")):e==="excited"?(t&&s&&(t.setAttribute("cy","18"),s.setAttribute("cy","18")),a&&a.setAttribute("d","M 27 27 Q 30 34 33 27")):(t&&s&&(t.setAttribute("cx","22"),s.setAttribute("cx","34"),t.setAttribute("cy","20"),s.setAttribute("cy","20")),a&&a.setAttribute("d","M 27 28 Q 30 31 33 28"))}blinkBuddy(){this.searchBuddy&&(this.searchBuddy.classList.add("buddy-blinking"),setTimeout(()=>{this.searchBuddy.classList.remove("buddy-blinking")},180))}}class Z{constructor(e={}){this.onBuyResource=e.onBuyResource||(()=>{}),this.onRateResource=e.onRateResource||(()=>{}),this.currentResource=null,this.currentPageIndex=0,this.modalEl=null,this.init()}init(){this.modalEl=document.createElement("div"),this.modalEl.className="flipbook-modal-backdrop",this.modalEl.id="flipbookModal",this.modalEl.innerHTML=`
      <div class="flipbook-window">
        <!-- Window Top Bar -->
        <div class="flipbook-window-header">
          <div class="flipbook-title-tag">
            <span class="preview-badge">🔒 Sample Preview Only</span>
            <span class="book-resource-name" id="flipbookResourceName">Phonics Fun Pack</span>
          </div>
          <button class="flipbook-close-btn" id="closeFlipbookBtn" aria-label="Close preview">✕</button>
        </div>

        <!-- Metadata Sub-bar -->
        <div class="flipbook-meta-subbar">
          <span class="f-meta-pill" id="fbCurriculum">CAPS</span>
          <span class="f-meta-pill" id="fbGrade">Grade 1</span>
          <span class="f-meta-pill" id="fbSubject">Mathematics</span>
          <span class="f-meta-pill" id="fbTermYear">Term 1 • 2026</span>
          <span class="f-locked-pill">🔒 Full PDF Locked</span>
        </div>

        <!-- Physical Cartoon Binder / Flipbook Stage -->
        <div class="flipbook-stage">
          <!-- Left Flip Arrow -->
          <button class="flip-edge-trigger edge-left" id="flipEdgeLeft" aria-label="Flip page back">
            <span class="edge-arrow">◀</span>
            <span class="edge-label">Prev Page</span>
          </button>

          <!-- 3D Book Container -->
          <div class="flipbook-book" id="flipbookBook">
            <!-- Center Spiral Binder Rings -->
            <div class="book-spine-rings">
              <span class="ring"></span><span class="ring"></span><span class="ring"></span>
              <span class="ring"></span><span class="ring"></span><span class="ring"></span>
              <span class="ring"></span><span class="ring"></span>
            </div>

            <!-- Left Page Container -->
            <div class="book-page book-page-left" id="pageLeft">
              <!-- Rendered via JS -->
            </div>

            <!-- Right Page Container -->
            <div class="book-page book-page-right" id="pageRight">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- Right Flip Arrow -->
          <button class="flip-edge-trigger edge-right" id="flipEdgeRight" aria-label="Flip page forward">
            <span class="edge-label">Next Page</span>
            <span class="edge-arrow">▶</span>
          </button>
        </div>

        <!-- Flipbook Footer Controls -->
        <div class="flipbook-footer">
          <div class="page-counter-badge" id="flipbookPageCounter">
            Sample Pages 1 - 2 of 4
          </div>
          <div class="flipbook-actions">
            <button class="sample-download-btn" id="rateFromPreviewBtn">
              ⭐ Rate Resource
            </button>
            <button class="sample-download-btn" id="downloadSampleBtn">
              📥 Sample Sheet
            </button>
            <button class="bubble-pill-btn btn-mint order-from-preview-btn" id="orderFromPreviewBtn">
              🛒 Buy Resource (<span id="previewCurrencyVal">R</span><span id="previewPriceVal">85.00</span>)
            </button>
          </div>
        </div>
      </div>
    `,document.body.appendChild(this.modalEl),this.modalEl.querySelector("#closeFlipbookBtn").addEventListener("click",()=>this.close()),this.modalEl.addEventListener("click",e=>{e.target===this.modalEl&&this.close()}),this.modalEl.querySelector("#flipEdgeLeft").addEventListener("click",()=>this.prevPage()),this.modalEl.querySelector("#flipEdgeRight").addEventListener("click",()=>this.nextPage()),this.modalEl.querySelector("#rateFromPreviewBtn").addEventListener("click",()=>{this.currentResource&&(l.pop(650),this.onRateResource(this.currentResource))}),this.modalEl.querySelector("#downloadSampleBtn").addEventListener("click",()=>{l.win(),alert("📄 Downloaded watermarked sample page! For full unwatermarked PDF, click Buy Resource to order via WhatsApp/Email.")}),this.modalEl.querySelector("#orderFromPreviewBtn").addEventListener("click",()=>{this.currentResource&&(this.close(),this.onBuyResource(this.currentResource))}),window.addEventListener("keydown",e=>{this.modalEl.classList.contains("active")&&(e.key==="ArrowLeft"&&this.prevPage(),e.key==="ArrowRight"&&this.nextPage(),e.key==="Escape"&&this.close())})}open(e){this.currentResource=e,this.currentPageIndex=0;const t=this.modalEl.querySelector("#flipbookResourceName"),s=this.modalEl.querySelector("#previewPriceVal"),a=this.modalEl.querySelector("#previewCurrencyVal");t&&(t.textContent=e.title),s&&(s.textContent=parseFloat(e.price).toFixed(2)),a&&(a.textContent=e.currency||"R"),this.modalEl.querySelector("#fbCurriculum").textContent=e.curriculum||"CAPS",this.modalEl.querySelector("#fbGrade").textContent=e.grade||"Grade 1",this.modalEl.querySelector("#fbSubject").textContent=e.subject||"All Subjects",this.modalEl.querySelector("#fbTermYear").textContent=`${e.term||"Term 1"} • ${e.year||"2026"}`,this.renderPages(),this.modalEl.classList.add("active"),l.pageTurn()}close(){this.modalEl.classList.remove("active")}nextPage(){this.currentPageIndex<2?(l.pageTurn(),this.animateFlip("forward"),this.currentPageIndex+=2,this.renderPages()):l.pop(400)}prevPage(){this.currentPageIndex>0?(l.pageTurn(),this.animateFlip("backward"),this.currentPageIndex-=2,this.renderPages()):l.pop(400)}animateFlip(e){const t=this.modalEl.querySelector("#flipbookBook");t&&(t.classList.add(e==="forward"?"flipping-next":"flipping-prev"),setTimeout(()=>{t.classList.remove("flipping-next","flipping-prev")},450))}renderPages(){const e=this.modalEl.querySelector("#pageLeft"),t=this.modalEl.querySelector("#pageRight"),s=this.modalEl.querySelector("#flipbookPageCounter");if(this.currentResource.sampleImages&&this.currentResource.sampleImages.length>0){const a=this.currentResource.sampleImages[0],i=this.currentResource.sampleImages[1]||a;e.innerHTML=`
        <div class="worksheet-sheet sample-image-sheet">
          <div class="watermark-tag">SAMPLE PREVIEW • LOCKED</div>
          <img src="${a}" alt="Sample page 1" class="fb-sample-img" />
          <div class="page-footer-num">Sample Page 1</div>
        </div>
      `,t.innerHTML=`
        <div class="worksheet-sheet sample-image-sheet">
          <div class="watermark-tag">SAMPLE PREVIEW • LOCKED</div>
          <img src="${i}" alt="Sample page 2" class="fb-sample-img" />
          <div class="page-footer-num">Sample Page 2</div>
        </div>
      `,s.textContent="Sample Images 1 - 2";return}this.currentPageIndex===0?(e.innerHTML=this.getPageContentCover(this.currentResource),t.innerHTML=this.getPageContentWorksheet1(this.currentResource),s.textContent="Sample Pages 1 - 2 of 4"):(e.innerHTML=this.getPageContentWorksheet2(this.currentResource),t.innerHTML=this.getPageContentTeacherGuide(this.currentResource),s.textContent="Sample Pages 3 - 4 of 4"),this.attachInteractiveWorksheetLogic()}getPageContentCover(e){return`
      <div class="worksheet-sheet cover-sheet" style="--cover-tint: ${e.colorTheme||"#FFE5EC"}">
        <div class="cover-doodle-border">
          <div class="sheet-grade-tag">${e.curriculum||"CAPS"} • ${e.grade} • ${e.term||"Term 1"} (${e.year||"2026"})</div>
          <h2 class="cover-big-title">${e.title}</h2>
          <p class="cover-sub">${e.subject||"All Subjects"} • ${e.subtitle||""}</p>
          <div class="cover-hero-illustration">
            <span class="cover-emoji-large">🎒✏️🌟</span>
          </div>
          <div class="locked-watermark-stamp">
            🔒 DIGITAL RESOURCE LOCKED<br/>
            <small>Sample preview only • Order via WhatsApp/Email</small>
          </div>
          <div class="student-name-box">
            <span class="lbl">Super Student:</span>
            <span class="line-fill">__________________________</span>
          </div>
        </div>
      </div>
    `}getPageContentWorksheet1(e){return`
      <div class="worksheet-sheet practice-sheet">
        <div class="watermark-diag">SAMPLE ONLY • TEACHERMOM</div>
        <div class="sheet-header-row">
          <span class="sheet-exercise-title">${e.subject}: Activity 1 🔍</span>
          <span class="sheet-score">${e.term} (${e.year})</span>
        </div>
        <p class="sheet-instructions">Sample Preview: Interactive exercises included in the complete printable PDF pack:</p>

        <div class="interactive-word-bubbles">
          <button class="word-bubble-interactive correct">Item A ⭐</button>
          <button class="word-bubble-interactive">Item B 🎈</button>
          <button class="word-bubble-interactive correct">Item C ✏️</button>
          <button class="word-bubble-interactive correct">Item D 🎒</button>
          <button class="word-bubble-interactive">Item E 📚</button>
          <button class="word-bubble-interactive correct">Item F 🎨</button>
        </div>

        <div class="coloring-prompt-box">
          <span class="prompt-icon">🔒</span>
          <span>Full high-res PDF sent immediately upon proof of payment!</span>
        </div>
        <div class="page-footer-num">Sample Page 2</div>
      </div>
    `}getPageContentWorksheet2(e){return`
      <div class="worksheet-sheet practice-sheet">
        <div class="watermark-diag">SAMPLE ONLY • TEACHERMOM</div>
        <div class="sheet-header-row">
          <span class="sheet-exercise-title">${e.subject}: Hands-On Practice ✏️</span>
          <span class="sheet-date">${e.curriculum} Standards</span>
        </div>
        <p class="sheet-instructions">Sample trace, calculate and matching exercises:</p>

        <div class="connect-pairs-grid">
          <div class="pair-row">
            <span class="number-tag">A</span>
            <span class="dotted-trace-line">- - - - - - - - - - - - -</span>
            <span class="object-tag">🍎🍎🍎🍎🍎</span>
          </div>
          <div class="pair-row">
            <span class="number-tag">B</span>
            <span class="dotted-trace-line">- - - - - - - - - - - - -</span>
            <span class="object-tag">⭐⭐⭐</span>
          </div>
        </div>

        <div class="bonus-challenge-box">
          <strong>Teacher Tip:</strong> Includes full memo and print-friendly black & white versions.
        </div>
        <div class="page-footer-num">Sample Page 3</div>
      </div>
    `}getPageContentTeacherGuide(e){return`
      <div class="worksheet-sheet guide-sheet">
        <div class="sheet-header-row">
          <span class="sheet-exercise-title">Curriculum Overview & Specs 📋</span>
        </div>
        <div class="guide-content-blocks">
          <div class="guide-block">
            <h4>🎯 Subject & Curriculum</h4>
            <p><strong>${e.curriculum||"CAPS"}</strong> aligned for <strong>${e.grade}</strong>, <strong>${e.term||"Term 1"}</strong>.</p>
          </div>
          <div class="guide-block">
            <h4>📱 How to Receive Full PDF:</h4>
            <p>Click "Buy Resource" below to generate your unique reference number and send to WhatsApp or Email. File is emailed instantly upon receipt of payment proof!</p>
          </div>
          <div class="print-specs-box">
            <span>🖨️ Format: High-Res A4 / Letter PDF</span>
            <span>🔒 Locked: Price ${e.currency||"R"}${parseFloat(e.price).toFixed(2)}</span>
          </div>
        </div>
        <div class="page-footer-num">Sample Page 4</div>
      </div>
    `}attachInteractiveWorksheetLogic(){this.modalEl.querySelectorAll(".word-bubble-interactive").forEach(t=>{t.addEventListener("click",s=>{l.pop(700),s.currentTarget.classList.toggle("selected-bubble")})})}}class ee{constructor(e={}){this.onAddBundleToCart=e.onAddBundleToCart||(()=>{}),this.onApplyCoupon=e.onApplyCoupon||(()=>{}),this.onMascotCheer=e.onMascotCheer||(()=>{}),this.wheelSpinning=!1,this.wheelRotation=0,this.wheelSegments=[{text:"15% OFF Code: MAGIC15",color:"#FFB7B2",type:"discount",code:"MAGIC15"},{text:"FREE Alphabet Stickers 🎁",color:"#B5EAD7",type:"freebie",code:"FREE-STICKERS"},{text:"20% OFF Code: SUPERMOM",color:"#FFEAA7",type:"discount",code:"SUPERMOM"},{text:"FREE Math Maze PDF ✏️",color:"#E2F0D9",type:"freebie",code:"FREE-MAZE"},{text:"Teacher Hug! Spin Again 💖",color:"#E8D7F1",type:"reroll"},{text:"R50 OFF Any Order: MOMLOVE",color:"#BEE1E6",type:"discount",code:"MOMLOVE"}],this.bundleItems=[{id:"b1",name:"Phonics Fun Pack",price:95,icon:"🎒",color:"#FFCCD5"},{id:"b2",name:"Math Mania Mats",price:85,icon:"✏️",color:"#B2EBF2"},{id:"b3",name:"Spelling Stars Cards",price:90,icon:"⭐",color:"#FFE082"},{id:"b4",name:"Science Sparks STEM",price:110,icon:"🧪",color:"#C8E6C9"},{id:"b5",name:"Handwriting Heroes",price:65,icon:"🦸",color:"#FFF9C4"},{id:"b6",name:"Calm Breathing Wheel",price:80,icon:"💖",color:"#FCE4EC"}],this.packedItems=[],this.init()}init(){this.setupWheel(),this.setupBundleGame(),this.setupTabs()}setupTabs(){const e=document.querySelectorAll(".fun-tab-btn"),t=document.querySelectorAll(".fun-tab-panel");e.forEach(s=>{s.addEventListener("click",a=>{l.pop(500);const i=a.currentTarget.dataset.tab;e.forEach(o=>o.classList.remove("active")),t.forEach(o=>o.classList.remove("active")),a.currentTarget.classList.add("active");const r=document.getElementById(i);r&&r.classList.add("active")})})}setupWheel(){const e=document.getElementById("prizeWheelCanvas"),t=document.getElementById("spinWheelBtn");!e||!t||(this.drawWheel(e),t.addEventListener("click",()=>{this.wheelSpinning||this.spinWheel(e)}))}drawWheel(e){const t=e.getContext("2d"),s=e.width,a=e.height,i=s/2-12,r=s/2,o=a/2,n=this.wheelSegments.length,c=Math.PI*2/n;t.clearRect(0,0,s,a),t.save(),t.translate(r,o),t.rotate(this.wheelRotation*(Math.PI/180)),t.beginPath(),t.arc(0,0,i+8,0,Math.PI*2),t.fillStyle="#3D2C2E",t.fill();for(let h=0;h<n;h++){const u=h*c,v=this.wheelSegments[h];t.beginPath(),t.moveTo(0,0),t.arc(0,0,i,u,u+c),t.closePath(),t.fillStyle=v.color,t.fill(),t.lineWidth=3,t.strokeStyle="#3D2C2E",t.stroke(),t.save(),t.rotate(u+c/2),t.textAlign="right",t.fillStyle="#2B1E20",t.font='bold 13px "Fredoka", sans-serif',t.fillText(v.text,i-20,5),t.restore()}for(let h=0;h<n*3;h++){const u=h*Math.PI*2/(n*3),v=Math.cos(u)*(i+4),y=Math.sin(u)*(i+4);t.beginPath(),t.arc(v,y,3.5,0,Math.PI*2),t.fillStyle="#FFFFFF",t.fill(),t.lineWidth=1,t.strokeStyle="#3D2C2E",t.stroke()}t.beginPath(),t.arc(0,0,32,0,Math.PI*2),t.fillStyle="#FF5E7E",t.fill(),t.lineWidth=4,t.strokeStyle="#3D2C2E",t.stroke(),t.font='20px "Fredoka", sans-serif',t.textAlign="center",t.textBaseline="middle",t.fillStyle="#FFFFFF",t.fillText("⭐",0,0),t.restore()}spinWheel(e){this.wheelSpinning=!0,l.boing();const t=document.getElementById("spinWheelBtn");t&&(t.disabled=!0);const s=360*(4+Math.floor(Math.random()*3)),a=Math.random()*360,i=this.wheelRotation+s+a,r=this.wheelRotation,o=performance.now(),n=4e3;let c=r;const h=u=>{const v=u-o,y=Math.min(v/n,1),m=1-Math.pow(1-y,3.8);this.wheelRotation=r+(i-r)*m,Math.abs(this.wheelRotation-c)>=360/this.wheelSegments.length&&(l.tick(),c=this.wheelRotation),this.drawWheel(e),y<1?requestAnimationFrame(h):(this.wheelSpinning=!1,t&&(t.disabled=!1),this.onWheelFinished())};requestAnimationFrame(h)}onWheelFinished(){const e=(360-this.wheelRotation%360+270)%360,t=360/this.wheelSegments.length,s=Math.floor(e/t)%this.wheelSegments.length,a=this.wheelSegments[s];l.win(),this.onMascotCheer(`Woohoo! You won: ${a.text}! 🎉`);const i=document.getElementById("wheelResultAnnouncement");if(i){i.innerHTML=`
        <div class="prize-card-winner">
          <h4>🎉 You Won!</h4>
          <p class="prize-text">${a.text}</p>
          ${a.code?`
            <div class="coupon-won-box">
              <span class="code-copy-tag">Code: <strong>${a.code}</strong></span>
              <button class="bubble-pill-btn btn-peach apply-wheel-coupon-btn" data-code="${a.code}">
                📋 Copy & Apply to Basket
              </button>
            </div>
          `:`
            <button class="bubble-pill-btn btn-mint play-again-btn">Spin Again! 🎈</button>
          `}
        </div>
      `;const r=i.querySelector(".apply-wheel-coupon-btn");r&&r.addEventListener("click",n=>{l.sparkle();const c=n.currentTarget.dataset.code;this.onApplyCoupon(c),alert(`✨ Coupon "${c}" copied and applied to your basket!`)});const o=i.querySelector(".play-again-btn");o&&o.addEventListener("click",()=>{l.pop(500),i.innerHTML=""})}}setupBundleGame(){this.renderShelfItems(),this.updateBackpackUi();const e=document.getElementById("addBundleToCartBtn");e&&e.addEventListener("click",()=>{if(this.packedItems.length===0){l.pop(300),alert("🎒 Please pack at least 1 resource into the backpack first!");return}l.win();const s=this.getDiscountRate(),i=this.packedItems.reduce((o,n)=>o+n.price,0)*(1-s),r={id:`custom-bundle-${Date.now()}`,title:`Custom Bundle (${this.packedItems.length} items) 🎒`,subtitle:this.packedItems.map(o=>o.name).join(", "),grade:"Multi-Grade Bundle",colorTheme:"#FFF3E0",price:parseFloat(i.toFixed(2)),packedCount:this.packedItems.length,discountPercent:Math.round(s*100)};this.onAddBundleToCart(r),this.onMascotCheer(`Awesome bundle created! You saved ${Math.round(s*100)}%! 🎉`),this.packedItems=[],this.updateBackpackUi()});const t=document.getElementById("emptyBackpackBtn");t&&t.addEventListener("click",()=>{l.pop(400),this.packedItems=[],this.updateBackpackUi()})}renderShelfItems(){const e=document.getElementById("bundleShelfContainer");e&&(e.innerHTML=this.bundleItems.map(t=>`
      <div class="bundle-item-tile" data-id="${t.id}" style="background: ${t.color}">
        <span class="item-tile-icon">${t.icon}</span>
        <span class="item-tile-name">${t.name}</span>
        <span class="item-tile-price">R${t.price.toFixed(2)}</span>
        <button class="pack-item-btn" title="Pack into backpack!">
          + Pack In
        </button>
      </div>
    `).join(""),e.querySelectorAll(".bundle-item-tile").forEach(t=>{t.addEventListener("click",s=>{const a=t.dataset.id,i=this.bundleItems.find(r=>r.id===a);i&&this.packItem(i,t)})}))}packItem(e,t){l.boing(),this.packedItems.push(e),t.classList.add("item-packed-bounce"),setTimeout(()=>t.classList.remove("item-packed-bounce"),350);const s=document.getElementById("kawaiiBackpackSvg");s&&(s.classList.add("backpack-chewing"),setTimeout(()=>s.classList.remove("backpack-chewing"),500)),this.updateBackpackUi()}getDiscountRate(){const e=this.packedItems.length;return e>=3?.25:e===2?.1:0}updateBackpackUi(){const e=document.getElementById("packedItemsList"),t=document.getElementById("bundleSubtotal"),s=document.getElementById("bundleDiscount"),a=document.getElementById("bundleFinalTotal"),i=document.getElementById("backpackItemsBadge"),r=document.getElementById("bundleSavingsMeterFill"),o=document.getElementById("bundleSavingsMeterText");i&&(i.textContent=this.packedItems.length);const n=this.packedItems.reduce((v,y)=>v+y.price,0),c=this.getDiscountRate(),h=n*c,u=n-h;t&&(t.textContent=`R${n.toFixed(2)}`),s&&(s.textContent=`-R${h.toFixed(2)} (${Math.round(c*100)}% off)`),a&&(a.textContent=`R${u.toFixed(2)}`),r&&o&&(this.packedItems.length===0?(r.style.width="0%",o.textContent="Pack items to unlock up to 25% OFF!"):this.packedItems.length===1?(r.style.width="35%",o.textContent="Pack 1 more item to unlock 10% OFF!"):this.packedItems.length===2?(r.style.width="65%",o.textContent="Awesome! 10% unlocked. Pack 1 more for 25% SUPER SAVINGS!"):(r.style.width="100%",o.textContent="🎉 MAXIMUM 25% SUPER TEACHER SAVINGS UNLOCKED!")),e&&(this.packedItems.length===0?e.innerHTML='<p class="empty-backpack-note">Your backpack is hungry! Click items on the shelf above to pack them inside! 🎒✨</p>':(e.innerHTML=this.packedItems.map((v,y)=>`
          <div class="packed-mini-item">
            <span>${v.icon} ${v.name}</span>
            <span class="packed-p">R${v.price.toFixed(2)}</span>
            <button class="remove-packed-btn" data-index="${y}" title="Remove item">✕</button>
          </div>
        `).join(""),e.querySelectorAll(".remove-packed-btn").forEach(v=>{v.addEventListener("click",y=>{l.pop(380);const m=parseInt(y.currentTarget.dataset.index,10);this.packedItems.splice(m,1),this.updateBackpackUi()})})))}}class te{constructor(e={}){this.onCartChange=e.onCartChange||(()=>{}),this.onMascotCheer=e.onMascotCheer||(()=>{}),this.onProceedToOrder=e.onProceedToOrder||(()=>{}),this.items=[],this.couponCode="",this.discountPercent=0,this.flatDiscount=0,this.drawerEl=null,this.init()}init(){this.createDrawerDom(),this.setupEvents(),this.updateUi()}createDrawerDom(){this.drawerEl=document.createElement("div"),this.drawerEl.className="cart-drawer-backdrop",this.drawerEl.id="cartDrawerBackdrop",this.drawerEl.innerHTML=`
      <div class="cart-drawer-panel">
        <div class="drawer-header">
          <div class="drawer-header-title">
            <span class="basket-emoji">🎒</span>
            <h3>Teacher's Goodie Basket</h3>
          </div>
          <button class="drawer-close-btn" id="closeCartDrawerBtn" aria-label="Close basket">✕</button>
        </div>

        <div class="drawer-body" id="cartDrawerItems">
          <!-- Populated by JS -->
        </div>

        <div class="drawer-footer">
          <!-- Coupon Box -->
          <div class="cart-coupon-box">
            <input type="text" id="cartCouponInput" placeholder="Discount Code (e.g. SUPERMOM)" />
            <button class="bubble-pill-btn btn-peach" id="applyCouponBtn">Apply</button>
          </div>
          <div class="coupon-msg" id="couponMsg"></div>

          <!-- Price Summary -->
          <div class="price-summary-breakdown">
            <div class="summary-line">
              <span>Subtotal:</span>
              <span id="cartSubtotalVal">$0.00</span>
            </div>
            <div class="summary-line discount-line" id="discountRow" style="display: none;">
              <span>Teacher Savings:</span>
              <span id="cartDiscountVal">-$0.00</span>
            </div>
            <div class="summary-line total-line">
              <span>Total:</span>
              <span id="cartTotalVal">$0.00</span>
            </div>
          </div>

          <button class="bubble-pill-btn btn-mint checkout-btn" id="proceedCheckoutBtn">
            🧾 Generate Invoice & Order (<span id="checkoutPriceVal">R0.00</span>)
          </button>
          <p class="safe-download-note">🔒 Sales handled via WhatsApp & Email • Invoice Reference Generated</p>
        </div>
      </div>
    `,document.body.appendChild(this.drawerEl)}setupEvents(){const e=document.getElementById("cartBasketBtn");e&&e.addEventListener("click",()=>this.openDrawer());const t=this.drawerEl.querySelector("#closeCartDrawerBtn");t&&t.addEventListener("click",()=>this.closeDrawer()),this.drawerEl.addEventListener("click",i=>{i.target===this.drawerEl&&this.closeDrawer()});const s=this.drawerEl.querySelector("#applyCouponBtn");s&&s.addEventListener("click",()=>{const i=this.drawerEl.querySelector("#cartCouponInput");i&&this.applyCoupon(i.value.trim())});const a=this.drawerEl.querySelector("#proceedCheckoutBtn");a&&a.addEventListener("click",()=>this.handleCheckout())}addItem(e){const t=this.items.find(s=>s.resource.id===e.id);t?t.quantity+=1:this.items.push({resource:e,quantity:1}),this.updateUi(),this.onCartChange(this.items)}removeItem(e){l.pop(350),this.items=this.items.filter(t=>t.resource.id!==e),this.updateUi(),this.onCartChange(this.items)}updateQuantity(e,t){const s=this.items.find(a=>a.resource.id===e);s&&(l.pop(500),s.quantity+=t,s.quantity<=0?this.removeItem(e):(this.updateUi(),this.onCartChange(this.items)))}applyCoupon(e){l.pop(600);const t=this.drawerEl.querySelector("#couponMsg"),s=e.toUpperCase();if(s==="SUPERMOM")this.couponCode=s,this.discountPercent=.2,this.flatDiscount=0,t.textContent="🎉 20% SuperMom discount applied!",t.className="coupon-msg success",l.win();else if(s==="MAGIC15")this.couponCode=s,this.discountPercent=.15,this.flatDiscount=0,t.textContent="✨ 15% Magic discount applied!",t.className="coupon-msg success",l.sparkle();else if(s==="MOMLOVE")this.couponCode=s,this.discountPercent=0,this.flatDiscount=50,t.textContent="💖 R50 Off Mom Love applied!",t.className="coupon-msg success",l.sparkle();else if(s==="FREE-STICKERS"||s==="FREE-MAZE")this.couponCode=s,this.discountPercent=.1,this.flatDiscount=0,t.textContent="🎁 Freebie bonus pack + 10% discount applied!",t.className="coupon-msg success",l.sparkle();else{t.textContent="❌ Invalid coupon. Try SUPERMOM or spin the wheel!",t.className="coupon-msg error";return}const a=this.drawerEl.querySelector("#cartCouponInput");a&&(a.value=s),this.updateUi()}openDrawer(){l.pop(620),this.drawerEl.classList.add("active")}closeDrawer(){l.pop(400),this.drawerEl.classList.remove("active")}updateUi(){const e=this.items.reduce((m,b)=>m+b.quantity,0),t=document.getElementById("cartBadgeCount");t&&(t.textContent=e,t.style.transform="scale(1.35)",setTimeout(()=>t.style.transform="scale(1)",250));const s=this.drawerEl.querySelector("#cartDrawerItems");if(!s)return;this.items.length===0?s.innerHTML=`
        <div class="empty-cart-state">
          <div class="empty-cart-emoji">🎒</div>
          <h4>Your Goodie Basket is Empty!</h4>
          <p>Explore our cute printables or build a custom bundle in the Fun Zone!</p>
        </div>
      `:(s.innerHTML=this.items.map(({resource:m,quantity:b})=>`
        <div class="cart-drawer-item-card">
          <div class="cart-thumb-box" style="background: ${m.colorTheme||"#FFE5EC"}">
            <span>🎒</span>
          </div>
          <div class="cart-item-details">
            <h5 class="cart-item-title">${m.title}</h5>
            <span class="cart-item-grade">${m.grade}</span>
            <div class="cart-item-price-unit">R${m.price.toFixed(2)} each</div>
          </div>
          <div class="cart-qty-controls">
            <button class="qty-btn" data-id="${m.id}" data-action="dec">-</button>
            <span class="qty-num">${b}</span>
            <button class="qty-btn" data-id="${m.id}" data-action="inc">+</button>
          </div>
          <div class="cart-item-subtotal">
            R${(m.price*b).toFixed(2)}
          </div>
          <button class="remove-cart-item-btn" data-id="${m.id}" title="Remove item">✕</button>
        </div>
      `).join(""),s.querySelectorAll(".qty-btn").forEach(m=>{m.addEventListener("click",b=>{const w=b.currentTarget.dataset.id,E=b.currentTarget.dataset.action;this.updateQuantity(w,E==="inc"?1:-1)})}),s.querySelectorAll(".remove-cart-item-btn").forEach(m=>{m.addEventListener("click",b=>{const w=b.currentTarget.dataset.id;this.removeItem(w)})}));const a=this.items.reduce((m,b)=>m+b.resource.price*b.quantity,0);let i=a*this.discountPercent+this.flatDiscount;i>a&&(i=a);const r=Math.max(0,a-i),o=this.drawerEl.querySelector("#cartSubtotalVal"),n=this.drawerEl.querySelector("#discountRow"),c=this.drawerEl.querySelector("#cartDiscountVal"),h=this.drawerEl.querySelector("#cartTotalVal"),u=this.drawerEl.querySelector("#checkoutPriceVal"),v=this.drawerEl.querySelector("#proceedCheckoutBtn"),y=this.items[0]&&this.items[0].resource.currency||"R";o&&(o.textContent=`${y}${a.toFixed(2)}`),h&&(h.textContent=`${y}${r.toFixed(2)}`),u&&(u.textContent=`${y}${r.toFixed(2)}`),i>0?(n&&(n.style.display="flex"),c&&(c.textContent=`-${y}${i.toFixed(2)}`)):n&&(n.style.display="none"),v&&(v.disabled=this.items.length===0)}handleCheckout(){this.items.length!==0&&(l.boing(),this.closeDrawer(),this.onProceedToOrder(this.items))}}class se{constructor(e={}){this.modalEl=null,this.currentOrder=null,this.onMascotCheer=e.onMascotCheer||(()=>{}),this.init()}init(){this.modalEl=document.createElement("div"),this.modalEl.className="order-modal-backdrop",this.modalEl.id="orderModalBackdrop",this.modalEl.innerHTML=`
      <div class="order-window">
        <!-- Window Top Header -->
        <div class="order-window-header">
          <div class="order-header-badge">
            <span class="badge-icon">🧾</span>
            <h3>Order & Invoice Reference</h3>
          </div>
          <button class="order-close-btn" id="closeOrderModalBtn" aria-label="Close order modal">✕</button>
        </div>

        <!-- Window Body -->
        <div class="order-window-body">
          
          <!-- Reference / Invoice Number Hero Banner -->
          <div class="invoice-hero-card">
            <div class="invoice-tag">Your Unique Payment Reference:</div>
            <div class="invoice-number-display">
              <span id="orderInvoiceNum">TM-2026-XXXX</span>
              <button class="copy-ref-btn" id="copyRefBtn" title="Copy reference to clipboard">
                📋 Copy Ref
              </button>
            </div>
            <p class="invoice-instruction">
              🔒 <strong>Resource Locked:</strong> Digital downloads are manually unlocked and sent immediately upon payment verification using this reference.
            </p>
          </div>

          <!-- Order Summary Details Grid -->
          <div class="order-resource-summary-card">
            <div class="res-summary-top">
              <h4 id="orderResourceTitle">Grade 1 Math Mania Workbook</h4>
              <span class="order-price-chip" id="orderResourcePrice">R85.00</span>
            </div>

            <div class="resource-metadata-pill-grid">
              <div class="meta-tag"><strong>Curriculum:</strong> <span id="orderMetaCurriculum">CAPS</span></div>
              <div class="meta-tag"><strong>Grade:</strong> <span id="orderMetaGrade">Grade 1</span></div>
              <div class="meta-tag"><strong>Subject:</strong> <span id="orderMetaSubject">Mathematics</span></div>
              <div class="meta-tag"><strong>Term:</strong> <span id="orderMetaTerm">Term 1</span></div>
              <div class="meta-tag"><strong>Year:</strong> <span id="orderMetaYear">2026</span></div>
              <div class="meta-tag locked-tag">🔒 Status: <span>Locked PDF</span></div>
            </div>
          </div>

          <!-- Customer Contact Details Form -->
          <form class="order-customer-form" id="orderCustomerForm" onsubmit="event.preventDefault();">
            <h5 class="form-title">Enter Your Contact Details:</h5>
            
            <div class="form-row-2">
              <div class="form-field">
                <label for="custName">Your Name & Surname: *</label>
                <input type="text" id="custName" placeholder="e.g. Rachel Jenkins" required />
              </div>
              <div class="form-field">
                <label for="custWhatsApp">WhatsApp / Cell Number: *</label>
                <input type="tel" id="custWhatsApp" placeholder="e.g. 082 123 4567" required />
              </div>
            </div>

            <div class="form-field">
              <label for="custEmail">Email Address (to receive digital files): *</label>
              <input type="email" id="custEmail" placeholder="e.g. rachel@school.co.za" required />
            </div>

            <div class="form-field">
              <label for="custNotes">Special Requests / School Notes (Optional):</label>
              <input type="text" id="custNotes" placeholder="e.g. Please include invoice with school vat number..." />
            </div>
          </form>

          <!-- Channel Selection Action Buttons -->
          <div class="order-channel-selection">
            <h5 class="channel-heading">Choose How to Send Your Order:</h5>
            <p class="channel-subtext">No card payments on website. Orders are verified and dispatched directly via WhatsApp or Email.</p>

            <div class="channel-buttons-grid">
              <button class="channel-action-btn btn-whatsapp" id="sendWhatsAppOrderBtn">
                <span class="channel-icon">💬</span>
                <div class="channel-text-wrap">
                  <strong>Send via WhatsApp Business</strong>
                  <span>Instant chat with Teacher Mom Roxy</span>
                </div>
                <span class="arrow-indicator">➜</span>
              </button>

              <button class="channel-action-btn btn-email" id="sendEmailOrderBtn">
                <span class="channel-icon">✉️</span>
                <div class="channel-text-wrap">
                  <strong>Send via Email</strong>
                  <span>Email directly to teachermomroxy3@gmail.com</span>
                </div>
                <span class="arrow-indicator">➜</span>
              </button>
            </div>
          </div>

          <div class="banking-notice-box">
            <strong>🏦 Payment Instructions:</strong>
            <p>EFT / Bank transfer or instant payment is required. Once you send your order, you will receive our banking details to make payment using your reference number above!</p>
          </div>

        </div>
      </div>
    `,document.body.appendChild(this.modalEl),this.modalEl.querySelector("#closeOrderModalBtn").addEventListener("click",()=>this.close()),this.modalEl.addEventListener("click",e=>{e.target===this.modalEl&&this.close()}),this.modalEl.querySelector("#copyRefBtn").addEventListener("click",()=>{this.currentOrder&&(navigator.clipboard.writeText(this.currentOrder.invoiceNum),l.sparkle(),alert(`📋 Reference Number "${this.currentOrder.invoiceNum}" copied to clipboard!`))}),this.modalEl.querySelector("#sendWhatsAppOrderBtn").addEventListener("click",()=>this.dispatchWhatsApp()),this.modalEl.querySelector("#sendEmailOrderBtn").addEventListener("click",()=>this.dispatchEmail())}open(e){l.boing();let t=!0,s=e,a="",i=0,r="R";Array.isArray(e)?(t=!1,a=`${e.reduce((c,h)=>c+h.quantity,0)} Resources Basket Pack`,i=e.reduce((c,h)=>c+h.resource.price*h.quantity,0),s=e[0].resource):(a=s.title,i=s.price,r=s.currency||"R");const o=p.generateInvoiceNumber();this.currentOrder={invoiceNum:o,resource:s,isSingle:t,rawItems:e,itemsTitle:a,totalPrice:i,currency:r},this.modalEl.querySelector("#orderInvoiceNum").textContent=o,this.modalEl.querySelector("#orderResourceTitle").textContent=a,this.modalEl.querySelector("#orderResourcePrice").textContent=`${r}${i.toFixed(2)}`,this.modalEl.querySelector("#orderMetaCurriculum").textContent=s.curriculum||"CAPS",this.modalEl.querySelector("#orderMetaGrade").textContent=s.grade||"Grade 1",this.modalEl.querySelector("#orderMetaSubject").textContent=s.subject||"All Subjects",this.modalEl.querySelector("#orderMetaTerm").textContent=s.term||"Term 1",this.modalEl.querySelector("#orderMetaYear").textContent=s.year||"2026",this.modalEl.classList.add("active")}close(){l.pop(400),this.modalEl.classList.remove("active")}validateForm(){const e=this.modalEl.querySelector("#custName").value.trim(),t=this.modalEl.querySelector("#custWhatsApp").value.trim(),s=this.modalEl.querySelector("#custEmail").value.trim();if(!e||!t||!s)return l.pop(300),alert("⚠️ Please fill in your Name, WhatsApp/Cell number, and Email address before proceeding."),null;const a=this.modalEl.querySelector("#custNotes").value.trim();return{name:e,phone:t,email:s,notes:a}}formatMessageText(e){const{invoiceNum:t,itemsTitle:s,totalPrice:a,currency:i,resource:r}=this.currentOrder;return["🌸 *NEW TEACHERMOM ORDER* 🌸",`*Invoice / Payment Reference:* ${t}`,"--------------------------------",`*Resource:* ${s}`,`*Curriculum:* ${r.curriculum||"CAPS"}`,`*Grade:* ${r.grade||"General"}`,`*Subject:* ${r.subject||"General"}`,`*Term & Year:* ${r.term||"Term 1"} (${r.year||"2026"})`,`*Total Amount Due:* ${i}${a.toFixed(2)}`,"*Status:* 🔒 Locked Digital Download","--------------------------------","*Customer Details:*",`• Name: ${e.name}`,`• WhatsApp: ${e.phone}`,`• Email: ${e.email}`,e.notes?`• Note: ${e.notes}`:"","--------------------------------",`Hi Roxy! I would like to order this resource. Please provide the banking / payment details so I can transfer with reference *${t}*. Thank you! ✨`].filter(Boolean).join(`
`)}dispatchWhatsApp(){const e=this.validateForm();if(!e)return;l.win();let s=(p.getSettings().whatsappNumber||"0608316086").replace(/[^0-9]/g,"");s.startsWith("0")&&(s="27"+s.substring(1));const a=this.formatMessageText(e),i=encodeURIComponent(a),r=`https://wa.me/${s}?text=${i}`;window.open(r,"_blank"),this.onMascotCheer(`Thank you ${e.name}! Order #${this.currentOrder.invoiceNum} created for WhatsApp! 💖`),this.close()}dispatchEmail(){const e=this.validateForm();if(!e)return;l.win();const s=p.getSettings().emailAddress||"teachermomroxy3@gmail.com",a=this.formatMessageText(e),i=encodeURIComponent(`TeacherMom Order: ${this.currentOrder.invoiceNum} - ${this.currentOrder.itemsTitle}`),r=encodeURIComponent(a),o=`mailto:${s}?subject=${i}&body=${r}`;window.location.href=o,navigator.clipboard.writeText(a),alert(`✉️ Order email opened for ${s}! Your invoice text has also been copied to your clipboard.`),this.onMascotCheer(`Thank you ${e.name}! Order #${this.currentOrder.invoiceNum} created for Email! 💌`),this.close()}}class ae{constructor(e={}){this.onMascotCheer=e.onMascotCheer||(()=>{}),this.authModal=e.authModal||null,this.modalEl=null,this.currentResource=null,this.selectedStars=5,this.init()}init(){this.modalEl=document.createElement("div"),this.modalEl.className="rate-modal-backdrop",this.modalEl.id="rateModalBackdrop",this.modalEl.innerHTML=`
      <div class="rate-window">
        <div class="rate-window-header">
          <div class="rate-header-badge">
            <span class="badge-icon">⭐</span>
            <h3>Teacher & Parent Review</h3>
          </div>
          <button class="rate-close-btn" id="closeRateModalBtn" aria-label="Close review modal">✕</button>
        </div>

        <div class="rate-window-body">
          <!-- Verified Account Header Slot -->
          <div class="rate-auth-user-bar" id="rateAuthUserBar"></div>

          <div class="rate-target-info">
            <span class="rate-label">You are rating:</span>
            <h4 id="rateResourceTitle">Educational Resource</h4>
          </div>

          <!-- Interactive Star Selector -->
          <div class="star-rating-selector" id="starRatingSelector">
            <button type="button" class="star-select-btn active" data-stars="1">★</button>
            <button type="button" class="star-select-btn active" data-stars="2">★</button>
            <button type="button" class="star-select-btn active" data-stars="3">★</button>
            <button type="button" class="star-select-btn active" data-stars="4">★</button>
            <button type="button" class="star-select-btn active" data-stars="5">★</button>
          </div>
          <div class="stars-caption-text" id="starsCaption">5.0 - Super Fantastic! 🌟</div>

          <!-- Form Fields -->
          <form class="rate-review-form" id="rateReviewForm" onsubmit="event.preventDefault();">
            <div class="form-row-2">
              <div class="form-field">
                <label for="revAuthor">Your Name & Title: *</label>
                <input type="text" id="revAuthor" placeholder="e.g. Mrs. Lerato Khumalo" required />
              </div>
              <div class="form-field">
                <label for="revRole">Your Role & City: *</label>
                <input type="text" id="revRole" placeholder="e.g. Grade 1 Teacher, Pretoria" required />
              </div>
            </div>

            <div class="form-field">
              <label for="revText">Your Review & Classroom Experience: *</label>
              <textarea id="revText" rows="3" placeholder="How did your learners respond to this resource? What did you love most?" required></textarea>
            </div>

            <!-- Mailing List Opt-In / Opt-Out for Reviewer -->
            <div class="rate-mailing-opt-box">
              <label class="checkbox-container">
                <input type="checkbox" id="revMailingOpt" checked />
                <span class="checkbox-text">
                  💌 <strong>TeacherMom VIP Mailing List:</strong> Send me free weekly printables, coupons & CAPS teaching tips.
                </span>
              </label>
            </div>

            <button type="submit" class="bubble-pill-btn btn-mint full-width-btn submit-review-btn">
              🌟 Submit Verified Review
            </button>
          </form>
        </div>
      </div>
    `,document.body.appendChild(this.modalEl),this.modalEl.querySelector("#closeRateModalBtn").addEventListener("click",()=>this.close()),this.modalEl.addEventListener("click",t=>{t.target===this.modalEl&&this.close()}),this.modalEl.querySelectorAll(".star-select-btn").forEach(t=>{t.addEventListener("click",s=>{l.pop(650),this.selectedStars=parseInt(s.currentTarget.dataset.stars,10),this.updateStarsDisplay()})}),this.modalEl.querySelector("#rateReviewForm").addEventListener("submit",()=>this.handleSubmit())}updateStarsDisplay(){const e=this.modalEl.querySelectorAll(".star-select-btn"),t=this.modalEl.querySelector("#starsCaption");e.forEach((a,i)=>{a.classList.toggle("active",i<this.selectedStars)});const s=["","1.0 - Needs Improvement 🤔","2.0 - Fair ✏️","3.0 - Good Resource 👍","4.0 - Really Great! 🎒","5.0 - Super Fantastic! 🌟"];t.textContent=s[this.selectedStars]||"5.0 - Super Fantastic! 🌟"}open(e){const t=p.getCurrentUser();if(!t){l.pop(500),this.authModal?this.authModal.open({promptMessage:"🌸 Please sign in with Google or create an account to leave a verified review!",onLoginSuccess:r=>{this.open(e)}}):alert("Please sign in or register before leaving a review.");return}this.currentResource=e,this.selectedStars=5,this.updateStarsDisplay();const s=this.modalEl.querySelector("#rateResourceTitle");s&&(s.textContent=e.title);const a=this.modalEl.querySelector("#rateAuthUserBar");a&&(a.innerHTML=`
        <div class="verified-reviewer-pill">
          <span class="v-avatar">${t.avatar||"👩‍🏫"}</span>
          <span class="v-info">Logged in as: <strong>${t.name}</strong></span>
          <span class="v-tag">✓ Verified ${t.provider==="google"?"Google":"Member"}</span>
        </div>
      `),this.modalEl.querySelector("#revAuthor").value=t.name||"",this.modalEl.querySelector("#revRole").value=t.role||"",this.modalEl.querySelector("#revText").value="";const i=this.modalEl.querySelector("#revMailingOpt");i&&(i.checked=t.mailingList!==!1),l.boing(),this.modalEl.classList.add("active")}close(){l.pop(400),this.modalEl.classList.remove("active")}handleSubmit(){const e=p.getCurrentUser();if(!e){alert("⚠️ Session expired. Please sign in again."),this.close();return}const t=this.modalEl.querySelector("#revAuthor").value.trim(),s=this.modalEl.querySelector("#revRole").value.trim(),a=this.modalEl.querySelector("#revText").value.trim(),i=this.modalEl.querySelector("#revMailingOpt").checked;if(!t||!s||!a){alert("⚠️ Please fill in your name, role and review text.");return}l.win(),p.setMailingListStatus(e.email,i,{name:t,role:s}),p.rateResource(this.currentResource.id,this.selectedStars,{author:t,role:s,text:a,avatar:e.avatar||"👩‍🏫",userId:e.id,userEmail:e.email,provider:e.provider||"custom",verified:!0,date:new Date().toLocaleDateString("en-ZA",{year:"numeric",month:"short",day:"numeric"})}),this.onMascotCheer(`Thank you ${t}! Your verified ${this.selectedStars}★ review has been recorded! 💖`),this.close(),alert("🎉 Thank you for supporting TeacherMom! Your verified review has been published.")}}class ie{constructor(e={}){this.onMascotCheer=e.onMascotCheer||(()=>{}),this.modalEl=null,this.pendingSuccessCallback=null,this.activeTab="register",this.init()}init(){this.modalEl=document.createElement("div"),this.modalEl.className="auth-modal-backdrop",this.modalEl.id="authModalBackdrop",this.modalEl.innerHTML=`
      <div class="auth-window">
        <!-- Window Top Bar -->
        <div class="auth-window-header">
          <div class="auth-header-title">
            <span class="auth-icon-badge">🌸</span>
            <div>
              <h3>Teacher & Parent Access</h3>
              <p class="auth-header-sub" id="authHeaderSub">Sign in to leave verified reviews & unlock educator perks</p>
            </div>
          </div>
          <button class="auth-close-btn" id="closeAuthModalBtn" aria-label="Close sign in dialog">✕</button>
        </div>

        <!-- Notification Banner / Prompt -->
        <div class="auth-prompt-alert" id="authPromptAlert" style="display: none;"></div>

        <!-- Window Body -->
        <div class="auth-window-body" id="authWindowBody">
          <!-- Dynamically filled: either Auth Forms or Active Profile -->
        </div>
      </div>
    `,document.body.appendChild(this.modalEl),this.modalEl.querySelector("#closeAuthModalBtn").addEventListener("click",()=>this.close()),this.modalEl.addEventListener("click",e=>{e.target===this.modalEl&&this.close()}),p.subscribe(()=>{this.modalEl.classList.contains("active")&&this.renderBody()})}open(e={}){this.pendingSuccessCallback=e.onLoginSuccess||null;const t=e.promptMessage||null,s=this.modalEl.querySelector("#authPromptAlert");t?(s.textContent=t,s.style.display="block"):s.style.display="none",this.renderBody(),l.boing(),this.modalEl.classList.add("active")}close(){l.pop(400),this.modalEl.classList.remove("active"),this.pendingSuccessCallback=null}renderBody(){const e=this.modalEl.querySelector("#authWindowBody"),t=p.getCurrentUser();t?this.renderProfileView(e,t):this.renderAuthForms(e)}renderProfileView(e,t){const s=t.mailingList!==!1;e.innerHTML=`
      <div class="user-profile-card">
        <div class="profile-header-row">
          <div class="profile-avatar-large">${t.avatar||"👩‍🏫"}</div>
          <div class="profile-meta">
            <h4>${t.name}</h4>
            <span class="profile-email">${t.email}</span>
            <span class="profile-role">🏫 ${t.role||"Educator / Parent"}</span>
            <span class="verified-provider-badge">
              ✓ Verified via ${t.provider==="google"?"Google":"TeacherMom Member"}
            </span>
          </div>
        </div>

        <!-- Mailing List Subscription Card -->
        <div class="mailing-list-status-card ${s?"subscribed":"opted-out"}">
          <div class="m-card-info">
            <div class="m-badge-row">
              <span class="m-icon">${s?"💌":"🔕"}</span>
              <strong>TeacherMom VIP Mailing List</strong>
            </div>
            <p class="m-status-text">
              Status: <strong>${s?"Subscribed (Opted In)":"Opted Out / Inactive"}</strong>
            </p>
            <p class="m-hint-text">
              ${s?"You receive freebie printables, Sunday morning worksheets & secret discount codes!":"You are currently not receiving free weekly printables or update emails."}
            </p>
          </div>
          <button class="bubble-pill-btn ${s?"btn-opt-out":"btn-mint"}" id="toggleMailingListBtn">
            ${s?"Opt Out / Unsubscribe":"Opt In / Join Free List"}
          </button>
        </div>

        <div class="profile-actions-row">
          <button class="bubble-pill-btn btn-peach full-width-btn" id="profileSignOutBtn">
            🚪 Sign Out of Account
          </button>
        </div>
      </div>
    `,e.querySelector("#toggleMailingListBtn").addEventListener("click",()=>{l.sparkle();const a=!s;p.setMailingListStatus(t.email,a,{name:t.name,role:t.role}),a?(this.onMascotCheer("Yay! You're subscribed to the TeacherMom Mailing List! 💌"),alert("🎉 Hooray! You have opted into the TeacherMom VIP Mailing List. Keep an eye on your inbox!")):(l.pop(350),alert("👋 You have opted out of the mailing list. You can opt back in anytime!")),this.renderBody()}),e.querySelector("#profileSignOutBtn").addEventListener("click",()=>{l.pop(400),p.logoutUser(),alert("You have been signed out."),this.renderBody()})}renderAuthForms(e){e.innerHTML=`
      <div class="auth-forms-wrapper">
        
        <!-- Google One-Click Sign In -->
        <div class="google-auth-box">
          <button type="button" class="google-auth-btn" id="googleSignInBtn">
            <svg class="google-logo" viewBox="0 0 24 24" width="22" height="22">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <label class="google-mailing-opt-label">
            <input type="checkbox" id="googleMailingOptCheckbox" checked />
            <span>Join the TeacherMom VIP Mailing List (free weekly printables)</span>
          </label>
        </div>

        <div class="auth-divider-row">
          <span>OR CONTINUE WITH EMAIL</span>
        </div>

        <!-- Auth Tabs: Register vs Sign In -->
        <div class="auth-tab-switch">
          <button type="button" class="auth-tab-btn ${this.activeTab==="register"?"active":""}" data-tab="register">
            ✨ Register New Account
          </button>
          <button type="button" class="auth-tab-btn ${this.activeTab==="login"?"active":""}" data-tab="login">
            🔑 Sign In
          </button>
        </div>

        <!-- TAB 1: Custom Registration Form -->
        <form class="auth-form-panel ${this.activeTab==="register"?"active":""}" id="customRegisterForm">
          <div class="form-row-2">
            <div class="form-field">
              <label for="regName">Your Full Name & Title: *</label>
              <input type="text" id="regName" placeholder="e.g. Mrs. Lerato Khumalo" required />
            </div>
            <div class="form-field">
              <label for="regRole">Role & School / City: *</label>
              <input type="text" id="regRole" placeholder="e.g. Grade 1 Teacher, Pretoria" required />
            </div>
          </div>

          <div class="form-row-2">
            <div class="form-field">
              <label for="regEmail">Email Address: *</label>
              <input type="email" id="regEmail" placeholder="lerato@myschool.co.za" required />
            </div>
            <div class="form-field">
              <label for="regPassword">Create Password: *</label>
              <input type="password" id="regPassword" placeholder="••••••••" required />
            </div>
          </div>

          <!-- Mailing List Opt-In / Opt-Out Checkbox -->
          <div class="mailing-list-opt-field">
            <label class="checkbox-container">
              <input type="checkbox" id="regMailingOpt" checked />
              <span class="checkbox-text">
                💌 <strong>Join the TeacherMom VIP Mailing List:</strong> Receive free Sunday printables, CAPS lesson ideas & secret discounts (You can opt out anytime).
              </span>
            </label>
          </div>

          <button type="submit" class="bubble-pill-btn btn-mint full-width-btn submit-auth-btn">
            🌟 Register & Continue
          </button>
        </form>

        <!-- TAB 2: Custom Login Form -->
        <form class="auth-form-panel ${this.activeTab==="login"?"active":""}" id="customLoginForm">
          <div class="form-field">
            <label for="loginEmail">Email Address: *</label>
            <input type="email" id="loginEmail" placeholder="your.name@school.co.za" required />
          </div>

          <div class="form-field">
            <label for="loginPassword">Password: *</label>
            <input type="password" id="loginPassword" placeholder="••••••••" required />
          </div>

          <button type="submit" class="bubble-pill-btn btn-mint full-width-btn submit-auth-btn">
            🚀 Sign In
          </button>
        </form>

      </div>
    `,e.querySelector("#googleSignInBtn").addEventListener("click",()=>{const a=e.querySelector("#googleMailingOptCheckbox").checked;l.sparkle();const i=prompt("Enter your Google Account email (or press OK for instant Google Demo login):","teacher.mom.guest@gmail.com");if(i===null)return;const r=i.trim()||"teacher.mom.guest@gmail.com",o=r.split("@")[0].replace("."," "),n=o.charAt(0).toUpperCase()+o.slice(1),c=p.loginWithGoogle({email:r,name:n.includes("guest")?"Mrs. Sarah van Zyl":n,role:"Foundation Phase Teacher, Cape Town",avatar:"👩‍🏫",mailingList:a});this.handleAuthSuccess(c.user,"Signed in with Google")}),e.querySelectorAll(".auth-tab-btn").forEach(a=>{a.addEventListener("click",i=>{l.pop(500),this.activeTab=i.currentTarget.dataset.tab,this.renderAuthForms(e)})});const t=e.querySelector("#customRegisterForm");t&&t.addEventListener("submit",a=>{a.preventDefault(),l.sparkle();const i=e.querySelector("#regName").value.trim(),r=e.querySelector("#regRole").value.trim(),o=e.querySelector("#regEmail").value.trim(),n=e.querySelector("#regPassword").value,c=e.querySelector("#regMailingOpt").checked,h=p.registerCustomUser({name:i,role:r,email:o,password:n,mailingList:c});if(!h.success){l.pop(300),alert(`⚠️ ${h.error}`);return}this.handleAuthSuccess(h.user,"Account created successfully")});const s=e.querySelector("#customLoginForm");s&&s.addEventListener("submit",a=>{a.preventDefault(),l.win();const i=e.querySelector("#loginEmail").value.trim(),r=e.querySelector("#loginPassword").value,o=p.loginCustomUser(i,r);if(!o.success){l.pop(300),alert(`⚠️ ${o.error}`);return}this.handleAuthSuccess(o.user,"Welcome back")})}handleAuthSuccess(e,t){l.win(),this.onMascotCheer(`Welcome ${e.name}! 🌸`),alert(`🎉 ${t}! You are logged in as ${e.name} (${e.email}).`);const s=this.pendingSuccessCallback;this.close(),s&&typeof s=="function"&&s(e)}}class re{constructor(e={}){this.onResourceAdded=e.onResourceAdded||(()=>{}),this.modalEl=null,this.sampleImagesBase64=[],this.init()}init(){this.createModalDom(),this.wireTriggerButtons()}wireTriggerButtons(){const e=document.getElementById("adminPortalBtn");e&&e.addEventListener("click",a=>{a.preventDefault(),this.open()});const t=document.getElementById("adminNavPill");t&&t.addEventListener("click",a=>{a.preventDefault(),this.open()});const s=document.getElementById("footerAdminLink");s&&s.addEventListener("click",a=>{a.preventDefault(),this.open()})}createModalDom(){this.modalEl=document.createElement("div"),this.modalEl.className="admin-modal-backdrop",this.modalEl.id="adminModalBackdrop",this.modalEl.innerHTML=`
      <div class="admin-window">
        <!-- Window Header -->
        <div class="admin-window-header">
          <div class="admin-header-title">
            <span class="admin-shield">🔐</span>
            <h3>TeacherMom Administration HQ</h3>
          </div>
          <button class="admin-close-btn" id="closeAdminModalBtn" aria-label="Close admin modal">✕</button>
        </div>

        <!-- Dynamic Container (Switches between Login & Dashboard) -->
        <div class="admin-window-body" id="adminDynamicContent">
          <!-- Populated by JS -->
        </div>
      </div>
    `,document.body.appendChild(this.modalEl),this.modalEl.querySelector("#closeAdminModalBtn").addEventListener("click",()=>this.close()),this.modalEl.addEventListener("click",e=>{e.target===this.modalEl&&this.close()})}open(){l.pop(600),this.render(),this.modalEl.classList.add("active")}close(){l.pop(400),this.modalEl.classList.remove("active")}render(){const e=this.modalEl.querySelector("#adminDynamicContent");e&&(p.isAdminLoggedIn()?this.renderDashboard(e):this.renderLoginForm(e))}renderLoginForm(e){e.innerHTML=`
      <div class="admin-login-card">
        <div class="lock-avatar">👩‍🏫</div>
        <h4>Admin Access Portal</h4>
        <p class="login-sub">Authorized credentials required to manage resource catalog and orders.</p>

        <form class="admin-login-form" id="adminLoginForm">
          <div class="form-field">
            <label for="adminEmailInput">Administrator Email: *</label>
            <input 
              type="email" 
              id="adminEmailInput" 
              value="${M}" 
              placeholder="teachermomroxy3@gmail.com" 
              required 
            />
            <small class="field-hint">Note: Restricted to <strong>${M}</strong></small>
          </div>

          <div class="form-field">
            <label for="adminPasswordInput">Password / Passcode: *</label>
            <input 
              type="password" 
              id="adminPasswordInput" 
              placeholder="Enter your admin password" 
              value="teachermom2026"
              required 
            />
          </div>

          <div id="loginErrorMsg" class="login-error-alert" style="display: none;"></div>

          <button type="submit" class="bubble-pill-btn btn-mint full-width-btn">
            🔓 Log in to TeacherMom HQ
          </button>
        </form>
      </div>
    `,e.querySelector("#adminLoginForm").addEventListener("submit",s=>{s.preventDefault();const a=e.querySelector("#adminEmailInput").value.trim(),i=e.querySelector("#adminPasswordInput").value.trim(),r=e.querySelector("#loginErrorMsg"),o=p.loginAdmin(a,i);o.success?(l.win(),this.renderDashboard(e)):(l.pop(300),r.textContent=o.error,r.style.display="block")})}renderDashboard(e){const t=p.getSettings(),s=p.getResources(),a=p.getReviews(),i=p.getStats(),r=p.getMailingList(),o=p.getUsers();this.sampleImagesBase64=[],e.innerHTML=`
      <div class="admin-dashboard-layout">
        
        <!-- Top Bar info & Stats -->
        <div class="admin-dash-topbar">
          <div class="admin-user-badge">
            <span>🌸 Logged in: <strong>${M}</strong></span>
          </div>
          <div class="admin-mini-stats-badges">
            <span class="m-stat" title="Total resources in store">📚 ${i.resourcesCount} Resources</span>
            <span class="m-stat" title="Estimated happy educators">👩‍🏫 ${i.happyTeachers} Teachers</span>
            <span class="m-stat" title="Average store rating">⭐ ${i.averageRating} Rating</span>
            <span class="m-stat" title="VIP Subscribers">💌 ${r.filter(m=>m.optedIn).length} VIPs</span>
          </div>
          <button class="text-link-btn" id="adminLogoutBtn">Logout 🚪</button>
        </div>

        <!-- WhatsApp Business Configuration Card -->
        <div class="admin-settings-card">
          <div class="settings-title-row">
            <h5>📱 WhatsApp Business Dispatch Number</h5>
            <span class="settings-hint">Where orders & invoices are sent</span>
          </div>
          <div class="settings-inline-form">
            <input type="text" id="adminWaInput" value="${t.whatsappNumber}" placeholder="0608316086" />
            <button class="bubble-pill-btn btn-peach" id="saveWaBtn">Save Number</button>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="admin-tab-nav">
          <button class="admin-tab-btn active" data-tab="uploadTab">✨ Upload Resource</button>
          <button class="admin-tab-btn" data-tab="catalogTab">📚 Manage Catalog (${s.length})</button>
          <button class="admin-tab-btn" data-tab="reviewsTab">💬 Reviews & Featured Quote (${a.length})</button>
          <button class="admin-tab-btn" data-tab="usersTab">👥 Users & Mailing List (${r.length})</button>
        </div>

        <!-- Tab 1: Upload Form -->
        <div class="admin-tab-content active" id="uploadTab">
          <form class="resource-upload-form" id="newResourceForm">
            
            <div class="form-row-2">
              <div class="form-field">
                <label>Resource Title: *</label>
                <input type="text" id="resTitle" placeholder="e.g. Grade 1 Life Skills Workbook 🎨" required />
              </div>
              <div class="form-field">
                <label>Subtitle / Focus: *</label>
                <input type="text" id="resSubtitle" placeholder="e.g. Healthy Habits & Visual Perception" required />
              </div>
            </div>

            <div class="form-row-3">
              <div class="form-field">
                <label>Curriculum: *</label>
                <select id="resCurriculum" required>
                  <option value="CAPS" selected>CAPS (South Africa)</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="IEB">IEB</option>
                  <option value="Homeschool">Homeschool / General</option>
                </select>
              </div>

              <div class="form-field">
                <label>Subject: *</label>
                <select id="resSubject" required>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English (HL)" selected>English (Home Language)</option>
                  <option value="English (FAL)">English (First Additional)</option>
                  <option value="Afrikaans">Afrikaans</option>
                  <option value="Life Skills">Life Skills</option>
                  <option value="Natural Sciences">Natural Sciences & Tech</option>
                  <option value="Phonics & Spelling">Phonics & Spelling</option>
                  <option value="Creative Arts">Creative Arts</option>
                </select>
              </div>

              <div class="form-field">
                <label>Grade: *</label>
                <select id="resGrade" required>
                  <option value="Grade R">Grade R / Pre-K</option>
                  <option value="Grade 1" selected>Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Multi-Grade">Multi-Grade Bundle</option>
                </select>
              </div>
            </div>

            <div class="form-row-3">
              <div class="form-field">
                <label>Term: *</label>
                <select id="resTerm" required>
                  <option value="Term 1" selected>Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                  <option value="Term 4">Term 4</option>
                  <option value="Full Year">Full Year</option>
                </select>
              </div>

              <div class="form-field">
                <label>Year: *</label>
                <input type="text" id="resYear" value="2026" required />
              </div>

              <div class="form-field">
                <label>Price (ZAR / R): *</label>
                <input type="number" id="resPrice" step="0.50" min="0" value="85.00" required />
              </div>
            </div>

            <!-- Locked State Enforcement -->
            <div class="locked-status-banner">
              <label class="locked-checkbox-label">
                <input type="checkbox" id="resLocked" checked disabled />
                <span>🔒 <strong>Resource Locked:</strong> Customers can only preview sample images until payment is verified via WhatsApp/Email.</span>
              </label>
            </div>

            <!-- Upload Sample Images -->
            <div class="form-field">
              <label>Upload Sample Preview Images: *</label>
              <input type="file" id="sampleImagesInput" multiple accept="image/*" />
              <small class="field-hint">Upload 1 or more sample worksheet pages to display to buyers.</small>
              <div class="sample-images-preview-row" id="sampleImagesPreviewContainer"></div>
            </div>

            <div class="form-field">
              <label>Resource Description & What's Included:</label>
              <textarea id="resDesc" rows="3" placeholder="List activities, pages, format (PDF), and answers included..."></textarea>
            </div>

            <button type="submit" class="bubble-pill-btn btn-mint full-width-btn publish-btn">
              🚀 Publish Resource to TeacherMom Website
            </button>
          </form>
        </div>

        <!-- Tab 2: Current Catalog -->
        <div class="admin-tab-content" id="catalogTab">
          <div class="admin-catalog-list" id="adminCatalogList"></div>
        </div>

        <!-- Tab 3: Reviews & Featured Testimonial Quote Picker -->
        <div class="admin-tab-content" id="reviewsTab">
          
          <div class="featured-quote-preview-banner">
            <span class="preview-tag">⭐ CURRENTLY FEATURED QUOTE ON HOMEPAGE:</span>
            <div id="adminFeaturedQuoteBox"></div>
          </div>

          <!-- Add Manual Review Form -->
          <details class="add-manual-review-details">
            <summary class="add-review-summary">+ Add a New Teacher Review Manually</summary>
            <form class="manual-review-form" id="manualReviewForm">
              <div class="form-row-2">
                <div class="form-field">
                  <label>Teacher / Mom Name: *</label>
                  <input type="text" id="manRevAuthor" placeholder="e.g. Mrs. Susan Botes" required />
                </div>
                <div class="form-field">
                  <label>Role & City / School: *</label>
                  <input type="text" id="manRevRole" placeholder="e.g. Grade 1 Educator, Durban" required />
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-field">
                  <label>Resource Reviewed:</label>
                  <select id="manRevRes">
                    ${s.map(m=>`<option value="${m.id}">${m.title}</option>`).join("")}
                  </select>
                </div>
                <div class="form-field">
                  <label>Star Rating: *</label>
                  <select id="manRevStars">
                    <option value="5" selected>★★★★★ (5 Stars)</option>
                    <option value="4">★★★★☆ (4 Stars)</option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <label>Review Quote: *</label>
                <textarea id="manRevText" rows="2" placeholder="Paste the feedback received on WhatsApp or email..." required></textarea>
              </div>

              <button type="submit" class="bubble-pill-btn btn-mint">Save Review & Add to List</button>
            </form>
          </details>

          <!-- List of Reviews -->
          <h5 class="all-reviews-heading">All Teacher Reviews (Pick which one appears on the site):</h5>
          <div class="admin-reviews-list" id="adminReviewsList"></div>

        </div>

        <!-- Tab 4: Users & VIP Mailing List -->
        <div class="admin-tab-content" id="usersTab">
          <div class="mailing-list-admin-top">
            <div class="mailing-stats-summary">
              <span class="m-stat-pill">👥 <strong>${o.length}</strong> Registered Accounts</span>
              <span class="m-stat-pill subscribed-pill">💌 <strong>${r.filter(m=>m.optedIn).length}</strong> Active Subscribers (Opted In)</span>
              <span class="m-stat-pill optedout-pill">🔕 <strong>${r.filter(m=>!m.optedIn).length}</strong> Opted Out</span>
            </div>
            <button class="bubble-pill-btn btn-mint copy-emails-btn" id="copySubscribersEmailsBtn">
              📋 Copy Active Emails
            </button>
          </div>

          <h5 class="all-reviews-heading">TeacherMom VIP Mailing List & Registered Accounts Directory:</h5>
          <div class="admin-users-list" id="adminUsersList"></div>
        </div>

      </div>
    `,e.querySelector("#adminLogoutBtn").addEventListener("click",()=>{l.pop(400),p.logoutAdmin(),this.renderLoginForm(e)}),e.querySelector("#saveWaBtn").addEventListener("click",()=>{const m=e.querySelector("#adminWaInput").value.trim(),b=p.getSettings();p.saveSettings({...b,whatsappNumber:m}),l.sparkle(),alert(`✅ WhatsApp Business number updated to: ${m}`)});const n=e.querySelectorAll(".admin-tab-btn"),c=e.querySelectorAll(".admin-tab-content");n.forEach(m=>{m.addEventListener("click",b=>{l.pop(500);const w=b.currentTarget.dataset.tab;n.forEach(C=>C.classList.remove("active")),c.forEach(C=>C.classList.remove("active")),b.currentTarget.classList.add("active");const E=e.querySelector(`#${w}`);E&&E.classList.add("active")})});const h=e.querySelector("#sampleImagesInput"),u=e.querySelector("#sampleImagesPreviewContainer");h.addEventListener("change",m=>{const b=Array.from(m.target.files);this.sampleImagesBase64=[],u.innerHTML="",b.forEach(w=>{const E=new FileReader;E.onload=C=>{const R=C.target.result;this.sampleImagesBase64.push(R);const T=document.createElement("div");T.className="sample-thumb-item",T.innerHTML=`<img src="${R}" alt="Sample preview" />`,u.appendChild(T)},E.readAsDataURL(w)})}),e.querySelector("#newResourceForm").addEventListener("submit",m=>{m.preventDefault(),l.win();const b=e.querySelector("#resGrade").value;let w="1st";b.includes("R")?w="pre-k":b.includes("2")?w="2nd":b.includes("3")&&(w="3rd");const E={title:e.querySelector("#resTitle").value.trim(),subtitle:e.querySelector("#resSubtitle").value.trim(),curriculum:e.querySelector("#resCurriculum").value,subject:e.querySelector("#resSubject").value,grade:b,gradeTag:w,term:e.querySelector("#resTerm").value,year:e.querySelector("#resYear").value.trim()||"2026",price:parseFloat(e.querySelector("#resPrice").value)||85,currency:"R",locked:!0,rating:5,reviews:1,description:e.querySelector("#resDesc").value.trim()||"Printable classroom and homeschool resource pack.",sampleImages:this.sampleImagesBase64.length>0?this.sampleImagesBase64:["https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80"]};p.addResource(E),this.onResourceAdded(E),alert(`🎉 Woohoo! "${E.title}" has been published to the TeacherMom website!`),this.renderDashboard(e)});const y=e.querySelector("#manualReviewForm");y&&y.addEventListener("submit",m=>{m.preventDefault(),l.sparkle();const b=e.querySelector("#manRevAuthor").value.trim(),w=e.querySelector("#manRevRole").value.trim(),E=e.querySelector("#manRevRes").value,C=s.find(I=>I.id===E),R=parseInt(e.querySelector("#manRevStars").value,10),T=e.querySelector("#manRevText").value.trim();p.addReview({resourceId:E,resourceTitle:C?C.title:"Educational Resource",author:b,role:w,rating:R,text:T,date:new Date().toISOString().split("T")[0]}),alert(`✅ Review from "${b}" added! You can now feature it on the website anytime.`),this.renderDashboard(e)}),this.renderCatalogList(e.querySelector("#adminCatalogList")),this.renderReviewsList(e),this.renderUsersList(e)}renderCatalogList(e){if(!e)return;const t=p.getResources();e.innerHTML=t.map(s=>`
      <div class="admin-catalog-row">
        <div class="cat-details">
          <span class="cat-title">${s.title}</span>
          <div class="cat-badges">
            <span class="c-badge cur">${s.curriculum||"CAPS"}</span>
            <span class="c-badge gr">${s.grade}</span>
            <span class="c-badge sub">${s.subject||"Subject"}</span>
            <span class="c-badge term">${s.term||"Term 1"} (${s.year||"2026"})</span>
            <span class="c-badge locked">🔒 Locked</span>
            <span class="c-badge rating">⭐ ${s.rating} (${s.reviews} ratings)</span>
            <strong class="c-price">${s.currency||"R"}${parseFloat(s.price).toFixed(2)}</strong>
          </div>
        </div>
        <button class="delete-res-btn" data-id="${s.id}" title="Remove resource">🗑️ Delete</button>
      </div>
    `).join(""),e.querySelectorAll(".delete-res-btn").forEach(s=>{s.addEventListener("click",a=>{const i=a.currentTarget.dataset.id;confirm("Are you sure you want to remove this resource from the catalog?")&&(l.pop(350),p.deleteResource(i),this.renderCatalogList(e))})})}renderReviewsList(e){const t=e.querySelector("#adminReviewsList"),s=e.querySelector("#adminFeaturedQuoteBox");if(!t||!s)return;const a=p.getReviews(),i=p.getFeaturedReview();i&&(s.innerHTML=`
        <div class="active-featured-quote-card">
          <div class="f-stars">★★★★★</div>
          <blockquote class="f-text">"${i.text}"</blockquote>
          <div class="f-author-row">
            <strong>${i.author}</strong> - <span>${i.role}</span>
          </div>
        </div>
      `),t.innerHTML=a.map(r=>{const o=r.featured===!0;return`
        <div class="admin-review-item ${o?"is-featured-border":""}">
          <div class="rev-item-top">
            <div class="rev-author-details">
              <strong>${r.author}</strong> (${r.role})
              <span class="rev-res-tag">Resource: ${r.resourceTitle||"Printable Pack"}</span>
              ${r.provider?`<span class="auth-provider-chip">✓ ${r.provider==="google"?"Google":"Member"}</span>`:""}
            </div>
            <div class="rev-stars-date">
              <span class="gold-stars">★`.repeat(r.rating)+`</span>
              <span class="rev-date">${r.date}</span>
            </div>
          </div>
          <p class="rev-item-text">"${r.text}"</p>
          <div class="rev-actions-bar">
            ${o?`
              <span class="featured-badge-live">✨ CURRENTLY DISPLAYED ON WEBSITE</span>
            `:`
              <button class="bubble-pill-btn btn-mint make-featured-btn" data-id="${r.id}">
                ⭐ Feature as Main Website Quote
              </button>
            `}
            <button class="delete-review-link" data-id="${r.id}">Delete</button>
          </div>
        </div>
      `}).join(""),t.querySelectorAll(".make-featured-btn").forEach(r=>{r.addEventListener("click",o=>{l.win();const n=o.currentTarget.dataset.id;p.setFeaturedReview(n),this.renderReviewsList(e),alert("🎉 Featured website quote updated! Check the About Us section to see it live.")})}),t.querySelectorAll(".delete-review-link").forEach(r=>{r.addEventListener("click",o=>{const n=o.currentTarget.dataset.id;confirm("Delete this review?")&&(l.pop(350),p.deleteReview(n),this.renderReviewsList(e))})})}renderUsersList(e){const t=e.querySelector("#adminUsersList"),s=e.querySelector("#copySubscribersEmailsBtn");if(!t)return;const a=p.getMailingList(),i=p.getUsers();s&&s.addEventListener("click",()=>{const n=a.filter(c=>c.optedIn).map(c=>c.email);if(n.length===0){alert("No active subscribers to copy.");return}navigator.clipboard.writeText(n.join(", ")).then(()=>{l.win(),alert(`📋 Copied ${n.length} subscriber email(s) to clipboard!`)}).catch(()=>{prompt("Active Subscriber Emails:",n.join(", "))})});const r=new Map;i.forEach(n=>{r.set(n.email.toLowerCase(),{name:n.name,email:n.email,role:n.role,provider:n.provider,optedIn:n.mailingList!==!1,date:n.createdAt?n.createdAt.split("T")[0]:"2026-03-01"})}),a.forEach(n=>{const c=n.email.toLowerCase();if(r.has(c)){const h=r.get(c);h.optedIn=n.optedIn===!0}else r.set(c,{name:n.name||"Newsletter Subscriber",email:n.email,role:n.role||"Educator / Parent",provider:"newsletter",optedIn:n.optedIn===!0,date:n.date||"2026-04-01"})});const o=Array.from(r.values());t.innerHTML=o.map(n=>`
      <div class="admin-user-row ${n.optedIn?"is-subscribed":"is-opted-out"}">
        <div class="user-row-meta">
          <div class="user-row-name-bar">
            <strong>${n.name}</strong>
            <span class="user-row-provider-tag">${n.provider==="google"?"Google Auth":n.provider==="custom"?"Custom Account":"Newsletter Signup"}</span>
          </div>
          <span class="user-row-email">${n.email}</span>
          <span class="user-row-role">🏫 ${n.role}</span>
        </div>
        <div class="user-row-status-box">
          <span class="mailing-badge ${n.optedIn?"badge-in":"badge-out"}">
            ${n.optedIn?"💌 Subscribed (Opted In)":"🔕 Opted Out"}
          </span>
          <button class="bubble-pill-btn btn-sm-toggle toggle-user-mail-btn" data-email="${n.email}" data-status="${n.optedIn}">
            ${n.optedIn?"Opt Out":"Opt In"}
          </button>
        </div>
      </div>
    `).join(""),t.querySelectorAll(".toggle-user-mail-btn").forEach(n=>{n.addEventListener("click",c=>{l.pop(500);const h=c.currentTarget.dataset.email,v=!(c.currentTarget.dataset.status==="true");p.setMailingListStatus(h,v),this.renderUsersList(e)})})}}document.addEventListener("DOMContentLoaded",()=>{const k=new Q,e=document.getElementById("soundToggleBtn"),t=document.getElementById("soundIcon"),s=e?e.querySelector(".btn-text"):null;e&&e.addEventListener("click",()=>{const d=l.toggle();t&&(t.textContent=d?"🔊":"🔇"),s&&(s.textContent=d?"Sound ON":"Sound OFF"),d&&l.pop(700)});const a=document.getElementById("wandToggleBtn");a&&a.addEventListener("click",()=>{const d=k.toggle();l.pop(500);const f=a.querySelector(".btn-text");f&&(f.textContent=d?"Wand Trail":"Default Cursor")});const i=document.getElementById("mascotContainer");let r=null;i&&(r=new z(i));const o=d=>{if(r&&(r.cheer(d),i)){const f=i.getBoundingClientRect();r.showerConfetti(f.left+f.width/2,f.top+f.height/3)}},n=new se({onMascotCheer:o}),c=new ie({onMascotCheer:o}),h=new ae({onMascotCheer:o,authModal:c}),u=new te({onMascotCheer:o,onProceedToOrder:d=>{n.open(d)}}),v=new Z({onBuyResource:d=>{n.open(d)},onRateResource:d=>{h.open(d)}}),y=new K("gradeCarouselContainer",{onBuyResource:d=>{n.open(d)},onAddToCart:d=>{u.addItem(d),o(`Added "${d.title}" to basket! 🎒`)},onOpenFlipbook:d=>{v.open(d)},onRateResource:d=>{h.open(d)}});new X({onSearch:d=>{y.filterByQuery(d)},onGradeSelect:d=>{y.filterByGrade(d)}}),new ee({onAddBundleToCart:d=>{u.addItem(d),o(`Custom bundle packed! You saved ${d.discountPercent}%! 🎉`)},onApplyCoupon:d=>{u.applyCoupon(d),u.openDrawer()},onMascotCheer:o}),new re({onResourceAdded:d=>{o(`Yay! New resource "${d.title}" is published! 🚀`)}});const m=()=>{const d=p.getStats(),f=document.getElementById("statHappyTeachers"),S=document.getElementById("statResourcesCount"),g=document.getElementById("statAverageRating");f&&(f.textContent=d.happyTeachers),S&&(S.textContent=d.resourcesCount),g&&(g.textContent=d.averageRating)},b=()=>{const d=p.getFeaturedReview();if(!d)return;const f=document.getElementById("featuredQuoteStars"),S=document.getElementById("featuredQuoteText"),g=document.getElementById("featuredQuoteAuthor"),x=document.getElementById("featuredQuoteRole"),L=document.getElementById("featuredQuoteAvatar");f&&(f.textContent="★".repeat(d.rating||5)),S&&(S.textContent=`"${d.text}"`),g&&(g.textContent=d.author),x&&(x.textContent=d.role),L&&(L.textContent=d.avatar||"👩‍🏫")},w=()=>{const d=document.getElementById("dynamicBestsellersRow");if(!d)return;const f=p.getBestsellers(3),S=["#1 Best Pick ⭐","Math Winner 🔥","Classroom Hit 💛"];d.innerHTML=f.map((g,x)=>{const F=`${g.currency||"R"}${parseFloat(g.price).toFixed(2)}`,A=S[x]||"Bestseller ✨",j=g.sampleImages&&g.sampleImages.length>0;return`
        <div class="bestseller-highlight-card" data-id="${g.id}">
          <div class="bs-badge">${A}</div>
          <div class="bs-icon-box" style="background:${g.colorTheme||"#FFE5EC"}">
            ${j?`
              <img src="${g.sampleImages[0]}" alt="${g.title}" class="bs-thumb-img" />
            `:`
              <span class="bs-emoji">${g.faceType==="backpack"?"🎒":g.faceType==="sticky-smile"?"⭐":"✏️"}</span>
            `}
          </div>
          <div class="bs-meta-badges">
            <span class="c-badge cur">${g.curriculum||"CAPS"}</span>
            <span class="c-badge gr">${g.grade}</span>
            <span class="c-badge sub">${g.subject||"All Subjects"}</span>
            <span class="c-badge term">${g.term||"Term 1"} (${g.year||"2026"})</span>
            <span class="c-badge locked">🔒 Locked</span>
          </div>
          <h3>${g.title}</h3>
          <p>${g.subtitle||g.description||""}</p>
          <div class="bs-stars-row">
            <div class="bs-stars">★★★★★ <span>(${g.rating} • ${g.reviews} reviews)</span></div>
            <button class="rate-trigger-pill bs-rate-pill" data-id="${g.id}" title="Rate this bestseller">⭐ Rate</button>
          </div>
          <div class="bs-price-row">
            <span class="price-val">${F}</span>
            <span class="sample-only-pill">Samples Only 👁️</span>
          </div>
          <div class="bs-actions">
            <button class="quick-flip-bestseller-btn" data-id="${g.id}">📖 Samples</button>
            <button class="bubble-pill-btn btn-mint quick-add-bestseller-btn" data-id="${g.id}">🛒 Buy Now</button>
          </div>
        </div>
      `}).join(""),d.querySelectorAll(".quick-flip-bestseller-btn").forEach(g=>{g.addEventListener("click",x=>{const L=x.currentTarget.dataset.id,F=p.getResources().find(A=>A.id===L);F&&(l.pageTurn(),v.open(F))})}),d.querySelectorAll(".quick-add-bestseller-btn").forEach(g=>{g.addEventListener("click",x=>{const L=x.currentTarget.dataset.id,F=p.getResources().find(A=>A.id===L);F&&n.open(F)})}),d.querySelectorAll(".bs-rate-pill").forEach(g=>{g.addEventListener("click",x=>{const L=x.currentTarget.dataset.id,F=p.getResources().find(A=>A.id===L);F&&(l.pop(650),h.open(F))})})},E=()=>{const d=document.getElementById("userAuthBtn"),f=document.getElementById("userAuthIcon"),S=document.getElementById("userAuthLabel");if(!d)return;const g=p.getCurrentUser();if(g){d.classList.add("logged-in"),f&&(f.textContent=g.avatar||"👩‍🏫");const x=g.name.split(" ")[0]||"My Account";S&&(S.textContent=x),d.title=`Signed in as ${g.name} (${g.email}) - Click to manage account`}else d.classList.remove("logged-in"),f&&(f.textContent="👤"),S&&(S.textContent="Sign In"),d.title="Sign In or Register with Google/Email"},C=document.getElementById("userAuthBtn");C&&C.addEventListener("click",()=>{l.pop(500),c.open()});const R=document.getElementById("footerNewsletterForm"),T=document.getElementById("footerNewsletterEmail"),I=document.getElementById("newsletterStatusPill"),$=()=>{if(!I)return;const d=p.getCurrentUser();if(d&&d.email){const f=p.isSubscribed(d.email);I.style.display="flex",I.innerHTML=`
        <span class="status-indicator-text">
          ${f?"💌 VIP Club: <strong>Subscribed</strong>":"🔕 VIP Club: <strong>Opted Out</strong>"}
          (${d.email})
        </span>
        <button type="button" class="opt-toggle-link-btn" id="footerOptToggleBtn">
          ${f?"Opt Out":"Opt In"}
        </button>
      `;const S=I.querySelector("#footerOptToggleBtn");S&&S.addEventListener("click",()=>{l.sparkle();const g=!f;p.setMailingListStatus(d.email,g,{name:d.name,role:d.role}),g?(o("Subscribed to the Morning Club! 💌"),alert("🎉 You're opted into the TeacherMom VIP Mailing List!")):alert("👋 You have opted out of the mailing list."),$()})}else I.style.display="none"};R&&T&&R.addEventListener("submit",d=>{d.preventDefault();const f=T.value.trim();f&&(l.win(),p.setMailingListStatus(f,!0),o("Welcome to the Morning Club! 💌"),T.value="",alert(`🎉 Hooray! ${f} has been added to the TeacherMom VIP Mailing List! Check your inbox for your free starter printable!`),$())}),m(),b(),w(),E(),$(),p.subscribe(()=>{m(),b(),w(),E(),$()});const q=document.getElementById("exploreResourcesBtn");q&&q.addEventListener("click",()=>{l.pop(680)}),document.querySelectorAll(".nav-pill").forEach(d=>{d.addEventListener("click",()=>{l.pop(540),document.querySelectorAll(".nav-pill").forEach(f=>f.classList.remove("active")),d.classList.add("active")})})});
