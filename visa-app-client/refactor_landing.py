import os
import re

directory = r"e:\Programming\RapidGrowIt\ClientWrokSpace\visa_application\visa-app-client\app\(landing)"

import_code = """import { useGetSiteSettingsQuery } from "@/redux/api/settingsApi";
import { TSiteSettings } from "@/types/settings";
"""

settings_fetch_code = """  const { data: siteResponse } = useGetSiteSettingsQuery({});

  const siteSettings = (siteResponse?.data ?? {
    siteName: "ImmiAccount",
    brandName: "Australian Government",
    departmentName: "Department of Home Affairs",
  }) as TSiteSettings;
"""

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "Australian Government" not in content:
        return

    # Add imports after first imports or after "use client"
    if 'import { useGetSiteSettingsQuery }' not in content:
        if 'import Link' in content:
            content = content.replace('import Link from "next/link";', 'import Link from "next/link";\n' + import_code)
        elif '"use client";' in content:
            content = content.replace('"use client";', '"use client";\n' + import_code)

    # Inject settings fetch
    if 'const { data: siteResponse }' not in content:
        # Match function Page() or function Home() or const Page = () => or const Home = () =>
        content = re.sub(r'(export default function \w+\(\) \{|export default \(\) => \{|const \w+ = \(\) => \{|export default function Page\(\) \{)', r'\1\n' + settings_fetch_code, content)

    # Replace strings
    content = content.replace('Australian Government', '{siteSettings.brandName}')
    content = content.replace('Department of Home Affairs', '{siteSettings.departmentName}')
    # No, ImmiAccount is already handled in landing/page.tsx, but check others too.
    # Be careful not to replace them within {siteSettings.siteName} if already replaced.
    # Actually, we should replace hardcoded "ImmiAccount" with {siteSettings.siteName} but only if it's not already in braces.
    
    # Simple replace is risky if already replaced, but re.sub can handle it.
    # Actually, I'll just do the known strings.
    
    # We should avoid double braces like {{siteSettings.siteName}}
    content = content.replace('ImmiAccount', '{siteSettings.siteName}')
    content = content.replace('{{siteSettings.brandName}}', '{siteSettings.brandName}')
    content = content.replace('{{siteSettings.departmentName}}', '{siteSettings.departmentName}')
    content = content.replace('{{siteSettings.siteName}}', '{siteSettings.siteName}')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk(directory):
    for file in files:
        if file == "page.tsx":
            process_file(os.path.join(root, file))
