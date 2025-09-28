# IRLDreams
This project works using several libraries like Light Gallery for displaying the dreams, Tailwind CSS for styling. The AI model's I used aer OpenI for Images and ElevenLabs for Audio, and also ImageArt for the background generated images. For the APIS please note that if they do not work, go to line 6-15 on Index.js and change the api keys to your own Openai API and ElevenLabs API.

This project relies on node.js, below will be a step by step on how to run node via vs code:

Here’s a step-by-step guide on how to run a Node.js project for someone who does not have Node.js or VS Code installed:

How to Run a Node.js Project

Install Node.js Node.js is required to run the project. Here’s how you can install it: Go to the Node.js website: Open your browser and visit https://nodejs.org. Download the LTS (Long-Term Support) version: Click on the green button labeled “LTS” for the most stable version. Install Node.js: Run the downloaded installer and follow the instructions: Accept the license agreement. Keep the default settings during installation. Allow it to install the additional tools if prompted. Verify the installation: Open a terminal (Command Prompt or PowerShell on Windows, or Terminal on macOS/Linux). Type the following commands: node -v npm -v You should see the versions of Node.js (node -v) and npm (npm -v). If you see the version numbers, Node.js is installed correctly.

Install a Code Editor (Optional) Although not strictly necessary, using a code editor like Visual Studio Code (VS Code) can make things easier. Download VS Code: Visit https://code.visualstudio.com and download the installer for your operating system. Install VS Code: Run the installer and follow the setup instructions. Open the project in VS Code: Launch VS Code, click File > Open Folder, and select the project folder.

Install Project Dependencies Node.js projects often require external libraries, which are listed in a package.json file. Install dependencies: In the terminal, run the following command in the project directory: npm install This will download and install all the required libraries. Then write node index.js and in your browser go to localhost:3000

With these instructions, even someone with no prior experience should be able to set up and run a Node.js project.
