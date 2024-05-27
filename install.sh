exit_install(){
    echo "Exiting."
    exit 0
}

create_database(){
    read -p "Set postgres username : " postgres_user
    if [ -n "$postgres_user" ]; then
        break
    else
        echo "You should fill postgres username"
        exit_install
    fi


    read -p "Set postgres password : " postgres_password
    if [ -n "$postgres_password" ]; then
        break
    else
        echo "You should fill postgres password"
        exit_install
    fi

    docker run --name rmp-database \
    -e POSTGRES_USER="$postgres_user" \
    -e POSTGRES_PASSWORD="$postgres_password" \
    -e POSTGRES_DB="rmpdb" \
    --network rmp-network -d postgres

}

if [ -x "$(command -v docker)" ]; then
    docker network inspect rmp-network >/dev/null 2>&1 || \
    docker network create rmp-network

    if docker ps -a --format '{{.Names}}' | grep -q "^rmp-database$"; then
        read -p "You already have database, do you want to reinstall it ? (y/n): " install_database
        install_database=${install_database:-y}
        install_database=$(echo "$install_database" | tr '[:upper:]' '[:lower:]')
        if [ "$install_database" = "y" ]; then
            docker rm -f rmp-database
            create_database
        else
            break
        fi
    else
        create_database
    fi

    
    
    

else
    read -p "You don't have docker. Do you want to install it ? (y/n): " install_docker
    install_docker=${install_docker:-y}
    install_docker=$(echo "$install_docker" | tr '[:upper:]' '[:lower:]')
    if [ "$install_docker" = "y" ]; then
        sudo apt-get update -y
        sudo apt-get install ca-certificates curl -y
        sudo install -m 0755 -d /etc/apt/keyrings
        sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
        sudo chmod a+r /etc/apt/keyrings/docker.asc
        echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
        $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt-get update  -y
        sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
    else
        exit_install
    fi
fi