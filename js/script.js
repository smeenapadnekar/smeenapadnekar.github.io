// Image Loading Optimization - Apple-style instant loading
document.addEventListener("DOMContentLoaded", () => {
	// Handle all images - both eager and lazy loaded
	const allImages = document.querySelectorAll("img");
	
	allImages.forEach((img) => {
		// If image is already loaded, add loaded class immediately
		if (img.complete && img.naturalHeight !== 0) {
			img.classList.add("loaded");
		} else {
			// Add loaded class when image loads
			img.addEventListener("load", () => {
				img.classList.add("loaded");
			}, { once: true });
			
			// Handle error case
			img.addEventListener("error", () => {
				console.warn(`Failed to load image: ${img.src}`);
				img.classList.add("loaded"); // Show placeholder
			}, { once: true });
		}
	});
	
	// For lazy-loaded images (like profile photo), use IntersectionObserver
	const lazyImages = document.querySelectorAll("img[loading='lazy']");
	
	if (lazyImages.length > 0 && "IntersectionObserver" in window) {
		const imageObserver = new IntersectionObserver(
			(entries, observer) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const img = entry.target;
						
						// Add loaded class when image is fully loaded
						if (img.complete && img.naturalHeight !== 0) {
							img.classList.add("loaded");
						} else {
							img.addEventListener("load", () => {
								img.classList.add("loaded");
							}, { once: true });
						}
						
						observer.unobserve(img);
					}
				});
			},
			{
				// Start loading slightly before visible
				rootMargin: "100px",
			}
		);

		lazyImages.forEach((img) => imageObserver.observe(img));
	}
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const darkModeIcon = darkModeToggle.querySelector("i");

// Function to update navbar colors based on dark mode
function updateNavbarColors() {
	const navbar = document.querySelector(".navbar");
	const isDarkMode = body.classList.contains("dark-mode");

	if (window.scrollY > 100) {
		if (isDarkMode) {
			navbar.style.background = "rgba(29, 29, 31, 0.98)";
		} else {
			navbar.style.background = "rgba(255, 255, 255, 0.98)";
		}
		navbar.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)";
	} else {
		if (isDarkMode) {
			navbar.style.background = "rgba(29, 29, 31, 0.72)";
		} else {
			navbar.style.background = "rgba(255, 255, 255, 0.72)";
		}
		navbar.style.boxShadow = "";
	}
}

// Check for saved dark mode preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
	body.classList.add("dark-mode");
	darkModeIcon.classList.remove("fa-moon");
	darkModeIcon.classList.add("fa-sun");
}

// Update navbar on page load
updateNavbarColors();

// Toggle dark mode
darkModeToggle.addEventListener("click", () => {
	body.classList.toggle("dark-mode");

	// Update icon
	if (body.classList.contains("dark-mode")) {
		darkModeIcon.classList.remove("fa-moon");
		darkModeIcon.classList.add("fa-sun");
		localStorage.setItem("theme", "dark");
	} else {
		darkModeIcon.classList.remove("fa-sun");
		darkModeIcon.classList.add("fa-moon");
		localStorage.setItem("theme", "light");
	}

	// Update navbar colors immediately
	updateNavbarColors();
});

// Navigation Toggle
const navToggle = document.getElementById("navToggle");
const navClose = document.getElementById("navClose");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// Open mobile menu
navToggle.addEventListener("click", () => {
	navMenu.classList.toggle("active");
	navToggle.classList.toggle("active");
});

// Close mobile menu with close button
navClose.addEventListener("click", () => {
	navMenu.classList.remove("active");
	navToggle.classList.remove("active");
});

// Close mobile menu when clicking on a link
navLinks.forEach((link) => {
	link.addEventListener("click", () => {
		navMenu.classList.remove("active");
		navToggle.classList.remove("active");
	});
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", function (e) {
		e.preventDefault();
		const target = document.querySelector(this.getAttribute("href"));
		if (target) {
			const offset = 80;
			const targetPosition = target.offsetTop - offset;
			window.scrollTo({
				top: targetPosition,
				behavior: "smooth",
			});
		}
	});
});

// Optimized scroll handler with throttling
let scrollTimeout;
let ticking = false;

function handleScroll() {
	if (!ticking) {
		window.requestAnimationFrame(() => {
			let current = "";
			const sections = document.querySelectorAll("section");

			sections.forEach((section) => {
				const sectionTop = section.offsetTop;
				if (window.scrollY >= sectionTop - 200) {
					current = section.getAttribute("id");
				}
			});

			navLinks.forEach((link) => {
				link.classList.remove("active");
				if (link.getAttribute("href") === `#${current}`) {
					link.classList.add("active");
				}
			});

			// Change navbar background on scroll
			updateNavbarColors();

			ticking = false;
		});
		ticking = true;
	}
}

window.addEventListener("scroll", handleScroll, { passive: true });

// Projects Horizontal Scroll Navigation (Apple-style - Improved)
const projectsScroll = document.getElementById("projectsScroll");
const projectsNavPrev = document.querySelector(".projects-nav-prev");
const projectsNavNext = document.querySelector(".projects-nav-next");
const projectsNavMobilePrev = document.querySelector(".projects-nav-mobile-prev");
const projectsNavMobileNext = document.querySelector(".projects-nav-mobile-next");

if (projectsScroll) {
	const projectCards = projectsScroll.querySelectorAll(".project-card-link");
	let isScrolling = false;
	let scrollTimeout = null;
	
	// Get card dimensions
	function getCardDimensions() {
		if (projectCards.length === 0) return { width: 0, gap: 0 };
		const cardWidth = projectCards[0].offsetWidth;
		const containerStyle = getComputedStyle(projectsScroll);
		const gap = parseFloat(containerStyle.gap) || 0;
		return { width: cardWidth, gap: gap };
	}
	
	// Get current scroll position as card index
	function getCurrentCardIndex() {
		const { width, gap } = getCardDimensions();
		if (width === 0) return 0;
		const scrollLeft = projectsScroll.scrollLeft;
		const cardStep = width + gap;
		return Math.round(scrollLeft / cardStep);
	}
	
	// Scroll to specific card by index (Apple-style smooth scroll)
	function scrollToCard(index) {
		if (index < 0 || index >= projectCards.length) return;
		
		const { width, gap } = getCardDimensions();
		const targetScrollLeft = index * (width + gap);
		
		// Use smooth scroll behavior
		projectsScroll.scrollTo({
			left: targetScrollLeft,
			behavior: "smooth"
		});
	}
	
	// Check if can scroll in direction
	function canScroll(direction) {
		const currentIndex = getCurrentCardIndex();
		if (direction === "prev") {
			return currentIndex > 0;
		} else {
			return currentIndex < projectCards.length - 1;
		}
	}
	
	// Update button visibility and states
	function updateNavButtons() {
		const currentIndex = getCurrentCardIndex();
		const maxIndex = projectCards.length - 1;
		const atStart = currentIndex <= 0;
		const atEnd = currentIndex >= maxIndex;
		
		// Desktop buttons
		if (projectsNavPrev && projectsNavNext) {
			if (atStart) {
				projectsNavPrev.classList.remove("visible");
			} else {
				projectsNavPrev.classList.add("visible");
			}
			
			if (atEnd) {
				projectsNavNext.classList.remove("visible");
			} else {
				projectsNavNext.classList.add("visible");
			}
		}
		
		// Mobile buttons
		if (projectsNavMobilePrev && projectsNavMobileNext) {
			projectsNavMobilePrev.disabled = atStart;
			projectsNavMobileNext.disabled = atEnd;
		}
	}
	
	// Navigate to previous/next card
	function navigateProjects(direction, event) {
		// Prevent any default behavior
		if (event) {
			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
		}
		
		// Prevent multiple rapid clicks
		if (isScrolling) return;
		
		// Check if can scroll in this direction
		if (!canScroll(direction)) return;
		
		isScrolling = true;
		
		const currentIndex = getCurrentCardIndex();
		const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
		
		// Scroll to the card
		scrollToCard(newIndex);
		
		// Remove focus from button to prevent scroll-on-focus issues
		if (event && event.target) {
			event.target.blur();
		}
		
		// Reset scrolling flag after animation
		clearTimeout(scrollTimeout);
		scrollTimeout = setTimeout(() => {
			isScrolling = false;
			updateNavButtons();
		}, 600);
	}
	
	// Desktop navigation buttons
	if (projectsNavPrev) {
		projectsNavPrev.addEventListener("click", (e) => navigateProjects("prev", e), false);
		projectsNavPrev.addEventListener("touchstart", (e) => {
			e.preventDefault();
			navigateProjects("prev", e);
		}, { passive: false });
	}
	
	if (projectsNavNext) {
		projectsNavNext.addEventListener("click", (e) => navigateProjects("next", e), false);
		projectsNavNext.addEventListener("touchstart", (e) => {
			e.preventDefault();
			navigateProjects("next", e);
		}, { passive: false });
	}
	
	// Mobile navigation buttons
	if (projectsNavMobilePrev) {
		projectsNavMobilePrev.addEventListener("click", (e) => navigateProjects("prev", e), false);
		projectsNavMobilePrev.addEventListener("touchstart", (e) => {
			e.preventDefault();
			navigateProjects("prev", e);
		}, { passive: false });
	}
	
	if (projectsNavMobileNext) {
		projectsNavMobileNext.addEventListener("click", (e) => navigateProjects("next", e), false);
		projectsNavMobileNext.addEventListener("touchstart", (e) => {
			e.preventDefault();
			navigateProjects("next", e);
		}, { passive: false });
	}
	
	// Update button states on scroll (with debouncing)
	let scrollUpdateTimeout;
	projectsScroll.addEventListener("scroll", () => {
		clearTimeout(scrollUpdateTimeout);
		scrollUpdateTimeout = setTimeout(() => {
			if (!isScrolling) {
				updateNavButtons();
			}
		}, 150);
	}, { passive: true });
	
	// Update on window resize (with debouncing)
	let resizeTimeout;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			updateNavButtons();
		}, 250);
	}, { passive: true });
	
	// Initial setup
	updateNavButtons();
}

// Contact Form Handler
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", async (e) => {
	e.preventDefault();

	// Get form button
	const submitButton = contactForm.querySelector('button[type="submit"]');
	const originalButtonText = submitButton.innerHTML;

	// Disable button and show loading state
	submitButton.disabled = true;
	submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

	try {
		// Submit form to Web3Forms
		const formData = new FormData(contactForm);
		const response = await fetch(contactForm.action, {
			method: "POST",
			body: formData,
		});

		const result = await response.json();

		if (result.success) {
			// Success
			const name = document.getElementById("name").value;
			alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
			contactForm.reset();
		} else {
			// Error from Web3Forms
			alert("Oops! There was a problem submitting your form. Please try again or contact me directly via email.");
			console.error("Form submission error:", result);
		}
	} catch (error) {
		// Network error
		alert("Oops! There was a problem submitting your form. Please try again or contact me directly via email.");
		console.error("Network error:", error);
	} finally {
		// Re-enable button
		submitButton.disabled = false;
		submitButton.innerHTML = originalButtonText;
	}
});

// Add typing effect to hero subtitle (optional enhancement)
function typeWriter(element, text, speed = 100) {
	let i = 0;
	element.textContent = "";

	function type() {
		if (i < text.length) {
			element.textContent += text.charAt(i);
			i++;
			setTimeout(type, speed);
		}
	}

	type();
}

// Uncomment to enable typing effect
// window.addEventListener('load', () => {
//     const subtitle = document.querySelector('.hero-subtitle');
//     const text = subtitle.textContent;
//     typeWriter(subtitle, text, 100);
// });

// Skill items hover effect
document.querySelectorAll(".skill-item").forEach((item) => {
	item.addEventListener("mouseenter", function () {
		this.style.transform = "translateY(-5px) scale(1.05)";
	});

	item.addEventListener("mouseleave", function () {
		this.style.transform = "translateY(0) scale(1)";
	});
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
	let start = 0;
	const increment = target / (duration / 16);

	function updateCounter() {
		start += increment;
		if (start < target) {
			element.textContent = Math.floor(start) + "+";
			requestAnimationFrame(updateCounter);
		} else {
			element.textContent = target + "+";
		}
	}

	updateCounter();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const statNumbers = entry.target.querySelectorAll(".stat h3");
				statNumbers.forEach((stat, index) => {
					const text = stat.textContent;
					const number = parseInt(text.replace("+", ""));
					setTimeout(() => {
						animateCounter(stat, number);
					}, index * 200);
				});
				statsObserver.unobserve(entry.target);
			}
		});
	},
	{ threshold: 0.5 }
);

const aboutStats = document.querySelector(".about-stats");
if (aboutStats) {
	statsObserver.observe(aboutStats);
}

// Form validation
const formInputs = document.querySelectorAll(".form-group input, .form-group textarea");

formInputs.forEach((input) => {
	input.addEventListener("blur", function () {
		if (this.value.trim() === "") {
			this.style.borderColor = "#ef4444";
		} else {
			this.style.borderColor = "#6366f1";
		}
	});

	input.addEventListener("focus", function () {
		this.style.borderColor = "#6366f1";
	});
});

// Scroll to top button (optional enhancement)
function createScrollToTopButton() {
	const button = document.createElement("button");
	button.innerHTML = '<i class="fas fa-arrow-up"></i>';
	button.className = "scroll-to-top";
	button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--primary-color);
        color: white;
        border: none;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        z-index: 100;
        pointer-events: auto;
    `;

	document.body.appendChild(button);

	let scrollTopTicking = false;
	window.addEventListener(
		"scroll",
		() => {
			if (!scrollTopTicking) {
				window.requestAnimationFrame(() => {
					if (window.pageYOffset > 300) {
						button.style.display = "flex";
					} else {
						button.style.display = "none";
					}
					scrollTopTicking = false;
				});
				scrollTopTicking = true;
			}
		},
		{ passive: true }
	);

	button.addEventListener("click", () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	});

	button.addEventListener("mouseenter", () => {
		button.style.transform = "translateY(-5px)";
		button.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
	});

	button.addEventListener("mouseleave", () => {
		button.style.transform = "translateY(0)";
		button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
	});
}

createScrollToTopButton();

// Achievement Lightbox Modal
const achievementModal = document.getElementById("achievementModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalClose = document.querySelector(".modal-close");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");
const modalOverlay = document.querySelector(".modal-overlay");

let currentAchievementIndex = 0;
let achievementItems = [];

// Initialize achievement items array
function initAchievementModal() {
	achievementItems = Array.from(document.querySelectorAll(".achievement-item"));

	// Add click handlers to achievement items
	achievementItems.forEach((item, index) => {
		item.addEventListener("click", () => {
			openModal(index);
		});
	});
}

// Open modal with specific achievement
function openModal(index) {
	currentAchievementIndex = index;
	const item = achievementItems[index];

	const imgSrc = item.getAttribute("data-achievement-img");
	const title = item.getAttribute("data-achievement-title");
	const desc = item.getAttribute("data-achievement-desc");

	modalImage.src = imgSrc;
	modalImage.alt = title;
	modalTitle.textContent = title;
	modalDesc.textContent = desc;

	achievementModal.classList.add("active");
	achievementModal.setAttribute("aria-hidden", "false");
	document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Close modal
function closeModal() {
	achievementModal.classList.remove("active");
	achievementModal.setAttribute("aria-hidden", "true");
	document.body.style.overflow = ""; // Restore scrolling
}

// Navigate to previous achievement
function showPrevious() {
	currentAchievementIndex = currentAchievementIndex > 0 ? currentAchievementIndex - 1 : achievementItems.length - 1;
	const item = achievementItems[currentAchievementIndex];

	const imgSrc = item.getAttribute("data-achievement-img");
	const title = item.getAttribute("data-achievement-title");
	const desc = item.getAttribute("data-achievement-desc");

	modalImage.src = imgSrc;
	modalImage.alt = title;
	modalTitle.textContent = title;
	modalDesc.textContent = desc;
}

// Navigate to next achievement
function showNext() {
	currentAchievementIndex = currentAchievementIndex < achievementItems.length - 1 ? currentAchievementIndex + 1 : 0;
	const item = achievementItems[currentAchievementIndex];

	const imgSrc = item.getAttribute("data-achievement-img");
	const title = item.getAttribute("data-achievement-title");
	const desc = item.getAttribute("data-achievement-desc");

	modalImage.src = imgSrc;
	modalImage.alt = title;
	modalTitle.textContent = title;
	modalDesc.textContent = desc;
}

// Event listeners for modal
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
modalPrev.addEventListener("click", showPrevious);
modalNext.addEventListener("click", showNext);

// Keyboard navigation
document.addEventListener("keydown", (e) => {
	if (!achievementModal.classList.contains("active")) return;

	if (e.key === "Escape") {
		closeModal();
	} else if (e.key === "ArrowLeft") {
		showPrevious();
	} else if (e.key === "ArrowRight") {
		showNext();
	}
});

// Touch swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

modalImage.addEventListener(
	"touchstart",
	(e) => {
		touchStartX = e.changedTouches[0].screenX;
	},
	{ passive: true }
);

modalImage.addEventListener(
	"touchend",
	(e) => {
		touchEndX = e.changedTouches[0].screenX;
		handleSwipe();
	},
	{ passive: true }
);

function handleSwipe() {
	const swipeThreshold = 50;
	if (touchEndX < touchStartX - swipeThreshold) {
		// Swipe left - show next
		showNext();
	} else if (touchEndX > touchStartX + swipeThreshold) {
		// Swipe right - show previous
		showPrevious();
	}
}

// Initialize modal on page load
initAchievementModal();

console.log("Portfolio website loaded successfully!");
