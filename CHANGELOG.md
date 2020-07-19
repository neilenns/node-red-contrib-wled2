# Changelog

## v2.1.0 - 2020-07-19

- Address a low-priority security vulnerability in a 3rd party libary. Resolves [issue 59](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/59).
- Add a Connecting and Error state that shows under the node. Resolves [issue 53](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/53).

## v2.0.0 - 2020-07-06

### Breaking changes

- Toggling the lights on/off based on current LED state is now supported. This is done with the new `state` property which replaces the `on` property.
  Valid values are `on`, `off`, and `toggle`. The `delay` feature is supported for toggling as well and will correctly play the effect for the specified
  duration before toggling the light state. Resolves [issue 52](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/52).

## v1.4.0 - 2020-07-05

- All logged warnings now report through NodeRed logging systems instead of console logs. Resolves [issue 40](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/40).
- Corrected the name of the node in package.json. Resolves [issue 42](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/42).
- Disconnected state shows correctly now. Resolves [issue 41](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/41).

## v1.3.1 - 2020-07-04

- Clean up an error when retrieving effects and palettes. Resolves [issue 35](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/35).
- Clean up an unnecessary error when the node is first created. Resolves [issue 37](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/37).

## v1.3.0 - 2020-07-04

- Effects and palettes are now properly loaded from the devices, with fallback to defaults. Resolves [issue 33](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/33).
- Miscellaneous auto-discovery improvements. Resolves [issue 29](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/23) and [issue 30](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/23).

## v1.2.1 - 2020-07-03

- Auto-discovery now works for NodeRed installs hosted inside Home Assistant. Resolves [issue 27](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/23).

## v1.2.0 - 2020-07-03

- Auto-discovery of WLED devices is now supported. Resolves [issue 23](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/23).
- Node name now shows in italics if set to a custom name. Resolves [issue 20](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/20).

## v1.1.0 - 2020-07-02

- Delay field is now validated to confirm it is a number. Resolves [issue 15](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/16).
- A default list of effects and palettes is shown when retrieving the lists from a WLED
  device fails. Resolves
  [issue 16](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/16).
