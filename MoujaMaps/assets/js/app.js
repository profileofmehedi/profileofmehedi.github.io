const geoData = {
    "ঢাকা": {
        "id": "1wUMfB9FNR_yTB3UEsD1WLmk4OXwuspCD",
        "districts": {
            "ঢাকা": { "id": "11NV15Wrby68Fr9cpshrwJ-eGDK0Zg08Z", "upazilas": ["ঢাকা উত্তর", "ঢাকা দক্ষিণ", "সাভার", "ধামরাই", "দোহার", "নবাবগঞ্জ", "কেরানীগঞ্জ"] },
            "গাজীপুর": { "id": "1QIYdsEbbgxcCDaI4Pp20RERVuQxjR-66", "upazilas": { "শ্রীপুর": "1XxKr_vWcm7AHewKXOKEy7FM1nYidPhsx", "কালিয়াকৈর": "", "কালীগঞ্জ": "", "কাপাসিয়া": "", "গাজীপুর সদর": "" } },
            "নারায়ণগঞ্জ": { "id": "1dCv7ntiOoD7TyE32LulIZGwlIM3QxgiA", "upazilas": ["নারায়ণগঞ্জ সদর", "বন্দর", "আড়াইহাজার", "রূপগঞ্জ", "সোনারগাঁ"] },
            "নরসিংদী": { "id": "1R35FjD4AF4ewIHJltw77kzhl7Va8Kub9", "upazilas": ["নরসিংদী সদর", "বেলাবো", "মনোহরদী", "পলাশ", "রায়পুরা", "শিবপুর"] },
            "মানিকগঞ্জ": { "id": "1ryvWVYLOhBTo_vKfoJRKEgKmOhlmgPr2", "upazilas": ["মানিকগঞ্জ সদর", "সিংগাইর", "শিবালয়", "সাটুরিয়া", "হরিরামপুর", "ঘিওর", "দৌলতপুর"] },
            "মুন্সিগঞ্জ": { "id": "1TfelVK4LyaLbvwtmTQfOtEUBwlLmf8Mb", "upazilas": ["মুন্সিগঞ্জ সদর", "টঙ্গিবাড়ী", "শ্রীনগর", "লোহজং", "গজারিয়া", "সিরাজদিখান"] },
            "ফরিদপুর": { "id": "1eBYZmkdwJTDSQGVOXlWnbkWrE3LlLCMd", "upazilas": ["ফরিদপুর সদর", "বোয়ালমারী", "আলফাডাঙ্গা", "মধুখালী", "ভাঙ্গা", "সদরপুর", "চরভদ্রাসন", "নগরকান্দা", "সালথা"] },
            "টাঙ্গাইল": { "id": "1_kJYGjYrO5D_C6pfNKfyrwFDj-0I9nHF", "upazilas": ["টাঙ্গাইল সদর", "কালিহাতী", "ঘাটাইল", "বাসাইল", "গোপালপুর", "সখিপুর", "নাগরপুর", "মির্জাপুর", "ধনবাড়ী", "মধুপুর", "দেলদুয়ার", "ভুয়াপুর"] },
            "কিশোরগঞ্জ": { "id": "1E6BERjJn3WCK98kCsMzOHADcfVb6rtQ_", "upazilas": ["কিশোরগঞ্জ সদর", "ইটনা", "কটিয়াদী", "করিমগঞ্জ", "কুলিয়ারচর", "তাড়াইল", "নিকলী", "বাজিতপুর", "ভৈরব", "মিঠামইন", "অষ্টগ্রাম", "হোসেনপুর", "পাকুন্দিয়া"] }
        }
    },
    "চট্টগ্রাম": {
        "id": "1ig3trYSaN804di_YRcEwgt820Hbv5HH2",
        "districts": {
            "চট্টগ্রাম": { "id": "", "upazilas": ["পটিয়া", "সীতাকুন্ড", "হাটহাজারী", "মিরসরাই", "রাউজান", "রাঙ্গুনিয়া", "বোয়ালখালী", "আনোয়ারা", "চন্দনাইশ", "লোহাগাড়া", "বাঁশখালী", "ফটিকছড়ি", "সন্দ্বীপ"] },
            "কুমিল্লা": { "id": "", "upazilas": ["কুমিল্লা সদর", "লাকসাম", "দেবিদ্বার", "মুরাদনগর", "দাউদকান্দি", "চৌদ্দগ্রাম", "বরুড়া", "বুড়িচং", "ব্রাহ্মণপাড়া", "চাঁন্দিনা", "হোমনা", "লাঙ্গলকোট", "মেঘনা", "তিতাস", "মনোহরগঞ্জ"] }
        }
    },
    "খুলনা": { "id": "1_5U4yBsQGF7EbHojaPw_Z6Q5dbRLICcl", "districts": { "খুলনা": { "id": "", "upazilas": ["খুলনা সদর", "ডুমুরিয়া", "ফুলতলা", "দিঘলিয়া", "রূপসা", "তেরখাদা", "বটিয়াঘাটা", "পাইকগাছা", "কয়রা"] } } },
    "বরিশাল": { "id": "1yni9o8CMdfhF2-9w-p3gQv3Twn3YaLBp", "districts": { "বরিশাল": { "id": "", "upazilas": ["বরিশাল সদর", "বাকেরগঞ্জ", "বাবুগঞ্জ", "বানারীপাড়া", "গৌরনদী", "হিজলা", "মেহেন্দীগঞ্জ", "মুলাদী", "উজিরপুর", "আগৈলঝাড়া"] } } },
    "রাজশাহী": { "id": "1a5ez6IdKcJrIf9JvhMS64DJF3PRreT3t", "districts": { "রাজশাহী": { "id": "", "upazilas": ["পবা", "গোদাগাড়ী", "তানোর", "মোহনপুর", "বাগমারা", "দুর্গাপুর", "পুঠিয়া", "চারঘাট", "বাঘা"] } } },
    "সিলেট": { "id": "1LdqASB6vr8XXSoEOs7uCmXrJlKSJHoko", "districts": { "সিলেট": { "id": "", "upazilas": ["সিলেট সদর", "বিয়ানীবাজার", "গোলাপগঞ্জ", "ফেঞ্চুগঞ্জ", "বালাগঞ্জ", "কানাইঘাট", "জৈন্তাপুর", "গোয়াইনঘাট", "কোম্পানীগঞ্জ", "জকিগঞ্জ", "বিশ্বনাথ", "দক্ষিণ সুরমা", "ওসমানীনগর"] } } },
    "রংপুর": { "id": "15_2Ig47_ee8wpf7wtjv9ENg2hdiTfSMt", "districts": { "রংপুর": { "id": "", "upazilas": ["রংপুর সদর", "বদরগঞ্জ", "গঙ্গাচড়া", "কাউনিয়া", "মিঠাপুকুর", "পীরগাছা", "পীরগঞ্জ", "তারাগঞ্জ"] } } },
    "ময়মনসিংহ": { "id": "1O8Ua2fdTB2N5Df5fqIunRfY1rWgCHGkO", "districts": { "ময়মনসিংহ": { "id": "", "upazilas": ["ময়মনসিংহ সদর", "মুক্তাগাছা", "ফুলবাড়িয়া", "ত্রিশাল", "ভালুকা", "গফরগাঁও", "ঈশ্বরগঞ্জ", "নান্দাইল", "ফুলপুর", "তারাকান্দা", "হালুয়াঘাট", "ধোবাউড়া"] } } }
};

document.addEventListener('DOMContentLoaded', () => {
    const divisionSelect = document.getElementById('division');
    const districtSelect = document.getElementById('district');
    const upazilaSelect = document.getElementById('upazila');
    const viewBtn = document.getElementById('viewMap');
    const infoArea = document.getElementById('mapInfo');
    const searchInput = document.getElementById('moujaSearch');

    // Populate Divisions
    Object.keys(geoData).sort().forEach(div => divisionSelect.add(new Option(div, div)));

    // Division -> District
    divisionSelect.onchange = () => {
        districtSelect.innerHTML = '<option value="">জেলা নির্বাচন করুন</option>';
        upazilaSelect.innerHTML = '<option value="">উপজেলা নির্বাচন করুন</option>';
        const division = geoData[divisionSelect.value];
        if (division && division.districts) {
            Object.keys(division.districts).sort().forEach(dist => districtSelect.add(new Option(dist, dist)));
        }
    };

    // District -> Upazila
    districtSelect.onchange = () => {
        upazilaSelect.innerHTML = '<option value="">উপজেলা নির্বাচন করুন</option>';
        const division = geoData[divisionSelect.value];
        const district = division ? division.districts[districtSelect.value] : null;
        if (district && district.upazilas) {
            const upazilas = district.upazilas;
            if (Array.isArray(upazilas)) {
                upazilas.sort().forEach(upa => upazilaSelect.add(new Option(upa, upa)));
            } else {
                Object.keys(upazilas).sort().forEach(upa => upazilaSelect.add(new Option(upa, upa)));
            }
        }
    };

    const loadMapViewer = (locationName, folderId) => {
        const mapType = document.querySelector('input[name="mapType"]:checked').value;
        const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;

        infoArea.innerHTML = `
            <div class="animate-in">
                <div class="map-header d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded-4 shadow-sm">
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb mb-1">
                                <li class="breadcrumb-item text-primary">${divisionSelect.value}</li>
                                <li class="breadcrumb-item text-primary">${districtSelect.value}</li>
                                <li class="breadcrumb-item active">${locationName}</li>
                            </ol>
                        </nav>
                        <h3 class="fw-bold mb-0">${locationName} মৌজা ম্যাপ সংগ্রহ (${mapType})</h3>
                    </div>
                    <div class="d-flex gap-2">
                        <button onclick="window.print()" class="btn btn-light btn-sm rounded-pill border"><i class="fa-solid fa-print"></i></button>
                        <button onclick="location.reload()" class="btn btn-outline-danger btn-sm rounded-pill"><i class="fa-solid fa-xmark"></i></button>
                    </div>
                </div>

                <div class="viewer-main-container">
                    <div class="map-explorer-toolbar d-flex align-items-center justify-content-between px-4 py-2 bg-dark text-white rounded-top-4">
                        <span class="small"><i class="fa-solid fa-compass me-2"></i>ম্যাপ ভিউয়ার ও এক্সপ্লোরার</span>
                        <div class="d-flex gap-3 small">
                            <span><i class="fa-solid fa-mouse-pointer me-1"></i> ডাবল ক্লিক করে মৌজা ম্যাপটি বড় করুন</span>
                        </div>
                    </div>
                    <div class="map-iframe-wrapper shadow-lg border rounded-bottom-4 overflow-hidden">
                        <iframe src="${embedUrl}" width="100%" height="750" frameborder="0" style="background: white;"></iframe>
                    </div>
                </div>

                <div class="mt-4 row g-3 text-center">
                    <div class="col-md-4">
                        <div class="p-3 bg-white rounded-4 shadow-sm border-bottom border-4 border-success h-100">
                            <p class="text-muted mb-1 small">রেকর্ডের ধরন</p>
                            <h5 class="fw-bold mb-0">${mapType}</h5>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 bg-white rounded-4 shadow-sm border-bottom border-4 border-primary h-100">
                            <p class="text-muted mb-1 small">ম্যাপ ফরম্যাট</p>
                            <h5 class="fw-bold mb-0">HD (Image/PDF)</h5>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 bg-white rounded-4 shadow-sm border-bottom border-4 border-warning h-100">
                            <p class="text-muted mb-1 small">এলাকা</p>
                            <h5 class="fw-bold mb-0">${locationName}</h5>
                        </div>
                    </div>
                </div>
            </div>
        `;
    };

    viewBtn.onclick = () => {
        if (!upazilaSelect.value) {
            alert('দয়া করে বিভাগ, জেলা এবং উপজেলা নির্বাচন করুন!');
            return;
        }
        
        const division = geoData[divisionSelect.value];
        const district = division.districts[districtSelect.value];
        const upazila = district.upazilas[upazilaSelect.value];
        
        // Use Upazila ID if available, otherwise fallback to District ID
        const folderId = (typeof upazila === 'string' && upazila !== "") ? upazila : district.id;
        const locationName = upazilaSelect.value;
        
        loadMapViewer(locationName, folderId);
    };

    searchInput.onkeypress = (e) => {
        if (e.key === 'Enter' && searchInput.value.length > 2) {
            loadMapViewer(searchInput.value, geoData["ঢাকা"].id);
        }
    };
});
