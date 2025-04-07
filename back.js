const players = [
    { name: "Jogador 1", position: 0, points: 0, canMoveNextTurn: true },
    { name: "Jogador 2", position: 0, points: 0, canMoveNextTurn: true },
    { name: "Jogador 3", position: 0, points: 0, canMoveNextTurn: true },
    { name: "Jogador 4", position: 0, points: 0, canMoveNextTurn: true }
];

let currentPlayerIndex = 0;
const rows = 5;
const cols = 5;
let gameStarted = false;
let isAnsweringQuestion = false;

// Perguntas
const questions = [
    { question: "A LGPD se aplica apenas a empresas que estão localizadas no Brasil.", answer: false },
    { question: "A LGPD permite que os dados pessoais sejam compartilhados livremente, sem o consentimento do titular dos dados.", answer: false },
    { question: "A LGPD exige que as empresas nomeiem um encarregado de proteção de dados, conhecido como DPO (Data Protection Officer).", answer: true },
    { question: "A LGPD obriga que todas as empresas tenham um sistema de criptografia para todos os dados pessoais armazenados.", answer: false },
    { question: "Os titulares dos dados têm o direito de solicitar a portabilidade de seus dados pessoais para outro prestador de serviços.", answer: true },
    { question: "A LGPD permite que os dados pessoais sejam usados para finalidades diferentes das inicialmente informadas, desde que o titular seja notificado.", answer: true },
    { question: "A LGPD não se aplica ao tratamento de dados pessoais de crianças e adolescentes.", answer: false },
    { question: "Se uma empresa violar a LGPD, ela pode ser multada em até 2% do seu faturamento anual, limitado a R$ 50 milhões por infração.", answer: true },
    { question: "A LGPD exige que os dados pessoais sejam coletados de forma excessiva e sem qualquer limitação.", answer: false },
    { question: "A LGPD exige que as empresas implementem medidas de segurança para proteger os dados pessoais contra acessos não autorizados.", answer: true },
    { question: "A LGPD permite que as empresas compartilhem dados pessoais sem a necessidade de consentimento se os dados forem necessários para a execução de um contrato.", answer: true },
    { question: "A LGPD não se aplica ao tratamento de dados pessoais realizado por pessoas físicas para fins exclusivamente pessoais.", answer: true },
    { question: "A LGPD exige que os dados pessoais sejam armazenados de forma indefinida, sem um prazo de retenção estabelecido.", answer: false },
    { question: "O titular dos dados tem o direito de solicitar a exclusão de seus dados pessoais, mesmo que a empresa precise manter esses dados por uma exigência legal.", answer: false },
    { question: "A LGPD permite o uso de dados pessoais para fins de marketing sem que o titular precise ser informado ou consentir.", answer: false },
    { question: "As empresas devem fornecer ao titular dos dados uma forma clara e acessível de exercer seus direitos, como o acesso, correção e exclusão de dados pessoais.", answer: true },
    { question: "A LGPD obriga as empresas a comunicar qualquer violação de dados pessoais à Autoridade Nacional de Proteção de Dados e aos titulares afetados.", answer: true },
    { question: "A LGPD exige que as empresas realizem uma análise de impacto à proteção de dados pessoais em todos os tratamentos realizados.", answer: true },
    { question: "A LGPD aplica-se apenas a empresas brasileiras, não afetando empresas estrangeiras que operam no Brasil.", answer: false }
];

// Salvar o nome dos jogadores
function setPlayerNames() {
    players[0].name = document.getElementById('player1Name').value || 'Jogador 1';
    players[1].name = document.getElementById('player2Name').value || 'Jogador 2';
    players[2].name = document.getElementById('player3Name').value || 'Jogador 3';
    players[3].name = document.getElementById('player4Name').value || 'Jogador 4';
    
    document.getElementById("playerTurn").innerText = `Agora é a vez de ${players[0].name}`;
    document.getElementById('nameInputs').style.display = 'none';
}

// Rolar o dado
function rollDice() {
    if (isAnsweringQuestion) {
        alert("Você precisa responder à pergunta antes de rolar o dado!"); // Alerta se ainda estiver respondendo à pergunta
        return;
    }

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    document.getElementById("diceResult").innerText = `${players[currentPlayerIndex].name} rolou: ${diceRoll}`;
    movePlayer(diceRoll);
    checkForQuestion(players[currentPlayerIndex].position);
}

// Mover o jogador
function movePlayer(steps) {
    let currentPos = players[currentPlayerIndex].position;
    let currentCol = Math.floor(currentPos / rows);
    let currentRow = currentPos % rows;

    for (let i = 0; i < steps; i++) {
        if (currentRow === rows - 1) {
            currentRow = 0;
            currentCol++;
        } else {
            currentRow++;
        }
    }

    let newPosition = currentCol * rows + currentRow;
    players[currentPlayerIndex].position = Math.min(newPosition, rows * cols - 1);
    players[currentPlayerIndex].points += steps;

    if (players[currentPlayerIndex].points >= 25) {
        alert(players[currentPlayerIndex].name + " venceu o jogo!");
        resetGame();
        return;
    }

    updateBoard();
    updateScores();
}

// Qual casas vão ter perguntas
function checkForQuestion(position) {
    if (position % 3 === 0 && !isAnsweringQuestion) { // Se o jogador cair numa casa de pergunta
        showQuestion();
    } else if (position % 3 !== 0) { // Se não for uma casa de pergunta, passa para o próximo jogador
        nextPlayer();
    }
}

// Mostrar as perguntas
function showQuestion() {
    isAnsweringQuestion = true; // Bloqueia ações até a pergunta ser respondida

    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");
    questionContainer.innerHTML = `
        <div class="question">${randomQuestion.question}</div>
        <button onclick="answerQuestion(true)">Verdadeiro</button>
        <button onclick="answerQuestion(false)">Falso</button>
    `;
    document.body.appendChild(questionContainer);
}

// Se o jogador respondeu certo ou não
function answerQuestion(answer) {
    const questionContainer = document.querySelector(".question-container");
    const correctAnswer = questions.find(q => q.question === questionContainer.querySelector(".question").innerText).answer;
    
    if (answer === correctAnswer) {
        alert("Resposta correta!");
    } else {
        alert("Resposta errada! Volte 3 casas e perca 3 pontos");

        players[currentPlayerIndex].position = Math.max(0, players[currentPlayerIndex].position - 3);
        
        players[currentPlayerIndex].points = Math.max(0, players[currentPlayerIndex].points - 3);
        updateBoard();  
    }

    questionContainer.remove();
    isAnsweringQuestion = false; 
    nextPlayer(); a
}

// Ir para o próximo jogador
function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length; // Avança normalmente
    document.getElementById("playerTurn").innerText = "Agora é a vez de " + players[currentPlayerIndex].name;
}

//Atualizar o tabuleiro
function updateBoard() {
    document.querySelectorAll(".cell").forEach(cell => cell.style.backgroundColor = "");
    players.forEach((player, index) => {
        const cell = document.querySelector(`.cell:nth-child(${player.position })`); // Corrigido para levar em conta o índice correto da célula
        if (cell) cell.style.backgroundColor = ["red", "blue", "green", "yellow"][index];
    });
}
//Atualizar o placar
function updateScores() {
    document.getElementById("scores").innerHTML = players.map(player => `
        <div>${player.name}: ${player.points} pontos</div>
    `).join("");
}
//Resetar o jogo 
function resetGame() {
    players.forEach(player => {
        player.position = 0;
        player.points = 0;
        player.canMoveNextTurn = true; 
    });
    currentPlayerIndex = 0;
    updateBoard();
    updateScores();
    gameStarted = false; 
    document.querySelector('button[onclick="startGame()"]').textContent = "Iniciar Jogo";  
}
//Iniciar o jogo
function startGame() {
    if (gameStarted) {
        resetGame(); 
    } else {
        const board = document.getElementById("board");
        board.innerHTML = "";
        let numbers = [];

        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                numbers.push(row + col * rows + 1);
            }
        }

        numbers.forEach(num => {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.textContent = num;
            board.appendChild(cell);
        });

        document.getElementById("diceResult").innerText = "";
        gameStarted = true; 
        document.querySelector('button[onclick="startGame()"]').textContent = "Reiniciar Jogo";  
    }
}
