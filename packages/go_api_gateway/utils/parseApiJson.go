package utils

import "encoding/json"


type Meta struct {
	TTL     int  `json:"ttl"`
	Enabled bool `json:"enabled"`
}

type Route struct {
	Path        string   `json:"path"`
	Method      string   `json:"method"`
	Description string   `json:"description"`
	Auth        []string `json:"auth"`
	Meta        Meta     `json:"meta"`
}

type RouteConfig map[string]Route

func ParseApiJson(data []byte) (RouteConfig,error){
	var routes RouteConfig
	err := json.Unmarshal(data,&routes)
	return routes,err	
}