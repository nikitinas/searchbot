import { nanoid } from 'nanoid';
import { apiClient } from './apiClient';
import { mockResults } from '@/data/mockResults';
import { SearchRequestPayload, SearchResultPayload } from '@/types';

// Enable live search if explicitly set to 'true', OR if API URL points to localhost (for local development)
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const EXPLICIT_ENABLE = process.env.EXPO_PUBLIC_ENABLE_LIVE_SEARCH === 'true';
const IS_LOCALHOST = API_URL.includes('localhost') || API_URL.includes('127.0.0.1');
const LIVE_SEARCH_ENABLED = EXPLICIT_ENABLE || IS_LOCALHOST;

// Debug logging
if (__DEV__) {
  console.log('🔍 SearchService Configuration:');
  console.log('  EXPO_PUBLIC_ENABLE_LIVE_SEARCH:', process.env.EXPO_PUBLIC_ENABLE_LIVE_SEARCH);
  console.log('  EXPO_PUBLIC_API_URL:', API_URL);
  console.log('  Is localhost?:', IS_LOCALHOST);
  console.log('  LIVE_SEARCH_ENABLED:', LIVE_SEARCH_ENABLED);
  console.log('  (Auto-enabled for localhost development)');
}

const buildMockResponse = (request: SearchRequestPayload): SearchResultPayload => {
  const seed = request.category.toLowerCase();

  if (seed.includes('smartphone')) {
    return {
      summary:
        'Compared the 17 most-reviewed phones under $500 across GSMArena, Rtings, and Wirecutter. Pixel 7a leads overall value, while Galaxy A55 provides the best battery life. All shortlisted options support 5G and NFC payments.',
      steps: [
        {
          id: 'compare-1',
          title: 'Top pick: Google Pixel 7a ($399)',
          description: 'Best-in-class camera, 7-year update promise, solid battery, and wireless charging at this price.',
        },
        {
          id: 'compare-2',
          title: 'Battery leader: Samsung Galaxy A55 ($449)',
          description: 'Largest 5,000 mAh battery tested, 2-day endurance in GSM Arena drain test, vibrant AMOLED display.',
        },
        {
          id: 'compare-3',
          title: 'Budget option: OnePlus Nord N30 ($299)',
          description: 'Super-fast 67W charging, 120Hz display, compromises on camera consistency but 2-year warranty.',
        },
      ],
      decisionFactors: [
        { id: 'factor-a', label: 'Longevity', detail: 'Only Google guarantees 7 years of updates; Samsung offers 4 years for the A55.' },
        { id: 'factor-b', label: 'Battery life', detail: 'A55 wins (15h+ video loop). Pixel 7a lasts 12h 43m, Nord N30 11h.' },
        { id: 'factor-c', label: 'Camera quality', detail: 'Pixel 7a uses flagship sensor and Tensor chip—best HDR + night performance.' },
      ],
      sources: [
        {
          id: 'src-tech-1',
          title: 'Wirecutter Budget Smartphones 2024',
          url: 'https://www.nytimes.com/wirecutter',
          credibility: 90,
          snippet: 'Pixel 7a called “the best phone most people should buy under $500.”',
        },
        {
          id: 'src-tech-2',
          title: 'GSMArena Battery Benchmarks',
          url: 'https://www.gsmarena.com/battery-test.php3',
          credibility: 84,
          snippet: 'Objective lab measurements comparing 65 sub-$500 phones.',
        },
        {
          id: 'src-tech-3',
          title: 'Rtings Smartphone Reviews',
          url: 'https://www.rtings.com/smartphone',
          credibility: 88,
          snippet: 'Camera and performance scoring methodology explained with raw datasets.',
        },
      ],
      estimatedTimeMinutes: 10,
      difficulty: 'easy',
      recommendedActions: [
        'Visit carrier for hands-on feel before purchase',
        'Purchase within 14-day return window to test battery life',
        'Bundle with protective case + screen film to maintain value',
      ],
    };
  }

  if (seed.includes('travel')) {
    return {
      summary:
        'Generated a 4-day Mexico City food and culture itinerary prioritized around Roma Norte lodging. Balances morning museum blocks, afternoon markets, and evening dining with verified reservation links.',
      steps: [
        {
          id: 'travel-1',
          title: 'Day 1 – Historic Core + Street Food',
          description: 'Palacio de Bellas Artes, Zócalo rooftop views, evening tacos al pastor crawl (El Vilsito, Taquería Orinoco).',
        },
        {
          id: 'travel-2',
          title: 'Day 2 – Museums & Chapultepec',
          description: 'Frida Kahlo Museum timed entry 9am, lunch at Contramar (book via Resy), sunset paddleboats.',
        },
        {
          id: 'travel-3',
          title: 'Day 3 – Markets + Cooking Class',
          description: 'Private class via AirBnB Experiences sourcing spices at Mercado Medellín.',
        },
        {
          id: 'travel-4',
          title: 'Day 4 – Teotihuacán Excursion',
          description: 'Sunrise hot-air balloon add-on, lunch at La Gruta cave restaurant, timed Uber back before 4pm traffic.',
        },
      ],
      decisionFactors: [
        { id: 'travel-factor-1', label: 'Budget', detail: 'Estimated $950 total for two people (lodging excluded).' },
        { id: 'travel-factor-2', label: 'Safety', detail: 'Roma/Condesa rated “Moderate” by U.S. State Dept; Uber safest for late-night rides.' },
        { id: 'travel-factor-3', label: 'Seasonality', detail: 'Best weather March-May; rainy season Jun-Sep requires backup indoor plans.' },
      ],
      sources: [
        { id: 'travel-src-1', title: 'Lonely Planet Mexico City 2024', url: 'https://www.lonelyplanet.com', credibility: 78, snippet: 'Neighborhood guides with updated restaurant closures.' },
        { id: 'travel-src-2', title: 'CDMX Tourism Safety Brief', url: 'https://www.travel.state.gov', credibility: 95, snippet: 'Latest Level 2 advisory with actionable precautions.' },
        { id: 'travel-src-3', title: 'Eater 38 Essential Mexico City Restaurants', url: 'https://mexico.eater.com/maps', credibility: 82, snippet: 'Editor-curated dining hits for 2024.' },
      ],
      estimatedTimeMinutes: 60,
      difficulty: 'medium',
      recommendedActions: [
        'Book museum tickets at least 10 days ahead',
        'Exchange pesos via ATM at airport upon arrival',
        'Enable eSIM (Airalo/Ubigi) for cheaper data',
      ],
    };
  }

  return mockResults.default;
};

export const searchService = {
  async runSearch(request: SearchRequestPayload): Promise<SearchResultPayload> {
    if (LIVE_SEARCH_ENABLED) {
      console.log('🚀 Attempting live search with backend API...');
      console.log('  API URL:', process.env.EXPO_PUBLIC_API_URL);
      console.log('  Request:', { id: request.id, description: request.description.substring(0, 50) + '...' });
      
      try {
        const { data } = await apiClient.post<SearchResultPayload>('/search', request);
        console.log('✅ Live search successful!');
        return data;
      } catch (error: any) {
        console.error('❌ Live search failed:', error?.message || error);
        console.error('  Error details:', {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          url: error?.config?.url,
          baseURL: error?.config?.baseURL,
        });
        console.error('  Full error object:', error);
        console.warn('⚠️  Falling back to mock data');
        console.warn('💡 Check:');
        console.warn('  1. Is backend running? curl http://localhost:8000/health');
        console.warn('  2. Is API URL correct?', process.env.EXPO_PUBLIC_API_URL);
        console.warn('  3. Check Network tab for CORS or connection errors');
      }
    } else {
      console.log('📝 Using mock data (LIVE_SEARCH_ENABLED is false)');
      console.log('  To enable live search, set EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true');
    }

    // simulate research latency
    const delay = request.priority === 'urgent' ? 2000 : 3500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const mock = buildMockResponse(request);
    return {
      ...mock,
      steps: mock.steps.map(step => ({ ...step, id: `${step.id}-${nanoid(4)}` })),
    };
  },
};
