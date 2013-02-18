# wirt-cli


> :warning:  Work in progress!  :warning:


cli client for `virsh-wrapper`, written in javascript.

- <http://nodejs.org>
- <http://flatironjs.org>

## Usage

### Synopsis

```shell
$ node wirt.js
help:    This is wirt!
help:    
help:    Commands:
help:      create   - creates a machine
help:      status   - status of a machine
help:      start    - starts a machine
help:      stop     - stop a machine (ACPI)
help:      kill     - immediately kill a machine
help:    
help:    Options:
help:      --machine, --vm  name of a machine.  [string]
```

### Example

```shell
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

### Configuration

All parameters can be set, in the following order:

- the global config in `/install/path/config.json` (json file)
- the user config in `~/.wirt.json` (json file)
- as an environment variable, ie. `$ export vm=mynode; wirt`
- as a command line flag, ie. `$ wirt --vm mynode`

Example user config:

```js
{
  "machine": "mymachine"
}

```

This would be useful if you just have 1 machine.  
If you have more than 1 machine, you can still set the default and override it with a command line argument.

### Manual Installation

    cd ~ 
    git clone git://github.com/weimarnetz/virsh-wrapper.git .wirt
    cd .wirt/wirt-cli
    git checkout -b wirt-cli origin/wirt-cli
    npm install
    echo '' >> ~/.bashrc
    echo 'export alias wirt=~/.wirt/wirt-cli/wirt.js' >> ~/.bashrc

## License

[MIT](http://opensource.org/licenses/MIT)