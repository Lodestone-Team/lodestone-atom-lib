import * as Atom from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-atom-lib/main/mod.ts";

import { EventStream } from "https://raw.githubusercontent.com/Lodestone-Team/lodestone-macro-lib/main/events.ts";

export default class TestInstance extends Atom.AtomInstance {
    uuid!: string;
    _state: Atom.InstanceState = "Stopped";
    event_stream!: EventStream;
    public async setupManifest(): Promise<Atom.SetupManifest> {
        return {
            setting_sections: {
                "test": {
                    section_id: "section_id1",
                    name: "section_name1",
                    description: "section_description1",
                    settings: {
                        "setting_id1": {
                            setting_id: "setting_id1",
                            name: "setting_name1",
                            description: "setting_description1",
                            value: null,
                            value_type: { type: "String", regex: null },
                            default_value: null,
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
        this.event_stream = new EventStream(this.uuid, "test_im_in_ts");
        return;
    }
    public async restore(dotLodestoneConfig: Atom.DotLodestoneConfig, path: string): Promise<void> {
        this.uuid = dotLodestoneConfig.uuid;
        this.event_stream = new EventStream(this.uuid, "test_im_in_ts");
        return;
    }
    public async start(caused_by: Atom.CausedBy, block: boolean): Promise<void> {
        console.log("start");
        this.event_stream.emitStateChange("Running");
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
        return "Stopped"
    }
    public sendCommand(command: string, caused_by: Atom.CausedBy): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public monitor(): Promise<Atom.PerformanceReport> {
        throw new Error("Method not implemented.");
    }
    public configurableManifest(): Promise<Atom.ConfigurableManifest> {
        throw new Error("Method not implemented.");
    }
    public async name(): Promise<string> {
        return "test_im_in_ts";
    }
    public version(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    public game(): Promise<Atom.Game> {
        throw new Error("Method not implemented.");
    }
    public description(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    public port(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    public getAutoStart(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public getRestartOnCrash(): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    public setName(name: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public setDescription(description: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    public setPort(port: number): Promise<void> {
        throw new Error("Method not implemented.");
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
