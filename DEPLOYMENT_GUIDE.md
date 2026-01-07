# 🚀 Deploying CodeGuard to Vercel

Vercel પર આ project deploy કરવો ખૂબ જ સરળ છે. નીચે આપેલી કોઈપણ પદ્ધતિ તમે વાપરી શકો છો.

## ✅ Method 1: Vercel Website (Easiest for GitHub users) - ભલામણ કરેલ

જો તમારી પાસે આ code GitHub પર છે, તો આ સૌથી સારો રસ્તો છે.

1. **Vercel પર જાવ**: [https://vercel.com](https://vercel.com) અને login કરો.
2. **New Project** button પર click કરો.
3. **Import Git Repository** સેક્શનમાં તમારી repository પસંદ કરો.
4. **Configure Project**:
   - Vercel આપોઆપ શોધી લેશે કે આ `Vite` project છે.
   - **Framework Preset**: `Vite` (Automatic) ex
   - **Build Command**: `npm run build` (Automatic)
   - **Output Directory**: `dist` (Automatic)
5. **Deploy** button દબાવો.
6. થોડી સેકન્ડોમાં તમારી website live થઈ જશે! 🎉

---

## 💻 Method 2: Vercel CLI (Command Line)

જો તમારે terminal માંથી જ deploy કરવું હોય:

1. **Vercel CLI install કરો** (જો ના હોય તો):
   ```bash
   npm i -g vercel
   ```

2. **Login કરો**:
   ```bash
   vercel login
   ```

3. **Deploy કરો**:
   project folder માં નીચેનો command run કરો:
   ```bash
   vercel
   ```

4. **Questions ના જવાબ આપો**:
   - Set up and deploy? -> **Y**
   - Which scope? -> **(Select your account)**
   - Link to existing project? -> **N**
   - Project name? -> **code-quality-platform**
   - In which directory? -> **./**
   - Want to modify settings? -> **N** (Auto-detect કામ કરી જશે)

---

## 📁 Method 3: Drag & Drop (Manual Upload)

જો તમે Git use નથી કરતા:

1. તમારા computer પર `npm run build` command run કરો.
2. આનાથી એક `dist` નામનું folder બનશે.
3. Vercel dashboard પર જાવ.
4. "Add New Project" -> "Upload" option શોધો (અથવા `vercel deploy --prebuilt` CLI માં).
   *(Note: Drag & drop feature હવે Vercel પર direct available નથી હોતું ક્યારેક, તેથી CLI method વધારે સારી છે.)*

---

## ⚙️ Project Configuration (Already Added)

મેં તમારા માટે `vercel.json` file બનાવી દીધી છે જેથી routing બરાબર ચાલે.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 🎉 ફાઇનલ રિઝલ્ટ

એકવાર deploy થઈ જાય એટલે તમને એક URL મળશે (જેમ કે `https://code-quality-platform.vercel.app`). આ link તમે કોઈને પણ share કરી શકો છો! 🚀
