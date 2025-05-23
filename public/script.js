let drink = '',
    sugar = 'normal',
    strength = 'normal',
    milkType = 'condensed',
    temp = 'hot',
    note = '';
let currentStep = 1;
const summary = [];

function showCustomization() {
  document.getElementById('sugarOptions').style.display = 'block';
  document.querySelector('.customize-btn').style.display = 'none';
}


//for quick-add function and to reflect the previous drink in the button text
function buildOrderSinglish(drink, sugar, strength, milkType, temp) {
  let order = '';

  // Capitalize drink name
  if (drink) {
    order += drink.charAt(0).toUpperCase() + drink.slice(1);
  }

  // Milk type logic (capitalize 'O' if alone)
  if (milkType === 'o') {
    order += ' O';
  } else if (milkType === 'c') {
    order += ' C';
  }

  // Strength
  if (strength === 'po') order += ' po';
  else if (strength === 'gau') order += ' gau';
  else if (strength === 'di lo') order += ' di lo';

  // Sugar
  if (sugar === 'kosong') order += ' kosong';
  else if (sugar === 'siu dai') order += ' siu dai';
  else if (sugar === 'ga dai') order += ' ga dai';

  // Temperature
  if (temp === 'pua sio') order += ' pua sio';
  else if (temp === 'peng') order += ' peng';

  return order.trim();
}


function nextStep(selectedDrink) {
  drink = selectedDrink.toLowerCase();

  // Only update quick labels if drink is valid
  if (['kopi', 'teh', 'milo'].includes(drink)) {
    // Set default values in case user adds to order immediately
    sugar = 'normal';
    strength = 'normal';
    milkType = 'condensed';
    temp = 'hot';

    updateQuickAddLabels(); // safe to call now
    showStep('step2'); // move to sugar selection
  } else {
    alert(`${selectedDrink} flow is not implemented yet. Only Kopi, Teh, and Milo are supported for now.`);
    resetWizard(); 
  }
}

function setSugar(level) {
  sugar = level;
  updateQuickAddLabels();
  showStep('step3'); // clicks to show milk type
}

function setMilkType(type) {
  milkType = type;
  updateQuickAddLabels();
  showStep('step4'); // clicks to shows Temp
}

function setTemp(tempLevel) {
  temp = tempLevel;
  updateQuickAddLabels();
  showStep('step5'); // clicks to show Strength
}
function setStrength(level) {
  strength = level;
  updateQuickAddLabels();
  showStep('step6'); // clicks to final step: Additional Notes
}


function askSoftDrink() {
  showStep('softDrinkInputStep');
}

function finalizeSoftDrinkManual() {
  const input = document.getElementById('softDrinkName').value.trim();
  if (input === '') {
    alert('Please enter the soft drink name!');
    return;
  }
  drink = input.toLowerCase();
  sugar = strength = milkType = temp = ''; // skip those
  addToSummary();
}

function addToSummary() {
  note = document.getElementById('customNote').value.trim();
  let order = drink;

  if (drink === 'kopi' || drink === 'teh' || drink === 'milo') {
    if (milkType === 'o') order += ' o';
    else if (milkType === 'c') order += ' c';
    // Default condensed, no suffix

    if (sugar === 'kosong') order += ' kosong';
    else if (sugar === 'siu dai') order += ' siu dai';
    else if (sugar === 'ga dai') order += ' ga dai';

    if (strength === 'po') order += ' po';
    else if (strength === 'gau') order += ' gau';
    else if (strength === 'di lo') order += ' di lo';

    if (temp === 'pua sio') order += ' pua sio';
    else if (temp === 'peng') order += ' peng';
    // hot = default
  }

  if (note) order += ' (' + note + ')';

  summary.push(order);
  summary.sort();
  updateOrders();
  resetWizard();
}

//Start of Order Summary Part 
function updateOrders() {
  const container = document.getElementById('orders');
  container.innerHTML = '';

  const seen = new Set();
  let displayIndex = 1;

  summary.forEach((order) => {
    if (seen.has(order)) return;
    seen.add(order);

    const count = summary.filter(item => item === order).length;

    const div = document.createElement('div');
    div.className = 'order-item';

    const text = document.createElement('span');
    text.textContent = `${displayIndex++}. ${order}${count > 1 ? ` x${count}` : ''}`;

    const buttonGroup = document.createElement('span');
    buttonGroup.className = 'order-btn-group';

    const addBtn = document.createElement('button');
    addBtn.textContent = '➕';
    addBtn.className = 'duplicate-btn';
    addBtn.onclick = () => {
      summary.push(order);
      summary.sort();
      updateOrders();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '❌';
    delBtn.className = 'delete-btn';
    delBtn.onclick = () => {
      const index = summary.indexOf(order);
      if (index !== -1) {
        summary.splice(index, 1);
        summary.sort();
        updateOrders();
      }
    };

    buttonGroup.appendChild(addBtn);
    buttonGroup.appendChild(delBtn);

    div.appendChild(text);
    div.appendChild(buttonGroup);
    container.appendChild(div);
  });
}

//End of Order Summary function

function copySummary() {
  const countMap = {};
  summary.forEach(order => {
    countMap[order] = (countMap[order] || 0) + 1;
  });

  const text = Object.entries(countMap)
    .map(([order, count], i) => `${i + 1}. ${order}${count > 1 ? ` x${count}` : ''}`)
    .join('\n');

  navigator.clipboard.writeText(text);
  alert('Your Orders are copied to the clipboard! Now you can paste it anywhere (e.g. WhatsApp, Telegram, SMS), to send to your friend ordering the drinks for you!');
}

function resetWizard() {
  drink = sugar = strength = milkType = temp = note = '';
  document.getElementById('customNote').value = '';
  document.getElementById('softDrinkName').value = '';
  showStep('step1');
}

function showStep(stepId) {//updated to accommodate for backstep function
  const steps = document.querySelectorAll('.step');
  steps.forEach(s => s.classList.remove('active'));

  const stepElement = document.getElementById(stepId);
  stepElement.classList.add('active');

  const stepNumber = parseInt(stepId.replace('step', ''));
  if (!isNaN(stepNumber)) {
    currentStep = stepNumber;
  }
}

function updateQuickAddLabels() {
  const quickSpans = document.querySelectorAll('#quickDrinkName');
  const orderText = buildOrderSinglish(drink, sugar, strength, milkType, temp);
  quickSpans.forEach(span => {
    span.textContent = orderText;
  });
}

function backStep() {
  if (currentStep > 1) {
    currentStep--; 
  
    // Reset drink properties based on what step we're going back to
    switch (currentStep) {
      case 2:
        sugar = 'normal';
        strength = 'normal';
        milkType = 'condensed';
        temp = 'hot';
        break;
      case 3://selected sugar
        strength = 'normal';
        milkType = 'condensed';
        temp = 'hot';
        break;
      case 4:
        temp = 'hot';
        strength = 'normal';
        break;
      case 5:
        strength = 'normal';
        break;
      case 6:
        note = '';
        break;
    }

    updateQuickAddLabels();
    showStep(`step${currentStep}`);
  }
}

// this function is for the mobile phone installation part
function toggleHelp() {
  const modal = document.getElementById('helpModal');
  const current = modal.style.display;
  modal.style.display = (current === 'block') ? 'none' : 'block';
}

//this function is for the easter egg
let eggTapCount = 0;
let eggTimer;

function revealEasterEgg() {
  const btn = document.getElementById('easterEggBtn');
  const faces = ["🤔", "🧐", "😲"];

  eggTapCount++;

  clearTimeout(eggTimer);
  eggTimer = setTimeout(() => {
    eggTapCount = 0;
    btn.textContent = faces[0]; // Reset face
  }, 3000);

  if (eggTapCount < 3) {
    btn.textContent = faces[eggTapCount];
  }

  if (eggTapCount === 3) {
    btn.textContent = faces[0];
    eggTapCount = 0;
    toggleEasterEgg(true);
  }
}

function toggleEasterEgg(show) {
  const modal = document.getElementById('easterEggModal');
  modal.style.display = show ? 'block' : 'none';
}

