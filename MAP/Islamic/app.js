document.addEventListener('DOMContentLoaded', () => {
    // === D3 Configuration ===
    const svg = d3.select('#map-svg');
    const zoomGroup = d3.select('#map-zoom-group');
    const basemapGroup = d3.select('#basemap');
    const pathsLayer = d3.select('#paths-layer');
    const markersLayer = d3.select('#markers-layer');
    const tooltip = d3.select('#tooltip');
    const mapContainer = document.getElementById('map-container');
    
    // UI Elements
    const sidePanel = document.getElementById('side-panel');
    const panelContent = document.getElementById('panel-content');
    const searchInput = document.getElementById('prophet-search');
    
    // Projection
    const projection = d3.geoMercator()
        .scale(220)
        .translate([600, 420]);
    
    const pathGenerator = d3.geoPath().projection(projection);

    const zoom = d3.zoom()
        .scaleExtent([1, 80])
        .on('zoom', (event) => {
            zoomGroup.attr('transform', event.transform);
            updateVisuals(event.transform.k);
            hideTooltip();
        });

    svg.call(zoom);

    let searchQuery = '';
    let worldData = null;

    // --- Flag Color Dictionary ---
    const countryColors = {
        "Saudi Arabia": "#006C35", "Egypt": "#CE1126", "Iraq": "#007A3D", "Jordan": "#007A3D",
        "Turkey": "#E30A17", "Syria": "#CE1126", "Palestine": "#007A3D", "Israel": "#0038B8",
        "Yemen": "#CE1126", "Oman": "#D01022", "United Arab Emirates": "#00732F", "Iran": "#239f40",
        "Pakistan": "#00401A", "Bangladesh": "#006a4e", "India": "#FF9933"
    };

    function getCountryColor(name) {
        if (countryColors[name]) return countryColors[name];
        let hash = 0;
        for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
        const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
        return "#" + "00000".substring(0, 6 - c.length) + c;
    }

    init();

    async function init() {
        try {
            const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
            worldData = await response.json();
            drawBasemap();
            render();
            document.getElementById('loading').style.display = 'none';
            
            // Initial Focus on Middle East
            const meFocus = d3.zoomIdentity.translate(-1900, -850).scale(7.5);
            svg.transition().duration(2000).call(zoom.transform, meFocus);
            
            setupEventListeners();
        } catch (err) {
            console.error(err);
            document.getElementById('loading').textContent = "মানচিত্র লোড করতে সমস্যা হয়েছে।";
        }
    }

    function drawBasemap() {
        basemapGroup.selectAll('path')
            .data(worldData.features)
            .enter()
            .append('path')
            .attr('d', pathGenerator)
            .attr('class', 'country')
            .style('fill', d => getCountryColor(d.properties.name));

        basemapGroup.selectAll('text')
            .data(worldData.features)
            .enter()
            .append('text')
            .attr('class', 'country-label')
            .attr('transform', d => {
                const centroid = pathGenerator.centroid(d);
                if (isNaN(centroid[0]) || isNaN(centroid[1])) return "translate(0,0)";
                return `translate(${centroid[0]}, ${centroid[1]})`;
            })
            .text(d => d.properties.name);
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
                p.migrations.forEach((m, i) => {
                    drawAnimatedPath(prev, m, i);
                    drawPin(m, 'migration', p);
                    prev = m;
                });
            }
        });

        updateVisuals(d3.zoomTransform(svg.node()).k);
    }

    function drawPin(location, type, prophet) {
        const [x, y] = projection([location.lng, location.lat]);
        const color = type === 'birth' ? 'var(--birth-color)' : 'var(--migration-color)';
        
        const pinGroup = markersLayer.append('g')
            .attr('class', 'marker-pin')
            .attr('transform', `translate(${x}, ${y})`)
            .on('mouseenter', (e) => {
                showTooltip(e, prophet, { ...location, type });
            })
            .on('mouseleave', () => {
                hideTooltip();
            })
            .on('click', (e) => {
                e.stopPropagation();
                showSidePanel(prophet);
            });

        const pinShape = pinGroup.append('g').attr('class', 'pin-shape');

        // Drop Shape
        pinShape.append('path')
            .attr('d', 'M0,0 C-1 -1, -6 -9, -6 -13 A6,6 0 1,1 6,-13 C6,-9, 1,-1, 0,0 Z')
            .style('fill', color)
            .style('stroke', 'white')
            .style('stroke-width', '1px');

        // Inner white dot
        pinShape.append('circle')
            .attr('cx', 0)
            .attr('cy', -13)
            .attr('r', 2)
            .style('fill', 'white');
    }

    function drawAnimatedPath(start, end, index) {
        const lineGenerator = d3.line()
            .curve(d3.curveBundle.beta(0.6))
            .x(d => projection(d)[0])
            .y(d => projection(d)[1]);

        const midLng = (start.lng + end.lng) / 2;
        const midLat = Math.max(start.lat, end.lat) + (Math.abs(start.lng - end.lng) * 0.1); 
        const curvePoints = [ [start.lng, start.lat], [midLng, midLat], [end.lng, end.lat] ];

        const path = pathsLayer.append('path')
            .datum(curvePoints)
            .attr('d', lineGenerator)
            .attr('class', 'migration-path');

        const totalLength = path.node().getTotalLength();
        path.attr('stroke-dasharray', totalLength + " " + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .delay(index * 600)
            .attr('stroke-dashoffset', 0)
            .on('end', () => {
                path.attr('stroke-dasharray', "5,5");
            });
    }

    function updateVisuals(k) {
        const scaleInv = 1 / k;
        // Moderate constant size scaling
        markersLayer.selectAll('.marker-pin').each(function() {
            const current = d3.select(this);
            const transform = current.attr('transform');
            const translate = transform.split('scale')[0];
            current.attr('transform', `${translate} scale(${scaleInv * 1.8})`);
        });

        pathsLayer.selectAll('.migration-path').style('stroke-width', 2 * scaleInv);
        basemapGroup.selectAll('.country').style('stroke-width', 0.5 * scaleInv);
        basemapGroup.selectAll('.country-label').style('font-size', (7 * scaleInv) + 'px').style('stroke-width', (2 * scaleInv) + 'px').style('opacity', k > 3 ? 0.9 : 0); 
    }

    function setupEventListeners() {
        d3.select('#theme-toggle').on('click', () => {
            const html = d3.select('html');
            const current = html.attr('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.attr('data-theme', next);
            d3.select('#theme-toggle').text(next === 'dark' ? '☀️' : '🌙');
        });
        d3.select('#toggle-birthplaces').on('change', render);
        d3.select('#toggle-migrations').on('change', render);
        searchInput.addEventListener('input', (e) => { searchQuery = e.target.value; render(); });
        d3.select('#close-panel').on('click', () => { sidePanel.classList.add('hidden'); });
        svg.on('click', () => { sidePanel.classList.add('hidden'); });
    }

    function showTooltip(e, prophet, location) {
        const isBirth = location.type === 'birth';
        const rect = mapContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        tooltip.html(`
            <div>
                <strong style="font-size: 1.1rem; color: var(--accent-color);">${prophet.name}</strong>
                <span style="display:inline-block; margin: 4px 0; padding: 1px 6px; border-radius: 3px; background: ${isBirth ? 'var(--birth-color)' : 'var(--migration-color)'}; color: white; font-size: 0.75rem;">
                    ${isBirth ? 'আদি স্থান' : 'হিজরত'}: ${location.name}
                </span>
                <p style="margin-top:6px; font-size:0.9rem; line-height:1.4; color: var(--text-color); font-weight: 500;">
                    ${location.desc}
                </p>
            </div>
        `)
        .style('left', x + 'px')
        .style('top', (y - 10) + 'px')
        .style('display', 'block');
    }

    function hideTooltip() { 
        tooltip.style('display', 'none'); 
    }

    function showSidePanel(prophet) {
        const migrationsHTML = prophet.migrations.map(m => `<div class="timeline-item"><strong>গন্তব্য: ${m.name}</strong><p>${m.desc}</p></div>`).join('');
        panelContent.innerHTML = `<h2>${prophet.name}</h2><p style="font-size:1.1rem; line-height:1.6;">${prophet.description}</p><h3>আদি স্থান / জন্মস্থান</h3><div class="timeline-item"><strong>${prophet.birthplace.name}</strong><p>${prophet.birthplace.desc}</p></div><h3>হিজরত ও ভ্রমণ</h3>${migrationsHTML || '<p>কোনো হিজরতের তথ্য নেই।</p>'}`;
        sidePanel.classList.remove('hidden');
    }
});