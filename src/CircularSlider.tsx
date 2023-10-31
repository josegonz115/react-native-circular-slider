import { ReactNode, useEffect, useRef } from "react";
import { PanResponder, PanResponderInstance, View } from "react-native";
import Svg, {
  Circle,
  G,
  LinearGradient,
  Path,
  Defs,
  Stop,
} from "react-native-svg";
import range from "lodash.range";
import { ClockFace } from "./ClockFace";
import { calculateArcCircle, calculateArcColor, getGradientId } from "./utils";

export type CircularSliderProps = {
  /** When slider is moved, this callback is triggered with new values of startAngle and angleLength */
  onUpdate: (value: { startAngle: number; angleLength: number }) => void;
  /** Angle, where slider starts (from 0 to 2 * Math.PI) */
  startAngle: number;
  /** Length of the slider (from 0 to 2 * Math.PI) */
  angleLength: number;
  /** SVG doesn't support canonical gradients, so it's imitated by using multiple linear gradients across the slider. In most cases 5 should be fine. */
  segments?: number;
  /** Width of the slider */
  strokeWidth?: number;
  /** Radius of the slider */
  radius?: number;
  /** Initial gradient color */
  gradientColorFrom?: string;
  /** Final gradient color */
  gradientColorTo?: string;
  /** If component should show clock face */
  showClockFace?: boolean;
  /** Color of the clock face */
  clockFaceColor?: string;
  /** Color of the background circle */
  bgCircleColor?: string;
  /** Icon at the end of the slider (SVG Path) */
  stopIcon?: ReactNode;
  /** Icon at the start of the slider (SVG Path) */
  startIcon?: ReactNode;
};

export const CircularSlider = ({
  startAngle,
  angleLength,
  segments = 5,
  strokeWidth = 40,
  radius = 145,
  gradientColorFrom = "#ff9800",
  gradientColorTo = "#ffcf00",
  clockFaceColor = "#9d9d9d",
  bgCircleColor = "#171717",
  showClockFace,
  startIcon,
  stopIcon,
  onUpdate,
}: CircularSliderProps) => {
  const _circle = useRef<Svg>(null!);
  const _sleepPanResponder = useRef<PanResponderInstance>(null!);
  const _wakePanResponder = useRef<PanResponderInstance>(null!);
  const circleCenter = useRef({ circleCenterX: 0, circleCenterY: 0 });

  const startAngleRef = useRef(startAngle);
  const angleLengthRef = useRef(angleLength);

  useEffect(() => {
    startAngleRef.current = startAngle;
    angleLengthRef.current = angleLength;
  }, [startAngle, angleLength]);

  if (!_sleepPanResponder.current) {
    _sleepPanResponder.current = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => setCircleCenter(),
      onPanResponderMove: (_, { moveX, moveY }) => {
        const currentAngleStop =
          (startAngleRef.current + angleLengthRef.current) % (2 * Math.PI);
        let newAngle =
          Math.atan2(
            moveY - circleCenter.current.circleCenterY,
            moveX - circleCenter.current.circleCenterX,
          ) +
          Math.PI / 2;

        if (newAngle < 0) {
          newAngle += 2 * Math.PI;
        }

        let newAngleLength = currentAngleStop - newAngle;

        if (newAngleLength < 0) {
          newAngleLength += 2 * Math.PI;
        }

        onUpdate({
          startAngle: newAngle,
          angleLength: newAngleLength % (2 * Math.PI),
        });
      },
    });
  }

  if (!_wakePanResponder.current) {
    _wakePanResponder.current = PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => setCircleCenter(),
      onPanResponderMove: (_, { moveX, moveY }) => {
        let newAngle =
          Math.atan2(
            moveY - circleCenter.current.circleCenterY,
            moveX - circleCenter.current.circleCenterX,
          ) +
          Math.PI / 2;
        let newAngleLength = (newAngle - startAngleRef.current) % (2 * Math.PI);

        if (newAngleLength < 0) {
          newAngleLength += 2 * Math.PI;
        }

        onUpdate({
          startAngle: startAngleRef.current,
          angleLength: newAngleLength,
        });
      },
    });
  }

  const getContainerWidth = () => {
    return strokeWidth + radius * 2 + 2;
  };

  const setCircleCenter = () => {
    _circle.current.measure((_x, _y, _w, _h, px, py) => {
      const halfOfContainer = getContainerWidth() / 2;
      circleCenter.current = {
        circleCenterX: px + halfOfContainer,
        circleCenterY: py + halfOfContainer,
      };
    });
  };

  const containerWidth = getContainerWidth();

  const start = calculateArcCircle(
    0,
    segments,
    radius,
    startAngle,
    angleLength,
  );
  const stop = calculateArcCircle(
    segments - 1,
    segments,
    radius,
    startAngle,
    angleLength,
  );

  return (
    <View
      style={{ width: containerWidth, height: containerWidth }}
      onLayout={setCircleCenter}
    >
      <Svg height={containerWidth} width={containerWidth} ref={_circle}>
        <Defs>
          {range(segments).map((i) => {
            const { fromX, fromY, toX, toY } = calculateArcCircle(
              i,
              segments,
              radius,
              startAngle,
              angleLength,
            );
            const { fromColor, toColor } = calculateArcColor(
              i,
              segments,
              gradientColorFrom,
              gradientColorTo,
            );
            return (
              <LinearGradient
                key={i}
                id={getGradientId(i)}
                x1={fromX.toFixed(2)}
                y1={fromY.toFixed(2)}
                x2={toX.toFixed(2)}
                y2={toY.toFixed(2)}
              >
                <Stop offset="0%" stopColor={fromColor} />
                <Stop offset="1" stopColor={toColor} />
              </LinearGradient>
            );
          })}
        </Defs>

        <G
          translate={`${strokeWidth / 2 + radius + 1}, ${
            strokeWidth / 2 + radius + 1
          }`}
        >
          <Circle
            r={radius}
            strokeWidth={strokeWidth}
            fill="transparent"
            stroke={bgCircleColor}
          />
          {showClockFace && (
            <ClockFace r={radius - strokeWidth / 2} stroke={clockFaceColor} />
          )}
          {range(segments).map((i) => {
            const { fromX, fromY, toX, toY } = calculateArcCircle(
              i,
              segments,
              radius,
              startAngle,
              angleLength,
            );
            const d = `M ${fromX.toFixed(2)} ${fromY.toFixed(
              2,
            )} A ${radius} ${radius} 0 0 1 ${toX.toFixed(2)} ${toY.toFixed(2)}`;

            return (
              <Path
                d={d}
                key={i}
                strokeWidth={strokeWidth}
                stroke={`url(#${getGradientId(i)})`}
                fill="transparent"
              />
            );
          })}

          <G
            fill={gradientColorTo}
            translate={`${stop.toX}, ${stop.toY}`}
            onPressIn={() =>
              onUpdate({
                startAngle: startAngleRef.current,
                angleLength: angleLength + Math.PI / 2,
              })
            }
            {..._wakePanResponder.current.panHandlers}
          >
            <Circle
              r={(strokeWidth - 1) / 2}
              fill={bgCircleColor}
              stroke={gradientColorTo}
              strokeWidth="1"
            />
            {stopIcon}
          </G>

          <G
            fill={gradientColorFrom}
            translate={`${start.fromX}, ${start.fromY}`}
            onPressIn={() =>
              onUpdate({
                startAngle: startAngle - Math.PI / 2,
                angleLength: angleLength + Math.PI / 2,
              })
            }
            {..._sleepPanResponder.current.panHandlers}
          >
            <Circle
              r={(strokeWidth - 1) / 2}
              fill={bgCircleColor}
              stroke={gradientColorFrom}
              strokeWidth="1"
            />
            {startIcon}
          </G>
        </G>
      </Svg>
    </View>
  );
};
