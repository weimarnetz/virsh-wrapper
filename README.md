# wirt -- **w**eimarnetz v**ir**tualization **t**ool

> Be bright and jovial among your guests to-night.  
> *William Shakespeare, "Macbeth"*


:warning: (WIP) :warning:

For end-user usage, see [wirt CLI](https://github.com/weimarnetz/virsh-wrapper/tree/master/cli).

## API

how it works?
- file-based: users on host write to their own config files
- pull-based: manager tool reads user's config and acts on it

config:
- endpoint: `~/virsh/` (folder in user's `$HOME directory`)


### filesystem example

    ~/wirt
    │
    ├── service                 # SERVICES (user can "send" commands to)
    │   │ 
    │   └── vm                  # vm resources
    │       └── mymachine       # example: mymachine
    │           ├── config      # settings.json to change
    │           ├── destroy     # empty
    │           ├── start       # empty
    │           └── stop        # empty
    │
    ├── info                    # INFO [host +w, user +r]
    │   │
    │   └── vm
    │       └── mymachine
    │           └── status.xml
    │
    └── logs                    # logs [host +w, user +r]
        │ 
        ├── history/...         # history dump (should be logfile later)
        └── vm
            ├── mymachine.log
            └── mymachine.log.1.tgz

in this version `/logs` and `/info` are to be written by the host and read by user, 
`/service` is the other way around.

### Security

- security/rights management is all handled via unix user&group permissions
- authentication: not integrated in tool (since it's handled by OS)

### Resources/Services

from an api perspective, the supported *services* are **resources**.
for now, only virtual machines (vm) are supported.

## Implementation/Node

- user can use cli tool (`wirt`), see <>.
- this tool can also do admin function (when the user runningn it has the rights)
- current: in the backend, a shell script reads and acts (via cron)
- new: same, but more modular
    - either `virsh-wrapper` stays monolithic and gets js helper scripts
    - or the main script is js and the `virsh-wrapper` gets more split up in commands

## virsh-wrapper

> A wrapper to use libvirt-tools in a multi user environment

###Users
* must be members of a specific group (e. g. vmguests)
* create a directory named virsh with subdirectories log and history
* for every virtual machine (domain) a subdirectory should be created, naming convention: dom-<domain name>
* change group to vmguests for virsh and all subdirectories and grant read and write permissions to the group
* create a user named wrapper, also a member of vmguests and allow this user to sudo the script
 * wrapper ALL=NOPASSWD=/path/to/virsh_wrapper.sh
* in a directory the user creates files named by the action
 * for simple commands you only need to touch a file (e.g. start)
 * the content of a file is used as parameter, except domain name
* files are processed in descending order of last change time (first in, first out)
 
###System
* a cronjob runs every x minutes and loops users and directories
* in case of errors a mail is sent to root and the user

## Links
* virsh manpage: http://sancho.ccd.uniroma2.it/cgi-bin/man/man2html?virsh+1
* libvirt docs: http://libvirt.org/deployment.html
