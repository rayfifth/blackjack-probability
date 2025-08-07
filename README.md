# 🃏 Blackjack Web Game

A browser-based Blackjack game built with **HTML**, **CSS**, and **JavaScript** — featuring a **recursive probability engine** to calculate win/loss odds in real-time.

## 🎯 Features

- **Classic Blackjack Gameplay** — Player vs. Dealer.
- **Probability Calculator** — Uses recursion to estimate the likelihood of:
  - Winning
  - Losing
  - Drawing
- **Responsive UI** — Works on desktop and mobile.
- **Pure Frontend** — No frameworks or libraries required.
- **Customizable Rules** — Easily adjust deck count, dealer rules, and payout structure.

---

## 🛠️ How It Works

1. **Game Mechanics**
   - Standard Blackjack rules apply:
     - Player starts with two cards.
     - Dealer hits until reaching 17+.
     - Player can `Hit` or `Stand`.
     - Busting (>21) results in loss.
   
2. **Probability Engine**
   - The script **recursively simulates all possible future game states** given:
     - Current deck composition
     - Player and dealer hands
   - Calculates the probability of win/lose/draw by exploring every possible draw sequence until the hand ends.
   - Uses **memoization** to cache results for speed.

---

