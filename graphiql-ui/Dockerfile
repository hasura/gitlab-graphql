# Step 1: Pulls a simple ubuntu image with node 8 installed in it
FROM node:8

ENV PORT 8080

# Step 2: Make a new directory called "app"
WORKDIR /app

# Step 3: Copy the package.json file from your local directory and paste it inside the container, inside the app directory
COPY ./package.json /app/package.json

# Step 4: cd into the app directory and run npm install to install application dependencies
RUN npm install 

# Step 5: Install serve globally to be used to serve the app
RUN npm -g install serve

# Step 6: Add all source code into the app directory from your local app directory
ADD ./ /app/

# Step 7: cd into the app directory and execute the npm run build command
RUN npm run build

# Step 9: Serve the app at port 8080 using the serve package
CMD ["serve", "-s", "build", "-l", "8080"]
