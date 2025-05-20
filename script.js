let drink = '', sugar = '', strength = '', milkType = '', temp = '', note = '';
const summary = [];

function nextStep(selectedDrink) {
  drink = selectedDrink.toLowerCase();

  if (drink === 'kopi' || drink === 'teh') {
    showStep('step2'); // start custom flow
  } else {
    alert(`${selectedDrink} flow is not implemented yet. Only Kopi and Teh are supported for now.`);
    resetWizard();
  }
}

function setSugar(val) {
  sugar = val;
  showStep('step3');
}

function setStrength(val) {
  strength = val;
  showStep('step4');
}

function setMilkType(val) {
  milkType = val;
  showStep('step5');
}

function setTemp(val) {
  temp = val;
  showStep('step6');
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

  if (drink === 'kopi' || drink === 'teh') {
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
  updateOrders();
  resetWizard();
}

function updateOrders() {
  const container = document.getElementById('orders');
  container.innerHTML = '';
  summary.forEach((item, i) => {
    const div = document.createElement('div');
    div.className = 'order-item';

    const text = document.createElement('span');
    text.textContent = `${i + 1}. ${item}`;

    const btn = document.createElement('button');
    btn.textContent = '❌';
    btn.className = 'delete-btn';
    btn.onclick = () => {
      summary.splice(i, 1);
      updateOrders();
    };

    div.appendChild(text);
    div.appendChild(btn);
    container.appendChild(div);
  });
}

function copySummary() {
  const text = summary.map((item, i) => `${i + 1}. ${item}`).join('\n');
  navigator.clipboard.writeText(text);
  alert('Order copied to clipboard!');
}

function resetWizard() {
  drink = sugar = strength = milkType = temp = note = '';
  document.getElementById('customNote').value = '';
  document.getElementById('softDrinkName').value = '';
  showStep('step1');
}

function showStep(stepId) {
  const steps = document.querySelectorAll('.step');
  steps.forEach(s => s.classList.remove('active'));
  document.getElementById(stepId).classList.add('active');
}

