virsh-wrapper
=============

A wrapper to use libvirt-tools in a multi user environment

##Usage

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

##Ressources
* virsh manpage: http://sancho.ccd.uniroma2.it/cgi-bin/man/man2html?virsh+1
* libvirt docs: http://libvirt.org/deployment.html

---

# New Structure (more general)

(WIP)

- namensideen:
    - `wirt` - **w**eimarnetz-v**ir**tualisierungs **t**ool
    - `mutti` - **m**ulti **u**ser/**t**enant **t**erminal **i**ntegration

## API

how it works?
- file-based: users on host write to their own config files
- pull-based: manager tool reads user's config and acts on it

config:
- endpoint: `~/virsh/` (folder in user's `$HOME directory`)

### fs example old:

    ~/virsh
    ├── dom-mymachine
    │   ├── start       # command, empty file
    │   ├── stop        # command, emptyfile
    │   ├── destroy     # command, emptyfile
    │   └── autostart   # command, empty file to enable; file content `--disable` to disable
    ├── history
    │   ├── 18_Feb_13_14.12-dom-mymachine-destroy
    │   └── 18_Feb_13_14.13-dom-mymachine-start
    └── log
        ├── 18_Feb_13_14.12-ma-dom-mymachine-destroy.log
        └── 18_Feb_13_14.13-ma-dom-mymachine-start.log


### fs example new 1:

    ~/wirt
    │
    ├── api
    │   ├── domain
    │   │   └── mykiste
    │   │       └── settings.json       # { "knoten": 178, "exthost": "kiste.in.weimarnetz.de" }
    │   └── vm
    │       └── mymachine
    │           ├── settings.json       # { "autostart": true }
    │           ├── status.json         # { "ok": true }
    │           ├── destroy             # command file [user +w, host +r]
    │           ├── start               # command file
    │           └── stop                # command file
    │
    └── logs
        ├── domain
        │   └── kiste.in.weimarnetz.log
        ├── history.log
        └── vm
            ├── mymachine.log           # a logfile for each vm
            └── mymachine.log.1.tgz     # [host +w, user +r]

### fs example new 2:

this could be even more split up if we find a reason.  
for example, it would be nice to seperate on a root level between user-writable and readable files.  
i.e. `logs` is read-only (since the host writes there).
`/api/vm/mymachine/.` has both commands and status.

    ~/wirt
    │
    ├── command                 # COMMANDS (user can "send")
    │   ├── domain              # domain resources
    │   │   └── mykiste         # example: mykiste
    │   │       ├── config      # settings.json to change
    │   │       ├── start       # empty
    │   │       └── stop        # empty
    │   │ 
    │   └── vm                  # vm resources
    │       └── mymachine       # example: mymachine
    │           ├── config      # settings.json to change
    │           ├── destroy     # empty
    │           ├── start       # empty
    │           └── stop        # empty
    │
    ├── info                    # INFO [host +w, user +r]
    │   ├── domain
    │   │   └── mykiste
    │   │       └── settings.json
    │   └── vm
    │       └── mymachine
    │           ├── settings.json
    │           └── status.json
    │
    └── logs                    # info [host +w, user +r]
        ├── domain
        │   └── kiste.in.weimarnetz.log
        ├── history.log
        └── vm
            ├── mymachine.log
            └── mymachine.log.1.tgz

in this version `/logs` and `/info` are to be written by the host and read by user, `/command` is the other way around (better name for `command` would be nice).


### Security

- security/rights management is all handled via unix user&group permissions
- authentication: not integrated in tool (since it's handled by OS)

### Resources/Services

from an api perspective, the supported *services* are **resources**.
for now, only virtual machines are supported.

#### Machines

- name: `dom-` (new: `vm/`)
- name: `dom-` (new: `vm/`)

