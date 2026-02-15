export interface SecurityHeadersResult {
  hsts: { present: boolean; value?: string };
  csp: { present: boolean; value?: string };
  xFrameOptions: { present: boolean; value?: string };
  xContentTypeOptions: { present: boolean; value?: string };
  referrerPolicy: { present: boolean; value?: string };
  permissionsPolicy: { present: boolean; value?: string };
  score: number;
}

export interface ScanResultData {
  domain: string;
  subdomains: SubdomainInfo[];
  dns: DnsInfo;
  scanTime: number;
  scannedAt?: string;
  rootSecurityHeaders?: SecurityHeadersResult;
}

export interface SubdomainInfo {
  name: string;
  ips: string[];
  hasCert: boolean;
  certExpiry?: string;
  certValid: boolean;
  securityHeaders?: SecurityHeadersResult;
  technologies?: string[];
}

export interface DnsInfo {
  a: string[];
  aaaa: string[];
  mx: string[];
  txt: string[];
  cname: string[];
}
