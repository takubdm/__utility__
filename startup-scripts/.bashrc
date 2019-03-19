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
        "BLUE") echo $'\e[1;34m';;
        "RED") echo $'\e[1;31m';;
        "GREEN") echo $'\e[1;32m';;
        "GRAY") echo $'\e[1;37m';;
        "WHITE") echo $'\e[1;00m';;
        *) echo $'\e[00m';;
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
    local SWITCH_COLOR=$(get_color "GREEN")
    local RESET_COLOR=$(reset_color)
    echo "\$(switch_color)\$(branch_name)${RESET_COLOR}"
}
branch_name() {
    git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/[\1]/'
}
promps() {
    local DEFAULT_PROMPT="\u@\h:\W\$ "

    case $TERM in
        xterm*) TITLEBAR='\[\e]0;\W\007\]';;
        *)      TITLEBAR="";;
    esac

    if [ "$(is_in_git_project)" = true ]; then
        PS1="${TITLEBAR}\u@\h:\W $(git_branch)\$ "
    else
        PS1="${DEFAULT_PROMPT}"
    fi
}
promps
