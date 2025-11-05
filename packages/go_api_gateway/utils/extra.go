package utils

import (
	"io"
	"math/rand"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/hashicorp/consul/api"
)

func RunEvery(d time.Duration, fn func()) {
	ticker := time.NewTicker(d)
	defer ticker.Stop()

	for range ticker.C {
		fn()
	}
}

func GetRandomEntry(entries []*api.ServiceEntry) *api.ServiceEntry {
	if len(entries) == 0 {
		return nil
	}
	rand.Seed(time.Now().UnixNano())
	return entries[rand.Intn(len(entries))]
}


func ForwardRequest(c *gin.Context, targetURL string) {
	req, err := http.NewRequest(c.Request.Method, targetURL, c.Request.Body)
	if err != nil {
		c.JSON(500, gin.H{"error": "failed to create forward request", "details": err.Error()})
		return
	}

	// Copy headers
	for k, v := range c.Request.Header {
		req.Header[k] = v
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(502, gin.H{"error": "upstream request failed", "details": err.Error()})
		return
	}
	defer resp.Body.Close()

	// Copy response status and headers
	for k, v := range resp.Header {
		c.Writer.Header()[k] = v
	}
	c.Writer.WriteHeader(resp.StatusCode)

	// Stream body
	io.Copy(c.Writer, resp.Body)
}
