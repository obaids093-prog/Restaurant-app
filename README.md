# AURA: Artisan Kitchen & Modern Botanica (Expo / React Native)

### Student Submission Details
* **Name:** Syed Obaid Ali
* **Roll No:** 9321
* **Subject:** Mobile Application Development (MAD)
* **Assignment:** Assignment 1 (A1 - Fall 2026)
* **Teacher:** Dr. Sadaf Tanvir

---

A luxury, client-ready mobile application engineered with React Native and Expo SDK. The app features state-of-the-art 3D physics animations, lustrous emerald teal & champagne gold luxury palettes with midnight obsidian slate, complete role-based workflows for Dining Guests and Executive Kitchen Managers, pure immutable state reducers, table reservation algorithms, and live kitchen order progression timelines.

---

## 1. Quick Installation & Setup

### Prerequisites
* **Node.js**: `v20.x` or `v24.x` recommended (Tested on Node `v24.14.0`)
* **npm**: `v10.x` or higher
* **Expo Go App** (available on iOS App Store & Google Play Store) or an Emulator

### Steps to Run
```bash
# 1. Clone the repository or navigate to project folder
cd "d:/BSCS SYL,ASSIG&LECTURES/Semester 5/mad assignment"

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```
* **Press `w`**: Opens directly in your desktop browser.
* **Scan the QR Code**: Scan via camera (iOS) or the **Expo Go** app (Android).
* **Press `a`**: Launches on Android Emulator (if Android Studio configured).
* **Press `i`**: Launches on iOS Simulator (macOS only).

---

## 2. Mock Login Credentials

| Role | Email Address | Password | Permissions & Workflow |
|---|---|---|---|
| **Customer (Diner)** | `customer@aurabistro.com`<br/>*(or `customer@restaurant.com`)* | `Password123` | Menu browsing, Cart customization, Promo codes, Dine-in / Takeaway checkout, Live Order Tracking, Table reservations. |
| **Manager (Operations GM)** | `manager@aurabistro.com`<br/>*(or `manager@restaurant.com`)* | `Admin1234` | Kitchen orders queue progression (`Preparing` ➔ `Ready` ➔ `Served`), Table booking approvals, Live menu inventory & price edits. |
| **Guest / Test** | `user@test.com` | `Password1` | Customer dining account. |

*(Quick 1-tap pre-fill chips are also available on the Login screen for instant review).*

---

## 3. Hook Usage Matrix by Screen

| Screen | React Core Hooks | Custom Project Hooks | Purpose & Responsibility |
|---|---|---|---|
| **LoginScreen** | `useState`, `useEffect`, `useRef` | `useAuth`, `useTheme` | 3D card flip animation, credentials validation, immediate error clearing on typing, secure session storage. |
| **MenuScreen** | `useState`, `useEffect`, `useRef`, `useMemo`, `useCallback` | `useTheme`, `useAuth`, `useCart`, `useMenu` | 1.5s simulated async fetch, category chips, 400ms debounced search, `React.memo` item cards, price sorting, back-to-top scroll, instant manager sync. |
| **CartScreen** | `useState`, `useMemo` | `useCart`, `useTheme` | Pure reducer dispatching, quantity steppers, per-item instructions, promo code validation, tax/service charge memoization. |
| **OrderSummaryScreen** | `useMemo` | `useCart`, `useOrders`, `useAuth`, `useTheme` | Order financial verification, customer notes review, order dispatch into shared kitchen pipeline. |
| **OrderTrackingScreen** | `useState`, `useEffect`, `useRef` | `useOrders`, `useTheme` | Realtime elapsed timer counter, 10s-20s-30s automated kitchen status stepper, interval cleanup on unmount. |
| **ReservationScreen** | `useState` | `useReservation`, `useAuth`, `useTheme` | Booking UI only (zero business logic), confirmation modal, hourly slot selection (12:00-22:00), cancellation alerts. |
| **ManagerDashboardScreen** | `useState` | `useAuth`, `useTheme`, `useOrders`, `useMenu`, `useReservation` | Kitchen queue status progression, table reservation confirmation/decline, live inventory pricing & availability CRUD. |
| **ProfileScreen** | `none` | `useAuth`, `useTheme` | User credentials inspection, dark/light theme switch toggle, role badge display, navigation reset logout. |

---

## 4. Architectural Analysis: Context API vs. Prop Drilling

> **Why Context Suits This App**:  
> In an interactive restaurant app, state items like `user`, `cartState`, `orders`, and `isDark` are required across deeply nested component trees: from global tab bars and header badges down to individual food cards and modals. Passing these states through props would require threading them through intermediate layout containers (`NavigationContainer ➔ Stack ➔ Tab ➔ Screen ➔ Card`), causing massive boilerplate and brittle component interfaces. Context provides a clean, centralized subscription model.
>
> **Drawback of Context**:  
> Every component consuming a Context via `useContext` will automatically re-render whenever *any* attribute in the Context's provider value changes, even if the component only depends on an unrelated property. For frequently changing states, splitting contexts (e.g. `AuthContext`, `CartContext`, `OrdersContext`, `ThemeContext`, `MenuContext`) and memoizing values with `useMemo` is essential to prevent unnecessary app-wide re-renders.

---

## 5. useReducer vs. useState for Cart Management

> **Comparison**:  
> `useReducer` is significantly superior to `useState` for our shopping cart because the cart contains multiple interrelated sub-states (`items`, `promoCode`, `discountPercent`) and complex business rules (e.g. decrementing an item at quantity 1 must remove the item entirely; applying a promo code must recompute percentage discounts across items). Managing these transitions with `useState` leads to race conditions, scattered validation logic across screens, and accidental state mutations.
>
> **When useState Would Suffice**:  
> `useState` would only suffice for trivial carts with an isolated counter (e.g. a simple quantity number) or a flat array where items are merely added or cleared without per-item notes, quantity steppers, promotional vouchers, or financial deductions.

---

## 6. Cart Reducer Test Cases Matrix

| # | Action Dispatched | Initial State | Expected Next State | Test Outcome |
|---|---|---|---|---|
| **1** | `ADD_ITEM` (New dish: Angus Tenderloin) | `{ items: [], promoCode: null, discountPercent: 0 }` | `{ items: [{ id: 'art_m1', name: 'Angus Tenderloin', quantity: 1, note: '' }], promoCode: null, discountPercent: 0 }` | **PASS** (Appends fresh item with qty 1) |
| **2** | `ADD_ITEM` (Existing dish: Angus Tenderloin) | `{ items: [{ id: 'art_m1', quantity: 1 }], promoCode: null, discountPercent: 0 }` | `{ items: [{ id: 'art_m1', quantity: 2 }], promoCode: null, discountPercent: 0 }` | **PASS** (Increments existing quantity without duplicating entry) |
| **3** | `INCREMENT` (`id: 'art_m1'`) | `{ items: [{ id: 'art_m1', quantity: 2 }] }` | `{ items: [{ id: 'art_m1', quantity: 3 }] }` | **PASS** (Increments specific item quantity) |
| **4** | `DECREMENT` (`id: 'art_m1'`, qty: 2) | `{ items: [{ id: 'art_m1', quantity: 2 }] }` | `{ items: [{ id: 'art_m1', quantity: 1 }] }` | **PASS** (Decrements item quantity) |
| **5** | `DECREMENT` (`id: 'art_m1'`, qty: 1) | `{ items: [{ id: 'art_m1', quantity: 1 }] }` | `{ items: [] }` | **PASS** (Removes item from cart when reaching 0) |
| **6** | `UPDATE_NOTE` (`id: 'art_m1'`, note: 'Medium Rare') | `{ items: [{ id: 'art_m1', note: '' }] }` | `{ items: [{ id: 'art_m1', note: 'Medium Rare' }] }` | **PASS** (Updates item instructions immutably) |
| **7** | `APPLY_PROMO` (code: 'WELCOME10') | `{ items: [...], promoCode: null, discountPercent: 0 }` | `{ items: [...], promoCode: 'WELCOME10', discountPercent: 10 }` | **PASS** (Sets promo code and percentage) |
| **8** | `APPLY_PROMO` (code: 'AURA30') | `{ items: [...], promoCode: null, discountPercent: 0 }` | `{ items: [...], promoCode: 'AURA30', discountPercent: 30 }` | **PASS** (Applies AURA VIP voucher discount) |
| **9** | `APPLY_PROMO` (code: 'INVALID_XYZ') | `{ items: [...], promoCode: null, discountPercent: 0 }` | Throws `Error('Promo code "INVALID_XYZ" is invalid or expired.')` | **PASS** (Rejects invalid vouchers with error message) |
| **10** | `CLEAR_CART` | `{ items: [{...}, {...}], promoCode: 'FEAST20', discountPercent: 20 }` | `{ items: [], promoCode: null, discountPercent: 0 }` | **PASS** (Resets cart to clean initial state) |

---

## 7. Project Architecture & File Organization

```text
src/
  ├── components/
  │   └── MenuItemCard.js           # React.memo optimized card with heart toggle
  ├── context/
  │   ├── AuthContext.js            # User session & credentials persistence
  │   ├── CartContext.js            # Cart provider with live badge calculation
  │   ├── MenuContext.js            # Synchronized menu inventory across Manager & Customer
  │   ├── OrdersContext.js          # Live kitchen queue pipeline & state transitions
  │   └── ThemeContext.js           # Light / Dark luxury palette toggle
  ├── data/
  │   ├── menu.js                   # 16 handcrafted dishes across 4 culinary sections
  │   ├── reservations.js           # Initial active table bookings
  │   ├── tables.js                 # Tables with seating capacities & locations
  │   └── users.js                  # Customer & Manager credentials
  ├── hooks/
  │   ├── useDebounce.js            # Universal input debounce hook
  │   ├── useForm.js                # Form validation & error management hook
  │   └── useReservation.js         # Table reservation business logic & slot checking
  ├── navigation/
  │   └── AppNavigator.js           # Bottom tabs + nested stack navigation
  ├── reducers/
  │   └── cartReducer.js            # Pure reducer with 8 immutable actions
  ├── screens/
  │   ├── CartScreen.js             # Quantity steppers, promo codes, dine-in/takeaway
  │   ├── LoginScreen.js            # 3D Flip animation, role selector, secure login
  │   ├── ManagerDashboardScreen.js # 3 Tabs: Orders, Reservations, Menu Management
  │   ├── MenuScreen.js             # Debounced search, category chips, sort, back-to-top
  │   ├── OrderSummaryScreen.js     # Financial review (tax, service charge, totals)
  │   ├── OrderTrackingScreen.js    # Live kitchen timeline (10s-20s-30s auto stepper)
  │   ├── ProfileScreen.js          # Account info, dark/light switch, sign out
  │   └── ReservationScreen.js      # Booking UI, hourly slots, confirmation modal
  └── theme/
      └── theme.js                  # Radiant Emerald Teal, Champagne Gold, Obsidian Slate
```

---

## 8. Conceptual Deliverable (Q4): Impact of an Empty Dependency Array on Menu Filtering

> **Question**: *What happens if the dependency array of the category filtering `useEffect` is left empty `[]`?*  
> **Explanation**:  
> Passing an empty dependency array `[]` instructs React to execute the effect callback exactly once when the component initially mounts. In our menu screen, the actual menu data is loaded asynchronously after 1.5 seconds. If the filtering effect has an empty dependency array, it executes before the items finish loading (filtering an empty array) and **never re-runs** when the user selects a different category chip or when the menu items finally arrive. Consequently, the menu remains permanently blank or stuck on initial mount data, completely ignoring category switches. For proper reactivity, `selectedCategory` and `menuItems` must be explicitly declared in the dependency array.

---

## 9. Conceptual Deliverable (Q8): When useMemo and useCallback Should NOT Be Used

> **Question**: *When should `useMemo` and `useCallback` NOT be used?*  
> **Explanation**:  
> `useMemo` and `useCallback` are optimization tools that introduce measurable memory and CPU overhead: React must allocate dependency arrays, retain cached closures in heap memory, and perform shallow equality comparisons on every render cycle.  
> 
> They should **NOT** be used for:
> 1. **Trivial computations**: Filtering or transforming small arrays (< 50 items), basic arithmetic, or simple string formatting. The cost of running dependency comparisons often exceeds the recalculation itself.
> 2. **Unstable dependencies**: Functions or values whose dependencies mutate on every single render. The cache misses on every pass, rendering caching useless.
> 3. **Un-memoized children**: Passing a `useCallback` handler to a standard child component that is not wrapped in `React.memo` provides zero optimization, as normal components re-render whenever the parent re-renders regardless of prop stability.

---

## 10. Application Demonstration Video (Q10 Deliverable)

The complete end-to-end user journey across Customer and Restaurant Manager workflows has been recorded and included directly within the repository.

* **Primary Video File**: [Watch A1 Demo Video on GitHub (A1/demo_video.mp4)](https://github.com/obaids093-prog/Restaurant-app/blob/main/A1/demo_video.mp4)
* **Alternative Mirror**: [Watch Video in `uml/` folder](https://github.com/obaids093-prog/Restaurant-app/blob/main/uml/WhatsApp%20Video%202026-09-27%20at%209.16.51%20PM.mp4)

