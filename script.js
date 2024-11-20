let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Player is 'X', CPU is 'O'
let winPattern = [];
const resultDisplay = document.getElementById('result');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const teddyBear = document.querySelector('.teddy-bear');
const teddyBear1 = document.querySelector('.teddy-bear1');

// Add event listeners to each cell
cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

// Add event listener to the restart button
restartBtn.addEventListener('click', restartGame);

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.getAttribute('data-index');

    // Check if the cell is already filled or if the game is over
    if (board[index] !== '' || resultDisplay.textContent) {
        return; // Cell already filled or game over
    }

    // Update board and cell display
    board[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // Check for a winner or draw
    if (checkWinner()) {
        resultDisplay.textContent = `Congratulations! Player ${currentPlayer} wins!`;
        highlightWinningCells(); // Highlight winning cells
        handleWin(currentPlayer); // Handle win animations
        return; // End the game
    } else if (board.every(cell => cell !== '')) {
        resultDisplay.textContent = `It's a draw!`;
        handleDraw(); // Handle draw animations
        return; // End the game
    }

    // Switch to CPU's turn
    currentPlayer = 'O';
    setTimeout(cpuMove, 500); // Delay CPU's move by 0.5 seconds
}

function cpuMove() {
    const bestMove = findBestMove();
    board[bestMove] = currentPlayer;

    // Show CPU's move
    cells[bestMove].textContent = currentPlayer;

    // Check for a winner or draw
    if (checkWinner()) {
        resultDisplay.textContent = `CPU ${currentPlayer} wins!`;
        highlightWinningCells(); // Highlight winning cells
        handleWin(currentPlayer); // Handle win animations
    } else if (board.every(cell => cell !== '')) {
        resultDisplay.textContent = `It's a draw!`;
        handleDraw(); // Handle draw animations
    } else {
        // Switch back to player's turn
        currentPlayer = 'X';
    }
}

function findBestMove() {
    // Check for winning move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = currentPlayer; // Make the move
            if (checkWinner()) {
                board[i] = ''; // Undo the move
                return i; // Return winning move
            }
            board[i] = ''; // Undo the move
        }
    }

    // Check for blocking move
    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = currentPlayer === 'X' ? 'O' : 'X'; // Opponent's move
            if (checkWinner()) {
                board[i] = ''; // Undo the move
                return i; // Return blocking move
            }
            board[i] = ''; // Undo the move
        }
    }

        // If no winning or blocking move, select a random available cell
        const availableMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    function checkWinner() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
    
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                winPattern = pattern; // Store the winning pattern
                return true;
            }
        }
        return false;
    }
    
    function highlightWinningCells() {
        if (winPattern.length > 0) {
            const [a, b, c] = winPattern;
            // Highlight the winning cells
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
        }
    }
    
    function restartGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        winPattern = [];
        resultDisplay.textContent = '';
        teddyBear.classList.remove('visible');
        teddyBear1.classList.remove('visible');
    
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner'); // Remove winner class
        });
    }
    
    function handleWin(player) {
        if (player === 'X') {
            // Player X wins
            teddyBear.classList.add('visible');
            teddyBear1.classList.add('visible'); // Show panda when player X wins
            createColorPapers(); // Create colorful papers when player X wins
        } else if (player === 'O') {
            // CPU wins
            teddyBear.classList.remove('visible'); 
            teddyBear1.classList.remove('visible'); // Hide panda when CPU wins
        }
    }
    
    function handleDraw() {
        teddyBear.classList.remove('visible');
        teddyBear1.classList.remove('visible'); // Hide panda on draw
        // You can add any additional draw animations here if needed
    }
    
    function createColorPapers() {
        const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple']; // Add more colors if needed
        for (let i = 0; i < 40; i++) { // Create 40 color papers
            const colorPaper = document.createElement('div');
            const size = Math.random() * 20 + 5; // Random size between 5px and 25px
            const leftPosition = Math.random() * 100; // Random horizontal position within 0 to 100vw
            const bottomPosition = Math.random() * 100; // Random vertical position within 0 to 100vh
            
            // Set styles for the color paper
            colorPaper.classList.add('color-paper', colors[Math.floor(Math.random() * colors.length)]);
            colorPaper.style.width = `${size}px`;
            colorPaper.style.height = `${size}px`;
            colorPaper.style.position = 'absolute';
            colorPaper.style.left = `${leftPosition}vw`;
            colorPaper.style.bottom = `0`; // Start from the bottom
            colorPaper.style.opacity = '0.8'; // Set initial opacity
    
            // Append to the body
            document.body.appendChild(colorPaper);
    
            // Trigger the animation
            setTimeout(() => {
                const randomX = (Math.random() - 0.5) * 200; // Random horizontal movement
                const randomY = (Math.random() * 150) + 50; // Random upward movement
                const rotation = Math.random() * 360; // Random rotation
    
                // Apply transformations for the animation
                colorPaper.style.transform = `translate(${randomX}px, -${randomY}px) rotate(${rotation}deg) scale(${Math.random() * 1.5 + 0.5})`; // Move up, rotate, and scale
                colorPaper.style.opacity = '0'; // Fade out
            }, 10); // Short delay to allow the element to be added to the DOM
    
            // Remove the color paper after animation
            setTimeout(() => {
                colorPaper.remove();
            }, 2000); // Match the duration of the animation
        }
    }
    
    // Initialize the game
restartGame();