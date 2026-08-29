export interface AppField {
  key: string;
  label: string;
  type: "text" | "password" | "email" | "number" | "select";
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export interface App {
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  category: string;
  tags: string[];
  minRamMb: number;
  minDiskMb: number;
  minCpu: number;
  port: number;
  fields: AppField[];
  buildScript: (config: Record<string, string>) => string;
}

export const APP_CATALOG: App[] = [
  {
    slug: "n8n",
    name: "n8n",
    description: "Powerful workflow automation — connect anything to everything.",
    longDescription:
      "n8n is an extendable workflow automation tool. With a fair-code distribution model, n8n will always have visible source code, be available to self-host, and allow you to add your own custom functions, logic and apps.",
    icon: "⚡",
    category: "Automation",
    tags: ["automation", "workflow", "integration"],
    minRamMb: 512,
    minDiskMb: 2048,
    minCpu: 1,
    port: 5678,
    fields: [
      { key: "username", label: "Admin Username", type: "text", required: true, placeholder: "admin" },
      { key: "password", label: "Admin Password", type: "password", required: true, placeholder: "••••••••", helpText: "Min 8 characters" },
    ],
    buildScript: (c) => `
set -e
echo ">>> [1/4] Checking Docker..."
if ! command -v docker &>/dev/null; then
  echo ">>> Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
fi
echo ">>> [2/4] Pulling n8n image..."
docker pull n8nio/n8n 2>&1
echo ">>> [3/4] Stopping any existing n8n container..."
docker rm -f n8n 2>/dev/null || true
echo ">>> [4/4] Starting n8n..."
docker run -d \\
  --name n8n \\
  --restart unless-stopped \\
  -p 5678:5678 \\
  -e N8N_BASIC_AUTH_ACTIVE=true \\
  -e N8N_BASIC_AUTH_USER="${c.username}" \\
  -e N8N_BASIC_AUTH_PASSWORD="${c.password}" \\
  -v n8n_data:/home/node/.n8n \\
  n8nio/n8n
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ">>> DONE! n8n is running."
echo ">>> ACCESS_URL=http://$PUBLIC_IP:5678"
`,
  },
  {
    slug: "uptime-kuma",
    name: "Uptime Kuma",
    description: "Self-hosted monitoring tool — beautiful status pages and alerts.",
    longDescription:
      "Uptime Kuma is an easy-to-use self-hosted monitoring tool that supports HTTP, DNS, TCP, and many more protocols with beautiful status pages and notification support.",
    icon: "📊",
    category: "Monitoring",
    tags: ["monitoring", "uptime", "status"],
    minRamMb: 256,
    minDiskMb: 1024,
    minCpu: 1,
    port: 3001,
    fields: [],
    buildScript: () => `
set -e
echo ">>> [1/4] Checking Docker..."
if ! command -v docker &>/dev/null; then
  echo ">>> Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
fi
echo ">>> [2/4] Pulling Uptime Kuma..."
docker pull louislam/uptime-kuma:1 2>&1
echo ">>> [3/4] Stopping any existing container..."
docker rm -f uptime-kuma 2>/dev/null || true
echo ">>> [4/4] Starting Uptime Kuma..."
docker run -d \\
  --name uptime-kuma \\
  --restart unless-stopped \\
  -p 3001:3001 \\
  -v uptime-kuma:/app/data \\
  louislam/uptime-kuma:1
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ">>> DONE! Uptime Kuma is running."
echo ">>> On first visit, create your admin account."
echo ">>> ACCESS_URL=http://$PUBLIC_IP:3001"
`,
  },
  {
    slug: "ghost",
    name: "Ghost",
    description: "Professional publishing platform — modern blogging and newsletters.",
    longDescription:
      "Ghost is a powerful app for new-media creators to publish, share, and grow a business around their content. It comes with modern tools to build a website, publish content, send newsletters & offer paid subscriptions to members.",
    icon: "👻",
    category: "CMS",
    tags: ["blog", "cms", "newsletter"],
    minRamMb: 512,
    minDiskMb: 2048,
    minCpu: 1,
    port: 2368,
    fields: [
      { key: "url", label: "Site URL", type: "text", required: true, placeholder: "http://your-ip-or-domain", helpText: "e.g. http://123.45.67.89" },
    ],
    buildScript: (c) => `
set -e
echo ">>> [1/4] Checking Docker..."
if ! command -v docker &>/dev/null; then
  echo ">>> Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
fi
echo ">>> [2/4] Pulling Ghost image..."
docker pull ghost:alpine 2>&1
echo ">>> [3/4] Stopping any existing container..."
docker rm -f ghost 2>/dev/null || true
echo ">>> [4/4] Starting Ghost..."
docker run -d \\
  --name ghost \\
  --restart unless-stopped \\
  -p 2368:2368 \\
  -e url="${c.url}" \\
  -v ghost_content:/var/lib/ghost/content \\
  ghost:alpine
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ">>> DONE! Ghost CMS is running."
echo ">>> Admin panel at: ${c.url}/ghost"
echo ">>> ACCESS_URL=${c.url}"
`,
  },
  {
    slug: "nextcloud",
    name: "Nextcloud",
    description: "Self-hosted cloud storage — your own Google Drive/Dropbox.",
    longDescription:
      "Nextcloud is the most popular self-hosted content collaboration platform. Store files, contacts, calendars, and communicate and collaborate across your devices with Nextcloud.",
    icon: "☁️",
    category: "Storage",
    tags: ["storage", "files", "cloud", "sync"],
    minRamMb: 512,
    minDiskMb: 10240,
    minCpu: 1,
    port: 8080,
    fields: [
      { key: "admin_user", label: "Admin Username", type: "text", required: true, placeholder: "admin" },
      { key: "admin_password", label: "Admin Password", type: "password", required: true, placeholder: "••••••••" },
    ],
    buildScript: (c) => `
set -e
echo ">>> [1/4] Checking Docker..."
if ! command -v docker &>/dev/null; then
  echo ">>> Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
fi
echo ">>> [2/4] Pulling Nextcloud..."
docker pull nextcloud:apache 2>&1
echo ">>> [3/4] Stopping any existing container..."
docker rm -f nextcloud 2>/dev/null || true
echo ">>> [4/4] Starting Nextcloud..."
docker run -d \\
  --name nextcloud \\
  --restart unless-stopped \\
  -p 8080:80 \\
  -e NEXTCLOUD_ADMIN_USER="${c.admin_user}" \\
  -e NEXTCLOUD_ADMIN_PASSWORD="${c.admin_password}" \\
  -v nextcloud:/var/www/html \\
  nextcloud:apache
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ">>> DONE! Nextcloud is starting (first boot takes ~60 seconds)."
echo ">>> ACCESS_URL=http://$PUBLIC_IP:8080"
`,
  },
  {
    slug: "wordpress",
    name: "WordPress",
    description: "The world's most popular CMS — power 43% of the web.",
    longDescription:
      "WordPress is open source software you can use to create a beautiful website, blog, or app. WordPress powers more than 43% of the web, from hobby blogs to the biggest news sites online.",
    icon: "🔵",
    category: "CMS",
    tags: ["blog", "cms", "website"],
    minRamMb: 512,
    minDiskMb: 5120,
    minCpu: 1,
    port: 8000,
    fields: [
      { key: "site_title", label: "Site Title", type: "text", required: true, placeholder: "My Awesome Site" },
      { key: "admin_user", label: "Admin Username", type: "text", required: true, placeholder: "admin" },
      { key: "admin_password", label: "Admin Password", type: "password", required: true, placeholder: "••••••••" },
      { key: "admin_email", label: "Admin Email", type: "email", required: true, placeholder: "admin@example.com" },
    ],
    buildScript: (c) => `
set -e
echo ">>> [1/5] Checking Docker..."
if ! command -v docker &>/dev/null; then
  echo ">>> Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
fi
if ! command -v docker compose version &>/dev/null && ! docker compose version &>/dev/null 2>&1; then
  apt-get install -y -q docker-compose-plugin 2>&1 || true
fi
echo ">>> [2/5] Writing docker-compose.yml..."
mkdir -p /opt/wordpress
cat > /opt/wordpress/docker-compose.yml << 'COMPOSE'
version: "3.8"
services:
  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpass123
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wpuser
      MYSQL_PASSWORD: wppass123
    volumes:
      - db_data:/var/lib/mysql
  wordpress:
    image: wordpress:latest
    restart: unless-stopped
    ports:
      - "8000:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wpuser
      WORDPRESS_DB_PASSWORD: wppass123
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html
    depends_on:
      - db
volumes:
  db_data:
  wp_data:
COMPOSE
echo ">>> [3/5] Stopping any existing WordPress stack..."
cd /opt/wordpress && docker compose down 2>/dev/null || true
echo ">>> [4/5] Pulling images..."
cd /opt/wordpress && docker compose pull 2>&1
echo ">>> [5/5] Starting WordPress + MySQL..."
cd /opt/wordpress && docker compose up -d
PUBLIC_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || hostname -I | awk '{print $1}')
echo ">>> DONE! WordPress is starting (wait ~30 seconds for DB init)."
echo ">>> Complete setup at: http://$PUBLIC_IP:8000/wp-admin/install.php"
echo ">>> ACCESS_URL=http://$PUBLIC_IP:8000"
`,
  },
];

export function getApp(slug: string): App | undefined {
  return APP_CATALOG.find((a) => a.slug === slug);
}
