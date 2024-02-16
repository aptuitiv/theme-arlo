/**
 * Handle all functionality pertaining to the sticky header
 */
const stickyHeader = { // eslint-disable-line no-unused-vars
    init() {
        this.setupIntersectionObserver();
    },

    /**
     * Detects when the sticky header is scrolled to show a box shadow on it
     */
    setupIntersectionObserver: () => {
        const headerEl = document.querySelector('.js-stickyHeader');
        const boundaryEl = document.querySelector('.js-stickyHeaderBoundary');

        const handler = (entries) => {
            if (!entries[0].isIntersecting) {
                headerEl.classList.add('is-sticky');
            } else {
                headerEl.classList.remove('is-sticky');
            }
        };

        const headerObserver = new IntersectionObserver(handler);
        headerObserver.observe(boundaryEl);
    },
};
