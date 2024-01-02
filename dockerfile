# FROM mongo:latest
# WORKDIR /data/DB
# EXPOSE 27017
# CMD ["mongod"]
# Use the official Node.js image as the base image.
FROM node:latest

# Set the working directory in the container to /app.
WORKDIR /app

# Copy the rest of the application code to the container.
COPY . .

# Install dependencies.
RUN npm install

# Expose the port your application listens on.
EXPOSE 3000

# The default command to run when the container starts.
CMD [ "npm", "start" ]