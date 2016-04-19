# Location Plan

## MapFish Print configuration

The print-apps folder was moved to the project.
`/var/lib/tomcat7/webapps/print/print-apps` is now a link to the project's `print-apps` folder.

```
sudo ln -s /home/jgr/WebstormProjects/MyDashBoard/print-apps /var/lib/tomcat7/webapps/print/print-apps
```

## Snapshot

Cf [git-how-to-get-a-snapshot-of-a-git-repository](git-how-to-get-a-snapshot-of-a-git-repository)

http://gitready.com/

## Repo moved to GitLab

```
rm -rf .git
git init
git config user.name "Jorge Gustavo Rocha"
git config user.email "jgr@geomaster.pt"
git remote add origin git@gitlab.com:jgrocha/MyDashBoard.git
vi .gitignore
git add .

```
