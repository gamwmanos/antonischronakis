const fs = require('fs');
const htmlPath = 'd:/ANTONISCHRONAKIS/chap_1.html';
const textPath = 'd:/ANTONISCHRONAKIS/A_LYKEIOU/KEFALAIO_1/askiseis.txt';
const scriptPath = 'd:/ANTONISCHRONAKIS/script.js';

let text = fs.readFileSync(textPath, 'utf8');

// Regex to remove specific question blocks
text = text.replace(/Β\. Ερωτήσεις Σωστού \/ Λάθους\s*Να χαρακτηρίσετε[\s\S]*?στ\..*?περιβάλλον\./g, '');
text = text.replace(/Γ\. Ερωτήσεις Πολλαπλής Επιλογής\s*α\..*?αντιόξινα\)/g, '');
text = text.replace(/Β\. Ερωτήσεις Πολλαπλής Επιλογής \(Ασφάλεια\)[\s\S]*?11\..*?ατυχήματα\)\./g, '');
text = text.replace(/Γ\. Ερωτήσεις Σωστού \/ Λάθους \(Ασφάλεια\)[\s\S]*?ε\..*?άσκησης\./g, '');
text = text.replace(/4\. Ερωτήσεις: Η Επιστημονική Μέθοδος \(Ενότητα 1\.2\)\s*Α\. Ερωτήσεις Σωστού \/ Λάθους[\s\S]*?ζ\..*?απορρίπτουμε\./g, '4. Ερωτήσεις: Η Επιστημονική Μέθοδος (Ενότητα 1.2)');
text = text.replace(/Β\. Ερωτήσεις Πολλαπλής Επιλογής[\s\S]*?21\..*?ανακοίνωση\)\./g, '');

const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n\s*\n\s*\n/g, '\n\n');

const newBlock = `
                <div style="white-space: pre-wrap; margin-bottom: 2rem; background: var(--card-bg); padding: 1.5rem; border: 1px solid var(--border-light); border-radius: 8px; line-height: 1.8;">${safeText.trim()}</div>
                
                <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--border-light);">
                <div id="interactive-tf-quiz"></div>

                <hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--border-light);">
                <div id="interactive-mc-quiz"></div>
`;

let html = fs.readFileSync(htmlPath, 'utf8');
const regex = /<div style="white-space: pre-wrap;.*?<\/div>\s*<hr[^>]*>\s*<h3>.*?<\/h3>\s*<div class="quiz-container".*?<\/div>\s*<\/div>\s*<div id="experiments"/s;
if (regex.test(html)) {
    html = html.replace(regex, newBlock + '\n            </div>\n            \n            <div id="experiments"');
    fs.writeFileSync(htmlPath, html);
    console.log("chap_1.html updated!");
} else {
    console.log("Could not match HTML regex!");
}

// Generate script.js content
const scriptContent = `document.addEventListener('DOMContentLoaded', () => {
    // Highlight active link in navigation
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    const pageName = currentPath === '' ? 'index.html' : currentPath;

    navLinks.forEach(link => {
        if(link.getAttribute('href') === pageName) {
            link.classList.add('active');
        }
    });

    // --- Tab Logic ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-tab');
                document.getElementById(targetId).classList.add('active');
            });
        });
    }

    // --- Quiz Data ---
    const tfQuestions = [
        "Συχνά αναφέρεται ότι η Χημεία στηρίζει πολλούς τομείς στη ζωή μας.",
        "Η ανάπτυξη της Χημείας ανέβασε σημαντικά το προσδόκιμο της ζωής.",
        "Οι εφαρμογές της Χημείας έχουν μόνο θετικές επιπτώσεις στην καθημερινή ζωή και στο περιβάλλον.",
        "Η χρήση των χημικών ουσιών στα τρόφιμα υποβαθμίζει την ποιότητά τους.",
        "Είναι αναγκαία η επίτευξη ισορροπίας μεταξύ της οικονομικής ανάπτυξης και της προστασίας του περιβάλλοντος και των φυσικών πόρων.",
        "Το καταναλωτικό μοντέλο που προβλέπει την ανακύκλωση και επαναχρησιμοποίηση των πρώτων υλών επιβαρύνει σημαντικά το περιβάλλον.",
        "Τα περισσότερα απορρυπαντικά πλυντηρίου φέρουν στην ετικέτα τους το σχετικό εικονόγραμμα και γι’ αυτό πρέπει να βάζουμε πλυντήριο μόνο όταν είναι γεμάτο.",
        "Στο εργαστήριο όσες και όσοι έχουν μακριά μαλλιά πρέπει να τα κρατούν σφιχτά δεμένα.",
        "Είναι ευκαιρία κατά τη διάρκεια μιας εργαστηριακής άσκησης να γνωρίσουμε και άλλα αντιδραστήρια, εκτός από αυτά που προβλέπονται.",
        "Αν κατά λάθος σπάσουμε έναν δοκιμαστικό σωλήνα και το αντιδραστήριο χυθεί στον πάγκο ή στο πάτωμα, πρέπει να το μαζέψουμε γρήγορα γρήγορα με ό,τι βρούμε και να το πετάξουμε στον πιο κοντινό κάδο για να μη μας καταλάβει κανείς.",
        "Δεν μπορούμε να τρώμε, αλλά μπορούμε να μασάμε τσίχλα κατά τη διάρκεια μιας εργαστηριακής άσκησης.",
        "H επιστημονική μέθοδος συνίσταται στη συλλογή δεδομένων.",
        "Η μοναδική μορφή που αναγνωρίζεται ως επιστημονική μέθοδος ακολουθεί τη σειρά: παρατήρηση ⟶ ερώτηση ⟶ υπόθεση ⟶ πείραμα ⟶ συμπέρασμα.",
        "Μόνο ο πειραματισμός είναι ορθή πρακτική για την εξαγωγή συμπερασμάτων.",
        "Τα αποτελέσματα μίας έρευνας πάντοτε επιβεβαιώνουν την υπόθεση που έχει διατυπώσει ο ερευνητής.",
        "Η υπόθεση και η πρόβλεψη που διατυπώνει ένας ερευνητής πρέπει να είναι μετρήσιμες.",
        "Όταν από την πειραματική διαδικασία προκύπτουν δεδομένα τα οποία δεν συμφωνούν με την αρχική υπόθεση, τα απορρίπτουμε."
    ];

    const mcQuestions = [
        { q: "Από τις ακόλουθες δραστηριότητες δεν είναι προϊόν της χημικής βιομηχανίας:", opts: ["τα φάρμακα", "οι μπαταρίες", "η φωτοσύνθεση", "τα χρώματα"] },
        { q: "Για την ανακούφιση από τον πόνο χρησιμοποιούνται:", opts: ["αντιπυρετικά", "αναλγητικά", "αντικαταθλιπτικά", "αντιόξινα"] },
        { q: "Αρνητικές συνέπειες από τη χρήση των εφαρμογών της Χημείας είναι:", opts: ["η πολυφαρμακία", "η ρύπανση της ατμόσφαιρας", "η εξάντληση των φυσικών πόρων", "όλα τα προηγούμενα"] },
        { q: "Η Χημεία συμβάλλει στην αύξηση της παραγωγής τροφίμων παράγοντας:", opts: ["συντηρητικά", "λιπάσματα", "αντιοξειδωτικά", "αντιόξινα"] },
        { q: "Σε περίπτωση έκτακτης ανάγκης στο εργαστήριο πρέπει να φωνάξετε:", opts: ["τον επιβλέποντα καθηγητή", "κανέναν", "έναν φίλο", "όποιον είναι κοντά"] },
        { q: "Το κάπνισμα απαγορεύεται αυστηρά στο εργαστήριο γιατί:", opts: ["δεν υπάρχουν τασάκια", "είναι ανθυγιεινό", "δεν είναι βολικό", "μπορεί να προκληθεί πυρκαγιά στο εργαστήριο"] },
        { q: "Για να ελαττώσετε τον κίνδυνο να μπουν στο μάτι σας σταγόνες μιας χημικής ουσίας πρέπει να φοράτε:", opts: ["μάσκα", "φακούς επαφής", "γυαλιά ηλίου", "γυαλιά ασφαλείας"] },
        { q: "Πώς μπορείτε να σβήσετε γρήγορα μια μικρή φωτιά πάνω στον εργαστηριακό πάγκο;", opts: ["Χρησιμοποιώντας πυροσβεστήρα", "Πετώντας νερό", "Καλύπτοντας τη φλόγα με ένα μικρό δοχείο", "Όλα τα προηγούμενα"] },
        { q: "Το ποτό και το φαγητό απαγορεύονται στο εργαστήριο, γιατί:", opts: ["λερώνεται το εργαστήριο", "δεν υπάρχει αρκετός χρόνος", "τα παιδιά που δεν έχουν πάρει... νιώθουν μειονεκτικά", "μπορεί να δηλητηριαστείτε"] },
        { q: "Απαγορεύεται στο εργαστήριο να γίνονται πειράματα που δεν είναι εγκεκριμένα γιατί:", opts: ["οι μαθητές δεν έχουν την απαιτούμενη εμπειρία", "δεν υπάρχουν τα απαιτούμενα αντιδραστήρια", "οι καθηγητές θέλουν μόνο τα πειράματα που έχουν διαλέξει", "δεν επαρκεί ο διαθέσιμος χρόνος"] },
        { q: "Μετά την ολοκλήρωση του πειράματος και πριν να φύγετε από το εργαστήριο πρέπει οπωσδήποτε:", opts: ["να σβήσετε όλες τις εστίες φωτιάς", "να τακτοποιήσετε και να καθαρίσετε τον πάγκο", "να πλύνετε τα χέρια σας", "να κάνετε όλα τα παραπάνω"] },
        { q: "Αν ένα δοχείο χωρίς ετικέτα περιέχει ένα άγνωστο υγρό, πρέπει:", opts: ["να το δοκιμάσετε...", "να το μυρίσετε...", "να θεωρήσετε ότι είναι πιθανώς επικίνδυνο και να ενημερώσετε τον υπεύθυνο", "καλύτερα να ζητήσετε από έναν συμμαθητή σας να το αναγνωρίσει"] },
        { q: "Ο λόγος για τον οποίο το εργαστήριο πρέπει να είναι καθαρό και τακτοποιημένο είναι ότι:", opts: ["ο καθηγητής είναι ψυχαναγκαστικός", "το εργαστήριο φαίνεται όμορφο", "δεν υπάρχει ο κίνδυνος να μη βρίσκουμε τα αντιδραστήρια", "βοηθάει στο να αποφεύγονται τα ατυχήματα"] },
        { q: "Από τα ακόλουθα βήματα δεν είναι βήμα της επιστημονικής μεθόδου:", opts: ["η παρατήρηση και καταγραφή των δεδομένων", "η διατύπωση υπόθεσης", "η διαμόρφωση ενός μοντέλου με βάση τα πειραματικά αποτελέσματα", "η απόρριψη των δεδομένων που δεν συμφωνούν με την υπόθεση"] },
        { q: "Ποια από τις ακόλουθες παρατηρήσεις είναι ποσοτική;", opts: ["Μεταβάλλεται το χρώμα...", "Η γεύση του διαλύματος είναι όξινη", "Το διάλυμα διαβρώνει τα μέταλλα", "Το διάλυμα βράζει σε θερμοκρασία 78οC"] },
        { q: "Ποια από τις ακόλουθες παρατηρήσεις είναι ποιοτική;", opts: ["Μεταβάλλεται το χρώμα του διαλύματος...", "Η αντίδραση ολοκληρώνεται σε 25 s", "Καταβυθίζονται 2 g ενός πράσινου ιζήματος", "Το διάλυμα βράζει σε θερμοκρασία 78οC"] },
        { q: "Μια δήλωση που επιβεβαιώνεται από πειραματικά δεδομένα και εξηγεί ένα φαινόμενο ονομάζεται:", opts: ["υπόθεση", "ερώτηση", "θεωρία", "γενίκευση"] },
        { q: "Οι μεταβλητές σε ένα πείραμα οι οποίες δεν μεταβάλλονται ονομάζονται:", opts: ["σταθερές", "εξαρτημένες μεταβλητές", "ανεξάρτητες μεταβλητές", "μεταβλητές ελέγχου"] },
        { q: "Η μεταβλητή ενός πειράματος την οποία μεταβάλλει ο ερευνητής ονομάζεται:", opts: ["σταθερά", "εξαρτημένη μεταβλητή", "ανεξάρτητη μεταβλητή", "μεταβλητή ελέγχου"] },
        { q: "Ένα μοντέλο ή μια ποσοτική σχέση που στηρίζεται σε έναν μεγάλο αριθμό πειραματικών δεδομένων είναι:", opts: ["μία υπόθεση", "ένας νόμος", "μία πρόβλεψη", "μία θεωρία"] }
    ];

    // --- Render T/F Quiz ---
    const tfContainer = document.getElementById('interactive-tf-quiz');
    if (tfContainer) {
        let html = '<h3>Κουίζ 1: Ερωτήσεις Σωστού / Λάθους</h3><div class="quiz-container">';
        tfQuestions.forEach((q, idx) => {
            html += \`
            <div class="quiz-question" data-question="\${idx}">
                <h4>\${idx + 1}. \${q}</h4>
                <div class="quiz-options" style="flex-direction:row;">
                    <label class="quiz-option"><input type="radio" name="tf_q\${idx}" value="a"> Σωστό</label>
                    <label class="quiz-option"><input type="radio" name="tf_q\${idx}" value="b"> Λάθος</label>
                </div>
            </div>\`;
        });
        html += '<button id="submit-tf" class="btn">Υποβολή Σ/Λ</button><div id="tf-result"></div></div>';
        tfContainer.innerHTML = html;
        
        document.getElementById('submit-tf').addEventListener('click', () => {
            let score = 0;
            const total = tfQuestions.length;
            
            tfContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('correct', 'incorrect'));
            
            for (let i = 0; i < total; i++) {
                const selected = document.querySelector(\`input[name="tf_q\${i}"]:checked\`);
                const correct = document.querySelector(\`input[name="tf_q\${i}"][value="a"]\`);
                
                if (correct) correct.closest('.quiz-option').classList.add('correct');
                if (selected) {
                    if (selected.value === 'a') score++;
                    else selected.closest('.quiz-option').classList.add('incorrect');
                }
            }
            
            const res = document.getElementById('tf-result');
            res.textContent = \`Βρήκες \${score}/\${total} σωστές απαντήσεις!\`;
            res.style.color = (score === total) ? '#84cc16' : '#1B2621';
        });
    }

    // --- Render MC Quiz ---
    const mcContainer = document.getElementById('interactive-mc-quiz');
    if (mcContainer) {
        let html = '<h3>Κουίζ 2: Ερωτήσεις Πολλαπλής Επιλογής</h3><div class="quiz-container">';
        mcQuestions.forEach((q, idx) => {
            html += \`
            <div class="quiz-question" data-question="\${idx}">
                <h4>\${idx + 1}. \${q.q}</h4>
                <div class="quiz-options">\`;
            const letters = ['α', 'β', 'γ', 'δ'];    
            const values = ['a', 'b', 'c', 'd'];
            q.opts.forEach((optStr, optIdx) => {
                html += \`
                    <label class="quiz-option"><input type="radio" name="mc_q\${idx}" value="\${values[optIdx]}"> \${letters[optIdx]}) \${optStr}</label>\`;
            });
            html += \`
                </div>
            </div>\`;
        });
        html += '<button id="submit-mc" class="btn">Υποβολή Πολλαπλής</button><div id="mc-result"></div></div>';
        mcContainer.innerHTML = html;

        document.getElementById('submit-mc').addEventListener('click', () => {
            let score = 0;
            const total = mcQuestions.length;
            
            mcContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('correct', 'incorrect'));
            
            for (let i = 0; i < total; i++) {
                const selected = document.querySelector(\`input[name="mc_q\${i}"]:checked\`);
                const correct = document.querySelector(\`input[name="mc_q\${i}"][value="a"]\`);
                
                if (correct) correct.closest('.quiz-option').classList.add('correct');
                if (selected) {
                    if (selected.value === 'a') score++;
                    else selected.closest('.quiz-option').classList.add('incorrect');
                }
            }
            
            const res = document.getElementById('mc-result');
            res.textContent = \`Βρήκες \${score}/\${total} σωστές απαντήσεις!\`;
            res.style.color = (score === total) ? '#84cc16' : '#1B2621';
        });
    }
});`;

fs.writeFileSync(scriptPath, scriptContent);
console.log("script.js updated!");
