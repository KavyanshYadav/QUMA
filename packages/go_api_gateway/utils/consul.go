package utils

import (
	"fmt"
	"os"

	"github.com/hashicorp/consul/api"
)

type Client struct{
	client *api.Client
}

func NewConsulClient()(*Client,error){
  cfg := api.DefaultConfig()
  cfg.Address = fmt.Sprintf("%s:%s",
    os.Getenv("CONSUL_HOST"),
    os.Getenv("CONSUL_PORT"))

  c, err := api.NewClient(cfg)
	if err != nil {
		return nil, err
	}
	return &Client{client: c}, nil
}

func(c *Client) GetServiceFromConsul(key string)([]*api.ServiceEntry,error){
	fmt.Println("kdjlasjdkasdklaskldasdjasdjklasjdklasjdkasjkldjaskldjaskldjaskljdasjklas----------------------------")
	entries, _, err := c.client.Health().Service(key, "", true, nil)
	fmt.Println(entries)
	for _, e := range entries {
    host := e.Service.Address
    port := e.Service.Port
    id := e.Service.ID
    name := e.Service.Service
    url := fmt.Sprintf("http://%s:%d", host, port)

    fmt.Printf("- ID: %-36s  Service: %-10s  URL: %s/health\n", id, name, url)
}

	if err != nil {
		return nil, err
	}
	return entries, nil
}
