const fs = require('fs');
const htmlPath = 'd:/ANTONISCHRONAKIS/chap_1.html';
const textPath = 'd:/ANTONISCHRONAKIS/A_LYKEIOU/KEFALAIO_1/askiseis.txt';

try {
    const html = fs.readFileSync(htmlPath, 'utf8');
    const text = fs.readFileSync(textPath, 'utf8');

    // Escape basic entities for HTML
    const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const newBlock = `
                <div style="white-space: pre-wrap; margin-bottom: 2rem; background: var(--bg-color); padding: 1.5rem; border: 1px solid var(--border-light); border-radius: 8px; line-height: 1.8;">${safeText}</div>
                <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--border-light);">
                <h3>Διαδραστικό Τεστ Πολλαπλής Επιλογής</h3>`;

    const regex = /<p>Να χαρακτηρίσετε ως Σωστές.*?<\/p>\s*<hr[^>]*>\s*<h3>Διαδραστικό Τεστ Πολλαπλής Επιλογής<\/h3>/s;
    
    if (regex.test(html)) {
        const updatedHtml = html.replace(regex, newBlock);
        fs.writeFileSync(htmlPath, updatedHtml);
        console.log('Successfully updated HTML.');
    } else {
        console.log('Regex did not match.');
    }
} catch (err) {
    console.error(err);
}
