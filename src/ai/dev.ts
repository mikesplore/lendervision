import { config } from 'dotenv';
config();

import '@/ai/flows/flag-fraudulent-activity.ts';
import '@/ai/flows/generate-loan-recommendations.ts';
import '@/ai/flows/summarize-financial-data.ts';