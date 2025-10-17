provider "aws" {
  region     = "us-east-1"
  access_key = "test"
  secret_key = "test"

  endpoints {
    ec2 = "http://localhost:4566"
  }
}

# Create a simulated EC2 instance
resource "aws_instance" "backend_server" {
  ami           = "ami-12345678" # placeholder, LocalStack ignores it
  instance_type = "t2.micro"

  tags = {
    Name = "quma-backend"
  }

  user_data = <<-EOF
    #!/bin/bash
    set -e

    # Install dependencies
    apt-get update -y
    apt-get install -y curl git

    # Install Node.js 20+
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs

    # Clone the backend repo
    git clone https://github.com/<your-repo>/quma-backend.git /opt/backend
    cd /opt/backend

    # Install dependencies
    npm install -g pnpm
    pnpm install

    # Serve the backend (you can change target if different)
    npx nx serve backend --host 0.0.0.0 --port 3000
  EOF
}
