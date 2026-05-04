# /publish-live - preview -> whiteport.com

Publish the current Mobile-Ivonne preview article to production.

## Goal

Marten says `/publish-live`. You merge `preview` into `master`; GitHub Actions deploys `master` to `whiteport.com`.

Marten should see only URL/status, not branch names, PR numbers, or deploy details.

## 1. Confirm

Ask:

> Publicera preview live pa whiteport.com? (j/n)

If answer is not `j`, stop.

## 2. Prepare Preview

```bash
git fetch origin master preview
git checkout preview
git rebase origin/master
git push --force-with-lease origin preview
```

If rebase conflicts, stop and say:

> Preview har konflikt mot master. Jag behover losa den innan publicering.

## 3. Merge To Master

Prefer a PR so GitHub keeps a readable audit trail:

```bash
PR_URL=$(gh pr list --base master --head preview --state open --json url --jq '.[0].url')
if [ -z "$PR_URL" ]; then
  PR_URL=$(gh pr create \
    --base master \
    --head preview \
    --title "Publish preview to whiteport.com" \
    --body "Mobile-Ivonne publish-live")
fi

gh pr merge "$PR_URL" --merge --delete-branch=false
```

## 4. Production URL

GitHub Actions deploys production:

```text
https://whiteport.com/
```

For a blog article, return:

```text
https://whiteport.com/blog/<slug>/
```

## 5. Tell Marten

Keep it short:

> Publicering startad. Live-lank: https://whiteport.com/blog/<slug>/

When the deploy notification arrives, report:

> Live: https://whiteport.com/blog/<slug>/
