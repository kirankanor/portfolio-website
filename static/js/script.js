// IntersectionObserver watches elements and tells us when they scroll into view.
// This is the standard, performant way to do "reveal on scroll" -- it's far cheaper
// than checking scroll position in a scroll event handler, because the browser
// only notifies us when visibility actually changes.

const sections = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    { threshold: 0.15 } // fire when 15% of the section is visible
);

sections.forEach((section) => observer.observe(section));
