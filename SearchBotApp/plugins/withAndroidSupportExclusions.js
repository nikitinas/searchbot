const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * Config plugin to exclude old Android Support Library dependencies
 * that conflict with AndroidX
 */
const withAndroidSupportExclusions = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;
      
      // Check if we already added the exclusions
      if (buildGradle.includes('exclude group: \'com.android.support\'')) {
        return config;
      }
      
      // Find the android block
      const androidBlockRegex = /(android\s*\{)/;
      const match = buildGradle.match(androidBlockRegex);
      
      if (match) {
        // Insert configurations block right after android {
        const insertIndex = match.index + match[0].length;
        const exclusions = `
    configurations.all {
        exclude group: 'com.android.support', module: 'support-compat'
        exclude group: 'com.android.support', module: 'support-core-utils'
        exclude group: 'com.android.support', module: 'support-core-ui'
        exclude group: 'com.android.support', module: 'support-fragment'
        exclude group: 'com.android.support', module: 'support-v4'
        exclude group: 'com.android.support', module: 'versionedparcelable'
    }
`;
        buildGradle = 
          buildGradle.slice(0, insertIndex) + 
          exclusions + 
          buildGradle.slice(insertIndex);
        
        config.modResults.contents = buildGradle;
      }
    }
    return config;
  });
};

module.exports = withAndroidSupportExclusions;

