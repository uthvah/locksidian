import { App, Modal, Notice, Plugin } from 'obsidian';

export default class PasswordPromptPlugin extends Plugin {
  async onload() {
    console.log('Loading Password Prompt plugin');

    // Open the password prompt on app boot
    this.app.workspace.on('layout-ready', () => {
      this.openPasswordPrompt();
    });
  }

  openPasswordPrompt() {
    const modal = new PasswordPromptModal(this.app);

    const checkPassword = (password) => {
      if (password === '123098') {
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
}

class PasswordPromptModal extends Modal {
  constructor(app) {
    super(app);
    this.preventClose = true; // Prevent closing the modal without entering a password
  }

  onOpen() {
    let { contentEl } = this;
    contentEl.addClass('password-prompt-container');

    let headingEl = contentEl.createEl('h3', { text: 'Enter your password', cls: 'password-prompt-heading' });
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
