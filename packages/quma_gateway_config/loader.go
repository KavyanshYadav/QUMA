package qumagatewayconfig

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/goccy/go-yaml"
)

func checkPaths(paths []string) (string, error) {
	for _, p := range paths {
		info, err := os.Stat(p)
		if err != nil {
			continue
		}
		if info.IsDir() {
			continue
		}
		return p, nil
	}
	return "", fmt.Errorf("no valid config file found in provided paths")
}

func(c *ConfigManager) ValidateCurrentConfig() error{
	v := c.currentConfig.Load()
	if v == nil {
		return fmt.Errorf("no config loaded")
	}
	cfg, ok := v.(*GatewayConfig)
	if !ok {
		return fmt.Errorf("invalid config type in memory")
	}
	return cfg.Validate()
}


func (c *ConfigManager) load() error {
	var path string
	if c.configfilePath == "" {
		p, err := checkPaths(c.DefaultConfigFilePath)
		if err != nil {
			return err
		}
		path = p
	} else {
		path = c.configfilePath
	}
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(path), "."))
	switch ext {
	case "json":
		return c.JSONloader(path)
	case "yaml", "yml":
		return c.YAMLloader(path)
	default:
		return fmt.Errorf("unsupported config extension: %s", ext)
	}

}

func (c *ConfigManager) YAMLloader(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read yaml file %q: %w", path, err)
	}
	var cfg GatewayConfig
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return fmt.Errorf("unmarshal yaml file %q: %w", path, err)
	}
	c.currentConfig.Store(&cfg)
	return nil
}

func (c *ConfigManager) JSONloader(path string) error {
	data, err := os.ReadFile(path)
	if err != nil {
		return fmt.Errorf("read json file %q: %w", path, err)
	}
	var cfg GatewayConfig
	if err := json.Unmarshal(data, &cfg); err != nil {
		return fmt.Errorf("unmarshal json file %q: %w", path, err)
	}
	c.currentConfig.Store(&cfg)
	return nil
}