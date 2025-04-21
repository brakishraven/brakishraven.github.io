const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
let width, height;
const dots = [];

const config = {
  dotCount: 100,
  maxDistance: 100,
  dotRadius: 2,
  dotColor: "rgba(255,255,255,0.6)",
  lineColor: "rgba(255,255,255,0.2)"
};

function resizeCanvas() {
  width = canvas.width = canvas.offsetWidth;
  height = canvas.height = canvas.offsetHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Dot {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, config.dotRadius, 0, Math.PI * 2);
    ctx.fillStyle = config.dotColor;
    ctx.fill();
  }
}

for (let i = 0; i < config.dotCount; i++) {
  dots.push(new Dot());
}

const mouse = { x: null, y: null };
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  dots.forEach(dot => {
    dot.update();
    dot.draw();
  });

  for (let i = 0; i < dots.length; i++) {
    for (let j = i + 1; j < dots.length; j++) {
      const dx = dots[i].x - dots[j].x;
      const dy = dots[i].y - dots[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < config.maxDistance) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(dots[j].x, dots[j].y);
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    if (mouse.x !== null) {
      const dx = dots[i].x - mouse.x;
      const dy = dots[i].y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < config.maxDistance) {
        ctx.beginPath();
        ctx.moveTo(dots[i].x, dots[i].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animate);
}

animate();
window.addEventListener('scroll', function() {
    const heroSection = document.querySelector('.hero');
    if (window.scrollY > 50) { // When you scroll down 50px
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  });
  