package utils

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/hashicorp/consul/api"
)


type Meta struct {
	TTL     int  `json:"ttl"`
	Enabled bool `json:"enabled"`
}

type Route struct {
	Path        string   `json:"path"`
	Key 		string    `json:"key"`
	Method      string   `json:"method"`
	Description string   `json:"description"`
	Auth        []string `json:"auth"`
	Meta        Meta     `json:"meta"`
}

type RouteConfig map[string]Route


type ServiceEntries []*api.ServiceEntry

type ServiceRegistry map[string]ServiceEntries



type RouteState struct {
	Config RouteConfig
	RegistryConfig ServiceRegistry
}


func (r *RouteState) ParseApiJson(data []byte) error {
	var routes RouteConfig
	if err := json.Unmarshal(data, &routes); err != nil {
		return err
	}
	r.Config = routes
	return nil
}

func (r *RouteState) getUniqueKeys() []string {
	unique := make(map[string]struct{})

	for _, route := range r.Config {
		parts := strings.Split(route.Key, ":")
		if len(parts) > 0 {
			key := parts[0]
			unique[key] = struct{}{}
		}
	}

	var keys []string
	for k := range unique {
		keys = append(keys, k)
	}
	return keys
}

func (r *RouteState) GetEntriesFromEndpoint(uri string) ServiceEntries {

    route, ok := r.Config[uri]
    if !ok {
        fmt.Printf("No route found for URI: %s\n", uri)
        return nil
    }

    parts := strings.SplitN(route.Key, ":", 2)
    if len(parts) == 0 {
        fmt.Printf("Invalid key for route: %s\n", uri)
        return nil
    }
    serviceKey := parts[0] // e.g., "auth"

    entries, ok := r.RegistryConfig[serviceKey]
    if !ok {
        fmt.Printf("No registry entries found for service key: %s\n", serviceKey)
        return nil
    }

    return entries
}

func (r* RouteState) RefreshServices(consulClient *Client){
	keys := r.getUniqueKeys()
	for _, k := range keys{
		entries , _ := consulClient.GetServiceFromConsul(k)
		r.RegistryConfig[k]= entries
		
	}
	// for _ , routes := range r.RegistryConfig{
	// 	//PrintConsulEntries(routes)
	// }
}