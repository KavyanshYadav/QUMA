package qumagatewayconfig

import (
	"fmt"
	"strings"
)

func (cfg *GatewayConfig) Validate() error {
	if len(cfg.APIs) == 0 {
		return fmt.Errorf("at least one API definition is required")
	}
	for i, api := range cfg.APIs {
		if err := api.Validate(); err != nil {
			return fmt.Errorf("apis[%d]: %w", i, err)
		}
	}
	return nil
}

func (api *APIConfig) Validate() error {
	if strings.TrimSpace(api.BasePath) == "" {
		return fmt.Errorf("api base_path is required")
	}
	if !strings.HasPrefix(api.BasePath, "/") {
		return fmt.Errorf("api base_path must start with '/'")
	}
	if len(api.Endpoints) == 0 {
		return fmt.Errorf("api %q must define at least one endpoint", api.Name)
	}
	for i, ep := range api.Endpoints {
		if err := ep.Validate(); err != nil {
			return fmt.Errorf("endpoint[%d]: %w", i, err)
		}
	}
	return nil
}

func (ep *Endpoint) Validate() error {
	if strings.TrimSpace(ep.Path) == "" {
		return fmt.Errorf("endpoint path is required")
	}
	if !strings.HasPrefix(ep.Path, "/") {
		return fmt.Errorf("endpoint path must start with '/'")
	}
	if ep.Method == "" {
		ep.Method = "GET"
	}
	if len(ep.Backend) == 0 && ep.StaticResponse == nil {
		return fmt.Errorf("endpoint %q must have either backend or static_response", ep.Name)
	}
	for i, b := range ep.Backend {
		if err := b.Validate(); err != nil {
			return fmt.Errorf("backend[%d]: %w", i, err)
		}
	}
	return nil
}

func (b *Backend) Validate() error {
	if strings.TrimSpace(b.Host) == "" {
		return fmt.Errorf("backend host is required")
	}
	if !strings.HasPrefix(b.Host, "http://") && !strings.HasPrefix(b.Host, "https://") {
		return fmt.Errorf("backend host must start with http:// or https://")
	}
	return nil
}
