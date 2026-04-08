(function() {
    'use strict';

    const sections = [
        'CaseInformation',
        'FutureHearings',
        'Parties',
        'DocumentsFiled',
        'PastProceedings'
    ];

    const caseData = {};

    sections.forEach(name => {
        const anchor = document.querySelector(`a[name="${name}"]`);
        if (!anchor) return;

        // Find the next table with class 'dataTable'
        let table = anchor.nextElementSibling;
        while (table && (!table.tagName || table.tagName.toLowerCase() !== 'table' || !table.classList.contains('dataTable'))) {
            table = table.nextElementSibling;
        }
        if (!table) return;

        const rows = table.querySelectorAll('tr');
        const data = {};

        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;

            if (name === 'CaseInformation') {
                switch(index) {
                    case 0: data["Case Number"] = cells[1]?.textContent.trim() || ''; break;
                    case 1: data["Case Title"] = cells[1]?.textContent.trim() || ''; break;
                    case 2: data["Filing Courthouse"] = cells[1]?.textContent.trim() || ''; break;
                    case 3: data["Filing Date"] = cells[1]?.textContent.trim() || ''; break;
                    case 4: data["Case Type"] = cells[1]?.textContent.trim() || ''; break;
                    case 5: data["Status"] = cells[1]?.textContent.trim() || ''; break;
                }
            } else {
                // Keep previous array structure for other sections
                let rowData = {};
                switch(name) {
                    case 'FutureHearings':
                        rowData = { date: cells[0]?.textContent.trim() || '', description: cells[1]?.textContent.trim() || '', parties: cells[2]?.textContent.trim() || '' };
                        break;
                    case 'Parties':
                        rowData = { name: cells[0]?.textContent.trim() || '', role: cells[1]?.textContent.trim() || '' };
                        break;
                    case 'DocumentsFiled':
                        rowData = { date: cells[0]?.textContent.trim() || '', document: cells[1]?.textContent.trim() || '', filedBy: cells[2]?.textContent.trim() || '' };
                        break;
                    case 'PastProceedings':
                        rowData = { date: cells[0]?.textContent.trim() || '', description: cells[1]?.textContent.trim() || '', Motion: cells[2]?.textContent.trim() || '' };
                        break;
                }
                if (!caseData[name]) caseData[name] = [];
                caseData[name].push(rowData);
            }
        });

        if (name === 'CaseInformation') caseData[name] = data; // assign object instead of array
    });

    console.log('Structured Case Data:', caseData);
})();
