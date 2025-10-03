// Types de base pour l'application AI4Local

export type Language = 'fr' | 'mg';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  language: Language;
  role: UserRole;
  companyId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PME_OWNER = 'PME_OWNER',
  PME_EMPLOYEE = 'PME_EMPLOYEE',
  TRAINER = 'TRAINER',
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  sector: CompanySector;
  location: MadagascarRegion;
  size: CompanySize;
  phoneNumber?: string;
  website?: string;
  socialMedia?: SocialMediaLinks;
  subscription?: Subscription;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CompanySector {
  AGRICULTURE = 'AGRICULTURE',
  ARTISANAT = 'ARTISANAT',
  COMMERCE = 'COMMERCE',
  RESTAURATION = 'RESTAURATION',
  SERVICES = 'SERVICES',
  TOURISME = 'TOURISME',
  TEXTILE = 'TEXTILE',
  TRANSPORT = 'TRANSPORT',
  AUTRES = 'AUTRES',
}

export enum CompanySize {
  MICRO = 'MICRO', // 1-5 employés
  PETITE = 'PETITE', // 6-20 employés
  MOYENNE = 'MOYENNE', // 21-100 employés
}

export enum MadagascarRegion {
  ANALAMANGA = 'ANALAMANGA',
  VAKINANKARATRA = 'VAKINANKARATRA',
  ITASY = 'ITASY',
  BONGOLAVA = 'BONGOLAVA',
  HAUTE_MATSIATRA = 'HAUTE_MATSIATRA',
  AMORON_I_MANIA = 'AMORON_I_MANIA',
  VATOVAVY_FITOVINANY = 'VATOVAVY_FITOVINANY',
  IHOROMBE = 'IHOROMBE',
  ATSIMO_ATSINANANA = 'ATSIMO_ATSINANANA',
  ATSINANANA = 'ATSINANANA',
  ANALANJIROFO = 'ANALANJIROFO',
  ALAOTRA_MANGORO = 'ALAOTRA_MANGORO',
  BOENY = 'BOENY',
  SOFIA = 'SOFIA',
  BETSIBOKA = 'BETSIBOKA',
  MELAKY = 'MELAKY',
  ATSIMO_ANDREFANA = 'ATSIMO_ANDREFANA',
  ANDROY = 'ANDROY',
  ANOSY = 'ANOSY',
  MENABE = 'MENABE',
  DIANA = 'DIANA',
  SAVA = 'SAVA',
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
}

export interface AIContentRequest {
  id: string;
  userId: string;
  companyId: string;
  type: ContentType;
  prompt: string;
  language: Language;
  parameters: AIContentParameters;
  status: ContentStatus;
  result?: AIContentResult;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContentType {
  TEXT_POST = 'TEXT_POST',
  IMAGE_POST = 'IMAGE_POST',
  VIDEO_SCRIPT = 'VIDEO_SCRIPT',
  EMAIL_CAMPAIGN = 'EMAIL_CAMPAIGN',
  PRODUCT_DESCRIPTION = 'PRODUCT_DESCRIPTION',
  BLOG_ARTICLE = 'BLOG_ARTICLE',
}

export enum ContentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface AIContentParameters {
  tone?: string; // 'professionnel', 'amical', 'promotionnel'
  targetAudience?: string;
  keywords?: string[];
  imageStyle?: string; // pour les images
  maxLength?: number;
}

export interface AIContentResult {
  text?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  confidence?: number;
}

export interface Subscription {
  id: string;
  companyId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  autoRenew: boolean;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number; // en MGA
  currency: 'MGA';
  duration: number; // en jours
  features: PlanFeature[];
  maxUsers: number;
  maxContentRequests: number;
  isActive: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
}

export enum PaymentMethod {
  ORANGE_MONEY = 'ORANGE_MONEY',
  AIRTEL_MONEY = 'AIRTEL_MONEY',
  TELMA_MONEY = 'TELMA_MONEY',
  MVOLA = 'MVOLA',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: 'MGA';
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  phoneNumber?: string;
  createdAt: Date;
  processedAt?: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  language: Language;
  level: TrainingLevel;
  duration: number; // en minutes
  content: TrainingContent[];
  quizzes?: Quiz[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TrainingLevel {
  DEBUTANT = 'DEBUTANT',
  INTERMEDIAIRE = 'INTERMEDIAIRE',
  AVANCE = 'AVANCE',
}

export interface TrainingContent {
  id: string;
  type: ContentMediaType;
  title: string;
  content?: string; // pour text/markdown
  url?: string; // pour video/audio/image
  order: number;
}

export enum ContentMediaType {
  TEXT = 'TEXT',
  MARKDOWN = 'MARKDOWN',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  INTERACTIVE = 'INTERACTIVE',
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // pourcentage
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TRUE_FALSE = 'TRUE_FALSE',
  OPEN_TEXT = 'OPEN_TEXT',
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  status: ProgressStatus;
  progress: number; // pourcentage
  score?: number;
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

export enum ProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Types d'erreur API
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Types de réponse API standardisés
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// Configuration offline
export interface OfflineConfig {
  maxCacheSize: number; // en MB
  syncInterval: number; // en minutes
  compressionLevel: number; // 1-9
  essentialDataTypes: string[];
}
