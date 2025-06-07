// Camera functionality for before/after photos
class CameraManager {
    constructor() {
        this.stream = null;
        this.currentCamera = 'before';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Before camera controls
        document.getElementById('startBeforeCamera')?.addEventListener('click', () => {
            this.startCamera('before');
        });
        
        document.getElementById('takeBeforePhoto')?.addEventListener('click', () => {
            this.takePhoto('before');
        });
        
        document.getElementById('retakeBeforePhoto')?.addEventListener('click', () => {
            this.retakePhoto('before');
        });

        // After camera controls
        document.getElementById('startAfterCamera')?.addEventListener('click', () => {
            this.startCamera('after');
        });
        
        document.getElementById('takeAfterPhoto')?.addEventListener('click', () => {
            this.takePhoto('after');
        });
        
        document.getElementById('retakeAfterPhoto')?.addEventListener('click', () => {
            this.retakePhoto('after');
        });
    }

    async startCamera(type) {
        try {
            const video = document.getElementById(`${type}Video`);
            const startBtn = document.getElementById(`start${this.capitalize(type)}Camera`);
            const takeBtn = document.getElementById(`take${this.capitalize(type)}Photo`);

            // Check if camera is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                this.showError('Camera not supported on this device. Please use file upload instead.');
                return;
            }

            // Request camera access with mobile-friendly constraints
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 },
                    facingMode: 'user'
                },
                audio: false
            });

            video.srcObject = this.stream;
            video.classList.remove('d-none');
            
            // Update button states
            startBtn.classList.add('d-none');
            takeBtn.classList.remove('d-none');
            
            this.currentCamera = type;

        } catch (error) {
            console.error('Error accessing camera:', error);
            this.showError('Unable to access camera. Please use file upload or skip this step.');
            
            // Show file upload as alternative
            this.showFileUpload(type);
        }
    }

    takePhoto(type) {
        try {
            const video = document.getElementById(`${type}Video`);
            const canvas = document.getElementById(`${type}Canvas`);
            const preview = document.getElementById(`${type}PhotoPreview`);
            const takeBtn = document.getElementById(`take${this.capitalize(type)}Photo`);
            const retakeBtn = document.getElementById(`retake${this.capitalize(type)}Photo`);
            const continueBtn = type === 'before' ? 
                document.getElementById('continueToReview') : 
                document.getElementById('finishJourney');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw video frame to canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);

            // Convert to base64
            const dataURL = canvas.toDataURL('image/jpeg', 0.8);

            // Update preview
            preview.innerHTML = `<img src="${dataURL}" class="img-fluid rounded" alt="${type} photo">`;

            // Store photo data
            document.getElementById(`${type}_photo`).value = dataURL;
            
            // Store timestamp
            document.getElementById(`${type}_photo_time`).value = new Date().toISOString();

            // Stop camera stream
            this.stopCamera();

            // Update button states
            video.classList.add('d-none');
            takeBtn.classList.add('d-none');
            retakeBtn.classList.remove('d-none');
            continueBtn?.classList.remove('d-none');

            // Show success message
            this.showSuccess(`${this.capitalize(type)} photo captured successfully!`);

        } catch (error) {
            console.error('Error taking photo:', error);
            this.showError('Failed to capture photo. Please try again.');
        }
    }

    retakePhoto(type) {
        const preview = document.getElementById(`${type}PhotoPreview`);
        const retakeBtn = document.getElementById(`retake${this.capitalize(type)}Photo`);
        const startBtn = document.getElementById(`start${this.capitalize(type)}Camera`);
        const continueBtn = type === 'before' ? 
            document.getElementById('continueToReview') : 
            document.getElementById('finishJourney');

        // Clear preview and data
        preview.innerHTML = '';
        document.getElementById(`${type}_photo`).value = '';
        document.getElementById(`${type}_photo_time`).value = '';

        // Reset button states
        retakeBtn.classList.add('d-none');
        startBtn.classList.remove('d-none');
        continueBtn?.classList.add('d-none');
    }

    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => {
                track.stop();
            });
            this.stream = null;
        }
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    showSuccess(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'success');
        } else {
            alert(message);
        }
    }

    showError(message) {
        if (typeof showToast === 'function') {
            showToast(message, 'error');
        } else {
            alert(message);
        }
    }

    // Show file upload as alternative to camera
    showFileUpload(type) {
        const preview = document.getElementById(`${type}PhotoPreview`);
        const fileUploadHTML = `
            <div class="file-upload-container text-center p-4">
                <h5>Upload ${type} photo instead</h5>
                <input type="file" id="${type}FileUpload" accept="image/*" class="form-control mb-3">
                <button type="button" id="skip${this.capitalize(type)}Photo" class="btn btn-outline-secondary">
                    <i class="fas fa-skip-forward"></i> Skip This Photo
                </button>
            </div>
        `;
        preview.innerHTML = fileUploadHTML;
        
        // Bind file upload event
        document.getElementById(`${type}FileUpload`).addEventListener('change', (e) => {
            this.handleFileUpload(e, type);
        });
        
        // Bind skip button event
        document.getElementById(`skip${this.capitalize(type)}Photo`).addEventListener('click', () => {
            this.skipPhoto(type);
        });
    }
    
    // Handle file upload
    handleFileUpload(event, type) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataURL = e.target.result;
            const preview = document.getElementById(`${type}PhotoPreview`);
            
            // Show preview
            preview.innerHTML = `
                <img src="${dataURL}" class="img-fluid rounded" alt="${type} photo">
                <div class="mt-2">
                    <button type="button" id="retake${this.capitalize(type)}Photo" class="btn btn-warning">
                        <i class="fas fa-redo"></i> Change Photo
                    </button>
                </div>
            `;
            
            // Store photo data and timestamp
            document.getElementById(`${type}_photo`).value = dataURL;
            document.getElementById(`${type}_photo_time`).value = new Date().toISOString();
            
            // Show continue button
            const continueBtn = type === 'before' ? 
                document.getElementById('continueToReview') : 
                document.getElementById('finishJourney');
            continueBtn?.classList.remove('d-none');
            
            // Bind retake button
            document.getElementById(`retake${this.capitalize(type)}Photo`).addEventListener('click', () => {
                this.retakePhoto(type);
            });
            
            this.showSuccess(`${this.capitalize(type)} photo uploaded successfully!`);
        };
        reader.readAsDataURL(file);
    }
    
    // Skip photo option
    skipPhoto(type) {
        const preview = document.getElementById(`${type}PhotoPreview`);
        preview.innerHTML = `
            <div class="text-center p-4 text-muted">
                <i class="fas fa-camera-slash" style="font-size: 3rem;"></i>
                <h5 class="mt-2">Photo Skipped</h5>
                <button type="button" id="add${this.capitalize(type)}Photo" class="btn btn-outline-primary mt-2">
                    <i class="fas fa-camera"></i> Add Photo Later
                </button>
            </div>
        `;
        
        // Clear photo data but keep timestamp for when they skipped
        document.getElementById(`${type}_photo`).value = '';
        document.getElementById(`${type}_photo_time`).value = new Date().toISOString();
        
        // Show continue button
        const continueBtn = type === 'before' ? 
            document.getElementById('continueToReview') : 
            document.getElementById('finishJourney');
        continueBtn?.classList.remove('d-none');
        
        // Bind add photo later button
        document.getElementById(`add${this.capitalize(type)}Photo`).addEventListener('click', () => {
            this.showFileUpload(type);
        });
        
        this.showSuccess(`${this.capitalize(type)} photo skipped. You can add one later if you want!`);
    }

    // Cleanup when leaving page
    cleanup() {
        this.stopCamera();
    }
}

// Initialize camera manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cameraManager = new CameraManager();
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        window.cameraManager.cleanup();
    });
});

// Check if camera is supported
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('Camera not supported on this device');
    document.addEventListener('DOMContentLoaded', () => {
        const cameraButtons = document.querySelectorAll('[id*="Camera"]');
        cameraButtons.forEach(btn => {
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Camera Not Supported';
            btn.classList.add('btn-secondary');
            btn.classList.remove('btn-primary');
        });
    });
}
