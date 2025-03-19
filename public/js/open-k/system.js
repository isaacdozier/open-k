import wallet from './wallet.js';
import data from './data.js'

const SYSTEM_IDS = {
    ACCOUNT: '_account',
    MANA_CONTAINER: '_mana',
    MANA_BAR: '_mana_bar',
    CONTENT: '_content',
    OVERLAY: '_overlay',
    THEME_TOGGLE: 'theme-toggle'
};

const SYSTEM_CLASSES = {
    MINI: 'mini',
    DARK_MODE: 'dark-mode',
    OVERLAY_SHOW: 'show',
    FLEX_CENTER: 'd-flex justify-content-center align-items-center'
};

class System {
    constructor() {
        this.build = {
            container: null,
            init: this.initBuild.bind(this),
            mini: this.miniBuild.bind(this),
            button: this.createButton.bind(this)
        };
        this.loader = {
            container: null,
            init: this.initLoader.bind(this),
            show: this.showLoader.bind(this)
        };
        this.overlay = {
            overlayElement: null,
            closeButton: null,
            disconnect: null,
            init: this.initOverlay.bind(this),
            show: this.showOverlay.bind(this),
            hide: this.hideOverlay.bind(this)
        };
        this.theme = {
            init: this.initTheme.bind(this),
            icon: this.createIcon.bind(this)
        };
    }

    addContent(template, json) {
        const html = $.templates(template.data)
        let content = html.render({ data: json })
        document.getElementById('_content').innerHTML = content
    }

    initBuild() {
        this.build.container = document.getElementById(SYSTEM_IDS.ACCOUNT);
        this.manaContainer = document.getElementById(SYSTEM_IDS.MANA_CONTAINER)
        this.manaBar = document.getElementById(SYSTEM_IDS.MANA_BAR)
        this.stateMana()
        this.miniBuild()
    }

    async miniBuild() {
        this.clearMiniButtons();
        const content = wallet.isLogged() ? wallet.formatAddress(wallet.getLocalWallet()) : 'Connect Wallet';
        const action  = wallet.isLogged() ? null : () => wallet.connect();
        this.createButton('connect_wallet', content, action);

        if (wallet.isLogged()) {
            const icon = this.theme.icon('./img/icons/settings.svg');
            this.createButton('settings', icon, () => this.overlay.show());
            this.showMana()
        }
    }

    async showMana() {
        const mana = await data.request(wallet.getLocalWallet(), 'mana')
        const koin = await data.request(wallet.getLocalWallet(), '15DJN4a8SgrbGhhGksSBASiSYjGnMU8dGL')
        const manaPercent = (mana / koin).toFixed(2)*100
        this.manaBar.style.width  = manaPercent + '%'
        this.manaBar.style.backgroundColor = 'purple'
        this.stateMana(true)
    }

    stateMana(state = false){ 
        this.manaContainer.style.display = state ? 'block' : 'none'
    }

    clearMiniButtons() {
        this.build.container.querySelectorAll(`.${SYSTEM_CLASSES.MINI}`).forEach(btn => btn.remove());
    }

    createButton(id, display, action) {
        const btn = document.createElement('a');
        btn.id = id;
        btn.href = '#';
        btn.onclick = action || (() => {});
        btn.className = SYSTEM_CLASSES.MINI;
        if (typeof display === 'string') {
            btn.textContent = display;
        } else if (display instanceof HTMLElement) {
            btn.appendChild(display);
        }
        this.build.container.appendChild(btn);
    }

    initLoader() {
        this.loader.container = document.getElementById(SYSTEM_IDS.CONTENT);
    }

    showLoader() {
        const text = document.createElement('span');
        text.id = 'load';
        text.textContent = '0%';
        this.loader.container.className = SYSTEM_CLASSES.FLEX_CENTER;
        this.loader.container.appendChild(text);
    }

    initOverlay() {
        this.overlay.overlayElement = document.getElementById(SYSTEM_IDS.OVERLAY);
        this.overlay.closeButton = document.querySelector('.close_element');
        this.overlay.disconnect = document.querySelector('._disconnect');

        if (this.overlay.closeButton) {
            this.overlay.closeButton.onclick = () => this.hideOverlay();
        }
        if (this.overlay.disconnect) {
            this.overlay.disconnect.onclick = () => wallet.disconnect();
        }
    }

    showOverlay() {
        if (this.overlay.overlayElement) {
            this.overlay.overlayElement.classList.add(SYSTEM_CLASSES.OVERLAY_SHOW);
        }
    }

    hideOverlay() {
        if (this.overlay.overlayElement) {
            this.overlay.overlayElement.classList.remove(SYSTEM_CLASSES.OVERLAY_SHOW);
        }
    }

    initTheme() {
        const themeToggle = document.getElementById(SYSTEM_IDS.THEME_TOGGLE);
        const body = document.body;

        const toggleTheme = () => {
            body.classList.toggle(SYSTEM_CLASSES.DARK_MODE);
            localStorage.setItem('darkMode', body.classList.contains(SYSTEM_CLASSES.DARK_MODE));
        };

        if (localStorage.getItem('darkMode') === 'true') {
            body.classList.add(SYSTEM_CLASSES.DARK_MODE);
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    createIcon(svg_type) {
        let img = document.createElement('img');
        img.src = svg_type;
        return img;
    }
}

export default new System();