if (typeof Futoast === "undefined") {
  const Futoast = {
    show: function (message, options = {}) {
      console.log("Futoast.show:", message, options);
      return Promise.resolve();
    },
    primary: function (message, options = {}) {
      return this.show(message, { ...options, type: "primary" });
    },
    secondary: function (message, options = {}) {
      return this.show(message, { ...options, type: "secondary" });
    },
    success: function (message, options = {}) {
      return this.show(message, { ...options, type: "success" });
    },
    error: function (message, options = {}) {
      return this.show(message, { ...options, type: "error" });
    },
    warning: function (message, options = {}) {
      return this.show(message, { ...options, type: "warning" });
    },
    info: function (message, options = {}) {
      return this.show(message, { ...options, type: "info" });
    },
    question: function (message, options = {}) {
      return this.show(message, { ...options, type: "question" });
    },
    loading: function (message, options = {}) {
      return this.show(message, { ...options, type: "loading", timeout: 0 });
    },
    clear: function () {
      console.log("Futoast.clear");
    },
    setIcons: function (icons) {
      console.log("Futoast.setIcons:", icons);
      return this;
    },
    applyTheme: function (themeConfig) {
      console.log("Futoast.applyTheme:", themeConfig);
      return this;
    },
    setThemeMode: function (mode) {
      console.log("Futoast.setThemeMode:", mode);
      document.documentElement.setAttribute("data-theme", mode);
      return this;
    },
    setFont: function (fontFamily, fontSize = "") {
      console.log("Futoast.setFont:", fontFamily, fontSize);
      return this;
    },
  };

  window.Futoast = Futoast;
}

// Theme toggle
document.getElementById("themeToggle").addEventListener("click", function () {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  Futoast.setThemeMode(newTheme);

  // Update icon
  const icon = this.querySelector("i");
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
});

// Mobile menu toggle
document.getElementById("mobileMenuBtn").addEventListener("click", function () {
  document.querySelector(".nav").classList.toggle("active");
});

// Tab functionality
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", function () {
    const tabId = this.getAttribute("data-tab");
    const parent = this.closest(".tabs");

    // Update active tab
    parent
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    // Update active content
    parent.parentElement.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });

      // Close mobile menu if open
      document.querySelector(".nav").classList.remove("active");
    }
  });
});

// Copy code functionality
function copyCode(id) {
  const codeElement = document.getElementById(id);
  const textToCopy = codeElement.innerText;

  // Copy to clipboard using temporary textarea
  const tempTextarea = document.createElement("textarea");
  tempTextarea.value = textToCopy;
  document.body.appendChild(tempTextarea);
  tempTextarea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextarea);

  // Find the .code-example container (common wrapper)
  const wrapper = codeElement.closest(".code-example");

  if (wrapper) {
    const btn = wrapper.querySelector(".code-example-btn");
    if (btn) {
      const originalText = btn.textContent;
      btn.textContent = "Copied!";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2000);
    }
  }
}

// Demo functions
function demoBasic() {
  Futoast.show("Hello, World!");
}

function demoSuccess() {
  Futoast.success("Operation completed successfully!");
}

function demoError() {
  Futoast.error("Something went wrong!", {
    timeout: 8000,
    position: "top-center",
  });
}

function demoPosition(position) {
  Futoast.show(`Position: ${position}`, { position });
}

function demoType(type) {
  Futoast[type](`This is a ${type} notification`);
}

function demoAnimation(animationIn, animationOut) {
  Futoast.show(`Animation: ${animationIn}`, {
    animationIn,
    animationOut,
  });
}

function demoIcon(type) {
  const options = { type: "success" };

  switch (type) {
    case "none":
      options.icon = false;
      break;
    case "text":
      options.icon = "★";
      break;
    case "emoji":
      options.icon = "🚀";
      break;
    case "html":
      options.icon = '<i class="fas fa-check-circle"></i>';
      break;
    default:
    // Use default icon
  }

  Futoast.show(`Icon: ${type}`, options);
}

function demoTheme(theme) {
  switch (theme) {
    case "purple":
      Futoast.applyTheme({
        primary: "#8a2be2",
        success: "#28a745",
        error: "#dc3545",
        warning: "#fd7e14",
        info: "#17a2b8",
      });
      Futoast.primary("Purple theme applied");
      break;
    case "dark":
      Futoast.applyTheme({
        bg: "#212529",
        text: "#f8f9fa",
        border: "#495057",
      });
      Futoast.primary("Dark colors applied");
      break;
    case "light":
      Futoast.applyTheme({
        bg: "#ffffff",
        text: "#212529",
        border: "#dee2e6",
      });
      Futoast.primary("Light colors applied");
      break;
    default:
      Futoast.applyTheme({
        primary: "#4a6bff",
        secondary: "#6c757d",
        success: "#28a745",
        error: "#dc3545",
        warning: "#ffc107",
        info: "#17a2b8",
        bg: "#ffffff",
        text: "#212529",
        border: "#dee2e6",
      });
      Futoast.primary("Default theme restored");
  }
}

function demoFont(font) {
  switch (font) {
    case "comic":
      Futoast.setFont('"Comic Sans MS", cursive', "16px");
      Futoast.primary("Comic Sans font applied");
      break;
    case "mono":
      Futoast.setFont('"Courier New", monospace', "14px");
      Futoast.primary("Monospace font applied");
      break;
    default:
      Futoast.setFont("", "");
      Futoast.primary("Default font restored");
  }
}

function demoProgress(type) {
  const options = {
    type: "info",
    progressBar: true,
    timeout: 5000,
  };

  switch (type) {
    case "custom":
      options.css = "--futoast-progress: rgba(255,255,255,0.5);";
      break;
    case "none":
      options.progressBar = false;
      break;
    case "pause":
      options.pauseOnHover = true;
      break;
    default:
    // Use defaults
  }

  Futoast.show(`Progress: ${type}`, options);
}

function demoButtons(type) {
  const options = {
    type: "info",
    timeout: 0,
  };

  switch (type) {
    case "single":
      options.buttons = [
        {
          text: "OK",
          action: () => {
            Futoast.success("You clicked OK!");
          },
        },
      ];
      break;
    case "multiple":
      options.buttons = [
        {
          text: "Accept",
          class: "success",
          action: () => {
            Futoast.success("Accepted!");
          },
        },
        {
          text: "Reject",
          class: "danger",
          action: () => {
            Futoast.error("Rejected!");
          },
          closeOnClick: false,
        },
      ];
      break;
    case "custom":
      options.buttons = [
        {
          text: "Custom",
          style:
            "background: linear-gradient(to right, #ff8a00, #da1b60); color: white;",
          action: () => {
            Futoast.success("Custom action!");
          },
        },
      ];
      break;
  }

  Futoast.show(`Buttons: ${type}`, options);
}

function demoDrag(type) {
  const options = {
    type: "info",
    draggable: true,
  };

  if (type === "cursor") {
    options.css = "cursor: move;";
  }

  Futoast.show(`Drag: ${type}`, options);
}

function demoQueue(type) {
  if (type === "queued") {
    Futoast.show("First message", { queue: true });
    Futoast.show("Second message", { queue: true });
    Futoast.show("Third message", { queue: true });
  } else {
    Futoast.show("First message", { queue: false });
    Futoast.show("Second message", { queue: false });
    Futoast.show("Third message", { queue: false });
  }
}

function demoOverlay(type) {
  const options = {
    type: "info",
    overlay: true,
  };

  switch (type) {
    case "close":
      options.overlayClose = true;
      break;
    case "custom":
      options.overlayColor = "rgba(255,0,0,0.3)";
      break;
  }

  Futoast.show(`Overlay: ${type}`, options);
}

// topscroll btn 
const button = document.querySelector('.topbtn');

const displayButton = () => {
  window.addEventListener('scroll', () => {
    console.log(window.scrollY);
  
    if (window.scrollY > 100) {
      button.style.display = "block";
    } else {
      button.style.display = "none";
    }
  });
};

const scrollToTop = () => {
  button.addEventListener("click", () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    }); 
    console.log(event);
  });
};

displayButton();
scrollToTop();

