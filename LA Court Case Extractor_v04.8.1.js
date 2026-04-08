// ==UserScript==
// @name         LA Court Case Extractor
// @match        https://www.lacourt.ca.gov/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function extractTable(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        return rows.map(row => Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim()));
    }

    function buildCaseData() {
        const data = {};

        // Case Information
        const caseTable = document.querySelector('a[name="CaseInformation"] + hr + .quickNavigation + table');
        if (caseTable) {
            const rows = extractTable(caseTable);
            data["CaseInformation"] = {};
            rows.forEach(r => {
                if (r.length >= 2) {
                    data["CaseInformation"][r[0].replace(/[:\s]+$/,'')] = r[1];
                }
            });
        }

        // Future Hearings
        const futureTable = document.querySelector('a[name="FutureHearings"] + .caseInfoHeader + hr + .quickNavigation + table');
        if (futureTable) {
            const rows = extractTable(futureTable);
            data["FutureHearings"] = rows.map(r => ({
                "date": r[0] || '',
                "description": r[1] || '',
                "parties": r[2] || ''
            }));
        }

        // Party Information
        const partiesTable = document.querySelector('a[name="Parties"] + .caseInfoHeader + hr + .quickNavigation + table');
        if (partiesTable) {
            const rows = extractTable(partiesTable);
            data["Parties"] = rows.map(r => ({
                "name": r[0] || '',
                "role": r[1] || ''
            }));
        }

        // Documents Filed
        const documentsTable = document.querySelector('a[name="DocumentsFiled"] + .caseInfoHeader + hr + .quickNavigation + table');
        if (documentsTable) {
            const rows = extractTable(documentsTable);
            data["DocumentsFiled"] = rows.map(r => ({
                "date": r[0] || '',
                "description": r[1] || '',
                "parties": r[2] || ''
            }));
        }

        // Past Proceedings
        const pastTable = document.querySelector('a[name="PastProceedings"] + .caseInfoHeader + hr + .quickNavigation + table');
        if (pastTable) {
            const rows = extractTable(pastTable);
            data["PastProceedings"] = rows.map(cells => {
                if (cells.length < 3) return {};
                const originalParties = cells[2] || '';
                let motionText = '';

                const match = originalParties.match(/Hearing on\s*(.*)/i);
                if (match) {
                    motionText = match[1].trim();
                } else {
                    motionText = originalParties;
                }

                return {
                    "Hearing on date": cells[0] || '',
                    "description": cells[1] || '',
                    "Motion": motionText
                };
            });
        }

        return data;
    }

    // Run extraction
    const caseData = buildCaseData();
    console.log(caseData);

})();
