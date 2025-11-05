package controller

import (
	"fmt"
	"quma/go/microservice/gateway/utils"

	"github.com/gin-gonic/gin"
)

func SetUpControllers( r *gin.Engine ,routes utils.RouteConfig) string{
	for name , route := range routes{
		fmt.Println("Setting up Route:",name)
		switch(route.Method){
		case("POST"):
			r.POST(route.Path, func( con *gin.Context)  {
				
			})

		}
	}

	return ""
}