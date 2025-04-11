document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle system configuration
    const config = {
        particleCount: 80,
        particleSize: 2,
        lineLength: 150,
        baseSpeed: 0.3,
        variantSpeed: 0.7,
        baseRadius: 1,
        variantRadius: 2,
        color: 'rgba(122, 92, 255, 0.5)'
    };
    
    // Particles array
    let particles = [];
    
    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = config.baseRadius + Math.random() * config.variantRadius;
            this.speedX = (Math.random() - 0.5) * (config.baseSpeed + Math.random() * config.variantSpeed);
            this.speedY = (Math.random() - 0.5) * (config.baseSpeed + Math.random() * config.variantSpeed);
            this.originalSpeedX = this.speedX;
            this.originalSpeedY = this.speedY;
        }
        
        update() {
            // Add some randomness to movement
            if (Math.random() > 0.95) {
                this.speedX = this.originalSpeedX * (0.8 + Math.random() * 0.4);
                this.speedY = this.originalSpeedY * (0.8 + Math.random() * 0.4);
            }
            
            // Move particles
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off edges with slight randomness
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX *= -1;
                this.x = this.x < 0 ? 0 : canvas.width;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY *= -1;
                this.y = this.y < 0 ? 0 : canvas.height;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.color;
            ctx.fill();
        }
    }
    
    // Initialize particles
    function init() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connecting lines
    function drawLines() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < config.lineLength) {
                    const opacity = 1 - (distance / config.lineLength);
                    ctx.strokeStyle = `rgba(122, 92, 255, ${opacity * 0.15})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        
        drawLines();
        requestAnimationFrame(animate);
    }
    
    // Handle window resize
    function handleResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    }
    
    // Mouse interaction
    let mouseX = null;
    let mouseY = null;
    
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }
    
    function handleMouseLeave() {
        mouseX = null;
        mouseY = null;
    }
    
    // Initialize and start animation
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    init();
    animate();
});
