#!/bin/bash

echo "🚀 مدیر دیپلوی TetraSaaS"
echo "========================"

PROJECT_DIR="/data/data/com.termux/files/home/tetrasaas-final"
cd "$PROJECT_DIR" || exit 1

case "$1" in
    "init")
        echo "🎯 راه‌اندازی Git..."
        git init
        git config user.email "tetrasaas@example.com"
        git config user.name "TetraSaaS Team"
        echo "✅ Git آماده است"
        ;;
        
    "commit")
        MESSAGE="${2:-"بروزرسانی پروژه"}"
        echo "💾 کامیت تغییرات: $MESSAGE"
        git add -A
        git commit -m "$MESSAGE - $(date '+%Y/%m/%d %H:%M')"
        echo "✅ کامیت انجام شد"
        ;;
        
    "push")
        echo "📤 پوش به GitHub..."
        
        # بررسی remote
        if ! git remote | grep -q "origin"; then
            echo "⚠️ remote origin تنظیم نشده"
            echo "لطفا ابتدا دستور زیر را اجرا کنید:"
            echo "git remote add origin https://github.com/YOUR-USERNAME/tetrasaas-final.git"
            echo "git branch -M main"
            exit 1
        fi
        
        git push -u origin main
        if [ $? -eq 0 ]; then
            echo "✅ پوش موفقیت‌آمیز بود"
        else
            echo "❌ خطا در پوش"
        fi
        ;;
        
    "deploy")
        echo "🌐 دیپلوی روی Vercel..."
        
        # بررسی Vercel CLI
        if ! command -v vercel &> /dev/null; then
            echo "📦 نصب Vercel CLI..."
            npm install -g vercel
        fi
        
        # دیپلوی
        vercel --prod --yes 2>&1 | tee deploy.log
        
        # استخراج آدرس
        if grep -q "Production:" deploy.log; then
            URL=$(grep -o "https://[^ ]*\.vercel\.app" deploy.log | head -1)
            echo "🎉 دیپلوی موفق!"
            echo "🌐 آدرس: $URL"
            
            # ذخیره آدرس
            echo "$URL" > .deployed-url
            echo "تاریخ: $(date)" >> .deployed-url
            
            # تست اتصال
            sleep 3
            echo "🧪 تست اتصال..."
            curl -s "$URL/api/health" > /dev/null && echo "✅ اتصال موفق" || echo "⚠️ اتصال با مشکل"
        else
            echo "❌ خطا در دیپلوی"
            tail -20 deploy.log
        fi
        ;;
        
    "status")
        echo "📊 وضعیت پروژه:"
        
        # وضعیت Git
        echo "🔧 Git Status:"
        git status --short 2>/dev/null || echo "Git initialized نیست"
        
        # وضعیت فایل‌ها
        echo ""
        echo "📁 ساختار پروژه:"
        find . -type f -name "*.js" -o -name "*.json" -o -name "*.sh" | sort | head -20
        
        # آدرس دیپلوی شده
        if [ -f ".deployed-url" ]; then
            echo ""
            echo "🌐 آدرس دیپلوی شده:"
            head -1 .deployed-url
        fi
        ;;
        
    "backup")
        echo "💾 ایجاد پشتیبان..."
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        BACKUP_DIR="$HOME/tetrasaas-backup-$TIMESTAMP"
        
        mkdir -p "$BACKUP_DIR"
        cp -r . "$BACKUP_DIR/" 2>/dev/null
        
        # حذف node_modules از backup
        rm -rf "$BACKUP_DIR/node_modules" 2>/dev/null
        
        echo "✅ پشتیبان ایجاد شد: $BACKUP_DIR"
        ;;
        
    "full-deploy")
        echo "🚀 اجرای کامل دیپلوی"
        echo "===================="
        
        # 1. Backup
        $0 backup
        
        # 2. Commit
        $0 commit "دیپلوی خودکار $(date '+%Y/%m/%d')"
        
        # 3. Push
        $0 push
        
        # 4. Deploy
        $0 deploy
        
        echo ""
        echo "✅ فرآیند کامل دیپلوی پایان یافت"
        ;;
        
    *)
        echo "استفاده: ./scripts/deploy-manager.sh {init|commit|push|deploy|status|backup|full-deploy}"
        echo ""
        echo "دستورات:"
        echo "  init         - راه‌اندازی Git"
        echo "  commit \"msg\" - کامیت تغییرات"
        echo "  push         - پوش به GitHub"
        echo "  deploy       - دیپلوی روی Vercel"
        echo "  status       - وضعیت پروژه"
        echo "  backup       - ایجاد پشتیبان"
        echo "  full-deploy  - اجرای کامل دیپلوی"
        ;;
esac
