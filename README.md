# Locksidian

Locksidian is an add-on for the Obsidian note-taking app that adds a password prompt when entering your vault.

![image](https://github.com/SineCrepusculum/locksidian/assets/113909005/54b7a889-3baf-4df7-b046-3d1b820d1542)

## Installation

1. Download the latest release of the Locksidian add-on from the [Releases](https://github.com/SineCrepusculum/locksidian/releases) page.
2. In Obsidian, go to **Settings > Third-party Plugins**.
3. Enable **Community Plugins** if you haven't already.
4. Click on **Open folder for community plugins**.
5. Extract the downloaded ZIP file into the community plugins folder.
6. Restart Obsidian.
7. Locksidian should now appear in the list of installed plugins in the Obsidian settings.

## Usage

1. Upon launching Obsidian or opening a vault, Locksidian will display a password prompt.
2. Enter the correct password to unlock access to the vault.
3. If the password is incorrect, Locksidian will display an error message and prompt for the password again.
4. Once the correct password is entered, the password prompt will be closed, and you can access your vault.

## Configuration

Currently, Locksidian uses a hardcoded password for demonstration purposes. To change the password:

1. Open the `main.ts` file in the Locksidian source code.
2. Locate the line that says `const correctPassword = '123098';`.
3. Replace `'123098'` with your desired password.

## Development

To build and modify the Locksidian code:

1. Clone this repository: `git clone https://github.com/SineCrepusculum/locksidian.git`.
2. Navigate to the project directory: `cd locksidian`.
3. Install the dependencies: `npm install`.
4. Make the desired modifications to the code.
5. Build the project: `npm run build`.
6. The compiled `main.js` file will be generated in the `dist` directory.
7. Follow the installation steps above to install the modified Locksidian add-on in Obsidian.

## Contributing

Contributions to Locksidian are welcome! If you find any bugs or have suggestions for improvements, please [open an issue](https://github.com/your-username/locksidian/issues) or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

