// configLoader.js
import YAML from 'yaml';

export const loadVisualizerConfig = async () => {
  try {
    const response = await fetch('/visualizer-config.yaml');
    const yamlText = await response.text();
    return YAML.parse(yamlText);
  } catch (error) {
    console.error('Error loading configuration:', error);
    return null;
  }
};