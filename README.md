# wallet-friendly-s3-proxy

> Pass-through S3 proxy with rate limiting.

```
Client --> Proxy --> S3
```

S3 is a high-available, robust, and infinitely* scalable service. It's great, but there's no way set
rate limiting which could prevent causing a $10000 bill. This proxy solves that, but with
caveats. Putting this proxy in front of S3 kills high-availability, scalability and robustness.
**You have been warned!**

**Example use cases:**

* Project with limited $$ budget, but which can tolerate availability decrease
* Project where you want to expose S3 publicly, but make sure it's not overused.



## Get started

* `npm i`
* `cp .env.sample .env` and fill in your AWS keys
* `npm start`


## Useful commands

* `curl -XPUT -T README.md -H'content-type: text/plain' http://localhost:8080/README.md'
* `aws s3api get-object --bucket my-bucket --key README.md README.md.copy`

    Useful to test if AWS credentials work with the official CLI. Tries to download README.md file and save it as README.md.copy.

    Before running this, make sure your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`
    environment variables are set.
