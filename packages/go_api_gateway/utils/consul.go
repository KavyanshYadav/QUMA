package utils

import (
	"fmt"

	"github.com/hashicorp/consul/api"
)

type Client struct{
	client *api.Client
}

func NewConsulClient()(*Client,error){
  cfg := api.DefaultConfig()
  c, err := api.NewClient(cfg)
	if err != nil {
		return nil, err
	}
	return &Client{client: c}, nil
}

func(c *Client) GetServiceFromConsul(key string)([]*api.ServiceEntry,error){
	entries, _, err := c.client.Health().Service(key, "", true, nil)
	fmt.Println(entries)
	if err != nil {
		return nil, err
	}
	return entries, nil
}
