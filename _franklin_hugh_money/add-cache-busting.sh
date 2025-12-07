#!/bin/bash
# Cache Busting Script for Franklin Hugh Money
# Adds versioning to CSS/JS files and cache control meta tags

echo "🔄 Adding cache-busting to HTML files..."
echo ""

# Generate version based on current timestamp
VERSION=$(date +%s)
echo "📌 Version: $VERSION"
echo ""

# Function to add cache meta tags and version query strings
add_cache_busting() {
    local file=$1
    echo "  Processing: $(basename $file)"

    # Create temp file
    temp_file="${file}.tmp"

    # Add cache control meta tags after existing meta tags
    # and add version query strings to CSS/JS files
    awk -v version="$VERSION" '
    /<\/head>/ && !cache_added {
        print "    <!-- Cache Control -->"
        print "    <meta http-equiv=\"Cache-Control\" content=\"no-cache, no-store, must-revalidate\">"
        print "    <meta http-equiv=\"Pragma\" content=\"no-cache\">"
        print "    <meta http-equiv=\"Expires\" content=\"0\">"
        print ""
        cache_added = 1
    }
    /href="[^"]*\.css"/ {
        gsub(/\.css"/, ".css?v=" version "\"")
    }
    /src="[^"]*\.js"/ && !/cdn\./ && !/https:\/\// {
        gsub(/\.js"/, ".js?v=" version "\"")
    }
    { print }
    ' "$file" > "$temp_file"

    # Replace original file
    mv "$temp_file" "$file"
}

# Process all HTML files in public directory
for html_file in public/*.html; do
    if [ -f "$html_file" ]; then
        add_cache_busting "$html_file"
    fi
done

echo ""
echo "✅ Cache-busting added to all HTML files!"
echo ""
echo "📋 Next steps:"
echo "1. Run: ./deploy.sh"
echo "2. Your site will force-refresh for all visitors"
echo ""
echo "💡 Version: ?v=$VERSION added to all local CSS/JS files"