// Drawing canvas functionality
class DrawingCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.currentColor = '#000000';
        this.currentSize = 5;
        this.lastX = 0;
        this.lastY = 0;
        
        this.initializeCanvas();
        this.bindEvents();
    }

    initializeCanvas() {
        // Set canvas background to white
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set initial drawing properties
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const aspectRatio = this.canvas.height / this.canvas.width;
        
        if (containerWidth < 800) {
            this.canvas.style.width = containerWidth + 'px';
            this.canvas.style.height = (containerWidth * aspectRatio) + 'px';
        } else {
            this.canvas.style.width = '800px';
            this.canvas.style.height = '400px';
        }
    }

    bindEvents() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));

        // Control events
        document.getElementById('clearCanvas')?.addEventListener('click', this.clearCanvas.bind(this));
        document.getElementById('colorPicker')?.addEventListener('change', this.changeColor.bind(this));
        document.getElementById('brushSize')?.addEventListener('input', this.changeSize.bind(this));

        // Prevent scrolling when drawing on mobile
        this.canvas.addEventListener('touchstart', (e) => e.preventDefault());
        this.canvas.addEventListener('touchmove', (e) => e.preventDefault());
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    getTouchPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        return {
            x: (e.touches[0].clientX - rect.left) * scaleX,
            y: (e.touches[0].clientY - rect.top) * scaleY
        };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const pos = this.getMousePos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;
        
        // Start path
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
    }

    draw(e) {
        if (!this.isDrawing) return;
        
        const pos = this.getMousePos(e);
        
        this.ctx.lineWidth = this.currentSize;
        this.ctx.strokeStyle = this.currentColor;
        
        // Draw line
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
        
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    stopDrawing() {
        if (!this.isDrawing) return;
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(
            e.type === 'touchstart' ? 'mousedown' : 
            e.type === 'touchmove' ? 'mousemove' : 'mouseup',
            {
                clientX: touch.clientX,
                clientY: touch.clientY
            }
        );
        
        if (e.type === 'touchstart') {
            this.startDrawing(mouseEvent);
        } else if (e.type === 'touchmove') {
            this.draw(mouseEvent);
        }
    }

    clearCanvas() {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.showSuccess('Canvas cleared!');
    }

    changeColor(e) {
        this.currentColor = e.target.value;
        this.ctx.strokeStyle = this.currentColor;
    }

    changeSize(e) {
        this.currentSize = e.target.value;
        this.ctx.lineWidth = this.currentSize;
        
        // Update size display
        const sizeDisplay = document.getElementById('brushSizeDisplay');
        if (sizeDisplay) {
            sizeDisplay.textContent = this.currentSize + 'px';
        }
    }

    // Add preset drawing tools
    addPresetShapes() {
        const toolbar = document.createElement('div');
        toolbar.className = 'drawing-toolbar mt-2';
        toolbar.innerHTML = `
            <button type="button" class="btn btn-sm btn-outline-primary me-2" onclick="drawingCanvas.drawSmiley()">
                <i class="fas fa-smile"></i> Smiley
            </button>
            <button type="button" class="btn btn-sm btn-outline-warning me-2" onclick="drawingCanvas.drawHeart()">
                <i class="fas fa-heart"></i> Heart
            </button>
            <button type="button" class="btn btn-sm btn-outline-success me-2" onclick="drawingCanvas.drawStar()">
                <i class="fas fa-star"></i> Star
            </button>
            <button type="button" class="btn btn-sm btn-outline-info" onclick="drawingCanvas.drawCoffeeBean()">
                <i class="fas fa-coffee"></i> Coffee Bean
            </button>
        `;
        
        this.canvas.parentElement.appendChild(toolbar);
    }

    drawSmiley() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 50;
        
        // Face
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Eyes
        this.ctx.beginPath();
        this.ctx.arc(centerX - 20, centerY - 15, 5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(centerX + 20, centerY - 15, 5, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Smile
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, 30, 0, Math.PI);
        this.ctx.stroke();
    }

    drawHeart() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#ff6b6b';
        this.ctx.lineWidth = 4;
        
        // Heart shape using bezier curves
        this.ctx.moveTo(centerX, centerY + 10);
        this.ctx.bezierCurveTo(centerX - 20, centerY - 10, centerX - 40, centerY - 10, centerX, centerY + 30);
        this.ctx.bezierCurveTo(centerX + 40, centerY - 10, centerX + 20, centerY - 10, centerX, centerY + 10);
        this.ctx.stroke();
    }

    drawStar() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const spikes = 5;
        const outerRadius = 30;
        const innerRadius = 15;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 3;
        
        let rot = Math.PI / 2 * 3;
        let x = centerX;
        let y = centerY;
        const step = Math.PI / spikes;
        
        this.ctx.moveTo(centerX, centerY - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = centerX + Math.cos(rot) * outerRadius;
            y = centerY + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
            
            x = centerX + Math.cos(rot) * innerRadius;
            y = centerY + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        
        this.ctx.lineTo(centerX, centerY - outerRadius);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawCoffeeBean() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = '#8b4513';
        this.ctx.lineWidth = 4;
        
        // Bean shape
        this.ctx.ellipse(centerX, centerY, 25, 40, 0, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Bean crack
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - 35);
        this.ctx.lineTo(centerX, centerY + 35);
        this.ctx.stroke();
    }

    showSuccess(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'success');
        }
    }

    // Export canvas as image
    exportCanvas() {
        return this.canvas.toDataURL('image/png');
    }

    // Import image to canvas
    importImage(imageSrc) {
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        };
        img.src = imageSrc;
    }
}

// Initialize drawing canvas when DOM is loaded
let drawingCanvas;

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    if (canvas) {
        drawingCanvas = new DrawingCanvas('drawingCanvas');
        drawingCanvas.addPresetShapes();
        
        // Add brush size display
        const brushSizeSlider = document.getElementById('brushSize');
        if (brushSizeSlider) {
            const sizeDisplay = document.createElement('span');
            sizeDisplay.id = 'brushSizeDisplay';
            sizeDisplay.className = 'ms-2 fw-bold';
            sizeDisplay.textContent = brushSizeSlider.value + 'px';
            brushSizeSlider.parentElement.appendChild(sizeDisplay);
        }
    }
});

// Export for global access
window.drawingCanvas = drawingCanvas;
