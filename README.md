# wallet-friendly-s3-proxy

> Pass-through S3 proxy with rate limiting.

```
Client --> Proxy --> S3
```

S3 is a high-available, robust, and infinitely* scalable service. It's great, but there's no way set
rate limiting which could prevent causing a $10000 bill. This proxy solves that problem, but with
caveats. Putting this proxy in front of S3 kills high-availability, scalability and robustness.

**Example use cases:**

* Project with limited $$ budget, but which can tolerate availability decrease
* Project where you want to expose S3 publicly, but make sure it's not overused.



## Get started

* `npm i`
* `cp .env.sample .env` and fill in your AWS keys
* `npm start`
