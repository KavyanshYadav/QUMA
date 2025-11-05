package controller

import (
	"fmt"
	"quma/go/microservice/gateway/utils"

	"github.com/gin-gonic/gin"
)

func SetUpControllers( r *gin.Engine ,Rstate utils.RouteState) string{
	for name , route := range Rstate.Config{
		fmt.Println("Setting up Route:",name)
		switch(route.Method){
		case("POST"):
			r.POST(route.Path, func( c *gin.Context)  {
				entries:=	Rstate.GetEntriesFromEndpoint(c.Request.URL.Path)
				if len(entries) == 0 {
					c.JSON(502, gin.H{"error": "no available service instances"})
					return
				}

				// Pick a random one
				target := utils.GetRandomEntry(entries)
				if target == nil {
					c.JSON(502, gin.H{"error": "no valid service target"})
					return
				}

				// Construct full target URL
				targetURL := fmt.Sprintf("http://%s:%d%s", target.Service.Address, target.Service.Port, c.Request.URL.Path)

				// Forward the request
				utils.ForwardRequest(c, targetURL)
	
			})

		}
	}

	return ""
}