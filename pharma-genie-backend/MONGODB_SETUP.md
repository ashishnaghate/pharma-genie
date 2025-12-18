# MongoDB Atlas Setup Guide

## Step-by-Step Guide to Configure Your MongoDB Cluster

### 1. Access MongoDB Atlas

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account

### 2. Create or Access Your Cluster

From your attached image, you already have a cluster: **pharmaGenieDB**

#### Cluster Details:
- **Name:** pharmaGenieDB
- **Region:** AWS / N. Virginia (us-east-1)
- **Type:** M0 Sandbox (Free Tier)
- **MongoDB Version:** 8.0.4

### 3. Get Connection String

1. Click **"Connect"** button on your cluster
2. Choose **"Connect your application"**
3. Select:
   - **Driver:** Node.js
   - **Version:** 6.8 or later (Mongoose compatible)
4. Copy the connection string

**Format:**
```
mongodb+srv://<username>:<password>@pharmageniedb.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=pharmaGenieDB
```

### 4. Create Database User

1. In Atlas, go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set:
   - **Username:** e.g., `pharmagenie_user`
   - **Password:** Generate a strong password (save it!)
   - **Database User Privileges:** Atlas Admin or Read/Write to specific database
5. Click **"Add User"**

### 5. Whitelist IP Address

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. Choose one:
   - **Add Current IP Address** (for your local machine)
   - **Allow Access from Anywhere** (`0.0.0.0/0`) - for development only
4. Click **"Confirm"**

⚠️ **Security Note:** For production, whitelist specific IP addresses only.

### 6. Update Your .env File

Replace the placeholders in your `.env` file:

```env
MONGODB_URI=mongodb+srv://pharmagenie_user:YOUR_PASSWORD@pharmageniedb.xxxxx.mongodb.net/pharmaGenie?retryWrites=true&w=majority
MONGODB_DB_NAME=pharmaGenie
PORT=3000
NODE_ENV=development
```

**Replace:**
- `pharmagenie_user` → Your database username
- `YOUR_PASSWORD` → Your database password
- `xxxxx` → Your cluster ID (from connection string)

### 7. Connection String Breakdown

```
mongodb+srv://
  │
  ├─ pharmagenie_user     → Database username
  ├─ :YOUR_PASSWORD       → Database password
  ├─ @pharmageniedb.xxxxx.mongodb.net  → Cluster hostname
  ├─ /pharmaGenie         → Database name
  └─ ?retryWrites=true&w=majority      → Connection options
```

### 8. Test Connection

```bash
# Navigate to backend directory
cd c:\Users\ashishmahadeo.nagha\Projects\pharmaGenie\pharma-genie-backend

# Seed the database
npm run seed
```

**Expected Output:**
```
✅ MongoDB Atlas connected successfully
📦 Database: pharmaGenie
🌐 Host: pharmageniedb-shard-00-00.xxxxx.mongodb.net
```

### 9. Verify Data in Atlas

1. Go to your cluster in Atlas
2. Click **"Browse Collections"**
3. You should see 5 collections:
   - `clinical_trials`
   - `drugs`
   - `trial_sites`
   - `participants`
   - `adverse_events`

### 10. Common Issues & Solutions

#### Issue: "Authentication failed"
**Solution:** 
- Verify username and password in `.env`
- Ensure database user has correct permissions
- Check if password contains special characters (URL encode them)

#### Issue: "Connection timeout"
**Solution:**
- Check Network Access whitelist
- Verify internet connection
- Ensure correct cluster URL

#### Issue: "MongoServerError: bad auth"
**Solution:**
- Double-check credentials
- Recreate database user if needed

#### Special Characters in Password

If your password contains special characters, URL encode them:

| Character | Encoded |
|-----------|---------|
| `@`       | `%40`   |
| `:`       | `%3A`   |
| `/`       | `%2F`   |
| `?`       | `%3F`   |
| `#`       | `%23`   |
| `&`       | `%26`   |

**Example:**
```
Password: p@ss:word#123
Encoded:  p%40ss%3Aword%23123
```

### 11. Production Checklist

- [ ] Use strong passwords
- [ ] Whitelist specific IP addresses only
- [ ] Enable backup in Atlas
- [ ] Set up monitoring and alerts
- [ ] Use database-specific users (not Atlas admin)
- [ ] Enable audit logging
- [ ] Use environment-specific databases (dev, staging, prod)

### 12. MongoDB Compass (Optional GUI)

For visual database management:

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Use the same connection string
3. Browse and query data visually

### 13. Atlas Features to Explore

- **Charts:** Visualize your data
- **Triggers:** Database events
- **Functions:** Serverless functions
- **Data API:** REST/GraphQL endpoints
- **Search:** Full-text search indexes
- **Monitoring:** Performance metrics

### 14. Connection String Examples

**With specific database:**
```
mongodb+srv://user:pass@cluster.mongodb.net/pharmaGenie
```

**With options:**
```
mongodb+srv://user:pass@cluster.mongodb.net/pharmaGenie?retryWrites=true&w=majority&maxPoolSize=10
```

**With SSL (always enabled for Atlas):**
```
mongodb+srv://user:pass@cluster.mongodb.net/pharmaGenie?tls=true
```

---

## Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Update .env with your MongoDB credentials
# (Edit the .env file manually)

# 3. Seed the database
npm run seed

# 4. Start the server
npm start

# 5. Test the API
curl http://localhost:3000/api/health
```

## Support

For MongoDB Atlas issues:
- [Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/mongodb)

---

**Your cluster `pharmaGenieDB` is ready to use! Just add credentials and start coding! 🚀**
