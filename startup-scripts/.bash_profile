# Latest git
export PATH=/usr/local/Cellar/git/2.21.0/bin:$PATH

# Bash completion
[[ -r "/usr/local/etc/profile.d/bash_completion.sh" ]] && . "/usr/local/etc/profile.d/bash_completion.sh"

# Git completion
. /usr/local/Cellar/git/2.21.0/etc/bash_completion.d/yarn-completion.bash
. /usr/local/Cellar/git/2.21.0/etc/bash_completion.d/git-completion.bash
. /usr/local/Cellar/git/2.21.0/etc/bash_completion.d/git-flow-completion.bash
