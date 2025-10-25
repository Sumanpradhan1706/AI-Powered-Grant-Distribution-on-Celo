# 🎯 Quick Reference Card

## Essential Commands

```bash
# Development
npm install              # Install dependencies
npm run dev             # Start dev server (localhost:3000)
npm run build           # Build for production
npm run start           # Start production server

# Smart Contracts
npm run compile         # Compile Solidity contracts
npm run deploy          # Deploy to Alfajores testnet
npx hardhat test        # Run contract tests
npx hardhat clean       # Clean artifacts
```

## Important Addresses

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Alfajores (Testnet) | 44787 | https://alfajores-forno.celo-testnet.org |
| Celo (Mainnet) | 42220 | https://forno.celo.org |

**cUSD Token (Alfajores)**: `0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1`

## Environment Variables

```env
# Required for all features
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
GITHUB_TOKEN=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

# Only for deployment
PRIVATE_KEY=
```

## Key Files

| File | Purpose |
|------|---------|
| `contracts/GrantDistribution.sol` | Main smart contract |
| `app/page.tsx` | Landing page |
| `app/dashboard/page.tsx` | Dashboard |
| `app/api/ai/score/route.ts` | AI scoring endpoint |
| `app/api/github/fetch/route.ts` | GitHub data fetching |
| `lib/supabase.ts` | Database client |
| `app/providers.tsx` | Web3 setup |

## Quick Fixes

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Contract Deployment Failed
- Check PRIVATE_KEY in .env
- Ensure you have testnet CELO
- Verify network in hardhat.config.ts

### AI Scoring Timeout
- Check OPENAI_API_KEY
- Verify API credits
- Try different GitHub repo

### Database Connection Failed
- Check Supabase credentials
- Run SQL schema
- Check table names match code

## API Endpoints

```bash
POST /api/ai/score          # Calculate impact score
POST /api/github/fetch      # Get GitHub data
GET  /api/projects          # List all projects
POST /api/projects          # Register new project
```

## Smart Contract Functions

```solidity
// Public
registerProject(name, description, githubUrl)
getProject(projectId)
getTreasuryBalance()
getTopProjects(limit)

// Owner Only
distributeGrants(projectIds[], amounts[], reasons[])
verifyProject(projectId)
updateAIOracle(address)

// AI Oracle Only
updateImpactScore(projectId, score)
batchUpdateScores(projectIds[], scores[])
```

## Useful Links

- **Celo Faucet**: https://faucet.celo.org
- **Alfajores Explorer**: https://alfajores.celoscan.io
- **Supabase Dashboard**: https://app.supabase.com
- **OpenAI API**: https://platform.openai.com
- **WalletConnect**: https://cloud.walletconnect.com

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] Can register project
- [ ] AI scoring completes
- [ ] Project appears in leaderboard
- [ ] Treasury balance displays
- [ ] Funding history loads
- [ ] Contract interactions work
- [ ] Mobile responsive
- [ ] Dark theme applied
- [ ] Animations smooth

## Deployment Steps

1. `npm run build` - Build application
2. Push to GitHub
3. Connect Vercel
4. Add environment variables
5. Deploy
6. Verify deployment
7. Test live site

## Common Errors

| Error | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` |
| "Network error" | Check RPC URL and network |
| "Insufficient funds" | Get tokens from faucet |
| "Invalid API key" | Verify .env credentials |
| "Contract not deployed" | Run `npm run deploy` |

## Performance Tips

- Use `next/image` for images
- Enable caching in Vercel
- Optimize bundle size
- Lazy load components
- Use React.memo for expensive renders

## Security Best Practices

- ✅ Never commit .env file
- ✅ Use .gitignore for sensitive files
- ✅ Keep private key secure
- ✅ Validate user inputs
- ✅ Use HTTPS in production
- ✅ Rate limit API endpoints
- ✅ Audit smart contracts

## Support

- GitHub Issues: Report bugs
- Discord: Community help
- Twitter: Announcements
- Email: Partnerships

---

**Keep this handy for quick reference!** 📌
