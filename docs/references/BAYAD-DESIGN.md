# Bayad — Design

Bayad is a native macOS app for recording the payments from **one agency** and sending a month-end report. This file describes how the app looks and behaves today, and the rules that keep it that way. Product scope is in [docs/PRODUCT-SCOPE.md](docs/PRODUCT-SCOPE.md); the code that implements everything here lives in `Bayad/Design/`.

**Visual language: friendly ledger.** A warm paper canvas, white rounded cards, one brand green and a small family of purposeful colours. Personality comes from shape (rounded corners, pills, icon tiles) and colour placement, never from heavy decoration. Restrained Apple Liquid Glass is used for navigation and controls only; everything that holds money stays on solid, readable surfaces.

---

## 1. Principles

1. **The table is the hero.** Payments are a table first; everything else is quiet.
2. **Simple by default.** One amount, one date, two statuses (Paid / Unpaid). No field appears that the user doesn't need.
3. **Money is always readable.** Amounts sit on opaque white, in tabular digits, with their currency. Currencies are never added together.
4. **Colour never carries meaning alone.** Every status has its word next to its colour.
5. **Glass for chrome, paper for content.** Frosted material on the sidebar and controls; never on tables, totals, forms or reports.
6. **Calm.** No continuous animation, no polling, no decorative motion.

---

## 2. Foundations

### 2.1 Colour

Light mode only (the app is pinned to light; dark values exist in the tokens but aren't polished).

**Surfaces and text**

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#F6F4EF` | Warm paper page background |
| `surface` | `#FFFFFF` | Cards, tables, sheets, inputs |
| `surfaceSubtle` | `#FAF8F4` | Inspector column, quiet backgrounds |
| `fill` | `#F1EEE7` | Table headers, pressed states |
| `hover` | `#F3F1EB` | Pointer hover |
| `border` | `#E7E3DB` | Hairlines, card outlines |
| `borderStrong` | `#D9D4C9` | Inputs, dividers that must read |
| `textPrimary` | `#1D1B17` | Body text, figures |
| `textSecondary` | `#5F5A50` | Labels, column headers |
| `textTertiary` | `#736D63` | Captions, placeholders, zero values |

**Tones.** Each tone has three parts: `ink` (text), `tint` (soft fill) and `solid` (dots, icons, buttons). Every ink meets 4.5:1 on its own tint and on white (enforced by `AccessibilityContrastTests`).

| Tone | Solid | Tint | Ink | Role |
| --- | --- | --- | --- | --- |
| green (brand) | `#1F8A5B` | `#E3F5EB` | `#17744A` | Brand, primary buttons, **Paid**, Payments |
| sky | `#2F7DE1` | `#E3F0FE` | `#1F5FB8` | **Total**, agency notices |
| sun (amber) | `#F2A900` | `#FFF3CC` | `#8A5A00` | **Unpaid**, warnings, Import |
| coral (red) | `#F0644A` | `#FFE6E0` | `#B02E24` | Errors, destructive actions |
| grape | `#7B5CE6` | `#EEE9FD` | `#5A3CC4` | Reports |
| teal | `#13A5A0` | `#DDF5F3` | `#0B6F6B` | Settings |
| pink | `#E9559A` | `#FDE6F1` | `#B02369` | Decoration only |
| neutral | `#9A948A` | `#EEEBE4` | `#6B665C` | Inactive, archived |

**Special brand values**
- `brandFill` `#1C7F53`: fill behind white button text (a touch deeper than brand green so white text reaches 4.5:1).
- `selection` `#DDF0E6`: selected sidebar item.
- Table row selection uses the Mac accent, which Bayad sets to green for itself only (`AppleAccentColor = 3`), so selection always matches the brand.

### 2.2 Typography

System font (SF) only. SF Rounded for titles and big numbers; tabular (monospaced) digits for every amount and date.

| Token | Spec | Use |
| --- | --- | --- |
| `pageTitle` | 24 pt bold, rounded | "Payments", "Reports", "Settings" |
| `sectionTitle` | 15 pt semibold, rounded | Card and sheet headings |
| `summaryNumber` | 20 pt semibold, rounded | Summary card figures |
| `metric` / `metricSmall` | 17 / 14 pt semibold, rounded | Smaller figures |
| `body` | 13 pt regular | Text, inspector fields |
| `bodyStrong` | 13 pt semibold | Emphasised text |
| `button` | 13 pt semibold | Buttons |
| `columnHeader` | 12 pt medium | Labels, column headers |
| `caption` | 11 pt medium | Notes, currency codes, chips |
| `eyebrow` | 11 pt semibold, uppercase, tracked | Inspector section labels |
| Table cells | 12 pt | Payment and report rows |

### 2.3 Spacing

4 pt base: `xxs 2 · xs 4 · s 8 · m 12 · l 16 · xl 24 · xxl 32`.
- Page padding: **24**. Panel padding: **16** (0 for tables).
- Sheet padding: **24**.
- Table cells: ~30 pt rows (one density only), 12 pt horizontal padding.

### 2.4 Shape and depth

| Token | Value | Use |
| --- | --- | --- |
| `control` | 8 pt | Buttons, fields, chips' rectangles |
| `tile` | 9 pt (×0.3 of size for icon tiles) | Icon tiles |
| `panel` | 14 pt | Cards, tables |
| `sheet` | 20 pt | Sheets, the floating sidebar |
| Pills | capsule | Filter chips, status badges |

Shadows (one per surface, never animated): `card` 5% black, 8 pt blur, 2 pt down · `raised` 10%, 14 pt, 5 pt down · `sheet` 18%, 30 pt, 12 pt down.

Borders: 1 pt hairlines; focus rings 2 pt brand green.

### 2.5 Icons

SF Symbols only, filled, monochrome white on a coloured **icon tile** (rounded square with a gradient of the tone's solid colour). Sizes: 24 (sidebar), 22 (section headers), 36 (sheet headers), 40 (page headers).

| Screen | Symbol | Tone |
| --- | --- | --- |
| Payments | `creditcard.fill` | green |
| Reports | `chart.bar.doc.horizontal.fill` | grape |
| Settings | `gearshape.fill` | teal |

---

## 3. Materials (glass)

Native Liquid Glass (`glassEffect`), available on the deployment target (macOS 27), applied through **one** helper: `bayadGlass(in:tint:interactive:)` in `Bayad/Design/Glass.swift`. Never call `glassEffect` directly.

| Glass | Always opaque |
| --- | --- |
| Sidebar: a floating panel, inset 8 pt, 20 pt radius | Payments and report tables |
| Secondary buttons (interactive glass) | Summary cards and report totals |
| Header menus (Columns), icon buttons | Primary (green) and destructive buttons |
| Search box and filter chips (an active chip is brand-tinted glass with a thin green ring) | Text inputs, the inspector, sheet bodies |
| | The selected sidebar row (a solid soft-green pill: glass is never nested inside glass) |

**Backdrop.** `BayadBackdrop` draws the canvas with two very faint washes (green top-left at 16%, sky top-right at 12%) behind the whole window, so glass has something gentle to frost. Nothing that shows a figure sits directly on the wash.

**Accessibility fallback.** With **Reduce Transparency** or **Increase Contrast** on, every glass surface becomes opaque white with a firm hairline and the backdrop becomes the plain canvas. Debug builds can preview this with `-BayadOpaqueChrome 1`.

---

## 4. Components

All in `Bayad/Design/`. Screens compose these and never restyle them.

| Component | What it is |
| --- | --- |
| `Panel` | White card: 14 pt radius, hairline border, `card` shadow. Optional tone tint. |
| `PageHeader` | Icon tile + page title + one-line subtitle, actions trailing. Actions drop under the title when narrow. |
| `SectionHeader` | Small icon tile + section title + optional trailing control. |
| `SheetHeader` | 36 pt icon tile, bold title, caption subtitle. |
| `StatCard` | Tinted summary card: icon + label (+ caption), then figures per currency. |
| `StatusBadge` | Capsule pill: coloured dot + word. **Paid** (green) or **Unpaid** (amber). |
| `MoneyText` | Currency-formatted, tabular, right-aligned. |
| `EmptyState` | Illustrated icon tile over a soft blob + one headline + one line of why + optional emoji. |
| `DetailRow` | Label / value row for Settings and sheets. |
| `MessageBanner` | Tinted strip with icon, message and a dismiss button. |
| `AgencyNotice` | Tinted strip with icon, message and one action (e.g. Choose…, Review…). |
| `FilterChipLabel` | Glass capsule label for a filter menu; brand-tinted when active. The period chip has no chevron. |
| `MenuButtonLabel` | Glass outlined label for header menus (Columns). |
| `DecimalField` | Strict money input: refuses anything it would have to guess, turns coral when rejected, reverts on Escape. |
| `CommitTextField` / `DebouncedTextField` | Text that commits on Return, on leaving the field, or after a short pause; never per keystroke. |
| Buttons | `.bayadPrimary` (solid brand green, white text) · `.bayadSecondary` (glass) · `.bayadQuiet` (bare) · `.bayadDestructive` (coral tint). 28 pt min height. Press scales to 98% (skipped under Reduce Motion). |

---

## 5. Layout

- **Window:** default 1180 × 760; minimum 800 × 540. Every screen reflows below the default instead of demanding more room.
- **Structure:** `NavigationSplitView`. Sidebar 200–260 pt (ideal 215) holds the Bayad mark, the three destinations and a "Private · stays on this Mac" footer.
- **Navigation:** Payments · Reports · Settings. ⌘1 Payments, ⌘2 Reports, ⌘, Settings.
- **Title bar:** the window title is hidden and the canvas runs up behind the title bar.
- **Reflow:** header actions and filter controls wrap onto a second row (`ReflowLayout`); summary cards go from three across to stacked (`EqualColumnsLayout`, 208 pt minimum card); the inspector becomes a popover when the window is too narrow (`SidePanelContainer`).
- **Sheets:** sized to fit the window (at most the window height − 96 pt); long content scrolls inside the sheet so its buttons stay visible.

---

## 6. Screens

### Payments
1. **Page header:** "Payments", subtitle "*Agency* · *n* payments", actions: Columns menu, Inspector toggle, **New Payment** (primary).
2. **Agency notice** (only when needed): choose the agency, or "*n* payments recorded under other companies or people".
3. **Summary cards:** **Total** (sky), **Paid** (green), **Unpaid** (amber, with count). One line per currency.
4. **Filter bar:** Search · Period (All time / month / custom range) · Status (Paid, Unpaid) · Currency · Clear · count.
5. **Table:** **Date · Description · Amount · Status**. Optional: Currency; "Belongs to" appears only while other companies' payments are shown.
   - **Date:** one day ("Oct 5, 2026") or a duration ("Oct 1 – 31, 2026"). Click to edit in a popover with a *One day / Duration* switch.
   - **Amount:** edited in place; the currency code sits beside it.
   - **Status:** a badge; click to choose Paid or Unpaid. When the row is part of a ⌘/⇧-click selection, the choice applies to every selected row.
6. **Inspector** (right column, 320 pt): Work (description, date), Payment (amount + currency, Paid/Unpaid switch), Notes, Duplicate / Delete, created/updated.

### Reports
- Header: "Reports", subtitle "*Agency* · *period* · *n* payments", **Export** menu (PDF, CSV, Print, include notes).
- Filter bar without search; period chip with ‹ › month steppers.
- **Summary by currency:** Currency · Payments · Total · Paid · Unpaid.
- **Payments:** Date · Description · Amount · Status.
- PDF: landscape Letter/A4, agency name and period at the top, the same summary and table, page numbers "Page x of y".
- CSV: `Date, End Date, Agency, Description, Currency, Amount, Status` (+ Notes when chosen), UTF-8 with BOM, ISO dates, plain numbers.

### Settings
Stacked cards, max readable width 1000 pt: **Agency** (name) · **General** (default currency) · **Backup & transfer** · **Import from a spreadsheet** · **Data location** (current folder, Change Folder…, Reveal in Finder) · **Data** (storage, privacy, version).

### Sheets
New Payment (Description, Date with One day / Duration, Amount + currency) · Restore backup · Import from a spreadsheet · Move library · Choose agency. All: icon-tile header, opaque white body, Cancel (secondary) + one primary action bottom-right.

---

## 7. Data display rules

- **Money:** `Decimal` only; tabular digits; at most the currency's decimal places; grouped for reading, ungrouped while editing. Zero amounts step back to tertiary grey.
- **Currencies:** every total is per currency; never a combined figure. Payment pickers show a short list of common currencies plus the one in use; Settings has the full list.
- **Status:** Paid = the amount was received in full; Unpaid = still owed. Older stored states (partial, cancelled) read as Unpaid; cancelled ones count in no total.
- **Dates:** one day, or a duration. A duration belongs to the month it **ends** in, for filters and reports.
- **Hidden but kept:** fees, payment method, reference numbers and received amounts are no longer shown but are never deleted from the library or backups.

---

## 8. Accessibility

- Contrast: every ink on its tint and on white ≥ 4.5:1 (tested).
- Reduce Transparency / Increase Contrast: opaque chrome, plain canvas (see §3).
- Reduce Motion: no press scaling. There is no other animation.
- Keyboard: arrows move through the table; Return edits the selected row's description; ⌘N new payment; ⌘D duplicate; ⌘⌫ delete (with confirmation); ⌥⌘F search; ⌥⌘I inspector; ⌘1/⌘2/⌘, navigate.
- Every control has a label; statuses are announced as "Status: Paid / Unpaid".
- Hit targets: 28 pt minimum for controls.

---

## 9. Do and don't

**Do**
- Use tokens and components; never raw colours, radii or fonts in screens.
- Keep tables, totals, forms and report previews on opaque white.
- Pair every status colour with its word.
- Use `bayadGlass(in:)` for any new navigation or control surface.

**Don't**
- Put glass inside glass, in table cells, or under figures.
- Add gradients (beyond the two faint backdrop washes), reflections, heavy shadows or continuous animation.
- Add back removed fields or screens: company/person pickers or filters, expected/received/fees/net columns, reference, method, row-density options.
- Combine currencies into one figure.

---

## 10. Files

| File | Contains |
| --- | --- |
| `Bayad/Design/Tokens.swift` | Colours, tones, spacing, radii, shadows, borders, metrics, icon sizes, fonts, status tones |
| `Bayad/Design/Glass.swift` | `bayadGlass`, `BayadBackdrop`, opaque fallback |
| `Bayad/Design/Components.swift` | `Panel`, `PageHeader`, `StatusBadge`, `MoneyText`, `EmptyState`, `DetailRow`, `MessageBanner` |
| `Bayad/Design/Chrome.swift` | Icon tiles, section/sheet headers, `StatCard`, button styles, field and search chrome, menu labels |
| `Bayad/Design/FieldComponents.swift` | `DecimalField`, `CommitTextField`, debounced fields, filter chips, table density |
| `Bayad/Design/Reflow.swift` | `ReflowLayout`, `EqualColumnsLayout`, `TablePage`, `SidePanelContainer`, responsive rules |
| `Bayad/Design/DesignGallery.swift` | Debug-only preview of every component |
| `docs/redesign/DESIGN-SYSTEM.md` | Short reference of the same system |
| `docs/PRODUCT-SCOPE.md` | What the app is and isn't (single agency) |
