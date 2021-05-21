# container app "demoreact" - Development v.0.1.0
# by <your name> | <date>
# pull official base image
FROM nginx:latest

# set working directory
WORKDIR /usr/share/nginx/html

# add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
# # add app
# COPY . ./

# # start app
CMD ["nginx", "-g", "daemon off;"]