
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
        const data = [];

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length === 0) return;

            // Assign meaningful keys based on section
            let rowData = {};
            switch(name) {
                case 'CaseInformation':
                    rowData = { label: cells[0].textContent.trim(), value: cells[1]?.textContent.trim() || '' };
                    break;
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

            data.push(rowData);
        });

        caseData[name] = data;
    });

    console.log('Structured Case Data:', caseData);
})();

// Output Example:
  //Structured Case Data: {CaseInformation: Array(6), FutureHearings: Array(0), Parties: Array(4), DocumentsFiled: Array(97), PastProceedings: Array(73)}
  /// CaseInformation: (6) [{…}, {…}, {…}, {…}, {…}, {…}]
  // DocumentsFiled: (97) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
  // FutureHearings: []Parties: (4) [{…}, {…}, {…}, {…}]
  // PastProceedings: Array(73)0: {date: '4/7/2026 08:30 AM', description: 'Department  2', Motion: 'Hearing on Motion to Set Aside/Vacate Judgment (CCP 473)'}1: {date: '3/3/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to be Relieved as Counsel'}2: {date: '2/24/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Join Necessary Party'}3: {date: '2/20/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Confirm Arbitration Award'}4: {date: '2/17/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Disqualify Counsel'}5: {date: '2/17/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Transfer'}6: {date: '2/4/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion for Attorney Fees'}7: {date: '2/4/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Join Necessary Party'}8: {date: '2/4/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Set Aside/Vacate Dismissal (CCP 473)'}9: {date: '2/4/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Strike (not anti-SLAPP) - without Demurrer'}10: {date: '2/3/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Continue Trial'}11: {date: '2/3/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Disqualify Counsel'}12: {date: '2/3/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Join Necessary Party'}13: {date: '2/3/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Join Necessary Party'}14: {date: '2/3/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Set Aside/Vacate Default and Default Judgment (CCP 473.5)'}15: {date: '2/3/2026 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Strike (not anti-SLAPP) - without Demurrer'}16: {date: '12/26/2025 1:30 PM', description: 'Department  27', Motion: 'Hearing on Motion to Vacate'}17: {date: '12/17/2024 08:30 AM', description: 'Department  29', Motion: 'Order to Show Cause Re: Dismissal (Settlement)'}18: {date: '8/28/2024 08:30 AM', description: 'Department  29', Motion: 'Order to Show Cause Re: Dismissal (Settlement)'}19: {date: '6/25/2024 08:30 AM', description: 'Department  29', Motion: 'Order to Show Cause Re: Dismissal (Settlement)'}20: {date: '5/31/2024 08:30 AM', description: 'Department  29', Motion: 'Jury Trial'}21: {date: '5/29/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to be Relieved as Counsel'}22: {date: '5/29/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to be Relieved as Counsel'}23: {date: '5/28/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to be Relieved as Counsel'}24: {date: '5/17/2024 10:00 AM', description: 'Department  29', Motion: 'Final Status Conference'}25: {date: '5/9/2024 3:41 PM', description: 'Department  29', Motion: 'Court Order'}26: {date: '3/6/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Bifurcate'}27: {date: '2/23/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}28: {date: '2/23/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}29: {date: '1/31/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}30: {date: '1/31/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}31: {date: '1/18/2024 08:30 AM', description: 'Department  29', Motion: 'Jury Trial'}32: {date: '1/4/2024 10:00 AM', description: 'Department  29', Motion: 'Final Status Conference'}33: {date: '1/4/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}34: {date: '1/4/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}35: {date: '1/3/2024 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}36: {date: '12/11/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}37: {date: '12/11/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}38: {date: '12/11/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}39: {date: '12/8/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}40: {date: '12/8/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}41: {date: '11/30/2023 11:30 AM', description: 'Department  29', Motion: 'Informal Discovery Conference (IDC)'}42: {date: '11/15/2023 11:00 AM', description: 'Department  29', Motion: 'Informal Discovery Conference (IDC)'}43: {date: '11/2/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}44: {date: '10/31/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}45: {date: '10/31/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}46: {date: '10/17/2023 08:30 AM', description: 'Department  29', Motion: 'Non-Jury Trial'}47: {date: '10/13/2023 11:30 AM', description: 'Department  29', Motion: 'Informal Discovery Conference (IDC)'}48: {date: '10/6/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}49: {date: '10/6/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}50: {date: '10/3/2023 10:00 AM', description: 'Department  29', Motion: 'Final Status Conference'}51: {date: '9/18/2023 08:30 AM', description: 'Department  29', Motion: 'Order to Show Cause Re: Dismissal'}52: {date: '8/24/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Continue Trial'}53: {date: '8/9/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Continue Trial'}54: {date: '3/27/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}55: {date: '3/27/2023 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Compel'}56: {date: '12/14/2022 08:30 AM', description: 'Department  29', Motion: 'Non-Jury Trial'}57: {date: '11/30/2022 10:00 AM', description: 'Department  29', Motion: 'Final Status Conference'}58: {date: '3/21/2022 08:30 AM', description: 'Department  29', Motion: 'Non-Jury Trial'}59: {date: '3/7/2022 10:00 AM', description: 'Department  29', Motion: 'Final Status Conference'}60: {date: '2/17/2022 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Continue Trial'}61: {date: '1/21/2022 08:30 AM', description: 'Department  29', Motion: 'Hearing on Ex Parte Application'}62: {date: '9/14/2021 08:30 AM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}63: {date: '9/14/2021 08:30 AM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}64: {date: '9/14/2021 08:30 AM', description: 'Department  29', Motion: 'Hearing on Motion to Deem Request for Admissions Admitted'}65: {date: '9/13/2021 08:30 AM', description: 'Department  29', Motion: 'Hearing on Motion to Deem Request for Admissions Admitted'}66: {date: '9/1/2021 10:00 AM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}67: {date: '9/1/2021 10:00 AM', description: 'Department  29', Motion: 'Hearing on Motion to Compel Further Discovery Responses'}68: {date: '8/13/2021 11:00 AM', description: 'Department  29', Motion: 'Informal Discovery Conference (IDC)'}69: {date: '8/6/2021 11:30 AM', description: 'Department  29', Motion: 'Informal Discovery Conference (IDC)'}70: {date: '7/7/2021 11:00 AM', description: 'Department  29', Motion: 'Informal Discovery Conference (IDC)'}71: {date: '7/6/2021 11:00 AM', description: 'Department  29', Motion: 'Informal Discovery Conference (IDC)'}72: {date: '2/24/2021 1:30 PM', description: 'Department  29', Motion: 'Hearing on Motion to Quash'}length: 73[[Prototype]]: Array(0)[[Prototype]]: Object

  //
