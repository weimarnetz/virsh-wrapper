virsh-wrapper
=============

A wrapper to use libvirt-tools in a multi user environment

##Usage

###Users
* must be members of a specific group (e. g. vmguests)
* create a directory named virsh
* for every virtual machine (domain) a subdirectory should be created, naming convention: dom-<domain name>
* in a directory the user creates files named by the action
 * for simple commands you only need to touch a file (e.g. start)
 * the content of a file is used as parameter, except domain name
* files are processed in descending order of last change time (first in, first out)
 
###System
* a cronjob runs every x minutes and loops users and directories
* in case of errors a mail is sent to root and the user

  
