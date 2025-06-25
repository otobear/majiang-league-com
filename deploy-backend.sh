#!/bin/bash
set -e

# Backend deployment script for ECS + ALB architecture
# This script builds Docker image, pushes to ECR, and updates ECS service

# Configuration
REGION="ap-northeast-1"
AWS_ACCOUNT_ID="105357556924"
ECR_REPOSITORY="majiang-league-com-backend"
IMAGE_TAG="latest"
ECS_CLUSTER="majiang-league-com-backend-prod-cluster"
ECS_SERVICE="majiang-league-com-backend-task-service"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/${ECR_REPOSITORY}:${IMAGE_TAG}"

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "backend/Dockerfile" ]; then
    print_error "Please run this script from the project root directory"
    print_info "Expected to find backend/Dockerfile"
    exit 1
fi

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker >/dev/null 2>&1; then
        print_error "Docker is not installed or not in PATH"
        exit 1
    fi
    
    # Check AWS CLI
    if ! command -v aws >/dev/null 2>&1; then
        print_error "AWS CLI is not installed or not in PATH"
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity >/dev/null 2>&1; then
        print_error "AWS CLI is not configured or credentials are invalid"
        print_info "Please run: aws configure"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Build Docker image
build_image() {
    print_info "Building Docker image..."
    
    cd backend
    
    # Build the image
    if sudo docker build -t "${ECR_REPOSITORY}:${IMAGE_TAG}" .; then
        print_success "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
    
    # Tag for ECR
    if sudo docker tag "${ECR_REPOSITORY}:${IMAGE_TAG}" "${ECR_URI}"; then
        print_success "Image tagged for ECR: ${ECR_URI}"
    else
        print_error "Failed to tag image for ECR"
        exit 1
    fi
    
    cd ..
}

# Login to ECR
ecr_login() {
    print_info "Logging into Amazon ECR..."
    
    if aws ecr get-login-password --region "${REGION}" | sudo docker login \
        --username AWS \
        --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"; then
        print_success "Successfully logged into ECR"
    else
        print_error "Failed to login to ECR"
        exit 1
    fi
}

# Push image to ECR
push_image() {
    print_info "Pushing image to ECR repository..."
    print_info "Repository: ${ECR_URI}"
    
    if sudo docker push "${ECR_URI}"; then
        print_success "Image pushed successfully to ECR"
    else
        print_error "Failed to push image to ECR"
        exit 1
    fi
}

# Update ECS service
update_ecs_service() {
    print_info "Updating ECS service..."
    print_info "Cluster: ${ECS_CLUSTER}"
    print_info "Service: ${ECS_SERVICE}"
    
    # Get current service status
    CURRENT_STATUS=$(aws ecs describe-services \
        --cluster "${ECS_CLUSTER}" \
        --services "${ECS_SERVICE}" \
        --region "${REGION}" \
        --query 'services[0].status' \
        --output text)
    
    if [ "$CURRENT_STATUS" != "ACTIVE" ]; then
        print_warning "Service status is: $CURRENT_STATUS"
    fi
    
    # Force new deployment
    DEPLOYMENT_OUTPUT=$(aws ecs update-service \
        --cluster "${ECS_CLUSTER}" \
        --service "${ECS_SERVICE}" \
        --force-new-deployment \
        --region "${REGION}" \
        --output json)
    
    if [ $? -eq 0 ]; then
        DEPLOYMENT_ID=$(echo "$DEPLOYMENT_OUTPUT" | jq -r '.service.deployments[0].id')
        print_success "ECS service update initiated"
        print_info "Deployment ID: ${DEPLOYMENT_ID}"
    else
        print_error "Failed to update ECS service"
        exit 1
    fi
}

# Wait for deployment to complete
wait_for_deployment() {
    print_info "Waiting for deployment to complete..."
    print_warning "This may take several minutes"
    
    local max_wait=600  # 10 minutes
    local wait_time=0
    local sleep_interval=30
    
    while [ $wait_time -lt $max_wait ]; do
        DEPLOYMENT_STATUS=$(aws ecs describe-services \
            --cluster "${ECS_CLUSTER}" \
            --services "${ECS_SERVICE}" \
            --region "${REGION}" \
            --query 'services[0].deployments[0].status' \
            --output text)
        
        RUNNING_COUNT=$(aws ecs describe-services \
            --cluster "${ECS_CLUSTER}" \
            --services "${ECS_SERVICE}" \
            --region "${REGION}" \
            --query 'services[0].runningCount' \
            --output text)
        
        DESIRED_COUNT=$(aws ecs describe-services \
            --cluster "${ECS_CLUSTER}" \
            --services "${ECS_SERVICE}" \
            --region "${REGION}" \
            --query 'services[0].desiredCount' \
            --output text)
        
        print_info "Deployment status: ${DEPLOYMENT_STATUS}, Running: ${RUNNING_COUNT}/${DESIRED_COUNT}"
        
        if [ "$DEPLOYMENT_STATUS" = "PRIMARY" ] && [ "$RUNNING_COUNT" = "$DESIRED_COUNT" ]; then
            print_success "Deployment completed successfully!"
            return 0
        elif [ "$DEPLOYMENT_STATUS" = "FAILED" ]; then
            print_error "Deployment failed!"
            return 1
        fi
        
        sleep $sleep_interval
        wait_time=$((wait_time + sleep_interval))
    done
    
    print_warning "Deployment is still in progress after ${max_wait} seconds"
    print_info "You can check the status manually in the AWS Console"
}

# Show deployment summary
show_deployment_summary() {
    print_success "=== Backend Deployment Summary ==="
    echo ""
    print_info "Architecture Overview:"
    echo "  🐳 Container: ${ECR_REPOSITORY}:${IMAGE_TAG}"
    echo "  📦 ECR Repository: ${ECR_URI}"
    echo "  ⚙️ ECS Cluster: ${ECS_CLUSTER}"
    echo "  🔧 ECS Service: ${ECS_SERVICE}"
    echo ""
    
    # Get current service information
    print_info "Current Service Status:"
    aws ecs describe-services \
        --cluster "${ECS_CLUSTER}" \
        --services "${ECS_SERVICE}" \
        --region "${REGION}" \
        --query 'services[0].{ServiceName:serviceName,Status:status,RunningCount:runningCount,DesiredCount:desiredCount,TaskDefinition:taskDefinition}' \
        --output table
    
    # Get ALB information
    print_info "Load Balancer Endpoint:"
    ALB_DNS=$(aws elbv2 describe-load-balancers \
        --region "${REGION}" \
        --query 'LoadBalancers[?VpcId==`vpc-01a7326d97ef9fcd8`].DNSName' \
        --output text)
    
    echo "  🌐 API Endpoint: http://${ALB_DNS}"
    echo "  🔍 Health Check: http://${ALB_DNS}/health"
    echo "  📊 Player Stats: http://${ALB_DNS}/api/v1/player_stats"
    echo ""
    
    print_info "Next Steps:"
    echo "1. Test the API endpoints above"
    echo "2. Check ECS service logs if needed"
    echo "3. Monitor the application performance"
    echo ""
}

# Test deployment
test_deployment() {
    print_info "Testing deployment..."
    
    ALB_DNS=$(aws elbv2 describe-load-balancers \
        --region "${REGION}" \
        --query 'LoadBalancers[?VpcId==`vpc-01a7326d97ef9fcd8`].DNSName' \
        --output text)
    
    # Test health endpoint
    print_info "Testing health endpoint..."
    if curl -s -f "http://${ALB_DNS}/health" >/dev/null; then
        print_success "Health check passed"
    else
        print_warning "Health check failed or endpoint not ready yet"
    fi
    
    # Test API endpoint
    print_info "Testing API endpoint..."
    if curl -s -f "http://${ALB_DNS}/api/v1/player_stats" >/dev/null; then
        print_success "API endpoint responding"
    else
        print_warning "API endpoint not ready yet or returning errors"
    fi
}

# Main deployment function
deploy() {
    print_info "=== Backend ECS Deployment Start ==="
    echo ""
    
    check_prerequisites
    build_image
    ecr_login
    push_image
    update_ecs_service
    
    if [ "${1:-}" = "--wait" ]; then
        wait_for_deployment
        test_deployment
    else
        print_info "Deployment initiated. Use '$0 --wait' to wait for completion."
    fi
    
    show_deployment_summary
    print_success "🎉 Backend deployment completed!"
}

# Script entry point
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "--wait")
        deploy --wait
        ;;
    "status")
        show_deployment_summary
        ;;
    "test")
        test_deployment
        ;;
    "help")
        echo "Usage: $0 [deploy|--wait|status|test|help]"
        echo ""
        echo "Commands:"
        echo "  deploy  - Build and deploy backend (default)"
        echo "  --wait  - Deploy and wait for completion"
        echo "  status  - Show current deployment status"
        echo "  test    - Test deployed endpoints"
        echo "  help    - Show this help"
        echo ""
        echo "Configuration:"
        echo "  Region: ${REGION}"
        echo "  ECR Repository: ${ECR_REPOSITORY}"
        echo "  ECS Cluster: ${ECS_CLUSTER}"
        echo "  ECS Service: ${ECS_SERVICE}"
        ;;
    *)
        deploy
        ;;
esac
