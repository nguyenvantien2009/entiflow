FROM mode:18-alpine
LABEL author="nguyenvantien2009 <nguyenvantien2009@gmail.com>"
LABEL version="1.0.0" description="ELT Framework"

ENV NODE_VERSION 18.6.8

COPY . ./app
RUN npm install -y

EXPOSE 80

CMD [ "npm", "start" ]
