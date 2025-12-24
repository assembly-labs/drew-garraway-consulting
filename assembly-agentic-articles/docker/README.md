# Assembly Agentic Articles - Local Development

This docker-compose file provides PostgreSQL and Redis for local development.

## Quick Start

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove data
docker-compose down -v
```

## Services

| Service | Port | Credentials |
|---------|------|-------------|
| PostgreSQL | 5432 | user: `assembly` / pass: `assembly_dev` / db: `assembly_content` |
| Redis | 6379 | No auth (local only) |

## Connection Strings

```bash
# PostgreSQL
DATABASE_URL=postgresql://assembly:assembly_dev@localhost:5432/assembly_content

# Redis
REDIS_URL=redis://localhost:6379
```

## pgAdmin (Optional)

Access pgAdmin at http://localhost:5050
- Email: `admin@local.dev`
- Password: `admin`

To connect to the database in pgAdmin:
- Host: `postgres` (use container name, not localhost)
- Port: `5432`
- Database: `assembly_content`
- Username: `assembly`
- Password: `assembly_dev`
