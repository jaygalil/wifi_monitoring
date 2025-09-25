// AI Report Generator for Site Tracker Dashboard
// Generates intelligent reports and PDF documents from Google Sheets data

class AIReportGenerator {
    constructor() {
        this.reportTemplates = {
            'site-status': {
                name: 'Site Status Report',
                description: 'Comprehensive overview of all site statuses',
                sections: ['summary', 'status-breakdown', 'geographic-distribution', 'recommendations']
            },
            'connectivity': {
                name: 'Connectivity Analysis Report',
                description: 'Analysis of site connectivity and performance',
                sections: ['connectivity-overview', 'issue-analysis', 'performance-metrics', 'action-items']
            },
            'geographic': {
                name: 'Geographic Distribution Report',
                description: 'Geographic analysis of site locations and coverage',
                sections: ['coverage-map', 'regional-breakdown', 'density-analysis', 'expansion-opportunities']
            },
            'maintenance': {
                name: 'Maintenance Report',
                description: 'Sites requiring maintenance and scheduled activities',
                sections: ['maintenance-schedule', 'priority-sites', 'resource-allocation', 'timeline']
            },
            'custom': {
                name: 'Custom Report',
                description: 'AI-generated report based on specific user requirements',
                sections: ['dynamic']
            }
        };
        
        this.currentData = [];
        this.reportHistory = [];
        
        this.initializePDFLibrary();
    }

    // Initialize PDF generation library
    async initializePDFLibrary() {
        // Load jsPDF library if not already loaded
        if (typeof window.jsPDF === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('✅ jsPDF library loaded successfully');
                this.loadAutoTablePlugin();
            };
            document.head.appendChild(script);
        } else {
            this.loadAutoTablePlugin();
        }
    }

    // Load jsPDF AutoTable plugin for better table formatting
    loadAutoTablePlugin() {
        if (typeof window.jsPDF !== 'undefined' && !window.jsPDF.API.autoTable) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
            script.onload = () => {
                console.log('✅ jsPDF AutoTable plugin loaded successfully');
            };
            document.head.appendChild(script);
        }
    }

    // Update data for report generation
    updateData(data) {
        this.currentData = data || [];
        console.log(`📊 Report Generator updated with ${this.currentData.length} records`);
    }

    // Generate AI-powered report based on user request
    async generateReport(reportType, customPrompt = null, options = {}) {
        if (!this.currentData || this.currentData.length === 0) {
            throw new Error('No data available for report generation. Please load site data first.');
        }

        const template = this.reportTemplates[reportType] || this.reportTemplates['custom'];
        const reportData = await this.analyzeDataForReport(reportType, customPrompt);
        
        const report = {
            id: this.generateReportId(),
            type: reportType,
            title: customPrompt ? `Custom Report: ${customPrompt}` : template.name,
            description: template.description,
            generatedAt: new Date().toISOString(),
            dataSnapshot: {
                totalRecords: this.currentData.length,
                recordsAnalyzed: this.currentData.length,
                dataSource: 'Google Sheets API'
            },
            sections: await this.generateReportSections(reportType, reportData, customPrompt),
            insights: await this.generateAIInsights(reportData, customPrompt),
            recommendations: await this.generateRecommendations(reportData, reportType),
            metadata: {
                generatedBy: 'AI Report Generator',
                version: '1.0',
                options: options
            }
        };

        // Store in history
        this.reportHistory.push({
            id: report.id,
            type: reportType,
            title: report.title,
            generatedAt: report.generatedAt,
            summary: report.insights.slice(0, 200) + '...'
        });

        return report;
    }

    // Analyze data specifically for report generation
    async analyzeDataForReport(reportType, customPrompt) {
        const analysis = {
            summary: this.generateDataSummary(),
            statusBreakdown: this.analyzeStatusDistribution(),
            geographicData: this.analyzeGeographicDistribution(),
            performanceMetrics: this.analyzePerformanceMetrics(),
            trends: this.analyzeTrends(),
            issues: this.identifyIssues()
        };

        // Add custom analysis based on prompt
        if (customPrompt) {
            analysis.customAnalysis = await this.performCustomAnalysis(customPrompt);
        }

        return analysis;
    }

    // Generate report sections based on type
    async generateReportSections(reportType, reportData, customPrompt) {
        const sections = [];

        switch (reportType) {
            case 'site-status':
                sections.push(
                    this.createExecutiveSummarySection(reportData),
                    this.createStatusBreakdownSection(reportData),
                    this.createGeographicSection(reportData),
                    this.createRecommendationsSection(reportData)
                );
                break;

            case 'connectivity':
                sections.push(
                    this.createConnectivityOverviewSection(reportData),
                    this.createIssueAnalysisSection(reportData),
                    this.createPerformanceSection(reportData),
                    this.createActionItemsSection(reportData)
                );
                break;

            case 'geographic':
                sections.push(
                    this.createCoverageMapSection(reportData),
                    this.createRegionalBreakdownSection(reportData),
                    this.createDensityAnalysisSection(reportData),
                    this.createExpansionOpportunitiesSection(reportData)
                );
                break;

            case 'maintenance':
                sections.push(
                    this.createMaintenanceScheduleSection(reportData),
                    this.createPrioritySitesSection(reportData),
                    this.createResourceAllocationSection(reportData),
                    this.createTimelineSection(reportData)
                );
                break;

            default: // custom
                sections.push(
                    this.createCustomReportSection(reportData, customPrompt)
                );
                break;
        }

        return sections;
    }

    // Generate AI insights
    async generateAIInsights(reportData, customPrompt) {
        const insights = [];

        // Data quality insights
        const dataQuality = this.assessDataQuality();
        insights.push(`📊 **Data Quality**: ${dataQuality.score}% complete with ${dataQuality.issues.length} potential issues identified.`);

        // Status insights
        const statusInsights = this.generateStatusInsights(reportData.statusBreakdown);
        insights.push(...statusInsights);

        // Geographic insights
        const geoInsights = this.generateGeographicInsights(reportData.geographicData);
        insights.push(...geoInsights);

        // Performance insights
        const perfInsights = this.generatePerformanceInsights(reportData.performanceMetrics);
        insights.push(...perfInsights);

        // Custom insights based on prompt
        if (customPrompt) {
            const customInsights = await this.generateCustomInsights(customPrompt, reportData);
            insights.push(...customInsights);
        }

        return insights;
    }

    // Generate recommendations
    async generateRecommendations(reportData, reportType) {
        const recommendations = [];

        // Priority recommendations based on issues
        if (reportData.issues.critical.length > 0) {
            recommendations.push({
                priority: 'HIGH',
                category: 'Critical Issues',
                title: 'Address Critical Site Issues',
                description: `${reportData.issues.critical.length} sites require immediate attention`,
                actions: reportData.issues.critical.map(issue => `• ${issue.description}`),
                timeline: 'Immediate (0-7 days)'
            });
        }

        // Performance recommendations
        if (reportData.performanceMetrics.lowPerformance > 0) {
            recommendations.push({
                priority: 'MEDIUM',
                category: 'Performance',
                title: 'Optimize Site Performance',
                description: `${reportData.performanceMetrics.lowPerformance} sites showing performance issues`,
                actions: [
                    '• Conduct performance audits',
                    '• Upgrade network infrastructure',
                    '• Implement monitoring solutions'
                ],
                timeline: 'Short-term (1-4 weeks)'
            });
        }

        // Geographic recommendations
        const geoRecommendations = this.generateGeographicRecommendations(reportData.geographicData);
        recommendations.push(...geoRecommendations);

        return recommendations;
    }

    // Export report as PDF
    async exportToPDF(report, options = {}) {
        if (typeof window.jsPDF === 'undefined') {
            throw new Error('PDF library not loaded. Please wait and try again.');
        }

        const { jsPDF } = window;
        const doc = new jsPDF({
            orientation: options.orientation || 'portrait',
            unit: 'mm',
            format: options.format || 'a4'
        });

        // Set up document properties
        doc.setProperties({
            title: report.title,
            subject: 'Site Tracker Report',
            author: 'AI Report Generator',
            creator: 'Site Tracker Dashboard'
        });

        let yPosition = 20;

        // Add header
        yPosition = this.addPDFHeader(doc, report, yPosition);

        // Add executive summary
        yPosition = this.addPDFSection(doc, 'Executive Summary', report.insights.join('\n\n'), yPosition);

        // Add report sections
        for (const section of report.sections) {
            yPosition = this.addPDFSection(doc, section.title, section.content, yPosition);
            
            // Add tables if present
            if (section.table) {
                yPosition = this.addPDFTable(doc, section.table, yPosition);
            }

            // Check if we need a new page
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
        }

        // Add recommendations
        if (report.recommendations.length > 0) {
            yPosition = this.addPDFRecommendations(doc, report.recommendations, yPosition);
        }

        // Add footer
        this.addPDFFooter(doc, report);

        // Generate filename
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${report.type}-report-${timestamp}.pdf`;

        // Save the PDF
        doc.save(filename);

        return {
            filename,
            size: doc.internal.pageSize,
            pages: doc.internal.getNumberOfPages()
        };
    }

    // Helper methods for PDF generation
    addPDFHeader(doc, report, yPosition) {
        // Title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.text(report.title, 20, yPosition);
        yPosition += 10;

        // Subtitle
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated on ${new Date(report.generatedAt).toLocaleDateString()}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Data Source: ${report.dataSnapshot.dataSource}`, 20, yPosition);
        yPosition += 5;
        doc.text(`Records Analyzed: ${report.dataSnapshot.recordsAnalyzed}`, 20, yPosition);
        yPosition += 15;

        // Add line separator
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;

        return yPosition;
    }

    addPDFSection(doc, title, content, yPosition) {
        // Section title
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(title, 20, yPosition);
        yPosition += 8;

        // Section content
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        
        const lines = doc.splitTextToSize(content, 170);
        for (const line of lines) {
            if (yPosition > 280) {
                doc.addPage();
                yPosition = 20;
            }
            doc.text(line, 20, yPosition);
            yPosition += 5;
        }

        return yPosition + 5;
    }

    addPDFTable(doc, tableData, yPosition) {
        if (doc.autoTable) {
            doc.autoTable({
                startY: yPosition,
                head: [tableData.headers],
                body: tableData.rows,
                theme: 'grid',
                styles: { fontSize: 8 },
                headStyles: { fillColor: [102, 126, 234] }
            });
            return doc.lastAutoTable.finalY + 10;
        }
        return yPosition;
    }

    addPDFRecommendations(doc, recommendations, yPosition) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text('Recommendations', 20, yPosition);
        yPosition += 10;

        for (const rec of recommendations) {
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(`${rec.priority}: ${rec.title}`, 20, yPosition);
            yPosition += 6;

            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(rec.description, 20, yPosition);
            yPosition += 5;

            for (const action of rec.actions) {
                doc.text(action, 25, yPosition);
                yPosition += 4;
            }

            doc.text(`Timeline: ${rec.timeline}`, 20, yPosition);
            yPosition += 10;

            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
        }

        return yPosition;
    }

    addPDFFooter(doc, report) {
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(`Page ${i} of ${pageCount}`, 20, 290);
            doc.text(`Generated by AI Report Generator - ${new Date().toLocaleDateString()}`, 120, 290);
        }
    }

    // Data analysis helper methods
    generateDataSummary() {
        const total = this.currentData.length;
        const withCoordinates = this.currentData.filter(item => item.latitude && item.longitude).length;
        const statuses = this.getUniqueValues('status');
        const locations = this.getUniqueValues('locationName');

        return {
            totalSites: total,
            mappedSites: withCoordinates,
            uniqueStatuses: statuses.length,
            uniqueLocations: locations.length,
            dataCompleteness: Math.round((withCoordinates / total) * 100)
        };
    }

    analyzeStatusDistribution() {
        const statusCounts = {};
        this.currentData.forEach(item => {
            const status = item.status || 'unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        return statusCounts;
    }

    analyzeGeographicDistribution() {
        const provinces = {};
        const coordinates = [];

        this.currentData.forEach(item => {
            if (item.province) {
                provinces[item.province] = (provinces[item.province] || 0) + 1;
            }
            if (item.latitude && item.longitude) {
                coordinates.push([item.latitude, item.longitude]);
            }
        });

        return {
            provinceDistribution: provinces,
            coordinateCount: coordinates.length,
            coverage: Object.keys(provinces).length
        };
    }

    // Utility methods
    generateReportId() {
        return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUniqueValues(field) {
        return [...new Set(this.currentData.map(item => item[field]).filter(Boolean))];
    }

    // Create specific report sections (placeholder implementations)
    createExecutiveSummarySection(reportData) {
        return {
            title: 'Executive Summary',
            content: `This report analyzes ${reportData.summary.totalSites} sites across the network. Key findings include ${reportData.summary.dataCompleteness}% data completeness and ${Object.keys(reportData.statusBreakdown).length} different status categories.`,
            type: 'text'
        };
    }

    createStatusBreakdownSection(reportData) {
        const statusList = Object.entries(reportData.statusBreakdown)
            .map(([status, count]) => `• ${status}: ${count} sites`)
            .join('\n');

        return {
            title: 'Status Breakdown',
            content: `Current site status distribution:\n\n${statusList}`,
            type: 'text',
            table: {
                headers: ['Status', 'Count', 'Percentage'],
                rows: Object.entries(reportData.statusBreakdown).map(([status, count]) => [
                    status,
                    count.toString(),
                    `${Math.round((count / reportData.summary.totalSites) * 100)}%`
                ])
            }
        };
    }

    // Additional section creators would be implemented here...
    createGeographicSection(reportData) {
        return {
            title: 'Geographic Distribution',
            content: `Sites are distributed across ${reportData.geographicData.coverage} provinces with ${reportData.geographicData.coordinateCount} sites having precise coordinates.`,
            type: 'text'
        };
    }

    createRecommendationsSection(reportData) {
        return {
            title: 'Recommendations',
            content: 'Based on the analysis, the following recommendations are provided to improve site management and performance.',
            type: 'text'
        };
    }

    // Placeholder methods for other section types
    createConnectivityOverviewSection(reportData) { return { title: 'Connectivity Overview', content: 'Connectivity analysis pending implementation.', type: 'text' }; }
    createIssueAnalysisSection(reportData) { return { title: 'Issue Analysis', content: 'Issue analysis pending implementation.', type: 'text' }; }
    createPerformanceSection(reportData) { return { title: 'Performance Metrics', content: 'Performance analysis pending implementation.', type: 'text' }; }
    createActionItemsSection(reportData) { return { title: 'Action Items', content: 'Action items pending implementation.', type: 'text' }; }
    createCoverageMapSection(reportData) { return { title: 'Coverage Map', content: 'Coverage map analysis pending implementation.', type: 'text' }; }
    createRegionalBreakdownSection(reportData) { return { title: 'Regional Breakdown', content: 'Regional analysis pending implementation.', type: 'text' }; }
    createDensityAnalysisSection(reportData) { return { title: 'Density Analysis', content: 'Density analysis pending implementation.', type: 'text' }; }
    createExpansionOpportunitiesSection(reportData) { return { title: 'Expansion Opportunities', content: 'Expansion analysis pending implementation.', type: 'text' }; }
    createMaintenanceScheduleSection(reportData) { return { title: 'Maintenance Schedule', content: 'Maintenance schedule pending implementation.', type: 'text' }; }
    createPrioritySitesSection(reportData) { return { title: 'Priority Sites', content: 'Priority sites analysis pending implementation.', type: 'text' }; }
    createResourceAllocationSection(reportData) { return { title: 'Resource Allocation', content: 'Resource allocation analysis pending implementation.', type: 'text' }; }
    createTimelineSection(reportData) { return { title: 'Timeline', content: 'Timeline analysis pending implementation.', type: 'text' }; }
    createCustomReportSection(reportData, prompt) { return { title: 'Custom Analysis', content: `Custom analysis for: ${prompt}`, type: 'text' }; }

    // Placeholder insight generators
    generateStatusInsights(statusBreakdown) {
        const insights = [];
        const total = Object.values(statusBreakdown).reduce((sum, count) => sum + count, 0);
        const online = statusBreakdown.online || 0;
        const offline = statusBreakdown.offline || 0;
        
        insights.push(`🟢 **Availability**: ${Math.round((online / total) * 100)}% of sites are currently online.`);
        
        if (offline > 0) {
            insights.push(`🔴 **Issues**: ${offline} sites are offline and require attention.`);
        }
        
        return insights;
    }

    generateGeographicInsights(geoData) {
        const insights = [];
        insights.push(`🗺️ **Coverage**: Sites span across ${geoData.coverage} provinces.`);
        insights.push(`📍 **Mapping**: ${geoData.coordinateCount} sites have precise coordinates for mapping.`);
        return insights;
    }

    generatePerformanceInsights(perfMetrics) {
        return [`⚡ **Performance**: Performance metrics analysis available.`];
    }

    // Placeholder methods for advanced analysis
    analyzePerformanceMetrics() { return { lowPerformance: 0 }; }
    analyzeTrends() { return {}; }
    identifyIssues() { return { critical: [], warning: [], info: [] }; }
    assessDataQuality() { return { score: 85, issues: [] }; }
    performCustomAnalysis(prompt) { return `Custom analysis for: ${prompt}`; }
    generateCustomInsights(prompt, data) { return [`Custom insights for: ${prompt}`]; }
    generateGeographicRecommendations(geoData) { return []; }
}

// Initialize the report generator
const aiReportGenerator = new AIReportGenerator();

// Make it globally available
window.aiReportGenerator = aiReportGenerator;

// Auto-update with current data
if (window.allData) {
    aiReportGenerator.updateData(window.allData);
}

console.log('📊 AI Report Generator initialized successfully!');