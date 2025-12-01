const { withAppBuildGradle } = require('expo/config-plugins');

/**
 * Config plugin to exclude old Android Support Library dependencies
 * that conflict with AndroidX and add packaging options to handle duplicates
 */
const withAndroidSupportExclusions = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      let buildGradle = config.modResults.contents;
      
      // Check if we already added the exclusions
      const hasExclusions = buildGradle.includes('exclude group: \'com.android.support\'');
      const hasPackaging = buildGradle.includes('packagingOptions') || buildGradle.includes('packaging {');
      
      // Find the android block
      const androidBlockRegex = /(android\s*\{)/;
      const match = buildGradle.match(androidBlockRegex);
      
      if (match) {
        const insertIndex = match.index + match[0].length;
        let additions = '';
        
        // Add configurations block if not present
        if (!hasExclusions) {
          additions += `
    configurations.all {
        exclude group: 'com.android.support', module: 'support-compat'
        exclude group: 'com.android.support', module: 'support-core-utils'
        exclude group: 'com.android.support', module: 'support-core-ui'
        exclude group: 'com.android.support', module: 'support-fragment'
        exclude group: 'com.android.support', module: 'support-v4'
        exclude group: 'com.android.support', module: 'versionedparcelable'
        exclude group: 'com.android.support', module: 'appcompat-v7'
        exclude group: 'com.android.support', module: 'animated-vector-drawable'
        exclude group: 'com.android.support', module: 'support-vector-drawable'
    }
`;
        }
        
        // Add packaging block if not present
        if (!hasPackaging) {
          additions += `
    packaging {
        resources {
            excludes += [
                'META-INF/androidx.appcompat_appcompat.version',
                'META-INF/androidx.legacy_legacy-support-core-utils.version',
                'META-INF/androidx.legacy_legacy-support-core-ui.version',
                'META-INF/androidx.fragment_fragment.version',
                'META-INF/androidx.vectordrawable_vectordrawable.version',
                'META-INF/androidx.vectordrawable_vectordrawable-animated.version',
                'META-INF/DEPENDENCIES',
                'META-INF/LICENSE',
                'META-INF/LICENSE.txt',
                'META-INF/license.txt',
                'META-INF/NOTICE',
                'META-INF/NOTICE.txt',
                'META-INF/notice.txt',
                'META-INF/ASL2.0',
                'META-INF/*.kotlin_module'
            ]
            pickFirsts += [
                'META-INF/androidx.appcompat_appcompat.version'
            ]
        }
    }
`;
        }
        
        if (additions) {
          buildGradle = 
            buildGradle.slice(0, insertIndex) + 
            additions + 
            buildGradle.slice(insertIndex);
          
          config.modResults.contents = buildGradle;
        }
      }
    }
    return config;
  });
};

module.exports = withAndroidSupportExclusions;

