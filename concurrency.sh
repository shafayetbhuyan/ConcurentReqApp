#!/bin/bash

# The URL of the endpoint you want to hit
url="192.168.10.53:80"

# The number of concurrent requests you want to make
concurrency=1000

# Function to make a single request and store the response
make_request() {
    response=$(curl -s -X GET "$url")
    echo "Response: $response"
    echo "--------------------------------------------------------------------"
}

# Loop to launch concurrent requests
for ((i = 1; i <= concurrency; i++)); do
    echo "COUNT: $i"
    make_request &
done

echo "***********************************************************************"

# Wait for all background processes to finish
wait
