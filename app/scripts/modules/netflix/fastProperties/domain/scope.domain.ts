import {IPlatformProperty} from './platformProperty.model';
import {CATEGORY} from '../scope/fastPropertyScopeSearchCategory.service';
import {IImpactCounts} from './impactCounts.interface';

export class Scope {
  [k: string]: any // Index signature
  public env: string;
  public region: string;
  public appId: string;
  public appIdList: string[] = [];
  public stack: string;
  public cluster: string;
  public asg: string;
  public serverId: string;
  public zone: string;
  public instanceCounts: IImpactCounts = <IImpactCounts>{
    down: 0,
    up: 0,
    failed: 0,
    outOfService: 0,
    starting: 0,
    succeeded: 0,
    total: 0,
    unknown: 0
  };

  static build(platformProperty: IPlatformProperty): Scope {
    // platform property has all the property details as well as the scope. We only want the scope.
    // Object.assign(new Scope(), platformProperty) brings the whole platform property into scope.
    let scope = new Scope();
    scope.env = platformProperty.env;
    scope.region = platformProperty.region;
    scope.appId = platformProperty.appId;
    scope.stack = platformProperty.stack;
    scope.asg = platformProperty.asg;
    scope.serverId = platformProperty.serverId;
    scope.zone = platformProperty.zone;
    scope.cluster = platformProperty.cluster;
    return scope;
  }

  public getCategory() {
    if (this.serverId) { return CATEGORY.INSTANCES; }
    if (this.zone || this.asg) { return CATEGORY.SERVER_GROUPS; }
    if (this.cluster) { return CATEGORY.CLUSTERS; }
    if (this.stack) { return CATEGORY.STACK; }
    if (this.region) { return CATEGORY.REGIONS; }
    if (this.appId) { return CATEGORY.APPLICATIONS; }
    return CATEGORY.GLOBAL;
  }

  public forSubmit(env: string): Scope {
    let copy: Scope = Object.assign({}, this);
    copy.env = env;
    copy.appIdList = [this.appId];
    delete copy.instanceCounts;
    delete copy.appId;
    return copy;
  }

}
