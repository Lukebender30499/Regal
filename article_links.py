import json

def make_title(url):
    # strip trailing slash, split off the /explained/ prefix
    suffix = url.rstrip('/').split('/explained/')[-1]
    # replace hyphens with spaces and capitalize each word
    return ' '.join(word.capitalize() for word in suffix.split('-'))

# load your URLs
with open('urls.txt') as f:
    urls = [line.strip() for line in f if line.strip()]

# build mapping
mapping = [{'title': make_title(u), 'url': u} for u in urls]
titles_only = [item['title'] for item in mapping]

# write out files
with open('mapping.json', 'w') as f:
    json.dump(mapping, f, indent=2)
with open('titles.txt', 'w') as f:
    f.write('\n'.join(titles_only))