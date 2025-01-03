
## How to build typescript application and create wheel package

1. Checkout repository
2. Start devcontainer
3. Run `python3 build.py`
4. Application can be found in folder `static`
5. Wheel package can be found in folder `dist`


## How to start webpage in development mode

1. start devcontainer
2. create file `.env` in project folder and add all variables defined in `./src/environment.d.ts`
  * `HA_URL`: Is mandatory and the address to home assistant server e.g. `http://homeassistant.local:8123`
  * `LONG_LIVED_TOKEN`: Is optional and avoids login prompt
3. Run `npx vite dev` in devcontainer
