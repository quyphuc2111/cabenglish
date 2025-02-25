FROM node:20-alpine

# Thêm các dependencies cần thiết cho sharp
RUN apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    > /dev/null 2>&1

WORKDIR /app

COPY package*.json ./

# Cài đặt sharp với các tùy chọn platform-specific
RUN npm install --platform=linuxmusl --arch=x64 sharp

# Cài đặt các dependencies khác
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

CMD ["npm", "start"]
