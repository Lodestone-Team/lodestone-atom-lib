import * as Atom from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-atom-lib/main/mod.ts";

import { EventStream } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";
interface RestoreConfig {
    name: string;
    description: string;
    port: number;
}
export default class TestInstance extends Atom.AtomInstance {
    uuid!: string;
    _state: Atom.InstanceState = "Stopped";
    path!: string;
    event_stream!: EventStream;
    config!: RestoreConfig;
    static restoreConfigName = "restore.json";
    public async setupManifest(): Promise<Atom.SetupManifest> {
        return {
            setting_sections: {
                "section_id1": {
                    section_id: "section_id1",
                    name: "section_name1",
                    description: "section_description1",
                    settings: {
                        "setting_id1": {
                            setting_id: "setting_id1",
                            name: "Port",
                            description: "Port to run the server on",
                            value: null,
                            value_type: { type: "UnsignedInteger", min: 0, max: 65535 },
                            default_value: { type: "UnsignedInteger", value: 6969 },
                            is_secret: false,
                            is_required: true,
                            is_mutable: true,
                        }
                    },
                }
            }
        };
    }
    public async setup(setupValue: Atom.SetupValue, dotLodestoneConfig: Atom.DotLodestoneConfig, path: string): Promise<void> {
        this.uuid = dotLodestoneConfig.uuid;
        let port: number;
        if (setupValue.setting_sections["section_id1"].settings["setting_id1"].value?.type == "UnsignedInteger") {
            port = setupValue.setting_sections["section_id1"].settings["setting_id1"].value.value;
        } else {
            throw new Error("Invalid value type");
        }
        this.config = {
            name: setupValue.name,
            description: setupValue.description ?? "",
            port: port,
        };

        // write config to file
        await Deno.writeTextFile(path + "/" + TestInstance.restoreConfigName, JSON.stringify(this.config));

        this.event_stream = new EventStream(this.uuid, this.config.name);

        this.event_stream.instanceCreationProgression(100, async (p) => {
            for (let i = 0; i < 100; i++) {
                await new Promise(r => setTimeout(r, 100));
                p.update(1, `Progress: ${i}%`);
            }
        });

        return;
    }
    public async restore(dotLodestoneConfig: Atom.DotLodestoneConfig, path: string): Promise<void> {
        this.uuid = dotLodestoneConfig.uuid;
        this.config = JSON.parse(await Deno.readTextFile(path + "/" + TestInstance.restoreConfigName)) as RestoreConfig;
        this.event_stream = new EventStream(this.uuid, this.config.name);
        return;
    }
    public async start(caused_by: Atom.CausedBy, block: boolean): Promise<void> {
        console.log("start");
        this.event_stream.emitStateChange("Running");
        this._state = "Running";
        (async () => {
            while (this._state == "Running") {
                await new Promise(r => setTimeout(r, 1000));
                this.event_stream.emitConsoleOut("Output");
            }
        })();
        return;
    }
    public async stop(caused_by: Atom.CausedBy, block: boolean): Promise<void> {
        console.log("stop");
        this._state = "Stopped";
        this.event_stream.emitStateChange("Stopped");
        return;
    }
    public restart(caused_by: Atom.CausedBy, block: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public kill(caused_by: Atom.CausedBy): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public async state(): Promise<Atom.InstanceState> {
        return this._state;
    }
    public async sendCommand(command: string, caused_by: Atom.CausedBy): Promise<void> {
        this.event_stream.emitConsoleOut(`Got command: ${command}`);
    }
    public monitor(): Promise<Atom.PerformanceReport> {
        throw new Error("Method not implemented.");
    }
    public async configurableManifest(): Promise<Atom.ConfigurableManifest> {
        return {
            auto_start: false,
            restart_on_crash: false,
            setting_sections: {
                "section_id1": {
                    section_id: "section_id1",
                    name: "First Section",
                    description: "This is the first section",
                    settings: {
                        "setting_id1": {
                            setting_id: "setting_id1",
                            name: "Port",
                            description: "Port to run the server on",
                            value: { type: "UnsignedInteger", value: this.config.port },
                            value_type: { type: "UnsignedInteger", min: 0, max: 65535 },
                            default_value: { type: "UnsignedInteger", value: 6969 },
                            is_secret: false,
                            is_required: true,
                            is_mutable: true,
                        }
                    },
                }
            }
        }
    }
    public async name(): Promise<string> {
        return this.config.name;
    }
    public version(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    public game(): Promise<Atom.Game> {
        throw new Error("Method not implemented.");
    }
    public async description(): Promise<string> {
        return this.config.description;
    }
    public async port(): Promise<number> {
        return this.config.port;
    }
    public getAutoStart(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public getRestartOnCrash(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public async setName(name: string): Promise<void> {
        this.config.name = name;
    }
    public async setDescription(description: string): Promise<void> {
        this.config.description = description;
    }
    public async setPort(port: number): Promise<void> {
        this.config.port = port;
    }
    public setAutoStart(auto_start: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public setRestartOnCrash(restart_on_crash: boolean): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public playerCount(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public maxPlayerCount(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public playerList(): Promise<Atom.GenericPlayer[]> {
        throw new Error("Method not implemented.");
    }
    public updateConfigurable(section_id: string, setting_id: string, value: Atom.ConfigurableValue): Promise<void> {
        throw new Error("Method not implemented.");
    }
}
