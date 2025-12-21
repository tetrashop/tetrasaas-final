// تست کامل تمام سرویس‌های TetraSaaS
const http = require('http');

console.log('🧪 تست کامل TetraSaaS Platform');
console.log('==============================');

const tests = [
    { name: 'سرور اصلی', endpoint: '/', method: 'GET' },
    { name: 'سلامت سرویس‌ها', endpoint: '/api/health', method: 'GET' },
    { name: 'لیست سرویس‌ها', endpoint: '/api/services', method: 'GET' },
    { name: 'آمار سیستم', endpoint: '/api/stats', method: 'GET' },
    { name: 'اطلاعات دیپلوی', endpoint: '/api/deploy-info', method: 'GET' }
];

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

let passed = 0;
let failed = 0;

function runTest(test, index) {
    return new Promise((resolve) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: test.endpoint,
            method: test.method,
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`✅ ${index + 1}. ${test.name}: موفق (کد: ${res.statusCode})`);
                    passed++;
                } catch (e) {
                    if (res.statusCode === 200) {
                        console.log(`✅ ${index + 1}. ${test.name}: موفق (HTML بازگشت داده)`);
                        passed++;
                    } else {
                        console.log(`❌ ${index + 1}. ${test.name}: ناموفق (کد: ${res.statusCode})`);
                        failed++;
                    }
                }
                resolve();
            });
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${index + 1}. ${test.name}: خطا - ${err.message}`);
            failed++;
            resolve();
        });
        
        req.on('timeout', () => {
            console.log(`❌ ${index + 1}. ${test.name}: timeout`);
            failed++;
            req.destroy();
            resolve();
        });
        
        req.end();
    });
}

async function runAllTests() {
    console.log(`\n📡 تست از آدرس: http://${HOST}:${PORT}`);
    console.log('=' .repeat(40));
    
    for (let i = 0; i < tests.length; i++) {
        await runTest(tests[i], i);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n📊 نتایج تست:');
    console.log('=' .repeat(40));
    console.log(`✅ موفق: ${passed}`);
    console.log(`❌ ناموفق: ${failed}`);
    console.log(`📈 نرخ موفقیت: ${Math.round((passed / tests.length) * 100)}%`);
    
    if (failed === 0) {
        console.log('\n🎉 تمام تست‌ها با موفقیت گذرانده شدند!');
        process.exit(0);
    } else {
        console.log('\n⚠️ برخی تست‌ها ناموفق بودند.');
        process.exit(1);
    }
}

// بررسی اگر سرور در حال اجراست
runAllTests();
