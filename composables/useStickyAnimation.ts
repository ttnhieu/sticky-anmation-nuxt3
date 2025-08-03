import { ref, onMounted, onUnmounted, type Ref } from 'vue';

// Định nghĩa kiểu cho các tùy chọn có thể truyền vào
interface StickyBoxOptions {
  minHeight?: number;
  maxHeight?: number;
  headerHeight?: number;
  topOffsetPadding?: number; // Khoảng đệm thêm khi dính
  bottomOffset?: number;
}

export const useStickyBox = (
  stickyBoxRef: Ref<HTMLElement | null>,
  parentContainerRef: Ref<HTMLElement | null>,
  options: StickyBoxOptions = {} // Các tùy chọn không bắt buộc
) => {
  // --- BƯỚC 1: KHỞI TẠO CÁC BIẾN CẦN THIẾT ---

  // Gán giá trị mặc định cho các tùy chọn
  const {
    minHeight = 640,
    maxHeight = 1000,
    headerHeight = 60,
    topOffsetPadding = 20,
    bottomOffset = 20
  } = options;

  const topOffset = headerHeight + topOffsetPadding;

  // Biến trạng thái
  let isExpansionTriggered = false;
  let expansionStartScrollY = 0;
  let triggerObserver: IntersectionObserver | null = null;

  const handleScroll = () => {
    const stickyBox = stickyBoxRef.value;
    const parentContainer = parentContainerRef.value;

    if (!isExpansionTriggered || !stickyBox || !parentContainer) {
      return;
    }

    const scrollY = window.scrollY;

    // --- Tính toán các điểm mốc ---
    const stickyStartPoint = parentContainer.offsetTop - topOffset;

    const finalScrollDelta =
      stickyStartPoint - expansionStartScrollY - bottomOffset;
    const stickyHeightWhenLocked = minHeight + Math.max(0, finalScrollDelta);
    const finalStickyHeight = Math.min(stickyHeightWhenLocked, maxHeight);

    const stickyEndPoint =
      parentContainer.offsetTop +
      parentContainer.offsetHeight -
      finalStickyHeight -
      topOffset;

    let newHeight;

    // --- Logic chính chia theo 3 trạng thái ---
    if (scrollY < stickyStartPoint) {
      const scrollDelta = scrollY - expansionStartScrollY - bottomOffset;
      newHeight = minHeight + Math.max(0, scrollDelta);
    } else if (scrollY >= stickyStartPoint && scrollY < stickyEndPoint) {
      newHeight = finalStickyHeight;
    } else {
      const distancePastEnd = scrollY - stickyEndPoint;
      newHeight = finalStickyHeight - distancePastEnd;
    }

    // --- Gán giá trị cuối cùng ---
    const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));
    stickyBox.style.height = `${clampedHeight}px`;
  };

  // Toàn bộ logic DOM phải được chạy sau khi component đã được mount
  onMounted(() => {
    const stickyBox = stickyBoxRef.value;
    console.log('🚀 ~ useStickyBox ~ stickyBox:', stickyBox);
    const parentContainer = parentContainerRef.value;
    console.log('🚀 ~ useStickyBox ~ parentContainer:', parentContainer);

    // Chỉ thực thi ở phía client và khi các element tồn tại
    if (process.client && stickyBox && parentContainer) {
      // --- BƯỚC 2: DÙNG INTERSECTION OBSERVER ---
      const observerOptions = {
        root: null,
        threshold: 1.0
      };

      const triggerCallback: IntersectionObserverCallback = (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isExpansionTriggered) {
            isExpansionTriggered = true;
            expansionStartScrollY = window.scrollY;
            triggerObserver?.unobserve(entry.target);
          }
        });
      };

      triggerObserver = new IntersectionObserver(
        triggerCallback,
        observerOptions
      );
      triggerObserver.observe(stickyBox);

      // --- BƯỚC 3: XỬ LÝ SCROLL ---
      window.addEventListener('scroll', handleScroll);
    }
  });

  // Dọn dẹp listener và observer khi component bị hủy để tránh rò rỉ bộ nhớ
  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('scroll', handleScroll);
      triggerObserver?.disconnect();
    }
  });
};
