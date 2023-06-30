import { App, Modal, Notice, Plugin, PluginSettingTab, Setting, ToggleComponent } from 'obsidian';

export default class ObsidianLockPlugin extends Plugin {
  settings: ObsidianLockSettings;
  lockScreen: HTMLDivElement | null = null;

  async onload() {
    console.log('Loading ObsidianLock plugin');

    await this.loadSettings();

    // Open the lock screen on app boot if enabled
    if (this.settings.enableLockScreen) {
      this.app.workspace.on('layout-ready', () => {
        this.showLockScreen();
      });
    }

    this.addSettingTab(new ObsidianLockSettingsTab(this.app, this));
    this.addCommand({
      id: 'lock-vault',
      name: 'Lock Vault',
      callback: () => {
        this.showLockScreen();
      },
    });
    this.addRibbonIcon('lock', 'Lock Vault', () => {
      this.showLockScreen();
    });
  }

  showLockScreen() {
    if (this.lockScreen) return; // Prevent creating multiple lock screens

    this.lockScreen = document.createElement('div');
    this.lockScreen.classList.add('obsidian-lock-screen');

    const appContainer = document.querySelector('.app-container');
    if (appContainer) {
      appContainer.appendChild(this.lockScreen);
    }

    const videoEl = document.createElement('video');
    videoEl.src = 'https://raw.githubusercontent.com/SineCrepusculum/locksidian/main/bg.mp4';
    videoEl.loop = true;
    videoEl.muted = true;
    videoEl.autoplay = true;
    videoEl.classList.add('obsidian-lock-video');

    const overlay = document.createElement('div');
    overlay.classList.add('obsidian-lock-overlay');
  
    const usernameLabel = document.createElement('div');
    usernameLabel.textContent = this.settings.username;
    usernameLabel.classList.add('obsidian-lock-username');

    const passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.placeholder = 'Enter password';
    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        if (this.validateCredentials(passwordInput.value)) {
          this.unlockVault();
        } else {
          this.showInvalidCredentialsMessage(passwordInput);
        }
      }
    });

    this.lockScreen.appendChild(videoEl);
    this.lockScreen.appendChild(overlay);
    this.lockScreen.appendChild(usernameLabel);
    this.lockScreen.appendChild(passwordInput);

    passwordInput.focus();
  }

  unlockVault() {
    if (this.lockScreen) {
      this.lockScreen.remove();
      this.lockScreen = null;
    }
  }

  validateCredentials(password: string): boolean {
    return password === this.settings.password;
  }

  showInvalidCredentialsMessage(passwordInput: HTMLInputElement) {
    passwordInput.classList.add('obsidian-lock-input-error');
    passwordInput.value = '';
    passwordInput.focus();
    setTimeout(() => {
      passwordInput.classList.remove('obsidian-lock-input-error');
    }, 500);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

interface ObsidianLockSettings {
  enableLockScreen: boolean;
  username: string;
  password: string;
}

const DEFAULT_SETTINGS: ObsidianLockSettings = {
  enableLockScreen: true,
  username: 'User',
  password: 'password',
};

class ObsidianLockSettingsTab extends PluginSettingTab {
  plugin: ObsidianLockPlugin;

  constructor(app: App, plugin: ObsidianLockPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Obsidian Lock Settings' });

    new Setting(containerEl)
      .setName('Enable lock screen')
      .setDesc('Show the lock screen when Obsidian starts up.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enableLockScreen)
          .onChange(async (value) => {
            this.plugin.settings.enableLockScreen = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Username')
      .setDesc('The username to display on the lock screen.')
      .addText((text) =>
        text
          .setValue(this.plugin.settings.username)
          .onChange(async (value) => {
            this.plugin.settings.username = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Password')
      .setDesc('The password to unlock the vault.')
      .addText((text) =>
        text
          .setValue(this.plugin.settings.password)
          .onChange(async (value) => {
            this.plugin.settings.password = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
