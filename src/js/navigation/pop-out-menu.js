/**
 * Pop out menu
 *
 * Arlo uses a slide-out panel instead of the small screen nav bar that the other
 * themes use. ".MainNav" is hidden at every breakpoint and the open button is always
 * visible, so this panel is the primary navigation rather than a small screen
 * fallback. That's why there's no resize handling here -- there is no width at which
 * an open menu should be forced closed.
 *
 * Visibility is driven by the "is-closed" class on the panel. The panel stays in the
 * DOM while closed so that it can transition, so it's also marked "inert" to keep its
 * links out of the tab order and away from screen readers.
 *
 * The dropdown toggling below is the one piece of navigation/small-screen.js that
 * Arlo still needed. That module handled a nav bar this theme doesn't have, so it was
 * removed and this kept.
 */
const popOutMenu = {
    /**
     * Initialization
     */
    init() {
        this.setupMenu();
        this.setupDropdowns();
    },

    /**
     * Set up opening and closing the pop out menu
     */
    setupMenu() {
        const html = document.documentElement;
        const menu = document.querySelector('.js-menu');
        const openBtn = document.querySelector('.js-menuOpenBtn');
        const closeBtn = document.querySelector('.js-menuCloseBtn');

        if (menu === null || openBtn === null) {
            return;
        }

        /**
         * Open the menu
         */
        function open() {
            menu.classList.remove('is-closed');
            menu.removeAttribute('inert');
            openBtn.setAttribute('aria-expanded', 'true');
            // Prevent the page behind the menu from scrolling
            html.classList.add('menu-open');
            if (closeBtn !== null) {
                closeBtn.focus();
            }
        }

        /**
         * Close the menu
         *
         * @param {boolean} returnFocus Whether to move focus back to the open button
         */
        function close(returnFocus = true) {
            menu.classList.add('is-closed');
            menu.setAttribute('inert', '');
            openBtn.setAttribute('aria-expanded', 'false');
            html.classList.remove('menu-open');
            if (returnFocus) {
                openBtn.focus();
            }
        }

        // Set the starting state from the markup so that the attributes can't
        // drift out of sync with the "is-closed" class.
        if (menu.classList.contains('is-closed')) {
            close(false);
        } else {
            open();
        }

        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            open();
        });

        if (closeBtn !== null) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                close();
            });
        }

        // Close the menu with the escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !menu.classList.contains('is-closed')) {
                close();
            }
        });
    },

    /**
     * Set up tap-to-open dropdowns for navigation that uses the "js-dropdown" hook,
     * such as an embedded navigation. The pop out menu's own sub navigation is always
     * expanded, so it isn't involved here.
     */
    setupDropdowns() {
        // The max window width where dropdowns are opened by tapping instead of hover
        const width = 1024;

        document.querySelectorAll('.js-dropdown').forEach((dropdown) => {
            dropdown.addEventListener('click', (e) => {
                if (window.innerWidth <= width) {
                    e.preventDefault();
                    e.target.classList.toggle('is-active');
                    e.target.parentElement.classList.toggle('is-active');
                }
            });
        });
    },
};

export default popOutMenu;
