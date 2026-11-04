const $ = (selector) => document.querySelector(selector);
const perimeterShape = $('#perimeter-shape');
const areaShape = $('#area-shape');

function numberInput(id, label, value, min = 0.1) {
  return `<label>${label}<input id="${id}" type="number" min="${min}" step="any" value="${value}" inputmode="decimal"></label>`;
}
function read(id) { return Math.max(0, Number(document.getElementById(id)?.value) || 0); }
function setDimensionLabel(element, value, unit = 'cm') { element.textContent = `${Number(value.toFixed(2))} ${unit}`; }

function renderPerimeterInputs() {
  const shape = perimeterShape.value;
  const container = $('#perimeter-inputs');
  if (shape === 'square') container.innerHTML = numberInput('p-side', 'Side length (cm)', 5);
  else if (shape === 'triangle') container.innerHTML = `${numberInput('p-a', 'Side A (cm)', 5)}${numberInput('p-b', 'Side B (cm)', 6)}${numberInput('p-c', 'Side C (cm)', 7)}`;
  else container.innerHTML = `${numberInput('p-length', 'Length (cm)', 8)}${numberInput('p-width', 'Width (cm)', 5)}`;
  container.querySelectorAll('input').forEach((input) => input.addEventListener('input', updatePerimeter));
  updatePerimeter();
}
function updatePerimeter() {
  const shape = perimeterShape.value;
  let perimeter; let formula; let width; let height;
  if (shape === 'square') {
    const side = read('p-side'); perimeter = 4 * side; formula = 'P = 4 × side'; width = height = side;
  } else if (shape === 'triangle') {
    const a = read('p-a'); const b = read('p-b'); const c = read('p-c');
    perimeter = a + b + c; formula = 'P = side A + side B + side C'; width = a + b + c; height = Math.max(a, b, c);
    const valid = a + b > c && a + c > b && b + c > a;
    if (!valid && a + b + c > 0) formula = 'Those side lengths cannot make a triangle';
  } else {
    const length = read('p-length'); const breadth = read('p-width'); perimeter = 2 * (length + breadth); formula = 'P = 2 × (length + width)'; width = length; height = breadth;
  }
  $('#perimeter-result').textContent = `${Number(perimeter.toFixed(2))} cm`;
  $('#perimeter-formula').textContent = formula;
  const visual = $('#perimeter-visual');
  visual.className = `shape-visual ${shape === 'triangle' ? 'triangle-visual' : shape === 'square' ? 'square-visual' : 'rectangle-visual'}`;
  const x = $('#visual-width'); const y = $('#visual-height');
  if (shape === 'triangle') { x.textContent = 'Sides'; y.textContent = ''; }
  else { setDimensionLabel(x, width); setDimensionLabel(y, height); }
  const scale = Math.max(width, height, 1);
  if (shape !== 'triangle') { visual.style.width = `${Math.max(85, Math.min(250, 250 * width / scale))}px`; visual.style.height = `${Math.max(75, Math.min(155, 155 * height / scale))}px`; }
}
perimeterShape.addEventListener('change', renderPerimeterInputs);
renderPerimeterInputs();

function renderAreaInputs() {
  const shape = areaShape.value;
  const container = $('#area-inputs');
  if (shape === 'square') container.innerHTML = numberInput('a-side', 'Side length (cm)', 6);
  else if (shape === 'triangle') container.innerHTML = `${numberInput('a-base', 'Base (cm)', 8)}${numberInput('a-height', 'Perpendicular height (cm)', 5)}`;
  else container.innerHTML = `${numberInput('a-length', 'Length (cm)', 8)}${numberInput('a-width', 'Width (cm)', 5)}`;
  container.querySelectorAll('input').forEach((input) => input.addEventListener('input', updateArea));
  updateArea();
}
function updateArea() {
  const shape = areaShape.value;
  let area; let formula; let width; let height;
  if (shape === 'square') { const side = read('a-side'); area = side * side; formula = 'A = side × side'; width = height = side; }
  else if (shape === 'triangle') { const base = read('a-base'); height = read('a-height'); area = base * height / 2; formula = 'A = ½ × base × perpendicular height'; width = base; }
  else { width = read('a-length'); height = read('a-width'); area = width * height; formula = 'A = length × width'; }
  $('#area-result').textContent = `${Number(area.toFixed(2))} cm²`;
  $('#area-formula').textContent = formula;
  const visual = $('#area-visual');
  visual.className = `area-visual ${shape === 'triangle' ? 'triangle-visual' : shape === 'square' ? 'square-visual' : 'rectangle-visual'}`;
  setDimensionLabel($('#area-width-label'), width); setDimensionLabel($('#area-height-label'), height);
  const scale = Math.max(width, height, 1);
  if (shape !== 'triangle') { visual.style.width = `${Math.max(85, Math.min(260, 260 * width / scale))}px`; visual.style.height = `${Math.max(75, Math.min(155, 155 * height / scale))}px`; }
}
areaShape.addEventListener('change', renderAreaInputs);
renderAreaInputs();

const units = {
  length: [
    { name: 'millimetres (mm)', short: 'mm', factor: .001 },
    { name: 'centimetres (cm)', short: 'cm', factor: .01 },
    { name: 'metres (m)', short: 'm', factor: 1 },
    { name: 'kilometres (km)', short: 'km', factor: 1000 }
  ],
  area: [
    { name: 'square centimetres (cm²)', short: 'cm²', factor: .0001 },
    { name: 'square metres (m²)', short: 'm²', factor: 1 },
    { name: 'hectares (ha)', short: 'ha', factor: 10000 },
    { name: 'square kilometres (km²)', short: 'km²', factor: 1000000 }
  ]
};
function populateUnits() {
  const list = units[$('#conversion-type').value];
  const from = $('#from-unit'); const to = $('#to-unit');
  from.innerHTML = list.map((unit, index) => `<option value="${index}">${unit.name}</option>`).join('');
  to.innerHTML = list.map((unit, index) => `<option value="${index}">${unit.name}</option>`).join('');
  from.value = list.length > 1 ? '1' : '0';
  to.value = list.length > 2 ? '2' : '0';
  if (from.value === to.value) to.value = '0';
  updateConversion();
}
function formatNumber(value) { return Number(value.toPrecision(8)).toLocaleString(undefined, { maximumSignificantDigits: 8 }); }
function updateConversion() {
  const list = units[$('#conversion-type').value];
  const from = list[Number($('#from-unit').value)]; const to = list[Number($('#to-unit').value)];
  const value = Number($('#conversion-value').value);
  if (!Number.isFinite(value) || value < 0) {
    $('#conversion-result').textContent = 'Enter a non-negative number';
    $('#conversion-equation').textContent = 'Waiting for a valid measurement';
    return;
  }
  const converted = value * from.factor / to.factor;
  $('#conversion-result').textContent = `${formatNumber(converted)} ${to.short}`;
  $('#conversion-equation').textContent = `${formatNumber(value)} ${from.short} = ${formatNumber(converted)} ${to.short}`;
  const smaller = from.factor > to.factor;
  const ratio = Math.max(from.factor, to.factor) / Math.min(from.factor, to.factor);
  $('#conversion-hint').textContent = from.factor === to.factor ? 'Both units represent the same size.' : `A ${to.short} is ${formatNumber(ratio)} times ${smaller ? 'smaller' : 'larger'} than a ${from.short}.`;
}
$('#conversion-type').addEventListener('change', populateUnits);
$('#conversion-value').addEventListener('input', updateConversion);
$('#from-unit').addEventListener('change', updateConversion);
$('#to-unit').addEventListener('change', updateConversion);
populateUnits();

const questions = [
  { text: 'A rectangle is 7 cm long and 3 cm wide. What is its perimeter?', options: ['10 cm', '20 cm', '21 cm²', '42 cm'], answer: 1, explain: 'P = 2 × (7 + 3) = 20 cm.' },
  { text: 'A square has sides of 4 m. What is its area?', options: ['16 m²', '16 m', '8 m²', '20 m²'], answer: 0, explain: 'Area = side × side = 4 × 4 = 16 m².' },
  { text: 'What is the area of a triangle with base 10 cm and height 6 cm?', options: ['60 cm²', '30 cm²', '16 cm²', '32 cm²'], answer: 1, explain: 'Area = ½ × base × height = ½ × 10 × 6 = 30 cm².' },
  { text: 'How many centimetres are in 2.5 metres?', options: ['25 cm', '250 cm', '2,500 cm', '2500 mm'], answer: 1, explain: '1 m = 100 cm, so 2.5 × 100 = 250 cm.' },
  { text: 'Which unit is best for measuring the area of a classroom floor?', options: ['cm', 'm²', 'km', 'litres'], answer: 1, explain: 'Square metres (m²) are a suitable unit for a floor area.' }
];
let questionIndex = 0; let selectedAnswer = null; let score = 0; let answered = false;
const answers = $('#answers'); const quizAction = $('#quiz-action');
function renderQuestion() {
  const item = questions[questionIndex];
  $('#quiz-count').textContent = `QUESTION ${questionIndex + 1} OF ${questions.length}`;
  $('#progress-fill').style.width = `${(questionIndex + 1) / questions.length * 100}%`;
  $('#question').textContent = item.text;
  $('#feedback').textContent = ''; $('#feedback').className = 'feedback';
  $('#score').textContent = `Score: ${score}`;
  answers.replaceChildren(); selectedAnswer = null; answered = false;
  item.options.forEach((text, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'answer'; button.textContent = text;
    button.addEventListener('click', () => {
      if (answered) return;
      selectedAnswer = index;
      answers.querySelectorAll('button').forEach((option) => option.classList.toggle('selected', option === button));
      quizAction.disabled = false; quizAction.textContent = 'Check answer';
    });
    answers.append(button);
  });
  quizAction.disabled = true; quizAction.textContent = 'Check answer';
}
quizAction.addEventListener('click', () => {
  if (quizAction.dataset.retry === 'true') { questionIndex = 0; score = 0; quizAction.dataset.retry = 'false'; renderQuestion(); return; }
  if (!answered) {
    if (selectedAnswer === null) return;
    answered = true; const item = questions[questionIndex]; const correct = selectedAnswer === item.answer;
    if (correct) score++;
    answers.querySelectorAll('button').forEach((button, index) => {
      button.disabled = true;
      if (index === item.answer) button.classList.add('correct');
      else if (index === selectedAnswer) button.classList.add('incorrect');
    });
    $('#feedback').textContent = `${correct ? 'Correct!' : 'Not quite.'} ${item.explain}`;
    $('#feedback').classList.add(correct ? 'good' : 'bad');
    $('#score').textContent = `Score: ${score}`;
    quizAction.textContent = questionIndex === questions.length - 1 ? 'See results' : 'Next question';
  } else if (questionIndex < questions.length - 1) {
    questionIndex++; renderQuestion();
  } else {
    $('#quiz-count').textContent = 'QUIZ COMPLETE';
    $('#question').textContent = score === questions.length ? 'Excellent work—you’re a measurement star!' : score >= 3 ? 'Great job—you’re building strong measurement skills!' : 'Good try! Explore the tools and give it another go.';
    answers.replaceChildren(); $('#feedback').textContent = `You scored ${score} out of ${questions.length}.`;
    $('#feedback').className = 'feedback good'; quizAction.textContent = 'Try again'; quizAction.disabled = false; quizAction.dataset.retry = 'true';
  }
});
renderQuestion();
