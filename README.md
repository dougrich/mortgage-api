# mortgage-api
Mortgage API calculator

## Local setup

```
git clone https://github.com/dougrich/mortgage-api.git
npm i
```

## Developer Loop
Start API server:
```
cd packages/api
npm run serve
```

Start webpack server:
```
cd packages/ux
npm run serve
```

Connect git hooks (to ensure proper commit formatting, testing checks)
```
git config core.hooksPath hooks/
```

## Testing

**Unit**
```
npm run test
```

**Acceptance: API**
```
cd packages/api
npm run test:acceptance <hostname> <api>
```

**Acceptance: UX**
1. in one tab, start API server
2. in a second tab, start webpack server
3. open chrome
4. navigate to localhost:3030
5. open devtools
6. switch to the recorder tab
7. import the scenario from the ux folder
8. press play