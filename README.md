QuickLink - URL Shortener & QR Code Generator
A full-stack application that transforms long, cumbersome URLs into short, shareable links and instantly generates a corresponding QR code. Built with a Node.js & Express backend and a clean, responsive HTML & Tailwind CSS frontend.

(Feel free to replace this with your own screenshot! Just add the image file to your project and change the filename here.)

✨ Features
Simple & Fast: A clean, single-page interface for quick link shortening.

URL Shortening: Converts any valid URL into a unique, 7-character short link.

QR Code Generation: Automatically generates a downloadable QR code for every shortened link.

Instant Copying: "Copy to clipboard" functionality for easy sharing.

Responsive Design: Looks great on both desktop and mobile devices.

RESTful API: A well-defined backend API to handle the logic.

🛠️ Tech Stack
Backend: Node.js, Express.js

Database: SQLite (for simple, file-based storage)

Frontend: HTML, Tailwind CSS, Vanilla JavaScript

ID Generation: nanoid for unique and URL-friendly short codes.

QR Codes: qrcode library for generating QR code images.

🚀 How to Run Locally
To get a local copy up and running, follow these simple steps.

Prerequisites
Node.js installed on your machine. You can download it here.

Installation & Setup
Clone the repository:

git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

Install NPM packages:

npm install

Start the server:

node index.js

Your application will be running at http://localhost:3000.

🌐 Making it Public with ngrok
To share your locally running application with anyone on the internet:

Download and set up ngrok from ngrok.com. This includes signing up for a free account.

Connect your account: Run the command from your ngrok dashboard to add your authtoken. (This is a one-time setup).

# The "./" is important, especially on PowerShell, Mac, and Linux
./ngrok config add-authtoken <YOUR_TOKEN_HERE>

Expose your local server:

# This command creates a public URL for your local port 3000
./ngrok http 3000

Update the baseUrl: In index.js, change the baseUrl variable to your public ngrok URL to ensure the generated links and QR codes are publicly accessible.

// Before
const baseUrl = `http://localhost:3000`;

// After (use your own ngrok link!)
const baseUrl = `https://your-unique-id.ngrok-free.app`;

Restart your Node.js server (node index.js) and use the public ngrok URL to access your application from anywhere!