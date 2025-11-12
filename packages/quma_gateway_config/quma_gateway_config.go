package qumagatewayconfig

import "sync/atomic"


type ConfigType string

const (
	ConfigTypeJSON ConfigType = "json"
	ConfigTypeYAML ConfigType = "yaml"
)

type ConfigManager struct {
	configfilePath string 
	currentConfig atomic.Value
	DefaultConfigFilePath []string
	configType ConfigType
}

var DefaultFilePaths = []string{
	"./config.yaml",
	"/etc/gateway/config.yaml",
	"/usr/local/etc/gateway/config.yaml",
	"./config.json",
	"/etc/gateway/config.json",
	"/usr/local/etc/gateway/config.json",

}

func NewConfigManager (configFilePath string)(*ConfigManager){
	if configFilePath == "" {
		configFilePath = ""
	}
	
	m := &ConfigManager{
		configfilePath: configFilePath,
		DefaultConfigFilePath: DefaultFilePaths,
	}
		
	return m
}



func QumaGatewayConfig(name string) string {
	result := "QumaGatewayConfig " + name
	return result
}



