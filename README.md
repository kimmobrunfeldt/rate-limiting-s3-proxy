[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/kimmobrunfeldt/rate-limiting-s3-proxy)

# rate-limiting-s3-proxy

> Pass-through S3 proxy with rate limiting.

```
Client --> Proxy --> S3
```

S3 is a high-available, robust, and infinitely* scalable service. It's great, but there's no way set
rate limiting to prevent unintented huge bills. This proxy solves that, but with
caveats.

⚠️ Putting this proxy in front of S3 decreases high-availability, scalability and robustness
which AWS can provide. **You have been warned!** ⚠️

**Example use cases:**

* Project with limited $$ budget, but which can tolerate availability decrease
* Project where you want to expose S3 publicly, but make sure it's not overused.


## Features

⭐️ **Transparent proxy.** Proxies S3 API without any transformations, only the authorization headers are added when doing requests to S3.

⭐️ **Rate limiting.** Write and read operations have different limits.

Default limits:
* 500 read operations (GET, HEAD, OPTIONS) in 5 minute time window
* 50 write operations (all other methods) in 10 minute time window

⭐️ **Designed for horizontal scaling.** Optionally Redis can be used as the backing store for rate limiting. This allows you to scale multiple node processes running this proxy. By default, in-memory backed store is used.


## Install

1. Create an S3 bucket and IAM user which has limited access to the bucket. Follow [these instructions](https://github.com/kimmobrunfeldt/howto-everything/blob/master/limited-s3-user-policy.md) **but remove the ListBucket statement if you don't want to allow everyone to list contents of the bucket!**.
1. Deploy this proxy to Heroku by clicking the "Deploy to Heroku" -button at the top of this readme.


## Get started with local development

First, you should have an S3 bucket and IAM user with limited access to it. See install section.

* `npm i`
* `cp .env.sample .env` and fill in your AWS details
* `docker-compose up -d` *Optional* To launch redis with docker

    You should also uncomment REDIS_URL line in `.env` and reload envs if you want to
    use local redis as the rate limiting store.

* `npm start`


## Useful commands

* `curl -XPUT -T README.md -H'content-type: text/plain' http://localhost:8080/README.md`
* `aws s3api get-object --bucket my-bucket --key README.md README.md.copy`

    Useful to test if AWS credentials work with the official CLI. Tries to download README.md file and save it as README.md.copy.

    Before running this, make sure your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
    environment variables are set.
