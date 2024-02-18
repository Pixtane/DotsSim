const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let dots = [];
let numDots = 3000;
let maxDistance = 50; // Maximum distance for opacity calculation
let dotSpeed = 0.2; // Speed of dots

let areDotVisible = true;

// Change dot speed on mouse wheel events
canvas.addEventListener('wheel', e => {
  // Detect if the mouse wheel is scrolled up or down
  if (e.deltaY < 0) {
    // Increase speed when scrolled up
    dotSpeed += 0.1
  } else {
    // Decrease speed when scrolled down
    dotSpeed -= 0.1
  }
});

window.addEventListener('keydown', e => {
  if (e.code === 'Space') {
    areDotVisible = !areDotVisible;
  }

  if (e.code === "ArrowUp") {
    numDots = numDots+0.05*numDots;
    redrawDots(numDots)
  }
  if (e.code === "ArrowDown") {
    numDots = numDots-0.05*numDots;
    redrawDots(numDots)
  }

  if (e.code === "ArrowLeft") {
    maxDistance -= 0.05*maxDistance;
  } else
    if (e.code === "ArrowRight") {
      maxDistance += 0.05*maxDistance;
    }

});

function redrawDots(numNewDots) {
  const numCurrentDots = dots.length;
  const numDotsToAdd = numNewDots - numCurrentDots;

  if (numDotsToAdd > 0) {
    // Add new dots
    for (let i = 0; i < numDotsToAdd; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1
      });
    }
  } else if (numDotsToAdd < 0) {
    // Remove existing dots
    dots.splice(numNewDots, -numDotsToAdd);
  }
}


redrawDots(numDots);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(dot => {
    if (areDotVisible)
    {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Update dot position
    dot.x += dot.vx * dotSpeed;
    dot.y += dot.vy * dotSpeed;

    // Change direction if hitting walls
    if (dot.x < 0 || dot.x > canvas.width) {
      dot.vx *= -1;
      dot.x = canvas.width;
    }
    if (dot.y < 0 || dot.y > canvas.height) {
      dot.vy *= -1;
      dot.y = canvas.height;
    }

    // Draw lines and calculate opacity based on distance
    const distance = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);
    const opacity = 1 - Math.min(distance / maxDistance, 1);
    ctx.beginPath();
    ctx.moveTo(dot.x, dot.y);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
    ctx.stroke();
  });

  requestAnimationFrame(draw);
}

let mouseX = 0;
let mouseY = 0;

// Update mouse position
canvas.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Resize canvas when window resizes
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Start drawing
draw();

canvas.addEventListener('contextmenu', e => {
    e.preventDefault();
});

let clickStartTime; // Variable to store the time when mouse button is clicked
let clickEndTime; // Variable to store the time when mouse button is released

// Handle mouse down
canvas.addEventListener('mousedown', e => {
    clickStartTime = Date.now(); // Record the time when mouse button is clicked
});

// Handle mouse up
canvas.addEventListener('mouseup', e => {
    clickEndTime = Date.now(); // Record the time when mouse button is released

    const duration = clickEndTime - clickStartTime; // Calculate the duration between mouse down and mouse up
    const impactMultiplier = duration / 1000; // Calculate the impact multiplier based on duration (max multiplier capped at 1)

    const mouseX = e.clientX;
    const mouseY = e.clientY; 

    if (e.button === 0) { // Left click
        // Apply explosion force to dots
        dots.forEach(dot => {
            const distance = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);
            const force = 1000 / (distance * distance) * impactMultiplier; // Apply impact multiplier
            dot.vx += (dot.x - mouseX) * force;
            dot.vy += (dot.y - mouseY) * force;
        });
    } else if (e.button === 2) { // Right click
        // Apply attraction force to dots
        dots.forEach(dot => {
            const distance = Math.sqrt((dot.x - mouseX) ** 2 + (dot.y - mouseY) ** 2);
            const force = 1000 / (distance * distance) * impactMultiplier; // Apply impact multiplier
            dot.vx -= (dot.x - mouseX) * force;
            dot.vy -= (dot.y - mouseY) * force;
        });
    }
});