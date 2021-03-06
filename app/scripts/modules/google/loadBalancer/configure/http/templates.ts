export class HttpLoadBalancerTemplate {
  provider = 'gce';
  stack = '';
  detail = '';
  region = 'global';
  loadBalancerType = 'HTTP';
  certificate = '';
  defaultService: BackendServiceTemplate;
  hostRules: HostRuleTemplate[] = [];
  listeners: ListenerTemplate[] = [];

  constructor (public credentials: string | null) {}
}

export class BackendServiceTemplate {
  backends: any[] = [];
  healthCheck: HealthCheckTemplate;
  sessionAffinity = 'NONE';
  affinityCookieTtlSec: number | null = null;
}

export class HealthCheckTemplate {
  requestPath = '/';
  port = 80;
  checkIntervalSec = 10;
  timeoutSec = 5;
  healthyThreshold = 10;
  unhealthyThreshold = 2;
}

export class HostRuleTemplate {
  hostPatterns: string[];
  pathMatcher: PathMatcherTemplate = new PathMatcherTemplate();
}

export class PathMatcherTemplate {
  pathRules: PathRuleTemplate[] = [];
}

export class PathRuleTemplate {
  paths: string[];
}

export class ListenerTemplate {
  name: string;
  port: number;
  certificate: string | null = null;
}
