import JavaScriptObfuscator from 'javascript-obfuscator';
import * as fs from 'fs';
import * as path from 'path';

interface AngularJson {
  defaultProject?: string;
  projects: {
    [key: string]: {
      architect?: {
        build?: {
          options?: {
            outputPath?: string;
            browser?: string;
          };
        };
      };
    };
  };
}

function getAngularDistDir(): string {
  const angularJsonPath = path.join(__dirname, 'angular.json');

  if (!fs.existsSync(angularJsonPath)) {
    throw new Error('No se encontró el archivo angular.json en la raíz del proyecto.');
  }

  const angularJson: AngularJson = JSON.parse(fs.readFileSync(angularJsonPath, 'utf8'));

  const projectName = angularJson.defaultProject || Object.keys(angularJson.projects)[0];
  if (!projectName) {
    throw new Error('No se encontraron proyectos definidos en angular.json.');
  }

  const project = angularJson.projects[projectName];
  const buildOptions = project.architect?.build?.options;

  if (!buildOptions || !buildOptions.outputPath) {
    throw new Error(`No se pudo determinar el outputPath para el proyecto: ${projectName}`);
  }

  const baseOutputPath = buildOptions.outputPath;

  if (buildOptions.browser) {
    return path.join(__dirname, baseOutputPath, 'browser');
  }

  return path.join(__dirname, baseOutputPath);
}

function getAllJsFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    console.error(`❌ El directorio no existe: ${dir}`);
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

function runObfuscation(): void {
  try {
 let comandoCompleto = '';
     try {
       if (process.platform === 'win32') {
         comandoCompleto = execSync(`wmic process where ProcessId=${process.ppid} get CommandLine`, { encoding: 'utf8' });
       } else {
         comandoCompleto = execSync(`ps -p ${process.ppid} -o command=`, { encoding: 'utf8' });
       }
     } catch (e) {
       comandoCompleto = process.env.npm_lifecycle_script || '';
     }

     console.log(`📋 Comando base detectado en el sistema: ${comandoCompleto.trim()}`);

     const esProduccionReal =
       comandoCompleto.includes('production') ||
       comandoCompleto.includes('legacy-production');

    console.log('⚡ Leyendo configuración de angular.json...');
    const distDir = getAngularDistDir();
    console.log(`📂 Carpeta de producción detectada: ${distDir}`);

    if (esProduccionReal) {
      console.log('🔒 Modo Producción Detectado: Se aplicará el bloqueo agresivo de DevTools (debuggers).');
    } else {
      console.log('🔓 Modo No-Producción (UAT/Dev): Ofuscación ligera activada. DevTools permitido.');
    }

    console.log('🚀 Iniciando post-procesamiento de ofuscación...');
    const jsFiles = getAllJsFiles(distDir);

    if (jsFiles.length === 0) {
      console.log('⚠️ No se encontraron archivos JavaScript para ofuscar.');
      return;
    }

    jsFiles.forEach((filePath) => {
      const fileName = path.basename(filePath);
      console.log(`Ofuscando: ${fileName}`);

      const originalCode = fs.readFileSync(filePath, 'utf8');

      const obfuscatedResult = JavaScriptObfuscator.obfuscate(originalCode, {
        compact: true,
        controlFlowFlattening: false,
        deadCodeInjection: false,

        debugProtection: esProduccionReal,
        debugProtectionInterval: esProduccionReal ? 2000 : 0,

        disableConsoleOutput: esProduccionReal,

        stringArray: true,
        stringArrayThreshold: 0.75,
      });

      fs.writeFileSync(filePath, obfuscatedResult.getObfuscatedCode(), 'utf8');
    });

    console.log('✨ ¡Ofuscación de producción finalizada con éxito!');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Error crítico en el proceso de ofuscación: ${errorMessage}`);
    process.exit(1);
  }
}



runObfuscation();
