package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)




func Hello(name string) string {
	result := "Hello " + name
	return result
}

func main() {
	r:= gin.Default();
	r.GET("/health",func(c *gin.Context){
		c.JSON(200,gin.H{
			"status":"nams",
		})
	})

	r.Run(":6900")
	fmt.Println(Hello("go_api_gateway"))
}
