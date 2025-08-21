/*!
 * Futoast.js - A lightweight, customizable toast notification library
 * Author: Rajkumar Nimod
 * Version: 1.0.0
 * License: MIT
 * Framework Support: React, Vue, Angular, Django, and plain JavaScript
 */

type ToastPosition = 
  | 'top-left' | 'top-right' | 'top-center'
  | 'bottom-left' | 'bottom-right' | 'bottom-center';

type ToastType = 
  | 'primary' | 'secondary' | 'success' | 'error' 
  | 'warning' | 'info' | 'question' | 'loading';

type ToastAnimation = 
  | 'fadeIn' | 'fadeOut' | 'zoomIn' | 'slideInRight' 
  | 'slideInLeft' | 'bounce' | 'flip' | 'pulse' | 'spin';

type MobilePosition = 'top' | 'bottom' | 'same';

interface ToastButton {
  text: string;
  action: () => void;
  style?: string;
  class?: string;
  closeOnClick?: boolean;
}

interface ToastOptions {
  position?: ToastPosition;
  timeout?: number;
  type?: ToastType;
  theme?: 'light' | 'dark';
  icon?: string | null;
  closeButton?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  progressBar?: boolean;
  sound?: boolean;
  html?: boolean;
  animationIn?: ToastAnimation;
  animationOut?: ToastAnimation;
  onClick?: ((event: MouseEvent) => void) | null;
  onClose?: (() => void) | null;
  onShow?: ((toastEl: HTMLElement) => void) | null;
  onTimeout?: (() => void) | null;
  rtl?: boolean;
  css?: string;
  queue?: boolean;
  zIndex?: number;
  overlay?: boolean;
  overlayClose?: boolean;
  overlayColor?: string;
  customIcon?: string | null;
  customSound?: string | null;
  buttons?: ToastButton[] | null;
  focus?: boolean;
  fontFamily?: string;
  fontSize?: string;
  maxWidth?: string;
  minWidth?: string;
  mobilePosition?: MobilePosition;
  mobileMaxWidth?: string;
  mobileMinWidth?: string;
  ariaLive?: 'polite' | 'assertive' | 'off';
}

interface ToastIcons {
  success: string;
  error: string;
  warning: string;
  info: string;
  question: string;
  loading: string;
  primary: string;
  secondary: string;
}

interface ReactFutoast {
  show: (message: string, options?: ToastOptions) => Promise<void>;
  primary: (message: string, options?: ToastOptions) => Promise<void>;
  secondary: (message: string, options?: ToastOptions) => Promise<void>;
  success: (message: string, options?: ToastOptions) => Promise<void>;
  error: (message: string, options?: ToastOptions) => Promise<void>;
  warning: (message: string, options?: ToastOptions) => Promise<void>;
  info: (message: string, options?: ToastOptions) => Promise<void>;
  question: (message: string, options?: ToastOptions) => Promise<void>;
  loading: (message: string, options?: ToastOptions) => Promise<void>;
  clear: () => void;
  applyTheme: (themeConfig: string | Record<string, string>) => ReactFutoast;
  setIcons: (icons: Partial<ToastIcons>) => ReactFutoast;
  setThemeMode: (mode: 'light' | 'dark') => ReactFutoast;
  setFont: (fontFamily: string, fontSize?: string) => ReactFutoast;
}

interface VueFutoast {
  install: (Vue: any, options?: { inject?: boolean }) => void;
}

interface AngularFutoast {
  moduleName: string;
}

interface DjangoFutoast {
  showToast: (message: string, options?: ToastOptions) => string;
  getStatic: () => string;
}

class Futoast {
  private static DEFAULTS: ToastOptions = {
    position: 'top-right',
    timeout: 5000,
    type: 'primary',
    theme: 'light',
    icon: null,
    closeButton: true,
    pauseOnHover: true,
    draggable: false,
    progressBar: true,
    sound: false,
    html: false,
    animationIn: 'fadeIn',
    animationOut: 'fadeOut',
    onClick: null,
    onClose: null,
    onShow: null,
    onTimeout: null,
    rtl: false,
    css: '',
    queue: true,
    zIndex: 999999,
    overlay: false,
    overlayClose: false,
    overlayColor: 'rgba(0,0,0,0.5)',
    customIcon: null,
    customSound: null,
    buttons: null,
    focus: true,
    fontFamily: '',
    fontSize: '',
    maxWidth: '350px',
    minWidth: '300px',
    mobilePosition: 'top',
    mobileMaxWidth: '90%',
    mobileMinWidth: '80%',
    ariaLive: 'assertive'
  };

  private static DEFAULT_ICONS: ToastIcons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    question: '?',
    loading: '⌛',
    primary: '•',
    secondary: '○'
  };

  private toastQueue: Array<{ message: string; options: ToastOptions; resolve: () => void }> = [];
  private isProcessingQueue: boolean = false;
  private overlayEl: HTMLElement | null = null;
  private currentThemeMode: 'light' | 'dark' = 'light';
  private isMobile: boolean = false;

  constructor() {
    this.checkMobile();
    this.initContainer();
    this.updateTheme();
    this.setupGlobalStyles();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile(): void {
    this.isMobile = window.innerWidth <= 576;
  }

  private initContainer(): void {
    if (!document.querySelector('.futoast-container')) {
      const container = document.createElement('div');
      container.className = 'futoast-container top-right';
      document.body.appendChild(container);
    }
  }

  private setupGlobalStyles(): void {
    if (!document.querySelector('#futoast-styles')) {
      const style = document.createElement('style');
      style.id = 'futoast-styles';
      style.textContent = this.getBaseStyles();
      document.head.appendChild(style);
    }
  }

  private updateTheme(): void {
    const container = document.querySelector('.futoast-container');
    if (container) {
      container.setAttribute('data-futoast-theme', this.currentThemeMode);
    }
  }

  public setThemeMode(mode: 'light' | 'dark'): this {
    if (mode === 'light' || mode === 'dark') {
      this.currentThemeMode = mode;
      this.updateTheme();
    }
    return this;
  }

  private createOverlay(color: string, zIndex: number, closeOnClick: boolean): void {
    if (this.overlayEl) return;
    
    this.overlayEl = document.createElement('div');
    this.overlayEl.className = 'futoast-overlay';
    this.overlayEl.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${color};
      z-index: ${zIndex - 1};
      opacity: 0;
      transition: opacity 0.3s;
    `;
    
    if (closeOnClick) {
      this.overlayEl.style.cursor = 'pointer';
      this.overlayEl.addEventListener('click', () => this.clear());
    }
    
    document.body.appendChild(this.overlayEl);
    
    setTimeout(() => {
      if (this.overlayEl) {
        this.overlayEl.style.opacity = '1';
      }
    }, 10);
  }

  private removeOverlay(): void {
    if (!this.overlayEl) return;
    
    this.overlayEl.style.opacity = '0';
    setTimeout(() => {
      this.overlayEl?.remove();
      this.overlayEl = null;
    }, 300);
  }

  private createToast(message: string, options: ToastOptions): HTMLElement {
    const toastEl = document.createElement('div');
    let toastClasses = `futoast ${options.type} ${options.rtl ? 'rtl' : ''}`;
    
    if (options.css && !options.css.includes(':')) {
      toastClasses += ` ${options.css}`;
    }
    
    toastEl.className = toastClasses;
    
    if (options.css && options.css.includes(':')) {
      toastEl.style.cssText = options.css;
    }
    
    if (options.fontFamily) {
      toastEl.style.fontFamily = options.fontFamily;
    }
    if (options.fontSize) {
      toastEl.style.fontSize = options.fontSize;
    }

    if (this.isMobile) {
      toastEl.style.maxWidth = options.mobileMaxWidth || '90%';
      toastEl.style.minWidth = options.mobileMinWidth || '80%';
    } else {
      if (options.maxWidth) toastEl.style.maxWidth = options.maxWidth;
      if (options.minWidth) toastEl.style.minWidth = options.minWidth;
    }

    toastEl.dataset.animationIn = options.animationIn || 'fadeIn';
    toastEl.dataset.animationOut = options.animationOut || 'fadeOut';

    let iconHtml = options.customIcon || options.icon || Futoast.DEFAULT_ICONS[options.type || 'primary'] || '';
    if (typeof iconHtml === 'string' && (iconHtml.startsWith('http') || iconHtml.startsWith('/'))) {
      iconHtml = `<img src="${iconHtml}" alt="toast icon" class="futoast-icon-img">`;
    }
    const iconEl = iconHtml ? `<div class="futoast-icon">${iconHtml}</div>` : '';

    const closeButton = options.closeButton ? 
      `<button class="futoast-close" aria-label="Close" tabindex="0">&times;</button>` : '';

    let buttonsHtml = '';
    if (options.buttons && Array.isArray(options.buttons)) {
      buttonsHtml = '<div class="futoast-buttons">';
      options.buttons.forEach(btn => {
        const btnStyle = btn.style || '';
        const btnClass = btn.class || '';
        buttonsHtml += `<button class="${btnClass}" style="${btnStyle}" tabindex="0">${btn.text}</button>`;
      });
      buttonsHtml += '</div>';
    }

    const content = options.html ? message : document.createTextNode(message).textContent;

    toastEl.innerHTML = `
      <div class="futoast-content">
        ${iconEl}
        <div class="futoast-message">${content}</div>
      </div>
      ${closeButton}
      ${buttonsHtml}
      ${options.progressBar ? '<div class="futoast-progress"></div>' : ''}
    `;

    if (options.draggable) {
      this.makeDraggable(toastEl);
    }

    return toastEl;
  }

  private makeDraggable(toastEl: HTMLElement): void {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    
    const dragMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      isDragging = true;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
      toastEl.style.transition = 'none';
      toastEl.style.cursor = 'grabbing';
    };

    const elementDrag = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      toastEl.style.top = (toastEl.offsetTop - pos2) + "px";
      toastEl.style.left = (toastEl.offsetLeft - pos1) + "px";
    };

    const closeDragElement = () => {
      document.onmouseup = null;
      document.onmousemove = null;
      isDragging = false;
      toastEl.style.transition = '';
      toastEl.style.cursor = 'grab';
    };

    toastEl.onmousedown = dragMouseDown;
    toastEl.style.cursor = 'grab';
  }

  private showToast(toastEl: HTMLElement, animationIn: string, zIndex: number): void {
    const container = document.querySelector('.futoast-container');
    if (!container) return;
    
    container.appendChild(toastEl);
    toastEl.style.zIndex = zIndex.toString();
    void toastEl.offsetWidth; // Trigger reflow
    toastEl.classList.add(`futoast-${animationIn}`);
    
    setTimeout(() => {
      toastEl.classList.remove(`futoast-${animationIn}`);
    }, 300);
  }

  private hideToast(toastEl: HTMLElement, animationOut: string, callback?: () => void): void {
    toastEl.classList.add(`futoast-${animationOut}`);
    
    setTimeout(() => {
      toastEl.style.opacity = '0';
      setTimeout(() => {
        toastEl.remove();
        if (callback) callback();
      }, 300);
    }, 100);
  }

  private setupProgressBar(toastEl: HTMLElement, timeout: number, onTimeout?: () => void): void {
    if (!timeout || timeout <= 0) return;

    const progressBar = toastEl.querySelector('.futoast-progress') as HTMLElement;
    if (!progressBar) return;

    let startTime = Date.now();
    let paused = false;
    let pauseStart = 0;
    let animationFrameId: number;

    const updateProgress = () => {
      if (paused) return;

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / timeout, 1);
      progressBar.style.transform = `scaleX(${1 - progress})`;

      if (progress >= 1) {
        cancelAnimationFrame(animationFrameId);
        if (onTimeout) onTimeout();
        this.hideToast(toastEl, toastEl.dataset.animationOut || 'fadeOut');
      } else {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    if (toastEl.dataset.pauseOnHover === 'true') {
      toastEl.addEventListener('mouseenter', () => {
        paused = true;
        pauseStart = Date.now();
        cancelAnimationFrame(animationFrameId);
      });

      toastEl.addEventListener('mouseleave', () => {
        paused = false;
        startTime += Date.now() - pauseStart;
        animationFrameId = requestAnimationFrame(updateProgress);
      });
    }

    animationFrameId = requestAnimationFrame(updateProgress);
  }

  private processQueue(): void {
    if (this.isProcessingQueue || this.toastQueue.length === 0) return;
    
    this.isProcessingQueue = true;
    const { message, options, resolve } = this.toastQueue.shift()!;
    
    this.show(message, options).then(() => {
      this.isProcessingQueue = false;
      resolve();
      this.processQueue();
    });
  }

  private getAdjustedPosition(position: ToastPosition, mobilePosition: MobilePosition): ToastPosition {
    if (!this.isMobile || mobilePosition === 'same') return position;
    
    if (mobilePosition === 'top') {
      if (position.includes('bottom')) {
        return position.replace('bottom', 'top') as ToastPosition;
      }
      return position;
    } else if (mobilePosition === 'bottom') {
      if (position.includes('top')) {
        return position.replace('top', 'bottom') as ToastPosition;
      }
      return position;
    }
    
    return position;
  }

  public show(message: string, options: ToastOptions = {}): Promise<void> {
    return new Promise((resolve) => {
      const mergedOptions: ToastOptions = { ...Futoast.DEFAULTS, ...options };
      const adjustedPosition = this.getAdjustedPosition(
        mergedOptions.position || 'top-right', 
        mergedOptions.mobilePosition || 'top'
      );
      
      this.setContainerPosition(adjustedPosition, mergedOptions.zIndex || 999999);
      
      if (mergedOptions.overlay) {
        this.createOverlay(
          mergedOptions.overlayColor || 'rgba(0,0,0,0.5)',
          mergedOptions.zIndex || 999999,
          mergedOptions.overlayClose || false
        );
      }
      
      if (mergedOptions.queue && this.toastQueue.length > 0) {
        this.toastQueue.push({ message, options: mergedOptions, resolve });
        return;
      }
      
      const toastEl = this.createToast(message, mergedOptions);
      toastEl.dataset.pauseOnHover = mergedOptions.pauseOnHover?.toString() || 'true';
      
      if (mergedOptions.sound || mergedOptions.customSound) {
        this.playSound(mergedOptions.type || 'primary', mergedOptions.customSound || undefined);
      }
      
      this.showToast(toastEl, mergedOptions.animationIn || 'fadeIn', mergedOptions.zIndex || 999999);
      
      if (mergedOptions.onShow) {
        mergedOptions.onShow(toastEl);
      }
      
      if (mergedOptions.focus) {
        setTimeout(() => toastEl.focus(), 50);
      }
      
      if (mergedOptions.buttons) {
        mergedOptions.buttons.forEach((btn, index) => {
          const buttonEl = toastEl.querySelectorAll('.futoast-buttons button')[index] as HTMLElement;
          if (buttonEl && btn.action) {
            buttonEl.addEventListener('click', (e) => {
              e.stopPropagation();
              btn.action();
              if (btn.closeOnClick !== false) {
                this.hideToast(toastEl, mergedOptions.animationOut || 'fadeOut');
              }
            });
          }
        });
      }
      
      if (mergedOptions.timeout && mergedOptions.timeout > 0) {
        this.setupProgressBar(
          toastEl, 
          mergedOptions.timeout, 
          () => {
            if (mergedOptions.onTimeout) mergedOptions.onTimeout();
            if (mergedOptions.overlay) this.removeOverlay();
            resolve();
          }
        );
      }
      
      if (mergedOptions.closeButton) {
        const closeButton = toastEl.querySelector('.futoast-close') as HTMLElement;
        closeButton.addEventListener('click', () => {
          this.hideToast(toastEl, mergedOptions.animationOut || 'fadeOut', () => {
            if (mergedOptions.onClose) mergedOptions.onClose();
            if (mergedOptions.overlay) this.removeOverlay();
            resolve();
          });
        });
      }
      
      if (mergedOptions.onClick) {
        toastEl.addEventListener('click', (e) => {
          if (e.target !== toastEl.querySelector('.futoast-close') && 
              !(e.target as HTMLElement).closest('.futoast-buttons')) {
            mergedOptions.onClick!(e as MouseEvent);
          }
        });
      }
      
      toastEl.setAttribute('role', 'alert');
      toastEl.setAttribute('aria-live', mergedOptions.ariaLive || 'assertive');
      toastEl.tabIndex = 0;
      
      toastEl.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mergedOptions.closeButton) {
          const closeButton = toastEl.querySelector('.futoast-close') as HTMLElement;
          if (closeButton) closeButton.click();
        }
      });
      
      if (mergedOptions.timeout && mergedOptions.timeout <= 0) {
        resolve();
      }
    });
  }

  // Shortcut methods
  public primary(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'primary' }); 
  }
  
  public secondary(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'secondary' }); 
  }
  
  public success(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'success' }); 
  }
  
  public error(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'error' }); 
  }
  
  public warning(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'warning' }); 
  }
  
  public info(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'info' }); 
  }
  
  public question(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'question' }); 
  }
  
  public loading(message: string, options: ToastOptions = {}): Promise<void> { 
    return this.show(message, { ...options, type: 'loading', timeout: 0 }); 
  }

  public clear(): void {
    const container = document.querySelector('.futoast-container');
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    this.toastQueue = [];
    this.isProcessingQueue = false;
    this.removeOverlay();
  }

  private playSound(type: ToastType, customSound?: string): void {
    if (!customSound) return;
    
    try {
      const audio = new Audio(customSound);
      audio.play().catch(e => console.warn('Sound playback failed:', e));
    } catch (e) {
      console.warn('Sound initialization failed:', e);
    }
  }

  private setContainerPosition(position: ToastPosition, zIndex: number): void {
    const container = document.querySelector('.futoast-container');
    if (container) {
      container.className = `futoast-container ${position}`;
      container.style.zIndex = zIndex.toString();
    }
  }

  public applyTheme(themeConfig: string | Record<string, string>): this {
    if (typeof themeConfig === 'string') {
      document.documentElement.style.setProperty('--futoast-primary', themeConfig);
    } else if (typeof themeConfig === 'object') {
      Object.keys(themeConfig).forEach(key => {
        document.documentElement.style.setProperty(`--futoast-${key}`, themeConfig[key]);
      });
    }
    return this;
  }

  public setIcons(icons: Partial<ToastIcons>): this {
    Object.keys(icons).forEach(key => {
      (Futoast.DEFAULT_ICONS as any)[key] = (icons as any)[key];
    });
    return this;
  }

  public setFont(fontFamily: string, fontSize: string = ''): this {
    const container = document.querySelector('.futoast-container');
    if (container) {
      if (fontFamily) container.style.fontFamily = fontFamily;
      if (fontSize) container.style.fontSize = fontSize;
    }
    return this;
  }

  private getBaseStyles(): string {
    return `
      :root {
        /* Light Theme */
        --futoast-bg: #ffffff;
        --futoast-text: #212529;
        --futoast-border: rgba(0, 0, 0, 0.1);
        --futoast-progress: rgba(0, 0, 0, 0.2);
        --futoast-close-hover: rgba(0, 0, 0, 0.1);
        --futoast-font: system-ui, -apple-system, sans-serif;
        --futoast-font-size: 14px;
        --futoast-padding: 12px 20px;
        --futoast-border-radius: 8px;
        --futoast-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        
        /* Alert Type Colors */
        --futoast-primary: #78b4f4;
        --futoast-secondary: #6c757d;
        --futoast-success: #3ec55e;
        --futoast-error: #dc3545;
        --futoast-warning: #ffc107;
        --futoast-warning-text: #212529;
        --futoast-info: #17a2b8;
        --futoast-question: #6610f2;
        --futoast-loading: #343a40;
      }

      [data-futoast-theme="dark"] {
        /* Dark Theme */
        --futoast-bg: #212529;
        --futoast-text: #f8f9fa;
        --futoast-border: rgba(255, 255, 255, 0.1);
        --futoast-progress: rgba(255, 255, 255, 0.2);
        --futoast-close-hover: rgba(255, 255, 255, 0.1);
        
        /* Alert Type Colors (Dark) */
        --futoast-primary: #0d6efd;
        --futoast-secondary: #5c636a;
        --futoast-success: #198754;
        --futoast-error: #dc3545;
        --futoast-warning: #ffca2c;
        --futoast-warning-text: #000000;
        --futoast-info: #0dcaf0;
        --futoast-question: #6f42c1;
        --futoast-loading: #495057;
      }

      /* Base Container */
      .futoast-container {
        position: fixed;
        z-index: 999999;
        box-sizing: border-box;
        pointer-events: none;
        font-family: var(--futoast-font);
      }

      /* Toast Box */
      .futoast {
        position: relative;
        min-height: 50px;
        margin-bottom: 1rem;
        padding: var(--futoast-padding);
        border-radius: var(--futoast-border-radius);
        color: var(--futoast-text);
        background-color: var(--futoast-bg);
        border: 1px solid var(--futoast-border);
        box-shadow: var(--futoast-box-shadow);
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        pointer-events: auto;
        transition: all 0.3s ease;
        font-size: var(--futoast-font-size);
        line-height: 1.5;
      }

      /* Toast Types */
      .futoast.primary { 
        background-color: var(--futoast-primary); 
        color: white; 
        --futoast-progress: rgba(255,255,255,0.3);
      }
      .futoast.secondary { 
        background-color: var(--futoast-secondary); 
        color: white;
        --futoast-progress: rgba(255,255,255,0.3);
      }
      .futoast.success { 
        background-color: var(--futoast-success); 
        color: white;
        --futoast-progress: rgba(255,255,255,0.3);
      }
      .futoast.error { 
        background-color: var(--futoast-error); 
        color: white;
        --futoast-progress: rgba(255,255,255,0.3);
      }
      .futoast.warning { 
        background-color: var(--futoast-warning); 
        color: var(--futoast-warning-text);
        --futoast-progress: rgba(0,0,0,0.2);
      }
      .futoast.info { 
        background-color: var(--futoast-info); 
        color: white;
        --futoast-progress: rgba(255,255,255,0.3);
      }
      .futoast.question { 
        background-color: var(--futoast-question); 
        color: white;
        --futoast-progress: rgba(255,255,255,0.3);
      }
      .futoast.loading { 
        background-color: var(--futoast-loading); 
        color: white;
        --futoast-progress: rgba(255,255,255,0.3);
      }

      /* Content Area */
      .futoast-content {
        display: flex;
        align-items: center;
        flex: 1;
        width: 100%;
        gap: 12px;
      }

      /* Icons */
      .futoast-icon {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
      }
      .futoast-icon-img {
        max-width: 100%;
        max-height: 100%;
        display: block;
      }

      /* Message Text */
      .futoast-message {
        flex: 1;
        word-break: break-word;
        padding: 2px 0;
      }

      /* Close Button */
      .futoast-close {
        background: transparent;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 18px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: all 0.2s;
        border-radius: 50%;
        margin-left: auto;
        flex-shrink: 0;
        padding: 0;
      }
      .futoast-close:hover {
        opacity: 1;
        background-color: var(--futoast-close-hover);
      }

      /* Progress Bar */
      .futoast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background-color: var(--futoast-progress);
        width: 100%;
        transform-origin: left;
        border-radius: 0 0 var(--futoast-border-radius) var(--futoast-border-radius);
      }

      /* Buttons Container */
      .futoast-buttons {
        display: flex;
        gap: 8px;
        margin-top: 10px;
        width: 100%;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
      .futoast-buttons button {
        padding: 6px 12px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-size: 13px;
        transition: all 0.2s;
        background-color: rgba(255,255,255,0.2);
        color: inherit;
      }
      .futoast-buttons button:hover {
        opacity: 0.9;
      }

      /* Positioning Classes */
      .futoast-container.top-left {
        top: 1rem;
        left: 1rem;
      }
      .futoast-container.top-right {
        top: 1rem;
        right: 1rem;
      }
      .futoast-container.bottom-left {
        bottom: 1rem;
        left: 1rem;
      }
      .futoast-container.bottom-right {
        bottom: 1rem;
        right: 1rem;
      }
      .futoast-container.top-center {
        top: 1rem;
        left: 50%;
        transform: translateX(-50%);
      }
      .futoast-container.bottom-center {
        bottom: 1rem;
        left: 50%;
        transform: translateX(-50%);
      }

      /* Animations */
      @keyframes futoast-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes futoast-fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      @keyframes futoast-zoomIn {
        from { opacity: 0; transform: scale(0.5); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes futoast-slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes futoast-slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes futoast-bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-30px); }
        60% { transform: translateY(-15px); }
      }
      @keyframes futoast-flip {
        from { transform: perspective(400px) rotate3d(0,1,0,90deg); opacity: 0; }
        to { transform: perspective(400px) rotate3d(0,1,0,0); opacity: 1; }
      }
      @keyframes futoast-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      @keyframes futoast-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      /* Animation Classes */
      .futoast-fadeIn { animation: futoast-fadeIn 0.3s; }
      .futoast-fadeOut { animation: futoast-fadeOut 0.3s; }
      .futoast-zoomIn { animation: futoast-zoomIn 0.3s; }
      .futoast-slideInRight { animation: futoast-slideInRight 0.3s; }
      .futoast-slideInLeft { animation: futoast-slideInLeft 0.3s; }
      .futoast-bounce { animation: futoast-bounce 0.6s; }
      .futoast-flip { animation: futoast-flip 0.4s; }
      .futoast-pulse { animation: futoast-pulse 0.6s infinite; }
      .futoast-spinner { animation: futoast-spin 1s linear infinite; }

      /* RTL Support */
      .futoast-container.rtl .futoast {
        direction: rtl;
      }
      .futoast-container.rtl .futoast-icon {
        margin-right: 0;
        margin-left: 15px;
      }
      .futoast-container.rtl .futoast-close {
        margin-left: 0;
        margin-right: 15px;
      }

      /* Draggable Toasts */
      .futoast.draggable {
        cursor: grab;
        user-select: none;
      }
      .futoast.draggable:active {
        cursor: grabbing;
      }

      /* Mobile Responsiveness */
      @media (max-width: 576px) {
        .futoast-container {
          width: 100%;
          padding: 0 10px;
        }
        
        .futoast {
          max-width: var(--futoast-mobile-max-width, 90%) !important;
          min-width: var(--futoast-mobile-min-width, 80%) !important;
          font-size: calc(var(--futoast-font-size) + 2px);
          padding: 14px 16px;
        }
        
        .futoast-container.top-center, 
        .futoast-container.bottom-center,
        .futoast-container.top-left,
        .futoast-container.top-right,
        .futoast-container.bottom-left,
        .futoast-container.bottom-right { 
          width: 100%; 
          left: 0;
          right: 0;
          transform: none;
          padding: 0 10px;
        }
        
        .futoast-container.top-center,
        .futoast-container.top-left,
        .futoast-container.top-right {
          top: 10px;
        }
        
        .futoast-container.bottom-center,
        .futoast-container.bottom-left,
        .futoast-container.bottom-right {
          bottom: 10px;
        }
        
        .futoast-buttons {
          flex-direction: column;
          gap: 6px;
        }
        
        .futoast-buttons button {
          width: 100%;
        }
      }
    `;
  }

  // Framework Integrations
  public React?: {
    useFutoast: () => ReactFutoast;
    FutoastContainer: () => React.ReactElement;
  };

  public Vue?: VueFutoast;
  public Angular?: AngularFutoast;
  public Django?: DjangoFutoast;
}

// Create singleton instance
const instance = new Futoast();

// Bind methods
const methods = [
  'show', 'primary', 'secondary', 'success', 'error', 
  'warning', 'info', 'question', 'loading', 'clear',
  'applyTheme', 'setIcons', 'setThemeMode', 'setFont'
] as const;

methods.forEach(method => {
  (instance as any)[method] = (instance as any)[method].bind(instance);
});

// ================= Framework-Specific Integrations ================= //

// React Integration
if (typeof React !== 'undefined') {
  const useFutoast = (): ReactFutoast => {
    const reactFutoast = React.useMemo(() => {
      return {
        show: (message: string, options?: ToastOptions) => {
          return new Promise((resolve) => {
            ReactDOM.flushSync(() => {
              instance.show(message, options).then(resolve);
            });
          });
        },
        primary: (message: string, options?: ToastOptions) => instance.primary(message, options),
        secondary: (message: string, options?: ToastOptions) => instance.secondary(message, options),
        success: (message: string, options?: ToastOptions) => instance.success(message, options),
        error: (message: string, options?: ToastOptions) => instance.error(message, options),
        warning: (message: string, options?: ToastOptions) => instance.warning(message, options),
        info: (message: string, options?: ToastOptions) => instance.info(message, options),
        question: (message: string, options?: ToastOptions) => instance.question(message, options),
        loading: (message: string, options?: ToastOptions) => instance.loading(message, options),
        clear: () => instance.clear(),
        applyTheme: (theme: string | Record<string, string>) => instance.applyTheme(theme),
        setIcons: (icons: Partial<ToastIcons>) => instance.setIcons(icons),
        setThemeMode: (mode: 'light' | 'dark') => instance.setThemeMode(mode),
        setFont: (fontFamily: string, fontSize?: string) => instance.setFont(fontFamily, fontSize)
      };
    }, []);

    return reactFutoast;
  };

  const FutoastContainer = (): React.ReactElement => {
    React.useEffect(() => {
      return () => instance.clear();
    }, []);
    return null as any;
  };

  instance.React = {
    useFutoast,
    FutoastContainer
  };
}

// Vue Integration
if (typeof Vue !== 'undefined') {
  const VueFutoast: VueFutoast = {
    install(Vue: any, options: { inject?: boolean } = {}) {
      Vue.prototype.$futoast = instance;
      Vue.prototype.$toast = instance; // Alias
      
      if (options.inject) {
        Vue.mixin({
          beforeCreate() {
            this.$futoast = instance;
            this.$toast = instance; // Alias
          }
        });
      }
    }
  };

  instance.Vue = VueFutoast;
}

// Angular Integration
if (typeof angular !== 'undefined') {
  angular.module('futoast', [])
    .factory('Futoast', function() {
      return instance;
    });
  
  instance.Angular = {
    moduleName: 'futoast'
  };
}

// Django Integration
if (typeof django !== 'undefined' || typeof window.django !== 'undefined') {
  instance.Django = {
    showToast: (message: string, options: ToastOptions = {}) => {
      const type = options.type || 'info';
      const timeout = options.timeout || 5000;
      return `<script>Futoast.${type}('${message.replace(/'/g, "\\'")}', ${JSON.stringify(options)});</script>`;
    },
    getStatic: () => {
      return `<script src="${window.STATIC_URL || '/static/'}js/futoast.js"></script>`;
    }
  };
}

// Vanilla JS export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = instance;
} else if (typeof define === 'function' && define.amd) {
  define([], function() {
    return instance;
  });
}

export default instance;