import { Auto, IPlugin } from '@auto-it/core';
import { spawn } from 'child_process';

export default class BuildExtension implements IPlugin {
  name = 'nexus-build-extension';

  apply(auto: Auto): void {
    auto.hooks.afterVersion.tapPromise(this.name, async () => {
      await this.buildNexusExtension(auto);
    });
    auto.hooks.canary.tapPromise(this.name, async () => {
      await this.buildNexusExtension(auto);
    });
  }

  private buildNexusExtension(auto: Auto): Promise<void> {
    return new Promise((resolve, reject) => {
      const build = spawn(
        `npm run build:libs && npm run build:extension-chrome && npm run -w @nexus-wallet/extension-chrome zip`,
        {
          shell: true,
        },
      );

      build.stdout.on('data', (data) => {
        auto.logger.verbose.info(data.toString());
      });

      build.stderr.on('data', (data) => {
        auto.logger.verbose.info(data.toString());
      });

      build.on('close', (code) => {
        auto.logger.log.info('Nexus extension built successfully.');

        if (code) {
          reject();
        } else {
          resolve();
        }
      });
    });
  }
}
