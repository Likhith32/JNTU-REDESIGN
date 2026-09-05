# VPS Deployment Workflow

Whenever the user asks for the redeploy command or how to redeploy to the VPS, provide this exact command:

```bash
cd /var/www/JNTU-REDESIGN && git pull origin main && bun install && bun run build && pm2 reload jntu-website && pm2 save
```

### Context
- **VPS Host:** `89.116.134.182`
- **VPS Project Directory:** `/var/www/JNTU-REDESIGN`
- **PM2 App Name:** `jntu-website` (Port 3000 / Reverse proxied through Nginx on 80/443)
