# Plan: Arlo block and accessibility fixes

Created: 2026-09-12

Found while comparing the Skeleton theme with Carmine and Harvest. Carmine is the reference for block templates unless an item says otherwise.

> Arlo hasn't had the `content-builder` → `blocks` folder rename yet. Paths below use `src/templates/content-builder/`.
> *Update: the rename is done, so these files are now in `src/templates/blocks/`.*

**Useful commands**

```bash
# Compare an Arlo file with Carmine (run from the Themes folder)
diff -w -B Arlo/src/templates/blocks/<file> Carmine/src/templates/blocks/<file>

# Show a Carmine commit referenced below
git -C Carmine show <hash>
```

## Theme-specific fixes

- [x] **Folder rename** — rename `src/templates/content-builder/` to `src/templates/blocks/` and update references (Carmine commit `a0051ac`)
    - Done with `git mv`. The only references were the 16 `content-builder/banner` includes (404, blog, calendar, gallery, search). Arlo has no CLAUDE.md, and nothing in config, JS, or README referenced the folder.
- [x] **Skip-to-main link** — Arlo has none. Add one as the first element in `<body>` in `snippets/header.twig`. Use Harvest's `src/css/components/header/skip-to-main.css` for the styles (its z-index sits above a sticky header).
    - Arlo's `<body>` tag is in `snippets/head.twig`, not `header.twig`, so the link went there, right after `{{ _page.bodyStartCode() }}` (same spot as Skeleton). Copied `skip-to-main.css` and imported it in `css/components/header/index.css`. Its z-index (101) is above Arlo's sticky `HeaderWrap` (10).
- [x] **`<nav>` landmark** — no `<nav>` element exists in Arlo's templates. Wrap the main menu in `<nav aria-label="Main">` and update any JS selectors that target the menu.
    - `.MainNav` is hidden at every breakpoint in Arlo, and the pop-out menu is the real main navigation. So `Menu-navWrapper` in `snippets/header.twig` became `<nav class="Menu-navWrapper" aria-label="Main">`. That change is different from Skeleton, which labels the header nav wrapper. No CSS or JS targets that wrapper, and the hamburger's `aria-controls="popOutMenu"` still points at the menu panel.
- [x] **`404.twig`** — nests a second `<main id="main">` inside the layout's `<main>`. Remove the inner `<main>` (use a `<div>`).
    - Not applicable. Arlo's `404.twig` doesn't extend a layout. It includes the head/header snippets directly and has only one `<main id="main">`.
- [x] **`full-width.twig`** — `<main>` has no `id="main"`, so the skip link has no target. Add it.
- [x] **`content-builder/image-grid.twig`** — `{% set width = 800 %}` and the `width:` values in `count2`–`count6` overwrite the block's Width field, so the Width setting never takes effect. Remove them (Carmine commit `1745710`).
    - Applied Skeleton's `df443e1` diff. Arlo's file was identical to Skeleton's version before that commit.
- [x] **`content-builder/image-row.twig`** — `href="{image.url}"` uses single braces, so the link is broken. Change to `href="{{ image.url }}"`, and drop `target="_blank"` or add a visually hidden "(opens in a new window)".
    - Kept `target="_blank"`, added `rel="noopener"` and the visually hidden text (same as Skeleton).
- [x] **Margin/width support** — add `macros.blockMargin(margin)`/`macros.blockWidth(width, true)` to grid-2…6-columns, heading, html-code, and columned-content (Carmine commits `265e272`, `81c6c37`, `660fa93`). Confirm the CMS block definitions have Margin and Width fields.
    - Grid, heading, and html-code use Skeleton's `df443e1` diff, including the `{% import 'macros/macros' as macros %}` that the grid files were missing. Columned-content uses `blockWidth(width)` like Skeleton. It also got the macros import, which neither Skeleton nor Carmine has. The block definitions live in the CMS, not in this repo, so the Margin and Width fields still need to be confirmed there.
- [x] **Google ratings bar** — each star is its own labelled image, so screen readers repeat "Star rating". The visible text already states the rating, so wrap the stars and number in `aria-hidden="true"` and use `iconAriaHidden` instead of `iconImg` (see Skeleton's `blocks/google-ratings-bar.twig`).
- [x] **Reviews link setting** — there are two "URL to view reviews" fields. Use the Settings one and remove the Styles one (Skeleton has this change):
    - [x] `content-builder/google-ratings-bar.twig` — change `_core.theme.settings.googleRatingsBarReviewsLink` to `_core.theme.settings.customerRatingsBarReviewsLink` (3 places)
    - [x] `config/theme-styles.json` — in the "Blocks - Google Ratings Bar" group, remove the `googleRatingsBarReviewsLink` field and its "Review link" subgroup (the first one, which holds only that field). Keep the second "Review link" subgroup (the link typography).
    - Existing sites that set the link under Styles will need it re-entered under Settings → Customer Reviews & Ratings.

## Accessibility fixes shared by all themes

Carmine isn't a good reference for these — each needs a new fix. Items marked *(verify)* were found in Skeleton, Carmine, and Harvest but haven't been checked in Arlo yet.

- [x] **Accordion isn't keyboard-operable** — the heading is `<div class="Accordion-heading js-accordionHeading">` with only a click listener. Use a `<button>` with `aria-expanded` and `aria-controls` (`content-builder/accordion.twig`, `js/accordion.js`). *High*
    - Applied Skeleton's `31a8df1` and `da5e0f9` diffs (template, JS, and `accordion.css` for `width: 100%` and `visibility: hidden` on closed content).
- [x] **Modals** — the close button `<button class="Modal-close" data-micromodal-close></button>` has no accessible name. Also check for a missing `aria-labelledby`, `disableFocus: true` on the popup, and the notification icon's missing `aria-hidden` *(verify)* (`widgets/collections/popups.twig`, `notifications.twig`).
    - Verified in Arlo and fixed as in Skeleton. `MicroModal.init()` in `js/main.js` no longer sets `disableFocus`. Arlo also has a theme-settings popup in `snippets/footer.twig`. It got the same close button fix, `aria-label="Announcement"` (it has no title), and `disableFocus` removed.
- [x] **Pagination** — wrap in `<nav aria-label="Pagination">`, add `aria-current="page"` to the current page, and change the chevron icons from `role="img"` to `aria-hidden="true"` (`snippets/pagination.twig`).
    - Applied to Arlo's own pagination markup, which keeps its `|` separators.
- [x] **`iconImg` macro** outputs `<svg role="img" alt="…">` — `alt` isn't valid on `<svg>`. Use `aria-label` or a `<title>` (`macros/macros.twig`).
    - Removed `alt`. The macro already had a `<title>` with `aria-labelledby`.
- [x] **`rel="noopenner"` typo** — should be `noopener`.
    - Fixed in the footer and pop-out menu social links.
- [x] **Form errors** — the form error container has no `role="alert"`/`aria-live`. Also check that `form.js` sets `aria-invalid`/`aria-describedby` *(verify)* (`macros/form-macros.twig`, `js/form.js`).
    - Verified: `form.js` didn't set them. Applied Skeleton's `7dfb4b6` diff to `form.js` and added `role="alert"` to both error container macros.
- [x] **No `prefers-reduced-motion` CSS** — transitions, slider autoplay, and modal animations ignore it.
    - Added Skeleton's reduced-motion block to `css/base/base.css`. Slider autoplay isn't covered by CSS; see the skipped pause/play control.
- [x] **Mobile submenus hidden from screen readers** — submenus render with `aria-hidden="true"` and a tap doesn't change it; `aria-expanded` sits on the `<ul>` instead of the toggle *(verify)* (`navigation/main.twig`, `js/navigation/`). *High*
    - Verified. In `navigation/main.twig`, `aria-expanded` moved from the dropdown `<ul>` to the dropdown links. Arlo has no `small-screen.js`, so the tap handler in `js/navigation/pop-out-menu.js` (`setupDropdowns`) now keeps `aria-expanded` and `aria-hidden` in sync. The pop-out menu's own sub-navigation is always expanded and never hidden.
    - Rewriting the menu from `role="menubar"`/`menuitem` to a disclosure pattern: Skipped — same as Skeleton.
- [x] **Mobile menu** — no Escape to close, no focus trap, no focus return *(verify)*.
    - Already in Arlo. `pop-out-menu.js` closes the menu on Escape, returns focus to the open button, and marks the closed panel `inert`. A focus trap wasn't added, same as Skeleton.
- [x] **`title` as the only label** on social and logo links; social links open in a new window with no warning *(verify)*.
    - `title` isn't the only label in Arlo. The logo links have `aria-label="Go to home page"` or the logo alt, and the social icons use `iconImg` with a `<title>`. Added a visually hidden "(opens in a new window)" to the footer and pop-out menu social links and to the footer credit link, which also got `rel="noopener"`.
- [x] **Required marker** — add `aria-hidden="true"` to the `*` in labels *(verify)*.
    - Verified and fixed in `macros/form-macros.twig` (Skeleton's `58182bf`).
- [x] **Upload previews** use `alt="Image"` *(verify)* (`macros/form-macros.twig`).
    - Verified. Both now use "Preview of the uploaded image".
- [ ] **Video/audio** — no `<track>` captions or transcript option *(verify)*.
    - Skipped — same as Skeleton. (Confirmed: `blocks/video.twig`, `blocks/audio.twig`, and `macros/banner.twig` have no `<track>`.)
- [x] **Landmark labels** — footer navs and sidebar `<aside>` elements have no `aria-label` *(verify)*.
    - Verified. The footer `<ul>` is now wrapped in `<nav aria-label="Footer">` in `navigation/footer.twig`. The sidebar asides are labelled "Section navigation" and "Sidebar" in both two-column layouts. The header-bar navigation (`navigation/header-bar.twig`) still has no `<nav>`. That wasn't in scope.
- [ ] **`lang="en"` is hardcoded** in the header snippet *(verify)*.
    - Skipped — same as Skeleton. (Confirmed: it's in `snippets/head.twig`.)

## Verification

- [ ] `npm run build` completes and `npm run stylelint` shows no new warnings
    - Build not run. `npm run stylelint`: 17 warnings, 0 errors, all in files that weren't changed. `npm run jslint`: 1 error in `js/navigation/accessibility.js` (`no-useless-assignment`), which wasn't changed.
- [ ] Every changed block renders in the CMS, including the Margin and Width options
- [ ] Keyboard check: Tab from page load shows the skip link first and it jumps to the main content; accordion headings open with Enter/Space
