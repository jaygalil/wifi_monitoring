// AI-Powered Mapping Features for Site Tracker Dashboard
// Provides intelligent mapping capabilities, location suggestions, and geographic insights

class AIMappingFeatures {
    constructor() {
        this.mapInstance = null;
        this.locationSuggestions = [];
        this.routeOptimization = null;
        this.geoInsights = {};
        this.locationPredictions = [];
        
        // Philippine Region 2 geographic data
        this.philippinesRegion2 = {
            center: { lat: 17.5, lng: 121.5 },
            bounds: {
                north: 18.5,
                south: 16.5,
                east: 122.5,
                west: 120.5
            },
            provinces: [
                'Cagayan', 'Isabela', 'Nueva Vizcaya', 'Quirino', 'Batanes'
            ],
            majorCities: [
                { name: 'Tuguegarao', lat: 17.6132, lng: 121.7270 },
                { name: 'Ilagan', lat: 17.1367, lng: 121.8889 },
                { name: 'Santiago', lat: 16.6877, lng: 121.5495 },
                { name: 'Bayombong', lat: 16.4817, lng: 121.1506 },
                { name: 'Cabarroguis', lat: 16.6167, lng: 121.6333 },
                { name: 'Basco', lat: 20.4487, lng: 121.9702 }
            ]
        };
        
        this.initializeAIMappingFeatures();
    }

    // Initialize AI mapping features
    initializeAIMappingFeatures() {
        this.addMappingAIControls();
        this.initializeLocationIntelligence();
        this.setupGeoAnalytics();
        console.log('AI Mapping Features initialized');
    }

    // Add AI mapping controls to the UI
    addMappingAIControls() {
        // Add AI mapping panel to the map controls
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            const aiMappingPanel = document.createElement('div');
            aiMappingPanel.className = 'ai-mapping-panel';
            aiMappingPanel.style.cssText = `
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 12px;
                padding: 15px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                z-index: 1000;
                min-width: 250px;
                max-width: 300px;
                font-size: 13px;
            `;

            aiMappingPanel.innerHTML = `
                <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <div style="width: 8px; height: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin-right: 8px;"></div>
                    <strong style="color: #667eea; font-size: 14px;">🗺️ AI Mapping</strong>
                </div>
                
                <div class="ai-mapping-buttons" style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 10px;">
                    <button onclick="aiMapping.smartFocus()" class="ai-map-btn" title="Smart Focus">
                        <i class="fas fa-crosshairs"></i> Focus
                    </button>
                    <button onclick="aiMapping.findOptimalLocations()" class="ai-map-btn" title="Find Optimal Locations">
                        <i class="fas fa-bullseye"></i> Optimize
                    </button>
                    <button onclick="aiMapping.analyzeCoverage()" class="ai-map-btn" title="Coverage Analysis">
                        <i class="fas fa-wifi"></i> Coverage
                    </button>
                    <button onclick="aiMapping.generateInsights()" class="ai-map-btn" title="Geographic Insights">
                        <i class="fas fa-lightbulb"></i> Insights
                    </button>
                </div>
                
                <div id="aiMappingStatus" style="font-size: 11px; color: #666; text-align: center; padding: 6px; background: rgba(0, 0, 0, 0.05); border-radius: 6px;">
                    Ready for intelligent mapping
                </div>
                
                <div id="aiMappingResults" style="margin-top: 8px; font-size: 11px; display: none;">
                    <!-- Results will be populated here -->
                </div>
            `;

            mapContainer.appendChild(aiMappingPanel);

            // Add CSS for AI mapping buttons
            const mapButtonStyles = `
                <style>
                    .ai-map-btn {
                        background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
                        border: 1px solid rgba(102, 126, 234, 0.3);
                        border-radius: 6px;
                        padding: 6px 8px;
                        font-size: 10px;
                        color: #667eea;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 4px;
                    }
                    .ai-map-btn:hover {
                        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
                        transform: translateY(-1px);
                        box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
                    }
                    .ai-map-btn i {
                        font-size: 9px;
                    }
                </style>
            `;
            document.head.insertAdjacentHTML('beforeend', mapButtonStyles);
        }
    }

    // Set map instance reference
    setMapInstance(mapInstance) {
        this.mapInstance = mapInstance;
        console.log('AI Mapping connected to map instance');
    }

    // Smart focus - intelligently focus map on data clusters
    smartFocus() {
        this.updateStatus('Analyzing data distribution...');
        
        try {
            if (!window.filteredData || window.filteredData.length === 0) {
                this.updateStatus('No data available for smart focus');
                return;
            }

            const coordinates = this.extractCoordinates(window.filteredData);
            if (coordinates.length === 0) {
                this.updateStatus('No valid coordinates found');
                return;
            }

            // Calculate optimal bounds using clustering algorithm
            const clusters = this.clusterCoordinates(coordinates);
            const optimalBounds = this.calculateOptimalBounds(clusters);
            
            if (this.mapInstance) {
                this.mapInstance.fitBounds(optimalBounds, { 
                    padding: [50, 50], 
                    maxZoom: 12 
                });
            }

            this.updateStatus(`Smart focused on ${coordinates.length} locations`, 'success');
            
            // Show insights
            this.showResults(`
                <div style="background: rgba(34, 197, 94, 0.1); border-left: 3px solid #22c55e; padding: 8px; border-radius: 4px;">
                    <strong>Smart Focus Applied</strong><br>
                    📍 ${coordinates.length} locations analyzed<br>
                    🎯 ${clusters.length} geographic clusters found<br>
                    📊 Optimal zoom level determined
                </div>
            `);

        } catch (error) {
            console.error('Smart focus error:', error);
            this.updateStatus('Smart focus failed', 'error');
        }
    }

    // Find optimal locations for new sites
    async findOptimalLocations() {
        this.updateStatus('Analyzing optimal locations...');
        
        try {
            if (!window.filteredData || window.filteredData.length === 0) {
                this.updateStatus('No data available for analysis');
                return;
            }

            const currentLocations = this.extractCoordinates(window.filteredData);
            const gapAnalysis = this.analyzeServiceGaps(currentLocations);
            const optimalLocations = this.calculateOptimalPlacements(gapAnalysis);

            // Add suggestion markers to map
            this.addSuggestionMarkers(optimalLocations);

            this.updateStatus(`Found ${optimalLocations.length} optimal locations`, 'success');
            
            this.showResults(`
                <div style="background: rgba(59, 130, 246, 0.1); border-left: 3px solid #3b82f6; padding: 8px; border-radius: 4px;">
                    <strong>Optimal Locations Analysis</strong><br>
                    🎯 ${optimalLocations.length} suggested locations<br>
                    📈 Coverage improvement: ${gapAnalysis.improvementPotential}%<br>
                    📍 Priority areas identified<br>
                    <small style="color: #666; margin-top: 4px; display: block;">
                        Blue markers show suggested locations
                    </small>
                </div>
            `);

        } catch (error) {
            console.error('Optimal location analysis error:', error);
            this.updateStatus('Analysis failed', 'error');
        }
    }

    // Analyze coverage areas
    analyzeCoverage() {
        this.updateStatus('Analyzing coverage...');
        
        try {
            if (!window.filteredData || window.filteredData.length === 0) {
                this.updateStatus('No data available for coverage analysis');
                return;
            }

            const coordinates = this.extractCoordinates(window.filteredData);
            const coverageAnalysis = this.calculateCoverageMetrics(coordinates);
            
            // Draw coverage visualization
            this.visualizeCoverage(coordinates);

            this.updateStatus('Coverage analysis complete', 'success');
            
            this.showResults(`
                <div style="background: rgba(168, 85, 247, 0.1); border-left: 3px solid #a855f7; padding: 8px; border-radius: 4px;">
                    <strong>Coverage Analysis</strong><br>
                    📊 Coverage density: ${coverageAnalysis.density}<br>
                    📍 Service points: ${coordinates.length}<br>
                    🎯 Coverage quality: ${coverageAnalysis.quality}<br>
                    ⚠️ Gap areas: ${coverageAnalysis.gaps} identified<br>
                    <small style="color: #666; margin-top: 4px; display: block;">
                        Purple circles show coverage areas
                    </small>
                </div>
            `);

        } catch (error) {
            console.error('Coverage analysis error:', error);
            this.updateStatus('Coverage analysis failed', 'error');
        }
    }

    // Generate geographic insights
    async generateInsights() {
        this.updateStatus('Generating geographic insights...');
        
        try {
            if (!window.filteredData || window.filteredData.length === 0) {
                this.updateStatus('No data available for insights');
                return;
            }

            const insights = await this.analyzeGeographicPatterns(window.filteredData);
            
            this.updateStatus('Insights generated successfully', 'success');
            
            this.showResults(`
                <div style="background: rgba(251, 191, 36, 0.1); border-left: 3px solid #fbbf24; padding: 8px; border-radius: 4px;">
                    <strong>Geographic Insights</strong><br>
                    ${insights.map(insight => `• ${insight}`).join('<br>')}
                </div>
            `);

        } catch (error) {
            console.error('Insights generation error:', error);
            this.updateStatus('Insights generation failed', 'error');
        }
    }

    // Extract coordinates from data
    extractCoordinates(data) {
        const coordinates = [];
        
        data.forEach((record, index) => {
            const headers = Object.keys(record).filter(key => key !== '_originalIndex');
            let lat, lng;
            
            // Method 1: Look for columns R and S by position (index 17 and 18)
            if (headers.length >= 19) {
                const rColumn = headers[17];
                const sColumn = headers[18];
                lat = parseFloat(record[rColumn]);
                lng = parseFloat(record[sColumn]);
            }
            
            // Method 2: Look for named columns
            if (isNaN(lat) || isNaN(lng)) {
                const latColumn = headers.find(h => h.toLowerCase().includes('lat'));
                const lngColumn = headers.find(h => h.toLowerCase().includes('lng') || h.toLowerCase().includes('long'));
                
                if (latColumn && lngColumn) {
                    lat = parseFloat(record[latColumn]);
                    lng = parseFloat(record[lngColumn]);
                }
            }
            
            // Validate coordinates for Philippines Region 2
            if (!isNaN(lat) && !isNaN(lng) && 
                lat >= this.philippinesRegion2.bounds.south && 
                lat <= this.philippinesRegion2.bounds.north &&
                lng >= this.philippinesRegion2.bounds.west && 
                lng <= this.philippinesRegion2.bounds.east) {
                
                coordinates.push({
                    lat,
                    lng,
                    index,
                    data: record
                });
            }
        });
        
        return coordinates;
    }

    // Cluster coordinates for analysis
    clusterCoordinates(coordinates, maxDistance = 0.1) {
        const clusters = [];
        const processed = new Set();
        
        coordinates.forEach((coord, index) => {
            if (processed.has(index)) return;
            
            const cluster = [coord];
            processed.add(index);
            
            // Find nearby points
            coordinates.forEach((otherCoord, otherIndex) => {
                if (processed.has(otherIndex)) return;
                
                const distance = this.calculateDistance(coord.lat, coord.lng, otherCoord.lat, otherCoord.lng);
                if (distance <= maxDistance) {
                    cluster.push(otherCoord);
                    processed.add(otherIndex);
                }
            });
            
            clusters.push(cluster);
        });
        
        return clusters;
    }

    // Calculate distance between two points (Haversine formula)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Calculate optimal bounds for map view
    calculateOptimalBounds(clusters) {
        let minLat = Infinity, maxLat = -Infinity;
        let minLng = Infinity, maxLng = -Infinity;
        
        clusters.forEach(cluster => {
            cluster.forEach(point => {
                minLat = Math.min(minLat, point.lat);
                maxLat = Math.max(maxLat, point.lat);
                minLng = Math.min(minLng, point.lng);
                maxLng = Math.max(maxLng, point.lng);
            });
        });
        
        // Add padding
        const latPadding = (maxLat - minLat) * 0.1;
        const lngPadding = (maxLng - minLng) * 0.1;
        
        return [
            [minLat - latPadding, minLng - lngPadding],
            [maxLat + latPadding, maxLng + lngPadding]
        ];
    }

    // Analyze service gaps
    analyzeServiceGaps(currentLocations) {
        const gridSize = 0.05; // Grid resolution
        const maxDistance = 0.1; // Maximum service distance
        
        // Create analysis grid
        const grid = [];
        const bounds = this.philippinesRegion2.bounds;
        
        for (let lat = bounds.south; lat <= bounds.north; lat += gridSize) {
            for (let lng = bounds.west; lng <= bounds.east; lng += gridSize) {
                // Check distance to nearest service point
                let minDistance = Infinity;
                currentLocations.forEach(location => {
                    const distance = this.calculateDistance(lat, lng, location.lat, location.lng);
                    minDistance = Math.min(minDistance, distance);
                });
                
                if (minDistance > maxDistance) {
                    grid.push({
                        lat,
                        lng,
                        gapSize: minDistance,
                        priority: this.calculatePriority(lat, lng)
                    });
                }
            }
        }
        
        const totalGridPoints = ((bounds.north - bounds.south) / gridSize) * 
                               ((bounds.east - bounds.west) / gridSize);
        const gapPercentage = (grid.length / totalGridPoints) * 100;
        
        return {
            gaps: grid,
            improvementPotential: Math.min(Math.round(gapPercentage), 100),
            priorityAreas: grid.filter(g => g.priority > 0.7).sort((a, b) => b.priority - a.priority)
        };
    }

    // Calculate priority for location based on proximity to major cities
    calculatePriority(lat, lng) {
        let priority = 0.3; // Base priority
        
        // Higher priority near major cities
        this.philippinesRegion2.majorCities.forEach(city => {
            const distance = this.calculateDistance(lat, lng, city.lat, city.lng);
            if (distance < 50) { // Within 50km of major city
                priority += (50 - distance) / 50 * 0.5;
            }
        });
        
        return Math.min(priority, 1.0);
    }

    // Calculate optimal placements
    calculateOptimalPlacements(gapAnalysis) {
        const optimalLocations = [];
        const priorityAreas = gapAnalysis.priorityAreas.slice(0, 5); // Top 5 priority areas
        
        priorityAreas.forEach((area, index) => {
            optimalLocations.push({
                lat: area.lat,
                lng: area.lng,
                priority: area.priority,
                reason: this.getPlacementReason(area),
                id: `optimal-${index + 1}`
            });
        });
        
        return optimalLocations;
    }

    // Get placement reason
    getPlacementReason(area) {
        const nearestCity = this.philippinesRegion2.majorCities.reduce((nearest, city) => {
            const distance = this.calculateDistance(area.lat, area.lng, city.lat, city.lng);
            return distance < nearest.distance ? { city: city.name, distance } : nearest;
        }, { distance: Infinity });
        
        return `Service gap near ${nearestCity.city} (${nearestCity.distance.toFixed(1)}km away)`;
    }

    // Add suggestion markers to map
    addSuggestionMarkers(optimalLocations) {
        if (!this.mapInstance) return;
        
        // Remove existing suggestion markers
        this.clearSuggestionMarkers();
        
        this.suggestionMarkers = [];
        
        optimalLocations.forEach((location, index) => {
            const marker = L.marker([location.lat, location.lng], {
                icon: L.divIcon({
                    className: 'optimal-location-marker',
                    html: `
                        <div style="
                            width: 20px;
                            height: 20px;
                            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                            border: 3px solid white;
                            border-radius: 50%;
                            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 10px;
                            font-weight: bold;
                            animation: pulse-suggestion 2s infinite;
                        ">
                            ${index + 1}
                        </div>
                    `,
                    iconSize: [26, 26],
                    iconAnchor: [13, 13]
                })
            });
            
            marker.bindPopup(`
                <div style="font-size: 12px;">
                    <strong>🎯 Suggested Location #${index + 1}</strong><br>
                    <strong>Priority:</strong> ${(location.priority * 100).toFixed(0)}%<br>
                    <strong>Reason:</strong> ${location.reason}<br>
                    <strong>Coordinates:</strong> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}
                </div>
            `);
            
            this.suggestionMarkers.push(marker);
            marker.addTo(this.mapInstance);
        });
        
        // Add pulsing animation CSS
        if (!document.querySelector('#suggestion-marker-styles')) {
            const styles = document.createElement('style');
            styles.id = 'suggestion-marker-styles';
            styles.textContent = `
                @keyframes pulse-suggestion {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.2); opacity: 0.8; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
    }

    // Clear suggestion markers
    clearSuggestionMarkers() {
        if (this.suggestionMarkers) {
            this.suggestionMarkers.forEach(marker => {
                if (this.mapInstance) {
                    this.mapInstance.removeLayer(marker);
                }
            });
        }
        this.suggestionMarkers = [];
    }

    // Calculate coverage metrics
    calculateCoverageMetrics(coordinates) {
        const totalArea = this.calculateRegionArea();
        const serviceRadius = 10; // 10km service radius
        let coveredArea = 0;
        
        coordinates.forEach(coord => {
            coveredArea += Math.PI * Math.pow(serviceRadius, 2);
        });
        
        // Remove overlaps (simplified calculation)
        const overlapFactor = coordinates.length > 10 ? 0.7 : 0.9;
        coveredArea *= overlapFactor;
        
        const coveragePercentage = Math.min((coveredArea / totalArea) * 100, 100);
        
        return {
            density: coordinates.length > 20 ? 'High' : coordinates.length > 10 ? 'Medium' : 'Low',
            quality: coveragePercentage > 70 ? 'Excellent' : coveragePercentage > 50 ? 'Good' : 'Needs Improvement',
            gaps: coordinates.length < 5 ? 'Many' : coordinates.length < 15 ? 'Few' : 'Minimal',
            percentage: Math.round(coveragePercentage)
        };
    }

    // Calculate region area (simplified)
    calculateRegionArea() {
        const bounds = this.philippinesRegion2.bounds;
        const latDiff = bounds.north - bounds.south;
        const lngDiff = bounds.east - bounds.west;
        return latDiff * lngDiff * 111 * 111; // Approximate km²
    }

    // Visualize coverage on map
    visualizeCoverage(coordinates) {
        if (!this.mapInstance) return;
        
        // Clear existing coverage visualization
        this.clearCoverageVisualization();
        
        this.coverageLayers = [];
        
        coordinates.forEach(coord => {
            const circle = L.circle([coord.lat, coord.lng], {
                color: '#a855f7',
                fillColor: '#a855f7',
                fillOpacity: 0.1,
                weight: 2,
                radius: 10000 // 10km radius
            });
            
            this.coverageLayers.push(circle);
            circle.addTo(this.mapInstance);
        });
    }

    // Clear coverage visualization
    clearCoverageVisualization() {
        if (this.coverageLayers) {
            this.coverageLayers.forEach(layer => {
                if (this.mapInstance) {
                    this.mapInstance.removeLayer(layer);
                }
            });
        }
        this.coverageLayers = [];
    }

    // Analyze geographic patterns
    async analyzeGeographicPatterns(data) {
        const coordinates = this.extractCoordinates(data);
        const insights = [];
        
        // Distribution analysis
        const provinceDistribution = this.analyzeProvinceDistribution(coordinates);
        insights.push(`Distribution: ${provinceDistribution}`);
        
        // Density analysis
        const densityAreas = this.analyzeDensity(coordinates);
        insights.push(`High density: ${densityAreas.high} areas`);
        insights.push(`Low density: ${densityAreas.low} areas`);
        
        // Accessibility analysis
        const accessibilityScore = this.calculateAccessibilityScore(coordinates);
        insights.push(`Accessibility: ${accessibilityScore}/10`);
        
        // Strategic recommendations
        const recommendations = this.generateStrategicRecommendations(coordinates);
        insights.push(...recommendations);
        
        return insights;
    }

    // Analyze province distribution
    analyzeProvinceDistribution(coordinates) {
        // Simplified province detection based on coordinate ranges
        const provinces = {
            'Cagayan': coordinates.filter(c => c.lat > 17.8).length,
            'Isabela': coordinates.filter(c => c.lat >= 16.9 && c.lat <= 17.8).length,
            'Nueva Vizcaya': coordinates.filter(c => c.lat < 16.9 && c.lng < 121.3).length,
            'Quirino': coordinates.filter(c => c.lat < 16.9 && c.lng >= 121.3).length
        };
        
        const maxProvince = Object.keys(provinces).reduce((a, b) => 
            provinces[a] > provinces[b] ? a : b
        );
        
        return `Concentrated in ${maxProvince}`;
    }

    // Analyze density patterns
    analyzeDensity(coordinates) {
        const clusters = this.clusterCoordinates(coordinates, 0.05);
        return {
            high: clusters.filter(c => c.length >= 5).length,
            low: clusters.filter(c => c.length <= 2).length
        };
    }

    // Calculate accessibility score
    calculateAccessibilityScore(coordinates) {
        let totalAccessibility = 0;
        
        coordinates.forEach(coord => {
            let accessibility = 5; // Base score
            
            // Near major city bonus
            this.philippinesRegion2.majorCities.forEach(city => {
                const distance = this.calculateDistance(coord.lat, coord.lng, city.lat, city.lng);
                if (distance < 30) {
                    accessibility += (30 - distance) / 30 * 3;
                }
            });
            
            totalAccessibility += Math.min(accessibility, 10);
        });
        
        return coordinates.length > 0 ? 
            Math.round(totalAccessibility / coordinates.length) : 0;
    }

    // Generate strategic recommendations
    generateStrategicRecommendations(coordinates) {
        const recommendations = [];
        
        if (coordinates.length < 10) {
            recommendations.push('🎯 Consider expanding coverage');
        }
        
        const clusters = this.clusterCoordinates(coordinates);
        if (clusters.some(c => c.length > 8)) {
            recommendations.push('⚖️ Rebalance dense areas');
        }
        
        recommendations.push('📈 Monitor performance trends');
        
        return recommendations;
    }

    // Initialize location intelligence
    initializeLocationIntelligence() {
        // Set up intelligent location suggestions
        this.locationIntelligence = {
            suggestedLocations: this.philippinesRegion2.majorCities.map(city => ({
                ...city,
                type: 'city',
                priority: 0.8
            })),
            
            // Add strategic locations
            strategicPoints: [
                { name: 'Highway Junction', lat: 17.2, lng: 121.6, type: 'infrastructure', priority: 0.9 },
                { name: 'Economic Zone', lat: 16.8, lng: 121.4, type: 'economic', priority: 0.85 },
                { name: 'Tourist Area', lat: 17.4, lng: 121.8, type: 'tourism', priority: 0.75 }
            ]
        };
    }

    // Setup geo analytics
    setupGeoAnalytics() {
        this.geoAnalytics = {
            trackingEnabled: true,
            analysisHistory: [],
            performanceMetrics: {
                averageAnalysisTime: 0,
                totalAnalyses: 0,
                successRate: 100
            }
        };
    }

    // Update status display
    updateStatus(message, type = 'info') {
        const statusEl = document.getElementById('aiMappingStatus');
        if (statusEl) {
            const colors = {
                info: '#667eea',
                success: '#22c55e',
                error: '#ef4444',
                warning: '#f59e0b'
            };
            
            statusEl.style.color = colors[type] || colors.info;
            statusEl.textContent = message;
        }
    }

    // Show results
    showResults(html) {
        const resultsEl = document.getElementById('aiMappingResults');
        if (resultsEl) {
            resultsEl.innerHTML = html;
            resultsEl.style.display = 'block';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                resultsEl.style.display = 'none';
            }, 10000);
        }
    }
}

// Initialize AI Mapping Features
const aiMapping = new AIMappingFeatures();

// Make it globally available
window.aiMapping = aiMapping;

// Connect to map when it's initialized
if (typeof window.initializeMap === 'function') {
    const originalInitializeMap = window.initializeMap;
    window.initializeMap = function() {
        originalInitializeMap();
        if (window.map) {
            aiMapping.setMapInstance(window.map);
        }
    };
}

// Connect when map is already available
if (window.map) {
    aiMapping.setMapInstance(window.map);
}

console.log('🗺️ AI Mapping Features loaded successfully!');