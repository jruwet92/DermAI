# DermAI - AI-Powered Dermatology Consultation

An AI-assisted clinical decision support tool for family physicians to analyze skin findings using Google Cloud Vision and Gemini AI.

## 🚀 Features

- 📸 Mobile-first photo capture
- 📋 Structured clinical history intake
- 🤖 AI-powered differential diagnosis
- ⚠️ Automated urgency assessment
- 📄 Printable consultation reports

## 🛠️ Tech Stack

- **Frontend:** React (via CDN), Vanilla CSS
- **Backend:** Node.js, Express
- **AI:** Google Cloud Vision API, Google Gemini Pro
- **Deployment:** Render

## 🌐 Deploy to Render

1. **Fork/Clone this repository**

2. **Go to [Render.com](https://render.com) and sign in with GitHub**

3. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `DermAI` repo

4. **Configure Service:**
   - **Name:** `dermai`
   - **Region:** Select closest to you
   - **Branch:** `main`
   - **Root Directory:** (leave blank)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. **Add Environment Variables:**
   - Click "Advanced" → "Add Environment Variable"
   - Add these three variables:
   
   | Key | Value |
   |-----|-------|
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `VISION_API_KEY` | Your Vision API key |
   | `PORT` | `10000` |

6. **Deploy:**
   - Click "Create Web Service"
   - Wait 3-5 minutes
   - Your app will be live at: `https://dermai.onrender.com`

## 🔑 Get API Keys

**Google Gemini API Key:**
- Visit: https://makersuite.google.com/app/apikey
- Click "Create API key"
- Copy the key

**Google Cloud Vision API Key:**
- Visit: https://console.cloud.google.com/apis/credentials
- Enable "Cloud Vision API"
- Create credentials → API key
- Copy the key

## ⚠️ Important Notes

- API keys are stored securely in Render's environment variables
- Never commit API keys to the repository
- Free tier limits: 1,000 Vision requests/month, 60 Gemini requests/minute

## 📄 License

MIT

## 🩺 Disclaimer

This tool is for clinical decision support only. Always use clinical judgment and correlate with physical examination. Not a substitute for professional medical advice.
