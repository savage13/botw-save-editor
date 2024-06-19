# botw-save-editor
BotW Save Editor

### Download

You can get a release from the Releases page

### Building

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
