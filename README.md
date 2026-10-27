# 📝 Sticky Notes with LIFO Undo Stack Visualizer

A clean, beginner-friendly web application designed for a Data Structures assignment demonstrating the **Stack (Last-In, First-Out - LIFO)** data structure in a real-world scenario.

---

## 📌 Project Overview

This project simulates how modern text editors (such as Google Docs, Apple Notes, and Microsoft Word) implement the **Undo mechanism** using a Stack.

1. **The Real-World Problem:** When you type or edit a note, you might make a mistake and want to revert back.
2. **The LIFO Solution:** Every time you add a thought or edit, that state is **pushed** onto the top of an internal stack. When you hit **Undo** (or `Ctrl + Z`), the software **pops** the most recent state off the top and restores the previous one.
3. **Why a Stack is Necessary:** State reversals must happen in strict reverse-chronological order. You cannot undo an edit from 10 minutes ago before undoing the edit from 5 seconds ago!

---

## 🚀 How to Run the Website

No complex server or installation is needed!

1. Open your File Explorer and navigate to:
   `C:\Users\bonne\.gemini\antigravity\scratch\sticky-note-stack`
2. **Double-click `index.html`** to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

---

## 📂 File Structure

* **`index.html`**: The semantic HTML markup containing:
  * The Sticky Note pad UI (left column).
  * The Visual Stack memory container (right column).
  * Educational explanation cards at the bottom.
* **`style.css`**: Modern responsive styles including sticky post-it effects, slide-in animations when pushing items, and visual indicators for the `[TOP (LIFO)]` element.
* **`app.js`**: Clean, well-commented JavaScript implementing:
  * `class NoteHistoryStack` with `push()`, `pop()`, `peek()`, and `isEmpty()`.
  * Real-time rendering of the stack cylinder.
  * Live Operations Log (`PUSH` / `POP`).
  * `Ctrl + Z` keyboard shortcut support.
  * Demo preset buttons for easy class presentation.

---

## 🎯 How to Demo This to Your Teacher / Class

1. **Click "Demo Grocery List"**: Watch the stack automatically push 4 versions step-by-step:
   * Item 1: `Milk`
   * Item 2: `Milk, Eggs`
   * Item 3: `Milk, Eggs, Whole Wheat Bread`
   * Item 4: `Milk, Eggs, Whole Wheat Bread, Apples` (Marked with the blue **`TOP (LIFO)`** badge).
2. **Click "Undo (Pop from Stack)"** (or press `Ctrl + Z`):
   * Point out to your teacher how the top item (`Apples`) pops off first, leaving Item 3.
   * Click **Undo** again to pop Item 3.
3. **Show the Live Operations Log**:
   * Point out the green `PUSH` and red `POP` operation logs with exact timestamps.
