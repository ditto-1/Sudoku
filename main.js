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

nums.forEach(button => {
    button.addEventListener('mousedown', (event) => {
        event.preventDefault();

        const active_cell = document.activeElement;

        if (active_cell && active_cell.classList.contains('cell')){
            const val = button.textContent.trim();
            if (isValid(active_cell, val)){
                active_cell.value = val;
            } else {
                active_cell.value = val;
                document.querySelector('.alert').style.visibility = "visible";
            }
        }
    });
});

allCells.forEach(cell => {
    cell.addEventListener('focus', () => {
        const r = cell.getAttribute('data-row');
        const c = cell.getAttribute('data-col');
        applyHighlight(r, c);
    });

    cell.addEventListener('blur', () => {
        setTimeout(()=> {
            if (!document.activeElement.classList.contains('cell')){
                allCells.forEach(c => c.classList.remove('highlight'));
            }
        }, 50);
    });
});

function fill(count) {
    allCells.forEach(cell => cell.value='');

    let available = [...allCells];
    for(let i=0; i<count; i++){
        const random = Math.floor(Math.random() * available.length);
        const cell = available[random];
        const random_num = Math.floor(Math.random() * 9) + 1;
        if (isValid(cell, random_num)){
            cell.value = random_num;
            cell.readOnly = true;
        } else {
            i--;
        }
        available.splice(random, 1);
    }
}

function isValid(cell, num){
    const r = cell.getAttribute('data-row');
    const c = cell.getAttribute('data-col');
    const b = cell.getAttribute('data-box');

    for(const other of allCells){
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

fill(25);