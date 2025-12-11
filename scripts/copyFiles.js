const fs = require("fs-extra");

async function copyFiles() {
  try {
    await fs.copy("public", ".next/standalone/public");
    // copy file .env
    await fs.copy(".env", ".next/standalone/.env");
    await fs.copy(".next/static", ".next/standalone/.next/static");
    await fs.copy("Dockerfile.sv18", ".next/standalone/Dockerfile");
    await fs.copy("docker-compose.yml", ".next/standalone/docker-compose.yml");
    // xóa .cache trong thư mục .next/standalone/node_modules
    await fs.remove(".next/standalone/node_modules/.cache");
    console.log("✅ Đã copy thư mục public & .next/static vào standalone");
    console.log("✅ Đã copy .env vào standalone");
    console.log("✅ Đã copy Dockerfile vào standalone");
    console.log("✅ Đã xóa thư mục .cache trong node_modules");
  } catch (err) {
    console.error("❌ Lỗi khi copy file:", err);
    process.exit(1);
  }
}

copyFiles();
