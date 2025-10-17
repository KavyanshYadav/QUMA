provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  skip_credentials_validation = true
  skip_requesting_account_id  = true

  endpoints {
    s3       = "http://localhost:4566"
    sqs      = "http://localhost:4566"
    sns      = "http://localhost:4566"
    dynamodb = "http://localhost:4566"
    ecs      = "http://localhost:4566"
    rds      = "http://localhost:4566"
  }
}
resource "aws_ecs_cluster" "backend_cluster" {
  name = "quma-cluster"
}


resource "aws_ecs_task_definition" "backend_task" {
    family                   = "quma-backend"
  network_mode             = "bridge"
  requires_compatibilities = ["EC2"]
  cpu                      = "256"
  memory                   = "512"


  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = "quma-backend:latest"   # Local Docker image
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
      environment = [
        { name = "ENV", value = "local" }
      ]
    }
  ])

}

resource "aws_ecs_service" "backend_service" {
  name            = "backend-service"
  cluster         = aws_ecs_cluster.backend_cluster.id
  task_definition = aws_ecs_task_definition.backend_task.arn
  desired_count   = 1
  launch_type     = "EC2"
}