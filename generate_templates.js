const fs = require('fs');

const rawHtml = fs.readFileSync('chap_1.html', 'utf8');

const grades = [
  { 
      id: 'b', 
      dir: 'B_GYMNASIOU', 
      classHtml: 'class_b_gym.html', 
      titlePrefix: "Β' Γυμνασίου" 
  },
  { 
      id: 'c', 
      dir: 'C_GYMNASIOU', 
      classHtml: 'class_c_gym.html', 
      titlePrefix: "Γ' Γυμνασίου" 
  }
];

// Helper to replace content
function generateHtml(grade, chapterNum) {
    let replaced = rawHtml;
    
    // Replace Title
    replaced = replaced.replace(/<title>Κεφάλαιο 1 Ερωτήσεις \| Αντώνης Χρονάκης<\/title>/, `<title>Κεφάλαιο ${chapterNum} Ερωτήσεις | ${grade.titlePrefix}</title>`);
    
    // Replace Return link
    replaced = replaced.replace(/<a href="class_a.html" class="chapter-nav-btn" title="Επιστροφή στα Κεφάλαια">/, `<a href="${grade.classHtml}" class="chapter-nav-btn" title="Επιστροφή στα Κεφάλαια">`);
    
    // Replace Header Title
    replaced = replaced.replace(/<h1 class="cv-section-title" style="margin-bottom: 0;">Κεφάλαιο 1<\/h1>/, `<h1 class="cv-section-title" style="margin-bottom: 0;">Κεφάλαιο ${chapterNum}</h1>`);
    
    // Fix next chapter navigation link (only dummy for now or next index)
    let nextChap = (chapterNum < 4) ? `chap_${grade.id}_gym_${chapterNum + 1}.html` : '#';
    replaced = replaced.replace(/<a href="chap_2.html" class="chapter-nav-btn" title="Επόμενο Κεφάλαιο \(2\)">/, `<a href="${nextChap}" class="chapter-nav-btn" title="Επόμενο Κεφάλαιο">`);
    
    // Replace the JS src
    replaced = replaced.replace(/<script src="questions.js"><\/script>/, `<script src="${grade.dir}/KEFALAIO_${chapterNum}/askiseis.js"></script>`);
    
    // Replace array names inside script tag
    // chapter1Questions -> chapter{N}Questions
    replaced = replaced.replace(/chapter1Questions/g, `chapter${chapterNum}Questions`);
    replaced = replaced.replace(/chapter1MCQ/g, `chapter${chapterNum}MCQ`);

    // Remove dummy pdf iframes to keep it clean, but keep container
    replaced = replaced.replace(/<iframe src="https:\/\/drive.google.com\/file\/d\/1dQ4gMKlX9o1bj5B65brYy2a8dXOj43Ov\/preview" class="pdf-frame" allow="autoplay" width="640" height="480"><\/iframe>/, '<p style="text-align:center; padding:2rem; color:var(--text-light);">Προσθέστε το Iframe του PDF εδώ.</p>');
    replaced = replaced.replace(/<iframe src="https:\/\/drive.google.com\/file\/d\/1OW6gU8K3uw4l9-rSx4toWJQCnDCrrE22\/preview" class="pdf-frame" allow="autoplay" width="640" height="480"><\/iframe>/, '<p style="text-align:center; padding:2rem; color:var(--text-light);">Προσθέστε το Iframe του PDF εδώ.</p>');

    return replaced;
}

for (const grade of grades) {
    for (let c = 1; c <= 4; c++) {
        const content = generateHtml(grade, c);
        const fileName = `chap_${grade.id}_gym_${c}.html`;
        fs.writeFileSync(fileName, content, 'utf8');
        console.log(`Created ${fileName}`);
    }
}
