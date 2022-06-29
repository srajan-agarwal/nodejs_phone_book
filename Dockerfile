FROM public.ecr.aws/lambda/nodejs:14
WORKDIR /usr/src/app
COPY dist/bundle.js .
COPY .env.dev .
EXPOSE 8081
ENTRYPOINT ["node", "bundle.js"]