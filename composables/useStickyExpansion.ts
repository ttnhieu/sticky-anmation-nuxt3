import { type Ref, watchEffect } from 'vue';

interface StickyExpansionOptions {
  minHeight?: number;
  maxHeight?: number;
  headerHeight?: number;
  stickyPadding?: number;
}

/**
 * Creates an effect for a sticky element that expands in height while scrolling.
 * @param stickyElementRef A ref to the element that will have the sticky effect.
 * @param containerRef A ref to the parent container that bounds the effect area.
 * @param options Options to customize the effect.
 */
export const useStickyExpansion = (
  stickyElementRef: Ref<HTMLElement | null>,
  containerRef: Ref<HTMLElement | null>,
  options: StickyExpansionOptions = {}
) => {
  const { minHeight = 640, maxHeight = 1000, headerHeight = 60, stickyPadding = 20 } = options;

  // The offset from the top of the viewport where the element becomes sticky.
  const stickyTriggerOffset = headerHeight + stickyPadding;

  // Internal state variables.
  let hasStartedExpanding = false;
  let expansionStartScrollY = 0;

  const handleScroll = () => {
    const stickyEl = stickyElementRef.value;
    const container = containerRef.value;

    if (!hasStartedExpanding || !stickyEl || !container) {
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const stickyElRect = stickyEl.getBoundingClientRect();

    let newHeight: number;

    // Calculate height based on the distance scrolled.
    const scrollDelta = window.scrollY - expansionStartScrollY;
    const scrollDrivenHeight = minHeight + Math.max(0, scrollDelta);

    // Calculate the height limited by the bottom edge of the viewport.
    const viewportLimitedHeight = window.innerHeight - stickyElRect.top - stickyPadding;

    // The potential height is the smaller of the two calculations above.
    const potentialHeight = Math.min(scrollDrivenHeight, viewportLimitedHeight);

    const currentMaxHeight = Math.min(potentialHeight, maxHeight);
    const isCollapsing = containerRect.bottom < currentMaxHeight + stickyTriggerOffset;

    if (isCollapsing) {
      const distancePastEnd = currentMaxHeight + stickyTriggerOffset - containerRect.bottom - stickyPadding;
      newHeight = currentMaxHeight - distancePastEnd;
    } else {
      newHeight = potentialHeight;
    }

    const finalHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    stickyEl.style.height = `${finalHeight}px`;
  };

  watchEffect((onCleanup) => {
    const stickyEl = stickyElementRef.value;
    const container = containerRef.value;

    if (stickyEl && container) {
      const observerCallback: IntersectionObserverCallback = (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedExpanding) {
            hasStartedExpanding = true;
            expansionStartScrollY = window.scrollY;
            observer.unobserve(entry.target);
          }
        });
      };

      const intersectionObserver = new IntersectionObserver(observerCallback, { threshold: 1.0 });
      intersectionObserver.observe(stickyEl);

      window.addEventListener('scroll', handleScroll);

      onCleanup(() => {
        window.removeEventListener('scroll', handleScroll);
        intersectionObserver?.disconnect();
      });
    }
  });
};
