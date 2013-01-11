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
