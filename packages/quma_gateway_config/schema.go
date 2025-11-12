package qumagatewayconfig

import "time"

type GatewayConfig struct {
	Version   string            `yaml:"version" json:"version"` // config schema version
	Server    ServerConfig      `yaml:"server" json:"server"`
	APIs      []APIConfig       `yaml:"apis" json:"apis"`
	Plugins   map[string]Plugin `yaml:"plugins,omitempty" json:"plugins,omitempty"` // plugin global config keyed by name
	Defaults  Defaults         `yaml:"defaults,omitempty" json:"defaults,omitempty"`
}

type ServerConfig struct {
	Addr         string        `yaml:"addr" json:"addr"`
	ReadTimeout  Duration      `yaml:"read_timeout,omitempty" json:"read_timeout,omitempty"`
	WriteTimeout Duration      `yaml:"write_timeout,omitempty" json:"write_timeout,omitempty"`
	IdleTimeout  Duration      `yaml:"idle_timeout,omitempty" json:"idle_timeout,omitempty"`
	CertFile     string        `yaml:"cert_file,omitempty" json:"cert_file,omitempty"`
	KeyFile      string        `yaml:"key_file,omitempty" json:"key_file,omitempty"`
}

type Defaults struct {
	Timeout    Duration `yaml:"timeout,omitempty" json:"timeout,omitempty"`
	Retry      Retry    `yaml:"retry,omitempty" json:"retry,omitempty"`
	Cache      Cache    `yaml:"cache,omitempty" json:"cache,omitempty"`
	HTTPClient HTTPClientConfig `yaml:"http_client,omitempty" json:"http_client,omitempty"`
}

type APIConfig struct {
	Name      string       `yaml:"name" json:"name"`
	BasePath  string       `yaml:"base_path" json:"base_path"` // e.g. /api/v1
	Endpoints []Endpoint   `yaml:"endpoints" json:"endpoints"`
	Middleware []string    `yaml:"middleware,omitempty" json:"middleware,omitempty"` // names of server plugins/middleware
}

type Endpoint struct {
	Name         string             `yaml:"name" json:"name"`
	Path         string             `yaml:"path" json:"path"` // path relative to API base path, can include params
	Method       string             `yaml:"method,omitempty" json:"method,omitempty"`
	Backend      []Backend          `yaml:"backend" json:"backend"`
	Timeout      *Duration          `yaml:"timeout,omitempty" json:"timeout,omitempty"`
	Cache        *Cache             `yaml:"cache,omitempty" json:"cache,omitempty"`
	StaticResponse *StaticResponse  `yaml:"static_response,omitempty" json:"static_response,omitempty"` // useful for mocks
	ProxyRules   []ProxyRule        `yaml:"proxy_rules,omitempty" json:"proxy_rules,omitempty"` // transformations, mapping
	Plugins      []string           `yaml:"plugins,omitempty" json:"plugins,omitempty"` // per-endpoint plugin names
}

type Backend struct {
	Name       string   `yaml:"name" json:"name"`
	Host       string   `yaml:"host" json:"host"`      // scheme://host[:port]
	URI        string   `yaml:"uri,omitempty" json:"uri,omitempty"`        // path to append
	Method     string   `yaml:"method,omitempty" json:"method,omitempty"`
	Timeout    *Duration `yaml:"timeout,omitempty" json:"timeout,omitempty"`
	Retry      *Retry   `yaml:"retry,omitempty" json:"retry,omitempty"`
	HealthCheck *HealthCheck `yaml:"health_check,omitempty" json:"health_check,omitempty"`
	Headers    map[string]string `yaml:"headers,omitempty" json:"headers,omitempty"`
}

type ProxyRule struct {
	Type       string                 `yaml:"type" json:"type"` // e.g., "header", "jsonpath", "body", "status"
	Operation  string                 `yaml:"operation,omitempty" json:"operation,omitempty"` // "add", "remove", "replace", "copy"
	Source     string                 `yaml:"source,omitempty" json:"source,omitempty"`
	Target     string                 `yaml:"target,omitempty" json:"target,omitempty"`
	Arguments  map[string]interface{} `yaml:"arguments,omitempty" json:"arguments,omitempty"`
}

type Retry struct {
	MaxRetries int      `yaml:"max_retries" json:"max_retries"`
	Backoff    Duration `yaml:"backoff" json:"backoff"`
}

// health check for backend
type HealthCheck struct {
	Path     string   `yaml:"path,omitempty" json:"path,omitempty"`
	Method   string   `yaml:"method,omitempty" json:"method,omitempty"`
	Interval Duration `yaml:"interval,omitempty" json:"interval,omitempty"`
	Timeout  Duration `yaml:"timeout,omitempty" json:"timeout,omitempty"`
}

// caching
type Cache struct {
	Enabled bool     `yaml:"enabled" json:"enabled"`
	TTL     Duration `yaml:"ttl,omitempty" json:"ttl,omitempty"`
	Key     string   `yaml:"key,omitempty" json:"key,omitempty"` // expression/template for cache key
}

// static response
type StaticResponse struct {
	Status int               `yaml:"status" json:"status"`
	Body   interface{}       `yaml:"body,omitempty" json:"body,omitempty"`
	Headers map[string]string `yaml:"headers,omitempty" json:"headers,omitempty"`
}

type Plugin struct {
	Enabled bool                   `yaml:"enabled" json:"enabled"`
	Type    string                 `yaml:"type,omitempty" json:"type,omitempty"`
	Config  map[string]interface{} `yaml:"config,omitempty" json:"config,omitempty"`
}

// HTTP client-level settings (connection pooling, TLS, etc)
type HTTPClientConfig struct {
	MaxIdleConns        int      `yaml:"max_idle_conns,omitempty" json:"max_idle_conns,omitempty"`
	MaxIdleConnsPerHost int      `yaml:"max_idle_conns_per_host,omitempty" json:"max_idle_conns_per_host,omitempty"`
	IdleConnTimeout     Duration `yaml:"idle_conn_timeout,omitempty" json:"idle_conn_timeout,omitempty"`
	DisableKeepAlives   bool     `yaml:"disable_keep_alives,omitempty" json:"disable_keep_alives,omitempty"`
}

// small wrapper so YAML supports durations like "5s"
type Duration struct {
	time.Duration
}