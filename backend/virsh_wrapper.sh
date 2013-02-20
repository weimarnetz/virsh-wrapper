#!/bin/bash

# Usage:
# Users need to be in $VMGROUP
# User needs a directory 'virsh' in $HOME
# for every managed domain an own subdirectory is needed, prefix is 'dom-', the machine name is appended
# the system name for the machine is $username-$machinename
# to start a vm: touch /home/$USER/virsh/dom-$VM/start
# to stop a vm: touch /home/$USER/virsh/dom-$VM/destroy 
# to enable autostart on host boot for a vm: touch /home/$USER/virsh/dom-$VM/autostart
# to disable autostart on host boot: echo "--disable" > /home/$USER/virsh/dom-$VM/autostart


VMGROUP="vmguests"				# specifies the group of users that is allowed to control machines
HOMEBASEDIR="/home"				# 

log()						# write log messages
{
	logger "$( date ): [$( pwd )]: $0: $1"
}

mail()
{
	echo ""
}

timestamp()
{
	echo "$( date +%d_%h_%y_%H.%M )"
}

groupmembers()					# returns a space separated list of users
{
	local members="$( grep ^$VMGROUP /etc/group | cut -d ':' -f 4 | sed 's/,/ /g' )"
	echo "$members"
}

compose_virsh_cmd()
{
	local uri="-c qemu:///system"
	local entity="$1"				# $1=Entityname like domain name
	local action="$2"	 	 	 	# $2=Action, the file name
	local user="$3"					# $3=user, the machine owner
	local param="$4"				# $4=command line, the content of the file
	local homepath="$5"
	local curdate
	[ "$param" = "EMPTY" ] && param=""
	case "$entity" in 
		"dom-"*)
			case "$action" in
				# USER COMMANDS
				"start"|"destroy"|"autostart"|"shutdown")
					curdate="$( timestamp )"
					log "virsh  $uri $action --domain $user-$( echo $entity | cut -c '5-' ) $param &>$homepath/log/$curdate-$user-$entity-$action.log "
					echo "$( virsh  $uri $action --domain $user-$( echo $entity | cut -c '5-' ) $param &>$homepath/log/$curdate-$user-$entity-$action.log )"
					mv "$HOMEPATH/$entity/$action" "$HOMEPATH/history/$curdate-$entity-$action"
				;;
				# OTHER COMMANDS
				"status") # dump the info as xml
					echo "$( virsh  $uri dumpxml --domain $user-$( echo $entity | cut -c '5-' ) > $HOMEPATH/$entity/status.xml )"
				;;
				# NO COMMAND FOUND
				*)
					log "Action $action is curently not supported."
				;;
			esac
		;;
	esac
}

sanitize()					# discard filenames or param lists with suspicious characters
{
	if [[ "$1" =~ ^[-/_.:[:alnum:][:space:]]*$ ]]; then 
		echo 0
	else
		echo 1
	fi
}

GROUPMEMBERS="$( groupmembers )"

# do it for every USER
for USER in $GROUPMEMBERS; do {
	HOMEPATH="$HOMEBASEDIR/$USER/wirt"
	[ -e "$HOMEPATH" ] && {
		[ -e "$HOMEPATH/logs" ] || {
			mkdir -p "$HOMEPATH/logs"
		}
		[ -e "$HOMEPATH/info" ] || {
			mkdir -p "$HOMEPATH/info"
		}
		
		# loop through all the folders in the service/vm
		for ENTITY in $HOMEPATH/service/vm/*; do {
			SLASHCOUNT="$( grep -o '/' <<<$HOMEPATH | wc -l )"
			
			# sanitze input against hack0rs -- abort if nasty string
			[ "$( sanitize "$ENTITY" )" -ge 1 ] && {
				log "'$ENTITY' is not a valid entity name"
				mail "root $USER" "$ENTITY" "is not a valid entity name"
				curdate="$( date +%d_%h_%y_%H.%M )"
			#	mv $ENTITY "$HOMEPATH/history/ERRORENTITY-$curdate"
				exit 1
			}
			
			# construct $ENTITYNAME ???
			ENTITYNAME="$( echo $ENTITY | cut -d '/' -f $( expr $SLASHCOUNT + 2) )"
						
			# Do the actual commands
					
			# first, let's dump the status of the vm
			$( compose_virsh_cmd $ENTITYNAME "status" $USER "" $HOMEPATH )
					
			# loop through each `dom-*` folder, trying to parse files to commands
			FILELIST="$( ls -rt $ENTITY | sed 's/  / /g' )"
			for FILE in $FILELIST; do {
				[ "$( sanitize $FILE )" -ge 1 ] && {
																	log "'$FILE' is not a valid file name"
																	mail "root $USER" "$FILE" "is not a valid file name"
					curdate="$( date +%d_%h_%y_%H.%M )"
					mv "$ENTITY/$FILE" "$HOMEPATH/history/ERRORFILE-$curdate"
																	exit 1
																}
				[ "$( wc -l < $ENTITY/$FILE )" -gt 1 ] && {
					log "not a valid virsh command line, too many lines"
					curdate="$( date +%d_%h_%y_%H.%M )"
					mv "$ENTITY/$FILE" "$HOMEPATH/history/ERRORFILE-$curdate"
					exit 1
				}
				CONTENT="$( cat $ENTITY/$FILE )"
				[ "$( sanitize "$CONTENT" )" -ge 1 ] && {
					log "not a valid virsh command line"
	                                mail "root $USER" "CONTENT" "is not a valid virsh command line"
					curdate="$( date +%d_%h_%y_%H.%M )"
					mv "$ENTITY/$FILE" "$HOMEPATH/history/ERRORFILE-$curdate"
                    			        exit 1
	                        }
				[ -z "$CONTENT" ] && CONTENT="EMPTY"
						
				# run the command parsed from user file
				VIRSH_CMD="$( compose_virsh_cmd $ENTITYNAME $FILE $USER "$CONTENT" $HOMEPATH )"
			} done
		} done
	}
} done
