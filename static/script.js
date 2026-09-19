const fileInput = document.querySelector('#file-input');
const cameraInput = document.querySelector('#camera-input');
const dropZone = document.querySelector('#drop-zone');
const modal = document.querySelector('#loading-modal');
const results = document.querySelector('#results');
const resultPhoto = document.querySelector('#result-photo');
const scanPreview = document.querySelector('#scan-preview');

const levels = [
  { value: 8, status: 'Good', color: '#57a878', meaning: 'The air looks clean. It’s a great time for outdoor activity and fresh-air routines.', tips: ['Enjoy outdoor plans as usual.', 'Open windows if conditions are comfortable.', 'Keep an eye on local forecasts for changes.'] },
  { value: 18, status: 'Moderate', color: '#e9a84a', meaning: 'Air quality is acceptable. People unusually sensitive to particle pollution may consider limiting prolonged outdoor exertion.', tips: ['Most people can enjoy normal outdoor activity.', 'If you are sensitive, take breaks during long exertion.', 'Consider checking official local air-quality updates.'] },
  { value: 42, status: 'Unhealthy for sensitive groups', color: '#ec8061', meaning: 'People with asthma, heart or lung conditions, and children may feel effects from prolonged exposure.', tips: ['Sensitive groups should reduce long outdoor activity.', 'Close windows during peak traffic or haze.', 'Keep reliever medication accessible if prescribed.'] }
];

function processImage(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = event => {
    const url = event.target.result;
    scanPreview.style.backgroundImage = `url(${url})`;
    resultPhoto.style.backgroundImage = `url(${url})`;
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    window.setTimeout(() => showResult(url), 2050);
  };
  reader.readAsDataURL(file);
}

function showResult() {
  const level = levels[Math.floor(Math.random() * levels.length)];
  document.querySelector('#pm-value').textContent = level.value;
  document.querySelector('#status-text').textContent = level.status;
  document.querySelector('.status i').style.background = level.color;
  document.querySelector('#meaning-text').textContent = level.meaning;
  document.querySelector('#chart-caption').textContent = `${level.value} μg/m³ · ${level.status}`;
  document.querySelector('#precaution-list').innerHTML = level.tips.map(tip => `<li>${tip}</li>`).join('');
  const values = [Math.max(5, level.value - 9), Math.max(6, level.value - 5), Math.max(7, level.value - 2), level.value + 4, level.value];
  document.querySelector('#bars').innerHTML = values.map(value => `<i style="height:${Math.min(100, 16 + value * 1.8)}%"></i>`).join('');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  results.classList.add('show');
  document.body.style.overflow = 'hidden';
}

[fileInput, cameraInput].forEach(input => input.addEventListener('change', event => processImage(event.target.files[0])));
['dragenter', 'dragover'].forEach(eventName => dropZone.addEventListener(eventName, event => { event.preventDefault(); dropZone.classList.add('dragging'); }));
['dragleave', 'drop'].forEach(eventName => dropZone.addEventListener(eventName, event => { event.preventDefault(); dropZone.classList.remove('dragging'); }));
dropZone.addEventListener('drop', event => processImage(event.dataTransfer.files[0]));
document.querySelector('#close-results').addEventListener('click', () => { results.classList.remove('show'); document.body.style.overflow = ''; });
document.querySelector('#analyze-again').addEventListener('click', () => { results.classList.remove('show'); document.body.style.overflow = ''; document.querySelector('#upload').scrollIntoView(); });

const revealItems = document.querySelectorAll('.hero-copy, .hero-art, .stats-strip > *, .how > *, .upload-section > *, .impact-card, .feedback-section > *, footer > *');
revealItems.forEach(item => item.classList.add('reveal'));
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting));
}, { threshold: 0.16 });
revealItems.forEach(item => revealObserver.observe(item));
