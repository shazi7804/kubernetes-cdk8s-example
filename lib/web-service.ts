import { Construct, Node } from 'constructs';
import { Deployment, Service, IntOrString } from '../imports/k8s';

export interface WebServiceOptions {
  readonly image: string;
  readonly replicas?: number;
  readonly port?: number;
  readonly containerPort?: number;
}

export class WebService extends Construct {
  constructor(scope: Construct, ns: string, options: WebServiceOptions) {
    super(scope, ns);

    const port = options.port || 80;
    const containerPort = options.containerPort || 8080;
    const label = { app: Node.of(this).uniqueId };
    const replicas = options.replicas ?? 1;

    new Service(this, 'service', {
      spec: {
        type: 'LoadBalancer',
        ports: [ { port, targetPort: IntOrString.fromNumber(containerPort) } ],
        selector: label
      }
    });
  
    new Deployment(this, 'deployment', {
      spec: {
        replicas,
        selector: {
          matchLabels: label
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'web',
                image: options.image,
                ports: [ { containerPort } ]
              }
            ]
          }
        }
      }
    });
  }
}