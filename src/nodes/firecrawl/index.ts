import { NodePlugin } from '@/types/node-plugin';
import { Database as DatabaseIcon } from 'lucide-react';
import FirecrawlApp from '@mendable/firecrawl-js';

// Helper to get env-style variables the Flow Builder uses
function getEnvVars() {
  try {
    return JSON.parse(localStorage.getItem('flow-env-vars') || '{}');
  } catch {
    return {} as Record<string, string>;
  }
}

function extractHtmlFromPage(page: any): string | null {
  // Firecrawl responses may differ; try common locations
  return (
    page?.html || page?.content?.html || page?.data?.html || null
  );
}

function mapHtmlToRecord(html: string, mapping: Record<string, string>) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const record: Record<string, any> = {};

  Object.entries(mapping).forEach(([field, selector]) => {
    try {
      const el = doc.querySelector(String(selector));
      record[field] = el?.textContent?.trim() ?? null;
    } catch {
      record[field] = null;
    }
  });

  return record;
}

export const firecrawlNode: NodePlugin = {
  type: 'firecrawl-action',
  name: 'Firecrawl',
  description: 'Scrape pages, search by ID, and crawl records with Firecrawl',
  category: 'action',
  icon: DatabaseIcon,
  color: '#2563EB',
  inputs: [
    {
      name: 'action',
      label: 'Action',
      type: 'select',
      required: true,
      default: 'scrape-url',
      options: [
        { label: 'Scrape URL', value: 'scrape-url', description: 'Scrape a single URL' },
        { label: 'Search by ID', value: 'search-by-id', description: 'Find a record by ID across crawled pages' },
        { label: 'Crawl All', value: 'crawl-all', description: 'Crawl all records from a base URL' },
        { label: 'Custom API Call', value: 'custom-api-call', description: 'Make a custom HTTP request' },
      ],
      description: 'Choose how to interact with your data',
    },
    {
      name: 'apiKey',
      label: 'API Key',
      type: 'select',
      required: true,
      description: 'Firecrawl API key (from flow-env-vars or localStorage)',
      dynamic: true,
      dynamicOptions: () => {
        const envVars = getEnvVars();
        const opts = Object.keys(envVars)
          .filter((k) => k.includes('FIRECRAWL_API_KEY'))
          .map((k) => ({ label: `Env • ${k}`, value: k, description: 'Firecrawl API Key from env vars' }));
        // Offer local key option used by FirecrawlService
        opts.push({ label: 'Local • firecrawl_api_key', value: '__local__', description: 'Use key from localStorage' });
        return opts;
      },
    },
    {
      name: 'url',
      label: 'URL',
      type: 'text',
      description: 'Target URL to scrape (for Scrape URL action)'
    },
    {
      name: 'baseUrl',
      label: 'Base URL',
      type: 'text',
      description: 'Root URL to crawl (for Crawl All / Search by ID)'
    },
    {
      name: 'limit',
      label: 'Max Pages',
      type: 'number',
      default: 50,
      description: 'Maximum number of pages to crawl'
    },
    {
      name: 'idSelector',
      label: 'ID CSS Selector',
      type: 'text',
      description: 'CSS selector that identifies the record ID within a page (for Search by ID)'
    },
    {
      name: 'recordId',
      label: 'Record ID',
      type: 'text',
      description: 'ID value to match when searching'
    },
    {
      name: 'fieldsMapping',
      label: 'Fields Mapping (JSON)',
      type: 'code',
      language: 'json',
      placeholder: '{\n  "title": "h1",\n  "price": ".price",\n  "description": ".content p"\n}'
    },
    {
      name: 'customUrl',
      label: 'Endpoint or Full URL',
      type: 'text',
      description: 'Relative path (e.g., /scrape) or full URL. If a path is provided, it will use https://api.firecrawl.dev/v1 as base.'
    },
    {
      name: 'method',
      label: 'HTTP Method',
      type: 'select',
      default: 'GET',
      options: [
        { label: 'GET', value: 'GET' },
        { label: 'POST', value: 'POST' },
        { label: 'PUT', value: 'PUT' },
        { label: 'DELETE', value: 'DELETE' },
        { label: 'PATCH', value: 'PATCH' },
      ],
      description: 'HTTP method for the API call'
    },
    {
      name: 'headers',
      label: 'Headers (JSON)',
      type: 'code',
      language: 'json',
      placeholder: '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer your-token"\n}',
      description: 'HTTP headers as JSON object'
    },
    {
      name: 'body',
      label: 'Request Body (JSON)',
      type: 'code',
      language: 'json',
      placeholder: '{\n  "key": "value"\n}',
      description: 'Request body for POST/PUT/PATCH requests'
    },
    {
      name: 'timeout',
      label: 'Timeout (seconds)',
      type: 'number',
      default: 30,
      description: 'Request timeout in seconds (default: 30)'
    }
  ],
  outputs: [
    { name: 'records', type: 'array', description: 'List of mapped records' },
    { name: 'record', type: 'object', description: 'Single matched record (search/scrape)' },
    { name: 'total', type: 'number', description: 'Total pages processed' },
    { name: 'fullData', type: 'array', description: 'Raw Firecrawl response data' },
    { name: 'response', type: 'object', description: 'API response data (for custom API calls)' },
    { name: 'status', type: 'number', description: 'HTTP status code' },
  ],
  async execute(inputs) {
    const { action, apiKey, url, baseUrl, limit = 50, idSelector, recordId, fieldsMapping, customUrl, method = 'GET', headers, body, timeout = 30 } = inputs;

    // Resolve API key
    const envVars = getEnvVars();
    let key: string | null = null;
    if (apiKey === '__local__') {
      key = localStorage.getItem('firecrawl_api_key');
    } else if (apiKey && envVars[apiKey]) {
      key = envVars[apiKey];
    }
    if (!key) {
      throw new Error('Firecrawl API key not found. Set it in flow-env-vars or localStorage as "firecrawl_api_key".');
    }

    // Parse fields mapping
    let mapping: Record<string, string> = {};
    if (fieldsMapping) {
      try {
        mapping = typeof fieldsMapping === 'string' ? JSON.parse(fieldsMapping) : fieldsMapping;
      } catch (e: any) {
        throw new Error(`Invalid Fields Mapping JSON: ${e.message}`);
      }
    }

    const app = new FirecrawlApp({ apiKey: key });

    const crawl = async (targetUrl: string, maxPages: number) => {
      const timeoutMs = Number(timeout) * 1000;
      const crawlPromise = app.crawlUrl(targetUrl, {
        limit: Number(maxPages) || 50,
        scrapeOptions: { formats: ['html'] },
      } as any);

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Request timeout after ${timeout} seconds`)), timeoutMs);
      });

      const res: any = await Promise.race([crawlPromise, timeoutPromise]);
      if (!res?.success) {
        const err = (res && (res.error || res.message)) || 'Failed to crawl';
        throw new Error(`Firecrawl error: ${err}`);
      }
      const pages = Array.isArray(res.data) ? res.data : [];
      return pages;
    };

    const mapPages = (pages: any[]) => {
      return pages.map((p) => {
        const html = extractHtmlFromPage(p);
        if (!html) return {};
        return mapping && Object.keys(mapping).length > 0
          ? mapHtmlToRecord(html, mapping)
          : { html }; // fallback to raw html when mapping not provided
      });
    };

    if (action === 'scrape-url') {
      if (!url) throw new Error('URL is required for Scrape URL');
      const pages = await crawl(url, 1);
      const records = mapPages(pages);
      return {
        records,
        record: records[0] || null,
        total: pages.length,
        fullData: pages,
      };
    }

    if (action === 'crawl-all') {
      if (!baseUrl) throw new Error('Base URL is required for Crawl All');
      const pages = await crawl(baseUrl, limit);
      const records = mapPages(pages);
      return { records, total: pages.length, fullData: pages } as any;
    }

    if (action === 'search-by-id') {
      if (!baseUrl) throw new Error('Base URL is required for Search by ID');
      if (!recordId) throw new Error('Record ID is required for Search by ID');
      const pages = await crawl(baseUrl, limit);
      const records = mapPages(pages);

      // Try to find a matching record by idSelector, or fallback to page text contains
      let found: any = null;
      if (idSelector) {
        for (const page of pages) {
          const html = extractHtmlFromPage(page);
          if (!html) continue;
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const el = doc.querySelector(String(idSelector));
          const idVal = el?.textContent?.trim();
          if (idVal === String(recordId)) {
            found = mapping && Object.keys(mapping).length > 0 ? mapHtmlToRecord(html, mapping) : { html };
            break;
          }
        }
      }
      if (!found) {
        // Fallback search
        for (const page of pages) {
          const html = extractHtmlFromPage(page);
          if (html && html.includes(String(recordId))) {
            found = mapping && Object.keys(mapping).length > 0 ? mapHtmlToRecord(html, mapping) : { html };
            break;
          }
        }
      }

      return { record: found, records, total: pages.length, fullData: pages } as any;
    }

    if (action === 'custom-api-call') {
      if (!customUrl) throw new Error('API URL is required for Custom API Call');

      const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';
      const target = String(customUrl || '').trim();
      const targetUrl = target.startsWith('http')
        ? target
        : `${FIRECRAWL_BASE_URL}/${target.replace(/^\/+/, '')}`;

      // Parse headers
      let requestHeaders: Record<string, string> = {};
      if (headers) {
        try {
          requestHeaders = typeof headers === 'string' ? JSON.parse(headers) : headers;
        } catch (e: any) {
          throw new Error(`Invalid Headers JSON: ${e.message}`);
        }
      }

      // Parse body
      let requestBody: any = undefined;
      if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        try {
          requestBody = typeof body === 'string' ? JSON.parse(body) : body;
        } catch (e: any) {
          throw new Error(`Invalid Body JSON: ${e.message}`);
        }
      }

      // Make the API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), Number(timeout) * 1000);

      const fetchOptions: RequestInit = {
        method: method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          ...requestHeaders,
        },
        signal: controller.signal,
      };

      if (requestBody !== undefined) {
        fetchOptions.body = JSON.stringify(requestBody);
      }

      try {
        const response = await fetch(targetUrl, fetchOptions);
        clearTimeout(timeoutId);
        const responseData = await response.json().catch(() => ({}));

        return {
          response: responseData,
          status: response.status,
          record: responseData,
          fullData: [responseData],
        };
      } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${timeout} seconds`);
        }
        throw new Error(`API call failed: ${error.message}`);
      }
    }

    throw new Error(`Unknown action: ${action}`);
  },
};
