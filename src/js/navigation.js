/* =========================================================================== *\
    JavaScript for navigation menus
\* =========================================================================== */

/**
 * Small screen navigation
 */

// eslint-disable-next-line
const smallScreenNav = {
    init() {
        // Setup open/close
        const body = document.querySelector('body');
        const menu = document.querySelector('.Menu');
        const menuButtons = document.querySelector('.Menu-buttons');
        const openButton = document.querySelector('.js-menuOpenBtn');
        const closeButton = document.querySelector('.js-menuCloseBtn');

        /**
         * Function to handle the mousedown event outside of the menu
         *
         * @param {Event} e The event object
         */
        function handleMenuMouseDown(e) {
            if (!menu.contains(e.target)) {
                // The user clicked outside of the menu dom node.
                // Hide the menu
                hideMenu(); // eslint-disable-line no-use-before-define
            }
        }

        /**
         * Function to hide the menu
         */
        function hideMenu() {
            // Hide the menu
            menu.classList.remove('is-open');
            menu.classList.add('is-closed');
            body.classList.remove('Scroll-lock');

            document.removeEventListener('mousedown', handleMenuMouseDown);
        }

        /**
         * Function to show the menu
         */
        function showMenu() {
            // Show the menu
            menu.classList.add('is-open');
            menu.classList.remove('is-closed');
            body.classList.add('Scroll-lock');

            // When the menu shows add a mousedown event listener
            document.addEventListener('mousedown', handleMenuMouseDown);
        }

        if (openButton) {
            openButton.addEventListener('click', showMenu);
        }
        if (closeButton) {
            closeButton.addEventListener('click', hideMenu);
        }
        if (menuButtons) {
            menuButtons.addEventListener('click', hideMenu);
        }

        // Setup dropdowns
        const menuItems = document.querySelectorAll('.MenuNav-item');
        menuItems.forEach((menuItem) => {
            const dropdownLink = menuItem.querySelector('span.MenuNav-link');
            if (dropdownLink !== null) {
                dropdownLink.addEventListener('click', () => {
                    dropdownLink.classList.toggle('is-current');
                });
            }
        });

        // The following code is for showing/hiding the header on mobile.
        // This was implemented on some of the other pest sites (GetEm, for example);

        // Provide event throttling utility
        // let throttleTimer;
        // const throttle = (callback, time) => {
        //     if (throttleTimer) return;
        //     throttleTimer = true;
        //     setTimeout(() => {
        //         callback();
        //         throttleTimer = false;
        //     }, time);
        // };

        // Handle showing/hiding the header on mobile
        // let lastScroll = 0;
        // const header = document.querySelector('.Header-main');
        // const calcScroll = () => {
        //     const currScroll = window.scrollY;
        //     if (currScroll < lastScroll) {
        //         header.classList.add('is-shown');
        //         header.classList.remove('is-closed');
        //     } else {
        //         header.classList.add('is-closed');
        //         header.classList.remove('is-shown');
        //     }
        //     lastScroll = currScroll;
        // };

        // Handle mobile header hide/show on scroll
        // const handleScollHeader = () => {
        //     document.addEventListener('scroll', () => {
        //         throttle(calcScroll, 250);
        //     }, { passive: true });
        // };

        // const checkForScollHeader = () => {
        //     if (window.innerWidth <= 800) {
        //         handleScollHeader();
        //     } else {
        //         window.addEventListener('resize', () => {
        //             if (window.innerWidth <= 800) {
        //                 handleScollHeader();
        //             }
        //         });
        //     }
        // };

        // checkForScollHeader();
    },
};

/**
 * Adds accessibly functionality to the main navigation.
 * Adds support for navigating with the keyboard.
 *
 * Add "data-access-nav" attribute to the navigation menu.
 * Add "js-navLink" class to the navigation link tags.
 * Add "js-skip" class to any items that should be skipped. Useful for items
 *      that are hidden for small screens.
 * Add "js-dropdownMenu" class to the <ul> tag that contains the sub navigation
 * Add "js-dropdownParent" class to a <li> tag that contains a sub list for a drop down.
 * Add "js-dropdown" to any link tags that have a drop down.
 */
/**
 * Adds accessibly functionality to the main navigation.
 * Adds support for navigating with the keyboard.
 *
 * Add "data-access-nav" attribute to the navigation menu.
 * Add "js-navLink" class to the navigation link tags.
 * Add "js-skip" class to any items that should be skipped. Useful for items
 *      that are hidden for small screens.
 * Add "js-dropdownMenu" class to the <ul> tag that contains the sub navigation
 * Add "js-dropdownParent" class to a <li> tag that contains a sub list for a drop down.
 * Add "js-dropdown" to any link tags that have a drop down.
 */
// eslint-disable-next-line
const navAccess = {
    init() {
        const menus = document.querySelectorAll('[data-access-nav]');
        const self = this;
        if (menus.length > 0) {
            menus.forEach((menu) => {
                self.setupMenu(menu);
            });
        }
    },

    /**
     * Sets up the menu for accessibility
     *
     * @param {Element} menu The menu element to set up
     */
    setupMenu(menu) {
        const nav = menu.querySelectorAll('.js-navLink');
        const self = this;
        let key;
        const next = ['ArrowDown', 'Down', 'Tab', 'Spacebar', ' '];
        const prev = ['ArrowUp', 'Up', 'Tab', 'Spacebar', ' '];
        const left = ['ArrowLeft', 'Left'];
        const right = ['ArrowRight', 'Right'];
        let focusEl;
        nav.forEach((item) => {
            // Handle the "keydown" event
            item.addEventListener('keydown', (e) => {
                key = e.key;
                if (next.indexOf(key) >= 0) {
                    // Going forwards
                    if (e.shiftKey) {
                        // Shift key was down
                        self.focus(e, e.target);
                    } else {
                        // Moving forward
                        self.focus(e, e.target, true);
                    }
                } else if (prev.indexOf(key) >= 0) {
                    // Going backwards
                    if (e.shiftKey) {
                        // Negating going backwards so going forwards
                        self.focus(e, e.target, true);
                    } else {
                        self.focus(e, e.target);
                    }
                } else if (left.indexOf(key) >= 0) {
                    // Jumping backwards
                    self.focus(e, e.target, false, true);
                } else if (right.indexOf(key) >= 0) {
                    // Jumping forwards
                    self.focus(e, e.target, true, true);
                } else if (key === 'Escape') {
                    // Close the menu
                    const parentLi = self.getParent(e.target).parentNode;
                    if (parentLi !== null) {
                        focusEl = self.getLink(parentLi);
                        focusEl.focus();
                    }
                }
            });
        });
    },

    /**
     * Move the focus to the next/previous element
     *
     * @param {object} event The event that triggered the focus
     * @param {Element} el The target of the keydown event
     * @param {boolean} [next] Whether or not moving to the next item
     * @param {boolean} jumping Whether jumping to the next/previous top level navigation link
     */
    focus(event, el, next, jumping) {
        let focusEl = null;
        const isFirst = this.isDropdownFirst(el);
        const isLast = this.isDropdownLast(el);
        let sibling;
        if (next) {
            if (jumping) {
                // Jump to next top level navigation link
                this.deactivateParent(el);
                focusEl = this.getNextInLevel(this.getParent(el));
            } else {
                if (isLast) {
                    // Deactivate this dropdown
                    this.deactivateParent(el);
                }
                sibling = el.nextElementSibling;
                // If next element is a dropdown, expand it
                if (
                    sibling !== null
                    && sibling.nodeName.toLowerCase() === 'ul'
                ) {
                    this.activate(el.parentNode);
                }
                focusEl = this.getNextLink(el); // next navLink
            }
        } else if (jumping) {
            // Jump to previous top level navigation link
            this.deactivateParent(el);
            focusEl = this.getPrevInLevel(this.getParent(el));
        } else if (isFirst) {
            // Close dropdown and move to top level navigation
            this.deactivateParent(el);
            focusEl = this.getParent(el);
        } else {
            sibling = el.parentNode.previousElementSibling;
            if (
                sibling !== null
                && sibling.classList.contains('js-dropdownParent')
            ) {
                // Link before a sibling with dropdown (skip over dropdown)
                focusEl = this.getPrevInLevel(el);
            } else {
                // Get the previous navLink
                focusEl = this.getPrevLink(el);
            }
        }
        if (focusEl) {
            event.preventDefault();
            focusEl.focus();
        } else {
            el.blur();
        }
    },

    /**
     * Activates a drop down
     *
     * @param {Element} el The element to activate
     */
    activate(el) {
        if (el.classList.contains('js-dropdownParent')) {
            el.classList.add('is-active');
            // change the aria-expanded and aria-hidden values on the <ul> tag
            el.querySelector('a').setAttribute('aria-expanded', 'true');
        }
    },

    /**
     * Deactivates a drop down
     *
     * @param {Element} el The element to deactivate
     */
    deactivateParent(el) {
        const parent = this.getParent(el);
        parent.parentNode.classList.remove('is-active');
        // change the aria-expanded and aria-hidden values on the <ul> tag
        parent.setAttribute('aria-expanded', 'false');
    },

    /**
     * Returns returns true is the first element of a dropdown list
     *
     * @param {Element} el The element to check
     * @returns {boolean}
     */
    isDropdownFirst(el) {
        const dropdownNavs = Array.prototype.slice.call(
            this.getParent(el).parentNode.querySelectorAll('.js-navLink'),
        ); // get all children links in dropdown
        // if it is the first link (after the main navigation link)
        return dropdownNavs.indexOf(el) === 1;
    },

    /**
     * Returns true if the last element of a dropdown
     *
     * @param {Element} el The element to check
     * @returns {boolean}
     */
    isDropdownLast(el) {
        const dropdownNavs = Array.prototype.slice.call(
            this.getParent(el).parentNode.querySelectorAll('.js-navLink'),
        ); // get all children links in dropdown
        return dropdownNavs.indexOf(el) === dropdownNavs.length - 1; // if it is the last link
    },

    /**
     * Returns the index of this link out of all other navLinks
     *
     * @param {Element} el The element to work with
     * @returns {number}
     */
    getLinkIndex(el) {
        const list = Array.prototype.slice.call(
            document.querySelectorAll('.js-navLink'),
        );
        return list.indexOf(el);
    },

    /**
     * Returns the index of the parent top level navigation
     *
     * @param {Element} el The element to work with
     * @returns {number}
     */
    getParentIndex(el) {
        const list = Array.prototype.slice.call(el.parentNode.children);
        return list.indexOf(el);
    },

    /**
     * Returns the previous navLink
     *
     * @param {Element} el The element to work with
     * @returns {Element}
     */
    getPrevLink(el) {
        const list = Array.prototype.slice.call(
            document.querySelectorAll('.js-navLink'),
        );
        return list[this.getLinkIndex(el) - 1];
    },

    /**
     *  Returns the next navLink
     *
     * @param {Element} el The element to work with
     * @returns {Element}
     */
    getNextLink(el) {
        const list = Array.prototype.slice.call(
            document.querySelectorAll('.js-navLink'),
        );
        return list[this.getLinkIndex(el) + 1];
    },

    /**
     *  Returns the parent navigation link
     *
     * @param {Element} el The element to work with
     * @returns {Element}
     */
    getParent(el) {
        let node = el;
        while (node !== document.body) {
            if (
                node.classList.contains('js-dropdownParent')
                || node.parentNode.classList.contains('js-mainNav')
            ) {
                break;
            }
            node = node.parentNode;
        }
        return this.getLink(node);
    },

    /**
     *  Returns the direct sibling navigation link before the active one
     *
     * @param {Element} el The element to work with
     * @returns {Element}
     */
    getPrevInLevel(el) {
        return this.getLink(el.parentNode.previousElementSibling);
    },

    /**
     *  Returns the direct sibling navigation link after the active one
     *
     * @param {Element} el The element to work with
     * @returns {Element}
     */
    getNextInLevel(el) {
        return this.getLink(el.parentNode.nextElementSibling);
    },

    /**
     * Gets the first navigation in the element
     *
     * @param {Element} el The element to work with
     * @returns {Element}
     */
    getLink(el) {
        return el ? el.querySelector('a.js-navLink') : null;
    },
};
