const fs = require('fs');

let html = fs.readFileSync('public/index.html', 'utf8');

// 1. Add Mobile Styles in Head
html = html.replace(
  '<link rel="stylesheet" href="styles.css">',
  `<link rel="stylesheet" href="styles.css">\n  <style>\n    @media (max-width: 768px) {\n      .nav-links, .nav-actions { display: none !important; }\n      .hamburger-menu { display: block !important; font-size: 32px; color: white; padding: 10px; }\n      .nav-brand img { height: 40px !important; }\n      .nav-brand { margin: 0 !important; padding: 10px !important; box-shadow: none !important; background: transparent !important; }\n      .hero-title { font-size: clamp(32px, 8vw, 60px) !important; line-height: 1.2 !important; margin-bottom: 20px !important; }\n      .hero-desc { font-size: clamp(14px, 4vw, 16px) !important; margin-bottom: 30px !important; }\n      .btn, .arrow-btn, a { min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; justify-content: center; }\n      .container { padding: 0 20px !important; }\n      .stats-grid, .tp-grid, .dashboard-grid, .analytics-grid, .insights-grid { grid-template-columns: 1fr !important; gap: 30px !important; }\n      .tp-image-container { height: 300px !important; }\n      .soil-analysis { height: auto !important; padding: 60px 0 !important; }\n      .footer-grid { grid-template-columns: 1fr !important; gap: 30px !important; }\n      body { overflow-x: hidden; }\n    }\n    .hamburger-menu { display: none; cursor: pointer; }\n    .mobile-nav-overlay {\n      position: fixed; top: 0; right: -100%; width: 100%; height: 100%;\n      background: rgba(0,0,0,0.95); z-index: 2000;\n      display: flex; flex-direction: column; justify-content: center; align-items: center;\n      transition: right 400ms ease-in-out;\n    }\n    .mobile-nav-overlay.open { right: 0; }\n    .mobile-nav-overlay .close-btn {\n      position: absolute; top: 30px; right: 30px; font-size: 40px; color: white; cursor: pointer; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;\n    }\n    .mobile-nav-overlay ul { list-style: none; text-align: center; padding: 0; }\n    .mobile-nav-overlay li { margin: 25px 0; }\n    .mobile-nav-overlay a { color: white; font-size: 24px; text-decoration: none; font-weight: 500; }\n  </style>`
);

// 2. Add touch-action to sticky container and opacity transition to canvas
html = html.replace(
  '<div id="hero-sticky" style="position: sticky; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; background: #000;">',
  '<div id="hero-sticky" style="position: sticky; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; background: #000; touch-action: pan-y;">'
);
html = html.replace(
  '<canvas id="hero-canvas" style="width: 100%; height: 100%; object-fit: cover; display: block;"></canvas>',
  '<canvas id="hero-canvas" style="width: 100%; height: 100%; object-fit: cover; display: block; transition: opacity 0.6s ease-in-out;"></canvas>'
);

// 3. Move original hero wrapper inside the sticky container right after overlay
html = html.replace(
  '      <div id="hero-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; transition: background 0.1s, box-shadow 0.1s;"></div>',
  `      <!-- Overlay Effects -->
      <div id="hero-overlay" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; transition: background 0.1s, box-shadow 0.1s;"></div>

      <!-- Original Hero Wrapper (Now inside sticky for crossfade) -->
      <div id="original-hero-wrapper" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 0.6s ease-in-out; pointer-events: none;">
        <!-- Hero Section -->
        <section class="hero" style="width: 100%; height: 100%; margin: 0; padding-top: 80px;">
          <div class="hero-bg"></div>
          <div class="hero-overlay"></div>

          <div class="container fade-in">
            <div class="hero-content">
              <h1 class="hero-title" id="animated-hero-title">Smart solutions for Sustainable future</h1>
              <p class="hero-desc">We lead industrial and desert greening initiatives with a focus on long-term impact and
                smart digital integration.<br><br>Integrated Agribusiness | Plantation Development | Environmental Management
              </p>
              <div class="hero-buttons">
                <a href="#" class="btn btn-outline-white">Explore</a>
                <a href="#" class="btn btn-white">Contact Us</a>
              </div>
            </div>
          </div>

          <div class="hero-slider-indicator">
            <div class="slider-line"></div>
            <span>1/3</span>
          </div>
        </section>
      </div>`
);

// 4. Remove old original hero wrapper at the bottom
const oldHeroRegex = /<div id="original-hero-wrapper" style="position: relative;">[\s\S]*?<\/div>\s*<\/section>\s*<\/div>/;
html = html.replace(oldHeroRegex, '');

// 5. Replace script
const newScript = `      <script>
        document.addEventListener("DOMContentLoaded", () => {
          const preloader = document.getElementById("preloader");
          const progressText = document.getElementById("loading-progress");
          
          let counterValue = 1;
          const duration = 3000; 
          const startTime = performance.now();
          const easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
          
          let counterDone = false;
          let allFramesLoaded = false;
          let framesLoaded = 0;
          const totalFrames = 65;

          const checkStartAnimation = () => {
            if (counterDone && allFramesLoaded) {
              preloader.style.opacity = "0";
              setTimeout(() => preloader.style.display = "none", 500);
              if (typeof initAnimation === "function") initAnimation();
            }
          };

          const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeInOutCubic(progress);
            counterValue = Math.floor(1 + (eased * 99));
            if (progressText) progressText.innerText = counterValue;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counterDone = true;
              checkStartAnimation();
            }
          };
          requestAnimationFrame(updateCounter);

          const canvas = document.getElementById("hero-canvas");
          const ctx = canvas.getContext("2d", { alpha: false });
          const overlay = document.getElementById("hero-overlay");
          const scrollContainer = document.getElementById("hero-scroll-container");
          const originalNavWrapper = document.getElementById("original-nav-wrapper");
          const originalHeroWrapper = document.getElementById("original-hero-wrapper");
          
          const frames = [];
          
          const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(currentFrameIndex);
          };
          window.addEventListener("resize", resize);
          window.addEventListener("orientationchange", () => setTimeout(resize, 100));

          const batchSize = 10;
          const loadBatch = (batchIndex) => {
            const start = batchIndex * batchSize + 1;
            const end = Math.min((batchIndex + 1) * batchSize, totalFrames);
            let loadedInBatch = 0;

            for (let i = start; i <= end; i++) {
              const img = new Image();
              img.src = \`/frames/ezgif-frame-\${String(i).padStart(3, '0')}.png\`;
              
              img.onload = async () => {
                try { if (img.decode) await img.decode(); } catch (e) {}
                frames[i] = img;
                framesLoaded++;
                loadedInBatch++;
                
                if (loadedInBatch === (end - start + 1)) {
                  if (end < totalFrames) loadBatch(batchIndex + 1);
                }
                if (framesLoaded === totalFrames) {
                  allFramesLoaded = true;
                  checkStartAnimation();
                }
              };
            }
          };
          loadBatch(0);

          let currentFrameIndex = 1;
          let targetFrameIndex = 1;
          
          const render = (index) => {
            if (!frames[Math.round(index)]) return;
            const img = frames[Math.round(index)];
            
            const canvasRatio = canvas.width / canvas.height;
            const imgRatio = img.width / img.height;
            let drawWidth = canvas.width, drawHeight = canvas.height, offsetX = 0, offsetY = 0;

            if (canvasRatio > imgRatio) {
              drawHeight = canvas.width / imgRatio;
              offsetY = (canvas.height - drawHeight) / 2;
            } else {
              drawWidth = canvas.height * imgRatio;
              offsetX = (canvas.width - drawWidth) / 2;
            }

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            const idx = Math.round(index);
            let boxShadow = "", bgColor = "rgba(0,0,0,0)";

            if (idx >= 1 && idx <= 15) {
              const opacity = 1 - (idx / 15);
              boxShadow = \`inset 0 0 100px rgba(0,0,0,\${opacity * 0.8})\`;
            } else if (idx >= 25 && idx <= 35) {
              const progress = 1 - Math.abs(idx - 30) / 5; 
              bgColor = \`rgba(0,0,0,\${progress * 0.4})\`;
            }
            
            overlay.style.boxShadow = boxShadow;
            overlay.style.background = bgColor;
          };

          // Text Pop Animation Setup
          const titleEl = document.getElementById("animated-hero-title");
          if (titleEl) {
            const words = titleEl.innerText.trim().split(' ');
            titleEl.innerHTML = '';
            window.wordSpans = words.map(word => {
              const span = document.createElement('span');
              span.innerText = word + ' ';
              span.style.display = 'inline-block';
              span.style.opacity = '0';
              span.style.transform = 'translateY(60px)';
              span.style.transition = 'opacity 900ms cubic-bezier(0.16, 1, 0.3, 1), transform 900ms cubic-bezier(0.16, 1, 0.3, 1)';
              titleEl.appendChild(span);
              return span;
            });
          }
          let textAnimated = false;

          // Unified input handler
          let virtualScroll = 0;
          let touchStartY = 0;

          const updateVirtualScroll = (delta) => {
             const maxVirtual = scrollContainer.offsetHeight - window.innerHeight;
             virtualScroll += delta;
             virtualScroll = Math.max(0, Math.min(maxVirtual, virtualScroll));
          };

          window.addEventListener('wheel', (e) => {
             updateVirtualScroll(e.deltaY);
          }, { passive: true });

          window.addEventListener('touchstart', (e) => {
             touchStartY = e.touches[0].clientY;
          }, { passive: true });

          window.addEventListener('touchmove', (e) => {
             const y = e.touches[0].clientY;
             const delta = touchStartY - y;
             touchStartY = y;
             updateVirtualScroll(delta);
          }, { passive: true });

          window.initAnimation = () => {
            resize();
            const lerp = (start, end, factor) => start + (end - start) * factor;

            const loop = () => {
              const rect = scrollContainer.getBoundingClientRect();
              const nativeScroll = -rect.top;
              
              const maxVirtual = scrollContainer.offsetHeight - window.innerHeight;
              if (Math.abs(nativeScroll - virtualScroll) > 50) {
                 virtualScroll = Math.max(0, Math.min(maxVirtual, nativeScroll));
              }

              const clampedProgress = Math.max(0, Math.min(1, virtualScroll / maxVirtual));
              
              targetFrameIndex = 1 + clampedProgress * (totalFrames - 1);
              currentFrameIndex = lerp(currentFrameIndex, targetFrameIndex, 0.08);

              render(currentFrameIndex);
              
              if (clampedProgress >= 0.99) {
                canvas.style.opacity = "0";
                originalHeroWrapper.style.opacity = "1";
                originalHeroWrapper.style.pointerEvents = "auto";

                if (originalNavWrapper) {
                  originalNavWrapper.style.transform = "translateY(0)";
                  originalNavWrapper.style.opacity = "1";
                  originalNavWrapper.style.visibility = "visible";
                  originalNavWrapper.style.pointerEvents = "auto";
                }

                if (!textAnimated && window.wordSpans) {
                  textAnimated = true;
                  setTimeout(() => {
                    window.wordSpans.forEach((span, index) => {
                      setTimeout(() => {
                        span.style.opacity = '1';
                        span.style.transform = 'translateY(0)';
                      }, index * 120);
                    });
                  }, 600);
                }
              } else {
                canvas.style.opacity = "1";
                originalHeroWrapper.style.opacity = "0";
                originalHeroWrapper.style.pointerEvents = "none";

                if (originalNavWrapper) {
                  originalNavWrapper.style.transform = "translateY(-100%)";
                  originalNavWrapper.style.opacity = "0";
                  originalNavWrapper.style.visibility = "hidden";
                  originalNavWrapper.style.pointerEvents = "none";
                }
              }

              requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
          };
        });
      </script>`;

const scriptRegex = /<script>[\s\S]*?<\/script>/;
html = html.replace(scriptRegex, newScript);

// 6. Fix nav wrapper styles and add mobile menu
html = html.replace(
  '<div id="original-nav-wrapper" style="position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none;">',
  '<div id="original-nav-wrapper" style="position: fixed; top: 0; left: 0; width: 100%; z-index: 1000; transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s, visibility 0.6s; pointer-events: none; opacity: 0; visibility: hidden;">'
);
html = html.replace(
  '        <div class="nav-actions">',
  '        <div class="hamburger-menu" onclick="document.getElementById(\\'mobile-menu\\').classList.add(\\'open\\')">☰</div>\n        <div class="nav-actions">'
);
html = html.replace(
  '  <div id="original-hero-wrapper"',
  `  <div id="mobile-menu" class="mobile-nav-overlay">\n    <div class="close-btn" onclick="document.getElementById('mobile-menu').classList.remove('open')">×</div>\n    <ul>\n      <li><a href="#" onclick="document.getElementById('mobile-menu').classList.remove('open')">About Us</a></li>\n      <li><a href="#" onclick="document.getElementById('mobile-menu').classList.remove('open')">Our Team</a></li>\n      <li><a href="#" onclick="document.getElementById('mobile-menu').classList.remove('open')">Services</a></li>\n      <li><a href="#" onclick="document.getElementById('mobile-menu').classList.remove('open')">Our Clients</a></li>\n      <li><a href="#" onclick="document.getElementById('mobile-menu').classList.remove('open')">Gallery</a></li>\n      <li><a href="#" onclick="document.getElementById('mobile-menu').classList.remove('open')">Contact</a></li>\n    </ul>\n  </div>\n\n  <div id="original-hero-wrapper"`
);

fs.writeFileSync('public/index.html', html);
console.log("Successfully applied fixes via script.");
