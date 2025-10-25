# 🚀 Quick Start Guide

This guide will help you set up and run the AI-Powered Grant Distribution platform from scratch.

## ⏱️ Estimated Time: 30-45 minutes

---

## Step 1: Prerequisites ✅

Make sure you have the following installed:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended
- **MetaMask** - [Install extension](https://metamask.io/)

---

## Step 2: Get API Keys 🔑

### 2.1 Supabase Setup (5 min)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in project details and wait for database to be created
4. Go to **Settings → API**
5. Copy:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.2 OpenAI API Key (2 min)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Go to **API Keys** section
4. Click "Create new secret key"
5. Copy and save the key → This is your `OPENAI_API_KEY`

### 2.3 GitHub Token (2 min)

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Select scopes: `repo`, `read:user`
4. Generate and copy the token → This is your `GITHUB_TOKEN`

### 2.4 WalletConnect Project ID (2 min)

1. Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up and create a new project
3. Copy the Project ID → This is your `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

---

## Step 3: Project Setup 💻

### 3.1 Clone and Install

```bash
# Navigate to project folder
cd "C:\Users\Suman Pradhan\OneDrive\Desktop\celo"

# Install dependencies
npm install
```

### 3.2 Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here

# OpenAI
OPENAI_API_KEY=sk-xxxxx

# GitHub
GITHUB_TOKEN=ghp_xxxxx

# Celo
NEXT_PUBLIC_CELO_NETWORK=alfajores
NEXT_PUBLIC_CONTRACT_ADDRESS= # Leave empty for now

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Private key for contract deployment (DO NOT COMMIT!)
PRIVATE_KEY=your_wallet_private_key_without_0x
```

---

## Step 4: Setup MetaMask for Celo 🦊

### 4.1 Add Celo Alfajores Network

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Click "Add a network manually"
4. Enter these details:

```
Network Name: Celo Alfajores Testnet
RPC URL: https://alfajores-forno.celo-testnet.org
Chain ID: 44787
Currency Symbol: CELO
Block Explorer: https://alfajores.celoscan.io
```

5. Click "Save"

### 4.2 Get Testnet Funds

1. Go to [faucet.celo.org](https://faucet.celo.org)
2. Connect your MetaMask wallet
3. Request test CELO tokens
4. Wait for tokens to arrive (usually 30 seconds)

---

## Step 5: Setup Supabase Database 🗄️

1. Go to your Supabase project
2. Click **SQL Editor** in the sidebar
3. Click "New Query"
4. Copy and paste this SQL:

```sql
-- Create projects table
CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  project_address TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  github_url TEXT NOT NULL,
  impact_score INTEGER DEFAULT 0,
  total_grants_received NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create impact_scores table
CREATE TABLE impact_scores (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id),
  score INTEGER NOT NULL,
  github_activity INTEGER,
  community_engagement INTEGER,
  milestones_completed INTEGER,
  ai_analysis JSONB,
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- Create grant_distributions table
CREATE TABLE grant_distributions (
  id BIGSERIAL PRIMARY KEY,
  project_id BIGINT REFERENCES projects(id),
  amount TEXT NOT NULL,
  token_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  reason TEXT,
  distributed_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_address ON projects(project_address);
CREATE INDEX idx_projects_score ON projects(impact_score DESC);
CREATE INDEX idx_grants_project ON grant_distributions(project_id);
```

5. Click "Run" to execute
6. Verify tables were created in the **Table Editor**

---

## Step 6: Deploy Smart Contract 📜

### 6.1 Compile Contract

```bash
npm run compile
```

You should see: ✅ "Compiled 1 Solidity file successfully"

### 6.2 Get Your Private Key

**⚠️ SECURITY WARNING: Never share or commit your private key!**

1. Open MetaMask
2. Click the three dots → Account Details → Export Private Key
3. Enter your password
4. Copy the private key
5. Add it to your `.env` file as `PRIVATE_KEY` (without 0x prefix)

### 6.3 Deploy to Alfajores

```bash
npm run deploy
```

You should see output like:
```
Deploying GrantDistribution contract...
GrantDistribution deployed to: 0xABCD1234...
Save this address to your .env file
```

### 6.4 Update Environment Variable

Copy the contract address and add it to your `.env`:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

---

## Step 7: Run the Application 🎉

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see the beautiful landing page! 🎨

---

## Step 8: Test the Features ✨

### 8.1 Connect Wallet

1. Click "Connect Wallet" in the navbar
2. Select MetaMask
3. Make sure you're on Celo Alfajores network
4. Approve the connection

### 8.2 Register a Project

1. Go to **Dashboard** → **Register Project** tab
2. Fill in the form:
   - Project Name: e.g., "My Celo DeFi App"
   - Description: Describe your project
   - GitHub URL: Any public GitHub repo (e.g., `https://github.com/celo-org/celo-monorepo`)
3. Click "Register Project"
4. Wait for AI analysis (this may take 30-60 seconds)
5. Success! Your project is now registered

### 8.3 View Leaderboard

1. Go to **Leaderboard** tab
2. See your project with its AI-calculated impact score
3. Check the rankings and funding amounts

### 8.4 Check Funding History

1. Go to **Funding History** tab
2. View all grant distributions
3. Click transaction links to see on-chain proof

---

## Step 9: Deploy to Production 🚀

### 9.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 9.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
5. Add all environment variables from your `.env` file
6. Click "Deploy"
7. Wait 2-3 minutes for deployment
8. Your app is live! 🎉

---

## 🎯 What's Next?

- **Add more projects** to build a comprehensive leaderboard
- **Fund the treasury** to start distributing real grants
- **Customize the AI scoring** logic in `/app/api/ai/score/route.ts`
- **Deploy to Celo Mainnet** for production use
- **Invite your community** to register their projects

---

## 🆘 Troubleshooting

### Issue: "Module not found" errors
**Solution:** Run `npm install` again

### Issue: Contract deployment fails
**Solution:** 
- Make sure you have testnet CELO
- Check your PRIVATE_KEY is correct
- Verify you're connected to Alfajores

### Issue: AI scoring times out
**Solution:**
- Check your OPENAI_API_KEY is valid
- Make sure you have API credits
- Try with a different GitHub repo

### Issue: Database connection fails
**Solution:**
- Verify Supabase credentials in `.env`
- Check if tables are created
- Ensure SQL was executed successfully

---

## 📚 Additional Resources

- [Celo Documentation](https://docs.celo.org)
- [Next.js Documentation](https://nextjs.org/docs)
- [RainbowKit Docs](https://www.rainbowkit.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)

---

## 💬 Need Help?

- Create an issue on GitHub
- Join Celo Discord
- Check the main README.md for more details

---

**Congratulations! 🎊 You've successfully set up the AI-Powered Grant Distribution platform!**
