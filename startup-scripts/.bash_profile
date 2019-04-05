# Latest git
export PATH=/usr/local/Cellar/git/2.21.0/bin:$PATH

# Bash completion
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"

# Completions
shopt -s extglob
## Git
. /usr/local/Cellar/git/2.21.0/etc/bash_completion.d/git-completion.bash
. /usr/local/Cellar/git/2.21.0/etc/bash_completion.d/git-flow-completion.bash
## Yarn
. /usr/local/Cellar/git/2.21.0/etc/bash_completion.d/yarn-completion.bash
## Docker
. /Applications/Docker.app/Contents/Resources/etc/docker-compose.bash-completion
. /Applications/Docker.app/Contents/Resources/etc/docker-machine.bash-completion
. /Applications/Docker.app/Contents/Resources/etc/docker.bash-completion

# Exclude : from tokens
COMP_WORDBREAKS=${COMP_WORDBREAKS//:}
