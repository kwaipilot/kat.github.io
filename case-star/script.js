class StarfieldEngine {
    constructor() {
        this.stars = [];
        this.meteors = [];
        this.particles = [];
        this.planets = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.interactionCount = 0;
        this.currentTheme = 'classic';
        this.audioEnabled = true;
        this.solarSystemVisible = true;
        this.orbitSpeed = 1; // 默认转速倍数
        
        this.planetData = {
            mercury: { name: '☿️ Mercury', color: '#8c7853', size: 12, distance: 75, speed: 8 },
            venus: { name: '♀️ Venus', color: '#ffc649', size: 16, distance: 100, speed: 12 },
            earth: { name: '🌍 Earth', color: '#6b93d6', size: 20, distance: 130, speed: 16 },
            mars: { name: '♂️ Mars', color: '#cd5c5c', size: 18, distance: 160, speed: 24 },
            jupiter: { name: '♃ Jupiter', color: '#d8ca9d', size: 40, distance: 225, speed: 36 },
            saturn: { name: '♄ Saturn', color: '#fab76e', size: 36, distance: 275, speed: 48 },
            uranus: { name: '♅ Uranus', color: '#4fd0e7', size: 28, distance: 325, speed: 60 },
            neptune: { name: '♆ Neptune', color: '#4b70dd', size: 26, distance: 375, speed: 72 }
        };
        
        this.init();
    }
    
    init() {
        this.createStarfield();
        this.createSolarSystem();
        this.setupEventListeners();
        this.startAnimationLoop();
        this.startCounters();
        this.createMeteorShower();
    }
    
    createStarfield() {
        const starfield = document.getElementById('starfield');
        const numStars = 200;
        
        // 清除现有星体
        const existingStars = starfield.querySelectorAll('.star');
        existingStars.forEach(star => star.remove());
        
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = Math.random() * 3 + 1 + 'px';
            star.style.height = star.style.width;
            star.style.animationDelay = Math.random() * 2 + 's';
            star.style.animationDuration = (Math.random() * 3 + 1) + 's';
            
            starfield.appendChild(star);
            this.stars.push(star);
        }
    }
    
    createSolarSystem() {
        const solarSystem = document.getElementById('solar-system');
        solarSystem.innerHTML = '';
        
        // Create Sun
        const sun = document.createElement('div');
        sun.className = 'sun';
        sun.setAttribute('data-planet', 'sun');
        sun.title = '☀️ Sun - The center of our solar system';
        solarSystem.appendChild(sun);
        
        // Create planets with orbits
        Object.keys(this.planetData).forEach(planetKey => {
            const planetInfo = this.planetData[planetKey];
            
            // Create orbit
            const orbit = document.createElement('div');
            orbit.className = `orbit ${planetKey}-orbit`;
            
            // Create planet
            const planet = document.createElement('div');
            planet.className = `planet ${planetKey}`;
            planet.setAttribute('data-planet', planetKey);
            planet.title = planetInfo.name;
            
            orbit.appendChild(planet);
            solarSystem.appendChild(orbit);
            
            this.planets.push({
                element: planet,
                orbit: orbit,
                name: planetKey,
                data: planetInfo
            });
        });
    }
    
    createMeteorShower() {
        setInterval(() => {
            if (Math.random() < 0.3) {
                this.createMeteor();
            }
        }, 2000);
    }
    
    createMeteor() {
        const starfield = document.getElementById('starfield');
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        meteor.style.left = Math.random() * 100 + '%';
        meteor.style.top = '0px';
        meteor.style.animationDuration = (Math.random() * 2 + 1) + 's';
        
        starfield.appendChild(meteor);
        
        setTimeout(() => {
            if (meteor.parentNode) {
                meteor.remove();
            }
        }, 3000);
    }
    
    setupEventListeners() {
        // 鼠标移动轨迹
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.updateMouseTrail(e.clientX, e.clientY);
            this.createMouseParticles(e.clientX, e.clientY);
        });
        
        // 鼠标点击效果
        document.addEventListener('click', (e) => {
            this.createExplosion(e.clientX, e.clientY);
            this.incrementInteraction();
            this.playClickSound();
        });
        
        // 主题切换按钮
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTheme(e.target.dataset.theme);
                this.updateActiveButton(e.target);
            });
        });
        
        // 动作按钮
        document.getElementById('explode-btn').addEventListener('click', () => {
            this.createGlobalExplosion();
        });
        
        document.getElementById('wormhole-btn').addEventListener('click', () => {
            this.createWormhole();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetUniverse();
        });
        
        // 音效控制
        document.getElementById('audio-toggle').addEventListener('click', () => {
            this.toggleAudio();
        });
        
        // 技术图标悬停效果
        document.querySelectorAll('.tech-icon').forEach(icon => {
            icon.addEventListener('mouseenter', () => {
                this.createTechParticles(icon);
            });
        });
        
        // 卡片交互
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.enhanceCard(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCard(card);
            });
        });
        
        // 行星控制按钮
        document.querySelectorAll('.planet-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.controlPlanets(e.target.dataset.planet);
                this.updateActivePlanetButton(e.target);
            });
        });
        
        // 转速控制按钮
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const speed = parseFloat(e.target.dataset.speed);
                this.setOrbitSpeed(speed);
                this.updateActiveSpeedButton(e.target);
            });
        });
        
        // 行星点击事件
        this.setupPlanetInteractions();
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
    }
    
    updateMouseTrail(x, y) {
        const trail = document.getElementById('mouse-trail');
        trail.style.left = (x - 10) + 'px';
        trail.style.top = (y - 10) + 'px';
        
        // 添加轨迹粒子
        if (Math.random() < 0.3) {
            this.createTrailParticle(x, y);
        }
    }
    
    createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = '#00ffff';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9998';
        particle.style.animation = 'trail-fade 1s ease-out forwards';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 1000);
    }
    
    createMouseParticles(x, y) {
        if (Math.random() < 0.1) {
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.style.position = 'fixed';
                particle.style.left = (x + Math.random() * 20 - 10) + 'px';
                particle.style.top = (y + Math.random() * 20 - 10) + 'px';
                particle.style.width = '2px';
                particle.style.height = '2px';
                particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
                particle.style.borderRadius = '50%';
                particle.style.pointerEvents = 'none';
                particle.style.zIndex = '9997';
                particle.style.animation = 'mouse-particle 0.5s ease-out forwards';
                
                document.body.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.remove();
                    }
                }, 500);
            }
        }
    }
    
    createExplosion(x, y) {
        const container = document.getElementById('explosion-container');
        const numParticles = 20;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'explosion-particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            
            const angle = (i / numParticles) * Math.PI * 2;
            const distance = Math.random() * 100 + 50;
            const finalX = x + Math.cos(angle) * distance;
            const finalY = y + Math.sin(angle) * distance;
            
            particle.style.setProperty('--final-x', finalX + 'px');
            particle.style.setProperty('--final-y', finalY + 'px');
            
            particle.style.animation = `explode-move 1s ease-out forwards`;
            
            container.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }
    }
    
    createGlobalExplosion() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                this.createExplosion(x, y);
            }, i * 100);
        }
        
        // 震动效果
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }
    
    createWormhole() {
        const wormhole = document.createElement('div');
        wormhole.className = 'wormhole';
        document.body.appendChild(wormhole);
        
        // 扭曲星体
        this.stars.forEach((star, index) => {
            setTimeout(() => {
                star.style.animation = 'star-warp 2s ease-in-out';
            }, index * 10);
        });
        
        setTimeout(() => {
            if (wormhole.parentNode) {
                wormhole.remove();
            }
            // 恢复星体
            this.stars.forEach(star => {
                star.style.animation = 'twinkle 2s infinite';
            });
        }, 2000);
    }
    
    setupPlanetInteractions() {
        // Add event listeners after DOM is updated
        setTimeout(() => {
            document.querySelectorAll('.planet, .sun').forEach(planet => {
                planet.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.createPlanetExplosion(planet);
                    this.showPlanetInfo(planet);
                    this.incrementInteraction();
                });
                
                planet.addEventListener('mouseenter', () => {
                    this.createPlanetAura(planet);
                });
            });
        }, 100);
    }
    
    createPlanetExplosion(planet) {
        const rect = planet.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Create planet-specific colored explosion
        const planetType = planet.getAttribute('data-planet');
        const planetData = this.planetData[planetType];
        const color = planetData ? planetData.color : '#ffffff';
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '6px';
            particle.style.height = '6px';
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            const angle = (i / 15) * Math.PI * 2;
            const distance = Math.random() * 80 + 40;
            const finalX = centerX + Math.cos(angle) * distance;
            const finalY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${finalX - centerX}px, ${finalY - centerY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 1000,
                easing: 'ease-out'
            });
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 1000);
        }
    }
    
    createPlanetAura(planet) {
        const planetType = planet.getAttribute('data-planet');
        const planetData = this.planetData[planetType];
        const color = planetData ? planetData.color : '#ffffff';
        
        const aura = document.createElement('div');
        aura.style.position = 'absolute';
        aura.style.top = '50%';
        aura.style.left = '50%';
        aura.style.width = '150%';
        aura.style.height = '150%';
        aura.style.background = `radial-gradient(circle, ${color}20 0%, transparent 70%)`;
        aura.style.borderRadius = '50%';
        aura.style.transform = 'translate(-50%, -50%)';
        aura.style.pointerEvents = 'none';
        aura.style.animation = 'aura-pulse 1s ease-in-out infinite alternate';
        
        planet.appendChild(aura);
        
        setTimeout(() => {
            if (aura.parentNode) {
                aura.remove();
            }
        }, 2000);
    }
    
    showPlanetInfo(planet) {
        const planetType = planet.getAttribute('data-planet');
        const planetData = this.planetData[planetType];
        
        if (!planetData && planetType !== 'sun') return;
        
        const info = document.createElement('div');
        info.style.position = 'fixed';
        info.style.top = '20px';
        info.style.right = '20px';
        info.style.background = 'rgba(0, 0, 0, 0.9)';
        info.style.color = '#fff';
        info.style.padding = '1rem';
        info.style.borderRadius = '10px';
        info.style.backdropFilter = 'blur(10px)';
        info.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        info.style.zIndex = '10000';
        info.style.maxWidth = '250px';
        info.style.animation = 'fade-in 0.3s ease';
        
        if (planetType === 'sun') {
            info.innerHTML = `
                <h4>☀️ Sun</h4>
                <p>🌡️ Surface: 5,778K</p>
                <p>📏 Diameter: 1.39M km</p>
                <p>⚡ Energy: Nuclear Fusion</p>
                <p>🌍 Distance: Center of System</p>
            `;
        } else {
            const facts = this.getPlanetFacts(planetType);
            info.innerHTML = `
                <h4>${planetData.name}</h4>
                <p>🎨 Color: ${planetData.color}</p>
                <p>📏 Size: ${planetData.size}px</p>
                <p>🚀 Orbit Speed: ${planetData.speed}s</p>
                <p>${facts}</p>
            `;
        }
        
        document.body.appendChild(info);
        
        setTimeout(() => {
            if (info.parentNode) {
                info.remove();
            }
        }, 4000);
    }
    
    getPlanetFacts(planetType) {
        const facts = {
            mercury: '🔥 Closest to Sun, extreme temperatures',
            venus: '☁️ Hottest planet, thick atmosphere',
            earth: '🌍 Our home, perfect for life',
            mars: '🔴 Red planet, has polar ice caps',
            jupiter: '🌪️ Largest planet, Great Red Spot',
            saturn: '💍 Beautiful rings, low density',
            uranus: '❄️ Ice giant, rotates on its side',
            neptune: '💨 Windiest planet, deep blue color'
        };
        return facts[planetType] || '🌌 Mysterious celestial body';
    }
    
    controlPlanets(type) {
        const solarSystem = document.getElementById('solar-system');
        const orbits = solarSystem.querySelectorAll('.orbit');
        
        orbits.forEach(orbit => {
            const planet = orbit.querySelector('.planet');
            const planetType = planet.getAttribute('data-planet');
            
            switch(type) {
                case 'all':
                    orbit.style.display = 'block';
                    break;
                case 'inner':
                    const innerPlanets = ['mercury', 'venus', 'earth', 'mars'];
                    orbit.style.display = innerPlanets.includes(planetType) ? 'block' : 'none';
                    break;
                case 'outer':
                    const outerPlanets = ['jupiter', 'saturn', 'uranus', 'neptune'];
                    orbit.style.display = outerPlanets.includes(planetType) ? 'block' : 'none';
                    break;
            }
        });
    }
    
    updateActivePlanetButton(activeBtn) {
        document.querySelectorAll('.planet-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    setOrbitSpeed(speed) {
        this.orbitSpeed = speed;
        
        // 更新所有轨道的动画速度
        const orbits = document.querySelectorAll('.orbit');
        orbits.forEach(orbit => {
            const planet = orbit.querySelector('.planet');
            const planetType = planet.getAttribute('data-planet');
            const originalSpeed = this.planetData[planetType].speed;
            const newDuration = originalSpeed / speed;
            
            orbit.style.animationDuration = newDuration + 's';
        });
        
        // 创建速度变化的视觉反馈
        this.createSpeedChangeEffect(speed);
        
        // 超高速时添加屏幕震动
        if (speed >= 16) {
            this.createScreenShake();
        }
        
        // 极速时添加时空扭曲效果
        if (speed >= 32) {
            this.createTimeWarpEffect();
        }
        
        // 播放音效
        this.playSpeedChangeSound(speed);
    }
    
    updateActiveSpeedButton(activeBtn) {
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    createSpeedChangeEffect(speed) {
        // 创建速度变化的粒子效果
        const solarSystem = document.getElementById('solar-system');
        const rect = solarSystem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 根据速度选择颜色和粒子数量
        let color = '#ffeb3b';
        let particleCount = 20;
        if (speed < 1) {
            color = '#4fc3f7'; // 慢速用蓝色
            particleCount = 15;
        } else if (speed >= 8) {
            color = '#ff0080'; // 超高速用紫红色
            particleCount = 50;
        } else if (speed >= 4) {
            color = '#ff5722'; // 高速用红色
            particleCount = 30;
        }
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = color;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            particle.style.boxShadow = `0 0 10px ${color}`;
            
            const angle = (i / particleCount) * Math.PI * 2;
            let distance = 100 + Math.random() * 50;
            let duration = 800;
            
            // 超高速时增加粒子距离和速度
            if (speed >= 16) {
                distance = 200 + Math.random() * 100;
                duration = 1200;
            } else if (speed >= 8) {
                distance = 150 + Math.random() * 75;
                duration = 1000;
            }
            
            const finalX = centerX + Math.cos(angle) * distance;
            const finalY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { 
                    transform: 'translate(0, 0) scale(1)', 
                    opacity: 1 
                },
                { 
                    transform: `translate(${finalX - centerX}px, ${finalY - centerY}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: duration,
                easing: 'ease-out'
            });
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 800);
        }
        
        // 显示速度变化提示
        this.showSpeedNotification(speed);
    }
    
    showSpeedNotification(speed) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.background = 'rgba(0, 0, 0, 0.9)';
        notification.style.color = '#ffeb3b';
        notification.style.padding = '1rem 2rem';
        notification.style.borderRadius = '20px';
        notification.style.fontSize = '1.5rem';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '10001';
        notification.style.backdropFilter = 'blur(10px)';
        notification.style.border = '2px solid #ffeb3b';
        notification.style.boxShadow = '0 0 30px rgba(255, 235, 59, 0.5)';
        notification.style.animation = 'speed-notification 2s ease-out forwards';
        
        let speedText = '';
        let emoji = '';
        if (speed === 0.25) { speedText = 'Ultra Slow'; emoji = '🐌'; }
        else if (speed === 0.5) { speedText = 'Slow Motion'; emoji = '🚶'; }
        else if (speed === 1) { speedText = 'Normal Speed'; emoji = '▶️'; }
        else if (speed === 2) { speedText = 'Fast Forward'; emoji = '🏃'; }
        else if (speed === 4) { speedText = 'Hyper Speed'; emoji = '🚀'; }
        else if (speed === 8) { speedText = 'Lightning Fast'; emoji = '⚡'; }
        else if (speed === 16) { speedText = 'Warp Speed'; emoji = '💫'; }
        else if (speed === 32) { speedText = 'Time Storm'; emoji = '🌪️'; }
        
        notification.innerHTML = `${emoji} ${speedText} ${speed}x`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 2000);
    }
    
    playSpeedChangeSound(speed) {
        if (this.audioEnabled) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                // 根据速度调整音调
                let frequency = 440;
                if (speed < 1) frequency = 220; // 低音
                else if (speed >= 16) frequency = 1760; // 超高音
                else if (speed >= 8) frequency = 1320; // 很高音
                else if (speed >= 4) frequency = 880; // 高音
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.5, audioContext.currentTime + 0.2);
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }
    
    resetUniverse() {
        // 淡出效果
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            // 重置所有状态
            this.interactionCount = 0;
            this.orbitSpeed = 1;
            this.updateCounters();
            this.createStarfield();
            this.createSolarSystem();
            this.setupPlanetInteractions();
            this.switchTheme('classic');
            
            // 重置按钮状态
            document.querySelectorAll('.speed-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.speed === '1') {
                    btn.classList.add('active');
                }
            });
            
            document.querySelectorAll('.planet-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.planet === 'all') {
                    btn.classList.add('active');
                }
            });
            
            // 淡入效果
            document.body.style.opacity = '1';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
        }, 500);
    }
    
    switchTheme(theme) {
        document.body.className = `theme-${theme}`;
        this.currentTheme = theme;
        
        // 根据主题调整星体颜色
        this.stars.forEach(star => {
            switch(theme) {
                case 'nebula':
                    star.style.background = `hsl(${Math.random() * 60 + 270}, 100%, 70%)`;
                    break;
                case 'galaxy':
                    star.style.background = `hsl(${Math.random() * 60 + 30}, 100%, 70%)`;
                    break;
                case 'cosmic':
                    star.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
                    break;
                default:
                    star.style.background = '#fff';
            }
        });
    }
    
    updateActiveButton(activeBtn) {
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }
    
    createTechParticles(icon) {
        const rect = icon.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'fixed';
            particle.style.left = centerX + 'px';
            particle.style.top = centerY + 'px';
            particle.style.width = '4px';
            particle.style.height = '4px';
            particle.style.background = '#ff006e';
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = '9999';
            
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;
            const finalX = centerX + Math.cos(angle) * distance;
            const finalY = centerY + Math.sin(angle) * distance;
            
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${finalX - centerX}px, ${finalY - centerY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 800,
                easing: 'ease-out'
            });
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.remove();
                }
            }, 800);
        }
    }
    
    enhanceCard(card) {
        // 添加额外的光效
        const glow = document.createElement('div');
        glow.style.position = 'absolute';
        glow.style.top = '0';
        glow.style.left = '0';
        glow.style.right = '0';
        glow.style.bottom = '0';
        glow.style.background = 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)';
        glow.style.borderRadius = '15px';
        glow.style.pointerEvents = 'none';
        glow.style.animation = 'glow-pulse 1s ease-in-out infinite alternate';
        
        card.appendChild(glow);
    }
    
    resetCard(card) {
        const glow = card.querySelector('div[style*="glow-pulse"]');
        if (glow) {
            glow.remove();
        }
    }
    
    handleKeyPress(e) {
        switch(e.key) {
            case '1':
                this.switchTheme('classic');
                break;
            case '2':
                this.switchTheme('nebula');
                break;
            case '3':
                this.switchTheme('galaxy');
                break;
            case '4':
                this.switchTheme('cosmic');
                break;
            case ' ':
                e.preventDefault();
                this.createGlobalExplosion();
                break;
            case 'r':
                this.resetUniverse();
                break;
            case 'w':
                this.createWormhole();
                break;
            // 转速控制快捷键
            case 'q':
                this.setOrbitSpeed(0.25);
                this.updateSpeedButtonByValue(0.25);
                break;
            case 'e':
                this.setOrbitSpeed(0.5);
                this.updateSpeedButtonByValue(0.5);
                break;
            case 't':
                this.setOrbitSpeed(1);
                this.updateSpeedButtonByValue(1);
                break;
            case 'y':
                this.setOrbitSpeed(2);
                this.updateSpeedButtonByValue(2);
                break;
            case 'u':
                this.setOrbitSpeed(4);
                this.updateSpeedButtonByValue(4);
                break;
            case 'i':
                this.setOrbitSpeed(8);
                this.updateSpeedButtonByValue(8);
                break;
            case 'o':
                this.setOrbitSpeed(16);
                this.updateSpeedButtonByValue(16);
                break;
            case 'p':
                this.setOrbitSpeed(32);
                this.updateSpeedButtonByValue(32);
                break;
        }
    }
    
    updateSpeedButtonByValue(speed) {
        document.querySelectorAll('.speed-btn').forEach(btn => {
            btn.classList.remove('active');
            if (parseFloat(btn.dataset.speed) === speed) {
                btn.classList.add('active');
            }
        });
    }
    
    incrementInteraction() {
        this.interactionCount++;
        this.updateCounters();
    }
    
    updateCounters() {
        document.getElementById('star-count').textContent = this.stars.length;
        document.getElementById('interaction-count').textContent = this.interactionCount;
    }
    
    startCounters() {
        this.updateCounters();
        
        // 模拟实时数据变化
        setInterval(() => {
            if (Math.random() < 0.3) {
                const starCount = document.getElementById('star-count');
                const currentCount = parseInt(starCount.textContent);
                starCount.textContent = currentCount + Math.floor(Math.random() * 3 - 1);
            }
        }, 2000);
    }
    
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const button = document.getElementById('audio-toggle');
        button.textContent = this.audioEnabled ? '🔊' : '🔇';
    }
    
    playClickSound() {
        if (this.audioEnabled) {
            // 创建音频上下文和音效
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
            } catch (e) {
                console.log('Audio not supported');
            }
        }
    }
    
    startAnimationLoop() {
        const animate = () => {
            // 更新粒子位置
            this.updateParticles();
            
            // 添加随机星体闪烁
            if (Math.random() < 0.05) {
                const randomStar = this.stars[Math.floor(Math.random() * this.stars.length)];
                if (randomStar) {
                    randomStar.style.animation = 'none';
                    setTimeout(() => {
                        randomStar.style.animation = 'twinkle 2s infinite';
                    }, 100);
                }
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateParticles() {
        // 清理过期的粒子
        this.particles = this.particles.filter(particle => {
            particle.life--;
            if (particle.life <= 0) {
                if (particle.element.parentNode) {
                    particle.element.remove();
                }
                return false;
            }
            
            // 更新粒子位置
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.element.style.left = particle.x + 'px';
            particle.element.style.top = particle.y + 'px';
            
            return true;
        });
    }
}

// 添加额外的CSS动画
const additionalStyles = `
    @keyframes trail-fade {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0); }
    }
    
    @keyframes mouse-particle {
        0% { opacity: 1; transform: scale(1) translate(0, 0); }
        100% { opacity: 0; transform: scale(0) translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); }
    }
    
    @keyframes explode-move {
        0% { 
            transform: translate(0, 0) scale(1);
            opacity: 1;
        }
        100% { 
            transform: translate(var(--final-x, 0), var(--final-y, 0)) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes star-warp {
        0% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(2) rotate(180deg); opacity: 0.5; }
        100% { transform: scale(1) rotate(360deg); }
    }
    
    @keyframes glow-pulse {
        0% { opacity: 0.3; }
        100% { opacity: 0.7; }
    }
`;

// 注入额外样式
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 启动星空引擎
document.addEventListener('DOMContentLoaded', () => {
    const engine = new StarfieldEngine();
    
    // 添加加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Show control hints
    setTimeout(() => {
        const hint = document.createElement('div');
        hint.innerHTML = `
            <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(0,0,0,0.8); 
                        padding: 1rem; border-radius: 10px; color: #fff; font-size: 0.9rem;
                        backdrop-filter: blur(10px); z-index: 1000; max-width: 320px;">
                <h4 style="margin-bottom: 0.5rem; color: #00ffff;">🎮 Controls:</h4>
                <p>🖱️ Move mouse for trail effects</p>
                <p>🎯 Click anywhere for explosions</p>
                <p>🪐 Click planets for info & effects</p>
                <p>⌨️ Keys 1-4: Switch themes</p>
                <p>⌨️ Keys Q/E/T/Y/U/I/O/P: Speed control</p>
                <p>⌨️ Spacebar: Galaxy blast</p>
                <p>⌨️ R: Reset universe</p>
                <p>⌨️ W: Create wormhole</p>
                <button onclick="this.parentElement.remove()" 
                        style="margin-top: 0.5rem; background: #00ffff; border: none; 
                               padding: 0.3rem 0.8rem; border-radius: 5px; cursor: pointer; color: #000;">
                    Got it! 🚀
                </button>
            </div>
        `;
        document.body.appendChild(hint);
        
        // Auto hide after 12 seconds
        setTimeout(() => {
            if (hint.parentNode) {
                hint.remove();
            }
        }, 12000);
    }, 2000);
});

// 性能监控
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`FPS: ${fps}`);
        
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(monitorPerformance);
}

// 启动性能监控
monitorPerformance();
