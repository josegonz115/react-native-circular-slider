[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()
[![Version](https://img.shields.io/npm/v/react-native-circular-slider.svg)](https://www.npmjs.com/package/react-native-circular-slider)

# @v3ron/react-native-circular-slider

This is a fork of [react-native-circular-slider](https://github.com/bartgryszko/react-native-circular-slider) by [Bartosz Gryszko](
https://github.com/bartgryszko) meant to improve the original library.

Feel free to suggest more changes in the issues section of the repository.

## Usage

1. Install the package and its peer dependency:

```bash
yarn add @v3ron/react-native-circular-slider react-native-svg
```

2. Import the component:

```javascript
import { CircularSlider} from '@v3ron/react-native-circular-slider';
```

3. Render the component:

```javascript
<CircularSlider
  startAngle={startAngle}
  angleLength={angleLength}
  onUpdate={({ startAngle, angleLength }) => setState({ startAngle, angleLength })}
/>
```

## Author

**Original author:** Bartosz Gryszko (b@gryszko.com)\
**Forked and maintained by:** Szymon Chmal (szymon@chmal.it)

## License

MIT
