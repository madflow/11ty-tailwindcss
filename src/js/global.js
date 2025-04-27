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

    // Update UI
    this.updateToggleState();
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

  updateToggleState() {
    const toggle = this.shadowRoot.querySelector(".toggle-slider");
    const sunIcon = this.shadowRoot.querySelector(".sun-icon");
    const moonIcon = this.shadowRoot.querySelector(".moon-icon");

    if (this.darkMode) {
      toggle.classList.add("dark");
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      toggle.classList.remove("dark");
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
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
          this.updateToggleState();
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
          padding: 0;
          position: relative;
          width: 60px;
          height: 28px;
        }
        
        .theme-toggle-button:focus {
          outline: 2px solid #3b82f6;
          border-radius: 999px;
        }
        
        .toggle-slider {
          background-color: #e5e7eb;
          border-radius: 999px;
          position: relative;
          height: 100%;
          width: 100%;
          transition: background-color 0.3s ease;
        }
        
        .toggle-slider.dark {
          background-color: #4b5563;
        }
        
        .toggle-slider::after {
          content: "";
          position: absolute;
          left: 4px;
          top: 4px;
          height: 20px;
          width: 20px;
          background-color: white;
          border-radius: 50%;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .toggle-slider.dark::after {
          transform: translateX(32px);
        }
        
        .icon {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          height: 16px;
          width: 16px;
          transition: opacity 0.3s ease;
          z-index: 1;
        }
        
        .sun-icon {
          color: #f59e0b;
          left: 6px;
        }
        
        .moon-icon {
          color: #4b5563;
          right: 6px;
        }
        
        .hidden {
          opacity: 0;
        }
      </style>
      
      <button class="theme-toggle-button" aria-label="Toggle dark mode">
        <span class="toggle-slider ${this.darkMode ? "dark" : ""}"></span>
        
        <!-- Sun Icon -->
        <svg class="icon sun-icon ${this.darkMode ? "hidden" : ""}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
        
        <!-- Moon Icon -->
        <svg class="icon moon-icon ${this.darkMode ? "" : "hidden"}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" fill="currentColor"/>
        </svg>
      </button>
    `;
  }
}

// Define the custom element
customElements.define("theme-toggle", ThemeToggle);
