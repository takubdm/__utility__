is_in_git_project() {
    if [ "$(git_branch)" != "" ]; then
        echo true
    else
        echo false
    fi
}
get_color() {
    local color="$1"
    case "${color}" in
        "BLUE") echo $'\001\e[1;34m\002';;
        "RED") echo $'\001\e[1;31m\002';;
        "GREEN") echo $'\001\e[1;32m\002';;
        "GRAY") echo $'\001\e[1;37m\002';;
        "WHITE") echo $'\001\e[1;00m\002';;
        *) echo $'\001\e[00m\002';;
    esac
}
reset_color() {
    echo $(get_color)
}
switch_color() {
    local MASTER="[master]"
    case "$(branch_name)" in
        "${MASTER}") echo $(get_color "RED");;
        *) echo $(get_color "GREEN");;
    esac
}
git_branch() {
    echo "\$(switch_color)\$(branch_name)\$(reset_color)"
}
branch_name() {
    git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/[\1]/'
}
promps() {
    local DEFAULT_PROMPT="\u@\h:\W\$ "

    case $TERM in
        xterm*) TITLEBAR='\001\e]0;\W\007\002';;
        *)      TITLEBAR="";;
    esac

    if [ "$(is_in_git_project)" = true ]; then
        PS1="${TITLEBAR}\u@\h:\W $(git_branch)\$ "
    else
        PS1="${DEFAULT_PROMPT}"
    fi
}
promps
