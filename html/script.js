// DOM elements
const gameUI = document.getElementById("gameUI");
const timerEl = document.getElementById("timer");
const attemptsEl = document.getElementById("attempts");
const boardEl = document.getElementById("board");
const input = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const body = document.body;
const bootSequence = document.getElementById("bootSequence");
const gameContent = document.getElementById("gameContent");
const resultScreen = document.getElementById("resultScreen");
const resultLoader = document.querySelector(".result-loader");
const resultFinal = document.querySelector(".result-final");
const resultCircle = document.querySelector(".result-circle");
const resultIcon = document.querySelector(".result-icon");
const resultText = document.querySelector(".result-text");

function hideInterface() {
    gameUI.classList.add("hidden");
    body.classList.add("hidden");
    gameUI.style.display = "none";
    body.style.display = "none";
    body.style.visibility = "hidden";
    body.style.opacity = "0";
}

function showInterface() {
    body.classList.remove("hidden");
    gameUI.classList.remove("hidden");
    body.style.display = "block";
    body.style.visibility = "visible";
    body.style.opacity = "1";
    gameUI.style.display = "grid";
}

// Show result with loader animation
function showResultWithLoader(isWin) {
    console.log("Showing result with loader:", isWin);
    
    // Hide game content and show result screen
    gameContent.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    resultLoader.classList.remove("hidden");
    resultFinal.classList.add("hidden");
    
    // After 2 seconds, show final result
    setTimeout(() => {
        resultLoader.classList.add("hidden");
        resultFinal.classList.remove("hidden");
        
        if (isWin) {
            resultCircle.className = "result-circle success";
            resultIcon.className = "result-icon success";
            resultIcon.textContent = "✓";
            resultText.className = "result-text success";
            resultText.textContent = "CODE SOLVED";
        } else {
            resultCircle.className = "result-circle failure";
            resultIcon.className = "result-icon failure";
            resultIcon.textContent = "✗";
            resultText.className = "result-text failure";
            resultText.textContent = "CHALLENGE FAILED";
        }
        
        // Show result with animation
        setTimeout(() => {
            resultFinal.classList.add("show");
        }, 100);
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            gameUI.classList.add("closing");
            setTimeout(() => {
                hideInterface();
                
                // Reset UI for next game
                resetUI();
            }, 500);
        }, 3000);
    }, 2000);
}

// Reset UI for next game
function resetUI() {
    gameContent.classList.remove("hidden");
    resultScreen.classList.add("hidden");
    resultLoader.classList.add("hidden");
    resultFinal.classList.remove("show");
    boardEl.innerHTML = '';
    input.value = '';
    input.disabled = false;
    submitBtn.disabled = false;
}

// Clear previous attempts
function clearPreviousAttempts() {
    boardEl.innerHTML = ''; // Clear the board
}

// Submit button event listener
submitBtn.addEventListener("click", () => {
    const val = input.value;
    if (val.length !== 4 || !/^\d+$/.test(val)) {
        // Add glitch effect for invalid input
        input.classList.add('invalid');
        setTimeout(() => input.classList.remove('invalid'), 1000);
        return;
    }
    
    const nums = val.split("").map(Number);
    
    fetch(`https://${GetParentResourceName()}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guess: nums })
    });
    
    input.value = "";
});

// Input validation
input.addEventListener("input", function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    if (this.value.length > 4) {
        this.value = this.value.slice(0, 4);
    }
});

// Enter key support
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        submitBtn.click();
    }
});

// Listen for messages from FiveM
window.addEventListener("message", (event) => {
    const data = event.data;
    console.log("Received message:", data);

    if (data.type === "showUI" && data.state !== true) {
        hideInterface();
        return;
    }

    if (data.type === "showUI" && data.state === true) {

        console.log("Showing UI");
        // Show UI and body
        showInterface();
        gameUI.classList.remove("closing");
        
        // Clear previous attempts
        clearPreviousAttempts();
        
        // Enable input and button
        input.disabled = false;
        submitBtn.disabled = false;
        
        // Open directly on the mini game.
        bootSequence.classList.add("hidden");
        gameContent.classList.remove("hidden");
        resultScreen.classList.add("hidden");
        input.focus();
        
    } else if (data.type === "updateStatus") {
        timerEl.innerHTML = `${data.timer}s`;
        attemptsEl.innerHTML = `${data.attempts}/${data.maxAttempts}`;
        
        // Change color when time is running out
        if (data.timer <= 10) {
            timerEl.style.color = "#f16f7f";
            timerEl.style.textShadow = "none";
        } else {
            timerEl.style.color = "#f6f7fb";
            timerEl.style.textShadow = "none";
        }
    } else if (data.type === "newAttempt") {
        const row = document.createElement("div");
        data.guess.forEach((num, i) => {
            const span = document.createElement("span");
            span.className = data.result[i];
            span.textContent = num;
            row.appendChild(span);
        });
        boardEl.appendChild(row);
        boardEl.scrollTop = boardEl.scrollHeight;
    } else if (data.type === "gameOver") {
        // Show result with loader animation
        showResultWithLoader(data.state === "win");
    } else if (data.type === "hideUI") {
        // Immediate hide without animation
        hideInterface();
    }
});

// Handle escape key to close UI
document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") {
        fetch(`https://${GetParentResourceName()}/escape`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
    }
});

// Handle resource stop to clear UI
window.addEventListener('beforeunload', function() {
    // Clear UI when resource is stopped
    hideInterface();
});

// Initialize UI state on load
document.addEventListener('DOMContentLoaded', function() {
    // Make sure everything is hidden initially
    hideInterface();
    bootSequence.classList.add("hidden");
    gameContent.classList.add("hidden");
    resultScreen.classList.add("hidden");
    resultLoader.classList.add("hidden");
    resultFinal.classList.add("hidden");
    
    console.log("UI initialized and hidden (v9)");
});
