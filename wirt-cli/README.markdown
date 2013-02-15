# wirt-cli


> :warning:  Work in progress!  :warning:


cli client for `virsh-wrapper`, written in javascript.

- <http://nodejs.org>
- <http://flatironjs.org>

## Usage

```
$ node wirt.js
help:    This is wirt!
help:    
help:    Commands:
help:      create   - creates a machine
help:      status   - status of a machine
help:      start    - starts a machine
help:      stop     - stop a machine (ACPI)
help:      kill     - immediately a machine
help:    
help:    Options:
help:      --machine, --vm  name of a machine.  [string]
```

Example:

```
$ node wirt.js --vm mybox create
info:    creating machine: mybox
info:    ok! machine=mybox, action=create
$ node wirt.js --vm mybox start
info:    writing command: start
info:    ok! machine=mybox, command=start
$ node wirt.js --vm mybox kill
info:    writing command: destroy
info:    ok! machine=mybox, command=destroy
```


## License

[MIT](http://opensource.org/licenses/MIT)