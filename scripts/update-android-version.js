const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const buildGradlePath = path.join(rootDir, 'android', 'app', 'build.gradle');
const packageJsonPath = path.join(rootDir, 'package.json');
const appJsonPath = path.join(rootDir, 'app.json');

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));

const writeJson = (filePath, content) => {
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
};

const readBuildVersions = (buildGradleContent) => {
  const versionCodeMatch = buildGradleContent.match(/versionCode\s+(\d+)/);
  const versionNameMatch = buildGradleContent.match(/versionName\s+"([^"]+)"/);

  if (!versionCodeMatch || !versionNameMatch) {
    throw new Error('Nao foi possivel localizar versionCode/versionName em android/app/build.gradle');
  }

  return {
    versionCode: Number(versionCodeMatch[1]),
    versionName: versionNameMatch[1],
  };
};

const incrementPatchVersion = (versionName) => {
  const parts = String(versionName).trim().split('.');

  if (parts.length !== 3 || parts.some((part) => !/^\d+$/.test(part))) {
    throw new Error('Nao foi possivel calcular a proxima version automaticamente. Ajuste a versao manualmente para o formato x.y.z');
  }

  const [major, minor, patch] = parts.map(Number);
  return `${major}.${minor}.${patch + 1}`;
};

const updateBuildGradle = (buildGradleContent, versionCode, versionName) => {
  const withCode = buildGradleContent.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
  return withCode.replace(/versionName\s+"[^"]+"/, `versionName "${versionName}"`);
};

const compareVersions = (v1, v2) => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
};

const run = () => {
  const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  const packageJson = readJson(packageJsonPath);
  const appJson = readJson(appJsonPath);
  const current = readBuildVersions(buildGradleContent);

  // Verificar sincronização entre os 3 arquivos
  const buildVersion = current.versionName;
  const appVersion = appJson.expo?.version || packageJson.version;
  const pkgVersion = packageJson.version;

  const versionsMatch = buildVersion === appVersion && appVersion === pkgVersion;

  if (!versionsMatch) {
    // Se desincronizadas, usar a versão MENOR como base para sincronização
    const versions = [buildVersion, appVersion, pkgVersion];
    const sortedVersions = versions.sort(compareVersions);
    const syncVersion = sortedVersions[0];

    console.log(`⚠️  Versões desincronizadas detectadas:`);
    console.log(`   build.gradle:  ${buildVersion}`);
    console.log(`   app.json:      ${appVersion}`);
    console.log(`   package.json:  ${pkgVersion}`);
    console.log(`   Sincronizando com a versão MENOR: ${syncVersion}`);

    // Sincronizar build.gradle
    const syncedBuildGradle = updateBuildGradle(buildGradleContent, current.versionCode, syncVersion);
    fs.writeFileSync(buildGradlePath, syncedBuildGradle, 'utf8');

    // Sincronizar app.json
    if (!appJson.expo) {
      appJson.expo = {};
    }
    appJson.expo.version = syncVersion;
    writeJson(appJsonPath, appJson);

    // Sincronizar package.json
    packageJson.version = syncVersion;
    writeJson(packageJsonPath, packageJson);

    console.log(`✓ Sincronização concluída para versão ${syncVersion}\n`);
  }

  // Agora incrementar a versão sincronizada
  const syncedBuildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  const syncedCurrent = readBuildVersions(syncedBuildGradleContent);
  const nextVersionCode = syncedCurrent.versionCode + 1;
  const nextVersionName = incrementPatchVersion(syncedCurrent.versionName);

  fs.writeFileSync(buildGradlePath, updateBuildGradle(syncedBuildGradleContent, nextVersionCode, nextVersionName), 'utf8');

  packageJson.version = nextVersionName;
  writeJson(packageJsonPath, packageJson);

  if (!appJson.expo) {
    appJson.expo = {};
  }

  appJson.expo.version = nextVersionName;
  writeJson(appJsonPath, appJson);

  console.log(`versionName: ${syncedCurrent.versionName} -> ${nextVersionName}`);
  console.log(`versionCode: ${syncedCurrent.versionCode} -> ${nextVersionCode}`);
};

try {
  run();
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}