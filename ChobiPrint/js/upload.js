// Global array to share with editor.js
window.uploadedImages = [];

$(document).ready(function() {
    // Drag & Drop
    const dropZone = $('#drop-zone');
    const fileInput = $('#fileInput');

    dropZone.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });

    dropZone.on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });

    dropZone.on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        handleFiles(e.originalEvent.dataTransfer.files);
    });

    fileInput.on('change', function(e) {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (!files.length) return;

        Swal.fire({
            title: 'ছবি প্রসেস হচ্ছে...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        let loadedCount = 0;
        const totalFiles = Array.from(files).filter(f => f.type.startsWith('image/')).length;

        if (totalFiles === 0) {
            Swal.close();
            return;
        }

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                // Resize/Compress image for localStorage safety
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Limit max dimension to 800px for cart storage
                    let width = img.width;
                    let height = img.height;
                    const maxDim = 800;
                    
                    if (width > height) {
                        if (width > maxDim) {
                            height *= maxDim / width;
                            width = maxDim;
                        }
                    } else {
                        if (height > maxDim) {
                            width *= maxDim / height;
                            height = maxDim;
                        }
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    const compressedSrc = canvas.toDataURL('image/jpeg', 0.7);
                    const id = 'img_' + Date.now() + Math.random().toString(36).substr(2, 5);
                    
                    const imgData = {
                        id: id,
                        originalSrc: compressedSrc,
                        currentSrc: compressedSrc,
                        name: file.name,
                        size: (file.size / 1024).toFixed(2) + ' KB',
                        printSize: '4x6',
                        quantity: 1,
                        finalized: false
                    };
                    
                    window.uploadedImages.push(imgData);
                    renderPreview(imgData);
                    
                    loadedCount++;
                    if (loadedCount === totalFiles) {
                        Swal.close();
                        AOS.refresh();
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function renderPreview(imgData) {
        const html = `
            <div class="col-md-6 col-lg-4 mb-4" id="card-${imgData.id}" data-aos="fade-up">
                <div class="glass-card h-100 p-3 position-relative shadow-sm">
                    <div class="photo-card mb-3 border rounded overflow-hidden">
                        <img src="${imgData.currentSrc}" id="img-${imgData.id}" class="img-fluid" style="height: 200px; width: 100%; object-fit: cover;">
                    </div>
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <small class="text-muted text-truncate fw-bold" style="max-width: 150px;">${imgData.name}</small>
                        <span class="badge bg-light text-dark border">${imgData.size}</span>
                    </div>
                    
                    <div class="controls-area">
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="small text-muted mb-1">সাইজ</label>
                                <select class="form-select form-select-sm bg-white text-dark border-secondary size-select" data-id="${imgData.id}">
                                    <option value="4x6">4x6 inch</option>
                                    <option value="5x7">5x7 inch</option>
                                    <option value="8x10">8x10 inch</option>
                                    <option value="10x12">10x12 inch</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="small text-muted mb-1">কপি</label>
                                <input type="number" class="form-control form-control-sm bg-white text-dark border-secondary qty-input" value="1" min="1" data-id="${imgData.id}">
                            </div>
                        </div>
                        
                        <div class="d-grid gap-2">
                            <div class="btn-group">
                                <button class="btn btn-outline-primary btn-sm edit-btn" data-id="${imgData.id}">
                                    <i class="fas fa-crop-alt me-1"></i> এডিট
                                </button>
                                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${imgData.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                            <button class="btn btn-primary-custom btn-sm finalize-btn" data-id="${imgData.id}">
                                <i class="fas fa-check me-1"></i> ফাইনাল করুন
                            </button>
                        </div>
                    </div>
                    
                    <div class="finalized-overlay position-absolute top-0 start-0 w-100 h-100 d-none justify-content-center align-items-center" style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); z-index: 10; border-radius: 20px;">
                        <div class="text-center">
                            <i class="fas fa-check-circle text-success fa-4x mb-2 animate__animated animate__bounceIn"></i>
                            <h5 class="text-dark fw-bold">ফাইনাল করা হয়েছে</h5>
                            <button class="btn btn-sm btn-outline-primary mt-2 undo-btn" data-id="${imgData.id}">এডিট করুন</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#preview-container').append(html);
        $('#action-buttons').removeClass('d-none');
    }

    // Delete Image
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).attr('data-id');
        window.uploadedImages = window.uploadedImages.filter(img => img.id !== id);
        $(`#card-${id}`).remove();
        if (window.uploadedImages.length === 0) $('#action-buttons').addClass('d-none');
    });

    // Update Size & Qty in data
    $(document).on('change', '.size-select', function() {
        const id = $(this).attr('data-id');
        const imgObj = window.uploadedImages.find(img => img.id === id);
        if(imgObj) imgObj.printSize = $(this).val();
    });

    $(document).on('change', '.qty-input', function() {
        const id = $(this).attr('data-id');
        const imgObj = window.uploadedImages.find(img => img.id === id);
        if(imgObj) imgObj.quantity = parseInt($(this).val());
    });

    // Finalize Image
    $(document).on('click', '.finalize-btn', function() {
        const id = $(this).attr('data-id');
        const card = $(`#card-${id}`);
        const imgObj = window.uploadedImages.find(img => img.id === id);
        
        if (!imgObj) return;

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cart.findIndex(item => item.id === id);
        if (existingIndex > -1) {
            cart[existingIndex] = imgObj;
        } else {
            cart.push(imgObj);
        }
        
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
            imgObj.finalized = true;
            card.find('.finalized-overlay').removeClass('d-none').addClass('d-flex');
            
            if (typeof updateCartCount === 'function') updateCartCount();
            
            Swal.fire({
                icon: 'success',
                title: 'কার্টে যোগ করা হয়েছে',
                text: 'আপনার ছবিটি সফলভাবে কার্টে যোগ করা হয়েছে।',
                showCancelButton: true,
                confirmButtonText: 'কার্ট দেখুন',
                cancelButtonText: 'আরও ছবি যোগ করুন',
                confirmButtonColor: '#3b82f6',
                cancelButtonColor: '#64748b'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'cart.html';
                }
            });
        } catch (e) {
            Swal.fire({
                icon: 'error',
                title: 'মেমোরি ফুল!',
                text: 'দুঃখিত, অনেক বড় সাইজের ছবি হওয়ার কারণে ব্রাউজার মেমোরি ফুল হয়ে গেছে। আমরা ছবিটিকে আরও ছোট করে সেভ করার চেষ্টা করছি।'
            });
        }
    });

    // Undo Finalize
    $(document).on('click', '.undo-btn', function() {
        const id = $(this).attr('data-id');
        const card = $(`#card-${id}`);
        card.find('.finalized-overlay').removeClass('d-flex').addClass('d-none');
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('cart', JSON.stringify(cart));
        if (typeof updateCartCount === 'function') updateCartCount();
    });

});
