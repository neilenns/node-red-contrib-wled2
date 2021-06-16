# Changelog

## v2.4.4 - 2021-06-16

- Address a security vulnerabilities in dependencies. Resolves [issue 102](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/102) and
  [issue 103](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/103).

## v2.4.3 - 2021-05-30

- Address a security vulnerability in a dependency. Resolves [issue 94](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/97).

## v2.4.2 - 2021-04-01

- Address a security vulnerability in a dependency. Resolves [issue 94](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/97).

## v2.4.1 - 2020-12-15

- Address a minor security vulnerability in a dependency. Resolves [issue 90](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/90).

## v2.4.0 - 2020-12-12

- Presets up to 65535 are now supported. Resolves [issue 87](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/87).

## v2.3.0 - 2020-11-14

- Presets can now be selected by passing `preset` as part of the payload or by picking the preset number from the dropdown
  in the node UI. Resolves [issue 81](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/81).

## v2.2.0 - 2020-10-18

- Segments can now be set by passing in `seg` as part of the payload following the JSON format described in the [WLED JSON API documentation](https://github.com/Aircoookie/WLED/wiki/JSON-API#setting-new-values) for segments. Resolves [issue 61](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/61).
- Incoming messages without a payload no longer cause an unhandled exception. Resolves [issue 73](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/73).

## v2.1.4 - 2020-10-18

- Adjust how messages are sent to WLED so all segments are affected instead of just the first. Thanks to [Daniel Evans](https://github.com/daredoes)
  for the bug fix. Resolves [issue 72](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/72).

## v2.1.3 - 2020-09-12

- Address a security vulnerability in an underlying package used by the node. Resolves [issue 68](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/68).

## v2.1.2 - 2020-08-12

- Brightness works now. Resolves [issue 64](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/59).

## v2.1.1 - 2020-08-04

- The off and toggle states can now be set correctly on the node. Resolves [issue 62](https://github.com/danecreekphotography/node-red-contrib-wled2/issues/59).

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
