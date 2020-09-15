import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { WebService } from './lib/web-service';

export class MyChart extends Chart {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new WebService(this, 'laravel-7', {
      image: 'bitnami/laravel:7',
      replicas: 2
    });

  }
}

const app = new App();
new MyChart(app, 'kubernetes-cdk8s-example');
app.synth();
