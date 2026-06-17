import { execSync } from 'child_process';
import * as fs from 'fs';
import JavaScriptObfuscator from 'javascript-obfuscator';
import * as path from 'path';

interface AngularOutputPathObject {
  base: string;
  browser?: string;
  server?: string;
  media?: string;
}

type AngularOutputPath = string | AngularOutputPathObject;

interface ConfigurationObject {
  outputPath?: AngularOutputPath;
  browser?: string;
}

interface AngularJson {
  defaultProject?: string;
  projects: {
    [key: string]: {
      architect?: {
        build?: {
          options?: ConfigurationObject;
          configurations: {
            [key: string]: ConfigurationObject;
          };
        };
      };
    };
  };
}

const MASTER_CONFIG = {
  production: { host: 'cobrosimple.interbank.pe', isProd: true },
  'legacy-production': { host: 'cobrosimple.interbank.pe', isProd: true },
  uat: { host: 'cobrosimple.uat.interbank.pe', isProd: true },
  development: { host: 'cobrosimple.dev.interbank.pe', isProd: false },
  dev: { host: 'cobrosimple.dev.interbank.pe', isProd: false },
} as const;

type ValidEnvironment = keyof typeof MASTER_CONFIG;

const DEFAULT_HOSTNAME = MASTER_CONFIG['production'].host;

function isValidEnvironment(
  environment: string,
): environment is ValidEnvironment {
  return (Object.keys(MASTER_CONFIG) as ValidEnvironment[]).includes(
    environment as ValidEnvironment,
  );
}

function getSafeConfiguration(environment: string): ValidEnvironment {
  if (!isValidEnvironment(environment)) {
    console.error(
      `Environment [${environment}] is not valid. Valid environments are: ${Object.keys(
        MASTER_CONFIG,
      ).join(', ')}`,
    );
    process.exit(1);
  }
  return environment;
}

function updateHtmlHostnames(configuration: ValidEnvironment) {
  const distDir = getAngularDistDir(configuration);
  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return;
  }

  const targetHostname = MASTER_CONFIG[configuration].host;

  if (!targetHostname || targetHostname === DEFAULT_HOSTNAME) {
    return;
  }

  const htmlContent = fs.readFileSync(indexPath, 'utf8');

  const urlRegex = new RegExp(
    `(href|content)=["'](https?:\/\/${DEFAULT_HOSTNAME}[^"']*)["']`,
    'gi',
  );

  const updatedHtml = htmlContent.replace(
    urlRegex,
    (match, attribute, fullUrl) => {
      try {
        const parsedUrl = new URL(fullUrl as string);
        parsedUrl.host = targetHostname;
        return `${attribute}="${parsedUrl.toString()}"`;
      } catch (_e) {
        return match;
      }
    },
  );

  fs.writeFileSync(indexPath, updatedHtml, 'utf8');
}

function getAngularDistDir(configuration: ValidEnvironment): string {
  const angularJsonPath = path.join(process.cwd(), 'angular.json');

  if (!fs.existsSync(angularJsonPath)) {
    throw new Error('Could not find angular.json file in the project root.');
  }

  const angularJson = JSON.parse(
    fs.readFileSync(angularJsonPath, 'utf8'),
  ) as AngularJson;
  const projectName =
    angularJson.defaultProject || Object.keys(angularJson.projects)[0];

  const project = angularJson.projects[projectName];
  const buildTarget = project.architect?.build;

  if (!buildTarget) {
    throw new Error(
      `Could not find architect.build section for project ${projectName}.`,
    );
  }

  const rawOutputPath =
    buildTarget.configurations?.[configuration]?.outputPath ||
    buildTarget.options?.outputPath;

  if (!rawOutputPath) {
    throw new Error(`Could not determine outputPath in angular.json.`);
  }

  const baseDistPath =
    typeof rawOutputPath === 'object'
      ? rawOutputPath.base || ''
      : rawOutputPath;
  const resolvedPath = path.resolve(process.cwd(), baseDistPath);

  const indexPathInRoot = path.join(resolvedPath, 'index.html');
  const browserFolderPath = path.join(resolvedPath, 'browser');
  const indexPathInBrowser = path.join(browserFolderPath, 'index.html');

  if (!fs.existsSync(indexPathInRoot) && fs.existsSync(indexPathInBrowser)) {
    return browserFolderPath;
  }

  return resolvedPath;
}

function getAllJsFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function runObfuscation(configuration: ValidEnvironment): void {
  try {
    const isRealProduction = MASTER_CONFIG[configuration].isProd;
    const distDir = getAngularDistDir(configuration);
    const jsFiles = getAllJsFiles(distDir);

    if (jsFiles.length === 0) {
      return;
    }

    jsFiles.forEach((filePath) => {
      const originalCode = fs.readFileSync(filePath, 'utf8');

      const obfuscatedResult = JavaScriptObfuscator.obfuscate(originalCode, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,
        debugProtection: isRealProduction,
        debugProtectionInterval: isRealProduction ? 2000 : 0,
        disableConsoleOutput: isRealProduction,
        stringArray: true,
        stringArrayThreshold: 0.75,
      });

      fs.writeFileSync(filePath, obfuscatedResult.getObfuscatedCode(), 'utf8');
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Critical error in the obfuscation process: ${error.message}`,
      );
    }
    throw error;
  }
}

function main() {
  const args = process.argv;
  const configArg = args.find((arg) => arg.startsWith('--configuration='));

  let configuration: string = 'production';

  if (configArg) {
    configuration = configArg.split('=')[1];
  } else {
    const index = args.indexOf('--configuration');
    if (index !== -1 && args[index + 1]) {
      configuration = args[index + 1];
    }
  }

  const safeConfiguration = getSafeConfiguration(configuration);

  try {
    execSync(`npx ng build --configuration=${safeConfiguration}`, {
      stdio: 'inherit',
    });

    updateHtmlHostnames(safeConfiguration);
    runObfuscation(safeConfiguration);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `The build or post-processing process failed: ${error.message}`,
      );
    }
    throw error;
  }
}

main();
