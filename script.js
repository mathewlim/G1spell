
// Start music on first user interaction
document.addEventListener('click', function playBg() {
  const audio = document.getElementById('bg-music');
  audio.play().catch(e => console.warn('Playback prevented:', e));
  document.removeEventListener('click', playBg);
});

let score = 0;
let wordScores = [];

function shuffle(word) {
  const arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('') === word ? shuffle(word) : arr.join('');
}

function createWordSection(idx) {
  const w = words[idx], s = sentences[idx], scr = shuffle(w).split('');
  const section = document.createElement('div');
  section.className = 'word-section';
  section.innerHTML = `
    <div class="sentence">${idx+1}. ${s}</div>
    <div class="word-box-container" id="wc${idx}"></div>
    <div class="word-list" id="sl${idx}"></div>
    <div class="buttons">
      <button class="check-button" onclick="checkWord(${idx})">Check Answer</button>
      <button class="reset-button" onclick="resetWord(${idx})">Try Again</button>
    </div>
    <div class="well-done" id="wd${idx}">Well-done! 🎉</div>
  `;
  const boxCont = section.querySelector(`#wc${idx}`);
  w.split('').forEach((_,i)=>{
    const b = document.createElement('div');
    b.className = 'word-box';
    b.id = `b${idx}-${i}`;
    boxCont.appendChild(b);
  });
  const letterCont = section.querySelector(`#sl${idx}`);
  scr.forEach((ltr,i)=>{
    const ld = document.createElement('div');
    ld.className = 'letter';
    ld.textContent = ltr;
    ld.onclick = ()=> placeLetter(idx, ltr, i);
    letterCont.appendChild(ld);
  });
  return section;
}

function placeLetter(wi, letter, li) {
  const boxes = document.querySelectorAll(`#wc${wi} .word-box`);
  const empty = Array.from(boxes).find(b => !b.textContent);
  if (empty) {
    empty.textContent = letter;
    document.querySelectorAll(`#sl${wi} .letter`)[li].classList.add('hidden');
  }
}

function checkWord(i) {
  const filled = Array.from(document.querySelectorAll(`#wc${i} .word-box`)).map(b => b.textContent).join('');
  const correct = words[i];
  let all = true;
  document.querySelectorAll(`#wc${i} .word-box`).forEach((b,j)=>{
    b.classList.remove('correct','incorrect');
    if (b.textContent === correct[j]) b.classList.add('correct');
    else {
      if (b.textContent) b.classList.add('incorrect');
      all = false;
    }
  });
  const wd = document.getElementById(`wd${i}`);
  if (all && !wordScores[i]) {
    wordScores[i] = true;
    score++;
    wd.style.display = 'block';
    updateScore();
  } else if (!all && wordScores[i]) {
    wordScores[i] = false;
    score--;
    wd.style.display = 'none';
    updateScore();
  }
}

function updateScore() {
  const emojis = ["🎉","⭐","🌟","🎈","🎁","🏆","🍭","🎊","🎵","🎲","🎯","🍰","🚀","🥇"];
  document.getElementById('score').textContent = `Score: ${score} / ${words.length} ${score>0?emojis.slice(0,score).join(''):''}`;
}

function resetWord(i) {
  const wc = document.getElementById(`wc${i}`);
  const sl = document.getElementById(`sl${i}`);
  const wd = document.getElementById(`wd${i}`);
  wc.innerHTML = '';
  sl.innerHTML = '';
  words[i].split('').forEach((_,j)=>{
    const b = document.createElement('div');
    b.className = 'word-box';
    b.id = `b${i}-${j}`;
    wc.appendChild(b);
  });
  shuffle(words[i]).split('').forEach((ltr,j)=>{
    const ld = document.createElement('div');
    ld.className = 'letter';
    ld.textContent = ltr;
    ld.onclick = ()=> placeLetter(i, ltr, j);
    sl.appendChild(ld);
  });
  if (wordScores[i]) {
    wordScores[i] = false;
    score--;
    wd.style.display = 'none';
    updateScore();
  }
}

function init() {
  const gc = document.getElementById('game-container');
  gc.innerHTML = '';
  wordScores = new Array(words.length).fill(false);
  words.forEach((_,i)=> gc.appendChild(createWordSection(i)));
}

init();
