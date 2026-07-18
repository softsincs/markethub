# MarketHub — Professional Luxury Fragrance Escrow Registry

MarketHub is a state-of-the-art, secure peer-to-peer luxury fragrance marketplace and escrow facilitator. It integrates Swiss-grade scientific spectrometry validation rules, dynamic batch tracking, and secure multi-party escrow contracts.

## Key Features

- **🛡️ Swiss Escrow Registry & Ledger**: All transactions lock funds in secure escrow contracts. Funds are released only upon physical verification and buyer confirmation.
- **🔬 AI Spectroscopy & Chromatography**: Integrates Gemini 3.5 Flash for chemical compound profiling, batch formatting timeline estimation, and visual glass/cap thickness analysis.
- **✍️ AI Listing Assistant (Seller Portal)**: Custom image upload generates descriptions, olfactory pyramiding, suggested retail valuations, and realistic batch codes using computer vision.
- **🔥 Trending Real-Time Ticker & Stats**: Floating top security status ticker, animated brand strips, trending gauges, and live registry dashboard metrics (scans, counterfeit block rates, vault height).
- **💳 Styled Payment & Social Integrations**: Professional outline badges for JazzCash, EasyPaisa, VISA, Mastercard, PayPal, HBL Pay, and Meezan Bank alongside responsive SVG social linkages.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)

### Installation & Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: If no API key is present, the application runs on a robust dynamic protocol simulation mode.*

3. **Launch local server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit [http://localhost:3000](http://localhost:3000)

## Production Build

To compile a production bundle:
```bash
npm run build
```
The compiled output is optimized and bundle-split into `/dist`.
