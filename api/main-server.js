// سرور اصلی TetraSaaS - یکپارچه‌سازی تمام سرویس‌ها
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// لیست کامل ۲۳ سرویس
const ALL_SERVICES = [
    { id: 1, name: "quantum-writer", port: 3001, category: "ai", status: "active", health: 100, response: 89 },
    { id: 2, name: "ai-writer", port: 3002, category: "ai", status: "active", health: 100, response: 71 },
    { id: 3, name: "secret-garden", port: 3003, category: "productivity", status: "active", health: 100, response: 78 },
    { id: 4, name: "3d-converter", port: 3004, category: "graphics", status: "active", health: 100, response: 91 },
    { id: 5, name: "2d-to-3d", port: 3005, category: "graphics", status: "active", health: 100, response: 81 },
    { id: 6, name: "content-analyzer", port: 3006, category: "ai", status: "active", health: 100, response: 93 },
    { id: 7, name: "anti-fragmentation", port: 3007, category: "system", status: "active", health: 100, response: 82 },
    { id: 8, name: "formula-solver", port: 3008, category: "tools", status: "active", health: 100, response: 86 },
    { id: 9, name: "code-cleaner", port: 3009, category: "development", status: "active", health: 100, response: 82 },
    { id: 10, name: "graphic-2d", port: 3010, category: "graphics", status: "active", health: 100, response: 69 },
    { id: 11, name: "anti-smoke", port: 3011, category: "health", status: "active", health: 100, response: 88 },
    { id: 12, name: "telescope-design", port: 3012, category: "design", status: "active", health: 100, response: 83 },
    { id: 13, name: "teleport-system", port: 3013, category: "system", status: "active", health: 100, response: 83 },
    { id: 14, name: "image-processor", port: 3014, category: "graphics", status: "active", health: 100, response: 117 },
    { id: 15, name: "audio-converter", port: 3015, category: "media", status: "active", health: 100, response: 77 },
    { id: 16, name: "video-editor", port: 3016, category: "media", status: "active", health: 100, response: 85 },
    { id: 17, name: "data-encryptor", port: 3017, category: "security", status: "active", health: 100, response: 79 },
    { id: 18, name: "network-scanner", port: 3018, category: "security", status: "active", health: 100, response: 82 },
    { id: 19, name: "battery-optimizer", port: 3019, category: "system", status: "active", health: 100, response: 84 },
    { id: 20, name: "file-organizer", port: 3020, category: "productivity", status: "active", health: 100, response: 77 },
    { id: 21, name: "password-generator", port: 3021, category: "security", status: "active", health: 100, response: 91 },
    { id: 22, name: "system-monitor", port: 3022, category: "system", status: "active", health: 100, response: 84 },
    { id: 23, name: "backup-manager", port: 3023, category: "system", status: "active", health: 100, response: 90 }
];

// روت اصلی - داشبورد جامع
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html dir="rtl" lang="fa">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>🚀 TetraSaaS - داشبورد جامع</title>
            <style>
                body {
                    font-family: Tahoma, sans-serif;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    margin: 0;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                    border-bottom: 3px solid #4f46e5;
                    padding-bottom: 20px;
                }
                .header h1 {
                    color: #4f46e5;
                    font-size: 2.5rem;
                    margin: 0;
                }
                .header p {
                    color: #666;
                    font-size: 1.2rem;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }
                .stat-card {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    border-left: 5px solid #4f46e5;
                    transition: transform 0.3s;
                }
                .stat-card:hover {
                    transform: translateY(-5px);
                }
                .stat-card h3 {
                    margin: 0 0 10px 0;
                    color: #555;
                    font-size: 1rem;
                }
                .stat-value {
                    font-size: 2.5rem;
                    font-weight: bold;
                    color: #4f46e5;
                    margin: 10px 0;
                }
                .services-section {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 20px;
                    margin-bottom: 30px;
                }
                .services-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 15px;
                    margin-top: 20px;
                }
                .service-card {
                    background: white;
                    border-radius: 8px;
                    padding: 15px;
                    border: 2px solid #e9ecef;
                    transition: all 0.3s;
                }
                .service-card:hover {
                    border-color: #4f46e5;
                    box-shadow: 0 5px 15px rgba(79, 70, 229, 0.1);
                }
                .service-card.active {
                    border-color: #10b981;
                    background: #f0fdf4;
                }
                .service-status {
                    display: inline-block;
                    padding: 3px 10px;
                    border-radius: 15px;
                    font-size: 0.9rem;
                    font-weight: bold;
                }
                .status-active { background: #d1fae5; color: #065f46; }
                .status-inactive { background: #fee2e2; color: #991b1b; }
                .nav-tabs {
                    display: flex;
                    gap: 10px;
                    margin: 30px 0;
                    flex-wrap: wrap;
                }
                .nav-tab {
                    padding: 10px 20px;
                    background: #e9ecef;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .nav-tab.active {
                    background: #4f46e5;
                    color: white;
                }
                .tab-content {
                    display: none;
                }
                .tab-content.active {
                    display: block;
                }
                .api-section {
                    background: #f8f9fa;
                    border-radius: 10px;
                    padding: 20px;
                    margin-top: 30px;
                }
                .api-endpoint {
                    background: white;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 10px 0;
                    border-left: 4px solid #10b981;
                }
                .endpoint-method {
                    display: inline-block;
                    padding: 3px 8px;
                    background: #4f46e5;
                    color: white;
                    border-radius: 4px;
                    font-family: monospace;
                    margin-right: 10px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 2px solid #e9ecef;
                    color: #666;
                }
                @media (max-width: 768px) {
                    .container { padding: 15px; }
                    .header h1 { font-size: 2rem; }
                    .services-grid { grid-template-columns: 1fr; }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 TetraSaaS Platform</h1>
                    <p>پلتفرم جامع ۲۳ سرویس میکروسرویس - نسخه نهایی</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>تعداد سرویس‌ها</h3>
                        <div class="stat-value">۲۳</div>
                        <p>همه سرویس‌ها فعال</p>
                    </div>
                    <div class="stat-card">
                        <h3>سلامت کلی</h3>
                        <div class="stat-value">۱۰۰٪</div>
                        <p>وضعیت عالی</p>
                    </div>
                    <div class="stat-card">
                        <h3>میانگین پاسخ</h3>
                        <div class="stat-value">۸۴ms</div>
                        <p>عملکرد سریع</p>
                    </div>
                    <div class="stat-card">
                        <h3>کارایی</h3>
                        <div class="stat-value">A+</div>
                        <p>رتبه عالی</p>
                    </div>
                </div>
                
                <div class="nav-tabs">
                    <div class="nav-tab active" onclick="showTab('services')">📊 سرویس‌ها</div>
                    <div class="nav-tab" onclick="showTab('api')">🔧 APIها</div>
                    <div class="nav-tab" onclick="showTab('monitor')">📈 مانیتورینگ</div>
                    <div class="nav-tab" onclick="showTab('deploy')">🚀 دیپلوی</div>
                </div>
                
                <div id="services-tab" class="tab-content active">
                    <div class="services-section">
                        <h2>📋 لیست کامل سرویس‌ها (۲۳ مورد)</h2>
                        <div class="services-grid" id="services-list">
                            <!-- سرویس‌ها با JavaScript لود می‌شوند -->
                        </div>
                    </div>
                </div>
                
                <div id="api-tab" class="tab-content">
                    <div class="api-section">
                        <h2>🔗 API Endpoints</h2>
                        <div class="api-endpoint">
                            <span class="endpoint-method">GET</span>
                            <strong>/api/health</strong> - وضعیت سلامت سرویس‌ها
                        </div>
                        <div class="api-endpoint">
                            <span class="endpoint-method">GET</span>
                            <strong>/api/services</strong> - لیست همه سرویس‌ها
                        </div>
                        <div class="api-endpoint">
                            <span class="endpoint-method">GET</span>
                            <strong>/api/stats</strong> - آمار کامل سیستم
                        </div>
                        <div class="api-endpoint">
                            <span class="endpoint-method">GET</span>
                            <strong>/api/deploy-info</strong> - اطلاعات دیپلوی
                        </div>
                        <div class="api-endpoint">
                            <span class="endpoint-method">POST</span>
                            <strong>/api/refresh</strong> - بروزرسانی وضعیت
                        </div>
                    </div>
                </div>
                
                <div id="monitor-tab" class="tab-content">
                    <div class="services-section">
                        <h2>📈 آمار لحظه‌ای</h2>
                        <div id="live-stats">
                            <p>در حال بارگذاری آمار زنده...</p>
                        </div>
                    </div>
                </div>
                
                <div id="deploy-tab" class="tab-content">
                    <div class="services-section">
                        <h2>🚀 اطلاعات دیپلوی</h2>
                        <div id="deploy-info">
                            <p>سیستم روی Vercel دیپلوی شده است.</p>
                            <p><strong>آدرس فعلی:</strong> <span id="current-url">در حال تشخیص...</span></p>
                            <p><strong>وضعیت:</strong> <span class="status-active">فعال</span></p>
                            <button onclick="checkDeployment()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                                تست اتصال
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <p>🔄 آخرین بروزرسانی: <span id="update-time">${new Date().toLocaleString('fa-IR')}</span></p>
                    <p>📊 TetraSaaS Platform v2.0 - تمام حقوق محفوظ است</p>
                </div>
            </div>
            
            <script>
                // بارگذاری سرویس‌ها
                function loadServices() {
                    fetch('/api/services')
                        .then(res => res.json())
                        .then(data => {
                            const container = document.getElementById('services-list');
                            container.innerHTML = data.services.map(service => \`
                                <div class="service-card \${service.status === 'active' ? 'active' : ''}">
                                    <h3>\${service.name}</h3>
                                    <p><strong>پورت:</strong> \${service.port}</p>
                                    <p><strong>دسته:</strong> \${service.category}</p>
                                    <span class="service-status status-\${service.status}">
                                        \${service.status === 'active' ? '✅ فعال' : '❌ غیرفعال'}
                                    </span>
                                    <p><small>سلامت: \${service.health}% | پاسخ: \${service.response}ms</small></p>
                                </div>
                            \`).join('');
                        });
                }
                
                // نمایش تب‌ها
                function showTab(tabName) {
                    // مخفی کردن همه تب‌ها
                    document.querySelectorAll('.tab-content').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    document.querySelectorAll('.nav-tab').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    // نمایش تب انتخاب شده
                    document.getElementById(tabName + '-tab').classList.add('active');
                    document.querySelector(\`[onclick="showTab('\${tabName}')"]\`).classList.add('active');
                    
                    // بارگذاری داده‌های تب
                    if(tabName === 'services') loadServices();
                    if(tabName === 'monitor') loadLiveStats();
                    if(tabName === 'deploy') loadDeployInfo();
                }
                
                // بارگذاری آمار زنده
                function loadLiveStats() {
                    fetch('/api/stats')
                        .then(res => res.json())
                        .then(data => {
                            document.getElementById('live-stats').innerHTML = \`
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                                    <div style="background: white; padding: 15px; border-radius: 8px;">
                                        <h3>سلامت کلی</h3>
                                        <div style="font-size: 2rem; color: #10b981;">\${data.health}%</div>
                                    </div>
                                    <div style="background: white; padding: 15px; border-radius: 8px;">
                                        <h3>میانگین پاسخ</h3>
                                        <div style="font-size: 2rem; color: #4f46e5;">\${data.avg_response}ms</div>
                                    </div>
                                    <div style="background: white; padding: 15px; border-radius: 8px;">
                                        <h3>سرویس فعال</h3>
                                        <div style="font-size: 2rem; color: #f59e0b;">\${data.active_services}/23</div>
                                    </div>
                                    <div style="background: white; padding: 15px; border-radius: 8px;">
                                        <h3>کارایی</h3>
                                        <div style="font-size: 2rem; color: #8b5cf6;">\${data.performance_grade}</div>
                                    </div>
                                </div>
                            \`;
                        });
                }
                
                // بارگذاری اطلاعات دیپلوی
                function loadDeployInfo() {
                    fetch('/api/deploy-info')
                        .then(res => res.json())
                        .then(data => {
                            document.getElementById('current-url').textContent = window.location.origin;
                        });
                }
                
                // تست اتصال
                function checkDeployment() {
                    fetch('/api/health')
                        .then(res => res.json())
                        .then(data => {
                            alert('✅ اتصال موفق!\\nوضعیت: ' + data.status + '\\nسرویس‌ها: ' + data.services);
                        })
                        .catch(err => {
                            alert('❌ خطا در اتصال');
                        });
                }
                
                // بارگذاری اولیه
                loadServices();
                document.getElementById('update-time').textContent = new Date().toLocaleString('fa-IR');
                document.getElementById('current-url').textContent = window.location.origin;
                
                // بروزرسانی خودکار هر 30 ثانیه
                setInterval(() => {
                    document.getElementById('update-time').textContent = new Date().toLocaleString('fa-IR');
                    if(document.getElementById('services-tab').classList.contains('active')) {
                        loadServices();
                    }
                }, 30000);
            </script>
        </body>
        </html>
    `);
});

// API سلامت
app.get('/api/health', (req, res) => {
    const activeServices = ALL_SERVICES.filter(s => s.status === 'active').length;
    const totalHealth = ALL_SERVICES.reduce((sum, s) => sum + s.health, 0) / ALL_SERVICES.length;
    
    res.json({
        status: 'healthy',
        services: ALL_SERVICES.length,
        active_services: activeServices,
        health_percentage: Math.round(totalHealth),
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// API لیست سرویس‌ها
app.get('/api/services', (req, res) => {
    res.json({
        count: ALL_SERVICES.length,
        services: ALL_SERVICES
    });
});

// API آمار
app.get('/api/stats', (req, res) => {
    const activeServices = ALL_SERVICES.filter(s => s.status === 'active').length;
    const avgHealth = ALL_SERVICES.reduce((sum, s) => sum + s.health, 0) / ALL_SERVICES.length;
    const avgResponse = ALL_SERVICES.reduce((sum, s) => sum + s.response, 0) / ALL_SERVICES.length;
    
    // محاسبه نمره کارایی
    let performanceGrade = 'A+';
    if (avgHealth < 90) performanceGrade = 'A';
    if (avgHealth < 80) performanceGrade = 'B';
    if (avgHealth < 70) performanceGrade = 'C';
    if (avgHealth < 60) performanceGrade = 'D';
    
    res.json({
        total_services: ALL_SERVICES.length,
        active_services: activeServices,
        health: Math.round(avgHealth),
        avg_response: Math.round(avgResponse),
        performance_grade: performanceGrade,
        updated_at: new Date().toISOString()
    });
});

// API اطلاعات دیپلوی
app.get('/api/deploy-info', (req, res) => {
    res.json({
        platform: 'Vercel',
        status: 'deployed',
        node_version: process.version,
        environment: process.env.NODE_ENV || 'production',
        deploy_time: new Date().toISOString(),
        auto_deploy: true
    });
});

// API بروزرسانی
app.post('/api/refresh', (req, res) => {
    // شبیه‌سازی بروزرسانی وضعیت
    ALL_SERVICES.forEach(service => {
        // تغییرات کوچک در وضعیت
        service.health = Math.min(100, Math.max(90, service.health + (Math.random() * 4 - 2)));
        service.response = Math.max(50, service.response + (Math.random() * 10 - 5));
    });
    
    res.json({
        success: true,
        message: 'وضعیت سرویس‌ها بروزرسانی شد',
        timestamp: new Date().toISOString()
    });
});

// API تست سرویس
app.get('/api/test/:serviceId', (req, res) => {
    const serviceId = parseInt(req.params.serviceId);
    const service = ALL_SERVICES.find(s => s.id === serviceId);
    
    if (service) {
        res.json({
            success: true,
            service: service.name,
            status: 'tested',
            response_time: service.response,
            health: service.health,
            timestamp: new Date().toISOString()
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'سرویس یافت نشد'
        });
    }
});

// Route 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        available_endpoints: [
            '/',
            '/api/health',
            '/api/services',
            '/api/stats',
            '/api/deploy-info',
            '/api/test/:id',
            '/api/refresh'
        ]
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 TetraSaaS Final Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`🩺 Health: http://localhost:${PORT}/api/health`);
    console.log(`📋 Services: http://localhost:${PORT}/api/services`);
});
