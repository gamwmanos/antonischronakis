document.addEventListener('DOMContentLoaded', () => {
    // Highlight active link in navigation
    const currentPath = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // If it's root or blank, defaults to index
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
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding content
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
        "Η χρήση των χημικών ουσιών στα τρόφιμα υποβαθμίζει την ποιότητά τους.",
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
        let html = '<h3>Διαδραστικό Τεστ 1: Σωστού / Λάθους</h3><div class="quiz-container">';
        tfQuestions.forEach((q, idx) => {
            html += `
            <div class="quiz-question" data-question="${idx}">
                <p style="font-weight: 500; font-size: 1.1rem; color: var(--primary-dark); margin-bottom: 0.8rem;">${idx + 1}. ${q}</p>
                <div class="quiz-options" style="flex-direction:row;">
                    <label class="quiz-option"><input type="radio" name="tf_q${idx}" value="a"> Σωστό</label>
                    <label class="quiz-option"><input type="radio" name="tf_q${idx}" value="b"> Λάθος</label>
                </div>
            </div>`;
        });
        html += '<button id="submit-tf" class="btn" style="margin-top: 1rem;">Υποβολή Σ/Λ</button><div id="tf-result" style="margin-top:1rem; font-weight:bold;"></div></div>';
        tfContainer.innerHTML = html;
        
        document.getElementById('submit-tf').addEventListener('click', () => {
            let score = 0;
            const total = tfQuestions.length;
            
            tfContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('correct', 'incorrect'));
            
            for (let i = 0; i < total; i++) {
                const selected = document.querySelector(`input[name="tf_q${i}"]:checked`);
                const correct = document.querySelector(`input[name="tf_q${i}"][value="a"]`);
                
                if (correct) correct.closest('.quiz-option').classList.add('correct');
                if (selected) {
                    if (selected.value === 'a') score++;
                    else selected.closest('.quiz-option').classList.add('incorrect');
                }
            }
            
            const res = document.getElementById('tf-result');
            res.textContent = `Βρήκες ${score}/${total} σωστές απαντήσεις!`;
            res.style.color = (score === total) ? '#84cc16' : '#1B2621';
        });
    }

    // --- Render MC Quiz ---
    const mcContainer = document.getElementById('interactive-mc-quiz');
    if (mcContainer) {
        let html = '<hr style="margin: 3rem 0; border: none; border-top: 1px solid var(--border-light);"><h3>Διαδραστικό Τεστ 2: Πολλαπλής Επιλογής</h3><div class="quiz-container">';
        mcQuestions.forEach((q, idx) => {
            html += `
            <div class="quiz-question" data-question="${idx}" style="margin-bottom: 2rem;">
                <p style="font-weight: 500; font-size: 1.1rem; color: var(--primary-dark); margin-bottom: 0.8rem;">${idx + 1}. ${q.q}</p>
                <div class="quiz-options">`;
            const letters = ['α', 'β', 'γ', 'δ'];    
            const values = ['a', 'b', 'c', 'd'];
            q.opts.forEach((optStr, optIdx) => {
                html += `
                    <label class="quiz-option"><input type="radio" name="mc_q${idx}" value="${values[optIdx]}"> ${letters[optIdx]}) ${optStr}</label>`;
            });
            html += `
                </div>
            </div>`;
        });
        html += '<button id="submit-mc" class="btn" style="margin-top: 1rem;">Υποβολή Πολλαπλής</button><div id="mc-result" style="margin-top:1rem; font-weight:bold;"></div></div>';
        mcContainer.innerHTML = html;

        document.getElementById('submit-mc').addEventListener('click', () => {
            let score = 0;
            const total = mcQuestions.length;
            
            mcContainer.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('correct', 'incorrect'));
            
            for (let i = 0; i < total; i++) {
                const selected = document.querySelector(`input[name="mc_q${i}"]:checked`);
                const correct = document.querySelector(`input[name="mc_q${i}"][value="a"]`);
                
                if (correct) correct.closest('.quiz-option').classList.add('correct');
                if (selected) {
                    if (selected.value === 'a') score++;
                    else selected.closest('.quiz-option').classList.add('incorrect');
                }
            }
            
            const res = document.getElementById('mc-result');
            res.textContent = `Βρήκες ${score}/${total} σωστές απαντήσεις!`;
            res.style.color = (score === total) ? '#84cc16' : '#1B2621';
        });
    }
});
