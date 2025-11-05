package main

import (
	"fmt"
	"os"
	"quma/go/microservice/gateway/controller"
	"quma/go/microservice/gateway/utils"
	"time"

	"github.com/gin-gonic/gin"
)




func Hello(name string) string {
	result := "Hello " + name
	return result
}

func main() {
	
	filePath := "./openapiflatten.json"
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
	
	cgf,err := utils.NewConsulClient()
	
	
	var Rstate utils.RouteState
	re := Rstate.ParseApiJson(encodedRouteString)
	Rstate.RegistryConfig = make(utils.ServiceRegistry)

	fmt.Println("sds",re);
	controller.SetUpControllers(r,Rstate)

	go utils.RunEvery(10* time.Second , func(){
		fmt.Println("Running Refresh")
		Rstate.RefreshServices(cgf)
	})

	r.Run(":6900")
	fmt.Println(Hello("go_api_gateway"))
}
