$(document).ready(function() {
    let currentEditId = null;
    let cropper = null;

    // Edit Image (Open Cropper)
    $(document).on('click', '.edit-btn', function() {
        currentEditId = $(this).attr('data-id');
        const imgObj = window.uploadedImages.find(img => img.id === currentEditId);
        
        if (!imgObj) return;

        const image = document.getElementById('image-to-edit');
        image.src = imgObj.currentSrc;
        
        $('#editorModal').modal('show');
    });

    $('#editorModal').on('shown.bs.modal', function () {
        const image = document.getElementById('image-to-edit');
        if (cropper) {
            cropper.destroy();
        }
        cropper = new Cropper(image, {
            aspectRatio: 2 / 3, // Default 4x6 vertical
            viewMode: 1,
            background: true,
            responsive: true,
        });
    });

    $('#editorModal').on('hidden.bs.modal', function () {
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    });

    // Save Cropped Image
    $('#save-crop').on('click', function() {
        if (!cropper) return;
        
        const canvas = cropper.getCroppedCanvas({
            width: 800,
            height: 1200,
            imageSmoothingQuality: 'high'
        });
        
        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        // Update data in global array
        const imgObj = window.uploadedImages.find(img => img.id === currentEditId);
        if (imgObj) {
            imgObj.currentSrc = croppedDataUrl;
            
            // Update UI
            $(`#img-${currentEditId}`).attr('src', croppedDataUrl);
        }
        
        $('#editorModal').modal('hide');
        
        Swal.fire({
            icon: 'success',
            title: 'এডিট সম্পন্ন হয়েছে',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
    });
});
