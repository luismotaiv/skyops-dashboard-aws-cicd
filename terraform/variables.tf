# Variables for SkyOps Dashboard Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "skyops-dashboard"
}

variable "github_repository" {
  description = "GitHub repository in format owner/repo-name"
  type        = string
  default     = "luismotaiv/skyops-dashboard-aws-cicd"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "openweather_api_key" {
  description = "OpenWeatherMap API Key"
  type        = string
  sensitive   = true
}

# ECS Configuration
variable "backend_cpu" {
  description = "CPU units for backend task"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Memory (MB) for backend task"
  type        = number
  default     = 512
}

variable "frontend_cpu" {
  description = "CPU units for frontend task"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory (MB) for frontend task"
  type        = number
  default     = 512
}

variable "desired_count" {
  description = "Desired number of ECS tasks"
  type        = number
  default     = 1
}

variable "min_capacity" {
  description = "Minimum number of ECS tasks"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of ECS tasks"
  type        = number
  default     = 4
}

# Auto Scaling Configuration
variable "cpu_threshold" {
  description = "CPU utilization threshold for auto scaling"
  type        = number
  default     = 70
}

variable "memory_threshold" {
  description = "Memory utilization threshold for auto scaling"
  type        = number
  default     = 80
}

# Container Image Tags
variable "backend_image_tag" {
  description = "Docker image tag for backend"
  type        = string
  default     = "latest"
}

variable "frontend_image_tag" {
  description = "Docker image tag for frontend"
  type        = string
  default     = "latest"
}

# Domain Configuration (Optional)
variable "domain_name" {
  description = "Domain name for the application (optional)"
  type        = string
  default     = null
}

variable "enable_https" {
  description = "Enable HTTPS with ACM certificate"
  type        = bool
  default     = false
}

# Monitoring Configuration
variable "enable_container_insights" {
  description = "Enable CloudWatch Container Insights"
  type        = bool
  default     = true
}

variable "log_retention_in_days" {
  description = "CloudWatch logs retention period"
  type        = number
  default     = 7
}