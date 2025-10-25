# AI-Powered Grant Distribution on Celo 🚀

Smart, transparent, and automated funding for impactful projects powered by AI and Celo blockchain.

![Celo](https://img.shields.io/badge/Celo-FCFF52?style=for-the-badge&logo=celo&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🌟 Overview

This platform revolutionizes grant distribution by combining AI intelligence with blockchain transparency. It automatically evaluates projects based on real metrics and distributes grants to top contributors on the Celo network.

## ✨ Features

- **AI-Powered Scoring**: Machine learning analyzes GitHub activity, community engagement, and project milestones
- **Automated Distribution**: Smart contracts automatically distribute cUSD/cEUR to top-ranked projects
- **Complete Transparency**: All transactions and AI decisions are publicly viewable on-chain
- **Real-time Dashboard**: Track project rankings, funding history, and treasury balance
- **Mobile-First**: Built on Celo for global accessibility and low transaction fees
- **Secure & Audited**: Thoroughly tested smart contracts with security best practices

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Blockchain** | Celo SDK, Solidity, Hardhat |
| **Frontend** | Next.js 14, React, TypeScript |
| **Wallet** | RainbowKit, wagmi, viem |
| **AI** | OpenAI GPT-4 API |
| **Database** | Supabase |
| **Styling** | Tailwind CSS, Framer Motion |
| **Deployment** | Vercel, Celo Alfajores Testnet |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Git
- MetaMask or compatible Web3 wallet
- Celo wallet with testnet funds (get from [Celo Faucet](https://faucet.celo.org))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd celo
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# GitHub
GITHUB_TOKEN=your_github_personal_access_token

# Celo
NEXT_PUBLIC_CELO_NETWORK=alfajores
NEXT_PUBLIC_CONTRACT_ADDRESS= # Will be filled after deployment

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

# Hardhat (for deployment)
PRIVATE_KEY=your_wallet_private_key
```

4. **Compile smart contracts**
```bash
npm run compile
```

5. **Deploy contracts to Alfajores testnet**
```bash
npm run deploy
```

Copy the contract address from the output and add it to your `.env` file as `NEXT_PUBLIC_CONTRACT_ADDRESS`.

6. **Set up Supabase database**

Run these SQL commands in your Supabase SQL editor:

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

-- Create indexes
CREATE INDEX idx_projects_address ON projects(project_address);
CREATE INDEX idx_projects_score ON projects(impact_score DESC);
CREATE INDEX idx_grants_project ON grant_distributions(project_id);
```

7. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
celo/
├── app/                      # Next.js 14 app directory
│   ├── api/                 # API routes
│   │   ├── ai/             # AI scoring endpoints
│   │   ├── github/         # GitHub data fetching
│   │   └── projects/       # Project CRUD operations
│   ├── dashboard/          # Dashboard page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── providers.tsx       # Web3 providers
├── components/
│   ├── dashboard/          # Dashboard components
│   │   ├── ProjectLeaderboard.tsx
│   │   ├── TreasuryBalance.tsx
│   │   ├── FundingHistory.tsx
│   │   └── RegisterProject.tsx
│   ├── landing/            # Landing page components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Stats.tsx
│   │   ├── CTA.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── ui/                 # Reusable UI components
│       └── tabs.tsx
├── contracts/              # Solidity smart contracts
│   └── GrantDistribution.sol
├── lib/                    # Utility functions
│   ├── utils.ts
│   └── supabase.ts
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── hardhat.config.ts       # Hardhat configuration
├── next.config.js          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json            # Dependencies
```

## 📜 Smart Contracts

### GrantDistribution.sol

Main contract managing the grant distribution system:

**Key Functions:**
- `registerProject()`: Register a new project
- `updateImpactScore()`: Update project's AI-calculated score (oracle only)
- `distributeGrants()`: Automatically distribute grants to top projects
- `getTreasuryBalance()`: Check available funds
- `verifyProject()`: Mark project as verified (owner only)

**Events:**
- `ProjectRegistered`: Emitted when a new project registers
- `ImpactScoreUpdated`: Emitted when score is updated
- `GrantDistributed`: Emitted when grant is sent
- `TreasuryDeposit`: Emitted when funds are added

## 🔧 Environment Setup

### Get Your API Keys

1. **Supabase**: Sign up at [supabase.com](https://supabase.com) and create a project
2. **OpenAI**: Get API key from [platform.openai.com](https://platform.openai.com)
3. **GitHub**: Create a personal access token at [github.com/settings/tokens](https://github.com/settings/tokens)
4. **WalletConnect**: Get project ID from [cloud.walletconnect.com](https://cloud.walletconnect.com)

### Celo Testnet Setup

1. Add Celo Alfajores to MetaMask:
   - Network Name: Celo Alfajores Testnet
   - RPC URL: https://alfajores-forno.celo-testnet.org
   - Chain ID: 44787
   - Currency Symbol: CELO
   - Block Explorer: https://alfajores.celoscan.io

2. Get testnet funds from [Celo Faucet](https://faucet.celo.org)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub

2. Import project in Vercel:
   - Connect your GitHub repository
   - Select the `celo` folder
   - Add all environment variables from `.env`

3. Deploy! Vercel will automatically build and deploy your app.

### Deploy Smart Contracts to Mainnet

1. Update `hardhat.config.ts` to use mainnet:
```typescript
celo: {
  url: "https://forno.celo.org",
  accounts: [process.env.PRIVATE_KEY],
  chainId: 42220,
}
```

2. Deploy:
```bash
npx hardhat run scripts/deploy.ts --network celo
```

3. Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in Vercel environment variables

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Celo](https://celo.org) for the blockchain infrastructure
- [OpenAI](https://openai.com) for AI capabilities
- [RainbowKit](https://www.rainbowkit.com/) for wallet connectivity
- [Supabase](https://supabase.com) for the database

## 📞 Support

For questions and support:
- GitHub Issues: [Create an issue](https://github.com/yourusername/celo/issues)
- Discord: [Join our community](#)
- Twitter: [@yourhandle](#)

---

Built with ❤️ for the Celo ecosystem
