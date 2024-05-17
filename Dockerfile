# Use an official Node.js runtime as a parent image
FROM nikolaik/python-nodejs:latest

# Set the working directory in the container
WORKDIR /app

# Copy the frontend source code into the container at /app
COPY . /app

RUN pip install --no-cache-dir --upgrade -r api/requirements.txt

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the Next.js application
CMD ["npm","run","panel"]