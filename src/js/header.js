const stickyHeader = {
    lastScrollY: 0,
    header: null,

    init() {
        this.header = document.querySelector(".HeaderWrap");

        if (!this.header) {
            // eslint-disable-next-line no-console
            console.error("HeaderWrap not found!");
            return;
        }

        this.setupIntersectionObserver();
        this.setupScrollListener();

        // Bring a hidden header back when keyboard focus moves into it
        this.header.addEventListener('focusin', () => {
            this.header.classList.remove('is-hidden');
        });
    },

    setupIntersectionObserver() {
        const headerEl = document.querySelector('.js-stickyHeader');
        const boundaryEl = document.querySelector('.js-stickyHeaderBoundary');

        if (!headerEl || !boundaryEl) {
            // eslint-disable-next-line no-console
            console.error('StickyHeader or Boundary not found!');
            return;
        }

        const handler = (entries) => {
            if (!entries[0].isIntersecting) {
                headerEl.classList.add('is-sticky');
            } else {
                headerEl.classList.remove('is-sticky');
            }
        };

        const observer = new IntersectionObserver(handler);

        observer.observe(boundaryEl);
    },

    setupScrollListener() {
        window.addEventListener("scroll", () => {
            requestAnimationFrame(this.handleScroll.bind(this));
        });

        window.addEventListener("resize", () => {
            this.handleResize();
        });
    },

    handleScroll() {
        const currentScrollY = window.scrollY;

        if (window.innerWidth > 800) {
            this.header.classList.remove("is-hidden");
        }

        // Hide header on scroll (for mobile)
        if (window.innerWidth <= 800) {
            if (currentScrollY < 50) {
                this.header.classList.remove("is-hidden");
                this.lastScrollY = currentScrollY;
            } else {
                // Don't hide the header while keyboard focus is inside it (WCAG 2.4.11)
                if (currentScrollY > this.lastScrollY && !this.header.contains(document.activeElement)) {
                    this.header.classList.add("is-hidden");
                } else if (currentScrollY < this.lastScrollY) {
                    this.header.classList.remove("is-hidden");
                }
                this.lastScrollY = currentScrollY;
            }
        }

        // 🆕 New part: Grow logo at top of page
        if (currentScrollY <= 10) {
            this.header.classList.add("is-at-top");
        } else {
            this.header.classList.remove("is-at-top");
        }
    },


    handleResize() {
        if (window.innerWidth > 800) {
            this.header.classList.remove("is-hidden");
        }
    }
};

// Then don't forget to call stickyHeader.init() somewhere after your DOM is ready:
document.addEventListener('DOMContentLoaded', () => {
    stickyHeader.init();
});
