document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const dropZone = document.getElementById('flask-drop-zone');
    const flaskLiquid = document.getElementById('flask-liquid-rect');
    
    // HUD & Controls
    const tempSlider = document.getElementById('temp-slider');
    const tempVal = document.getElementById('temp-val');
    const tempFill = document.getElementById('temp-fill');
    const burnerFlame = document.querySelector('.burner-flame');
    const phDisplay = document.getElementById('ph-display');
    const phArrow = document.getElementById('ph-arrow');
    const resetBtn = document.getElementById('reset-workspace');
    const finalizeBtn = document.getElementById('finalize-mix');
    
    // Inventory
    const addVialBtn = document.getElementById('add-vial-btn');
    const ingredientSelect = document.getElementById('ingredient-select');
    const shelfSlots = document.querySelectorAll('.shelf-slot');

    // Avatar
    const speechBubble = document.getElementById('chemist-speech');
    
    // 2. Physics & State
    let currentLevel = 300;     // 300 = Empty, 100 = Full
    const MAX_LEVEL = 100;      
    const DROP_AMOUNT = 35;     
    
    let curR = 255, curG = 255, curB = 255;
    let totalDrops = 0;
    let currentPh = 7.0;        
    let isBoiling = false;

    // Generated Mix ID tracking for shelf logic
    let savedMixesCount = 0;
    
    // Ingredients Dictionary
    const ingredientsData = {
        'red': { r: 239, g: 68, b: 68, phShift: -2.0, name: 'Ισχυρό Οξύ', msg: 'Προσοχή: Ισχυρό Οξύ!' },
        'blue': { r: 59, g: 130, b: 246, phShift: +2.0, name: 'Ισχυρή Βάση', msg: 'Ισχυρή Βάση.' },
        'yellow': { r: 252, g: 211, b: 77, phShift: -0.5, name: 'Ήπιο Οξύ', msg: 'Προσθήκη Ήπιου Οξέος.' },
        'green': { r: 34, g: 197, b: 94, phShift: +0.5, name: 'Ήπια Βάση', msg: 'Προσθήκη Ήπιας Βάσης.' },
        'clear': { r: 255, g: 255, b: 255, phShift: 0, name: 'Νερό', msg: 'Αραίωση με Νερό.' } // white visually
    };

    function chemistSpeaks(text) {
        speechBubble.innerHTML = text;
        speechBubble.style.opacity = '1';
    }

    // --- 3. INVENTORY & SHELF LOGIC ---
    
    function findEmptySlot() {
        for (let slot of shelfSlots) {
            if (!slot.classList.contains('occupied')) {
                return slot;
            }
        }
        return null; // Shelves are full
    }

    function createVialElement(idStr, rgbStr, labelText, customPhShift = 0) {
        const container = document.createElement('div');
        container.className = 'tube-container';
        container.setAttribute('draggable', 'true');
        
        // Save the dynamic values as data attributes
        container.dataset.liquidId = idStr;
        container.dataset.rgb = rgbStr;
        container.dataset.phShift = customPhShift;
        container.dataset.name = labelText;
        
        container.innerHTML = `
            <div class="test-tube"><div class="liquid" style="background: ${rgbStr}"></div></div>
            <span class="tube-tag">${labelText}</span>
        `;
        
        // Attach drag events to the newly spawned vial
        container.addEventListener('dragstart', (e) => {
            // We pass the slot id to know which item we are consuming
            container.classList.add('dragging');
            e.dataTransfer.setData('source-slot-id', container.parentElement.dataset.slotId);
            
            // Pass all chemical data
            e.dataTransfer.setData('liquid-id', container.dataset.liquidId);
            e.dataTransfer.setData('rgb', container.dataset.rgb);
            e.dataTransfer.setData('ph-shift', container.dataset.phShift);
            e.dataTransfer.setData('name', container.dataset.name);
            
            e.dataTransfer.effectAllowed = 'move';
        });
        
        container.addEventListener('dragend', () => {
            container.classList.remove('dragging');
        });
        
        return container;
    }

    addVialBtn.addEventListener('click', () => {
        const slot = findEmptySlot();
        if (!slot) {
            chemistSpeaks('⚠️ Τα ράφια είναι γεμάτα! Αδειάστε χώρο πρώτα.');
            return;
        }
        
        const selVal = ingredientSelect.value;
        const data = ingredientsData[selVal];
        
        // Base formulation style for standard ingredients
        const rgbStr = `rgba(${data.r}, ${data.g}, ${data.b}, 0.9)`;
        const newVial = createVialElement(selVal, rgbStr, data.name, data.phShift);
        
        slot.appendChild(newVial);
        slot.classList.add('occupied');
        chemistSpeaks(`Το ${data.name} προστέθηκε στο ράφι.`);
    });

    // --- 4. DRAG TO FLASK LOGIC ---

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault(); 
        e.dataTransfer.dropEffect = 'move';
        dropZone.classList.add('drag-active');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-active');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-active');
        
        const sourceSlotId = e.dataTransfer.getData('source-slot-id');
        if (!sourceSlotId) return; // not a vial
        
        if (currentLevel <= MAX_LEVEL) {
            chemistSpeaks('⚠️ Στοπ! Η φιάλη γέμισε!!');
            flaskLiquid.parentElement.style.animation = 'boilShake 0.3s';
            setTimeout(()=> flaskLiquid.parentElement.style.animation = '', 300);
            return;
        }

        // We consume the vial from the shelf
        const sourceSlot = document.querySelector(`.shelf-slot[data-slot-id="${sourceSlotId}"]`);
        const vialEl = sourceSlot.querySelector('.tube-container');
        
        // Extract data
        const rData = e.dataTransfer.getData('rgb'); // "rgba(r,g,b,a)" string
        const phShift = parseFloat(e.dataTransfer.getData('ph-shift'));
        const lname = e.dataTransfer.getData('name');
        
        // Parse RGB manually from string for pouring blend logic
        let rawR=255, rawG=255, rawB=255;
        const rgbaMatch = rData.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if(rgbaMatch) {
            rawR = parseInt(rgbaMatch[1]);
            rawG = parseInt(rgbaMatch[2]);
            rawB = parseInt(rgbaMatch[3]);
        }

        // Apply visual pour
        pourLiquid(rawR, rawG, rawB, phShift, lname, rData);
        // vialEl.remove(); // Keep on shelf for reuse
        // sourceSlot.classList.remove('occupied');
    });

    // --- 5. POURING PHYSICS ---
    function pourLiquid(r, g, b, phShift, name, rgbStr) {
        // Create an anchor at the exact mouth position of the flask
        const anchor = document.createElement('div');
        anchor.className = 'pour-anchor';
        dropZone.appendChild(anchor);

        // All elements are now children of the anchor
        const pourAnim = document.createElement('div');
        pourAnim.className = 'pouring-tube';
        pourAnim.innerHTML = `<div class="liquid" style="background: ${rgbStr}"></div>`;
        anchor.appendChild(pourAnim);

        const streamAnim = document.createElement('div');
        streamAnim.className = 'drop-stream';
        streamAnim.style.background = rgbStr;
        anchor.appendChild(streamAnim);

        // Interaction timing
        setTimeout(() => {
            mixAndRender(r, g, b, phShift);
            chemistSpeaks(`Προστέθηκε: ${name}`);
        }, 400);

        // Cleanup the whole anchor system
        setTimeout(() => anchor.remove(), 1300);
    }

    // --- 6. BLENDING MATH ---
    function mixAndRender(r, g, b, phShift) {
        totalDrops++;
        if (totalDrops === 1) {
            curR = r; curG = g; curB = b;
        } else {
            curR = Math.floor(((curR * (totalDrops - 1)) + r) / totalDrops);
            curG = Math.floor(((curG * (totalDrops - 1)) + g) / totalDrops);
            curB = Math.floor(((curB * (totalDrops - 1)) + b) / totalDrops);
        }
        
        currentPh += (phShift / Math.sqrt(totalDrops));
        currentPh = Math.max(0, Math.min(14, currentPh));
        currentLevel = Math.max(MAX_LEVEL, currentLevel - DROP_AMOUNT);

        flaskLiquid.setAttribute('y', currentLevel);
        flaskLiquid.setAttribute('fill', `rgba(${curR}, ${curG}, ${curB}, 0.85)`);

        updateInstruments();
    }

    // --- 7. HUD CONTROLS (Temp & pH) ---
    tempSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        tempVal.textContent = val;
        
        if (val < 40) {
            burnerFlame.style.opacity = '0';
        } else {
            burnerFlame.style.opacity = ((val-40)/60).toString();
        }

        if (val >= 90 && !isBoiling) {
            isBoiling = true;
            flaskLiquid.parentElement.style.animation = 'boilShake 0.1s infinite alternate';
            chemistSpeaks('⚠️ Ο βρασμός ξεκίνησε!');
        } else if (val < 90 && isBoiling) {
            isBoiling = false;
            flaskLiquid.parentElement.style.animation = '';
        }
    });

    function updateInstruments() {
        phDisplay.textContent = currentPh.toFixed(2);
        
        if (currentPh < 5) phDisplay.style.color = '#ef4444'; 
        else if (currentPh > 9) phDisplay.style.color = '#3b82f6'; 
        else phDisplay.style.color = '#10b981'; 

        const scalePercent = (currentPh / 14) * 100;
        phArrow.style.left = scalePercent + '%';
        // phArrow.style.color = phDisplay.style.color;
    }

    // --- 8. GLOBAL ACTIONS ---
    resetBtn.addEventListener('click', () => {
        currentLevel = 300;
        curR = 255; curG = 255; curB = 255;
        totalDrops = 0; currentPh = 7.0;
        
        flaskLiquid.setAttribute('y', currentLevel);
        flaskLiquid.setAttribute('fill', 'transparent');
        
        updateInstruments();
        chemistSpeaks('Η φιάλη καθαρίστηκε. Έτοιμοι για νέο πείραμα!');
    });

    finalizeBtn.addEventListener('click', () => {
        if (totalDrops === 0) return alert('Η φιάλη είναι άδεια.');
        
        const slot = findEmptySlot();
        if (!slot) {
            chemistSpeaks('⚠️ Δεν υπάρχει χώρος στα ράφια για την εμφιάλωση! Αδειάστε χώρο καταναλώνοντας φιαλίδια.');
            return;
        }

        savedMixesCount++;
        const finalRgbStr = `rgba(${curR}, ${curG}, ${curB}, 0.9)`;
        const newPhShift = currentPh - 7.0; // The mixture's standalone shift from neutral

        const newVial = createVialElement('mix', finalRgbStr, `Μίγμα #${savedMixesCount}`, newPhShift);
        slot.appendChild(newVial);
        slot.classList.add('occupied');

        // Reset Flask
        resetBtn.click();
        
        chemistSpeaks(`Εμφιαλώθηκε και προστέθηκε στο ράφι ως <b>Μίγμα #${savedMixesCount}</b>!`);
    });

    // Initialize shelves with base ingredients
    function initShelves() {
        ['red', 'blue', 'yellow', 'green', 'clear'].forEach(key => {
            const slot = findEmptySlot();
            if(slot) {
                const data = ingredientsData[key];
                const rgbStr = `rgba(${data.r}, ${data.g}, ${data.b}, 0.9)`;
                const newVial = createVialElement(key, rgbStr, data.name, data.phShift);
                slot.appendChild(newVial);
                slot.classList.add('occupied');
            }
        });
    }

    // Call init at startup
    initShelves();

    // Dynamic keyframe injection for boiling
    const style = document.createElement('style');
    style.innerHTML = `@keyframes boilShake { 0% { transform: translate(1px, 1px) rotate(0deg); } 50% { transform: translate(-1px, -1px) rotate(0.5deg); } 100% { transform: translate(1px, -1px) rotate(0deg); } }`;
    document.head.appendChild(style);
});
