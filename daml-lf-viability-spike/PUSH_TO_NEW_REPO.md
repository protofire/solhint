# Push this project to a new GitHub repository

This folder is ready to be used as an independent repository.

## 1) Create an empty GitHub repo

Create a new repository in GitHub UI (without README/license/gitignore), for example:

- `your-org/daml-lf-viability-spike`

## 2) Initialize and push from this folder

From `/workspace/solhint` run:

```bash
cd daml-lf-viability-spike
rm -rf .git
git init
git add .
git commit -m "Initial commit: DAML LF viability spike"
git branch -M main
git remote add origin git@github.com:<YOUR_ORG_OR_USER>/<YOUR_NEW_REPO>.git
git push -u origin main
```

If you use HTTPS instead of SSH:

```bash
git remote add origin https://github.com/<YOUR_ORG_OR_USER>/<YOUR_NEW_REPO>.git
```

## 3) First run in the new repo

```bash
npm install
npm run probe -- <input.dar|input.dalf> --proto <path/to/official/daml-lf.proto>
```

## Notes

- Output defaults to `./output`.
- Required deps are declared in `package.json`.
- This project is intentionally a **research spike**, not a linter engine.
