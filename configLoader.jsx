// configLoader.js
import YAML from 'yaml';

let config = null;

export const loadConfig = async () => {
  if (config) return config;
  
  try {
    const response = await fetch('/ds-visualizers-config.yaml');
    const yamlText = await response.text();
    config = YAML.parse(yamlText);
    return config;
  } catch (error) {
    console.error('Error loading configuration:', error);
    // Fallback to default config
    config = {
      // Default fallback configuration
    };
    return config;
  }
};

export const getConfig = () => config;