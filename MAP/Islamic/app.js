document.addEventListener('DOMContentLoaded', () => {
    // === D3 Configuration ===
    const svg = d3.select('#map-svg');
    const zoomGroup = d3.select('#map-zoom-group');
    const basemapGroup = d3.select('#basemap');
    const pathsLayer = d3.select('#paths-layer');
    const markersLayer = d3.select('#markers-layer');
    const tooltip = d3.select('#tooltip');
    const mapContainer = document.getElementById('map-container');
    const sidePanel = document.getElementById('side-panel');
    const panelContent = document.getElementById('panel-content');
    
    // === State ===
    let viewMode = '2d'; 
    let searchQuery = '';
    let worldData = null;
    
    // Projections
    const projection2d = d3.geoMercator().scale(220).translate([600, 420]);
    const projection3d = d3.geoOrthographic().scale(250).translate([600, 300]).clipAngle(90);
    
    let currentProjection = projection2d;
    let pathGenerator = d3.geoPath().projection(currentProjection);

    // === Zoom & Drag Interactions ===
    const zoom = d3.zoom()
        .scaleExtent([1, 100])
        .filter(event => {
            if (viewMode === '3d') return event.type === 'wheel' || event.type === 'touchstart';
            return true;
        })
        .on('zoom', (event) => {
            if (viewMode === '2d') {
                zoomGroup.attr('transform', event.transform);
                updateVisuals(event.transform.k);
            } else {
                currentProjection.scale(250 * event.transform.k);
                refreshMap();
            }
            hideTooltip();
        });

    const drag = d3.drag().on('drag', (event) => {
        if (viewMode === '3d') {
            const r = currentProjection.rotate();
            const k = 75 / currentProjection.scale();
            currentProjection.rotate([r[0] + event.dx * k, r[1] - event.dy * k]);
            refreshMap();
        }
    });

    svg.call(zoom).call(drag);

    init();

    async function init() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
            worldData = await response.json();
            drawBasemap();
            render();
            document.getElementById('loading').style.display = 'none';
            const meFocus = d3.zoomIdentity.translate(-1900, -850).scale(7.5);
            svg.transition().duration(2000).call(zoom.transform, meFocus);
            setupEventListeners();
        } catch (err) {
            console.error(err);
            document.getElementById('loading').textContent = "লোড এরর!";
        }
    }

    function drawBasemap() {
        basemapGroup.selectAll('*').remove();
        if (viewMode === '3d') {
            basemapGroup.append('path').datum({type: 'Sphere'}).attr('class', 'ocean-sphere').attr('d', pathGenerator).attr('fill', 'var(--map-ocean)');
        }
        basemapGroup.selectAll('.country').data(worldData.features).enter().append('path').attr('class', 'country').attr('d', pathGenerator).style('fill', d => getCountryColor(d.properties.name)).style('stroke', 'var(--map-border)').style('stroke-width', '0.2px');
        if (viewMode === '2d') {
            basemapGroup.selectAll('.country-label').data(worldData.features).enter().append('text').attr('class', 'country-label').attr('transform', d => {
                const centroid = pathGenerator.centroid(d);
                return isNaN(centroid[0]) ? "translate(0,0)" : `translate(${centroid[0]}, ${centroid[1]})`;
            }).text(d => d.properties.name);
        }
    }

    function render() {
        pathsLayer.selectAll('*').remove();
        markersLayer.selectAll('*').remove();
        const filtered = mapData.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        const showBirths = document.getElementById('toggle-birthplaces').checked;
        const showMigrations = document.getElementById('toggle-migrations').checked;
        filtered.forEach(p => {
            if (showBirths) drawPin(p.birthplace, 'birth', p);
            if (showMigrations && p.migrations) {
                let prev = p.birthplace;
                p.migrations.forEach(m => { drawPath(prev, m); drawPin(m, 'migration', p); prev = m; });
            }
        });
        updateVisuals(d3.zoomTransform(svg.node()).k);
    }

    function drawPin(loc, type, prophet) {
        const coords = currentProjection([loc.lng, loc.lat]);
        if (!coords || (viewMode === '3d' && isHidden(loc))) return;
        const color = type === 'birth' ? 'var(--birth-color)' : 'var(--migration-color)';
        const pin = markersLayer.append('g').attr('class', 'marker-pin').attr('transform', `translate(${coords[0]}, ${coords[1]})`).on('mouseenter', (e) => showTooltip(e, prophet, {...loc, type})).on('mouseleave', hideTooltip).on('click', (e) => { e.stopPropagation(); showSidePanel(prophet); });
        const shape = pin.append('g').attr('class', 'pin-shape');
        shape.append('path').attr('d', 'M0,0 C-1 -1, -6 -9, -6 -13 A6,6 0 1,1 6,-13 C6,-9, 1,-1, 0,0 Z').style('fill', color).style('stroke', 'white').style('stroke-width', '1px');
        shape.append('circle').attr('cx', 0).attr('cy', -13).attr('r', 2).style('fill', 'white');
    }

    function drawPath(start, end) {
        if (viewMode === '3d' && isHidden(start) && isHidden(end)) return;
        const geojson = { type: "Feature", geometry: { type: "LineString", coordinates: [[start.lng, start.lat], [end.lng, end.lat]] } };
        pathsLayer.append('path').datum(geojson).attr('class', 'migration-path').attr('d', pathGenerator);
    }

    function isHidden(loc) {
        const r = currentProjection.rotate();
        const p = d3.geoDistance([loc.lng, loc.lat], [-r[0], -r[1]]);
        return p > Math.PI / 2;
    }

    function refreshMap() {
        basemapGroup.selectAll('.country').attr('d', pathGenerator);
        basemapGroup.selectAll('.ocean-sphere').attr('d', pathGenerator);
        render();
    }

    function updateVisuals(k) {
        const scaleInv = 1 / k;
        // Fix for 2D Labels growing too large
        if (viewMode === '2d') {
            basemapGroup.selectAll('.country-label')
                .style('font-size', (14 * scaleInv) + 'px') // Scale font inverse to zoom
                .style('stroke-width', (2 * scaleInv) + 'px')
                .style('opacity', k > 3 ? 0.9 : 0);
        }

        markersLayer.selectAll('.marker-pin').each(function() {
            const current = d3.select(this);
            const t = current.attr('transform').split('scale')[0];
            const baseScale = viewMode === '3d' ? 1.3 : 1.8;
            current.attr('transform', `${t} scale(${viewMode === '2d' ? scaleInv * baseScale : baseScale})`);
        });
        
        pathsLayer.selectAll('.migration-path').style('stroke-width', viewMode === '2d' ? 2 * scaleInv : 1.5);
    }

    function setupEventListeners() {
        d3.select('#view-toggle').on('click', function() {
            viewMode = viewMode === '2d' ? '3d' : '2d';
            this.textContent = viewMode === '3d' ? '🗺️ ২ডি' : '🌍 ৩ডি';
            currentProjection = viewMode === '3d' ? projection3d : projection2d;
            pathGenerator = d3.geoPath().projection(currentProjection);
            svg.transition().duration(1000).call(zoom.transform, d3.zoomIdentity);
            drawBasemap();
            render();
        });
        d3.select('#theme-toggle').on('click', () => {
            const html = d3.select('html');
            const next = html.attr('data-theme') === 'dark' ? 'light' : 'dark';
            html.attr('data-theme', next);
            d3.select('#theme-toggle').text(next === 'dark' ? '☀️' : '🌙');
        });
        searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; render(); });
        d3.select('#toggle-birthplaces').on('change', render);
        d3.select('#toggle-migrations').on('change', render);
        d3.select('#close-panel').on('click', () => sidePanel.classList.add('hidden'));
        svg.on('click', () => sidePanel.classList.add('hidden'));
    }

    function showTooltip(e, prophet, loc) {
        const rect = mapContainer.getBoundingClientRect();
        tooltip.html(`<strong>${prophet.name}</strong><br><small>${loc.name}</small>`)
            .style('left', (e.clientX - rect.left) + 'px')
            .style('top', (e.clientY - rect.top - 10) + 'px')
            .classed('hidden', false);
    }

    function hideTooltip() { tooltip.classed('hidden', true); }

    function showSidePanel(p) {
        const parentProphet = mapData.find(d => d.id === p.familyParent);
        panelContent.innerHTML = `
            <img src="${p.image}" class="panel-image" alt="${p.name}">
            <div style="padding: 0 1.5rem;">
                <h2>${p.name}</h2>
                <p style="margin-bottom:1.5rem; line-height:1.6; font-size: 1.05rem;">${p.description}</p>
                <div class="info-card"><h3>✨ বিশেষ মোজেজা</h3>${p.miracles.map(m => `<span class="miracle-badge">${m}</span>`).join('')}</div>
                ${p.books && p.books.length > 0 ? `<div class="info-card"><h3>📖 আসমানী কিতাব</h3><p>${p.books.join(', ')}</p></div>` : ''}
                <div class="info-card"><h3>🌳 বংশলতিকা</h3><p>পিতা: ${parentProphet ? `<span class="family-link" onclick="focusOn('${parentProphet.name}')">${parentProphet.name}</span>` : 'বর্ণিত নেই'}</p></div>
                <div class="info-card"><h3>📜 কুরআনিক রেফারেন্স</h3><div class="quran-box">${p.quranRefs}</div></div>
                <div class="info-card"><h3>📍 জন্মস্থান ও হিজরত</h3><strong>${p.birthplace.name}</strong>: ${p.birthplace.desc}${p.migrations.length > 0 ? `<br><br><strong>হিজরত:</strong><br>` + p.migrations.map(m => `• ${m.name}: ${m.desc}`).join('<br>') : ''}</div>
            </div>
        `;
        sidePanel.classList.remove('hidden');
    }
});

function focusOn(name) { alert(name + " এর তথ্যে যাচ্ছি..."); }

function getCountryColor(name) {
    const countryColors = { "Saudi Arabia": "#006C35", "Egypt": "#CE1126", "Iraq": "#007A3D", "Jordan": "#007A3D", "Turkey": "#E30A17", "Syria": "#CE1126", "Palestine": "#007A3D", "Israel": "#0038B8", "Yemen": "#CE1126", "Iran": "#239f40", "Pakistan": "#00401A", "Bangladesh": "#006a4e" };
    if (countryColors[name]) return countryColors[name];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return "#" + (hash & 0x00FFFFFF).toString(16).padEnd(6, '0');
}