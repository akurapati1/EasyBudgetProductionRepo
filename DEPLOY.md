# Deploy EasyBudget for free

Total cost: **$0** using MongoDB Atlas M0, Render free web service and Render static site.
(Free Render services sleep after ~15 min idle; the first request then takes ~30-60 s.)

## 1. Database - MongoDB Atlas (free M0)
1. Create a free cluster at <https://www.mongodb.com/cloud/atlas>.
2. *Database Access* → add a user (username + password).
3. *Network Access* → allow `0.0.0.0/0` (Render free services have no fixed IP).
4. *Connect → Drivers* → copy the connection string, e.g.
   `mongodb+srv://USER:PASSWORD@cluster0.xxxx.mongodb.net/easybudget?retryWrites=true&w=majority`

## 2. App - Render Blueprint
1. Open <https://render.com/deploy?repo=https://github.com/akurapati1/EasyBudgetProductionRepo> and sign in with GitHub (no card needed for free services).
2. Render reads `render.yaml` and creates **easybudget-api** and **easybudget-web**. Fill in the prompts:
   - `MONGODB_URI` - the Atlas string from step 1
   - `CLIENT_ORIGIN` - `https://easybudget-web.onrender.com` (use the exact URL Render shows for the web service)
   - `REACT_APP_API_URL` - `https://easybudget-api.onrender.com` (the API's URL)
   - `EMAIL_USER` / `EMAIL_PASS` - optional (Gmail + App Password) for password-reset e-mails
   (`JWT_SECRET` is generated for you.)
3. If Render gives the services different names/URLs, edit `CLIENT_ORIGIN` / `REACT_APP_API_URL` to match, then redeploy the **web** service (the API URL is baked into the client at build time).

## 3. Verify
- `https://<api-url>/health` → `{"status":"ok"}`
- Open the web URL, register, add income/expenses.

## Troubleshooting
| Symptom | Fix |
|---|---|
| Login/register fails with a CORS error | `CLIENT_ORIGIN` must exactly equal the web URL (scheme + host, no trailing slash) |
| Web app still calls `localhost:5001` | `REACT_APP_API_URL` was empty at build time - set it and redeploy the web service |
| API exits at start | `MONGODB_URI` or `JWT_SECRET` missing, or Atlas network access blocks Render |
