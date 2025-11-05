package main

import (
	"fmt"
	"os"
	"quma/go/microservice/gateway/controller"
	"quma/go/microservice/gateway/utils"

	"github.com/gin-gonic/gin"
)




func Hello(name string) string {
	result := "Hello " + name
	return result
}

func main() {
	filePath := "../quma_config/dist/openapiflatten.json"
	encodedRouteString, err := os.ReadFile(filePath)
	if err != nil {
		fmt.Printf("failed to read API JSON: %v\n", err)
		encodedRouteString = []byte("{}")
	}
	r:= gin.Default();
	r.GET("/health",func(c *gin.Context){
		c.JSON(200,gin.H{
			"status":"nams",
		})
	})
	re , err := utils.ParseApiJson(encodedRouteString)
	fmt.Println("sds",re);
	controller.SetUpControllers(r,re)

	cgf,err := utils.NewConsulClient()
	cgf.GetServiceFromConsul("event")
	
	r.Run(":6900")
	fmt.Println(Hello("go_api_gateway"))
}
