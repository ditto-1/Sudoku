let isresetting = false;
const subgrids = document.querySelectorAll(".subgrid");
const allCells = [];

subgrids.forEach((subgrid, s_index)=> {
    const subgrid_row = Math.floor(s_index/3);
    const subgrid_col = s_index % 3;

    const cells = subgrid.querySelectorAll(".cell");
    cells.forEach((cell, c_index) => {
        const cell_row = Math.floor(c_index/3);
        const cell_col = c_index % 3;

        const global_row = subgrid_row*3 + cell_row;
        const global_col = subgrid_col*3 + cell_col;

        cell.setAttribute('data-row', global_row);
        cell.setAttribute('data-col', global_col);
        cell.setAttribute('data-box', s_index);

        allCells.push(cell);
    });
});

function applyHighlight(targetRow, targetCol){
    allCells.forEach(cell => cell.classList.remove('highlight'));

    allCells.forEach(cell=>{
        const cellRow = cell.getAttribute('data-row');
        const cellCol = cell.getAttribute('data-col');

        if (cellRow == targetRow ^ cellCol == targetCol){
            cell.classList.add('highlight');
        }
    });
}

const nums = document.querySelectorAll(".num");

const error_text = document.getElementById("error-count");
let error = 3;
nums.forEach(button => {
    button.addEventListener('mousedown', (event) => {
        event.preventDefault();

        const active_cell = document.activeElement;

        if (active_cell && active_cell.classList.contains('cell')){
            active_cell.classList.remove('wrong');
            
            const player_input = button.textContent.trim();
            const correct = active_cell.getAttribute('solution');

            active_cell.value = player_input;
            if (player_input == correct){
                active_cell.classList.remove('wrong');
                active_cell.classList.add('correct');
                active_cell.classList.add('given');
                active_cell.readOnly = true;
                const isComplete = allCells.every(cell => cell.value!=="" && !cell.classList.contains('wrong'));
                if (isComplete){
                    stopTimer();
                    document.querySelector('.alert').style.visibility="visible";
                    document.querySelector('.msg').textContent = "YOU WON!!\nTime taken: "+document.querySelector('.time').textContent;
                    document.querySelector('.msg').style.fontSize = "25px";
                    document.querySelector('.play-again').style.visibility = "hidden";
                    
                }
            } else {
                active_cell.classList.add('wrong');
                error--;
                if (error <= 0) error=0;
                error_text.textContent=error;
                if (error_text.textContent == 0){
                    stopTimer();
                    const alert = document.querySelector('.alert');
                    alert.style.visibility="visible";
                }

            }
         }
    });
});

const reset = document.querySelector('.play-again');
reset.addEventListener('click', () => {
    isresetting=true;
    if (document.activeElement){
        document.activeElement.blur();
    }

    allCells.forEach(cell => {
        cell.value = "";
        cell.classList.remove('wrong', 'given', 'correct', 'highlight');
    });
    error = 3;
    error_text.textContent = error;
    document.querySelector('.alert').style.visibility = "hidden";
    stopTimer();
    generate(40);
});

allCells.forEach(cell => {
    cell.addEventListener('focus', () => {
        if (cell.classList.contains('given')) return;
        const r = cell.getAttribute('data-row');
        const c = cell.getAttribute('data-col');
        applyHighlight(r, c);
    });

    cell.addEventListener('blur', (e) => {
        if (isresetting) return;
        if (cell.classList.contains('wrong')){
            setTimeout(() => cell.focus(), 0);
        }else{
            setTimeout(() => {
                if (!document.activeElement.classList.contains('cell')){
                    allCells.forEach(c => 
                        c.classList.remove('highlight'));
                }
            }, 0);
        }
    });

    cell.addEventListener('keydown', (e) => {
        if (e.key === "Backspace" || e.key === "Delete"){
            if (cell.classList.contains('wrong')){
                cell.classList.remove('wrong');
                cell.value = "";
            }else if(!cell.readOnly){
                cell.value="";
            }
        }
    })
});

function fill(index=0) {
    if (index == 81) return true;
    const cell = allCells[index];
    let num = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(()=> Math.random()-0.5);
    for(let n of num){
        if (isValid(cell, n)){
            cell.value = n;
            if (fill(index+1)) return true;
            cell.value="";
        }
    }
    return false;
}

function generate(difficulty=35){
    allCells.forEach(cell => {
        cell.classList.remove('wrong', 'given', 'correct', 'highlight');
        cell.readOnly = false;
        cell.tabIndex=0;
        cell.value = "";
    });

    fill();
     allCells.forEach(cell => {
        cell.setAttribute('solution', cell.value);
    });


    let removed = 0;
    while (removed < difficulty) {
        let r_index = Math.floor(Math.random() * 81);
        let cell = allCells[r_index];
        if (cell.value !== "") {
            cell.value = "";
            removed++;
        }
    }
    allCells.forEach(c => {
        if (c.value != ""){
            c.readOnly = true;
            c.classList.add('given');
            c.tabIndex = -1;
        }
    });

    Starttimer();
}

function isValid(cell, num){
    const r = cell.getAttribute('data-row');
    const c = cell.getAttribute('data-col');
    const b = cell.getAttribute('data-box');

    for(let i=0; i<allCells.length; i++){
        const other = allCells[i];
        if (other == cell) continue;
        row = other.getAttribute('data-row');
        col = other.getAttribute('data-col');
        box = other.getAttribute('data-box');

        if (other.value == num){
            if (row === r || col === c || box === b){
                return false;
            }
        }
    }
    return true;

}


let timeInterval;
let totalseconds = 0;
function Starttimer(){
    clearInterval(timeInterval);
    totalseconds=0;
    updateTime();

    timeInterval = setInterval(()=>{
        totalseconds++;
        updateTime();
    }, 1000);
}

function updateTime(){
    let hour = Math.floor(totalseconds/3600);
    let minute = Math.floor((totalseconds%3600)/60);
    let seconds = totalseconds%60;

    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');

    const time = document.querySelector('.time');
    time.textContent = `${h}:${m}:${s}`;

}

function stopTimer(){
    clearInterval(timeInterval);
}


generate(1);