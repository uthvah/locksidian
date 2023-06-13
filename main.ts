import { App, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

export default class PasswordPromptPlugin extends Plugin {
  settings: PasswordPromptSettings;

  async onload() {
    console.log('Loading Password Prompt plugin');

    await this.loadSettings();

    // Open the password prompt on app boot if password protection is enabled
    if (this.settings.enablePassword) {
      this.app.workspace.on('layout-ready', () => {
        this.openPasswordPrompt();
      });
    }

    this.addSettingTab(new PasswordPromptSettingsTab(this.app, this));
  }

  openPasswordPrompt() {
    const modal = new PasswordPromptModal(this.app, this.settings.password);

    const checkPassword = (password) => {
      if (password === this.settings.password) {
        // Perform actions when the correct password is entered
        new Notice('Password correct!');
        // You can unlock access to the vault here
        // Remove the password prompt modal if needed
        modal.close();
      } else {
        new Notice('Incorrect password!');
        // Prompt the user to enter the password again
        modal.open().then(checkPassword);
      }
    };

    modal.open().then(checkPassword);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

interface PasswordPromptSettings {
  enablePassword: boolean;
  password: string;
}

const DEFAULT_SETTINGS: PasswordPromptSettings = {
  enablePassword: true,
  password: 'password123',
};

class PasswordPromptModal extends Modal {
  constructor(app, password) {
    super(app);
    this.preventClose = true; // Prevent closing the modal without entering a password
    this.password = password;
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.addClass('password-prompt-container');

    let headingEl = contentEl.createEl('h3', { text: 'Vault Locked', cls: 'password-prompt-heading' });
    let inputEl = contentEl.createEl('input', { type: 'password', cls: 'password-prompt-input' });
    let buttonEl = contentEl.createEl('button', { text: 'Submit', cls: 'password-prompt-button' });

    const submitPassword = () => {
      const password = inputEl.value;
      if (password) {
        this.preventClose = false; // Allow closing the modal after a password is entered
        this.close();
        this.callback(password);
      }
    };

    buttonEl.addEventListener('click', submitPassword);
    inputEl.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        submitPassword();
      }
    });

    inputEl.focus();
    inputEl.placeholder = 'Enter your password';
  }

  onClose() {
    if (this.preventClose) {
      modal.open().then(checkPassword); // Prompt the user to enter the password again
    } else {
      let { contentEl } = this;
      contentEl.empty();
    }
  }

  open() {
    return new Promise((resolve) => {
      this.callback = resolve;
      this.preventClose = true; // Reset preventClose flag before opening
      super.open();
    });
  }
}

class PasswordPromptSettingsTab extends PluginSettingTab {
  plugin: PasswordPromptPlugin;

  constructor(app: App, plugin: PasswordPromptPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Locksidian Settings' });

    new Setting(containerEl)
      .setName('Enable Password')
      .setDesc('Toggle password protection for the vault.')
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.enablePassword)
          .onChange(async (value) => {
            this.plugin.settings.enablePassword = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Password')
      .setDesc('Enter the password to access the vault.')
      .addText((text) =>
        text
          .setPlaceholder('Enter password')
          .setValue(this.plugin.settings.password)
          .onChange(async (value) => {
            this.plugin.settings.password = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
