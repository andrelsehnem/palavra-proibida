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

const run = () => {
  const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  const packageJson = readJson(packageJsonPath);
  const appJson = readJson(appJsonPath);
  const current = readBuildVersions(buildGradleContent);

  const nextVersionCode = current.versionCode + 1;
  const nextVersionName = incrementPatchVersion(current.versionName);

  fs.writeFileSync(buildGradlePath, updateBuildGradle(buildGradleContent, nextVersionCode, nextVersionName), 'utf8');

  packageJson.version = nextVersionName;
  writeJson(packageJsonPath, packageJson);

  if (!appJson.expo) {
    appJson.expo = {};
  }

  appJson.expo.version = nextVersionName;
  writeJson(appJsonPath, appJson);

  console.log(`versionName: ${current.versionName} -> ${nextVersionName}`);
  console.log(`versionCode: ${current.versionCode} -> ${nextVersionCode}`);
};

try {
  run();
} catch (error) {
  console.error(`Erro: ${error.message}`);
  process.exit(1);
}