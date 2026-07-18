import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

// Initialize GoogleGenAI client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Safe Holding Ledger - In-Memory State
interface LedgerTransaction {
  id: string;
  fragranceName: string;
  brandName: string;
  batchCode: string;
  seller: string;
  buyer: string;
  amount: number; // in CHF
  status: 'Held' | 'Released' | 'Disputed' | 'Refunded';
  verificationScore: number;
  date: string;
  notes: string;
}

let ledger: LedgerTransaction[] = [
  {
    id: "TX-4092",
    fragranceName: "Creed Aventus (19S01 Vintage)",
    brandName: "Creed",
    batchCode: "A4219S01",
    seller: "LeFlacon_Geneve",
    buyer: "AromaCollector",
    amount: 450,
    status: "Released",
    verificationScore: 98,
    date: "2026-07-15",
    notes: "Verified signature silver atomizer ring, batch formulation matches 2019 pineapple-heavy profile. Highly authentic."
  },
  {
    id: "TX-5120",
    fragranceName: "Portrait of a Lady",
    brandName: "Frédéric Malle",
    batchCode: "10928A",
    seller: "Swiss_Scent_Vault",
    buyer: "NoseOfZurich",
    amount: 280,
    status: "Held",
    verificationScore: 94,
    date: "2026-07-17",
    notes: "Perfect cap weight and label placement. High rose absolute concentration verified via batch database check."
  },
  {
    id: "TX-3891",
    fragranceName: "Chanel Coromandel (Les Exclusifs)",
    brandName: "Chanel",
    batchCode: "4901",
    seller: "VintageEssence",
    buyer: "ParisianScent",
    amount: 380,
    status: "Disputed",
    verificationScore: 42,
    date: "2026-07-16",
    notes: "Suspiciously light bottle weight, uneven spray tube, and missing batch etching. Highly likely counterfeit."
  }
];

async function startServer() {
  const app = express();

  // Handle large base64 image uploads safely
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Endpoints
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // Get Safe Holding Ledger
  app.get('/api/ledger', (_req, res) => {
    res.json(ledger);
  });

  // Create Ledger Transaction (Simulated Escrow Lock)
  app.post('/api/ledger/create', (req, res) => {
    try {
      const { fragranceName, brandName, batchCode, seller, buyer, amount, verificationScore, notes } = req.body;
      
      const newTx: LedgerTransaction = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        fragranceName: fragranceName || "Unnamed Fragrance",
        brandName: brandName || "Unknown Brand",
        batchCode: batchCode || "N/A",
        seller: seller || "Anonymous Seller",
        buyer: buyer || "Anonymous Buyer",
        amount: Number(amount) || 100,
        status: 'Held',
        verificationScore: Number(verificationScore) || 50,
        date: new Date().toISOString().split('T')[0],
        notes: notes || "Secured via Swiss Olfactory verification protocol."
      };

      ledger.unshift(newTx);
      res.json({ success: true, transaction: newTx });
    } catch (error) {
      console.error("Error creating ledger transaction:", error);
      res.status(500).json({ error: "Failed to secure transaction." });
    }
  });

  // Update Escrow Status
  app.post('/api/ledger/update-status', (req, res) => {
    try {
      const { id, status } = req.body;
      const tx = ledger.find(t => t.id === id);
      if (!tx) {
        res.status(404).json({ error: "Transaction not found" });
        return;
      }
      if (['Held', 'Released', 'Disputed', 'Refunded'].includes(status)) {
        tx.status = status as any;
        res.json({ success: true, transaction: tx });
      } else {
        res.status(400).json({ error: "Invalid status" });
      }
    } catch (error) {
      console.error("Error updating transaction status:", error);
      res.status(500).json({ error: "Failed to update transaction status" });
    }
  });

  // AI Olfactory Verification & Automated Batch Scoring
  app.post('/api/verify-olfactory', async (req, res) => {
    try {
      const { brandName, fragranceName, batchCode, notesOrDescription, image, imageMimeType } = req.body;

      if (!brandName || !fragranceName) {
        res.status(400).json({ error: "Brand name and fragrance name are required." });
        return;
      }

      const promptParts: any[] = [];

      // Construct detailed textual context
      let textPrompt = `You are the NMarket Hub AI Swiss Luxury Olfactory Protocol Validator, the premier global expert on authenticating luxury perfumes, identifying counterfeit bottles, and evaluating batch codes.
Analyze the following luxury fragrance:
- Brand: ${brandName}
- Fragrance Name: ${fragranceName}
- Batch Code Provided: ${batchCode || "None provided"}
- Seller Description/Context: ${notesOrDescription || "None provided"}`;

      if (image) {
        textPrompt += `\n\nWe have also provided an uploaded image of the bottle or box. Analyze the visual characteristics: look for glass seam symmetry, font consistency, label centering, color of the juice, cap weight indicators, and spray tube curvature characteristic of this specific luxury house.`;
        promptParts.push({
          inlineData: {
            data: image,
            mimeType: imageMimeType || "image/jpeg"
          }
        });
      } else {
        textPrompt += `\n\n(No image uploaded. Provide visual guidelines on what visual aspects the user must verify manually on the bottle of this specific fragrance model.)`;
      }

      textPrompt += `\n\nGenerate a highly accurate, professional Swiss-luxury style report in JSON format with:
1. authenticityScore (0-100 index rating probability of authentic origin)
2. batchAnalysis (an evaluation of the batch code structure for ${brandName}, estimating production year, rarity, and safe verification indicators)
3. visualCheck (specific visual indicators of authenticity for this fragrance, referencing details from the image if uploaded, or general checklist if not)
4. notesComposition (Olfactory pyramid representation: topNotes, heartNotes, baseNotes)
5. marketRarityScore (0-100, where 100 is ultra-rare/discontinued)
6. estimatedValue (estimated current market value range in CHF, e.g. "CHF 250 - 320")
7. verdict (string: one of "AUTHENTIC", "SUSPICIOUS", or "COUNTERFEIT_ALERT")
8. reasons (array of 3-4 professional, technical reasons or validation observations)`;

      promptParts.push({ text: textPrompt });

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: promptParts,
        config: {
          temperature: 0.2, // low temperature for precise factual validation
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              authenticityScore: {
                type: Type.INTEGER,
                description: 'The probability score of authenticity, from 0 to 100.'
              },
              batchAnalysis: {
                type: Type.STRING,
                description: 'Technical breakdown of the batch code, manufacturer records, and formulation timeline.'
              },
              visualCheck: {
                type: Type.STRING,
                description: 'Visual analysis of packaging, bottle, label, cap alignment or tube.'
              },
              notesComposition: {
                type: Type.OBJECT,
                properties: {
                  topNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Top/head notes'
                  },
                  heartNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Heart/mid notes'
                  },
                  baseNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Base/dry-down notes'
                  }
                },
                required: ['topNotes', 'heartNotes', 'baseNotes']
              },
              marketRarityScore: {
                type: Type.INTEGER,
                description: 'Rarity score of this specific vintage/formulation from 0 to 100.'
              },
              estimatedValue: {
                type: Type.STRING,
                description: 'Estimated value in CHF.'
              },
              verdict: {
                type: Type.STRING,
                description: 'Must be AUTHENTIC, SUSPICIOUS, or COUNTERFEIT_ALERT.'
              },
              reasons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Bullet points with technical reasons supporting the verdict.'
              }
            },
            required: ['authenticityScore', 'batchAnalysis', 'visualCheck', 'notesComposition', 'marketRarityScore', 'estimatedValue', 'verdict', 'reasons']
          }
        }
      });

      const text = response.text || '{}';
      res.json(JSON.parse(text));
    } catch (error) {
      console.error('Error verifying olfactory asset:', error);
      res.status(500).json({ error: 'Failed to run Swiss olfactory verification protocol' });
    }
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
