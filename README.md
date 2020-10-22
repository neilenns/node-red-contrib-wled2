# node-red-contrib-wled2

A node for controlling WLED devices from NodeRed. The node supports a single segment, and can control the effect (including speed and intensity), palette,
color, and brightness level of the segment.

Additionally a delay can be specified. This causes the LEDs to run the selected effect until the delay expires, then switch to a solid on (or off) state.
This is handy for running an effect briefly before turning on to a solid color (or turning off).

The various parameters for the LEDs can also be provided by the incoming payload via a JSON object. Supported JSON properties are:

| Property          | Description                                                                                                                                                                                            | Type     | Example         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | --------------- |
| `brightness`      | The brightness for the LEDs. Supported range is 1 to 255.                                                                                                                                              | number   | `128`           |
| `color1`          | An RGB array of the first effect color.                                                                                                                                                                | number[] | `[255, 128, 4]` |
| `color2`          | An RGB array of the second effect color.                                                                                                                                                               | number[] | `[128, 255, 4]` |
| `color3`          | An RGB array of the third effect color.                                                                                                                                                                | number[] | `[4, 128, 128]` |
| `effect`          | The exact name, or number, for the effect. [See GitHub for the valid numbers](https://github.com/Aircoookie/WLED/blob/e57d5d86f3416a3c07587739f7e85cb6d09eb15b/wled00/FX.h#L103).                                      | number   | `5`             |
| `effectIntensity` | The intensity of the effect. Supported range is 0 to 255.                                                                                                                                              | number   | `128`           |
| `effectSpeed`     | The speed of the effect. Supported range is 0 to 255.                                                                                                                                                  | number   | `128`           |
| `delay`           | Number of seconds to wait before switching to the Solid effect.                                                                                                                                        | number   | `5`             |
| `palette`         | The number for the palette.                                                                                                                                                                            | number   | `5`             |
| `seg`             | The segment or array of segments to configure. See the [WLED JSON API documentation](https://github.com/Aircoookie/WLED/wiki/JSON-API#setting-new-values) for information on the supported properties. | object   |                 |
| `state`           | The state to set the LEDs to. Supported values are `on`, `off`, and `toggle`.                                                                                                                          | string   | `toggle`        |
