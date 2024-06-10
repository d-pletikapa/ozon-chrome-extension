document.addEventListener('DOMContentLoaded', function () {
    const exportButton = document.getElementById('exportButton');
    const copyButton = document.getElementById('copyButton');
    const exportTextContainer = document.getElementById('exportTextContainer');

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tab = tabs[0];
        const url = new URL(tab.url);

        if (url.href === 'https://seller.ozon.ru/app/analytics/what-to-sell/competitive-position') {
            exportButton.addEventListener('click', async function () {
                console.log('Export button clicked');
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        func: exportTableToClipboard,
                    },
                    (results) => {
                        if (results && results[0] && results[0].result) {
                            const exportedText = results[0].result;
                            exportTextContainer.textContent = exportedText;
                            exportTextContainer.classList.remove('invisible');
                            exportTextContainer.classList.add('visible');
                            copyButton.classList.remove('d-none');
                        }
                    }
                );
            });

            copyButton.addEventListener('click', function () {
                const textToCopy = exportTextContainer.textContent;
                navigator.clipboard.writeText(textToCopy).then(() => {
                    console.log('Text copied to clipboard');
                    copyButton.textContent = 'Copied!';
                    copyButton.classList.remove('btn-primary');
                    copyButton.classList.add('btn-success');
                    setTimeout(() => {
                        copyButton.textContent = 'Copy to Clipboard';
                        copyButton.classList.remove('btn-success');
                        copyButton.classList.add('btn-primary');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        } else {
            exportButton.disabled = true;
            copyButton.disabled = true;
        }
    });

    function exportTableToClipboard() {
        const table = document.querySelector('[class^="table-module_table_"]');

        if (!table) {
            console.error('Таблица не найдена');
            return;
        }

        const rows = table.querySelectorAll('tr');
        let result = '';

        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('th, td');
            let rowText = '';

            cells.forEach((cell, index) => {
                let cellText = Array.from(cell.childNodes).map(node => node.textContent.trim()).join(' ');

                const badgeDiv = cell.querySelector('div[class^="styles_placeBadge_"]');
                if (badgeDiv) {
                    const badgeText = badgeDiv.textContent.trim();
                    if (badgeText) {
                        cellText = badgeText + ' ' + cellText.replace(badgeText, '').trim();
                    }
                }

                const contentDiv = cell.querySelector('div[class^="styles_content_"]');
                if (contentDiv) {
                    const contentTexts = Array.from(contentDiv.childNodes).map(node => node.textContent.trim());
                    cellText = contentTexts.join('\t');
                }

                const link = cell.querySelector('a');
                if (link) {
                    cellText = link.href + '\t' + cellText;
                }

                rowText += (index === 0 ? '' : '\t') + cellText;
            });

            if (rowIndex === 0) {
                const firstCell = rowText.split('\t')[0];
                rowText = firstCell + '\t' + firstCell + '\t' + firstCell + '\t' + rowText;
            }

            result += rowText + '\n';
        });

        return result;
    }
});
