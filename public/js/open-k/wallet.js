import system from './system.js';

// Constants
const WALLET_STORAGE_KEY = 'kondor_wallet';
const WALLET_SUBSTR_FORMAT = (str) => str.substring(0, 6) + '...' + str.slice(-4);

class Wallet {
    constructor() {
        this.kondor = window.kondor
    }

    async connect() {
        try {
            this.accounts = await this.kondor.getAccounts();
            
            if (!Array.isArray(this.accounts) || this.accounts.length === 0) {
                throw new Error('No accounts returned from kondor.getAccounts()');
            }
            this.storeWalletAddress(this.accounts[0].address);
            system.build.mini(true);
        } catch (error) {
            console.error('Error connecting wallet:', error);
            // Consider implementing retry logic or user prompts here
        }
    }

    async sign() {
        try {
            this.getSigner = await this.kondor.getSigner(this.getLocalWallet())
            
            if (!Array.isArray(this.getSigner) || this.getSigner.length === 0) {
                throw new Error('No accounts returned from kondor.getSigner()');
            }
            console.log(this.getSigner)
        } catch (error) {
            console.error('Error signing:', error);
        }
    }

    disconnect() {
        this.clearWalletAddress();
        localStorage.clear()
        system.stateMana(false)
        system.overlay.hide();
        system.build.mini();
    }

    storeWalletAddress(address) {
        try {
            localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(address));
        } catch (e) {
            console.error('Error storing wallet address:', e);
            // Handle storage error, maybe log to a server or inform user
        }
    }

    clearWalletAddress() {
        try {
            localStorage.removeItem(WALLET_STORAGE_KEY);
        } catch (e) {
            console.error('Error clearing wallet address:', e);
        }
    }

    isLogged() {
        return this.getLocalWallet() !== null;
    }

    getLocalWallet() {
        try {
            return JSON.parse(localStorage.getItem(WALLET_STORAGE_KEY) || 'null');
        } catch (e) {
            console.error('Error parsing wallet address:', e);
            return null;
        }
    }

    formatAddress(str) {
        return WALLET_SUBSTR_FORMAT(str);
    }
}

export default new Wallet();

