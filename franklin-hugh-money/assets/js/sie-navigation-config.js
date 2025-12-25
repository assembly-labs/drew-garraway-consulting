// SIE Exam Course Navigation Configuration
// Defines the complete chapter and section structure

const SIECourseStructure = {
    chapters: [
        {
            number: 1,
            title: "Securities Markets",
            sections: [
                { id: "1.1", title: "Primary & Secondary Markets", file: "pages/sie/sie-chapter-1-markets.html", locked: true },
                { id: "1.2", title: "Market Participants", file: "pages/sie/sie-chapter-1-participants.html", locked: true }
            ]
        },
        {
            number: 2,
            title: "Economic Factors",
            sections: [
                { id: "2.1", title: "Economic Indicators", file: "pages/sie/sie-chapter-2-indicators.html", locked: true },
                { id: "2.2", title: "Monetary & Fiscal Policy", file: "pages/sie/sie-chapter-2-policy.html", locked: true }
            ]
        },
        {
            number: 3,
            title: "Trading Securities",
            sections: [
                { id: "3.1", title: "Types of Orders", file: "pages/sie/sie-chapter-3-orders.html", locked: true },
                { id: "3.2", title: "Trade Settlement", file: "pages/sie/sie-chapter-3-settlement.html", locked: true }
            ]
        },
        {
            number: 4,
            title: "Investment Companies",
            sections: [
                { id: "4.1", title: "Mutual Funds", file: "pages/sie/sie-chapter-4-mutual-funds.html", locked: true },
                { id: "4.2", title: "ETFs and UITs", file: "pages/sie/sie-chapter-4-etfs.html", locked: true }
            ]
        },
        {
            number: 5,
            title: "Debt Securities",
            sections: [
                { id: "5.1", title: "Municipal Debt", file: "pages/sie/sie-chapter-5-municipal.html", locked: false },
                { id: "5.2", title: "Money Market Instruments", file: "pages/sie/sie-chapter-5-money-markets.html", locked: false }
            ]
        },
        {
            number: 6,
            title: "Packaged Products",
            sections: [
                { id: "6.1", title: "Investment Company Basics", file: "pages/sie/sie-chapter-6-investment-company-basics.html", locked: false },
                { id: "6.2", title: "Fund Management & Structure", file: "pages/sie/sie-chapter-6-fund-management.html", locked: false },
                { id: "6.3", title: "Buying and Selling Fund Shares", file: "pages/sie/sie-chapter-6-buying-selling.html", locked: false },
                { id: "6.4", title: "Fund Expenses and Share Classes", file: "pages/sie/sie-chapter-6-expenses-classes.html", locked: false },
                { id: "6.5", title: "Distributions and Prohibited Practices", file: "pages/sie/sie-chapter-6-distributions.html", locked: false },
                { id: "6.6", title: "Other Packaged Products", file: "pages/sie/sie-chapter-6-other-products.html", locked: false }
            ]
        },
        {
            number: 7,
            title: "Trading Markets",
            sections: [
                { id: "7.1", title: "Types of Trading Markets", file: "pages/sie/sie-chapter-7-trading-markets.html", locked: false }
            ]
        },
        {
            number: 8,
            title: "Trade Processing and Settlement",
            sections: [
                { id: "8.1", title: "Trade Processing and Settlement", file: "pages/sie/sie-chapter-8-trade-processing.html", locked: false }
            ]
        },
        {
            number: 9,
            title: "Prohibited Activities",
            sections: [
                { id: "9.1", title: "Prohibited Practices", file: "pages/sie/sie-chapter-9-practices.html", locked: true }
            ]
        },
        {
            number: 10,
            title: "Securities Act of 1933",
            sections: [
                { id: "10.1", title: "Registration & Exemptions", file: "pages/sie/sie-chapter-10-registration.html", locked: true }
            ]
        },
        {
            number: 11,
            title: "Securities Exchange Act of 1934",
            sections: [
                { id: "11.1", title: "Exchange Act Provisions", file: "pages/sie/sie-chapter-11-provisions.html", locked: true }
            ]
        },
        {
            number: 12,
            title: "FINRA Rules",
            sections: [
                { id: "12.1", title: "Conduct & Suitability", file: "pages/sie/sie-chapter-12-conduct.html", locked: true }
            ]
        },
        {
            number: 13,
            title: "Other Regulations",
            sections: [
                { id: "13.1", title: "Additional Regulations", file: "pages/sie/sie-chapter-13-other.html", locked: true }
            ]
        },
        {
            number: 14,
            title: "Communications",
            sections: [
                { id: "14.1", title: "Communications with Public", file: "pages/sie/sie-chapter-14-communications.html", locked: true }
            ]
        },
        {
            number: 15,
            title: "Ethics",
            sections: [
                { id: "15.1", title: "Ethical Practices", file: "pages/sie/sie-chapter-15-ethics.html", locked: true }
            ]
        },
        {
            number: 16,
            title: "Review & Practice",
            sections: [
                { id: "16.1", title: "Final Review", file: "pages/sie/sie-chapter-16-review.html", locked: true }
            ]
        }
    ],

    // Helper functions to navigate the structure
    getAllSections() {
        return this.chapters.flatMap(ch => ch.sections);
    },

    getTotalSections() {
        return this.getAllSections().length;
    },

    getCurrentSection(currentFile) {
        return this.getAllSections().find(section =>
            section.file === currentFile ||
            section.file === currentFile.replace('-improved', '')
        );
    },

    getSectionIndex(sectionId) {
        return this.getAllSections().findIndex(s => s.id === sectionId);
    },

    getPreviousSection(currentSectionId) {
        const sections = this.getAllSections();
        const currentIndex = this.getSectionIndex(currentSectionId);
        return currentIndex > 0 ? sections[currentIndex - 1] : null;
    },

    getNextSection(currentSectionId) {
        const sections = this.getAllSections();
        const currentIndex = this.getSectionIndex(currentSectionId);
        return currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null;
    },

    getChapterForSection(sectionId) {
        const chapterNumber = parseInt(sectionId.split('.')[0]);
        return this.chapters.find(ch => ch.number === chapterNumber);
    },

    getProgressPercentage(currentSectionId) {
        const currentIndex = this.getSectionIndex(currentSectionId);
        return ((currentIndex + 1) / this.getTotalSections()) * 100;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SIECourseStructure;
}