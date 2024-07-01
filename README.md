# botw-save-editor
BotW Save Editor

### Download

You can download [BotwSaveEditor.nro](https://github.com/savage13/botw-save-editor/releases/download/v0.1.5/BotwSaveEditor.nro) (v0.1.5) directly or from [Releases](https://github.com/savage13/botw-save-editor/releases)

Place `BotwSaveEditor.nro` in your `switch` folder on your Switch.
You can do this using ftpd or similar program

### Building

You probably do not want this option unless you are adding new features or debugging

You will need devkitA64 installed [instructions here](https://devkitpro.org/wiki/Getting_Started)

    npm install
    npm run nro
    nxlink --address 10.0.0.1 BotwSaveEditor.nro

### Development

    python -m http.server

This will run a web server that can simulate running the program on the switch. It expects a collection of data to be at `save_data` with subdirectories from 0 to 7 that include `caption.sav`, `game_data.sav`, and `caption.jpg`.  While developing is best to run

    npm run build

This command will use esbuild to watch and rebuild the javascript on changes.

### License

BSD 2-Clause 
