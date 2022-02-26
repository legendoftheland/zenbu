const fs = require("fs");
const path = require("path");

const commandFiles = fs
        .readdirSync(`./commands`)
        .map((file) => path.join("./commands", file))
        .filter((file) => fs.lstatSync(file).isDirectory())
        .map((dir) => fs
            .readdirSync(dir)
            .filter((file) => file.endsWith(".js"))
            .map((file) => path.join(dir, file))
    );
    console.log(commandFiles)

    class commandOptionClass {
        constructor(optionName, optionDesc, optionRequired) {
            this.optionName = optionName;
            this.optionDesc = optionDesc;
            this.optionRequired = optionRequired
        }
    }
    class commandClass {
        constructor(name, desc, options) {
            this.name = name;
            this.desc = desc;
            this.options = options;
        }
    }

    let commandArray = [];
    let commandOptionsArray = [];
    for (const filecol of commandFiles) {
        for (const name of filecol) {
            const command = require(`../${name}`);
            for (let i = 0; i < command.data.options.length; i++) {
                commandOptionsArray.push(new commandOptionClass(command.data.options[i].name, command.data.options[i].description, command.data.options[i].required))
            }
            commandArray.push(new commandClass(command.data.name, command.data.description, commandOptionsArray));
            console.log(`Registered ${name} for /help.`);
        }
    }

    commandArray.sort((a, b) => a.name.localeCompare(b.name))

module.exports = commandArray;