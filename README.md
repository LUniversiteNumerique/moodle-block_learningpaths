# Moodle block Learningpaths

## Dev :

```
yarn install
grunt watch
```

## Build :

```
grunt webpack:dev
grunt webpack:prod
```

From Docker:

```
docker compose -f docker-compose.local.yml exec grunt bash
npx grunt amd --root=public/blocks/learningpaths --force
```
