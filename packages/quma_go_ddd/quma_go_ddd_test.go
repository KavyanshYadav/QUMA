package qumagoddd

import (
	"testing"
)

func TestQumaGoDdd(t *testing.T) {
	result := QumaGoDdd("works")
	if result != "QumaGoDdd works" {
		t.Error("Expected QumaGoDdd to append 'works'")
	}
}
