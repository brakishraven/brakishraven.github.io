const canvas = document.querySelector(".connecting-dots");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let dots = [];
const mouse = {
  x: null,
  y: null,
  radius: 250,  // Mouse radius: dots and connections only appear within this range
  hovering: false
};

canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
  mouse.hovering = true;
});

canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
  mouse.hovering = false;
});

// Dot color options (blue and pink)
const colorDot = [
  'rgb(81, 162, 233)',
  'rgb(81, 162, 233)',
  'rgb(81, 162, 233)',
  'rgb(81, 162, 233)',
  'rgb(255, 77, 90)',
];
// Dot class
class Dot {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = -0.5 + Math.random();
    this.vy = -0.5 + Math.random();
    this.radius = 2; // Adjusted radius to make dots larger

    // Randomly choose a color for the dot (either blue or light red)
    this.color = colorDot[Math.floor(Math.random() * colorDot.length)];
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;

    // Bounce off the edges
    if (this.x <= 0 || this.x >= width) this.vx *= -1;
    if (this.y <= 0 || this.y >= height) this.vy *= -1;
  }

  draw() {
    if (mouse.x !== null && mouse.y !== null) {
      const dxMouse = this.x - mouse.x;
      const dyMouse = this.y - mouse.y;
      const distToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
  
      // Calculate opacity based on distance to the mouse
      let opacity = 1 - distToMouse / mouse.radius;
  
      // Ensure a minimum opacity (we don't want it to be fully transparent)
      if (opacity < 0.2) {
        opacity = 0.2; // Adjust this value as needed
      }
  
      // Create a "fading" effect by modifying the color's alpha value
      const fadedColor = `${this.color.replace('rgb', 'rgba').replace(')', `, ${opacity})`)}`;  // Modify color with opacity
  
      // Draw the dot with the fading effect
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = fadedColor; // Use the color with the calculated opacity
      ctx.fill();
    }
  }
  
}


function connectDots() {
  // Only connect dots if the mouse is within range
  if (mouse.x !== null && mouse.y !== null) {
    for (let i = 0; i < dots.length; i++) {
      const dxMouse = dots[i].x - mouse.x;
      const dyMouse = dots[i].y - mouse.y;
      const distToMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

      // Only connect dots that are within the mouse's radius
      if (distToMouse < mouse.radius) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distBetweenDots = Math.sqrt(dx * dx + dy * dy);

          // Connect only the dots that are close enough to each other (within 100px)
          if (distBetweenDots < 100) {
            const opacity = 1 - distBetweenDots / 100;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(129, 184, 246, ${opacity})`; // Blue color with opacity
            ctx.lineWidth = 1; // Line width
            ctx.stroke();
          }
        }
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  dots.forEach(dot => {
    dot.move();
    dot.draw();
  });
  connectDots();
  requestAnimationFrame(animate);
}

function initDots(count = 500) {
  dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(new Dot());
  }
}

window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initDots();
});

initDots();
animate();
