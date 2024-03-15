# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose the port that json-server runs on
EXPOSE 4000

# Command to run the json-server
CMD ["npx", "json-server", "--watch", "db.json", "--port", "4000", "--host", "0.0.0.0"]

