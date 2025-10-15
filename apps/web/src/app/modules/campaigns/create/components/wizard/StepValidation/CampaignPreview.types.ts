export interface BasicInfo {
  name?: string;
  objective?: string;
  type?: string;
  channels?: string[];
}

export interface MediaFile {
  url: string;
  name: string;
  type: 'image' | 'video' | string;
}

export interface Creatives {
  headline?: string;
  caption?: string;
  callToAction?: string;
  mediaFiles?: MediaFile[];
}

export interface Tracking {
  utmParameters?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  abTestEnabled?: boolean;
  abTestVariants?: ABTestVariant[];
}

export interface ABTestVariant {
  id: string;
  name: string;
  description?: string;
  percentage: number;
  isControl?: boolean;
  overrides?: Partial<Creatives>;
}
