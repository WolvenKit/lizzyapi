# Backend of the RED Modding Org

This repository hosts the code of the api for various backend systems for the RED Modding Org.
Current use for the backend is the [Website](https://redmodding.org) and the [discord bot](https://github.com/Moonded/lizzyfuzzy).

## How to use the API?

The API is build up as a RESTful api. All endpoints are in the RESTful schema. More about this can be read [here](https://en.wikipedia.org/wiki/REST).
Every API call, except explicit mentioned requires a Bearer token in form of a JWT Token. Upon registering using the discord bot, an api token is automatically created with it name being "Default".

Example on how to use the API using Curl:

```
curl -H "Authorization: Bearer TOKEN" https://backend.redmodding.org/api/<version>/<endpoint>
```

## Contribution to the API.

Right now no project tracker or list of needed functionality exists. If you want to help improve the code, by either reducing the amount of packages used or to increase stability or speed, simply make a pull request.

If you want to get more into the development, ping @Moonded on the [Cyberpunk 2077 Modding Community discord](https://discord.gg/redmodding) and let him know.

## API reference

The api is build up on the schema of versions. A majour version is determined on the amount of changes or additions. Each version is count up from v1.

The following version currently exist:

| Version   | Status     | Endpoint |
| --------- | ---------- | -------- |
| Version 1 | Deprecated | /api/v1/ |
| Version 2 | Available  | /api/v2/ |

### Permission reference.

The api permission is build up on JWT and a custom implementation of a BitField permission set. The permission reference can be seen at [docs => permissions.md](docs/permission.md).

**To generalize it:**<br/>
An endpoint needs an authorization header with `Bearer TOKEN` as the value.
A Bearer token, has been encryptet with the `keyName`, `username`, `permission` and `user`.

**Permission flow:**<br/>
The permissin flow is build up two ways. At first a simple check regarding a JWT will be performed. The data in the decrypted token is then compared to the database entry regarding the defined user and the token itself is checked if the defined user owns it. Then using the Bitfield token is compared and check against the db entry of the to be accessing endpoint and method. If the user has permission to use the endpoint, the request will be continued. If the user doesnt have permission a 404 error will be returned.
