# VIBE.TTS Deployment Guide

## Architecture
- **Frontend**: Next.js deployed on Vercel
- **Backend**: Python/FastAPI deployed on Railway

---

## Step 1: Deploy Backend to Railway

### 1.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### 1.2 Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Connect your repo and select the `backend` folder
3. Railway will auto-detect Python

### 1.3 Configure Settings
1. Go to project Settings
2. Under "Networking", click "Public Networking"
3. Enable "Public IPv4" - this gives you a public URL
4. Copy the public URL (e.g., `https://vibe-tts-backend.up.railway.app`)

### 1.4 Update Backend for Production
The backend needs CORS to accept requests from Vercel domain:

```python
# Update main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, replace `*` with your Vercel domain:
```python
allow_origins=["https://vibe-tts.vercel.app"],
```

---

## Step 2: Deploy Frontend to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

### 2.2 Deploy Frontend
1. Click "New Project" → "Import Git Repository"
2. Select your repo
3. Configure:
   - **Root Directory**: `.` (root, not backend)
   - **Build Command**: `npm run build`
   - **Environment Variables**: Add:
     - `NEXT_PUBLIC_API_URL` = your Railway URL (e.g., `https://vibe-tts-backend.up.railway.app`)

4. Click "Deploy"

### 2.3 Wait for Deployment
- Vercel will give you a URL like `vibe-tts.vercel.app`

---

## Step 3: Update Backend CORS
Once you have your Vercel URL:

1. Go to Railway → Your Backend Project → Settings
2. Add Environment Variable or update CORS in code:
```python
allow_origins=["https://vibe-tts.vercel.app", "http://localhost:8001"],
```

3. Redeploy or restart the service

---

## Step 4: Verify
1. Open your Vercel URL
2. Enter text and generate audio
3. It should work!

---

## Alternative: Render (Free Tier)

If Railway doesn't work, use [Render](https://render.com):

1. Create account
2. New → Blueprint → Connect GitHub repo (backend folder)
3. Settings:
   - Branch: main
   - Build Command: (leave empty - auto-detects)
   - Start Command: `python main.py`
4. Deploy

---

## Troubleshooting

### CORS Error
```
Access to fetch at 'https://backend.railway.app' from origin 'https://yoursite.vercel.app' has been blocked by CORS policy
```
**Fix**: Update `allow_origins` in backend to include your Vercel domain.

### Connection Refused
```
Failed to connect to backend
```
**Fix**: 
- Check Railway service is running
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- No trailing slash in URL

### Timeout
```
TTS request timeout
```
**Fix**: The free tier on Railway has cold starts. First request after idle may timeout. Retry after 30 seconds.

---

## Production Improvements

### 1. Add Health Check Endpoint
```python
@app.get("/health")
async def health():
    return {"status": "ok"}
```

### 2. Use Edge Functions (Vercel)
For even faster response times, you could migrate TTS logic to Vercel Edge Functions, but this requires Node.js compatible TTS library.

### 3. Rate Limiting
Add rate limiting to prevent abuse:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/tts")
@limiter.limit("10/minute")
async def generate_tts(request: TTSRequest):
    ...
```