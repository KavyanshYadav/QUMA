package qumagatewayconfig

import (
	"os"
	"path/filepath"
	"testing"
)

func createTempFile(t *testing.T, content string, ext string) string {
	t.Helper()
	tmp := t.TempDir()
	path := filepath.Join(tmp, "config."+ext)
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		t.Fatalf("failed to write temp file: %v", err)
	}
	return path
}

func TestConfigManager_LoadAndValidate(t *testing.T) {
	yamlConfig := `
version: "1"
server:
  addr: ":8080"
apis:
  - name: "users"
    base_path: "/api/v1"
    endpoints:
      - name: "get-user"
        path: "/users/{id}"
        method: "GET"
        backend:
          - host: "https://example.com"
            uri: "/v1/users/{id}"
`
	jsonConfig := `{
  "version": "1",
  "server": {"addr": ":8080"},
  "apis": [
    {
      "name": "users",
      "base_path": "/api/v1",
      "endpoints": [
        {
          "name": "get-user",
          "path": "/users/{id}",
          "method": "GET",
          "backend": [{"host": "https://example.com", "uri": "/v1/users/{id}"}]
        }
      ]
    }
  ]
}`

	tests := []struct {
		name string
		ext  string
		data string
	}{
		{"YAML Load + Validate", "yaml", yamlConfig},
		{"JSON Load + Validate", "json", jsonConfig},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			path := createTempFile(t, tt.data, tt.ext)
			mgr := &ConfigManager{
				configfilePath: path,
			}
			if err := mgr.load(); err != nil {
				t.Fatalf("load failed: %v", err)
			}
			if err := mgr.ValidateCurrentConfig(); err != nil {
				t.Fatalf("validation failed: %v", err)
			}
			cfg := mgr.currentConfig.Load()
			if cfg == nil {
				t.Fatal("expected config to be loaded")
			}
		})
	}
}

func TestConfigManager_InvalidConfig(t *testing.T) {
	badYAML := `
version: "1"
apis:
  - name: "users"
    base_path: "api/v1" # missing leading slash should trigger error
    endpoints:
      - name: "bad"
        path: "/ok"
`
	path := createTempFile(t, badYAML, "yaml")

	mgr := &ConfigManager{
		configfilePath: path,
	}
	if err := mgr.load(); err != nil {
		t.Fatalf("load failed: %v", err)
	}
	if err := mgr.ValidateCurrentConfig(); err == nil {
		t.Fatal("expected validation to fail for bad config, but got nil")
	}
}
