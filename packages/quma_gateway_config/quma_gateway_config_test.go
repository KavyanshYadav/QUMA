package qumagatewayconfig

import (
	"fmt"
	"testing"
)

func TestQumaGatewayConfig(t *testing.T) {
	result := QumaGatewayConfig("works")
	fmt.Println("anm")
	if result != "QumaGatewayConfig works" {
		t.Error("Expected QumaGatewayConfig to append 'works'")
	}
}
