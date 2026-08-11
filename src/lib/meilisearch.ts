import { MeiliSearch } from 'meilisearch';

// 1. Configuration
const HOST =
  import.meta.env.VITE_MEILISEARCH_HOST || 'https://search2.bettergov.ph';
const KEY = import.meta.env.VITE_MEILISEARCH_API_KEY || '';

export const client = new MeiliSearch({
  host: HOST,
  apiKey: KEY,
});

export const INDICES = {
  GENERAL: 'bettergov',
  FLOOD_CONTROL: 'bettergov_flood_control',
  CONTRACTORS: 'contractors',
  PHILGEPS: 'philgeps',
  PHILGEPS_ORGANIZATIONS: 'philgeps_organizations',
} as const;

export interface BetterGovFloodControlRecord {
  GlobalID: string;
  InfraYear: number;
  Region: string;
  Province: string;
  Municipality: string;
  ImplementingOffice: string;
  ProjectID: string;
  ProjectDescription: string;
  ProjectComponentID?: string;
  ProjectComponentDescription?: string;
  Program?: string | null;
  TypeofWork?: string;
  infra_type?: string;
  Longitude?: number;
  Latitude?: number;
  ContractID: string;
  ABC?: number;
  ContractCost?: number;
  CompletionDateOriginal?: number;
  CompletionYear?: number;
  CompletionDateActual?: string;
  StartDate?: string;
  Contractor?: string;
  FundingYear?: string;
  LegislativeDistrict?: string;
  DistrictEngineeringOffice?: string;
  slug?: string;
  _geo?: { lat: number; lng: number };
}

export function normalizeFloodControlProject(
  record: BetterGovFloodControlRecord
): DPWHProject {
  const completed = Boolean(record.CompletionDateActual);
  const started = Boolean(record.StartDate);

  return {
    contractId: record.ContractID || record.ProjectID,
    description:
      record.ProjectDescription || record.ProjectComponentDescription || '',
    category: record.infra_type || record.TypeofWork || 'Flood Control',
    programName: record.Program || '',
    status: completed ? 'Completed' : started ? 'On-Going' : 'Not Yet Started',
    infraType: record.infra_type || record.TypeofWork || 'Flood Control',
    sourceOfFunds: record.FundingYear ? `FY ${record.FundingYear}` : '',
    budget: Number(record.ABC || record.ContractCost || 0),
    amountPaid: Number(record.ContractCost || 0),
    progress: completed ? 100 : 0,
    location: {
      region: record.Region,
      province: record.Province,
      municipality: record.Municipality,
      infraType: record.infra_type || record.TypeofWork || 'Flood Control',
      coordinates: {
        latitude: record._geo?.lat ?? record.Latitude ?? 0,
        longitude: record._geo?.lng ?? record.Longitude ?? 0,
        verified: Boolean(record._geo || record.Latitude || record.Longitude),
      },
    },
    latitude: record._geo?.lat ?? record.Latitude,
    longitude: record._geo?.lng ?? record.Longitude,
    infraYear: record.InfraYear,
    startDate: record.StartDate,
    completionDate: record.CompletionDateActual,
    contractor: record.Contractor || '',
    isVerifiedByDpwh: true,
    isVerifiedByPublic: false,
    isLive: false,
    reportCount: 0,
  };
}

// 2. PhilGEPS Types
export interface PhilgepsDoc {
  id: string;
  reference_id: string;
  contract_no: string;
  award_title: string;
  notice_title: string;
  awardee_name: string;
  organization_name: string;
  area_of_delivery: string;
  business_category: string;
  contract_amount: number | string;
  award_date: string;
  award_status: string;
}

// 3. DPWH Complete Types (Matched to Full API Response)

export interface ProjectComponent {
  componentId: string;
  description: string;
  infraType: string;
  typeOfWork: string;
  region: string;
  province: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    source?: string;
    locationVerified?: boolean;
  };
}

export interface ProjectBidder {
  name: string;
  pcabId?: string;
  participation: number;
  isWinner: boolean;
}

export interface DPWHProject {
  // Identification
  contractId: string;
  description: string;
  category: string;
  programName: string;
  status: string;
  infraType: string;
  sourceOfFunds: string;

  // Financials
  budget: number;
  amountPaid: number;
  progress: number;

  // Location
  location: {
    region: string;
    province: string;
    municipality?: string;
    barangay?: string;
    infraType: string;
    coordinates: {
      latitude: number;
      longitude: number;
      verified: boolean;
    };
  };
  latitude?: number;
  longitude?: number;

  // Timeline
  infraYear: number | string; // API might return string or number
  startDate?: string;
  completionDate?: string;
  contractEffectivityDate?: string;
  expiryDate?: string;
  nysReason?: string; // Reason for Not Yet Started

  // Contractor & Bidding
  contractor: string;
  winnerNames?: string;
  bidders?: ProjectBidder[];

  procurement?: {
    contractName: string;
    abc: string;
    status: string;
    fundingInstrument: string;
    advertisementDate: string;
    bidSubmissionDeadline: string;
    dateOfAward: string;
    awardAmount: string;
  };

  // Verification & Media
  isVerifiedByDpwh: boolean;
  isVerifiedByPublic: boolean;
  isLive: boolean;
  livestreamUrl?: string;
  livestreamVideoId?: string;
  livestreamDetectedAt?: string;
  hasSatelliteImage?: boolean;

  imageSummary?: {
    totalImages: number;
    latestImageDate: string;
    hasImages: boolean;
  };

  // Components
  components?: ProjectComponent[];
  componentCategories?: string[];

  // Documentation
  links?: {
    advertisement?: string;
    contractAgreement?: string;
    noticeOfAward?: string;
    noticeToProceed?: string;
    programOfWork?: string;
    engineeringDesign?: string;
  };

  // Metadata
  reportCount: number;
}
