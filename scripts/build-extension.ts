import { Auto, IPlugin } from '@auto-it/core';
import { execSync } from 'child_process';

export default class BuildExtension implements IPlugin {
  name = 'nexus-build-extension';

  apply(auto: Auto): void {
    auto.hooks.afterVersion.tapPromise(this.name, async () => {
      execSync('npm run build:libs');
      execSync('npm run build:extension-chrome');
      execSync('npm run -w @nexus-wallet/extension-chrome zip');
    });
  }
}
