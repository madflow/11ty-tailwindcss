class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Initialize theme state
    this.darkMode = false;

    // Check system/saved preference on initialization
    this.checkPreference();
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
    this.applyTheme();
    this.updateVisibleIcon();
  }

  checkPreference() {
    // Check for saved preference
    if (localStorage.getItem("theme") === "dark") {
      this.darkMode = true;
    }
    // If no saved preference, check system preference
    else if (
      !localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      this.darkMode = true;
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    this.updateVisibleIcon();
  }

  applyTheme() {
    // Apply theme to document
    if (this.darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  updateVisibleIcon() {
    const sunSlot = this.shadowRoot.querySelector('slot[name="sun-icon"]');
    const moonSlot = this.shadowRoot.querySelector('slot[name="moon-icon"]');

    if (this.darkMode) {
      // In dark mode, show the sun icon (icon to switch to light)
      sunSlot.classList.remove("hidden");
      moonSlot.classList.add("hidden");
    } else {
      // In light mode, show the moon icon (icon to switch to dark)
      sunSlot.classList.add("hidden");
      moonSlot.classList.remove("hidden");
    }
  }

  setupListeners() {
    const toggleButton = this.shadowRoot.querySelector(".theme-toggle-button");
    toggleButton.addEventListener("click", () => this.toggleTheme());

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.darkMode = e.matches;
          this.applyTheme();
          this.updateVisibleIcon();
        }
      });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }
        
        .theme-toggle-button {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
          transition: background-color 0.2s ease;
        }
        
        .theme-toggle-button:hover {
          background-color: rgba(163, 163, 163, 0.1);
        }
        
        .theme-toggle-button:focus {
          outline: 2px solid #737373;
          outline-offset: 2px;
        }
        
        .hidden {
          display: none !important;
        }
        
        ::slotted(*) {
          width: 24px;
          height: 24px;
          transition: transform 0.3s ease;
        }
        
        .theme-toggle-button:active ::slotted(*) {
          transform: scale(0.9);
        }
      </style>
      
      <button class="theme-toggle-button" aria-label="${this.darkMode ? "Switch to light mode" : "Switch to dark mode"}">
        <slot name="sun-icon" class="${this.darkMode ? "" : "hidden"}"></slot>
        <slot name="moon-icon" class="${this.darkMode ? "hidden" : ""}"></slot>
      </button>
    `;
  }
}

// Define the custom element
customElements.define("theme-toggle", ThemeToggle);
