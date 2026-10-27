/**
 * ============================================================================
 * STACK DATA STRUCTURE IMPLEMENTATION (LIFO: Last-In, First-Out)
 * ============================================================================
 * A Stack stores elements sequentially.
 * We can only add to the top (push) and remove from the top (pop).
 */
class NoteHistoryStack {
  constructor() {
    this.items = []; // Internal array to hold stack frames
  }

  // Push an item onto the top of the stack
  push(text) {
    this.items.push({
      text: text,
      timestamp: new Date().toLocaleTimeString()
    });
  }

  // Remove and return the top item from the stack
  pop() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop();
  }

  // Look at the top item without removing it
  peek() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  // Check if stack has no items
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the count of items in the stack
  size() {
    return this.items.length;
  }

  // Get all items (from bottom to top)
  getItems() {
    return this.items;
  }

  // Clear the entire stack
  clear() {
    this.items = [];
  }
}

// ============================================================================
// APPLICATION LOGIC & DOM INTERACTION
// ============================================================================

// Instantiate the Stack
const undoStack = new NoteHistoryStack();

// DOM Elements
const noteInput = document.getElementById("noteInput");
const charCount = document.getElementById("charCount");
const typingIndicator = document.getElementById("typingIndicator");
const saveBtn = document.getElementById("saveBtn");
const undoBtn = document.getElementById("undoBtn");
const clearBtn = document.getElementById("clearBtn");
const stackContainer = document.getElementById("stackContainer");
const emptyMessage = document.getElementById("emptyMessage");
const stackCountBadge = document.getElementById("stackCountBadge");
const operationsLog = document.getElementById("operationsLog");
const demoGroceryBtn = document.getElementById("demoGroceryBtn");
const demoMeetingBtn = document.getElementById("demoMeetingBtn");

// Variable to track typing pause (auto-save)
let typingTimer = null;
const TYPING_DELAY = 1200; // 1.2 seconds of inactivity triggers a push

/**
 * PUSH Operation: Saves the current note state to the top of the stack
 */
function pushCurrentNote(isAutoSave = false) {
  const currentText = noteInput.value.trim();

  // If empty and stack is empty, don't push
  if (!currentText && undoStack.isEmpty()) {
    return;
  }

  // Check if the current text is identical to the top of the stack (avoid duplicate pushes)
  const topItem = undoStack.peek();
  if (topItem && topItem.text === currentText) {
    typingIndicator.textContent = "Saved";
    return;
  }

  // 1. Push onto the Stack
  undoStack.push(currentText);

  // 2. Log operation
  const preview = currentText.length > 25 ? currentText.substring(0, 25) + "..." : currentText || "[Empty Note]";
  logOperation(`PUSH: "${preview}" onto Stack`, "push");

  // 3. Update the UI
  typingIndicator.textContent = isAutoSave ? "Auto-saved (Pushed)" : "Saved (Pushed)";
  updateUI();
}

/**
 * POP Operation: Removes the latest note state (LIFO) and reverts the note
 */
function popFromStack() {
  if (undoStack.isEmpty()) {
    alert("The stack is empty! There are no actions left to undo.");
    return;
  }

  // 1. Pop the top element (the current latest state)
  const popped = undoStack.pop();

  // 2. Look at what is now the new top of the stack (the previous state)
  const previousState = undoStack.peek();
  const restoredText = previousState ? previousState.text : "";

  // 3. Restore the note editor's text
  noteInput.value = restoredText;
  updateCharCount();

  // 4. Log operation
  const poppedPreview = popped.text.length > 25 ? popped.text.substring(0, 25) + "..." : popped.text || "[Empty Note]";
  logOperation(`POP: Removed "${poppedPreview}" (Undone)`, "pop");

  typingIndicator.textContent = "Reverted (Popped)";
  updateUI();
}

/**
 * Updates the Visual Stack rendered on the right side of the screen
 */
function renderStackVisualizer() {
  // Update badge count
  stackCountBadge.textContent = `Size: ${undoStack.size()}`;
  undoBtn.disabled = undoStack.isEmpty();

  // If stack is empty, show empty message
  if (undoStack.isEmpty()) {
    stackContainer.innerHTML = `
      <div class="stack-empty" id="emptyMessage">
        The stack is empty.<br>Start typing on the left to push history states!
      </div>
    `;
    return;
  }

  // Render items: We display from TOP (most recent) to BOTTOM (oldest)
  const items = undoStack.getItems();
  stackContainer.innerHTML = "";

  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const isTop = (i === items.length - 1);

    const itemDiv = document.createElement("div");
    itemDiv.className = `stack-item ${isTop ? "is-top" : ""}`;

    const textContent = item.text === "" ? "<em>[Empty Note]</em>" : escapeHtml(item.text);

    itemDiv.innerHTML = `
      <div class="stack-item-content">
        ${textContent}
      </div>
      <div class="stack-item-meta">
        ${isTop ? '<span class="top-pill">TOP (LIFO)</span>' : `#${i + 1}`}
        <span>${item.timestamp}</span>
      </div>
    `;

    stackContainer.appendChild(itemDiv);
  }
}

/**
 * Logs an operation into the Live Stack Operations Log console
 */
function logOperation(message, type) {
  const li = document.createElement("li");
  const time = new Date().toLocaleTimeString();
  li.className = `log-entry ${type === "push" ? "log-push" : type === "pop" ? "log-pop" : "log-init"}`;
  li.textContent = `[${time}] ${message}`;

  operationsLog.prepend(li); // Show newest log at the top

  // Keep log size manageable
  if (operationsLog.children.length > 15) {
    operationsLog.removeChild(operationsLog.lastChild);
  }
}

/**
 * Update character count
 */
function updateCharCount() {
  const count = noteInput.value.length;
  charCount.textContent = `${count} character${count === 1 ? "" : "s"}`;
}

/**
 * Sync the whole UI
 */
function updateUI() {
  updateCharCount();
  renderStackVisualizer();
}

/**
 * Helper to prevent HTML injection in previews
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

// Typing in the note textarea
noteInput.addEventListener("input", () => {
  typingIndicator.textContent = "Typing...";
  updateCharCount();

  // Reset timer on every keystroke
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    pushCurrentNote(true);
  }, TYPING_DELAY);
});

// Save button click
saveBtn.addEventListener("click", () => {
  clearTimeout(typingTimer);
  pushCurrentNote(false);
});

// Undo button click
undoBtn.addEventListener("click", () => {
  clearTimeout(typingTimer);
  popFromStack();
});

// Clear button click
clearBtn.addEventListener("click", () => {
  noteInput.value = "";
  typingIndicator.textContent = "Cleared";
  updateCharCount();
});

// Keyboard Shortcut: Ctrl + Z to Undo
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    popFromStack();
  }
});

// ============================================================================
// DEMO PRESETS (Easy demonstration for assignments and presentations)
// ============================================================================

demoGroceryBtn.addEventListener("click", () => {
  runSequentialDemo([
    "Grocery List:\n- Milk",
    "Grocery List:\n- Milk\n- Eggs",
    "Grocery List:\n- Milk\n- Eggs\n- Whole Wheat Bread",
    "Grocery List:\n- Milk\n- Eggs\n- Whole Wheat Bread\n- Apples"
  ]);
});

demoMeetingBtn.addEventListener("click", () => {
  runSequentialDemo([
    "Team Meeting:\n1. Sprint Review",
    "Team Meeting:\n1. Sprint Review\n2. Bug Triage",
    "Team Meeting:\n1. Sprint Review\n2. Bug Triage\n3. Assign Stack Assignment Tasks"
  ]);
});

/**
 * Helper to simulate typing step-by-step
 */
function runSequentialDemo(steps) {
  undoStack.clear();
  operationsLog.innerHTML = "";
  logOperation("Starting demo simulation...", "init");

  steps.forEach((stepText, index) => {
    setTimeout(() => {
      noteInput.value = stepText;
      pushCurrentNote(false);
    }, index * 700);
  });
}

// Initial render
updateUI();
