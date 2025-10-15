import { Tracking } from './CampaignPreview.types';

export function generatePreviewUrl(tracking?: Tracking) {
  if (!tracking?.utmParameters) return '#';
  const { source, medium, campaign, term, content } = tracking.utmParameters;
  const baseUrl = 'https://example.com';
  const params = new URLSearchParams();
  if (source) params.append('utm_source', source);
  if (medium) params.append('utm_medium', medium);
  if (campaign) params.append('utm_campaign', campaign);
  if (term) params.append('utm_term', term);
  if (content) params.append('utm_content', content);
  return `${baseUrl}?${params.toString()}`;
}
